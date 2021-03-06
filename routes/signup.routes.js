'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/users.models');



router.post('/', (req, res, next) => {
  const {
    firstname,
    username,
    password
  } = req.body;
  //todo: field validations
  return User.hashPassword(password)
    .then(digest => {
      const newUser = {
        firstname,
        username,
        password: digest
      };
      return User.create({
        local: newUser
      });
    })
    .then(user => {
      return res
        .status(200)
        .location(`${req.originalUrl}/${user.id}`)
        .json(user);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The username already exists');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;