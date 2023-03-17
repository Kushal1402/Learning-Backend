const express = require("express")
const router = express.Router();
// const multer = require("multer");

// const Helper = require("../helper/helper");

// import middlewares
const adminCheckAuth = require('../middleware/admin-auth');

const dailyProductsController = require("../controllers/dailyproducts");

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, "./uploads");
//     },
//     filename: function (req, file, cb) {
//         cb(null, Helper.generateRandomString(5) + "-" + file.originalname);
//     },
// });

// const fileFilter = (req, file, cb) => {
//     // Reject file
//     if (
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpg" ||
//         file.mimetype == "image/jpeg" ||
//         file.mimetype == "image/gif" ||
//         file.mimetype == "image/svg+xml"
//     ) {
//         cb(null, true);
//     } else {
//         cb(null, false);
//         return cb(new Error("Only .png, .jpg .gif and .jpeg format allowed!"));
//     }
// };

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 10,
//     },
//     fileFilter: fileFilter,
// });

router.get("/get", adminCheckAuth, dailyProductsController.getDailyProducts);
router.get("/get/paginate", adminCheckAuth, dailyProductsController.getDailyProductsPaginate);

router.post("/add", adminCheckAuth, dailyProductsController.addDailyProducts);

router.put("/update/:id", adminCheckAuth, dailyProductsController.editDailyProducts);

router.delete("/del/:_id", adminCheckAuth, dailyProductsController.deleleDailyProducts);

router.put("/change_status/:id", adminCheckAuth, dailyProductsController.change_status);

module.exports = router;