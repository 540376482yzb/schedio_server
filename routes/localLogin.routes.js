('use strict');
const express = require('express');
const router = express.Router();
const User = require('../models/users.models');
const passport = require('passport');
//expose local strategy
require('../passport/local');

const options = { session: false, failWithError: true };
const helper = require('./helpers');
const localAuth = passport.authenticate('local', options);

//================================== get all user ====================>

router.get('/', (req, res, next) => {
  User.find().then(users => {
    res.json(users);
  });
});

//================================== local login ====================>

router.post('/', localAuth, (req, res, next) => {
 
  const authToken = helper.createAuthToken(req.user.local);
  console.log(authToken);
  res.send(authToken);
  // res.status(200).json({ authToken });
});

//================================== token refresh ====================>

const jwtAuth = passport.authenticate('jwt', options);
router.post('/refresh', jwtAuth, (req, res, next) => {
  const authToken = helper.createAuthToken(req.user);
  res.status(200).json({ authToken });
});

module.exports = router;