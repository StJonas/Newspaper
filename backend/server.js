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

app.get("/articles", (req, res) => {
    const selectQuery = "SELECT * FROM newspaper.article";
    db.query(selectQuery, (err, data) => {
        if (err)
            return res.json(err);
        return res.json(data);
    });
});

app.get("/articles/:articleId", (req, res) => {
    const articleId = req.params['articleId'];
    const selectQuery = "SELECT * FROM newspaper.article WHERE article_id = ?";
    db.query(selectQuery, [articleId], (err, data) => {
        if (err)
            return res.send(err);
        return res.json(data);
    });
});

app.delete("/articles/:articleId", (req, res) => {
    const articleId = req.params['articleId'];
    const deleteQuery = "DELETE FROM newspaper.article WHERE article_id = ?";
    db.query(deleteQuery, [articleId], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

app.post("/articles", (req, res) => {
    const insertQuery = "INSERT INTO newspaper.article (`title`,`subtitle`,`article_content`) VALUES (?)";
    const values = [req.body['title'], req.body['subtitle'], req.body['article_content']];
    db.query(insertQuery, [values], (err, data) => {
        if (err)
            return res.json(err);
        return res.json(data);
    });
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
    importData().then(
        (value) => {
            res.status(200).json({message: "Data imported successfully"});
        },
        (error) => {
            console.log(error);
            res.status(500).json({message: "Error importing data"});
        }
    );
});

app.get("/users", async (req, res) => {
    try {
        const query = `
            SELECT
                u.user_id,
                u.username,
                CASE WHEN j.user_id IS NOT NULL THEN TRUE ELSE FALSE END AS isJournalist
            FROM
                user u
                    LEFT JOIN
                journalist j ON u.user_id = j.user_id;
        `;
        const results = await database['sequelize'].query(query, {type: QueryTypes.SELECT});
        return res.json(results);
    } catch (error) {
        console.error("Error retrieving users:", error);
        return res.json(error);
    }
});

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});


//TODO: check nginx setting
//TODO: configure environment variables (backend port usw.) for frontend
//TODO: ORM: Mongoose, Sequelize
//TODO: HealthChecks for Database
//TODO: Use Cases
//TODO: Reports
//TODO: Article detail
//TODO: Journalist marker in Listbox
//TODO: Handle Error on homepage if no articles available
//TODO: Switch to nosql