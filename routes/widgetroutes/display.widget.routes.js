'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');

router.put('/:id/display', (req, res, next) => {
  const { widgets } = req.body;
  const { id } = req.params;
  return Event.findByIdAndUpdate(id, { $set: { widgets } }, { new: true }).then(event => {
    /*=======todo: testing for update display
    */
    res.status(200).json(event);
  });
});
module.exports = router;
