const mongoose = require("mongoose");

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
    }
);
// mongoose.model("Collection name", schema name)
module.exports = mongoose.model("products", productsSchema)