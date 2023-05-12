const mongoose = require("mongoose");
const niv = require("node-input-validator");
const Helepr = require("../helper/helper");
const PushNotifyModel = require("../models/push_notification");
const AdminModel = require("../models/admin");

exports.sendNotify = async (req, res) => {
    const validator = new niv.Validator(req.body, {
        description: "required",
    });
    const matched = await validator.check();
    if (matched === false || !matched) {
        return res.status(422).send({
            message: "Validation error",
            error: validator.errors
        });
    }

    const { description } = req.body;

    try {
        const result = await new PushNotifyModel({
            description: description,
            admin_id: req.adminData._id
        }).save();

        return res.status(201).send({
            message: 'Push notification added',
            result: result
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
};

exports.deleteNotify = async (req, res) => {
    const validator = new niv.Validator(req.params, {
        id: "required"
    });
    const matched = await validator.check();
    if (matched === false || !matched) {
        return res.status(422).send({
            message: "Validation error",
            errors: validator.errors
        })
    };

    const { id } = req.params;
    const adminData = req?.adminData?.id;

    try {
        // Check notification id
        const checkId = await PushNotifyModel.findById(id);
        if (checkId === null || !checkId) {
            return res.status(422).send({
                message: "No notification match with this id"
            })
        }

        // check same login id of user
        const checkUser = await AdminModel.findById(adminData);
        console.log("checkUser:", checkUser?.role === 1)
        if (checkUser?.role !== 1) {
            return res.status(422).send({
                message: "Only admin can delete notification"
            })
        } else {

            await PushNotifyModel.findByIdAndDelete(id);

            return res.status(201).send({
                message: "Push notification Deleted",
            })
        }
    } catch (error) {
        res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
};