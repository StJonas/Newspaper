# Newspaper Information System

This project is an information system implemented during the course IMSE (Information Management and Systems Engineering) taught at the University of Vienna. The main goal of this project was...

- to design and develop an information system based on the relational database model,
- migrate the relational design to a NoSQL model,
- and develop an information system based on the NoSQL model.

We decided on a web-platform for a newspaper company that allows readers to access and interact with online news articles. </br>

## Tech Stack

- Frontend: React.js
- Backend: Express.js
- MySQL/MongoDB

## Use Cases and Reportings

We specified 2 main use cases:

- Publishing an article
- Writing a comment

Additionally, we specified 2 reportings:

- Report about journalists who published the most articles (most productive journalists measured by article count)
- Report about news categories (Business, Science, Health,...) with most comments (most user activity measured by comments)

The course requirements were to implement these use cases and reportings.

## Data filling and Database migration

- After launch, the website runs on an SQL DB (MySQL) by default.

- A button on the homepage triggers a DB filling script that generates all the data needed for proper execution of the use cases and reportings.

- A button on the homepage triggers a DB migration that exports all the data from MySQL to MongoDB. Additionally, the used DB in the backend is switched to MongoDB.

- After the first time the button is used and the database is migrated to MongoDB, it changes function and can be used to switch the used database from MongoDB to MySQL and vice versa without migrating the data from one DB to the other.

## Running with Docker compose

Navigate to the root folder and run the following commands:

```bash
docker-compose build
docker-compose up
```

Now you can test the application on your browser. Since we used a self-signed certificate, the browser might say that the connection isn't private.
