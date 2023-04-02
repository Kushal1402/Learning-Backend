const mongoose = require("mongoose");
const niv = require("node-input-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// import helper
const Helper = require("../helper/helper");

// import admin model
const AdminModel = require("../models/admin");

// Sign Up API
exports.signUp = async (req, res) => {

    const {
        name,
        email,
        password,
    } = req.body

    const objValidation = new niv.Validator(req.body, {
        name: 'required',
        email: 'required',
        password: 'required'
    });
    const matched = await objValidation.check();
    if (!matched || matched === false) {
        return res.status(422).send({
            message: "Validation error",
            errors: objValidation.errors,
        })
    }

    const adminData = await AdminModel.find({ email: email, flag: 1 })
    if (adminData.length > 0) {
        return res.status(409).json({
            message: 'Email already exists',
        })
    }

    const hash = await bcrypt.hash(password, 10);
    console.log(hash, "hash password")

    try {

        let createAdminObj = {
            name: name,
            email: email,
            password: hash
        }

        const newAdmin = new AdminModel(createAdminObj);

        await newAdmin.save();

        return res.status(201).json({
            message: 'Admin has been successfully created',
            result: newAdmin,
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

// Login through E-Mail & Password API
exports.login = async (req, res) => {

    const {
        email,
        password
    } = req.body

    const objValidation = new niv.Validator(req.body, {
        email: "required",
        password: "required"
    });
    const matched = await objValidation.check();
    if (!matched || matched === false) {
        return res.status(422).send({
            message: "Validation error",
            errors: objValidation.errors
        })
    }

    try {

        const adminData = await AdminModel.findOne({ email: email, flag: 1 })
        if (adminData === null) {
            return res.status(401).json({
                message: 'Invalid Email',
            })
        }

        const passwordMatch = await bcrypt.compare(password, adminData.password);
        if (passwordMatch === false) {
            return res.status(401).json({
                message: 'Invalid password',
            })
        }

        const token = jwt.sign(
            {
                email: email,
                id: adminData._id
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1d'
            }
        )
        console.log(token, "token")

        return res.status(200).json({
            admin: adminData,
            message: 'Admin has been successfully login',
            token: token,
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

// Auth api
exports.auth = async (req, res) => {
    try {
        const admin = req.adminData;
        // console.log(admin, "admin")

        admin.profile_pic = await Helper.getValidImageUrl(
            admin.profile_pic,
            admin.name
        )

        const sendObj = {}

        sendObj._id = admin._id
        sendObj.name = admin.name
        sendObj.email = admin.email
        sendObj.profile_pic = admin.profile_pic
        sendObj.flag = admin.flag
        sendObj.createdAt = admin.createdAt
        sendObj.updatedAt = admin.updatedAt

        // if (admin.profile_pic) {
        //     admin.profile_pic = await Helper.getValidImageUrl(
        //         admin.profile_pic,
        //         admin.name
        //     );
        // }

        return res.status(200).json({
            message: 'Admin auth retrived',
            result: sendObj,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Auth Fail',
            error: error.message,
        })
    }
}

// Update api
exports.upate_profile = async (req, res) => {
    const id = req.params.id;
    console.log(id, "id");

    let updateObj = {};

    if (req.file) updateObj.profile_pic = req.file.path;
    if (req.body.name) updateObj.name = req.body.name;
    if (req.body.email) updateObj.email = req.body.email;

    try {
        const result = await AdminModel.findByIdAndUpdate(
            id,
            {
                $set: updateObj
            },
            {
                new: true
            }
        )
        return res.status(200).json({
            message: 'Profile updated successfully',
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            message: "An error occured. Please try again",
            error: err.message,
        });
    }

}

// Change password
exports.change_password = async (req, res) => {
    const objValidation = new niv.Validator(req.body, {
        old_password: 'required',
        new_password: 'required'
    })
    const match = await objValidation.check();
    if (!match || match === false) {
        return res.status(422).json({
            message: "Validation error",
            errors: objValidation.errors
        })
    }

    let old_password = req.body.old_password;
    let new_password = req.body.new_password;

    const id = req.params.id;

    const admin = req.adminData;

    try {
        const passwordResult = await bcrypt.compare(old_password, admin.password)
        if (passwordResult === false) {
            return res.status(500).json({
                message: 'Your old password is incorrect',
            })
        }

        const hash = await bcrypt.hash(new_password, 10)

        const result = await AdminModel.findByIdAndUpdate(
            id,
            {
                $set: { password: hash },
            }
        )

        return res.status(200).json({
            message: 'Password changed successfully',
            admin: result,
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Error occurred, Please try again later',
        })
    }
}

exports.getAdminDetail = async (req, res) => {
    let id = req.params.id;
    console.log(id, "id");

    try {
        let result = await AdminModel.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    flag: { $in: [1, 2] }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    flag: 1,
                    profile_pic: 1,
                    createdAt: 1,
                },
            }
        ]);

        // result = result[0];
        if (!result) {
            return res.status(500).send({
                message: "Admin doesn't exist",
            });
        }

        result.profile_pic = await Helper.getValidImageUrl(
            result.profile_pic,
            result.username
        );

        return res.status(200).json({
            message: "Admin detail fetch successfully",
            result: result
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: error.message,
        });
    }
}