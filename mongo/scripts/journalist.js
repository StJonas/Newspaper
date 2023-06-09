db = new Mongo().getDB("newspaper");

db.createCollection("journalist", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      properties: {
        employee_id: {
          bsonType: "number",
          description: "the employee ID",
          required: true
        },
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
        first_name: {
          bsonType: "string",
          description: "the first name",
          required: true
        },
        last_name: {
          bsonType: "string",
          description: "the last name",
          required: true
        },
        birthday: {
          bsonType: "date",
          description: "the date of birth",
          required: true
        }
      }
    }
  }
});
db.journalist.createIndex({ employee_id: 1 }, { unique: true });