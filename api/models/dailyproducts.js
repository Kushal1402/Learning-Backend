const mongoose = require("mongoose");
const { Schema } = mongoose;
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let mongoosePaginate = require('mongoose-paginate-v2');

// mongoose.set('strictQuery', true);

const productsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        brand: {
            type: [String],
            default: []
        },
        // brand: {
        //     type: String,
        //     default: ""
        // },
        restroId: {
            type: mongoose.ObjectId,
            // type: mongoose.Schema.Types.ObjectId,
            default: ""
        },
        price: {
            type: Number,
            min: [50, 'Must be greater than 50 ₹'],
            max: [1500, 'Must be less than 1500 ₹'],
            default: "",
        },
        cover_photo: {
            type: String,
            default: ""
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