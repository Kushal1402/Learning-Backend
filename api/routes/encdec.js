const express = require("express");
const router = express.Router();

const encdec = require("../controllers/encdec");

router.post("/encrypt", encdec.encryptData);
router.post("/decrypt", encdec.decryptData);

module.exports = router;