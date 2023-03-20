const RestroModel = require("../models/restaurant");
const mongoose = require("mongoose");
const niv = require("node-input-validator")

exports.getRestaurant = async (req, res) => {

    let { page, limit, search } = req.body;

    if (search === undefined) {
        search = ''
    }
    if (page === '' || page === 0 || page === undefined) {
        page = 1
    }
    if (limit === '' || limit === 0 || limit === undefined) {
        limit = 10
    }

    var options = {
        page: page,
        limit: limit
    };

    let matchObj = {};
    matchObj.en_name = { $regex: search, $options: 'i' };
    matchObj.flag = { $in: [1, 2] }

    try {
        const restaurantAggregate = RestroModel.aggregate([
            {
                $match: matchObj
            },           
            // {
            //     $project: {
            //         _id: 1,
            //         en_name : 1,
            //         address: 1,
            //         createdAt: 1                    
            //     }
            // }
        ])

        const result = await RestroModel.aggregatePaginate(
            restaurantAggregate,
            options
        )

        return res.status(200).send({
            message: 'Restaurants fetch successfully',
            result: result,
        })
    } catch (err) {
        return res.status(500).send({
            message: 'Error occurred, Please try again later',
            error: err.message,
        })
    }
}

exports.addRestaurant = async (req, res) => {

    const validator = new niv.Validator(req.body, {
        en_name: "required",
        address: "required",
    });
    const matched = await validator.check();
    if (!matched) {
        return res.status(422).send({
            message: "Validation error",
            errors: validator.errors,
        });
    }

    const {
        en_name,
        address,
        phone_number,
    } = req.body

    try {

        const findSame = await RestroModel.findOne({
            en_name: en_name
        })
        if (findSame) {
            return res.status(422).json({
                message: "Restaurant name already exists"
            })
        }

        let createObj = {}

        createObj.en_name = en_name;
        createObj.address = address;
        createObj.phone_number = phone_number;
        createObj.cover_photo = req.file.path;

        const addNew = new RestroModel(createObj);

        await addNew.save();

        res.status(201).json({
            message: "Restaurant added succesfully",
            result: addNew
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.editRestaurant = async (req, res) => {

    const id = req.params.id;
    // console.log(id, "id")

    const {
        en_name,
        address,
        phone_number,
        cover_photo
    } = req.body


    if (en_name) {
        let sameName = await RestroModel.findOne({
            _id: new mongoose.Types.ObjectId(id),
            en_name: en_name
        })
        if (sameName) {
            return res.status(422).send({
                message: "Restaurant with same name already exists",
            });
        }
    }

    try {

        let updateObj = {}

        if (en_name) updateObj.en_name = en_name
        if (address) updateObj.address = address
        if (phone_number) updateObj.phone_number = phone_number
        if (cover_photo) updateObj.cover_photo = req.file.path

        const result = await RestroModel.findByIdAndUpdate(
            id,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );

        return res.status(201).json({
            message: "Restaurant has been successfully updated",
            result: updateObj,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.deleteRestaurant = async (req, res) => {
    const id = req.params.id;

    let found = await RestroModel.find({
        _id: new mongoose.Types.ObjectId(id)
    })
    if (!found) {
        return res.status(422).send({
            message: "Id does not match",
        });
    }

    let message = "Restaurant has been successfully deleted";

    try {
        if (found) {
            await RestroModel.deleteOne(id);

            res.status(202).json({
                message: message
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.change_status = async (req, res) => {
    const id = req.params.id;

    const Validator = new niv.Validator(req.body, {
        flag: "required|in:1,2",
    });
    const matched = await Validator.check();
    if (!matched) {
        return res.status(422).send({
            message: "Validation error",
            errors: Validator.errors,
        });
    }

    let found = await RestroModel.findOne({
        _id: new mongoose.Types.ObjectId(id)
    })
    if (!found) {
        return res.status(422).send({
            message: "Id does not match",
        });
    }

    const flag = Number(req.body.flag);

    try {

        let updateObj = {
            flag: flag
        }

        let message;
        if (flag == 1) message = "Restaurant has been successfully enabled";
        if (flag == 2) message = "Restaurant has been successfully disabled";

        if (found) {

            const result = await RestroModel.findByIdAndUpdate(
                id,
                {
                    $set: updateObj
                },
                {
                    new: true
                }
            )
            return res.status(201).json({
                message: message,
                result: result
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}