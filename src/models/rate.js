const mongoose = require('mongoose')


const RateSchema = new mongoose.Schema({
    Text: {
        type: number,
    },
    rater: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Business'

    },
    freelancer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'FreeLancer'
    }
})

const Rate = mongoose.model("Rate", RateSchema)

module.exports = Rate