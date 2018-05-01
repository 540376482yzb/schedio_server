'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/users.models');

router.get('/', (req, res, next) => {
  User.find({})
    .then(users => res.status(200).json(users))
    .catch(next);
});
router.get('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(users => res.status(200).json(users))
    .catch(next);
});

router.post('/', (req, res, next) => {
  const { firstName, username, password } = req.body;

  //todo: field validations
  return User.hashPassword(password)
    .then(digest => {
      const newUser = { firstName, username, password: digest };
      return User.create({ local: newUser });
    })
    .then(user => {
      console.log(user);
      return res
        .status(200)
        .location(`${req.originalUrl}/${user.id}`)
        .json(user);
    })
    .catch(err => {
      if (err.code === 11000) {
        err = new Error('The email has already exist');
        err.status = 400;
      }
      next(err);
    });
});

module.exports = router;
