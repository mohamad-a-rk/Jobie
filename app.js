const express = require('express')
const multer = require('multer')
var path = require('path');
var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var createError = require('http-errors');


require('./src/db/mongoose')
const formRouter = require('./routes/form')
const userRouter = require('./routes/users')
const responseRouter = require('./routes/response')
const feedbackRouter = require('./routes/feedback')
const message = require('./src/firebaseInit');

// console.log(message);
// var admin = require("firebase-admin");

// var serviceAccount = require('./jobie-firebase.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// const payload = {
//   data: {
//     key: 'hi'
//   }
// }
// admin.messaging().sendToDevice(token, payload).then((res) => console.log(res)).catch((res) => console.log(res));

const app = express()
app.use(cookieParser())
const upload = multer({
  dest: 'images',
  limits: {
    'fileSize': 10000000
  },
  fileFilter(req, file, cb) {

    // cb(new Error)  file has an error
    // cb(undefined,true) file is correct and Accept it
    //cb(undefined, false) reject file scilently
    // String.match(/Expression here/) is used in regular expressions 
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
      return cb(new Error('You must uplode a jpg/jpeg files only'))
    }
    cb(undefined, true)
  }
})

app.post('/upload', upload.single('avatar'), (req, res) => {
  res.send()
}, (error, req, res, next) => {
  res.status(500).send({ error })
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(userRouter)
app.use(formRouter)
app.use(responseRouter)
app.use(feedbackRouter)


app.use(express.json())
const port = process.env.PORT

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
})

//view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.listen(port, () => {
  console.log('Server has started at port ', port)
})