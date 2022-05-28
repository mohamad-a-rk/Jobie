const express = require('express')
const User = require('../src/models/general')
const Business = require('../src/models/business')
const FreeLancer = require('../src/models/freeLancer')
const Employee = require('../src/models/employee')
const bcrypt = require('bcryptjs')


const auth = require('../src/middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const sendEmail = require('../src/emails/account')
const { response } = require('express')

const app = express.Router()
app.use(express.json())

let upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('You must upload a jpg/jpeg files only'))
    }
    cb(undefined, true)
  }
})

app.post('/users', async (req, res) => {
  console.log(req.body)//insert a new user
  let user = undefined
  if (req.body.userType == 'Business') {
    user = new Business(req.body)
  } else if (req.body.userType == 'Employee') {
    user = new Employee(req.body)
  } else if (req.body.userType == 'FreeLancer') {
    user = new FreeLancer(req.body)
  } else {
    res.status(400).send()
  }
  try {
    let value = await user.save()
    let token = await user.generateAuthToken()
    res.send({ value, token })
    sendEmail.sendWelcomeMassege(user.email, user.name)
  } catch (e) {
    res.status(500).send()
    console.log(e);
  }
})

app.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
    console.log(e)
  }
})
app.post('/users/login', async (req, res) => {
  try {
    let user = await User.findByCredentials(req.body.email, req.body.password)
    let token = await user.generateAuthToken()
    res.cookie('field', user.specialization).send({ token, user })
  } catch (e) {
    res.status(400).send(e)
    console.log(e);
  }
})


app.get('/users', async (req, res) => { // Get all users 

  try {
    const search = {}

    if (req.query.userType) {
      search["userType"] = req.query.userType
    }
    // if (req.query.name) {
    //   search["name"] = req.query.name
    // }
    // if (req.query.specialization) {
    //   search["specialization"] = req.query.specialization
    // }
    let value = await User.find({
      ...search
    })

    // console.log(req.query.userType, req.query.name, req.query.specialization, req.query.place)
    if (!req.query.name && !req.query.specialization && !req.query.place) {
      // console.log('wer')
      res.send(value)
    } else {
      const t = value.filter((u) => {
        // if (req.query.userType && u.userType.toLowerCase().includes(req.query.userType)) {
        //   return u;
        // }
        if (req.query.name && u.name.toLowerCase().includes(req.query.name)) {
          return u;
        }
        if (req.query.specialization && u.specialization && u.specialization.toLowerCase().includes(req.query.specialization)) {
          return u;
        }
        // console.log(u.location)
        if (req.query.place && u.location &&
          (u.location.city.toLowerCase().includes(req.query.place) || u.location.country.toLowerCase().includes(req.query.place))) {
          // console.log('done')
          return u;
        }
      })

      res.send(t)

    }
  } catch (error) {
    res.status(500).send()
  }
})

app.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

app.post('/users/logout', auth, async (req, res) => {
  // console.log(req.token)
  try {
    req.user.tokens = req.user.tokens.filter((token) => 
      token.token !== req.token
    )

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

app.get('/users/:id', async (req, res) => { //  Get a certain user
  const _id = req.params.id
  User.findById(_id).then((value) => {
    if (!value) {
      return res.status(404).send()
    }
    res.send(value)
  }).catch((error) => {
    res.status(500).send(error)
  })
})

app.patch('/users/me', auth, async (req, res) => { // Update user data
  const updates = Object.keys(req.body)
  const allowedChanges = ['email', 'name', 'gender', 'dayOfBirth', 'skills', 'bio', 'prevJobs', 'specialization', 'location', 'phone']
  let isValidOperation = updates.every((update) => allowedChanges.includes(update))
  if (!isValidOperation) {
    return res.status(400).send()
  }
  try {

    console.log(req.body.phone)
    updates.forEach((update) => {

      req.user[update] = req.body[update]
    });
    await req.user.save();

    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.delete('/users/me', auth, async (req, res) => {
  try {

    await req.user.remove()
    sendEmail.sendFinalMassege(req.user.email, req.user.name)
    res.send(req.user)
  } catch (error) {
    res.send(error).status(500)
  }
})

app.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  let buffer = (await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer())

  req.user.image = buffer;
  await req.user.save()
  // console.log('image', req.user.image)
  res.send(req.user.image)
}, (error, req, res, next) => {
  // console.log(error)
  res.status(400).send({ error: 'Please upload a valid image' })
})

app.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: 'Please upload a valid image' })
})

app.get('/users/:id/avatar', async (req, res) => { //  Get a certain user
  try {
    const _id = req.params.id
    // console.log(req)
    let user = await User.findById(_id)
    if (!user || !user.image) {
      throw new Error()
    }
    // console.log('ddddd', user.image.buffer)
    // res.set('Content-Type', 'application/octet-stream')
    res.send(user.image.toString('base64'))
  } catch (e) {
    res.status(404).send()
  }
})

// app.get('/users/me/avatar', auth, async (req, res) => { //  Get a certain user
//   try {
//     res.set('Content-Type', 'image/png')
//     res.send(req.user.image)
//   } catch (e) {
//     res.status(404).send()
//     console.log(e);
//   }
// })
//

app.patch('/users/me/password', auth, async (req, res) => {

  try {
    const password = req.body.password;
    const isMatch = await bcrypt.compare(password, req.user.password)
    if (!isMatch) {
      throw new Error('You must provide the correct old password')
    }
    req.user.password = req.body.newPass
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e.toString())
  }
})
module.exports = app