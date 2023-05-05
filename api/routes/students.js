const express = require("express")
const router = express.Router();
const Helper = require("../helper/helper");

const adminCheckAuth = require("../middleware/admin-auth");

const studentsController = require("../controllers/students");


router.post("/add", adminCheckAuth, studentsController.addStudentData);

router.get("/get", studentsController.getStudentData);

router.put("/edit/:id", adminCheckAuth, studentsController.editStudentData);

module.exports = router;