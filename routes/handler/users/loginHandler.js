const connection = require("../../config/config");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const PASSKEY = process.env.PASSKEY;

function loginHandler(req, res) {
  const { username, password } = req.body;

  console.log(username + password);

  const querypassword = `SELECT password FROM users WHERE username = ?`;

  connection.query(querypassword, [username], function (error, results) {
    if (error) {
      return res.status(500).send(error.message);
    }
    if (results.length > 0) {
      const decryptedPassword = CryptoJS.AES.decrypt(
        results[0].password,
        PASSKEY
      ).toString(CryptoJS.enc.Utf8);
      if (decryptedPassword === password) {
        const inserToken = `UPDATE users SET token = ? WHERE username = ?`;
        const loginAt = new Date();
        const loginEnd = new Date(loginAt.getTime() + 3600000);

        const tokenraw = {
          username: username,
          loginAt: loginAt.toLocaleTimeString("en-US", { timeStyle: "medium" }),
          loginEnd: loginEnd.toLocaleTimeString("en-US", {
            timeStyle: "medium",
          }),
        };

        const token = CryptoJS.AES.encrypt(
          JSON.stringify(tokenraw),
          PASSKEY
        ).toString();

        connection.query(inserToken, [token, username], function (err, result) {
          if (err) {
            return res.status(500).send(err.message);
          } else {
            return res.status(200).send({ message: "Login Succesfully" });
          }
        });
      } else {
        return res.status(401).json({ message: "Wrong Password" });
      }
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  });
}

module.exports = loginHandler;
