const mongoose = require('mongoose')


const FormSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    endDate: {
        type: Date,
        validate(endDate) {
            let today = new Date()
            if (today.getTime() > endDate.getTime()) {
                throw new Error('Invalid date')
            }
        }
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Business'
    },
    typeofjob: {
        type: String,
        required: true
    },
    field: {
        type: String,
    }
})
const Form = mongoose.model("Form", FormSchema)
module.exports = Form