const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const AdminModel = require("../models/admin");
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        // console.log(decoded, "decoded")

        req.adminData = decoded;
        const { id } = decoded;

        const adminData = await AdminModel.findOne({ _id: id });
        // console.log(adminData, "adminData")

        if (adminData === null || adminData.flag != 1) {
            return res.status(401).json({
                message: "Auth fail",
            });
        }

        req.adminData = adminData;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Auth fail",
        });
    }
};
