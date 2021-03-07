const admin = require('firebase-admin');
const firebase = require('firebase');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const trimRequest = require('trim-request');
const serviceAccount = require("./config/fbServiceAccountKey.json");
const firebaseConfig = require("./config/config.json");
const connectToDatabase = require('./lib/mongoose');
const { checkIfAuthenticated } = require('./lib/authenticate');
connectToDatabase();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://user-posts-1e7d7-default-rtdb.firebaseio.com"
});

firebase.initializeApp(firebaseConfig);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// apply trim
app.use(trimRequest.all);

app.get('/health', function(req, res, next) {
  // console.log("health", global.health);
  return res.status(200).send({data : global.health});
});

const signup = require('./functions/user/createUser');
const login = require('./functions/user/loginUser');
const userRoutes = require('./functions/user/index');
const postRoutes = require('./functions/posts/index');
const likeRoutes = require('./functions/like/index');

app.use('/user/signup', signup);
app.use('/user/login', login);
app.use('/user', checkIfAuthenticated, userRoutes);
app.use('/posts', postRoutes);
app.use('/like', checkIfAuthenticated, likeRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  return res.status(404).send({error: 'Route '+req.url+' not found'});
});

// 500 - Any server error
app.use(function (err, req, res, next) {
  console.log(err)
  let status = err.status || 500;
  let errMessage = err.message || "Internal server error";
  res.status(status).send({error : errMessage});
});

module.exports = app;