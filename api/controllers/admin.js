const mongoose = require("mongoose");
const niv = require("node-input-validator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require("moment")

// import helper
const Helper = require("../helper/helper");
const sendEmail = require('../helper/sendEmail')

// import admin, otp model
const AdminModel = require("../models/admin");
const EmailOtpModel = require("../models/emailOtp")

// Sign Up API
exports.signUp = async (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body

    const objValidation = new niv.Validator(req.body, {
        name: 'required|maxLength:10',
        email: 'required|email',
        password: 'required',
        role: 'required|integer'
    });

    const matched = await objValidation.check();
    if (!matched || matched === false) {
        return res.status(422).send({
            message: "Validation error",
            errors: objValidation.errors,
        })
    }

    const adminData = await AdminModel.find({ email: email, flag: 1 })

    if (adminData.length > 0 || adminData[0]?.email === email) {
        return res.status(409).json({
            message: 'Email already exists',
        })
    }

    const hash = await bcrypt.hash(password, 10);

    try {

        let createAdminObj = {
            name: name,
            email: email,
            password: hash,
            role: role
        }

        let successMessage = "";
        if (role === 1) {
            // successMessage = "Admin account has been successfully created, please check email to verify your account";
            successMessage = "Admin account has been successfully created";
        } else {
            // successMessage = "User account has been successfully created, please check email to verify your account";
            successMessage = "User account has been successfully created";
        }

        const newAdmin = new AdminModel(createAdminObj);
        await newAdmin.save();

        return res.status(201).json({
            message: successMessage,
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

        const adminData = await AdminModel.findOne({ email: email, flag: [1, 2] })

        if (adminData === null) {
            return res.status(401).send({
                message: 'Invalid Email',
            })
        }
        if (adminData && adminData?.flag === 2) {
            return res.status(401).send({
                message: 'Account Deactivated, Please verify your account or contact admin',
            })
        }

        const passwordMatch = await bcrypt.compare(password, adminData.password);
        if (passwordMatch === false) {
            return res.status(401).send({
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
                expiresIn: '10d'
            }
        )

        return res.status(200).send({
            admin: adminData,
            message: 'Admin has been successfully login',
            token: token,
        })
    } catch (error) {
        return res.status(500).send({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

// Auth api
exports.auth = async (req, res) => {
    try {
        const admin = req.adminData;

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

exports.sendMail = async (req, res) => {
    const {
        email,
        resend
    } = req.body

    const objValidation = new niv.Validator(req.body, {
        email: 'required|email',
        resend: 'required|in:1,2', // 1 = send 2 = resend
    })
    const matched = await objValidation.check()
    if (!matched) {
        return res.status(422).json({
            message: 'Validation error',
            error: objValidation.errors,
        })
    }

    const emailCheck = await AdminModel.findOne({
        email: {
            $regex: email,
            $options: 'i'
        }
    })
    if (emailCheck === null || !emailCheck) {
        return res.status(422).send({
            message: "No account match with this email"
        })
    }

    try {
        const alreadySendEmail = await EmailOtpModel.findOne({
            email: {
                $regex: email,
                $options: "i"
            }
        })
        if (alreadySendEmail?.email === email && resend === "1") {
            return res.status(400).send({
                message: "OTP mail already send"
            })
        }

        let otp = Helper.generateRandomString(6, true);

        let emailOtpObj = {
            email: email,
            code: otp
        }

        let message = 'OTP has been successfully sent to email'
        if (resend == 2) {
            message = 'OTP has been successfully resent to email'
        }

        const subject = `Confirm your email address`;

        let checkEmailSend = await EmailOtpModel.findOne({
            email: {
                $regex: email,
                $options: 'i'
            }
        })

        if (checkEmailSend) {
            await EmailOtpModel.findByIdAndUpdate(
                checkEmailSend._id,
                {
                    $set: {
                        code: otp,
                    },
                },
                {
                    new: true,
                }
            );
        } else {
            new EmailOtpModel(emailOtpObj).save();
        }

        await sendEmail.sendOtpMail(email, subject, otp);

        return res.status(200).json({
            message: message,
        })
    } catch (error) {
        return res.status(500).json({
            message: 'Error occurred, Please try again later',
            error: err.message,
        })
    }
}

exports.verifyEmail = async (req, res) => {

    const {
        email,
        code
    } = req.body;

    const objValidation = new niv.Validator(req.body, {
        email: "required",
        code: "required"
    })
    const matched = await objValidation.check();
    if (matched === false || !matched) {
        return res.status(422).send({
            message: "Validation error",
            errors: objValidation.errors
        })
    }

    try {
        const userData = await AdminModel.findOne({
            email: email,
            flag: [1, 2]
        })
        var signUpTime = userData?.createdAt;
        var signUpTimeCall = moment(moment(signUpTime).format('YYYY-MM-DD hh:mm:ss'));
        var verifyEmailTime = new Date();
        var apiCallTime = moment(moment(verifyEmailTime).format('YYYY-MM-DD hh:mm:ss'));

        var timeDifference = apiCallTime.diff(signUpTimeCall, 'seconds')

        if (timeDifference >= 120 && userData?.flag === 2) {
            return res.status(422).send({
                message: 'OTP expired, please click on resend otp'
            })
        } else if (userData && userData?.flag === 1 && timeDifference >= 120) {
            return res.status(404).json({
                message: 'OTP has been already verified',
            })
        }

        if (!userData || userData === null) {
            return res.status(404).json({
                message: 'Invalid Code or Email not found',
            })
        }

        const otpData = await EmailOtpModel.findOne({
            email: {
                $regex: email,
                $options: "i"
            }
        })
        if (otpData === null || !otpData) {
            return res.status(404).json({
                message: 'Error occurred, Please try again later',
            })
        }

        let result = "";
        if (otpData && otpData.code === code) {
            result = await AdminModel.updateOne(
                {
                    email: email
                },
                {
                    flag: 1
                }
            )
        } else {
            return res.status(404).json({
                message: 'OTP not matched',
            })
        }

        return res.status(200).json({
            message: 'Your email address has been successfully verified',
            result: result,
        })

    } catch (error) {
        console.log("error", error)
        res.status(500).json({
            message: 'Error occurred, Please try again later',
            error: error,
        })
    }
}