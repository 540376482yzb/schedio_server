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

module.exports = router;