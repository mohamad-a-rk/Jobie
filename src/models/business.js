const mongoose = require('mongoose')
const validator = require('validator')
const general = require('./general')

const BusinessSchema = new mongoose.Schema({
    url: {
        type: String,
        validate(url) {
            if (!validator.isURL(url)) {
                throw new Error('Invalid URL')
            }
        }
    }
}, { discriminatorKey: 'userType' })

BusinessSchema.virtual('feedbacks', {
    ref: 'Feedback',
    localField: '_id',
    foreignField: 'feedbacker'
})

BusinessSchema.virtual('rates', {
    ref: 'Rate',
    localField: '_id',
    foreignField: 'rater'
})

const Business = general.discriminator('Business', BusinessSchema)
module.exports = Business