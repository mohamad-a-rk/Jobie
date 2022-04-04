const mongoose = require('mongoose')
const validator = require('validator')


const ResponseSchema = new mongoose.Schema({
    form: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'Form'
    },
    name: {
        type: String,
        required: true
    },
    Skills: [
        {
            type: String,
        }
    ]
    ,
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Email is incorrect')
            }
        }
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: mongoose.SchemaTypes.Number,
        validate(age) {
            if (age <= 0)
                throw new Error('Age is invalid')
        }
    },
    phone: [{
        phoneNum: {
            type: {
                type: String
            },
            number: {
                type: String
            }
        }
    }],
    specilization: {
        required: true,
        type: String
    },
    location: {
        city: {
            required: true,
            type: String
        },
        country: {
            required: true,
            type: String
        }
    }
})
const Response = mongoose.model("Response", ResponseSchema)
module.exports = Response