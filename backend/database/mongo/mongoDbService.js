import { env } from "../../env/envConfig.js";
import { MongoClient } from "mongodb";

class MongoDbService {
  constructor() {
    const url = `mongodb://${env.MONGODB_USERNAME}:${env.MONGODB_PASSWORD}@${env.MONGODB_HOST}:${env.MONGODB_PORT}`;
    this.client = new MongoClient(url);

    // Access the database
    this.database = this.client.db(env.MONGODB_DATABASE);
  }

  async importData() {}

  async getLatestArticles() {
    this.client.connect();
    console.log("i was here");
    try {
      const articles = await this.database
        .collection("article")
        .find({})
        .toArray();
      this.client.close();
      return articles;
    } catch (error) {
      this.client.close();
      console.error("Error retrieving articles:", error);
      throw error;
    }
  }

  async insertArticle(title, subtitle, article_content, journalist_id) {
    try {
      const journalist = await this.database.collection("journalist").findOne({
        _id: journalistId,
      });

      const article = {
        title: title,
        subtitle: subtitle,
        article_content: article_content,
        journalist: journalist,
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

      const result = await db
        .collection("article")
        .updateOne({ _id: ObjectId(articleId) }, update);

      return result.modifiedCount;
    } catch (error) {
      console.error("Error updating article:", error);
      throw error;
    }
  }

  async getUsers() {}

  async getCommentsOfArticle(articleId) {}

  async insertComment(article_id, user_id, comment_content) {}

  async getArticleReport() {}

  async getCategoryReport() {}
}

export default MongoDbService;
