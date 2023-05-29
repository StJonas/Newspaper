import {DataTypes, Sequelize} from "sequelize";
import {env} from "../env/envConfig.js";

export default async function createDatabaseCon() {
    const database = {
        sequelize: getSequelize()
    };
    database['user'] = getUser(database['sequelize']);

    database['journalist'] = getJournalist(database['sequelize'], database['user']);
    database['user'].hasOne(database['journalist'], { foreignKey: 'user_id' });
    database['journalist'].belongsTo(database['user'], { foreignKey: 'user_id' });

    database['article'] = getArticle(database['sequelize'], database['journalist']);
    database['journalist'].hasOne(database['article'], { foreignKey: 'journalist_id' });
    database['article'].belongsTo(database['journalist'], { foreignKey: 'employee_id' });

    database['comment'] = getComment(database['sequelize'], database['article'], database['user']);
    database['user'].hasOne(database['comment'], { foreignKey: 'user_id' });
    database['comment'].belongsTo(database['user'], { foreignKey: 'user_id' });
    database['article'].hasOne(database['comment'], { foreignKey: 'article_id' });
    database['comment'].belongsTo(database['article'], { foreignKey: 'article_id' });

    return database;
}

function getSequelize() {
    return new Sequelize(env.MYSQL_DATABASE, env.MYSQL_USERNAME, env.MYSQL_PASSWORD, {
        host: env.MYSQL_HOST,
        port: parseInt(env.MYSQL_PORT, 10),
        dialect: 'mysql',
        logging: false,
    });
}

function getUser(sequelize) {
    return sequelize.define("user", {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.CHAR(64),
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });
}

function getJournalist(sequelize, user) {
    return sequelize.define('journalist', {
        employee_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: user,
                key: 'user_id',
                onDelete: 'SET NULL',
            },
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        birthday: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false
    });
}

function getArticle(sequelize, journalist) {
    return sequelize.define('article', {
        article_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        journalist_id: {
            type: DataTypes.INTEGER,
            references: {
                model: journalist,
                key: 'employee_id',
                onDelete: 'SET NULL',
            },
        },
        publish_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.STRING(750),
            allowNull: false,
        },
        article_content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}

function getComment(sequelize, article, user) {
    return sequelize.define('comment', {
        comment_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        article_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: article,
                key: 'article_id',
                onDelete: 'CASCADE',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: user,
                key: 'user_id',
                onDelete: 'SET NULL',
            },
        },
        comment_content: {
            type: DataTypes.STRING(750),
            allowNull: false,
        },
        comment_time: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            onUpdate: DataTypes.NOW,
        },
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}
