const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Feedback = require('./feedback')
const Form = require('./form')
const Rate = require('./rate')

const GeneralSchema = new mongoose.Schema({
    bio: {
        type: String,
        trim: true,
        maxlength: 300
    },

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
    image: {
        type: Buffer
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(password) {
            if (password.toLowerCase().includes("password")) {
                throw new Error('Weak password')
            }
        }
    },
    prevJobs: [{
        job: {
            companyName: {
                type: String,
                trim: true,
                required: true
            },
            duration: {
                start: {
                    type: Date,
                    required: true
                },
                end: {
                    type: Date,
                    required: true
                }
            },
            location: {
                city: {
                    required: true,
                    type: String
                },
                country: {
                    required: true,
                    type: String
                },
            },
            position: {
                type: String,
                trim: true,
                required: true
            },
            place: {
                type: String,
                trim: true
            },

        }
    }],
    specilization: {
        required: true,
        type: String,
        minlength: 2
    },

    tokens: [{
        token: {
            required: true,
            type: String
        }
    }],
    location: {
        city: {
            required: true,
            type: String
        },
        country: {
            required: true,
            type: String
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
    }]

}, { discriminatorKey: 'userType' })

GeneralSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})

GeneralSchema.pre('remove', async function (next) {  //
    await Feedback.deleteMany({ feedbacker: this._id })
    await Feedback.deleteMany({ freelancer: this._id })
    await Form.deleteMany({ owner: this._id })
    await Rate.deleteMany({ rater: this._id })
    await Rate.deleteMany({ freelancer: this._id })
    next()
})


GeneralSchema.methods.generateAuthToken = async function () {
    let token = jwt.sign({ _id: this._id.toString() }, 'thisIsmySecret')

    this.tokens = this.tokens.concat({ token })
    await this.save()

    return token
}

GeneralSchema.methods.toJSON = function () {
    const userObject = this.toObject()

    delete userObject.tokens
    delete userObject.password
    delete userObject.image

    return userObject
}
GeneralSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("Unable to login")
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error("Unable to login")
    }

    return user
}
const User = mongoose.model("GeneralUser", GeneralSchema)
module.exports = User