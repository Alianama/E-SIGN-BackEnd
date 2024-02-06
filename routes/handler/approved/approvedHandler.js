const connection = require("../../config/config");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const PASSKEY = process.env.PASSKEY;

function approvedHandler(req, res) {
  const getUserIDQuery = `SELECT id FROM users WHERE username = ?`;
  const getDocumentQuery = `SELECT * FROM document WHERE id_document = ?`;
  const insertApprovedDocuemnt = `INSERT INTO approved (username, id_document, document_name, document_source, approved, date, token) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const documentID = req.params.id;
  const { username } = req.body;

  connection.query(getDocumentQuery, [documentID], function (error, results) {
    if (error) {
      res.status(500).send(error.message);
    } else {
      if (results.length > 0) {
        const { document_name, document_source } = results[0];
        const rawdate = new Date();
        const date = rawdate.toISOString().split("T")[0];

        connection.query(getUserIDQuery, [username], function (error, results) {
          if (error) {
            res.status(500).send(error.message);
          } else {
            const checkApprovedQuery = `SELECT * FROM approved WHERE username = ? AND id_document = ?`;
            connection.query(
              checkApprovedQuery,
              [username, documentID],
              function (error, checkresults) {
                if (error) {
                  res.status(500).send(error.message);
                } else if (checkresults.length > 0) {
                  return res.status(200).json({
                    message: "Document Already Approved",
                    checkresults,
                  });
                } else {
                  const approvedData = {
                    username: username,
                    id_document: documentID,
                    document_name: document_name,
                    document_source: document_source,
                    approved: true,
                    date: date,
                  };
                  const token = CryptoJS.AES.encrypt(
                    JSON.stringify(approvedData),
                    PASSKEY
                  ).toString();
                  connection.query(
                    insertApprovedDocuemnt,
                    [
                      username,
                      documentID,
                      document_name,
                      document_source,
                      true,
                      date,
                      token,
                    ],
                    function (error, checkresults) {
                      if (error) {
                        res.status(500).send(error.message);
                      } else {
                        const { insertId } = checkresults;
                        const GetApprovedQuery = `SELECT * FROM approved WHERE id = ?`;
                        connection.query(
                          GetApprovedQuery,
                          [insertId],
                          function (error, checkresults) {
                            if (error) {
                              return res.status(500).send(error.message);
                            } else if (checkresults.length > 0) {
                              return res.status(200).json({
                                message: "Approved Successful",
                                checkresults,
                              });
                            }
                          }
                        );
                      }
                    }
                  );
                }
              }
            );
          }
        });
      } else {
        return res.status(404).json({ message: "Document not found" });
      }
    }
  });
}

module.exports = approvedHandler;
