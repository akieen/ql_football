require("dotenv").config();

const mysql2 = require('mysql2/promise');
const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
};


const db = mysql2.createPool(config);

module.exports = db;