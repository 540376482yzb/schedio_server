'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');

router.put('/:id/display', (req, res, next) => {
  const { event } = req.body;
  const { id } = req.params;
  return Event.findByIdAndUpdate(id, event, { new: true }).then(res => {
    console.log(res);
  });
});
module.exports = router;
