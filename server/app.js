const express = require('express');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const tasks = require('./routes/tasks');
const users = require('./routes/users');
const User = require('./models/User');
const initializePassport = require('./config/passport');
require('dotenv').config();

const app = express();

initializePassport(passport, async (email) => {
  return await User.findOne({ email });
});

app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'test-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/api/v1/tasks', tasks);
app.use('/api/v1/users', users);

module.exports = app;
