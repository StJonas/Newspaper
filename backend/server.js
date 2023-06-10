import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import {env} from "./env/envConfig.js";
import DatabaseService from "./database/databaseService.js";

const app = express();
app.use(express.json());
app.use(cors());

const database_ = new DatabaseService();

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

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.use((req, res, next) => {
    if (req.protocol === "http") {
        const httpsUrl = `https://${req.hostname}:${backendHttpsPort}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }
    next();
});

app.get("/articles", async (req, res) => {

    const result = await database_.getLatestArticles();
    return res.json(result);

    // const selectQuery = "SELECT * FROM newspaper.article ORDER BY publish_time DESC LIMIT 50";
    // const results = await database['sequelize'].query(selectQuery, {type: QueryTypes.SELECT});
    // return res.json(results);
});

// app.get("/articles/:articleId", async (req, res) => {
//     const articleId = req.params['articleId'];
//
//     try {
//         return await database_.getArticle(articleId);
//     }catch (error) {
//         return res.status(500).json({error: 'Failed to retrieve article'});
//     }
//
//     // try {
//     //     const result = await database.article.findOne({
//     //         where: {
//     //             article_id: articleId,
//     //         },
//     //     });
//     //
//     //     return res.json(result);
//     // } catch (error) {
//     //     console.error('Error retrieving article:', error);
//     //     return res.status(500).json({error: 'Failed to retrieve article'});
//     // }
// });

app.delete("/articles/:articleId", async (req, res) => {
    const articleId = req.params['articleId'];

    try {
        const result = await database_.deleteArticle(articleId);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: 'Failed to delete article'});
    }

    // try {
    //     const result = await database.article.destroy({
    //         where: {
    //             article_id: articleId,
    //         },
    //     });
    //
    //     return res.json(result);
    // } catch (error) {
    //     console.error('Error retrieving article:', error);
    //     return res.status(500).json({error: 'Failed to retrieve article'});
    // }
});

app.post("/articles", async (req, res) => {
    const {title, subtitle, article_content, journalist_id} = req.body;

    try {
        const result = await database_.insertArticle(title, subtitle, article_content, journalist_id);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: 'Failed to insert article'});
    }

    // try {
    //     const journalist = await database.journalist.findOne({
    //         where: {
    //             user_id: journalist_id,
    //         },
    //     });
    //
    //     const newArticle = await database.article.create({
    //         title: title,
    //         subtitle: subtitle,
    //         article_content: article_content,
    //         journalist_id: journalist.employee_id
    //     });
    //
    //     return res.json({
    //         message: 'Artilce created successfully',
    //         article: newArticle
    //     });
    //
    // } catch (error) {
    //     return res.status(500).send(error);
    // }
});


app.put("/articles/:articleId", async (req, res) => {
    const articleId = req.params['articleId'];
    const {title, subtitle, article_content} = req.body;

    try {
        const result = database_.updateArticle(articleId, title, subtitle, article_content);
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: 'Failed to update article'});
    }


    // try {
    //     const updatedArticle = await database.article.update(
    //         {
    //             title: title,
    //             subtitle: subtitle,
    //             article_content: article_content
    //         },
    //         {
    //             where: {
    //                 article_id: articleId
    //             }
    //         }
    //     );
    //     return res.json(updatedArticle);
    // } catch (error) {
    //     console.error('Error updating article:', error);
    //     return res.status(500).json({ error: 'Failed to update article' });
    // }
});


app.post("/importData", async (req, res) => {

    try {
        const result = await database_.importData();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: "Error importing data!"});
    }

    // database['sequelize'].sync().then(() => {
    //     importMySqlData(database).then(
    //         (value) => {
    //             res.send("Data imported successfully");
    //         },
    //         (error) => {
    //             console.error("Error importing data: " + error);
    //             res.send(error);
    //         }
    //     );
    // });
});

app.get("/users", async (req, res) => {
    try {
        const result = await database_.getUsers();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: "Failed to retrieve users"});
    }

    // try {
    //     const results = await database.user.findAll({
    //         attributes: [
    //             'user_id',
    //             'username',
    //             [
    //                 Sequelize.literal('CASE WHEN journalist.user_id IS NOT NULL THEN TRUE ELSE FALSE END'),
    //                 'isJournalist'
    //             ]
    //         ],
    //         include: [
    //             {
    //                 model: database.journalist,
    //                 as: 'journalist',
    //                 attributes: []
    //             }
    //         ]
    //     });
    //
    //     return res.json(results);
    // } catch (error) {
    //     console.error("Error retrieving users:", error);
    //     return res.status(500).json(error);
    // }
});


app.get("/comments/:articleId", async (req, res) => {
    const articleId = req.params.articleId;

    try {
        const result = await database_.getCommentsOfArticle(articleId);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({error: 'Failed to retrieve comments'});
    }

    // try {
    //     const comments = await database.comment.findAll({
    //         where: {
    //             article_id: articleId
    //         },
    //         include: [
    //             {
    //                 model: database.user,
    //                 attributes: ['username']
    //             }
    //         ],
    //         order: [['comment_time', 'DESC']]
    //     });
    //
    //     const result = comments.map((comment) => ({
    //         article_id: comment.article_id,
    //         comment_id: comment.comment_id,
    //         user_id: comment.user_id,
    //         username: (comment.user ? comment.user.username : null),
    //         comment_time: comment.comment_time,
    //         comment_content: comment.comment_content
    //     }));
    //
    //     return res.json(result);
    // } catch (error) {
    //     return res.status(500).send('Error while getting comments!');
    // }
});

app.post("/comments", async (req, res) => {
    const {article_id, user_id, comment_content} = req.body;

    try {
        const result = await database_.insertComment(article_id, user_id, comment_content);
        return res.json(result);
    } catch (error) {
        return res.status(500).send({error: "Error inserting comment"});
    }

    // if (article_id === null || article_id === '' || user_id === null || user_id === '' || comment_content === null || comment_content === '') {
    //     return res.status(500).send("Invalid input: input cannot be null or empty");
    // }
    //
    // try {
    //     const newComment = await database.comment.create({
    //         article_id: article_id,
    //         user_id: user_id,
    //         comment_content: comment_content
    //     });
    //
    //     return res.json({
    //         message: 'Comment created successfully',
    //         comment: newComment
    //     });
    //
    // } catch (error) {
    //     return res.status(500).send(error);
    // }
});

app.get("/articleReport", async (req, res) => {

    try {
        const results = await database_.getArticleReport();
        return res.json(results);
    } catch (error) {
        return res.status(500).json({error:"Error retrieving article report"});
    }


    // try {
    //     const results = await database.journalist.findAll({
    //         attributes: [
    //             'employee_id',
    //             [Sequelize.literal('CONCAT(last_name, " ", first_name)'), 'fullName'],
    //             [
    //                 Sequelize.literal(`
    //                     (SELECT COUNT(*) FROM article a1 WHERE a1.journalist_id = journalist.employee_id
    //                     AND a1.publish_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR))`),
    //                 'publishedArticles'
    //             ],
    //             [
    //                 Sequelize.literal(`
    //                     (SELECT MAX(title) FROM article a1 WHERE a1.journalist_id = journalist.employee_id
    //                     AND a1.publish_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR))`),
    //                 'recentArticleTitle'
    //             ]
    //         ],
    //         include: [
    //             {
    //                 model: database.user,
    //                 as: 'user',
    //                 attributes: ['username']
    //             }
    //         ],
    //         order: [[Sequelize.literal('publishedArticles'), 'DESC']],
    //         limit: 10,
    //     });
    //
    //     return res.json(results);
    // } catch (error) {
    //     console.error("Error retrieving article report:", error);
    //     return res.status(500).json(error);
    // }
});


app.get("/categoryReport", async (req, res) => {

    try {
        const result = await database_.getCategoryReport();
        return res.json(result);
    } catch (error) {
        return res.status(500).json({error: "Failed retrieving category report"});
    }


    // try {
    //     const result = await database.category.findAll({
    //         attributes: [
    //             'label',
    //             [
    //                 database.sequelize.literal('COUNT(*) / COUNT(DISTINCT article_category.article_id)'),
    //                 'avgNumOfCmt',
    //             ],
    //         ],
    //         include: [
    //             {
    //                 model: database['article_category'],
    //                 as: 'article_category',
    //                 attributes: [],
    //                 include: [
    //                     {
    //                         model: database['comment'],
    //                         as: 'comments',
    //                         attributes: [],
    //                     },
    //                 ],
    //             },
    //         ],
    //         group: ['category.category_id'],
    //         order: [[database.sequelize.literal('avgNumOfCmt'), 'DESC']],
    //         // limit: 10,
    //     });
    //
    //     res.json(result);
    // } catch (error) {
    //     console.error('Error retrieving average number of comments per article:', error);
    //     res.status(500).json(error);
    // }
});


//TODO: check nginx setting
//TODO: configure environment variables (backend port usw.) for frontend
//TODO: ORM: Mongoose
//TODO: Login ListBox is under Report table. it should be above it
//TODO: Check what is wrong with update fields
//TODO: HealthChecks for Database
//TODO: migrate to nosql
//TODO: user drop down takes ages to load
//TODO: remove dev env settings