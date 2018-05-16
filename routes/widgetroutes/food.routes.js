'use strict';
//================================== Import Dependencies ====================>
const express =require('express');
const router = express.Router();
const {YELP_API_KEY} = require('../../config');
const axios = require('axios');


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


module.exports = router;