const connection = require("../../config/config.js");

function getDocumentHandler(req, res) {
  const getDocumentQuery = `SELECT * FROM document WHERE id_document = ?`;
  const id = req.params.id;

  connection.query(getDocumentQuery, [id], function (error, results, fields) {
    if (error) {
      res.status(500).send(error.message);
    } else {
      if (results.length === 0) {
        res.status(400).send({ message: "Document Not Found" });
      } else {
        const getQuery = `SELECT * FROM document WHERE id_document = ?`;
        connection.query(getQuery, [id], function (error, results) {
          if (error) {
            res.status(500).send(error.message);
          } else {
            res.json(results);
          }
        });
      }
    }
  });
}

module.exports = getDocumentHandler;
