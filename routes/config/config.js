const mysql = require("mysql");
require("dotenv").config();

const database = {
  host: process.env.HOST_NAME,
  user: process.env.USER_NAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
};

const connection = mysql.createConnection(database);
console.log(database.host);

module.exports = connection;
