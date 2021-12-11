require('dotenv').config();
const logger = require('morgan');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
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
db.on('error', console.error.bind(console, 'Mongo connection error.'));

// PassportJS
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
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

app.get('/', async (req, res) => {
  let user;
  let messages = await Message.find({});
  messages.reverse();

  if (messages.length > 200) {
    messages = messages.slice(0, 200);
  }

  if (req.user) {
    user = req.user;

    delete user['email'];
    delete user['password'];
  }

  res.render('index', { user, messages });
});

app.get('*', (req, res) => res.render('err'));

app.listen(process.env.PORT || 8080, () => console.log('Listening!'));
