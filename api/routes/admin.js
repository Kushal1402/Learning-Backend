const express = require("express");
const router = express.Router();
const multer = require('multer')

// import helper
const Helper = require("../helper/helper");

// import middlewares
const adminCheckAuth = require('../middleware/admin-auth');

// import controllers
const adminController = require("../controllers/admin");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Helper.generateRandomString(5) + '-' + file.originalname)
    },
})

const fileFilter = (req, file, cb) => {
    // Reject file
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/png'
    ) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, // max - 10MB
    },
    fileFilter: fileFilter,
})

router.post("/signup", adminController.signUp);

router.post("/login", adminController.login);

router.get("/auth", adminCheckAuth, adminController.auth);

router.put(
    "/update-profile/:id",
    adminCheckAuth,
    upload.single("profile_pic"),
    adminController.upate_profile
)

router.put(
    '/change-password/:id',
    adminCheckAuth,
    adminController.change_password
)

router.get(
    '/get/detail/:id',
    adminCheckAuth,
    adminController.getAdminDetail
)

module.exports = router;