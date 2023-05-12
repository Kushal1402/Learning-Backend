const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate-v2");

const NotificationSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },
        admin_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "admin",
            required: true
        }
    },
    {
        timestamps: true
    }
)

NotificationSchema.plugin(mongoosePaginate);
NotificationSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("push_notify", NotificationSchema);