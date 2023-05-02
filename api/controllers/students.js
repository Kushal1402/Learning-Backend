//Students Controller
const niv = require("node-input-validator");
const mongoose = require("mongoose");
const Helper = require("../helper/helper");
const StudentModal = require("../models/students");

exports.addStudentData = async (req, res) => {

    const {
        name,
        contact_number,
        email,
        enrolment_number
    } = req.body

    // const validator = new niv.Validator(req.body, {
    //     name: "required",
    //     contact_number: "required|maxLength:10",
    //     email: "required|email"
    // })
    // const matched = await validator.check();

    // if (matched === false) {
    //     return res.status(422).json({
    //         message: "Validation error occured",
    //         errors: validator.errors,
    //     })
    // }

    try {
        const studentDataObj = {};

        // const sameData = await StudentModal.find({ name: name });
        // if (sameData.length > 0) {
        //     return res.status(422).json({
        //         message: "Student data already exists",
        //     })
        // }

        studentDataObj.name = name;
        studentDataObj.contact_number = contact_number;
        studentDataObj.email = email;
        studentDataObj.enrolment_number = enrolment_number

        const result = new StudentModal(studentDataObj);
        await result.save();

        return res.status(201).json({
            message: "Student data added successfully",
            result: result
        })
    } catch (error) {
        res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

exports.getStudentData = async (req, res) => {
    let { page, limit, search } = req.query;

    if (search === undefined || search === "") {
        search = "";
    }
    if (page === 0 || page === "" || page === undefined) {
        page = 1;
    }
    if (limit === 0 || limit === "" || limit === undefined) {
        limit = 10;
    }

    var options = { page, limit };

    let matchObj = {};

    matchObj.search = { $regex: search, $options: 'i' };
    matchObj.flag = { $in: [false] }

    try {
        const studentData = await StudentModal.find(matchObj);

        const result = await StudentModal.aggregatePaginate(
            studentData,
            options
        )

        return res.status(200).send({
            message: "Student data fetch successfully",
            result: result
        })
    } catch (error) {
        return res.status(500).send({
            message: 'Error occurred, Please try again later',
            error: err.message,
        })
    }
}