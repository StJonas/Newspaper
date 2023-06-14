async function deleteAllElements(col) {
  try {
    const deleteResult = await col.deleteMany({});
    console.log(`${col.collectionName}: Deleted ${deleteResult.deletedCount} rows.`);
  } catch (error) {
    console.error(`${col.collectionName}: Error while deleting rows:`, error);
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
            { _id: mongodbFollowingId },
            { $push: { following: mongodbFollowedId } }
        );
    }
    console.log(`${users.length} users migrated successfully.`);

    return userIdMap;
  } catch (error) {
    console.error(`${mongodb_user.collectionName}: Error migrated users: `, error);
  }
}

async function insertRandomJournalists(mongodb_journalist, mysql_journalist) {
  try {
    const journalists = await mysql_journalist.find({
      attributes: ["employee_id", "user_id", "first_name", "last_name", "birthday"]
    });

    for (const j of journalists) {
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

export async function migrateMySqlDataToMongoDb(mysql, mongodb) {
  const mongodb_user = mongodb.collection('user');
  const mongodb_journalist = mongodb.collection('journalist');
  const mongodb_article = mongodb.collection('article');

  const mysql_sequelize = mysql['sequelize'];
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

    // await insertRandomJournalists(mongodb_journalist, mysql_journalist, );
    // const insertedJournalists = await journalist.find({}).toArray();
    //
    // await insertRandomArticles(ARTICLES_NUM_MAX, COMMENTS_NUM_MAX, CATEGORY_NUM, ARTICLE_CATEGORY_NUM, insertedUsers, article, insertedJournalists);

    console.log("Migrated!");

  } catch (error) {
    console.error("Error migrating data:", error);
  }

}
