const express = require('express')
const User = require('../src/models/general')
const Business = require('../src/models/business')
const FreeLancer = require('../src/models/freeLancer')
const Employee = require('../src/models/employee')

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
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // res.setHeader('Access-Control-Allow-Credentials', true);

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
    res.send({ token, user })
  } catch (e) {
    res.status(400).send(e)
    console.log(e);
  }
})

app.get('/users', async (req, res) => { // Get all users 
  // No need for this

  try {
    let value = await User.find({})
    res.send(value)
  } catch (error) {
    res.status(500).send()
  }
})

app.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

app.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      token.token !== req.token
    })

    await req.user.save()
    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// app.post('/users/logout', auth, async (req, res) => {
//   const _id = req.body.user._id;
//   console.log(req.body)
//   User.findById(_id).then((user) => {
//     if (!user) {
//       return res.status(404).send()
//     }
//     // res.send();
//     // console.log(user.tokens[0].token)
//     user.tokens.forEach( t => {
//       t.token = '';
//     }) 
//     //  [{ token: '', _id:  }];
//   return user.save();
//   // res.send();
//   // res.send(user)
// })
//   .then((re) => {
//     res.send()
//   })
//   .catch((error) => {
//     console.log(error)
//     res.status(500).send(error)
//   })
//   // try {
//   //   req.user.tokens = req.user.tokens.filter((token) => {
//   //     token.token !== req.token
//   //   })
//   //   await req.user.save()
//   //   res.send()
//   // } catch (e) {
//   //   res.status(500).send()
//   // }
// })

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
  // const _id = req.params.id
  const updates = Object.keys(req.body)
  const allowedChanges = ['email', 'name', 'gender', 'bio', 'prevJobs', 'specialization', 'location', 'phone']
  let isValidOperation = updates.every((update) => allowedChanges.includes(update))
  if (!isValidOperation) {
    return res.status(400).send()
  }
  try {
    // let user = await User.findByIdAndUpdate(_id, req.body, { runValidators: true, new: true })
    // let user = await User.findById(_id)
    updates.forEach((update) => {

      // if (update === 'gender') {
      //  Employee.updateOne({ _id: req.user._id }, { $set: { gender: req.body[update] } });
      // } else {
        req.user[update] = req.body[update]
      // }
    });
    await req.user.save();
    // if (!user) {
    //     return res.status(404).send()
    // }

    res.send(req.user)
  } catch (error) {
    res.status(500).send(error)
  }
})

app.delete('/users/me', auth, async (req, res) => {
  try {
    // let user = await User.findByIdAndDelete(req.user._id)
    // if (!user) {
    //     return res.status(404).send()
    // }
    await req.user.remove()
    sendEmail.sendFinalMassege(req.user.email, req.user.name)
    res.send(req.user)
  } catch (error) {
    res.send(error).status(500)
  }
})

app.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  let buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer()
  // console.log(buffer)

  req.user.image = buffer;
  await req.user.save()
  console.log(req.user.image)
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
    let user = await User.findById(_id)
    if (!user || !user.avatar) {
      throw new Error()
    }
    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(404).send()
  }
})
module.exports = app