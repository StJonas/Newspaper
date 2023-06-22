import MySqlService from "./mysql/mySqlService.js";
import MongoDbService from "./mongo/mongoDbService.js";
import {migrateMySqlDataToMongoDb} from "./migrateMySqlDataToMongoDb.js";

class DatabaseService {
    constructor() {
        this.currentDb = new MySqlService();
        this.dbIsMysql = true;
        this.firstMigration = true;
    }

    async switchDb(){
        if(this.dbIsMysql) {
            const oldDb = this.currentDb;
            this.currentDb = new MongoDbService();
            this.dbIsMysql = false;
            if(this.firstMigration)
            {
                await migrateMySqlDataToMongoDb(oldDb.database, this.currentDb.database);
                this.firstMigration = false;
            }
            return {
                message: "Switched to MongoDB"
            }
        }
        else
        {
            this.currentDb = new MySqlService();
            this.dbIsMysql = true;
            return {
                message: "Switched to MySQL"
            }
        }
    }

    async importData() {
        return await this.currentDb.importData();
    }

    async getLatestArticles() {
        return await this.currentDb.getLatestArticles();
    }

    async insertArticle(title, subtitle, article_content, journalist_id) {
        return await this.currentDb.insertArticle(title, subtitle, article_content, journalist_id);
    }

    async updateArticle(articleId, title, subtitle, article_content) {
        return await this.currentDb.updateArticle(articleId, title, subtitle, article_content);
    }

    async deleteArticle(articleId) {
        return await this.currentDb.deleteArticle(articleId);
    }

    async getUsers() {
        return await this.currentDb.getUsers();
    }

    async getCommentsOfArticle(articleId) {
        return this.currentDb.getCommentsOfArticle(articleId);
    }

    async insertComment(article_id, user_id, comment_content) {
        return await this.currentDb.insertComment(article_id, user_id, comment_content);
    }

    async getJournalistReport() {
        return this.currentDb.getJournalistReport();
    }

    async getCategoryReport() {
        return await this.currentDb.getCategoryReport();
    }

}

export default DatabaseService;