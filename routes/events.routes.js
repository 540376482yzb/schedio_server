'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const Event = require('../models/events.models');
const router = express.Router();
const mongoose = require('mongoose');

//================================== Import Widget SubRoutes ====================>
const weatherRoute = require('./widgetroutes/weather.widget.route');
const todoRoute = require('./widgetroutes/todo.widget.routes');

//================================== Mount Subroutes ====================>
router.use('/events', weatherRoute);
router.use('/events', todoRoute);

//================================== GET ALL EVENTS [/api/events]====================>
/**
 * TESTING ROUTE
 * This may not actually be used in production, likely just for testing.
 * @returns A list of All events
 */
router.get('/events', (req, res, next) => {
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
router.get('/events/:id', (req, res, next) => {
  // Extract ID from URL parameters
  const { id } = req.params;
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
router.post('/events', (req, res, next) => {
  const newEventObj = {};
  newEventObj.userId = req.body.userId;
  const optionalFields = ['title', 'location', 'starttime'];

  // Insert Each optional field into newEventObj if exists
  optionalFields.forEach(field => {
    if (field in req.body) {
      newEventObj[field] = req.body[field];
    }
  });

  //Ensure that location is an object containing latitude and longitude coordinates
  if ('location' in newEventObj) {
    if (!newEventObj.location.lat || !newEventObj.location.long) {
      const err = new Error();
      err.status = 400;
      err.message = `Location key required a 'lat' and 'long' key for latitude and longitude.  You provided ${
        newEventObj.location
      }`;
    }
  }

  // Ensure that a user ID has been provided
  if (!newEventObj.userId) {
    const err = new Error();
    err.status = 400;
    err.message = 'Missing userId Field';
    return next(err);
  }

  // Check for a valid user ID submitted
  if (!mongoose.Types.ObjectId.isValid(newEventObj.userId)) {
    const err = new Error();
    err.status = 400;
    err.message = 'Invalid user ID Specified';
    return next(err);
  }

  /*========= MODIFY CREATE ROUTE TO FIT NEW DEMAND ======
    
  */
  // Create Item in Database
  const { initWidgets } = req.body;

  Event.create(newEventObj)
    .then(_event => {
      for (let widget in _event.widgets) {
        if (initWidgets.includes(widget)) {
          _event.widgets[widget].displayed = true;
        }
      }
      return Event.findByIdAndUpdate(_event.id, { widgets: _event.widgets }, { new: true });
    })
    .then(_event => {
      res.status(200).json(_event);
    })
    .catch(err => {
      next(err);
    });
});

//================================== MODIFY EVENT -- PUT [/api/events] ====================>
router.put('/events/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    const err = new Error();
    err.status = 400;
    err.message = 'Event ID is required';
    return next(err);
  }

  const potentiallyUpdatedFields = ['title','location','starttime'];
  const updateObj = {};
  potentiallyUpdatedFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  //Ensure that location is an object containing latitude and longitude coordinates
  if ('location' in updateObj) {
    if (!updateObj.location.lat || !updateObj.location.long) {
      const err = new Error();
      err.status = 400;
      err.message = `Location key required a 'lat' and 'long' key for latitude and longitude.  You provided ${
        newEventObj.location
      }`;
    }
  }

  return Event.findByIdAndUpdate(id, updateObj, { new: true })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(next);
});

//================================== Delete Event -- DELETE [/api/events] ====================>
router.delete('/events/:id', (req, res, next) => {
  const { id } = req.params;

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
