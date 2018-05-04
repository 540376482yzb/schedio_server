'use strict';
const User = require('../models/users.models');
const { Strategy: LocalStrategy } = require('passport-local');
const passport = require('passport');
const localStrategy = new LocalStrategy((username, password, done) => {
  let mUser;
  User.findOne({ 'local.username': username })
    .then(user => {
      if (!user) {
        console.log('User does not exist');
        return Promise.reject({
          reason: 'Login Error',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      mUser = user;
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        console.log('bad password');
        return Promise.reject({
          reason: 'Login Error',
          message: 'Incorrect Password',
          location: 'password'
        });
      }
      return done(null, mUser);
    })
    .catch(err => {
      if (err.reason === 'Login Error') {
        return done(null, false);
      }
      return done(err);
    });
});

passport.use(localStrategy);
module.exports = localStrategy;
