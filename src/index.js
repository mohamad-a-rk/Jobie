const express = require('express')
const multer = require('multer')

require('./db/mongoose.js')
const userRouter = require('../routes/users')
const Employee = require('./models/employee')
const FreeLancer = require('./models/freeLancer')
const Business = require('./models/business')
const Feedback = require('./models/feedback')

const app = express()

app.use(userRouter)
app.use(express.json())
const port = process.env.PORT
  
app.listen(port, () => {
    console.log('Server has started at port ', port)
})

// const test = async () => {
    // let e = new Business({
    //     email: "Mohammad.kukhun@gmail.com",
    //     name: "Mohammad Kukhun",
    //     password: "12345677890",
    //     specilization: 'Backend',
    //     location: {
    //         city: 'Nablus',
    //         country: 'Palestine'
    //     },
    //     // gender: 'Male'
    // })
//     // let value = await e.save()
//     // let freelancer = await FreeLancer.findOne({
//     //     email: 'Mohammad.kukhun1@gmail.com'
//     // })

//     // let feedback = new Feedback({
//     //     Text: 'Great work',
//     //     feedbacker: "6240e4c61fa12312315dd732",
//     //     freelancer: '6240e4a487329fc60db685e3'
//     // })
//     // await feedback.save()
//     // freelancer.feedbacks = freelancer.feedbacks.concat(feedback)
//     // await freelancer.save()




//     let user = await FreeLancer.findOne({
//         email: 'Mohammad.kukhun1@gmail.com'
//     })

//     let a = await user.populate({
//         path: 'feedbacks'
//     })
//     // let value = a.feedbacks
//     console.log('====================================');
//     console.log(user.feedbacks);
//     console.log('====================================');
// }
// test()