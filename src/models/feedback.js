const mongoose = require('mongoose')


const FeedbackSchema = new mongoose.Schema({
    Text: {
        type: String,
        maxlength: 300
    },
    feedbacker: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Business'

    }
})

const Feedback = mongoose.model("Feedback", FeedbackSchema)

module.exports = Feedback