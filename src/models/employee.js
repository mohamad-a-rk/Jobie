const mongoose = require('mongoose')

const general = require('./general')

const EmployeeSchema = new mongoose.Schema({
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    dayOfBirth: {
        type: Date,
    },
    skills: [{
        skill: {
            type: String
        }
    }]
}, { discriminatorKey: 'userType' })

const Employee = general.discriminator('Employee', EmployeeSchema)
module.exports = Employee