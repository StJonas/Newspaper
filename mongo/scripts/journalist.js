db = new Mongo().getDB("newspaper");

db.createCollection("journalist", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["employee_id", "first_name", "last_name", "birthday"],
      properties: {
        employee_id: {
          bsonType: "number",
          description: "the employee ID"
        },
        user: {
          bsonType: "object",
          required: ["_id", "username"],
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
        first_name: {
          bsonType: "string",
          description: "the first name"
        },
        last_name: {
          bsonType: "string",
          description: "the last name"
        },
        birthday: {
          bsonType: "date",
          description: "the date of birth"
        }
      }
    }
  }
});
db.journalist.createIndex({ employee_id: 1 }, { unique: true });