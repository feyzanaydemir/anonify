require('dotenv').config();
const logger = require('morgan');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const createError = require('http-errors');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');
const Message = require('./models/Message');
const usersRoute = require('./routes/users');
const messagesRoute = require('./routes/messages');
const sessionsRoute = require('./routes/sessions');

// MongoDB
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Passport.js
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({ email: username }, (err, user) => {
        if (err) {
          done(err);
        } else if (!user) {
          done(null, false, { message: 'Incorrect email' });
        } else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              done(null, user);
            } else {
              done(null, false, { message: 'Incorrect password' });
            }
          });
        }
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

const app = express();

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'scripts')));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use('/users', usersRoute);
app.use('/messages', messagesRoute);
app.use('/sessions', sessionsRoute);

// Homepage
app.get('/', async (req, res) => {
  let messages = await Message.find({});

  messages = messages.reverse();

  res.render('index', { user: req.user, messages });
});

// Error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  res.status(err.status || 500);
  res.render('err');
});

app.listen(3000, () => console.log('App listening on port 3000!'));
