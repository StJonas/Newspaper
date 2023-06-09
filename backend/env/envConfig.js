import dotenv from "dotenv";

function loadEnv() {
    const env = {};
    switch (process.env.NODE_ENV) {
        case 'production':
            break;
        case 'development':
            dotenv.config({
                path: './env/.env.development'
            });
            break;
        default:
            throw new Error(`Invalid NODE_ENV value: ${process.env.NODE_ENV}`);
    }
    env.NODE_ENV = process.env.NODE_ENV;
    env.MYSQL_HOST = process.env.MYSQL_HOST;
    env.MYSQL_PORT = process.env.MYSQL_PORT;
    env.MYSQL_USERNAME = process.env.MYSQL_USERNAME;
    env.MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
    env.MYSQL_DATABASE = process.env.MYSQL_DATABASE;
    env.MONGODB_HOST = process.env.MONGODB_HOST;
    env.MONGODB_PORT = process.env.MONGODB_PORT;
    env.MONGODB_DATABASE = process.env.MONGODB_DATABASE;
    env.MONGODB_USERNAME = process.env.MONGODB_USERNAME;
    env.MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
    env.HTTP_PORT = process.env.HTTP_PORT;
    env.HTTPS_PORT = process.env.HTTPS_PORT;
    return env;
}

export const env = loadEnv();