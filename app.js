// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cors = require('cors')
// const cache = require('express-cache-controller');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// var app = express();


// // view engine setup
// // app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'jade');

// // var corsOptions = {
// //   origin: 'http://localhost:3000',
// //   methods: 'post'
// //   // optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// // }

// // const corsOptions = {
// //   origin: ['http://localhost:3000'],
// //   allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Request-Headers"],
// //   credentials: true,
// //   enablePreflight: true
// // }

// // app.use(cors(corsOptions));
// // app.options('*', cors(corsOptions))
// // app.use(cache({
// //   noCache: true
// // }));
// // const whitelist = ["http://localhost:3000"]
// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (!origin || whitelist.indexOf(origin) !== -1) {
// //       console.log('hi')
// //       callback(null, true)
// //     } else {
// //       console.log('hiiiii')
// //       callback(new Error("Not allowed by CORS"))
// //     }
// //   },
// //   credentials: true,
// // }
// // app.use(cors())
// // app.use(logger('dev'));
// app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));
// // app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));

// // app.use(cors(
// //   { credentials: true, origin: 'http://localhost:3000', 
// // Headers: 'X-PINGOTHER, Referer,  x-Trigger, sec-ch-ua, ec-ch-ua-mobile, sec-ch-ua-platform, User-Agent, Content-Type',
// //  methods: 'post, get' }
// //  ))


// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
//   res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });

// // app.use((req, res, next) => {
// //   res.setHeader('Access-Control-Allow-Origin', '*');
// //   res.setHeader('Access-Control-Allow-Methods', '*');
// //   res.setHeader('strict-origin-when-cross-origin', '*');
// //   res.setHeader('Access-Control-Allow-Headers', '*');
// //   next();
// // });
// // app.use('/', indexRouter);

// // var op = {
// //   origin: 'https://localhost:3000',
// //   optionsSuccessStatus: 20
// // };
// app.use('/users', usersRouter);


// // // catch 404 and forward to error handler
// // app.use(function (req, res, next) {
// //   next(createError(404));
// // });

// // // error handler
// // app.use(function (err, req, res, next) {
// //   // set locals, only providing error in development
// //   res.locals.message = err.message;
// //   res.locals.error = req.app.get('env') === 'development' ? err : {};

// //   // render the error page
// //   res.status(err.status || 500);
// //   res.render('error');
// // });

// app.listen(2000, () => {
//   console.log('Server has started !')
// })// module.exports = app;
const express = require('express')
const multer = require('multer')
require('./src/db/mongoose')
const formRouter = require('./routes/form')
const userRouter = require('./routes/users')

const app = express()
// app.use((req, res, next) => {
//     res.status(503).send('Sorry but the website is under mantainance')
// })

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

app.post('/upload', upload.single('upload'), (req, res) => {
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


app.use(express.json())
const port = process.env.PORT

app.listen(port, () => {
  console.log('Server has started at port ', port)
})