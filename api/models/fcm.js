const mongoose = require('mongoose');
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let mongoosePaginate = require('mongoose-paginate-v2');

const FCMSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            default: null
        },
        type: {
            type: Number,
            default: 1, // 1 = android 2 = IOS
        },
        device: {
            type: String,
            default: '',
        },
        token: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
)

FCMSchema.plugin(aggregatePaginate);
FCMSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('FCM', FCMSchema);