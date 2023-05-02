const express = require("express")
const router = express.Router();
const Helper = require("../helper/helper");

const adminCheckAuth = require("../middleware/admin-auth");

const studentsController = require("../controllers/students");


router.post("/add", adminCheckAuth, studentsController.addStudentData);

router.get("/get", studentsController.getStudentData)
module.exports = router;