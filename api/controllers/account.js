// Learned & Implemented from this website
// https://adevait.com/nodejs/build-a-crud-app-with-only-json-files

const fs = require("fs");
const dataPath = './api/data/account.json'

// util functions
const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData)
}
const getAccountData = () => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

exports.getAccount = async (req, res) => {

    try {
        const accounts = await getAccountData()

        return res.status(200).send({
            message: "Account fetch successfully",
            result: accounts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.addNewAccount = (req, res) => {
    try {
        var existAccounts = getAccountData()
        const newAccountId = Math.floor(100000 + Math.random() * 900000)

        existAccounts[newAccountId] = req.body
        saveAccountData(existAccounts);

        return res.status(201).json({
            message: "Account added successfully",
            result: existAccounts[newAccountId]
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.updateAccount = async (req, res) => {
    try {
        var existAccounts = getAccountData()
        fs.readFile(dataPath, 'utf8', (err, data) => {

            const accountId = req.params['id'];
            existAccounts[accountId] = req.body;

            saveAccountData(existAccounts);

            res.status(201).json({
                message: "Post has been successfully updated",
                result: existAccounts[accountId],
            })
        }, true);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}

exports.deleteAccount = async (req, res) => {

    try {
        fs.readFile(dataPath, "utf-8", (err, data) => {
            var existAccounts = getAccountData()

            const userId = req.params['id'];
            delete existAccounts[userId]

            saveAccountData(existAccounts);

            res.status(202).json({
                message: "Post has been successfully deleted",
            })
        }, true)
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}