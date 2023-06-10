db = new Mongo().getDB("newspaper");

db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "username", "password"],
      properties: {
        email: {
          bsonType: "string",
          description: "email of the user"
        },
        username: {
          bsonType: "string",
          description: "the username of the user"
        },
        password: {
          bsonType: "string",
          description: "password"
        },
        following: {
          bsonType: "array",
          description: "references to followed users",
          items: {
            bsonType: "objectId",
            description: "objectId reference"
          }
        }
      }
    }
  }
});

db.user.createIndex({ username: 1 }, { unique: true });
db.user.createIndex({ email: 1 }, { unique: true });