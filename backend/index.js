import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "Newspaper",
});

app.get("/articles", (req, res) => {
  const q = "SELECT * FROM articles";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  const q = "SELECT * FROM articles WHERE id = ?";
  db.query(q, [articleId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.delete("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  const q = " DELETE FROM articles WHERE id = ? ";

  db.query(q, [articleId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.post("/articles", (req, res) => {
  const q = "INSERT INTO articles (`title`,`subtitle`,`content`) VALUES (?)";
  const values = [req.body.title, req.body.subtitle, req.body.content];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.put("/articles/:id", (req, res) => {
  const articleId = req.params.id;
  const q =
    "UPDATE articles SET `title`= ?, `subtitle`= ?, `content`= ? WHERE id = ?";

  const values = [req.body.title, req.body.subtitle, req.body.content];

  db.query(q, [...values, articleId], (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.get("/", (req, res) => {
  res.json("hello, this is the backend!");
});

app.listen(8080, () => {
  console.log("connected to backend!");
});
