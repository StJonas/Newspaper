import {DataTypes, Sequelize} from "sequelize";
import {env} from "../env/envConfig.js";

export default function createDatabaseCon()
{
    const database = {
        sequelize: getSequelize()
    };
    database['user'] = getUser(database['sequelize']);

    return database;
}

function getSequelize(){
    return new Sequelize(env.MYSQL_DATABASE, env.MYSQL_USERNAME, env.MYSQL_PASSWORD, {
        host: env.MYSQL_HOST,
        port: parseInt(env.MYSQL_PORT,10),
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