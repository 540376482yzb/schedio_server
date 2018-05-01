'use strict';
const { clientSecret, clientID } = require('../config');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const passport = require('passport');
const User = require('../models/users.models');
passport.use(
  'googleToken',
  new GooglePlusTokenStrategy(
    {
      clientID,
      clientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      //checking existing user
      // console.log(profile);
      User.findOne({ 'google.id': profile.id })
        .then(user => {
          // found user
          if (user) {
            user = user.google;
            return done(null, user);
          }
          // user have not register in our database
          user = {
            id: profile.id,
            firstname: profile.name.givenName,
            username: profile.emails[0].value,
            photo: profile.photos[0].value
          };
          return User.create({ google: user }).then(user => {
            return done(null, user);
          });
        })
        .catch(err => {
          done(err, false, err.message);
        });
    }
  )
);
