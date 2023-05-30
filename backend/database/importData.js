import {faker} from "@faker-js/faker";

const USERS_NUM = 1000;
const JOURNALIST_NUM = USERS_NUM - 900;
const ARTICLES_NUM = JOURNALIST_NUM * 15;
const COMMENTS_NUM = ARTICLES_NUM * 3;
const CATEGORY_NUM = 50;
const ARTICLE_CATEGORY_NUM = ARTICLES_NUM * 2;
const USER_FOLLOW_NUM = USERS_NUM * 3;

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
    const query = `ALTER TABLE ${tableName}
        AUTO_INCREMENT = 1;`;
    await sequelize.query(query, {raw: true}).then(
        (value) => {
            console.log(`${model.getTableName()}: Autoincrement reset.`);
        },
        (error) => {
            console.error(`${model.getTableName()}: Error resetting auto-increment value: `, error);
        }
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
            let employeeId = faker.number.int({min: minId, max: maxId});
            while (newJournalist.some(journalist => journalist.employee_id === employeeId)) {
                employeeId = faker.number.int({min: minId, max: maxId});
            }
            return employeeId;
        }

        for (const user_id of userIDs) {
            const employee_id = generateUniqueEmpolyeeId();
            const first_name = faker.person.firstName();
            const last_name = faker.person.lastName();
            const birthday = faker.date.birthdate({min: 18, max: 65, mode: 'age'});
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

async function insertRandomArticles(numberOfArticles, article, journalists) {
    try {
        const newArticles = [];

        for (let i = 0; i < numberOfArticles / journalists.length; i++) {
            for (const journalist_id of journalists) {
                const title = faker.word.noun();
                const subtitle = faker.lorem.sentence({min: 3, max: 10});
                const article_content = faker.lorem.text();
                newArticles.push({
                    journalist_id,
                    title,
                    subtitle,
                    article_content,
                });
            }
        }
        await article.bulkCreate(newArticles);
        console.log(`${numberOfArticles} articles inserted successfully.`);
    } catch (error) {
        console.error(`${article.tableName}: Error inserting articles: `, error);
    }
}

async function insertRandomComments(numberOfComments, comment, articles, users) {
    try {
        function getNextUserIdFunction() {
            let currIndex = 0;
            return () => {
                if (currIndex >= users.length) {
                    currIndex = 0;
                }
                const nextUserId = users[currIndex];
                currIndex++;
                return nextUserId;
            };
        }

        const getNextUserId = getNextUserIdFunction();

        const newComments = [];
        for (let i = 0; i < numberOfComments / articles.length; i++) {
            for (const article_id of articles) {
                const user_id = getNextUserId();
                const comment_content = faker.lorem.text();
                newComments.push({
                    article_id,
                    user_id,
                    comment_content,
                });
            }
        }
        await comment.bulkCreate(newComments);
        console.log(`${numberOfComments} comments inserted successfully.`);
    } catch (error) {
        console.error(`${comment.tableName}: Error inserting comments: `, error);
    }
}

async function insertRandomCategory(numberOfCategory, category) {
    try {
        const newCategory = [];
        for (let i = 0; i < numberOfCategory; i++) {
            const label = faker.word.noun();
            const color_code = faker.internet.color().slice(1);
            newCategory.push({
                label,
                color_code,
            });
        }
        await category.bulkCreate(newCategory);
        console.log(`${numberOfCategory} categories inserted successfully.`);
    } catch (error) {
        console.error(`${category.tableName}: Error inserting categories: `, error);
    }
}

async function insertArticleCategory(numberOfArticleCategory, article_category, articles, categories) {
    try {
        const newArticleCategory = [];

        const getNextCategoryId = (() => {
            let currIndex = 0;
            return (article_id) => {
                if (currIndex >= categories.length) {
                    currIndex = 0;
                }
                while (newArticleCategory.some(element => element.article_id === article_id && element.category_id === categories[currIndex])) {
                    currIndex++;
                    if (currIndex >= categories.length) {
                        currIndex = 0;
                    }
                }
                const nextCategoryId = categories[currIndex];
                currIndex++;
                return nextCategoryId;
            };
        })();

        for (let i = 0; i < numberOfArticleCategory / articles.length; i++) {
            for (const article_id of articles) {
                const category_id = getNextCategoryId(article_id);
                newArticleCategory.push({
                    article_id,
                    category_id
                });
            }
        }
        await article_category.bulkCreate(newArticleCategory);
        console.log(`${numberOfArticleCategory} article_categories inserted successfully.`);
    } catch (error) {
        console.error(`${article_category.tableName}: Error inserting article_categories: `, error);
    }
}

async function insertUserFollow(numberOfUserFollow, user_follow, users) {
    try {
        const newUserFollow = [];

        const getNextUserId = (() => {
            let currIndex = 0;
            return (new_following_user) => {
                while (new_following_user === users[currIndex]
                            || newUserFollow.some(e => e.following_user === new_following_user && e.followed_user === users[currIndex])) {
                    currIndex = Math.floor(Math.random() * users.length);
                }
                const nextCategoryId = users[currIndex];
                currIndex = Math.floor(Math.random() * users.length);
                return nextCategoryId;
            };
        })();

        for (let i = 0; i < numberOfUserFollow / users.length; i++) {
            for (const following_user of users) {
                const followed_user = getNextUserId(following_user);
                newUserFollow.push({
                    following_user,
                    followed_user
                });
            }
        }
        await user_follow.bulkCreate(newUserFollow);
        console.log(`${numberOfUserFollow} user_follows inserted successfully.`);
    } catch (error) {
        console.error(`${user_follow.tableName}: Error inserting user_follows: `, error);
    }
}

export async function importData(databaseCon) {
    const sequelize = databaseCon['sequelize'];
    const user = databaseCon['user'];
    const journalist = databaseCon['journalist'];
    const article = databaseCon['article'];
    const comment = databaseCon['comment'];
    const category = databaseCon['category'];
    const article_category = databaseCon['article_category'];
    const user_follow = databaseCon['user_follow'];

    console.log("Importing Data...");

    try {
        await deleteAllElements(comment);
        await deleteAllElements(article_category);
        await deleteAllElements(article);
        await deleteAllElements(category);
        await deleteAllElements(journalist);
        await deleteAllElements(user_follow);
        await deleteAllElements(user);

        await resetAutoIncrement(sequelize, user);
        await resetAutoIncrement(sequelize, article);
        await resetAutoIncrement(sequelize, category);

        await insertRandomUsers(USERS_NUM, user);

        const insertedUsers = await user.findAll({attributes: ['user_id']});
        const userIDs = insertedUsers.map(u => u.user_id);
        const journalistUserIDs = userIDs.slice(0, JOURNALIST_NUM);

        await insertRandomJournalists(JOURNALIST_NUM, journalist, journalistUserIDs);
        const insertedJournalists = await journalist.findAll({attributes: ['employee_id']});
        const journalistIDs = insertedJournalists.map(j => j.employee_id);

        await insertRandomArticles(ARTICLES_NUM, article, journalistIDs);
        const insertedArticles = await article.findAll({attributes: ['article_id']});
        const articleIDs = insertedArticles.map(a => a.article_id);

        await insertRandomComments(COMMENTS_NUM, comment, articleIDs, userIDs);

        await insertRandomCategory(CATEGORY_NUM, category);
        const insertedCategories = await category.findAll({attributes: ['category_id']});
        const categoryIDs = insertedCategories.map(c => c['category_id']);

        await insertArticleCategory(ARTICLE_CATEGORY_NUM, article_category, articleIDs, categoryIDs);

        await insertUserFollow(USER_FOLLOW_NUM, user_follow, userIDs);
        console.log("Imported!")

    } catch (error) {
        console.error("Error importing data:", error);
    }

}
