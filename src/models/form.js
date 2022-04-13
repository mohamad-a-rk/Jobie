const mongoose = require('mongoose')
const validator = require('validator')
const Response = require('./response')

const FormSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        maxlength: 500
    },
    deadline: {
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
    jobType: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    field: {
        type: String,
    },
    location: {
        city: {
            type: String
        },
        country: {
            type: String
        }
    },
    email: {
        type: String,
        required: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is not valid')
            }
        }
    },
    phone: {
        type: String,
        minlength: 8
    },
    requirements: [
        {
            type: String
        }
    ],
    details: {
    }
})

FormSchema.methods.toJSON = function () {
    const formObject = this.toObject()
    formObject.submitters = 0
    Response.count({}, (err, count) => {
        formObject.submitters = count
    })
    return formObject
}
const Form = mongoose.model("Form", FormSchema)
module.exports = Form
