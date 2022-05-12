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


BusinessSchema.virtual('forms', {
    ref: 'Form',
    localField: '_id',
    foreignField: 'owner'
})
const Business = general.discriminator('Business', BusinessSchema)
module.exports = Business