import {Sequelize, QueryTypes} from "sequelize";
import {importMySqlData} from "./importMySqlData.js";
import createDatabaseCon from "./dbConMySQL.js";

class MySqlService {
    constructor() {
        this.database = createDatabaseCon();
    }

    async importData() {
        try {
            await this.database['sequelize'].sync();
            await importMySqlData(this.database);
            return {message: "Data imported successfully"};
        } catch (error) {
            console.error("Error importing data: " + error);
            throw error;
        }
    }

    async getLatestArticles() {
        return await this.database['article'].findAll({
            attributes: [`article_id`, `journalist_id`, `publish_time`, `title`, `subtitle`, `article_content`],
            order: [['publish_time', 'DESC']],
            limit: 50
        });
    }

    async insertArticle(title, subtitle, article_content, journalist_id) {
        try {
            const journalist = await this.database.journalist.findOne({
                where: {
                    user_id: journalist_id,
                },
            });

            const newArticle = await this.database.article.create({
                title: title,
                subtitle: subtitle,
                article_content: article_content,
                journalist_id: journalist.employee_id
            });

            return {
                message: 'Article created successfully',
                article: newArticle
            };

        } catch (error) {
            console.error('Error inserting article:', error);
            throw error;
        }
    }

    async updateArticle(articleId, title, subtitle, article_content) {
        try {
            return await this.database.article.update(
                {
                    title: title,
                    subtitle: subtitle,
                    article_content: article_content
                },
                {
                    where: {
                        article_id: articleId
                    }
                }
            );
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        }
    }

    async deleteArticle(articleId) {
        try {
            return await this.database.article.destroy({
                where: {
                    article_id: articleId,
                },
            });
        } catch (error) {
            console.error('Error deleting article:', error);
            throw error;
        }
    }

    async getUsers() {
        try {
            return await this.database.user.findAll({
                attributes: [
                    'user_id',
                    'username',
                    [
                        Sequelize.literal('CASE WHEN journalists.user_id IS NOT NULL THEN TRUE ELSE FALSE END'),
                        'isJournalist'
                    ]
                ],
                include: [
                    {
                        model: this.database.journalist,
                        as: 'journalists',
                        attributes: []
                    }
                ],
                order: [
                    [Sequelize.literal('CASE WHEN journalists.user_id IS NOT NULL THEN 0 ELSE 1 END')],
                    ['username']
                ],
            });
        } catch (error) {
            console.error("Error retrieving users:", error);
            throw error;
        }
    }

    async getCommentsOfArticle(articleId) {
        try {
            const comments = await this.database.comment.findAll({
                where: {
                    article_id: articleId
                },
                include: [
                    {
                        model: this.database.user,
                        attributes: ['username']
                    }
                ],
                order: [['comment_time', 'DESC']]
            });

            return comments.map((comment) => ({
                article_id: comment.article_id,
                comment_id: comment.comment_id,
                user_id: comment.user_id,
                username: (comment.user ? comment.user.username : null),
                comment_time: comment.comment_time,
                comment_content: comment.comment_content
            }));
        } catch (error) {
            console.error("Error retrieving comments:", error);
            throw error;
        }
    }

    async insertComment(article_id, user_id, comment_content) {
        try {
            if (article_id === null || article_id === '' || user_id === null || user_id === '' || comment_content === null || comment_content === '') {
                throw new Error("Invalid input: input cannot be null or empty");
            }

            const newComment = await this.database.comment.create({
                article_id: article_id,
                user_id: user_id,
                comment_content: comment_content
            });

            return {
                message: 'Comment created successfully',
                comment: newComment
            };

        } catch (error) {
            console.error("Error inserting comment:", error);
            throw error;
        }
    }

    async getJournalistReport() {
        try {
            return await this.database.journalist.findAll({
                attributes: [
                    'employee_id',
                    [Sequelize.literal('CONCAT(last_name, " ", first_name)'), 'fullName'],
                    [
                        Sequelize.literal(`
                        (SELECT COUNT(*) FROM article a1 WHERE a1.journalist_id = journalist.employee_id 
                        AND a1.publish_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR))`),
                        'publishedArticles'
                    ],
                    [
                        Sequelize.literal(`
                        (SELECT title FROM article a1 
                        WHERE a1.journalist_id = journalist.employee_id
                        AND a1.publish_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                        ORDER BY a1.publish_time DESC
                        LIMIT 1)`),
                        'recentArticleTitle',
                    ]
                ],
                include: [
                    {
                        model: this.database.user,
                        as: 'user',
                        attributes: ['username']
                    }
                ],
                order: [
                    [Sequelize.literal('publishedArticles'), 'DESC'],
                    [Sequelize.literal('last_name'), 'ASC'],
                    [Sequelize.literal('first_name'), 'ASC'],
                ],
                limit: 10,
            });
        } catch (error) {
            console.error("Error retrieving article report:", error);
            throw error;
        }
    }

    async getCategoryReport() {
        try {
            return await this.database.category.findAll({
                attributes: [
                    'label',
                    [
                        this.database.sequelize.literal('CAST(COUNT(*) / COUNT(DISTINCT article_categories.article_id) AS DECIMAL(10, 5))'),
                        'avgNumOfCmt',
                    ],
                ],
                include: [
                    {
                        model: this.database['article_category'],
                        as: 'article_categories',
                        attributes: [],
                        include: [
                            {
                                model: this.database['comment'],
                                as: 'comments',
                                attributes: [],
                            },
                        ],
                    },
                ],
                group: ['category.category_id'],
                order: [
                    [this.database.sequelize.literal('avgNumOfCmt'), 'DESC'],
                    [this.database.sequelize.literal('label'), 'ASC']
                ]
            });
        } catch (error) {
            console.error('Error retrieving category report:', error);
            throw error;
        }
    }

}

export default MySqlService;