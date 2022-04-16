const express = require('express')
const Form = require('../src/models/form')
const Response = require('../src/models/response')
const auth = require('../src/middleware/auth')
const app = express.Router()

app.use(express.json())
app.post('/response', async (req, res) => { // Create a new response
    {
        let response = new Response({
            ...req.body,
        })
        try {
            let value = await response.save()
            res.send(value)
        }
        catch (error) {
            res.status(400).send(error.toString())
        }
    }
})

app.get('/response/me', auth, async (req, res) => {
    try {
        await req.user.populate({
            path: 'responses',
            options: {
                sort: {
                    createdAt: -1
                }
            }
        })
        res.send(req.user.responses)
    }
    catch (e) {
        res.status(500).send(e.toString())

    }
})

app.get('/response/:id', async (req, res) => { // Get a specific Response
    try {
        const id = req.params.id
        const value = await Response.findOne({ _id: id })
        if (!value) {
            res.status(404).send()
        } else {
            res.send(value)
        }
    } catch (e) {
        res.send(e.toString())
    }
})


app.patch('/response/:id', auth, async (req, res) => { // Update response data
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const nonallowedChanges = ['owner', 'form']
    let isInvalidOpreation = updates.every((update) => nonallowedChanges.includes(update))
    if (isInvalidOpreation) {
        res.status(400).send()
    }
    try {
        let response = await Response.findOne({ _id, $or: [{ owner: req.user._id }] })
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

app.delete('/response/:id', auth, async (req, res) => {
    try {
        //Form owner must be able to delete responses

        let response = await Response.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!response) {

            return res.status(404).send()
        }
        res.send(response)
    } catch (error) {
        res.send(error).status(500)
    }
})
module.exports = app