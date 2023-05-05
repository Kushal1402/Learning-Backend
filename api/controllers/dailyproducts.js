const DailyProductModel = require("../models/dailyproducts")
const RestroModel = require("../models/restaurant");
const mongoose = require("mongoose");
const niv = require("node-input-validator");
const Helper = require("../helper/helper")
const sendEmail = require('../helper/sendEmail')
const readXlsxFile = require('read-excel-file/node')

exports.getDailyProducts = async (req, res) => {

    let productData = await DailyProductModel.find();

    // let matchObj = {};

    // matchObj.flag = {
    //     $in : [1,2]
    // }

    try {
        return res.status(200).send({
            message: "Products fetch successfully",
            result: {
                docs: productData
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.getDailyProductsPaginate = async (req, res, next) => {
    let { page, limit, search, min, max, category, equal_value } = req.query;

    if (search === undefined) {
        search = ''
    }
    if (category === undefined || category === '') {
        category = ''
    }
    if (page === '' || page === 0 || page === undefined) {
        page = 1
    }
    if (limit === '' || limit === 0 || limit === undefined) {
        limit = 10
    }
    if (min === '' || min === 0 || min === undefined) {
        min = 0
    }
    if (max === '' || max === 0 || max === undefined) {
        max = 100000
    }
    var options = {
        page: page,
        limit: limit,
    }
    let matchObj = {}
    matchObj.name = { $regex: search, $options: 'i' }
    matchObj.flag = { $in: [1, 2] }
    matchObj.price = { $lt: Number(max), $gt: Number(min) }
    matchObj.category = { $regex: category, $options: 'i' }
    /* 
        options i => Case insensitivity to match upper and lower cases,
                  => (?i) begins a case-insensitive match, (?-i) ends a case-insensitive match
        options m => For patterns that include anchors (i.e. ^ for the start, $ for the end), match at the beginning or end of each line for strings with multiline
        options x => Extended capability to ignore all white space characters in the $regex
        options s => Allows the dot character (i.e. *.*) to match all characters including newline characters
    */
    // matchObj.price = { $lte: 150 }
    // matchObj.price = { $gt: 150 }
    // matchObj.price = { $eq: equal_value}
    // matchObj.category = { $text : {$search : "\"Apple\""} }

    try {

        // const platformAggregate = DailyProductModel.aggregate([
        //     {
        //         $match: matchObj,
        //     },
        //     // { $sort: { name: 1 } },    

        //     // {
        //     //     $match: { name: "Apple" }
        //     // },            

        //     // {
        //     //     $group : {_id: '$brand', total: {$sum: '$price' }}
        //     // },
        //     // { $sort: { total: 1 } },

        //     // {
        //     //     $unwind : {path : "$brand", preserveNullAndEmptyArrays : true}
        //     //     // $unwind : "$brand"
        //     // },

        //     // {
        //     //     $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
        //     //     // $unwind : "$brand"
        //     // },
        //     // {
        //     //     $group: { _id: '$category', total: { $sum: '$price' } }
        //     // },

        //     {
        //         $lookup: {
        //             from: 'restaurants',
        //             as: 'RestaurantData',
        //             let: { restroId: '$restroId' },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ["$_id", "$$restroId"] },
        //                                 {
        //                                     $eq: ["$flag", 1],
        //                                 },
        //                             ],
        //                         },
        //                     },
        //                 },
        //             ]
        //         }
        //     },
        //     { $unwind: { path: "$RestaurantData", preserveNullAndEmptyArrays: true } },

        //     {
        //         $project: {
        //             _id: 1,
        //             name: 1,
        //             brand: 1,
        //             price: 1,
        //             category: 1,
        //             cover_photo: 1,
        //             flag: 1,
        //             // RestaurantData: 1,
        //             RestaurantData: {
        //                 en_name: 1, address: 1, phone_number: 1, cover_photo: 1, photos: 1,
        //                 flag: 1
        //             },
        //             createdAt: 1
        //         }
        //     }
        // ])

        const productAggregate = DailyProductModel.aggregate([
            {
                $match: matchObj,
            },
            {
                $lookup: {
                    from: 'restaurants',
                    as: 'RestaurantData',
                    localField: 'restroId',
                    foreignField: '_id'
                }
            },
            { $unwind: { path: "$RestaurantData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    brand: 1,
                    price: 1,
                    category: 1,
                    cover_photo: 1,
                    flag: 1,
                    // RestaurantData: 1,
                    RestaurantData: {
                        en_name: 1, address: 1, phone_number: 1, cover_photo: 1, photos: 1,
                        flag: 1
                    },
                    createdAt: 1
                }
            }
        ])

        // const productAggregate = DailyProductModel.aggregate([
        //     {
        //         $match: matchObj,
        //     },
        //     {
        //         $lookup: {
        //             from: 'restaurants',
        //             as: 'RestaurantData',
        //             let: { restroId: '$restroId' },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: {
        //                             $and: [
        //                                 { $eq: ["$_id", "$$restroId"] },
        //                                 { $eq: ["$flag", 1] },
        //                             ]
        //                         }
        //                     }
        //                 }
        //             ]
        //         }
        //     },
        //     { $unwind: { path: "$RestaurantData", preserveNullAndEmptyArrays: true } },
        //     {
        //         $project: {
        //             _id: 1,
        //             name: 1,
        //             brand: 1,
        //             price: 1,
        //             category: 1,
        //             cover_photo: 1,
        //             flag: 1,
        //             // RestaurantData: 1,
        //             RestaurantData: {
        //                 en_name: 1, address: 1, phone_number: 1, cover_photo: 1, photos: 1,
        //                 flag: 1
        //             },
        //             createdAt: 1
        //         }
        //     }
        // ])

        const result = await DailyProductModel.aggregatePaginate(
            productAggregate,
            options
        )

        // appending the live image url
        for (let i = 0; i < result.docs.length; i++) {
            const element = result.docs[i];
            if (element?.cover_photo) {
                element.cover_photo = await Helper.getValidImageUrl(element.cover_photo, element.name)
            }
            if (element?.RestaurantData?.cover_photo) {
                element.RestaurantData.cover_photo = await Helper.getValidImageUrl(element.RestaurantData.cover_photo)
            }
            if (element?.RestaurantData?.photos) {
                for (let j = 0; j < element.RestaurantData.photos.length; j++) {
                    element.RestaurantData.photos[j] = await Helper.getValidImageUrl(element.RestaurantData.photos[j])
                }
            }
        };

        return res.status(200).send({
            message: 'Products fetch successfully',
            result: result,
        })
    } catch (err) {
        return res.status(500).send({
            message: 'Error occurred, Please try again later',
            error: err.message,
        })
    }
}

exports.addDailyProducts = async (req, res) => {

    const {
        name,
        brand,
        price,
        category,
        restroId
    } = req.body

    const validator = new niv.Validator(req.body, {
        name: "required",
    });
    const matched = await validator.check();

    if (!matched || matched === false) {
        return res.status(422).send({
            message: "Validation error",
            errors: validator.errors,
        });
    }
    try {
        // logged in data coming from middleware .
        const loggedInUser = req.adminData;
        // const restaurantData = await RestroModel.findById({ _id: restroId }).select('en_name address phone_number flag')

        const Productdata = await DailyProductModel.findOne({
            name: name,
        });
        if (Productdata) {
            return res.status(422).json({
                message: "Product name already exist",
            });
        }

        const orderId = await Helper.generateRandomString(8);

        let createObj = {}
        //     name: name,
        //     brand: brand,
        //     price: Number(price),
        //     category: category
        // }

        createObj.name = name;
        // For single
        // createObj.brand = brand;

        // For multiple
        createObj.brand = brand.split(",").map((val) => val.trim());
        createObj.price = price;
        createObj.category = category;
        createObj.restroId = restroId;
        createObj.cover_photo = req.file.path;

        const result = new DailyProductModel(createObj);
        result.order_num = orderId;

        await result.save();

        const subject = `Added product ${createObj.name} - ₹${price}`;
        const emailBody = result;

        await sendEmail.sendProductMail(`${loggedInUser?.email}`, subject, emailBody);

        return res.status(201).json({
            message: "Product is successfully added, Mail send",
            result: result,
        });
    } catch (error) {
        // console.log(err);
        res.status(500).json({
            message: "An error occured. Please try again",
            error: error.message,
        });
    }
}

exports.editDailyProducts = async (req, res) => {

    const id = req.params.id;

    const {
        name,
        brand,
        price,
        category,
        cover_photo,
        restroId
    } = req.body

    if (name) {
        const Productdata = await DailyProductModel.findOne({
            _id: new mongoose.Types.ObjectId(id),
            name: name,
        });
        // console.log(Productdata, "Productdata")
        if (Productdata) {
            return res.status(422).json({
                message: "Product name already exist",
            });
        }
    }

    try {

        let updateObj = {}
        // name: name,
        // brand: brand,
        // price: Number(price),
        // category: category
        // }

        if (name) updateObj.name = name;

        // For single
        // if (brand) updateObj.brand = brand;

        // For multiple
        if (brand) updateObj.brand = brand.split(",").map((val) => val.trim());

        if (price) updateObj.price = price;
        if (category) updateObj.category = category;
        if (restroId) updateObj.restroId = restroId;
        if (req.file) updateObj.cover_photo = req.file.path;

        const result = await DailyProductModel.findByIdAndUpdate(
            id,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );
        return res.status(201).json({
            message: "Product updated successfully",
            result: result,
        });
    } catch (err) {
        return res.status(500).json({
            message: "An error occured. Please try again",
            error: err.message,
        });
    }
}

// Delete From Database
exports.deleleDailyProducts = async (req, res) => {
    const id = req.params;
    // console.log(id, "id")

    let message = "Product has been successfully deleted";

    try {
        await DailyProductModel.deleteOne(id)
        // console.log(productData, "productData")

        return res.status(202).json({
            message: message
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: error.message,
        });
    }

}

// Only Flag===3 as Delete API
exports.deleteFlagProduct = async (req, res) => {
    const id = req.params.id;
    console.log(id, "id");
    console.log(req.body, "req.body");

    const flag = req.body.flag;

    const validator = new niv.Validator(req.body, {
        flag: "required|in:3"
    })
    const matched = await validator.check();
    console.log(matched, "matched")

    if (!matched) {
        return res.status(422).send({
            message: "Validation error",
            errors: validator.errors,
        });
    };

    let updateObj = {
        flag: flag
    };

    try {
        let message;

        if (flag === 3) message = "Product has been successfully deleted";

        const element = await DailyProductModel.findByIdAndUpdate(
            id,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );

        return res.status(200).send({
            message: message
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: error.message,
        });
    }
}

exports.change_status = async (req, res) => {
    const id = req.params.id;
    // console.log(id, "id");

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

    if (id) {
        const Productdata = await DailyProductModel.findOne({
            _id: new mongoose.Types.ObjectId(id),
        });
        // console.log(Productdata, "Productdata exist or not")
        if (!Productdata || Productdata === null) {
            return res.status(422).json({
                message: "There is no product with this id",
            });
        }
    }

    const flag = Number(req.body.flag);

    let updateObj = {};

    updateObj.flag = flag

    try {
        let message;
        if (flag == 1) message = "Product has been successfully enabled";
        if (flag == 2) message = "Product has been successfully disabled";

        const result = await DailyProductModel.findByIdAndUpdate(
            id,
            {
                $set: updateObj
            },
            {
                new: true
            }
        );

        return res.status(202).json({
            message: message,
            result: result,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error occurred, Please try again later",
            error: error.message,
        });
    }
}

exports.getDetailDailyProduct = async (req, res) => {
    const id = req.params.id;
    // console.log(id, "id")

    let matchObj = {}
    matchObj._id = new mongoose.Types.ObjectId(id);
    matchObj.flag = { $in: [1, 2] }

    try {
        // The very basic way :
        // let result = await DailyProductModel.findOne(matchObj)

        // The basic lookup method
        // let result = await DailyProductModel.aggregate([
        //     {
        //         $match: matchObj,
        //     },
        //     {
        //         $lookup: {
        //             from: 'restaurants',
        //             as: 'RestaurantData',
        //             localField: "restroId",
        //             foreignField: "_id"
        //         }
        //     },
        //     { $unwind: { path: "$RestaurantData", preserveNullAndEmptyArrays: true } },
        //     {
        //         $project: {
        //             name: 1,
        //             brand: 1,
        //             price: 1,
        //             cover_photo: 1,
        //             category: 1,
        //             RestaurantData: 1
        //         }
        //     }
        // ])

        // The pipeline method in lookup
        let result = await DailyProductModel.aggregate([
            {
                $match: matchObj,
            },
            {
                $lookup: {
                    from: 'restaurants',
                    as: 'RestaurantData',
                    let: { restroId: '$restroId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$_id", "$$restroId"] },
                                        {
                                            $eq: ["$flag", 1],
                                        },
                                    ],
                                }
                            }
                        },
                        {
                            $project: {
                                en_name: 1,
                                address: 1,
                                photos: 1,
                                phone_number: 1,
                                cover_photo: 1,
                                flag: 1
                            }
                        }
                    ]
                }
            },
            { $unwind: { path: "$RestaurantData", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    name: 1,
                    brand: 1,
                    price: 1,
                    cover_photo: 1,
                    category: 1,
                    RestaurantData: 1
                }
            }
        ])

        // for (let i = 0; i < result.length; i++) {
        const element = result[0];
        if (element.cover_photo) {
            element.cover_photo = await Helper.getValidImageUrl(element.cover_photo);
        }
        if (element.RestaurantData?.cover_photo) {
            element.RestaurantData.cover_photo = await Helper.getValidImageUrl(
                element.RestaurantData.cover_photo
            );
        }
        if (element?.RestaurantData?.photos) {
            for (let j = 0; j < element.RestaurantData.photos.length; j++) {
                element.RestaurantData.photos[j] = await Helper.getValidImageUrl(element.RestaurantData.photos[j])
            }
        }
        // }

        return res.status(200).json({
            message: "Product Detail has been retrieved ",
            result: result[0]
        });
    } catch (error) {
        return res.status(400).json({
            message: `Error occured due to ${error.message}`
        })
    }
}

exports.addXlxsData = async (req, res) => {
    try {
        // console.log(req.file, "file obj")
        let newArray = [];

        const dataRows = await readXlsxFile(req.file.path);

        // This line is used to skip the header line
        dataRows.shift();

        // await dataRows.map(async (row) => {
        //     const validator = new niv.Validator(row[0], {
        //         name: "required"
        //     })
        //     const matched = await validator.check();
        //     if (!matched || matched === false) {
        //         return res.status(422).send({
        //             message: "Validation error",
        //             errors: validator.errors,
        //         });
        //     }
        // })

        // await dataRows.map(async (row) => {
        //     const productName = await DailyProductModel.findOne({
        //         name: row[0]
        //     })
        //     console.log(productName, 'productName')
        //     if (productName) {
        //         return res.status(422).json({
        //             message: "Product name already exist",
        //         });
        //     }
        // })

        await dataRows.map(async (row) => {
            const newState = {
                name: row[0],
                brand: row[1].split(",").map((val) => val.trim()),
                restroId: row[2].toString(),
                price: row[3],
                cover_photo: `uploads/category/${row[4]}`,
                category: row[5],
            };
            newArray.push(newState);
        })

        // console.log(newArray, "newArray")

        // For single upload
        // const result = new DailyProductModel(newArray[0]);
        // await result.save();

        // For multiple upload
        await DailyProductModel.insertMany(newArray);
        // console.log(result, "result");

        return res.status(201).json({
            message: "Product is successfully added",
            // result: result,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Could not read the file: " + error,
        });
    }
}