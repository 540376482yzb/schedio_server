'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
//expose passport googleplustoken config
require('../passport/google');
//expose passport jwttoken config
require('../passport/jwt');
const helper = require('./helpers');

//google Oauth middleware function
const options = { session: false, failWithError: true };
const googleOAuth = passport.authenticate('googleToken', options);

//================================== google login ====================>
//google login route
router.post('/google', googleOAuth, (req, res, next) => {
  console.log(req.user);
  const authToken = helper.createAuthToken(req.user);
  res.status(201).json({ authToken });
});

module.exports = router;
