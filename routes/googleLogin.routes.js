'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
//expose passport googleplustoken config
require('../passport/google');
//expose passport jwttoken config
require('../passport/jwt');

const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

//google Oauth middleware function
const options = { session: false, failWithError: true };
const googleOAuth = passport.authenticate('googleToken', options);

//google login route
router.post('/google', googleOAuth, (req, res, next) => {
  console.log(req.user);
  const authToken = createAuthToken(req.user);
  res.status(201).json({ authToken });
});

/*
==============================================
helper functions
*/
//createtoken
function createAuthToken(user) {
  return jwt.sign({ user }, JWT_SECRET, {
    subject: user.username,
    expiresIn: JWT_EXPIRY
  });
}
module.exports = router;
