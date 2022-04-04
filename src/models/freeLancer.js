const mongoose = require('mongoose')

const general = require('./general')

const FreeLancerSchema = new mongoose.Schema({
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
    }],
    rates: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Rate' }

    ],
    feedbacks: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }

    ]

}, { discriminatorKey: 'userType' })

BusinessSchema.virtual('feedbacks', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'freelancer'
})

BusinessSchema.virtual('rates', {
    ref: 'Rate',
    localField: '_id',
    foreignField: 'freelancer'
})

const FreeLancer = general.discriminator('FreeLancer', FreeLancerSchema)
module.exports = FreeLancer