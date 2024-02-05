const express = require("express");
const router = express.Router();

const addDocumentHandler = require("./handler/document/addDocuemntHandler");
const getDocumentHandler = require("./handler/document/getDocumentHandler");
const registerHandler = require("./handler/users/registeruserHandler");
const loginHandler = require("./handler/users/loginHandler");
const getApprovedHandler = require("./handler/approved/getDataApprovedHandler");
const approvedHandler = require("./handler/approved/approvedHandler");

router.post("/addDocument", addDocumentHandler);
router.get("/getDocument/:id", getDocumentHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/approved/:id", approvedHandler);

router.get("/getapprove/:id", getApprovedHandler);

module.exports = router;
