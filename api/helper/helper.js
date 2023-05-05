exports.generateRandomString = (length, isNumber = false) => {
    var result = "";
    if (isNumber) {
        var characters = "0123456789";
    } else {
        var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
};

exports.getValidImageUrl = async (filename, name = 'SH') => {
    if (!filename) {
        filename =
            'https://ui-avatars.com/api/?name=' +
            name +
            '&rounded=true&background=c39a56&color=fff'
    } else {
        filename = process.env.URL + filename
    }
    return filename
}

exports.getValidPdfUrl = async (filename) => {
    if (filename === "" || filename === undefined || filename === null) {
        filename = "";
    } else {
        filename = process.env.URL + filename;
    }
    return filename;
}

exports.generateEmail = (enrolNumber) => {

    let num = "123456789";
    let loopLength = 4;
    var result = "";

    if (enrolNumber === "" || enrolNumber === undefined) {
        for (let i = 0; i < loopLength; i++) {
            result += num.charAt(Math.floor(Math.random() * loopLength));
        }
        result += "@mailinator.com"
    } else {
        result = enrolNumber + "@mailinator.com"
    }

    return result;
}

exports.writeErrorLog = async (req, error) => {
    console.log(req, 'req parameters');

    const requestURL = req.protocol + "://" + req.get("host") + req.originalUrl;
    const requestBody = JSON.stringify(req.body);
    const date = moment().format("MMMM Do YYYY, h:mm:ss a");
    fs.appendFileSync(
        "errorLog.log",
        "REQUEST DATE : " +
        date +
        "\n" +
        "API URL : " +
        requestURL +
        "\n" +
        "API PARAMETER : " +
        requestBody +
        "\n" +
        "Error : " +
        error +
        "\n\n"
    );
}