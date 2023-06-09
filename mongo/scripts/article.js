db = new Mongo().getDB("newspaper");

db.createCollection("article", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        journalist: {
          bsonType: "object",
          properties: {
            _id: {
              bsonType: "objectId",
              description: "ObjectId reference"
            },
            first_name: {
              bsonType: "string",
              description: "the first name"
            },
            last_name: {
              bsonType: "string",
              description: "the last name"
            }
          }
        },
        publish_time: {
          bsonType: "date",
          description: "the publish time",
          required: true
        },
        title: {
          bsonType: "string",
          description: "the title",
          required: true
        },
        subtitle: {
          bsonType: "string",
          description: "the subtitle",
          required: true
        },
        article_content: {
          bsonType: "string",
          description: "the article content",
          required: true
        },
        categories: {
          bsonType: "array",
          description: "the categories",
          items: {
            bsonType: "object",
            properties: {
              label: {
                bsonType: "string",
                description: "the category label"
              },
              color_code: {
                bsonType: "string",
                description: "the category color code"
              }
            }
          }
        },
        comments: {
          bsonType: "array",
          description: "the comments",
          items: {
            bsonType: "object",
            properties: {
              user: {
                bsonType: "object",
                properties: {
                  _id: {
                    bsonType: "objectId",
                    description: "ObjectId reference"
                  },
                  username: {
                    bsonType: "string",
                    description: "the username"
                  }
                }
              },
              comment_content: {
                bsonType: "string",
                description: "the comment content"
              },
              comment_time: {
                bsonType: "date",
                description: "the comment time"
              }
            }
          }
        }
      }
    }
  }
});

db.article.createIndex({ title: 1 });
