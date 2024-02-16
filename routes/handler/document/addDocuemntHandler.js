const connection = require("../../config/config");
const moment = require("moment");

function postDocumentHandler(req, res) {
  const { document_name, document_source } = req.body;
  const timestamp = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

  const addDocumentQuery = `INSERT INTO document (document_name, document_source, date_upload) VALUES (?,?,?)`;

  connection.query(
    addDocumentQuery,
    [document_name, document_source, timestamp],
    function (error, results) {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.json({ message: "Add Document Succsesfuly", data: results });
      }
    }
  );
}

module.exports = postDocumentHandler;
