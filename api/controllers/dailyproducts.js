const DailyProductModel = require("../models/dailyproducts")
const mongoose = require("mongoose");
const niv = require("node-input-validator");
const dailyproducts = require("../models/dailyproducts");

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

exports.addDailyProducts = async (req, res) => {

    const {
        name,
        brand,
        price,
        category
    } = req.body

    // const validator = new niv.Validator(req.body, {
    //     name: "required",
    // });
    // const matched = await validator.check();

    // if (!matched || matched === false) {
    //     return res.status(422).send({
    //         message: "Validation error",
    //         errors: validator.errors,
    //     });
    // }
    try {
        const Productdata = await DailyProductModel.findOne({
            name: name,
        });
        if (Productdata) {
            return res.status(422).json({
                message: "Product name already exist",
            });
        }

        let createObj = {}
        //     name: name,
        //     brand: brand,
        //     price: Number(price),
        //     category: category
        // }

        createObj.name = name;
        createObj.brand = brand;
        createObj.price = price;
        createObj.category = category;

        const result = new DailyProductModel(createObj);

        await result.save();

        return res.status(201).json({
            message: "Product is successfully added",
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
    // console.log(id, "id")

    const {
        name,
        brand,
        price,
        category
    } = req.body

    if (name) {
        const Productdata = await DailyProductModel.findOne({
            // _id: mongoose.Types.ObjectId(id),
            name: name,
        });
        console.log(Productdata, Productdata)
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
        if (brand) updateObj.brand = brand;
        if (price) updateObj.price = price;
        if (category) updateObj.category = category;

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

exports.change_status = async (req, res) => {
    const id = req.params.id;
    console.log(id, "id");

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

    const flag = Number(req.body.flag);

    let updateObj = {};

    updateObj.flag = flag

    try {
        let message;
        if (flag == 1) message = "Restaurant has been successfully enabled";
        if (flag == 2) message = "Restaurant has been successfully disabled";

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