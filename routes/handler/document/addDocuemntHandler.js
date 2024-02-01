const connection = require("../../config/config");

function postDocumentHandler(req, res) {
  const { document_name, document_source } = req.body;

  const addDocumentQuery = `INSERT INTO document (document_name, document_source) VALUES (?,?)`;

  connection.query(
    addDocumentQuery,
    [document_name, document_source],
    function (error, results, fields) {
      if (error) {
        res.status(500).send(error.message);
      } else {
        res.json({ message: "Add Document Succsesfuly", data: results });
      }
    }
  );
}

module.exports = postDocumentHandler;
