import express from "express";
import mysql from "mysql2";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import {env} from "./env/envConfig.js";
import {importData} from "./database/importData.js";
import createDatabaseCon from "./database/databaseCon.js";
import {QueryTypes} from "sequelize";

const app = express();
app.use(express.json());
app.use(cors());

const database = await createDatabaseCon();
const dbConfig = {
    host: env.MYSQL_HOST,
    port: parseInt(env.MYSQL_PORT, 10),
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE,
};
const db = mysql.createPool(dbConfig);

const backendHttpPort = env.HTTP_PORT;
const backendHttpsPort = env.HTTPS_PORT;
const sslCertificateAndKey = {
    key: fs.readFileSync('certificate/key.pem'),
    cert: fs.readFileSync('certificate/certificate.pem')
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(sslCertificateAndKey, app);

httpServer.listen(backendHttpPort, () => {
    console.log(`Connected to backend over HTTP on port ${backendHttpPort}. Will be redirected to HTTPS.`);
});
httpsServer.listen(backendHttpsPort, () => {
    console.log(`Connected to backend over HTTPS on port ${backendHttpsPort}`);
});

app.use((req, res, next) => {
    if (req.protocol === "http") {
        const httpsUrl = `https://${req.hostname}:${backendHttpsPort}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }
    next();
});

app.get("/articles", async (req, res) => {
    const selectQuery = "SELECT * FROM newspaper.article ORDER BY publish_time DESC LIMIT 50";
    const results = await database['sequelize'].query(selectQuery, {type: QueryTypes.SELECT});
    return res.json(results);
});

app.get("/articles/:articleId", async (req, res) => {
    const articleId = req.params['articleId'];

    try {
        const result = await database.article.findOne({
            where: {
                article_id: articleId,
            },
        });

        return res.json(result);
    } catch (error) {
        console.error('Error retrieving article:', error);
        return res.status(500).json({ error: 'Failed to retrieve article' });
    }
});

app.delete("/articles/:articleId", async (req, res) => {
    const articleId = req.params['articleId'];

    try {
        const result = await database.article.destroy({
            where: {
                article_id: articleId,
            },
        });

        return res.json(result);
    } catch (error) {
        console.error('Error retrieving article:', error);
        return res.status(500).json({ error: 'Failed to retrieve article' });
    }
});

app.post("/articles", async (req, res) => {
    try {
        const { title, subtitle, article_content } = req.body;

        const newArticle = await database.article.create({
            title: title,
            subtitle: subtitle,
            article_content: article_content
            //journalist_id
        });

        return res.json({
            message: 'Artilce created successfully',
            article: newArticle
        });

    } catch (error) {
        return res.status(500).send(error);
    }
});

app.put("/articles/:articleId", (req, res) => {
    const articleId = req.params['articleId'];
    const updateQuery = "UPDATE newspaper.article SET `title` = ?, `subtitle` = ?, `article_content` = ? WHERE article_id = ?";
    const values = [req.body['title'], req.body['subtitle'], req.body['article_content'], articleId];
    db.query(updateQuery, values, (err, data) => {
        if (err)
            return res.send(err);
        return res.json(data);
    });
});

app.post("/importData", (req, res) => {
    database['sequelize'].sync().then(() => {
        importData(database).then(
            (value) => {
                res.send("Data imported successfully");
            },
            (error) => {
                console.error("Error importing data: " + error);
                res.send(error);
            }
        );
    });
});

app.get("/users", async (req, res) => {
    try {
        const query = `
            SELECT u.user_id, u.username, CASE WHEN j.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS isJournalist
            FROM user u
                     LEFT JOIN journalist j ON u.user_id = j.user_id;
        `;
        const results = await database['sequelize'].query(query, {type: QueryTypes.SELECT});
        return res.json(results);
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json(error);
    }
});

app.get("/comments/:articleId", async (req, res) => {
    const articleId = req.params.articleId;
    try {
        const comments = await database.comment.findAll({
            where: {
                article_id: articleId
            },
            include: [
                {
                    model: database.user,
                    attributes: ['username']
                }
            ],
            order: [['comment_time', 'DESC']]
        });

        const result = comments.map((comment) => ({
            article_id: comment.article_id,
            comment_id: comment.comment_id,
            user_id: comment.user_id,
            username: (comment.user ? comment.user.username : null),
            comment_time: comment.comment_time,
            comment_content: comment.comment_content
        }));

        return res.json(result);
    } catch (error) {
        return res.status(500).send('Error while getting comments!');
    }
});

app.post("/comments", async (req, res) => {
    const {article_id, user_id, comment_content} = req.body;

    if (article_id === null || article_id === '' || user_id === null || user_id === '' || comment_content === null || comment_content === '') {
        return res.status(500).send("Invalid input: input cannot be null or empty");
    }

    try {
        const newComment = await database.comment.create({
            article_id: article_id,
            user_id: user_id,
            comment_content: comment_content
        });

        return res.json({
            message: 'Comment created successfully',
            comment: newComment
        });

    } catch (error) {
        return res.status(500).send(error);
    }
});


app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.get("/articleReport", async (req, res) => {
    try {
        const query = `
            SELECT j.employee_id,
                   u.username,
                   CONCAT(j.last_name, ' ', j.first_name) AS fullName,
                   a.publishedArticles                    AS publishedArticles,
                   a.recentArticleTitle
            FROM journalist j
                     LEFT JOIN user u ON u.user_id = j.employee_id
                     LEFT JOIN (SELECT a1.journalist_id,
                                       MAX(a1.title) AS recentArticleTitle,
                                       COUNT(*)      AS publishedArticles
                                FROM article a1
                                WHERE a1.publish_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
                                GROUP BY a1.journalist_id) a ON j.employee_id = a.journalist_id
            ORDER BY publishedArticles DESC
            LIMIT 10;
        `;
        db.query(query, (err, data) => {
            if (err)
                return res.json(err);
            return res.json(data);
        });
        //   const results = await database['sequelize'].query(query, { type: QueryTypes.SELECT });
        //   return res.json(results);
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.status(500).json(error);
    }
});

app.get("/categoryReport", async (req, res) => {
    try {
        const result = await database.category.findAll({
            attributes: [
                'label',
                [
                    database.sequelize.literal('COUNT(*) / COUNT(DISTINCT article_category.article_id)'),
                    'AverageNumberofComments',
                ],
            ],
            include: [
                {
                    model: database['article_category'],
                    as: 'article_category',
                    attributes: [],
                    include: [
                        {
                            model: database['comment'],
                            as: 'comments',
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ['category.category_id'],
            order: [[database.sequelize.literal('AverageNumberofComments'), 'DESC']],
            // limit: 10,
        });

        const categoryReport = result.map(item => ({
            label: item.label,
            avgNumOfCmt: item.get('AverageNumberofComments'),
        }));

        res.json(categoryReport);
    } catch (error) {
        console.error('Error retrieving average number of comments per article:', error);
        res.status(500).json(error);
    }
});


//TODO: check nginx setting
//TODO: configure environment variables (backend port usw.) for frontend
//TODO: ORM: Mongoose, Sequelize
//TODO: HealthChecks for Database
//TODO: Login check for creating an article (only if a journalist is logged in can a new article be created)
//TODO: migrate to nosql