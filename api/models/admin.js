const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: Number,
            required: true,
            default: 1, //1=Admin , 2=User
        },
        profile_pic: {
            type: String,
            default: '',
        },
        flag: {
            type: Number,
            required: true,
            default: 2, // * 1 Actived 2 Deactived
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);