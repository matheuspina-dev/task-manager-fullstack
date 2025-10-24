const express = require('express');
const cors = require('cors');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const mongoDB = require('./db/connect');
const tasks = require('./routes/tasks');
const users = require('./routes/users');
const User = require('./models/User');
const initializePassport = require('./config/passport');
require('dotenv').config();

const server = express();

initializePassport(passport, async (email) => {
  return await User.findOne({ email });
});

//middleware
server.use(express.json());

server.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  })
);

server.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.use(flash());

//routes
server.use('/api/v1/tasks', tasks);
server.use('/api/v1/users', users);

//start server
const start = async () => {
  try {
    await mongoDB(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const PORT = process.env.PORT;
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

start();
