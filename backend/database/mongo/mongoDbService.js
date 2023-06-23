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
            await importMongoDbData(this.database);
            return {message: "Data imported successfully"};
        } catch (error) {
            console.error("Error importing data: " + error);
            throw error;
        }
    }

    async getLatestArticles() {
        try {
            const articles = await this.database
                .collection("article")
                .find({})
                .sort({publish_time: -1})
                .limit(50)
                .toArray();

            const updatedArticles = articles.map(article => ({
                ...article,
                article_id: article._id.toString() 
            }));

            return updatedArticles;
        } catch (error) {
            console.error("Error retrieving articles:", error);
            throw error;
        }
    }

    async insertArticle(title, subtitle, article_content, user_id) {
        try {
            const journalist = await this.database.collection("journalist").findOne({
                "user._id": new ObjectId(user_id), 
            });
            
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
                .updateOne({_id: new ObjectId(articleId)}, update);

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
                .project({_id: 1, username: 1})
                .toArray();

            const journalistUserIds = await this.database
                .collection("journalist")
                .distinct("user._id");

            var updatedUsers = users.map(({_id, ...user}) => {
                const isJournalist = journalistUserIds.some(journalistId => journalistId.toString() === _id.toString());
                return {
                    ...user,
                    user_id: _id,
                    isJournalist: isJournalist ? 1 : 0, 
                };
            });

            updatedUsers.sort((a, b) => {
                if (a.isJournalist && !b.isJournalist) {
                    return -1; // a is journalist, b is not, so a comes first
                } else if (!a.isJournalist && b.isJournalist) {
                    return 1; // b is journalist, a is not, so b comes first
                } else {
                    return a.username.localeCompare(b.username); // both are either journalists or non-journalists, order by username
                }
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
                _id: new ObjectId(articleId),
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
                .findOne({_id: new ObjectId(user_id)});

            const newComment = {
                user: {
                    _id: new ObjectId(user._id),
                    username: user.username
                },
                comment_content: comment_content,
                comment_time: new Date()
            };

            const articleFilter = {_id: new ObjectId(article_id)};
            const update = {$push: {comments: newComment}};

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

    async getJournalistReport() {
        try {
            const oneYearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
            const mostActiveJournalists = await this.database.collection("article").aggregate([
                {
                    $match: {
                        publish_time: { $gte: oneYearAgo }
                    }
                },
                {
                    $sort: {
                        publish_time: -1
                    }
                },
                {
                    $group: {
                        _id: "$journalist._id",
                        first_name: { $first: "$journalist.first_name" },
                        last_name: { $first: "$journalist.last_name" },
                        articles: { $push: "$$ROOT" },
                        publishedArticles: { $sum: 1 },
                        recentArticleTitle: { $first: "$title" }
                    }
                },
                {
                    $project: {
                        journalist_id: "$_id",
                        fullName: {
                            $concat: [
                                "$last_name",
                                " ",
                                "$first_name"
                            ]
                        },
                        publishedArticles: 1,
                        recentArticleTitle: 1
                    }
                },
                {
                    $sort: {
                        publishedArticles: -1,
                        fullName: 1
                    }
                },
                {
                    $limit: 10
                }
            ]).toArray();

            return mostActiveJournalists;

        } catch (error) {
            console.error('Error retrieving article report:', error);
            throw error;
        }
    }

    async getCategoryReport() {
        try {
            const result = await this.database.collection('article').aggregate([
                {
                    $unwind: "$categories"
                },
                {
                    $group: {
                        _id: "$categories.label",
                        totalArticles: {$sum: 1},
                        totalComments: {$sum: {$size: "$comments"}}
                    }
                },
                {
                    $project: {
                        label: "$_id",
                        avgNumOfCmt: { $divide: ["$totalComments", "$totalArticles"] }
                    }
                },
                {
                    $sort: {
                        avgNumOfCmt: -1,
                        label: 1
                    }
                }
            ]).toArray();

            return result.map(item => {
                item.avgNumOfCmt = item.avgNumOfCmt.toFixed(5);
                return item;
            });
        } catch (error) {
            console.error("Error retrieving category report: " + error);
            throw error;
        }
    }
}

export default MongoDbService;
