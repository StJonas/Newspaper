import express from "express";
import cors from "cors";
import https from "https";
import http from "http";
import fs from "fs";
import { env } from "./env/envConfig.js";
import DatabaseService from "./database/databaseService.js";

const app = express();
app.use(express.json());
app.use(cors());

const database = new DatabaseService();

const backendHttpPort = env.HTTP_PORT;
const backendHttpsPort = env.HTTPS_PORT;
const sslCertificateAndKey = {
  key: fs.readFileSync("certificate/key.pem"),
  cert: fs.readFileSync("certificate/certificate.pem"),
};
const httpServer = http.createServer(app);
const httpsServer = https.createServer(sslCertificateAndKey, app);

httpServer.listen(backendHttpPort, () => {
  console.log(
    `Connected to backend over HTTP on port ${backendHttpPort}. Will be redirected to HTTPS.`
  );
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
  const result = await database.getLatestArticles();
  return res.json(result);
});

app.delete("/articles/:articleId", async (req, res) => {
  const articleId = req.params["articleId"];

  try {
    const result = await database.deleteArticle(articleId);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete article" });
  }
});

app.post("/articles", async (req, res) => {
  const { title, subtitle, article_content, journalist_id } = req.body;

  try {
    const result = await database.insertArticle(
      title,
      subtitle,
      article_content,
      journalist_id
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to insert article" });
  }
});

app.put("/articles/:articleId", async (req, res) => {
  const articleId = req.params["articleId"];
  const { title, subtitle, article_content } = req.body;

  try {
    const result = database.updateArticle(
      articleId,
      title,
      subtitle,
      article_content
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update article" });
  }
});

app.post("/importData", async (req, res) => {
  try {
    const result = await database.importData();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Error importing data!" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const result = await database.getUsers();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve users" });
  }
});

app.get("/comments/:articleId", async (req, res) => {
  const articleId = req.params.articleId;

  try {
    const result = await database.getCommentsOfArticle(articleId);
    return res.json(result);
  } catch (error) {
    return res.status(500).send({ error: "Failed to retrieve comments" });
  }
});

app.post("/comments", async (req, res) => {
  const { article_id, user_id, comment_content } = req.body;

  try {
    const result = await database.insertComment(
      article_id,
      user_id,
      comment_content
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).send({ error: "Error inserting comment" });
  }
});

app.get("/articleReport", async (req, res) => {
  try {
    const results = await database.getJournalistReport();
    return res.json(results);
  } catch (error) {
    return res.status(500).json({ error: "Error retrieving article report" });
  }
});

app.get("/categoryReport", async (req, res) => {
  try {
    const result = await database.getCategoryReport();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed retrieving category report" });
  }
});

app.put("/switchDatabase", async (req, res) => {
  try {
    const result = await database.switchDb();
    console.log("Switched DB to:", (database.dbIsMysql ? "MySQL" : "MongoDB"));
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: "Failed switching db" });
  }
});