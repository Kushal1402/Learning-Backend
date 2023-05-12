const mongoose = require("mongoose");

const emailOtpSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    code: {
        type: String,
        require: true,
    },
});

module.exports = mongoose.model("email_otp", emailOtpSchema);
