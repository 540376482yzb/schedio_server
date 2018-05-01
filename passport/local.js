'use strict';
const User = require('../models/users');
const { Strategy: LocalStrategy } = require('passport-local');

const localStrategy = new LocalStrategy((username, password, done) => {
  let mUser;
  User.findOne({ 'local.username': username })
    .then(user => {
      if (!user) {
        console.log('no user');
        return Promise.reject({
          reason: 'Login Error',
          message: 'Incorrect Email',
          location: 'email'
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
      console.log('I went through');
      return done(null, mUser);
    })
    .catch(err => {
      if (err.reason === 'Login Error') {
        return done(null, false);
      }
      return done(err);
    });
});

module.exports = localStrategy;
