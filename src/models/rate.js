const mongoose = require('mongoose')


const RateSchema = new mongoose.Schema({
    Text: {
        type: Number,
    },
    rater: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Business'

    }
})

const Rate = mongoose.model("Rate", RateSchema)

module.exports = Rate