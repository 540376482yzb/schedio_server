'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');


router.put('/:id/map', (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        info
    } = req.body;
    return Event.findByIdAndUpdate(id, {
        'widgets.map.info': info
    }, {
            new: true
        })
        .then(map => {
            res.status(200).json(map)
        })
        .catch(next)

});


module.exports = router;