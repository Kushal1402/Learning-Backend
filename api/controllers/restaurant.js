const fs = require("fs");
const dataPath = './api/data/restaurant.json'
const niv = require("node-input-validator");
const { v4: uuidv4 } = require('uuid');

exports.getRestaurant = (req, res) => {
    const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    // console.log(limit, "limit")
    // const search = req.query.search;
    // console.log(search, "search");

    // const searchedData = pureData.find((item) => {
    //     return item.en_name === search;
    // })
    // console.log(searchedData, "searchedData")

    const startIndex = (page - 1) * limit;
    // console.log(startIndex, "startIndex")
    const endIndex = page * limit;
    // console.log(endIndex, "endIndex")

    const result = pureData.slice(startIndex, endIndex);
    // console.log(result.length, "result length")

    const totalDocs = result.length > 0 ? pureData.length : 0;
    // console.log(totalDocs, "totalDocs length")

    const nextPage = result.length >= limit ? (Number(page) + 1) : null;
    // console.log(nextPage, "nextPage")
    const prevPage = page === 1 ? null : null || result.length <= limit ? (Number(page) - 1) : null;

    const hasNextPage = endIndex < pureData.length ? true : false
    const hasPrevPage = startIndex >= 1 ? true : false

    // const pagingCounter = page === 1 ? 1 : (page * limit + 1)
    try {
        return res.status(200).send({
            message: "Restaurants fetch successfully",
            result: {
                docs: result,
                // hasPrevPage: true/false value,
                hasNextPage: hasNextPage,
                hasPrevPage: hasPrevPage,
                limit: limit,
                nextPage: nextPage,
                prevPage: prevPage,
                page: page,
                // pagingCounter: pagingCounter,
                totalDocs: totalDocs,
                // totalPages: 3
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

// exports.getRestaurant = (req, res) => {
//     try {
//         return res.status(200).send({
//             message: "Restaurants fetch successfully",
//             result: {
//                 docs: res.paginatedResults,
//                 hasNextPage: res.hasNextPage,
//                 hasPrevPage: res.hasPrevPage,
//                 limit: res.limit,
//                 nextPage: res.nextPage,
//                 prevPage: res.prevPage,
//                 page: res.page,
//                 // pagingCounter: pagingCounter,
//                 totalDocs: res.totalDocs,
//                 // totalPages: 3
//             }
//         })
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Error occurred, Please try again later",
//             error: err,
//         });
//     }
// }

exports.getRestaurantDetail = (req, res) => {

    const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"))

    let found = pureData.find((item) => {
        return item._id === req.params.id;
    });

    try {
        return res.status(200).send({
            message: "Restaurants fetch successfully",
            result: found
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.addRestaurant = async (req, res) => {

    const validator = new niv.Validator(req.body, {
        name: "required",
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
        name,
        en_name,
        address,
        phone_number,
        flag
    } = req.body

    try {
        const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        let createObj = {
            _id: uuidv4(),
            en_name: en_name,
            address: address,
            phone_number: phone_number,
            flag: Number(flag),
            cover_photo: req.file.path,
            createdAt: new Date()
        };

        pureData.push(createObj);
        const stringifyData = JSON.stringify(pureData)
        fs.writeFileSync(dataPath, stringifyData)

        res.status(201).json({
            message: "Restaurant added succesfully",
            result: createObj
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.editRestaurant = (req, res) => {

    const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    // console.log(typeof pureData, "typeof 101")

    const id = req.params.id;
    // console.log(id, "id")

    const {
        en_name,
        address,
        phone_number,
        flag
    } = req.body

    let found = pureData.find(function (item) {
        return item._id === id
    })
    if (!found) {
        return res.status(422).send({
            message: "Id does not match",
        });
    }

    try {

        let updateObj = {
            _id: id,
            en_name: en_name,
            address: address,
            phone_number: phone_number,
            flag: flag,
            cover_photo: req.file.path,
            createdAt: new Date()
        }

        let targetIndex = pureData.indexOf(found);
        // console.log(targetIndex, "targetIndex")

        fs.readFile(dataPath, (err, data) => {

            if (err) throw err;

            const parsedData = JSON.parse(data)
            // console.log(typeof parsedData, "parseedData")
            parsedData.splice(targetIndex, 1, updateObj);

            const stringifyData = JSON.stringify(parsedData)
            fs.writeFileSync(dataPath, stringifyData)
        });

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

exports.deleteRestaurant = (req, res) => {
    const id = req.params.id;

    const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    let found = pureData.find(function (item) {
        return item._id === id;
    })
    if (!found) {
        return res.status(422).send({
            message: "Id does not match",
        });
    }

    let message = "Restaurant has been successfully deleted";

    try {
        if (found) {
            let targetIndex = pureData.indexOf(found);

            fs.readFile(dataPath, (err, data) => {

                if (err) throw err;

                const parsedData = JSON.parse(data)
                // console.log(typeof parsedData, "parseedData")
                parsedData.splice(targetIndex, 1);

                const stringifyData = JSON.stringify(parsedData)
                fs.writeFileSync(dataPath, stringifyData)
            });
        }
        res.status(202).json({
            message: message
        });
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

    const pureData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

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

    let found = pureData.find(function (item) {
        return item._id === id;
    })
    if (!found) {
        return res.status(422).send({
            message: "Id does not match",
        });
    }

    const flag = req.body.flag;

    try {

        let updateObj = {
            flag: flag
        }

        let message;
        if (flag == 1) message = "Restaurant has been successfully enabled";
        if (flag == 2) message = "Restaurant has been successfully disabled";

        if (found) {
            let targetIndex = pureData.indexOf(found);

            Object.assign(found, updateObj)

            pureData[targetIndex] = found;

            fs.writeFile(dataPath, JSON.stringify(pureData), (err) => {
                return res.status(201).json({
                    message: message,
                    result: found
                });
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}