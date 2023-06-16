async function deleteAllElements(col) {
    try {
        const deleteResult = await col.deleteMany({});
        console.log(`${col.collectionName}: Deleted ${deleteResult.deletedCount} rows.`);
    } catch (error) {
        console.error(`${col.collectionName}: Error while deleting rows:`, error);
    }
}

async function insertJournalists(mongodb_journalist, userIdMap, mysql_journalist, mysql_user) {
    try {

        const journalists = await mysql_journalist.findAll({
            attributes: ["employee_id", "first_name", "last_name", "birthday", "user_id"],
            include: {
                model: mysql_user,
                attributes: ["username"],
            },
        });

        const journalistMongoDb = journalists.map((journalist) => {
            const [year, month, day] = journalist.birthday.split('-');
            const birthday = new Date(Date.UTC(year, month - 1, day));
            return {
                employee_id: journalist.employee_id,
                user: {
                    _id: userIdMap.get(journalist.user_id),
                    username: journalist.user.username,
                },
                first_name: journalist.first_name,
                last_name: journalist.last_name,
                birthday: birthday,
            };
        });

        await mongodb_journalist.insertMany(journalistMongoDb);
        console.log(`${journalistMongoDb.length} journalists migrated successfully.`);
    } catch (error) {
        console.error(`${mongodb_journalist.collectionName}: Error migrating journalists: `, error);
    }
}

async function insertUsers(mongodb_user, mysql_user, mysql_user_follow) {
    try {

        const users = await mysql_user.findAll({
            attributes: ["user_id", "username", "email", "password"]
        });
        const userFollows = await mysql_user_follow.findAll({
            attributes: ["following_user", "followed_user"]
        });

        await mongodb_user.insertMany(users.map(user => ({
            email: user.email,
            username: user.username,
            password: user.password,
            following: []
        })));

        const insertedUsers = await mongodb_user.find({}).toArray();

        const userIdMap = new Map();
        for (const insertedUser of insertedUsers) {
            const matchingUser = users.find(user => user.username === insertedUser.username);
            if (matchingUser) {
                userIdMap.set(matchingUser.user_id, insertedUser._id);
            }
        }

        for (const userFollow of userFollows) {
            const mongodbFollowingId = userIdMap.get(userFollow.following_user);
            const mongodbFollowedId = userIdMap.get(userFollow.followed_user);
            await mongodb_user.updateOne(
                {_id: mongodbFollowingId},
                {$push: {following: mongodbFollowedId}}
            );
        }
        console.log(`${users.length} users migrated successfully.`);
        return userIdMap;
    } catch (error) {
        console.error(`${mongodb_user.collectionName}: Error migrated users: `, error);
    }
}

async function insertArticles(mongodb_article, mysql_user, userIdMap, mongodb_journalist, mysql_article, mysql_comment, mysql_category, mysql_article_category, mysql_journalist) {
    try {
        const articles = await mysql_article.findAll({
            attributes: ["article_id", "journalist_id", "publish_time", "title", "subtitle", "article_content"],
            include: [
                {
                    model: mysql_journalist,
                    attributes: ["employee_id", "first_name", "last_name"],
                },
                {
                    model: mysql_category,
                    attributes: ["label", "color_code"],
                    through: {
                        model: mysql_article_category,
                    },
                },
                {
                    model: mysql_comment,
                    attributes: ["user_id", "comment_content", "comment_time"],
                    include: [
                        {
                            model: mysql_user,
                            attributes: ["username"]
                        },
                    ],
                },
            ],
        });

        const journalistsMongoDb = await mongodb_journalist.find({}).toArray();


        const articleDocs = await articles.map((article) => {
            const categories = article.categories.map((category) => ({
                label: category.label,
                color_code: category.color_code,
            }));

            const comments = [];
            article.comments.forEach((comment) => {
                comments.push({
                    user: {
                        _id: userIdMap.get(comment.user_id),
                        username: comment.user.username,
                    },
                    comment_content: comment.comment_content,
                    comment_time: comment.comment_time,
                });
            });

            const journalistId = journalistsMongoDb.find(journalist => journalist.employee_id === article.journalist.employee_id)._id;
            return {
                journalist: {
                    _id: journalistId,
                    first_name: article.journalist.first_name,
                    last_name: article.journalist.last_name,
                },
                publish_time: article.publish_time,
                title: article.title,
                subtitle: article.subtitle,
                article_content: article.article_content,
                categories: categories,
                comments: comments,
            };
        });

        await mongodb_article.insertMany(articleDocs);
        console.log(`${articles.length} articles migrated successfully.`);
    } catch (error) {
        console.error(`${mongodb_article.collectionName}: Error migrating articles: `, error);
    }
}

export async function migrateMySqlDataToMongoDb(mysql, mongodb) {
    const mongodb_user = mongodb.collection('user');
    const mongodb_journalist = mongodb.collection('journalist');
    const mongodb_article = mongodb.collection('article');

    const mysql_user = mysql['user'];
    const mysql_journalist = mysql['journalist'];
    const mysql_article = mysql['article'];
    const mysql_comment = mysql['comment'];
    const mysql_category = mysql['category'];
    const mysql_article_category = mysql['article_category'];
    const mysql_user_follow = mysql['user_follow'];

    console.log("Migrating data from MySql to MongoDb...");

    try {
        await deleteAllElements(mongodb_article);
        await deleteAllElements(mongodb_journalist);
        await deleteAllElements(mongodb_user);

        const userIdMap = await insertUsers(mongodb_user, mysql_user, mysql_user_follow);

        await insertJournalists(mongodb_journalist, userIdMap, mysql_journalist, mysql_user);

        await insertArticles(mongodb_article, mysql_user, userIdMap, mongodb_journalist, mysql_article, mysql_comment, mysql_category, mysql_article_category, mysql_journalist);

        console.log("Migrated!");

    } catch (error) {
        console.error("Error migrating data:", error);
    }

}
