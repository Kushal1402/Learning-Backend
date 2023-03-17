const mongoose = require("mongoose");

let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let mongoosePaginate = require('mongoose-paginate-v2');

const productsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        brand: {
            type: String,
            default: ""
        },
        price: {
            type: Number,
        },
        category: {
            type: String,
            default: ""
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

productsSchema.plugin(aggregatePaginate);
productsSchema.plugin(mongoosePaginate);

// mongoose.model("Collection name", schema name)
module.exports = mongoose.model("products", productsSchema)