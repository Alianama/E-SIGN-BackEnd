const connection = require("../../config/config");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const PASSKEY = process.env.PASSKEY;

function loginHandler(req, res) {
  const { username, password } = req.body;
  const documentID = req.params.id;

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
        const getUserIDQuery = `SELECT id FROM users WHERE username = ?`;
        const getDocumentQuery = `SELECT * FROM document WHERE id_document = ?`;
        const insertApprovedDocuemnt = `INSERT INTO approved (user_id, id_document, document_name, document_source, approved, date, token) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        connection.query(
          getDocumentQuery,
          [documentID],
          function (error, results) {
            if (error) {
              res.status(500).send(error.message);
            } else {
              if (results.length > 0) {
                const { document_name, document_source } = results[0];
                const date = new Date();
                //  const token = CryptoJS.AES.encrypt(
                //    JSON.stringify(results[0], date),
                //    PASSKEY
                //  ).toString();

                connection.query(
                  getUserIDQuery,
                  [username],
                  function (error, results) {
                    if (error) {
                      res.status(500).send(error.message);
                    } else {
                      const { id } = results[0];
                      const checkApprovedQuery = `SELECT * FROM approved WHERE user_id = ? AND id_document = ?`;
                      connection.query(
                        checkApprovedQuery,
                        [id, documentID],
                        function (error, checkresults) {
                          if (error) {
                            res.status(500).send(error.message);
                          } else if (checkresults.length > 0) {
                            res
                              .status(401)
                              .send({ message: "Document already approved" });
                          } else {
                            const approvedData = {
                              user_id: id,
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
                                id,
                                documentID,
                                document_name,
                                document_source,
                                true,
                                date,
                                token,
                              ],
                              function (error, results) {
                                if (error) {
                                  res.status(500).send(error.message);
                                } else {
                                  res.json({ result: results });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                return res.status(404).json({ message: "Document not found" });
              }
            }
          }
        );
      } else {
        return res.status(401).json({ message: "Wrong Password" });
      }
    } else {
      return res.status(401).json({ message: "User not found" });
    }
  });
}

module.exports = loginHandler;
