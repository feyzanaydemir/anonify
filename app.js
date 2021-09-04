require('dotenv').config();
const logger = require('morgan');
const express = require('express');
const { format } = require('date-fns');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const passport = require('passport');
const createError = require('http-errors');
const LocalStrategy = require('passport-local').Strategy;

// DB
const mongoDb = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cx3iy.mongodb.net/only-members?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

// Passport
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

// Models
const Schema = mongoose.Schema;

const User = mongoose.model(
  'User',
  new Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    membership: { type: Boolean },
    moderator: { type: Boolean },
  })
);

const Message = mongoose.model(
  'Message',
  new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String },
    user: { type: String },
    key: { type: String },
  })
);

// Setup
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

// GET requests
app.get('/', (req, res) => {
  (async () => {
    const messages = await Message.find({});

    res.render('index', { user: req.user, messages });
  })();
});

app.get('/signup', (req, res) => res.render('signup'));

app.get('/login', (req, res) => res.render('login'));

app.get('/membership', (req, res) => {
  res.render('membership', { user: req.user });
});

app.get('/new/:username', (req, res) => {
  res.render('new', { user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/:key', (req, res) => {
  const key = Number(req.params.key);

  (async () => {
    await Message.findOneAndRemove({ key });

    res.redirect('/');
  })();
});

// POST requests
app.post('/', (req, res, next) => {
  console.log(req.body);
  res.render('index', { user: req.user });
});

app.post('/signup', (req, res, next) => {
  let membership = false;
  let moderator = false;

  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return console.log(err);
    }

    if (req.body.membership_code === process.env.MEMBERSHIP) {
      membership = true;
    }

    if (req.body.moderator_code === process.env.MODERATOR) {
      membership = true;
      moderator = true;
    }

    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      membership,
      moderator,
    }).save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });
});

app.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

app.post('/new/:username', (req, res, next) => {
  let date = format(new Date(), 'dd.MM.yyyy, hh:mm');

  const message = new Message({
    title: req.body.title,
    content: req.body.content,
    date,
    user: req.params.username,
    key: (1 + Math.random()).toString(),
  }).save((err) => {
    if (err) {
      return next(err);
    }
  });

  res.redirect('/');
});

app.post('/membership/:username', (req, res, next) => {
  if (req.body.code === process.env.MEMBERSHIP) {
    (async () => {
      await User.findOneAndUpdate(
        { username: req.params.username },
        { membership: true }
      );

      res.redirect('/');
    })();
  } else {
    res.redirect('/membership');
  }
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  console.log(err.message);
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('app listening on port 3000!'));

module.exports = app;
