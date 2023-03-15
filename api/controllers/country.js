const fs = require("fs");

// Get country
exports.getCountry = async (req, res) => {
    try {
        const jsonData = fs.readFileSync("country.json", "utf-8")
        const parsedJson = JSON.parse(jsonData)

        return res.status(200).send({
            message: 'Country successfully fetched',
            result: parsedJson
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occurred, Please try again later",
            error: err,
        });
    }
}