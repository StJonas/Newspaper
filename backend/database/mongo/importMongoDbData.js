import {faker} from "@faker-js/faker";

const USERS_NUM = 700;
const JOURNALIST_NUM = USERS_NUM - 400;
const ARTICLES_NUM_MAX = 25;
const COMMENTS_NUM_MAX = 5;
const CATEGORY_NUM = 50;
const ARTICLE_CATEGORY_NUM = 2;
const USER_FOLLOW_NUM = 3;

async function deleteAllElements(col) {
    try {
        const deleteResult = await col.deleteMany({});
        console.log(`${col.collectionName}: Deleted ${deleteResult.deletedCount} rows.`);
    } catch (error) {
        console.error(`${col.collectionName}: Error while deleting rows:`, error);
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
        await user.insertMany(newUsers);
        console.log(`${numberOfUsers} users inserted successfully.`);
    } catch (error) {
        console.error(`${user.collectionName}: Error inserting users: `, error);
    }
}

async function insertRandomJournalists(numberOfJournalists, journalist, users) {
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

        for (const u of users) {
            const employee_id = generateUniqueEmpolyeeId();
            const user = {_id: u._id, username: u.username};
            const first_name = faker.person.firstName();
            const last_name = faker.person.lastName();
            const birthday = faker.date.birthdate({min: 18, max: 65, mode: 'age'});
            newJournalist.push({
                employee_id,
                user,
                first_name,
                last_name,
                birthday,
            });
        }
        await journalist.insertMany(newJournalist);
        console.log(`${numberOfJournalists} journalists inserted successfully.`);
    } catch (error) {
        console.error(`${journalist.collectionName}: Error inserting journalists: `, error);
    }
}

async function insertRandomArticles(numberOfArticlesMax, numberOfCommentsMax, numberOfCategories, numberOfCategoriesPerArticle, users, article, journalists) {
    try {
        const newArticles = [];
        const newCategories = await createCategories(numberOfCategories);

        const getNextUserId = (() => {
            let currIndex = 0;
            return () => {
                if (currIndex >= users.length) {
                    currIndex = 0;
                }
                const nextUser = users[currIndex];
                currIndex++;
                return nextUser;
            };
        })();

        const getNextCategory = (() => {
            let currIndex = 0;
            return () => {
                if (newCategories.length <= 0)
                    throw new Error("no categories created");
                if (currIndex >= newCategories.length) {
                    currIndex = 0;
                }
                const nextCat = newCategories[currIndex];
                currIndex++;
                return nextCat;
            };
        })();

        for (const j of journalists) {
            const numArticles = Math.floor(Math.random() * numberOfArticlesMax + 1);
            for (let i = 0; i < numArticles; i++) {
                const journalist = {
                    _id: j._id,
                    first_name: j.first_name,
                    last_name: j.last_name,
                };
                const publish_time = faker.date.past({years: 3});
                const title = faker.word.noun();
                const subtitle = faker.lorem.sentence({min: 3, max: 10});
                const article_content = faker.lorem.text();
                const comments = [];
                const numComments = Math.floor(Math.random() * numberOfCommentsMax + 1);
                for (let c = 0; c < numComments; c++) {
                    const user = getNextUserId();
                    comments.push({
                        user: {
                            _id: user._id,
                            username: user.username
                        },
                        comment_content: faker.lorem.text(),
                        comment_time: faker.date.between({from: publish_time}),
                    });
                }
                const categories = [];
                for (let c = 0; c < numberOfCategoriesPerArticle; c++) {
                    categories.push(getNextCategory());
                }

                newArticles.push({
                    journalist,
                    publish_time,
                    title,
                    subtitle,
                    article_content,
                    categories,
                    comments,
                });
            }
        }
        await article.insertMany(newArticles);
        console.log(`${newArticles.length} articles inserted successfully.`);
    } catch (error) {
        console.error(`${article.collectionName}: Error inserting articles: `, error);
    }
}

async function insertUserFollow(numberOfUserFollow, user, users) {

    try {
        const updateUserPromises = [];

        const getNextUserId = (() => {
            let currIndex = 0;
            return (new_following_user, newUserFollow) => {
                while (new_following_user === users[currIndex]._id
                || newUserFollow.some(e => e.following_user === new_following_user && e.followed_user === users[currIndex]._id)) {
                    currIndex = Math.floor(Math.random() * users.length);
                }
                const nextCategoryId = users[currIndex]._id;
                currIndex = Math.floor(Math.random() * users.length);
                return nextCategoryId;
            };
        })();

        for (const currentUser of users) {
            const newFollowing = [];

            for (let i = 0; i < numberOfUserFollow; i++) {
                const followingUserId = getNextUserId(currentUser._id, newFollowing);
                newFollowing.push(followingUserId);
            }

            const updateUserPromise = user.updateOne(
                {_id: currentUser._id},
                {$set: {following: newFollowing}}
            );
            updateUserPromises.push(updateUserPromise);
        }

        // Wait for all user updates to complete
        await Promise.all(updateUserPromises);

        console.log(`${numberOfUserFollow} followings per user inserted successfully.`);
    } catch (error) {
        console.error(`${user.collectionName}: Error inserting followings: `, error);
    }
}

async function createCategories(numberOfCategories) {
    const newCategories = [];
    for (let i = 0; i < numberOfCategories; i++) {
        const label = faker.word.noun();
        const color_code = faker.internet.color().slice(1);
        newCategories.push({
            label,
            color_code,
        });
    }
    return newCategories;
}

export async function importMongoDbData(databaseCon) {
    const user = databaseCon.collection('user');
    const journalist = databaseCon.collection('journalist');
    const article = databaseCon.collection('article');

    console.log("MongoDB: Importing Data...");

    try {
        await deleteAllElements(article);
        await deleteAllElements(journalist);
        await deleteAllElements(user);

        await insertRandomUsers(USERS_NUM, user);
        const insertedUsers = await user.find({}).toArray();
        const journalistUsers = insertedUsers.slice(0, JOURNALIST_NUM);

        await insertUserFollow(USER_FOLLOW_NUM, user, insertedUsers);

        await insertRandomJournalists(JOURNALIST_NUM, journalist, journalistUsers);
        const insertedJournalists = await journalist.find({}).toArray();

        await insertRandomArticles(ARTICLES_NUM_MAX, COMMENTS_NUM_MAX, CATEGORY_NUM, ARTICLE_CATEGORY_NUM, insertedUsers, article, insertedJournalists);

        console.log("Imported!");

    } catch (error) {
        console.error("Error importing data:", error);
    }

}
