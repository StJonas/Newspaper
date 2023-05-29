import createDatabaseCon from "./databaseCon.js";
import {faker} from "@faker-js/faker";

const USERS_NUM = 500;
const JOURNALIST_NUM = USERS_NUM - 450;
const ARTICLES_NUM = 500;

async function deleteAllElements(model) {
    await model.destroy({
        where: {},
    }).then((numDeleted) => {
        console.log(`${model.tableName}: Deleted ${numDeleted} rows.`);
    }).catch((error) => {
        console.error(`${model.tableName}: Error while deleting rows:`, error);
    });
}

async function resetAutoIncrement(sequelize, model) {
        const tableName = model.getTableName();
        const query = `ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`;
        await sequelize.query(query, {raw: true}).then(
            (value) => {console.log(`${model.getTableName()}: Autoincrement reset.`);},
            (error) => {console.error(`${model.getTableName()}: Error resetting auto-increment value: `, error);}
        );
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

async function insertRandomJournalists(numberOfJournalists, journalist, userIDs) {
    try {
        const newJournalist = [];
        const maxId = 999999;
        const minId = 0;
        function generateUniqueEmpolyeeId() {
            let employeeId = faker.number.int({min: minId, max : maxId});
            while (newJournalist.some(journalist => journalist.employeeId === employeeId)) {
                employeeId = faker.number.int({min: minId, max : maxId});
            }
            return employeeId;
        }

        for(const user_id of userIDs) {
            const employee_id = generateUniqueEmpolyeeId();
            const first_name = faker.person.firstName();
            const last_name = faker.person.lastName();
            const birthday = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
            newJournalist.push({
                employee_id,
                user_id,
                first_name,
                last_name,
                birthday,
            });
        }

        await journalist.bulkCreate(newJournalist);
        console.log(`${numberOfJournalists} journalists inserted successfully.`);
    } catch (error) {
        console.error(`${journalist.tableName}: Error inserting journalists: `, error);
    }
}

export async function importData() {
    const databaseCon = await createDatabaseCon();
    const sequelize = databaseCon['sequelize'];
    const user = databaseCon['user'];
    const journalist = databaseCon['journalist'];

    await sequelize.sync();
    console.log("Importing Data...");

    try {
        await deleteAllElements(journalist);
        await deleteAllElements(user);

        await resetAutoIncrement(sequelize, user);

        await insertRandomUsers(USERS_NUM, user);
        const insertedUsers = await user.findAll({
            attributes: ['user_id'],
            limit: JOURNALIST_NUM,
        });
        const userIDs = insertedUsers.map(u => u.user_id);
        await insertRandomJournalists(JOURNALIST_NUM, journalist, userIDs);

    } catch (error) {
        console.error("Error importing data:", error);
    } finally {
        await sequelize.close();
    }
}
