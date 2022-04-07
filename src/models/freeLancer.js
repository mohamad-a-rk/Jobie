const mongoose = require('mongoose')

const general = require('./general')

const FreeLancerSchema = new mongoose.Schema({
    gender: {
        type: String,
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

// FreeLancerSchema.virtual('feedbacks', {
// BusinessSchema.virtual('feedbacks', {
//     ref: 'Feedback',
//     localField: '_id',
//     foreignField: 'freelancer'
// })

// FreeLancerSchema.virtual('rates', {
//     ref: 'Rate',
//     localField: '_id',
//     foreignField: 'freelancer'
// })

const FreeLancer = general.discriminator('FreeLancer', FreeLancerSchema)
module.exports = FreeLancer