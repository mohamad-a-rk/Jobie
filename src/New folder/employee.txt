const mongoose = require('mongoose')

const general = require('./general')

const EmployeeSchema = new mongoose.Schema({
    gender: {
        type: String,
        trim: true,
    },
    dayOfBirth: {
        type: Date,
    },
    skills: [{

        type: String

    }]
}, { discriminatorKey: 'userType' })

const Employee = general.discriminator('Employee', EmployeeSchema)
module.exports = Employee