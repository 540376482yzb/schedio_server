'use strict';
//================================== Import Dependencies ====================>
const express =require('express');
const router = express.Router();
const {YELP_API_KEY} = require('../../config');
const axios = require('axios');
const Event = require('../../models/events.models');




//================================== Yelp API helper For Requests on Frontend ====================>


router.get('/yelphelper', (req,res,next) => {
  const {searchTerm, latitude, longitude} = req.query;
  if (!searchTerm || !latitude || !longitude) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing required Information';
    return next(err);
  }

  axios({
    'url':`https://api.yelp.com/v3/businesses/search?latitude=${latitude}&longitude=${longitude}&term=${ searchTerm}`,
    'method':'GET',
    headers: {
      'Authorization':`Bearer ${YELP_API_KEY}`
    }
  })
    .then(response => {
      res.json(response.data);
    })
    .catch(err => {
      return next(err);
    });

});


//================================== PERSIST Restaurant Data on the Frontend ====================>

router.put('/:id/foodanddining', (req,res,next) => {
  // Extract ID from request Body
  const {id} = req.params;
  const {restaurantInfo} = req.body;

  Event.findByIdAndUpdate(id, {$set: {'widgets.foodanddining.info': restaurantInfo}})
    .then(response => {
      res.json(response);
    })
    .catch(next);
});





module.exports = router;