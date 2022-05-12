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
        // skill: {
            type: String
        // }
    }],

}, { discriminatorKey: 'userType' })

FreeLancerSchema.virtual('feedbacks', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'freelancer'
})


const FreeLancer = general.discriminator('FreeLancer', FreeLancerSchema)
module.exports = FreeLancer