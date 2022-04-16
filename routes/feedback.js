const express = require('express')
const Feedback = require('../src/models/feedback')
const auth = require('../src/middleware/auth')
const app = express.Router()

app.use(express.json())

app.post('/feedback', auth, async (req, res) => { // Create a new feedback
    {
        if (req.user.userType !== "Business") {
            res.status(401).send()
        }
        let feedback = new Feedback({
            ...req.body,
            feedbacker: req.user._id
        })
        try {
            let value = await feedback.save()
            res.send(value)
        }
        catch (error) {
            res.status(400).send(error.toString())
        }
    }
})


app.get('/feedback/me', auth, async (req, res) => {
    try {
        var feedbacks = await Feedback.find({ $or: [{ feedbacker: req.user._id }, { freelancer: req.user._id }] })
        res.send(feedbacks)
    }
    catch (e) {
        res.status(500).send(e.toString())

    }
})

//edited
app.get('/feedback/:id', async (req, res) => { // Get a specific Feedback
    try {
        const id = req.params.id
        const value = await Feedback.find({ freelancer: id }).populate('feedbacker')
        if (!value) {
            res.status(404).send()
        } else {
            res.send(value)
        }
    } catch (e) {
        res.send(e.toString())
    }
})



app.patch('/feedback/:id', auth, async (req, res) => { // Update response data
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedChanges = ['text', 'rate']
    let isvalidOpreation = updates.every((update) => allowedChanges.includes(update))
    if (isvalidOpreation) {
        res.status(400).send()
    }
    try {
        let response = await Feedback.findOne({ _id, feedbacker: req.user._id })
        if (!response) {
            return res.status(404).send()
        }
        updates.forEach((update) => response[update] = req.body[update])
        await response.save()
        res.send(response)
    } catch (error) {
        res.status(400).send(error.toString())
        console.log(error);
    }
})

app.delete('/feedback/:id', auth, async (req, res) => {
    try {
        let feedback = await Feedback.findOneAndDelete({ _id: req.params.id, $or: [{ feedbacker: req.user._id }, { freelancer: req.user._id }] })
        if (!feedback) {

            return res.status(404).send()
        }
        res.send(feedback)
    } catch (error) {
        res.send(error).status(500)
    }
})
module.exports = app