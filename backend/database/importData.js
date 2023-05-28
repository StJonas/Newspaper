import createDatabaseCon from "./databaseCon.js";
import {faker} from "@faker-js/faker";

const USERS_NUM = 500;
const ARTICLES_NUM = 500;

async function deleteAllElements(model) {
    model.destroy({
        where: {},
    }).then((numDeleted) => {
        console.log(`${model.tableName}: Deleted ${numDeleted} rows.`);
    }).catch((error) => {
        console.error(`${model.tableName}: Error while deleting rows:`, error);
    });
}

async function resetAutoIncrement(sequelize, model) {
    try {
        const tableName = model.getTableName();
        const query = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`;
        await sequelize.query(query, {raw: true});
        console.log(`${tableName}: Auto-increment reset.`);
    } catch (error) {
        console.error(`${model.getTableName()}: Error resetting auto-increment value: `, error);
    }
}

async function insertRandomUsers(numberOfUsers, user) {
    try {
        const newUsers = [];
        function generateUniqueEmail() {
            let email = faker.internet.email();
            while (newUsers.some(user => user.email === email)) {
                email = faker.internet.email();
            }
            return email;
        }
        function generateUniqueUsername() {
            let username = faker.internet.userName();
            while (newUsers.some(user => user.username === username)) {
                username = faker.internet.userName();
            }
            return username;
        }
        for (let i = 0; i < numberOfUsers; i++) {
            const email = generateUniqueEmail();
            const username = generateUniqueUsername();
            const password = faker.internet.password();
            newUsers.push({
                email,
                username,
                password,
            });
        }
        await user.bulkCreate(newUsers);
        console.log(`${numberOfUsers} users inserted successfully.`);
    } catch (error) {
        console.error(`${user.tableName}: Error inserting users: `, error);
    }
}

export async function importData() {
    const databaseCon = createDatabaseCon();
    const sequelize = databaseCon['sequelize'];
    const user = databaseCon['user'];

    await sequelize.sync();
    console.log("Importing Data...");

    await deleteAllElements(user);
    await resetAutoIncrement(sequelize, user);
    await insertRandomUsers(USERS_NUM, user);

    


    await sequelize.close();
}