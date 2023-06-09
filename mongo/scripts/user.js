db = new Mongo().getDB("newspaper");

db.createCollection("user", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        email: {
          bsonType: "string",
          description: "email of the user",
          required: true
        },
        username: {
          bsonType: "string",
          description: "the username of the user",
          required: true
        },
        password: {
          bsonType: "string",
          description: "password",
          required: true
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

db.user.createIndex({ "username": 1 }, { unique: true });
db.user.createIndex({ email: 1 }, { unique: true });