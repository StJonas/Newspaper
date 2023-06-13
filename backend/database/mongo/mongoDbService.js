import {env} from "../../env/envConfig.js";
import {MongoClient, ObjectId} from "mongodb";
import {importMongoDbData} from "./importMongoDbData.js";

class MongoDbService {
  constructor() {
    this.client = new MongoClient(`mongodb://${env.MONGODB_USERNAME}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}:${env.MONGODB_PORT}`);
    this.database = this.client.db(env.MONGODB_DATABASE);
    this.client.connect();
  }

  async importData() {
    try {
      //await this.client.connect();
      await importMongoDbData(this.database);
      return {message: "Data imported successfully"};
    } catch (error) {
      console.error("Error importing data: " + error);
      throw error;
    }
    finally {
      //await this.client.close();
    }
  }

  async getLatestArticles() {
   // await this.client.connect();
    try {
        const articles = await this.database
        .collection("article")
        .find({})
        .toArray();
  
      const updatedArticles = articles.map(article => ({
        ...article,
        article_id: article._id.toString() // Convert ObjectId to string
      }));
  
      return updatedArticles;
    } catch (error) {
      console.error("Error retrieving articles:", error);
      throw error;
    }
    finally
    {
      //await this.client.close();
    }
  }

  async insertArticle(title, subtitle, article_content, journalist_id) {
    try {
        console.log("journalist: ",journalist_id);
      const journalist = await this.database.collection("journalist").findOne({
        "user._id": new ObjectId(journalist_id), //todo journalist_id nehmen
      });
      console.log("journalist: ",journalist_id);

      const article = {
        title: title,
        subtitle: subtitle,
        article_content: article_content,
        journalist: {
          _id: journalist._id,
          first_name: journalist.first_name,
          last_name: journalist.last_name,
        },
        publish_time: new Date(),
        categories: [],
        comments: [],
      };

      const result = await this.database
        .collection("article")
        .insertOne(article);

      return result.insertedId;
    } catch (error) {
      console.error("Error inserting article:", error);
      throw error;
    }
  }

  async updateArticle(articleId, title, subtitle, article_content) {
    try {
      const update = {
        $set: {
          title: title,
          subtitle: subtitle,
          article_content: article_content,
        },
      };

      const result = await this.database
        .collection("article")
        .updateOne({ _id: new ObjectId(articleId) }, update);

      return result.modifiedCount;
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  }

  async deleteArticle(articleId) {
    try {
      const result = await this.database.collection("article").deleteOne({
        _id: new ObjectId(articleId),
      });
  
      return result.deletedCount;
    } catch (error) {
      console.error("Error deleting article:", error);
      throw error;
    }
  }

async getUsers() {
    try {
        const users = await this.database
        .collection("user")
        .find({})
        .project({ _id: 1, username: 1 })
        .toArray();

        const journalistUserIds = await this.database
            .collection("journalist")
            .distinct("user._id");

        const updatedUsers = users.map(({ _id, ...user }) => {
            const isJournalist = journalistUserIds.some(journalistId => journalistId.toString() === _id.toString());
            return {
                ...user,
                user_id: _id,
                isJournalist,
            };
            });
        return updatedUsers;
    } catch (error) {
        console.error("Error retrieving users:", error);
        throw error;
    }
}

async getCommentsOfArticle(articleId) {
    try {
      const article = await this.database.collection("article").findOne({
        _id: new ObjectId(articleId)
      });
  
      if (!article) {
        throw new Error("Article not found");
      }
  
      const comments = article.comments || [];
  
      const commentList = comments.map((comment) => ({
        article_id: articleId,
        comment_id: comment._id,
        user_id: comment.user._id,
        username: comment.user.username,
        comment_time: comment.comment_time,
        comment_content: comment.comment_content
      }));
  
      return commentList;
    } catch (error) {
      console.error("Error retrieving comments:", error);
      throw error;
    }
  }

async insertComment(article_id, user_id, comment_content) {
    try {
      if (!article_id || !user_id || !comment_content) {
        throw new Error("Invalid input: input cannot be null or empty");
      }

      const user = await this.database
            .collection("user")
            .findOne({_id: new ObjectId("64876ff5aa899efc04a3d812")});
  
      const newComment = {
        user: {
          _id: new ObjectId(user._id),
          username: user.username 
        },
        comment_content: comment_content,
        comment_time: new Date()
      };
  
      const articleFilter = { _id: new ObjectId(article_id) };
      const update = { $push: { comments: newComment } };
  
      const result = await this.database.collection("article").updateOne(articleFilter, update);
  
      if (result.modifiedCount === 1) {
        return {
          message: 'Comment created successfully',
          comment: newComment
        };
      } else {
        throw new Error('Failed to insert comment');
      }
  
    } catch (error) {
      console.error("Error inserting comment:", error);
      throw error;
    }
  }

  async getArticleReport() {
    return[];
  }
  
  

  async getCategoryReport() {
    return [];
  }
}

export default MongoDbService;
