'use strict';
const express = require('express');
const router = express.Router();
const User = require('../models/users.models');
const passport = require('passport');
require('../passport/local');
const options = {
    session: false,
    failWithError: true
};
const localAuth = passport.authenticate('local', options);

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

router.put('/:id/username', (req, res, next) => {
    const {
        username
    } = req.body
    console.log(username)
    User.findByIdAndUpdate(req.params.id, {
        'local.username': username
    }, {
            new: true
        })
        .then(user => {
            res.json(user)
        })
})
router.put('/:id/firstname', (req, res, next) => {
    const {
        firstname
    } = req.body
    User.findByIdAndUpdate(req.params.id, {
        'local.firstname': firstname
    }, {
            new: true
        })
        .then(user => {
            res.json(user)
        })
})

router.post('/:id/password', localAuth, (req, res, next) => {
    res.status(200).json({
        message: "ok"
    })
})
router.put('/:id/reset', (req, res, next) => {
    let {
        password
    } = req.body;
    return User.hashPassword(password)
        .then(digest => {
            digest
            return User.findByIdAndUpdate(req.params.id, {
                'local.password': digest
            }, {
                    new: true
                })
        })
        .then(user => {
            return res
                .status(200)
                .location(`${req.originalUrl}/${user.id}`)
                .json(user);
        })
        .catch(err => {
            next(err);
        });
})
module.exports = router;