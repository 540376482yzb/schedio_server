'use strict'; 
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');

// Hiking post route will store the hiking trail per user
router.put('/:id/hiking', (req,res,next) => {
  console.log('req body is:', req.body);
  const {id} = req.params;
  
  const { 
    ascent,
    conditionDate,
    conditionDetails,
    conditionStatus,
    descent,
    difficulty,
    high,
    imgMedium,
    imgSmall,
    imgSmallMed,
    imgSqSmall,
    latitude,
    length,
    location,
    longitude,
    low,
    name,
    starVotes,
    stars,
    summary,
    type,
    url
  } = req.body;
  
  /***** Never trust users - validate input *****/
  if (!name) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { 
    ascent,
    conditionDate,
    conditionDetails,
    conditionStatus,
    descent,
    difficulty,
    high,
    imgMedium,
    imgSmall,
    imgSmallMed,
    imgSqSmall,
    latitude,
    length,
    location,
    longitude,
    low,
    name,
    starVotes,
    stars,
    summary,
    type,
    url
  };

  // reason not working frist time: push in destruc object (creating a new object) -> new id but not matching schema
  Event.findByIdAndUpdate(id, {$set: {'widgets.outdooractivities.info': newItem}}, {new:true})
    .then(response => {
      console.log(response)
      res.json(response);
    })
    .catch(next);
});

module.exports = router;