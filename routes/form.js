const express = require('express')
const Form = require('../src/models/form')
const auth = require('../src/middleware/auth')
const app = express.Router()

app.use(express.json())
app.post('/forms', auth, async (req, res) => { // Create a new form

    if (req.user.userType != "Business") {
        res.status(401).send()
    } else {
        let form = new Form({
            ...req.body,
            owner: req.user._id
        })
        try {
            let value = await form.save()
            res.send(value)
        }
        catch (error) {
            res.status(400).send(error.toString())
        }
    }
})


// app.get('/forms', auth, async (req, res) => {
//     const match = {}
//     const sort = {} // search by
//     if (req.query.completed) {
//         match.completed = req.query.completed === 'true'
//     }

//     if (req.query.sortBy) {
//         let parts = req.query.sortBy.split(':')
//         sort[parts[0]] = parts[1] == 'asc' ? 1 : -1
//     }

//     try {
//         await req.user.populate({
//             path: 'forms',
//             match,
//             options: {
//                 limit: parseInt(req.query.limit),
//                 skip: parseInt(req.query.skip),
//                 sort
//             }
//         })
//         res.send(req.user.tasks)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

app.get('/forms/:id', async (req, res) => { // Get a certen form
    const _id = req.params.id

    try {
        let value = await Task.find({ _id, owner: req.user._id })
        if (!value) {
            return res.status(404).send()
        }
        res.send(value)
    } catch (error) {
        res.status(500).send(error)
    }
})
app.patch('/forms/:id', auth, async (req, res) => { // Update form data
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedChanges = ['description', 'endDate', 'typeofjob']
    let isValidOpreation = updates.every((update) => allowedChanges.includes(update))
    if (!isValidOpreation) {
        res.status(400).send()
    }
    try {
        let form = await Form.findOne({ _id, owner: req.user._id })
        if (!form) {
            return res.status(404).send()
        }
        updates.forEach((update) => form[update] = req.body[update])
        await form.save()
        res.send(form)
    } catch (error) {
        res.status(400).send(error.toString())
        console.log(error);
    }
})

app.delete('/forms/:id', auth, async (req, res) => {
    try {
        let form = await Form.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!form) {
            return res.status(404).send()
        }
        res.send(form)
    } catch (error) {
        res.send(error).status(500)
    }
})
module.exports = app