const connection = require("../../config/config.js");

function getAllDataApproved(req, res) {
  const { username } = req.body;

  const GetDataQuery = `SELECT name,document_name, document_source, date, approved FROM approved WHERE username = ?`;

  connection.query(GetDataQuery, [username], function (err, data) {
    if (err) {
      return res.status(500).send(err.message);
    } else {
      return res.status(200).json({ message: "success", data: data });
    }
  });
}

module.exports = getAllDataApproved;
