const RestroModel = require("../models/restaurant");
const mongoose = require("mongoose");
const niv = require("node-input-validator")
const Helper = require("../helper/helper");

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

        for (let i = 0; i < result.docs.length; i++) {
            const element = result.docs[i];
            // For single image
            if (element?.cover_photo) {
                element.cover_photo = await Helper.getValidImageUrl(element.cover_photo)
            };
            // For multiple images
            if (element.photos) {
                for (let j = 0; j < element.photos.length; j++) {
                    element.photos[j] = await Helper.getValidImageUrl(element.photos[j])
                }
            }
        };

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
        //For single image upload
        // createObj.cover_photo = req.file.path;

        // For single image but with multiple photos upload field
        createObj.cover_photo = req.files.cover_photo[0].path;

        // For multi image upload with single/multiple photo upload field 
        if (req.files) {
            createObj.photos = [];
            // for (i of req.files.photos) {
            //     createObj.photos.push(i.path)
            // }
            req.files.photos.map((file) => {
                createObj.photos.push(file.path)
            })
        }

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
            error: error.message,
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
        //For single image upload single(req.file.path)/multiple(req.files)
        // if (req.file) updateObj.cover_photo = req.file.path
        if (req.files.cover_photo) updateObj.cover_photo = req.files.cover_photo[0].path

        // For multiple image upload with single(req.files)/multiple(req.files) photo upload field
        if (req.files) {
            let images = [];

            const existingImages = await RestroModel.findById(id);
            images = existingImages.photos;

            req.files.photos.map((file) => {
                images.push(file.path)
            })
            updateObj.photos = images
        }

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
            result: result,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: error.message,
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

exports.getRestaurantDetail = async (req, res) => {
    let id = req.params.id;

    if (id.length < 24) {
        return res.status(400).json({
            message: `There is no data with this ${id}`
        })
    }

    let mongooseId = await RestroModel.findOne({
        _id: id
    })
    if (id.length === 24 && mongooseId === null) {
        return res.status(400).json({
            message: `${id} is not matching to our database`
        })
    }

    let matchObj = {};
    matchObj._id = new mongoose.Types.ObjectId(id);
    matchObj.flag = { $in: [1, 2] }

    try {
        const result = await RestroModel.aggregate([
            {
                $match: matchObj
            },
            {
                $project: {
                    en_name: 1,
                    address: 1,
                    phone_number: 1,
                    photos: 1,
                    cover_photo: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            },
        ]);

        const element = result[0];
        if (element?.cover_photo) {
            element.cover_photo = await Helper.getValidImageUrl(element.cover_photo);
        }
        if (element?.photos && element?.photos?.length > 0) {
            for (let i = 0; i < element.photos.length; i++) {
                element.photos[i] = await Helper.getValidImageUrl(element.photos[i]);
            }
        }

        return res.status(200).json({
            message: "Restaurant data has been succesfully retrieved",
            result: result[0]
        });
    } catch (error) {
        return res.status(400).json({
            message: `Error in fetching details ${error.message}`
        })
    }
}