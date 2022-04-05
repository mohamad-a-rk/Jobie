const express = require('express')
const Form = require('../src/models/form')
const auth = require('../middleware/auth')
const app = express.Router()

app.use(express.json())
app.post('/forms', auth, async (req, res) => { // Create a new form

    let form = new Form({
        ...req.body,
        owner: req.user._id
    })
    try {
        let value = await form.save()
        res.send(value)
    }
    catch (error) {
        res.status(400).send(error)
    }
})


app.get('/forms', auth, async (req, res) => {
    const match = {}
    const sort = {} // search by
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.sortBy) {
        let parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'asc' ? 1 : -1
    }

    try {
        await req.user.populate({
            path: 'forms',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

app.get('/tasks/:id', async (req, res) => { // Get a certen task
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
app.patch('/tasks/:id', auth, async (req, res) => { // Update task data
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedChanges = ['description', 'completed']
    let isValidOpreation = updates.every((update) => allowedChanges.includes(update))
    if (!isValidOpreation) {
        res.status(400).send()
    }
    try {
        // let task = await Task.findByIdAndUpdate(_id, req.body, { runValidators: true, new: true })
        let task = await Form.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400).send()
        console.log(error);
    }
})

app.delete('/tasks/:id', auth, async (req, res) => {
    try {
        let task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.send(error).status(500)
    }
})
module.exports = app