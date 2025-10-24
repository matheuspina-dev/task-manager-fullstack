const express = require('express');
const passport = require('passport');

const router = express.Router();

const { createUser, loginUser } = require('../controllers/userController');

router.route('/register').post(createUser);

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(400)
        .json({ message: info?.message || 'Invalid credentials' });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ message: 'Login successful', user });
    });
  })(req, res, next);
});

module.exports = router;
