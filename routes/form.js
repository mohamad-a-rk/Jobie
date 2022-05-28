const express = require('express')
const Form = require('../src/models/form')
const Response = require('../src/models/response')

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


app.get('/forms', async (req, res) => { // Get and search is

    today = new Date()
    const sort = {}
    const search = {}
    if (req.query.sortBy) {
        let parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'asc' ? 1 : -1
    }
    if (req.query.owner) {
        search["owner"] =  req.query.owner
    }

    try {
        var forms = await Form.find({
            deadline: { $gt: today },
            ...search
        }).populate('owner').limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip))
            .sort(sort)

        if (!req.query.title && !req.query.jobType && !req.query.profession && !req.query.place) {
            res.send(forms)
        } else {
            const t = forms.filter((f) => {

                if (req.query.title && req.query.profession && req.query.place && 
                    f.title.toLowerCase().includes(req.query.title) &&
                    f.field.toLowerCase().includes(req.query.profession) &&
                    (f.location.city.toLowerCase().includes(req.query.place) || f.location.country.toLowerCase().includes(req.query.place))
                    ) {
                    return f;
                }
                if (req.query.title && req.query.profession && !req.query.place && 
                    f.title.toLowerCase().includes(req.query.title) &&
                    f.field.toLowerCase().includes(req.query.profession)) {
                    return f;
                }
                if (req.query.title && !req.query.profession && req.query.place && 
                    f.title.toLowerCase().includes(req.query.title) &&
                    (f.location.city.toLowerCase().includes(req.query.place) || f.location.country.toLowerCase().includes(req.query.place))
                    ) {
                    return f;
                }
                if (!req.query.title && req.query.profession && req.query.place && 
                    f.field.toLowerCase().includes(req.query.profession) &&
                    (f.location.city.toLowerCase().includes(req.query.place) || f.location.country.toLowerCase().includes(req.query.place))
                    ) {
                    return f;
                }
                if (req.query.title && !req.query.profession && !req.query.place && 
                    f.title.toLowerCase().includes(req.query.title)) {
                    return f;
                }
                if (!req.query.title && !req.query.profession && req.query.place && 
                    (f.location.city.toLowerCase().includes(req.query.place) || f.location.country.toLowerCase().includes(req.query.place))
                    ) {
                    return f;
                }
                if (!req.query.title && req.query.profession && !req.query.place && 
                    f.field.toLowerCase().includes(req.query.profession)) {
                    return f;
                }

                // if (req.query.title && f.title.toLowerCase().includes(req.query.title)) {
                //     return f;
                // }
                // // if (req.query.jobType && f.jobType.toLowerCase().includes(req.query.jobType)) {
                  
                // //     return f;
                // // }
                // if (req.query.profession && f.field.toLowerCase().includes(req.query.profession)) {
                //     return f;
                // }
                // if (req.query.place && (f.location.city.toLowerCase().includes(req.query.place) || f.location.country.toLowerCase().includes(req.query.place))) {
                //     return f;
                // }

            })

            res.send(t)
        }
    }
    catch (e) {
        res.status(500).send()
        console.log('====================================');
        console.log(e.message);
        console.log('====================================');
    }
})

app.get('/forms/:id', async (req, res) => { // Get a certen form
    const _id = req.params.id

    try {
        let value = await Form.findOne({ _id })
        if (!value) {
            return res.status(404).send()
        }
        const submitters = await Response.count({ form: _id })
        res.send({ value, submitters })
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