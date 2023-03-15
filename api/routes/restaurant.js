const express = require("express")
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const Helper = require("../helper/helper");

const RestaurantController = require("../controllers/restaurant")

const paginatedRes = require("../middleware/paginatedResults")

const dataPath = './api/data/restaurant.json'

const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Reject file
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
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: fileFilter,
});

// router.get("/get", paginatedRes(pureData), RestaurantController.getRestaurant)
router.get("/get", RestaurantController.getRestaurant)
router.get("/detail/:id", RestaurantController.getRestaurantDetail);
router.post(
    "/add",
    upload.single("cover_photo"),
    RestaurantController.addRestaurant
);
router.put(
    "/update/:id",
    upload.single("cover_photo"),
    RestaurantController.editRestaurant
)
router.delete(
    "/del/:id",
    RestaurantController.deleteRestaurant
)
router.patch(
    "/change_status/:id",
    RestaurantController.change_status
)

module.exports = router;