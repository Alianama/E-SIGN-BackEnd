const connection = require("../../config/config.js");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const PASSKEY = process.env.PASSKEY;

function getApprovedHandler(req, res) {
  const id = req.params.id;

  const getDataquery = `SELECT * FROM approved WHERE id = ?`;

  connection.query(getDataquery, [id], function (err, data) {
    if (err) {
      return res.status(500).send(err.message);
    } else if (data.length > 0) {
      // // const { token } = data[0];
      // const dataApproved = CryptoJS.AES.decrypt(token, PASSKEY).toString(
      //   CryptoJS.enc.Utf8
      // );
      // const parseddata = JSON.parse(dataApproved);
      return res.json({ data, status: "success" });
    } else {
      res.status(401).send({ message: "Invalid ID" });
    }
  });
}

module.exports = getApprovedHandler;
