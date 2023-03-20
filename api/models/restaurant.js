const mongoose = require("mongoose");
let aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let mongoosePaginate = require("mongoose-paginate-v2");

const restaurantSchema = new mongoose.Schema(
    {
        en_name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            default: "",
        },
        cover_photo: {
            type: String,
            default: "",
        },
        flag: {
            type: Number,
            default: 1, //1=activated 2=deactivated 3=delete
        },
    },
    {
        timestamps: true,
    }
);

restaurantSchema.plugin(aggregatePaginate);
restaurantSchema.plugin(mongoosePaginate);

// restaurantSchema.index({ location: "2dsphere" });
module.exports = mongoose.model("Restaurant", restaurantSchema);