//Database connection config
require('dotenv').config();

//get machine timezone
var offset = new Date().getTimezoneOffset();
const timeZone_UTC = (-(offset/60)).toString();

module.exports = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    timezone: timeZone_UTC,
    logging: false,
    define: {
        timestamps: false
    }
}