import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const backendPort = 8080;

//host: "mysql",
const db = mysql.createPool({
    host: "localhost",
    port: "7201",
    user: "root",
    password: "password",
    database: "Newspaper",
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
    console.log(values);
    db.query(updateQuery, values, (err, data) => {
        if (err)
            return res.send(err);
        return res.json(data);
    });
});


app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.listen(backendPort, () => {
    console.log("Connected to backend!");
});
