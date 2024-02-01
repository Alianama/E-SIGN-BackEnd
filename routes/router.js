const express = require("express");
const router = express.Router();

const addDocumentHandler = require("./handler/document/addDocuemntHandler");
const getDocumentHandler = require("./handler/document/getDocumentHandler");
const registerHandler = require("./handler/users/registeruserHandler");
const loginHandler = require("./handler/users/loginHandler");
const getApprovedHandler = require("./handler/approved/getDataApprovedHandler");

router.post("/addDocument", addDocumentHandler);
router.get("/getDocument/:id", getDocumentHandler);
router.post("/register", registerHandler);
router.post("/login/:id", loginHandler);
router.get("/:token", getApprovedHandler);

module.exports = router;
