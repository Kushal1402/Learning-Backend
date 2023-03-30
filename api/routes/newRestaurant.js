const express = require("express")
const router = express.Router();
const multer = require("multer");

const Helper = require("../helper/helper");

// import middlewares
const adminCheckAuth = require('../middleware/admin-auth');

// import controller
const newRestroController = require("../controllers/newRestaurant");

// Storage engine 
const storage = multer.diskStorage({
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

// Multer middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
})

router.get('/get', adminCheckAuth, newRestroController.getRestaurant);
router.get('/detail/:id', adminCheckAuth, newRestroController.getRestaurantDetail);

// router.post('/add', adminCheckAuth, upload.single('cover_photo'), newRestroController.addRestaurant);
// router.post('/add', adminCheckAuth, upload.array("photos"), newRestroController.addRestaurant);
router.post('/add', adminCheckAuth, upload.fields([{ name: "cover_photo" }, { name: "photos" }]), newRestroController.addRestaurant);


// router.put('/update/:id', adminCheckAuth, upload.single('cover_photo'), newRestroController.editRestaurant);
// router.put('/update/:id', adminCheckAuth, upload.array("photos"), newRestroController.editRestaurant);
router.put('/update/:id', adminCheckAuth, upload.fields([{ name: "cover_photo" }, { name: "photos" }]), newRestroController.editRestaurant);

router.put('/change_status/:id', adminCheckAuth, newRestroController.change_status);
router.delete('/del/:id', adminCheckAuth, newRestroController.deleteRestaurant);

module.exports = router;