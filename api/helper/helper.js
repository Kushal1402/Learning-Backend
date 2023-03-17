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