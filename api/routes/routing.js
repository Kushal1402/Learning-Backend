const express = require("express")
const router = express.Router();

const CountryController = require("../controllers/country")
router.get("/country/list", CountryController.getCountry)

const AccountController = require("../controllers/account");
router.get("/account/get", AccountController.getAccount)
router.post("/account/add", AccountController.addNewAccount)
router.put("/account/update/:id", AccountController.updateAccount)
router.delete("/account/delete/:id", AccountController.deleteAccount)

module.exports = router;