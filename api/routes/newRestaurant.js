const express = require("express")
const router = express.Router();
const multer = require("multer");

const Helper = require("../helper/helper");

// import middlewares
const adminCheckAuth = require('../middleware/admin-auth');

// import controller
const newRestroController = require("../controllers/newRestaurant");

const storage =  multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Helper.generateRandomString(5) + '-' + file.originalname);
    },
})

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg" ||
        file.mimetype == "image/gif" ||
        file.mimetype == "image/svg+xml"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error("Only .png, .jpg .gif and .jpeg format allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize : 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

router.get('/get', adminCheckAuth, newRestroController.getRestaurant);
// router.get('/detail/:id', adminCheckAuth, newRestroController.getDetail);

router.post('/add', adminCheckAuth, upload.single('cover_photo'), newRestroController.addRestaurant);
router.put('/update/:id', adminCheckAuth, upload.single('cover_photo'), newRestroController.editRestaurant);
router.put('/change_status/:id', adminCheckAuth, newRestroController.change_status);
router.delete('/del/:id', adminCheckAuth, newRestroController.deleteRestaurant);

module.exports = router;