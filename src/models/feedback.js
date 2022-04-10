const mongoose = require('mongoose')


const FeedbackSchema = new mongoose.Schema({
    Text: {
        type: String,
        maxlength: 300
    },
    rate: {
        type: Number,
        max: 5
    },
    feedbacker: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Business'

    },
    freelancer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'FreeLancer'

    }
})

const Feedback = mongoose.model("Feedback", FeedbackSchema)

module.exports = Feedback