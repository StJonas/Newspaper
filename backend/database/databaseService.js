import MySqlService from "./mysql/mySqlService.js";
import MongoDbService from "./mongo/mongoDbService.js";

class DatabaseService {
    constructor() {
        this.currentDb = new MySqlService();
        this.dbIsMysql = true;
    }

    switchDb(){
        if(this.dbIsMysql) {
            this.currentDb = new MongoDbService();
            this.dbIsMysql = false;
        }
        else
        {
            this.currentDb = new MySqlService();
            this.dbIsMysql = true;
        }
    }

    async importData() {
        return this.currentDb.importData();
    }

    async getLatestArticles() {
        return this.currentDb.getLatestArticles();
    }

    async getArticle(articleId) {
        return this.currentDb.getArticle(articleId);
    }

    async insertArticle(title, subtitle, article_content, journalist_id) {
        return this.currentDb.insertArticle(title, subtitle, article_content, journalist_id);
    }

    async updateArticle(articleId, title, subtitle, article_content) {
        return this.currentDb.updateArticle(articleId, title, subtitle, article_content);
    }

    async deleteArticle(articleId) {
        return this.currentDb.deleteArticle(articleId);
    }

    async getUsers() {
        return this.currentDb.getUsers();
    }

    async getCommentsOfArticle(articleId) {
        return this.currentDb.getCommentsOfArticle(articleId);
    }

    async insertComment(article_id, user_id, comment_content) {
        return this.currentDb.insertComment(article_id, user_id, comment_content);
    }

    async getArticleReport() {
        return this.currentDb.getArticleReport();
    }

    async getCategoryReport() {
        return this.currentDb.getCategoryReport();
    }

}

export default DatabaseService;