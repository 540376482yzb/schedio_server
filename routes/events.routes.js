'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const Event = require('../models/events.models');
const router = express.Router();
const mongoose = require('mongoose');

//================================== Import SubRoutes ====================>
const weatherRoute = require('./widgetroutes/weather.widget.route');


//================================== Mount Subroutes ====================>
router.use('/events', weatherRoute);



//================================== GET ALL EVENTS [/api/events]====================>
/**
 * TESTING ROUTE
 * This may not actually be used in production, likely just for testing.  
 * @returns A list of All events
 */
router.get('/events', (req,res,next) => {
  Event.find({})
    .then(events => {
      res.json(events);
    })
    .catch(next);
}); 



//================================== GET EVENT BY ID -- GET [/api/events/:id]====================>
/** 
 * @requires Id parameter
 * @returns Event with the id specified
 */
router.get('/events/:id', (req,res,next) => {
  // Extract ID from URL parameters
  const {id} = req.params;
  Event.findById(id)
    .then(event => {
      res.json(event);
    })
    .catch(next);
});


//================================== CREATE NEW EVENT -- POST [/api/events] ====================>
/** 
 * @requires User Id
 * Creates new Event and associates it with User in DB. Does not require every trait that an Event might have, but does require user ID. 
 */
router.post('/events', (req,res,next) => {
  const newEventObj = {};
  newEventObj.user = req.body.user;
  const optionalFields = ['title','location','startdate','enddate'];

  // Insert Each optional field into newEventObj if exists
  optionalFields.forEach(field => {
    if (field in req.body) {
      newEventObj[field] = req.body[field];
    }
  });

  // Ensure that a user ID has been provided
  if (!newEventObj.user) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing user Field';
    return next(err);
  }

  // Check for a valid user ID submitted
  if (!mongoose.Types.ObjectId.isValid(newEventObj.user)) {
    const err = new Error();
    err.status = 400;
    err.message = 'Invalid user ID Specified';
    return next(err);
  }

  // Create Item in Database
  Event.create(newEventObj)
    .then(event => {
      res.status(201).json(event);
    })
    .catch(err => {
      next(err);
    });
});



//================================== MODIFY EVENT -- PUT [/api/events] ====================>
router.put('/events/:id', (req,res,next) => {
  const {id} = req.params;

  if (!id) {
    const err = new Error();
    err.status = 400;
    err.message = 'Event ID is required';
    return next(err);
  }

  const potentiallyUpdatedFields = ['title','location','startdate','enddate'];
  const updateObj = {};
  potentiallyUpdatedFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  return Event.findByIdAndUpdate(id, updateObj,{new:true})
    .then(response => {
      res.status(200).json(response);
    })
    .catch(next);

});



//================================== Delete Event -- DELETE [/api/events] ====================>
router.delete('/events/:id', (req,res,next) => {
  const {id} = req.params;
  
  // If provided ID is invalid, reject with 400 error
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error();
    err.message = 'Invalid Event Id';
    err.status = 400;
    return next(err);
  }

  // Delete Event from DB
  Event.findByIdAndRemove(id)
    .then(response => {
      if (!response) {
        const err = new Error();
        err.status = 404;
        err.message = 'No Event with this ID found';
        return next(err);
      }
      res.status(204).end();
    })
    .catch(next);
});


module.exports = router;