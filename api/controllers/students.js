//Students Controller
const niv = require("node-input-validator");
const mongoose = require("mongoose");
const Helper = require("../helper/helper");
const StudentModal = require("../models/students");

exports.addStudentData = async (req, res) => {

    const {
        name,
        contact_number,
        enrolment_number,
    } = req.body

    const email = Helper.generateEmail(enrolment_number)

    const validator = new niv.Validator(req.body, {
        name: "required",
        contact_number: "required|maxLength:10",
    })
    const matched = await validator.check();

    if (matched === false) {
        return res.status(422).json({
            message: "Validation error occured",
            errors: validator.errors,
        })
    }

    try {
        const studentDataObj = {};

        const sameData = await StudentModal.find({ name: name });
        if (sameData.length > 0) {
            return res.status(422).json({
                message: "Student data already exists",
            })
        }

        studentDataObj.name = name;
        studentDataObj.contact_number = contact_number;
        studentDataObj.email = email;
        studentDataObj.enrolment_number = enrolment_number;

        const result = new StudentModal(studentDataObj);
        await result.save();

        return res.status(201).json({
            message: "Student data added successfully",
            result: result
        })
    } catch (error) {
        console.log(error, 'error')
        res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

exports.getStudentData = async (req, res) => {
    let { page, limit, search, enrolment_number } = req.query;

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

    matchObj.name = { $regex: search, $options: 'i' };
    matchObj.flag = { $in: [true] }
    if (enrolment_number) matchObj.enrolment_number = { $eq: enrolment_number }

    try {
        // const studentData = await StudentModal.find(matchObj).sort({ createdAt: -1 })

        const studentData = await StudentModal.aggregate([
            {
                $match: matchObj,
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    enrolment_number: 1,
                    contact_number: 1,
                    email: 1,
                    flag: 1
                }
            }
        ])
        /*
            To use aggregatePaginate you can use with modelName.find()/findOne()/findById()...
            BUT when you apply the match query to perform complex data analysis by query parameter or combining tables
            you have to complusory apply MongoDB aggregation . 
        */
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
            error: error.message,
        })
    }
}

exports.editStudentData = async (req, res) => {
    const id = req.params.id;

    const {
        name,
        contact_number,
    } = req.body

    if (name) {
        const Studentdata = await StudentModal.findOne({
            _id: new mongoose.Types.ObjectId(id),
            name: name
        });

        if (Studentdata) {
            return res.status(422).json({
                message: "Student name already exist's"
            });
        }
    }

    try {
        let updateObj = {};

        if (name) updateObj.name = name;
        if (contact_number) updateObj.contact_number = contact_number;

        const result = await StudentModal.findByIdAndUpdate(id, updateObj);

        return res.status(201).json({
            message: `Student data updated successfully`,
            result: result
        });
    } catch (error) {
        return res.status(400).json({
            message: "Some error occured due to" + error.message
        });
    }
}