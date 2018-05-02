'use strict';
//================================== Import Dependencies ====================>
const express = require('express');
const Event = require('../models/events.models');
const router = express.Router();
const mongoose = require('mongoose');



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

  const {requestType} = req.body;
  /* This allows us to edit the Events in different ways. If in the request body we specify a type of request, we can conditionally update different things.
  
  For Example, a basic update would be updating the title, location, startdate, or enddate on the root of the Event Model
  
  A widget update, however would update information about one of our widgets
  */ 

  // For Basic Updates
  if (requestType === 'basicUpdate') {
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
  }

  if (requestType === 'widgetUpdate') {

    //Extract name of widget from request body
    const {widgetName} = req.body;
    // Ensure user has provided a widget name
    if (!widgetName) {
      const err = new Error();
      err.status = 400;
      err.message = 'No Widget name provided.';
      return next(err);
    }
    

    /* Here we must further divide out our functionality depending on what kind of request this is. If we want to add an item to a todolist, there must be a todoListItem present in the request body. If there is an apiIdUpdate in the body, we will update the api ID. If there is a setActive key in reqbody, we will set the widget active, if setInactive, we will set the widget inactive.  If none of these commands are present, we will return an error.*/
    
    //Define a list of Widget Update Commands
    let widgetCommands = ['addTodoListItem','removeTodoListItem','setActive','setInactive','apiIdUpdate'];
    
    // Loop through the command list to check req.body for which commands it contains, if any.
    let counter = 0;
    widgetCommands.forEach(field => {
      if (field in req.body) {
        counter++;
      }
    });
    
    //If req.body contains no widget commands, then we throw an error. The request type was widget update, so widget commands are required.
    if (counter === 0) {
      const err = new Error();
      err.status = 400;
      err.message = 'No widget commands provided';
      return next(err);
    }



    if (req.body.apiIdUpdate) { 
      let widgetPath = `widgets.${widgetName}.apiId`;
      const {apiIdUpdate} = req.body;
      Event.findByIdAndUpdate(id, {$set: {[widgetPath]:apiIdUpdate}}, {new:true})
        .then(response => res.json(response))
        .catch(next);
    }


    if (req.body.addTodoListItem) {
      const addTodoListItem = {
        title: req.body.addTodoListItem
      };

      Event.findByIdAndUpdate(id, {$push: {'widgets.todo.list': addTodoListItem}}, {new:true})
        .then(response => res.json(response))
        .catch(next);
    }
    // TODO This does not work. Need to fix.
    if (req.body.removeTodoListItem) {
      const {removeTodolistItem} = req.body;
      Event.findByIdAndUpdate(id, {$pull: {'widgets.todo.list': {'title':removeTodolistItem}}}, {new:true})
        .then(response => res.json(response))
        .catch(next);
    }

    if (req.body.setActive) {
      let widgetPath = `widgets.${widgetName}.active`;
      Event.findByIdAndUpdate(id, {$set: {[widgetPath]:true}}, {new:true})
        .then(response => res.json(response))
        .catch(next);
    }

    if (req.body.setInactive) {
      let widgetPath = `widgets.${widgetName}.active`;
      Event.findByIdAndUpdate(id, {$set: {[widgetPath]:false}}, {new:true})
        .then(response => res.json(response))
        .catch(next);
    }

  }

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