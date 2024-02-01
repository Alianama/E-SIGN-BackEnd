const connection = require("../../config/config.js");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const PASSKEY = process.env.PASSKEY;

function registerHandler(req, res) {
  const { username, password, department, position } = req.body;

  const checkUsername = `SELECT COUNT(*) as count FROM users WHERE username = ?`;
  connection.query(checkUsername, [username], function (error, results) {
    if (error) {
      res.status(500).send(error.message);
    }
    const usernameCount = results[0].count;
    if (usernameCount > 0) {
      return res.status(400).json({ message: "username already exists" });
    } else {
      const passwordHash = CryptoJS.AES.encrypt(password, PASSKEY).toString();

      const insertUsername = `INSERT INTO users (username, password, department, position) VALUES (?, ?, ?, ?)`;

      connection.query(
        insertUsername,
        [username, passwordHash, department, position],
        function (error, results) {
          if (error) {
            return res.status(500).send(error.message);
          }
          res.json({ message: "Registration Succes", data: results });
        }
      );
    }
  });
}

module.exports = registerHandler;
