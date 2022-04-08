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


app.get('/forms', async (req, res) => {
    today = new Date()
    const sort = {}
    if (req.query.sortBy) {
        let parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'asc' ? 1 : -1
    }
    try {
        var forms = await Form.find({
            deadline: { $gt: today }
        }).limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)
        // if (req.cookies.field) {
        //     forms = forms.filter((form) => {
        //         !form.title.includes(req.cookies.field)
        //     })
        // }
        res.send(forms)
    }
    catch (e) {
        res.status(500).send()
        console.log('====================================');
        console.log(e);
        console.log('====================================');
    }
})

app.get('/forms/:id', async (req, res) => { // Get a certen form
    const _id = req.params.id

    try {
        let value = await Form.find({ _id })
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
    const nonallowedChanges = ['owner']
    let isInvalidOpreation = updates.every((update) => nonallowedChanges.includes(update))
    if (isInvalidOpreation) {
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