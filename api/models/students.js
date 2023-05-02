const mongoose = require("mongoose");
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var studentSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
        },
        name: {
            type: String,
            required: true,
        },
        contact_number: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        flag: {
            type: Boolean,
            default: true //true=activated false=deactivated
        },
        enrolment_number: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

studentSchema.plugin(aggregatePaginate);
studentSchema.plugin(mongoosePaginate);
studentSchema.plugin(AutoIncrement, { inc_field: 'id' });
// studentSchema.plugin(AutoIncrement, {
//     id: 'order_seq',
//     inc_field: "enrolment_number",
//     disable_hooks: false
// });

module.exports = mongoose.model('students', studentSchema);