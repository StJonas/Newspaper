import express from "express";
import mysql from "mysql2";
import cors from "cors";
import https from "https";
import fs from "fs";

const backendPort = 8080;
const sslCertificateAndKey = {
    key: fs.readFileSync('.cert/key.pem'),
    cert: fs.readFileSync('.cert/certificate.pem')
};

const app = express();
app.use(express.json());
app.use(cors());
const server = https.createServer(sslCertificateAndKey, app);


// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.protocol === "http") {
        const httpsUrl = `https://${req.hostname}${req.originalUrl}`;
        return res.redirect(301, httpsUrl);
    }
    next();
});

let dbConfig;
if (process.env.NODE_ENV === 'docker') {
    // Docker container
    dbConfig = {
        host: 'mysql',
        user: 'root',
        password: 'password',
        database: 'newspaper',
    };
} else {
    // Local development
    dbConfig = {
        host: 'localhost',
        port: '7201',
        user: 'root',
        password: 'password',
        database: 'newspaper',
    };
}
const db = mysql.createPool(dbConfig);

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

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});


server.listen(backendPort, () => {
    console.log(`Connected to backend over HTTPS on port ${backendPort}`);
});

//TODO: save DB inside a Docker Volume
//TODO: configure a deployment server for react app
//TODO: switch to Bootstrap
//TODO: ORM: Mongoose, Sequelize
//TODO: HealthChecks for Database
//TODO: Use Cases
//TODO: Reports
//TODO: Handle Error on homepage if no articles available