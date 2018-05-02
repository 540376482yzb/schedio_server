'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');


router.put('/:id/weather', (req,res,next) => {
  const {id} = req.params;
  const {requestType} = req.body;

  if (requestType === 'setActive') {
    Event.findByIdAndUpdate(id, {$set: {'weather.active': true}}, {new:true})
      .then(response => {
        res.json(response);
      })
      .catch(next);
  }
  
  if (requestType === 'setInactive') {
    Event.findByIdAndUpdate(id, {$set: {'weather.active': false}}, {new:true})
      .then(response => {
        res.json(response);
      })
      .catch(next);
  }
  

});


module.exports = router;