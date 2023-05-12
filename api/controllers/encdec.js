var CryptoJS = require("crypto-js");

exports.encryptData = async (req, res) => {

    const { input, secretKey } = req.body;

    let result = ""

    if (input && secretKey) {
        result = CryptoJS.AES.encrypt(JSON.stringify(input), secretKey).toString();

        let hashValue = CryptoJS.SHA256(input).toString(CryptoJS.enc.Base64)
    } else {
        return res.status(422).json({
            message: "Error"
        })
    }

    return res.status(200).send({
        message: "Encrypted Data",
        result: result
    });
}

exports.decryptData = async (req, res) => {
    const { encryptinput } = req.body;

    let data = ""
    if (encryptinput && secretKey) {
        const byteData = CryptoJS.AES.decrypt(encryptinput, secretKey);
        data = byteData.toString(CryptoJS.enc.Utf8);
    } else {
        return res.status(422).send({
            message: "Error"
        })
    }

    if (data === "" || !data) {
        return res.status(422).send({
            message: "Decryption error due to secret-key not match"
        })
    }

    return res.status(200).json({
        message: "Decrypted Data",
        result: data
    });
}