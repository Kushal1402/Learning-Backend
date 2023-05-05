const mongoose = require("mongoose");
let aggregatePaginate = require('mongoose-aggregate-paginate-v2');
let mongoosePaginate = require('mongoose-paginate-v2');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        enrolment_number: {
            type: Number,
            unique: true,
            required: true
        },
        contact_number: {
            type: String,
            required: true
        },
        email: {
            type: String,
        },
        flag: {
            type: Boolean,
            default: true //true=activated false=deactivated
        },
    },
    {
        timestamps: true
    }
);

studentSchema.plugin(aggregatePaginate);
studentSchema.plugin(mongoosePaginate);

// For indexing the collection(table) either give `UNIQUE:TRUE` in the fields or define modelName.index() like the next line 
// studentSchema.index({ enrolment_number: 1, email: 1 });

// studentSchema.plugin(AutoIncrement, { inc_field: 'id' });
// studentSchema.plugin(AutoIncrement, {
//     id: 'order_seq',
//     inc_field: "enrolment_number",
//     disable_hooks: false
// });

module.exports = mongoose.model('students', studentSchema);