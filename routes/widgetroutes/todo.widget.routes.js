'use strict'; 
//================================== Import Dependencies ====================>
const express = require('express');
const router = express.Router();
const Event = require('../../models/events.models');

// This post route will handle creating new Todo list items/
router.post('/:id/todo', (req,res,next) => {
  const {title} = req.body;
  const {id} = req.params;

  // Check to ensure that the title field is provided.
  if (!title) {
    const err = new Error();
    err.status = 400;
    err.message = 'No title provided for the todolist item';
  }

  Event.findByIdAndUpdate(id, {$push: {'widgets.todo.list': {'title':title}}}, {new:true})
    .then(response => {
      res.json(response);
    })
    .catch(next);
});


/**
 * This will allow us to either mark a todo list item completed or not complete or edit an item name.
 */
router.put('/:id/todo', (req,res,next) => {
  const {id} = req.params;
  const {todoItemId, requestType} = req.body;

  if (!requestType) {
    const err = new Error();
    err.status = 400;
    err.message = 'No requestType command provided in request body';
  }


  // Sets todo list item as Complete
  if (requestType === 'setComplete') {

    return  Event.update({'_id':id, 'widgets.todo.list._id':todoItemId}, {$set:{'widgets.todo.list.$.completed':true}}, {new:true})
      .then(response => res.status(200).json(response))
      .catch(next);
  }


  // Sets todo list item as NOT complete
  if (requestType === 'setIncomplete') {

    return  Event.update({'_id':id, 'widgets.todo.list._id':todoItemId}, {$set:{'widgets.todo.list.$.completed':false}}, {new:true})
      .then(response => res.status(200).json(response))
      .catch(next);
  }

  // Edits the name of the todo list item
  if (requestType === 'editTitle') {
    const {newTitle} = req.body;

    if (!newTitle) {
      const err = new Error();
      err.status = 404;
      err.message = 'Missing newTitle field in request body';
    }

    return  Event.update({'_id':id, 'widgets.todo.list._id':todoItemId}, {$set:{'widgets.todo.list.$.title':newTitle}}, {new:true})
      .then(response => res.status(200).json(response))
      .catch(next);
  }
});


// Deletes a todo List item
router.delete('/:id/todo', (req,res,next) => {
  const {id} = req.params;
  const {todoId} = req.query;
  if (!todoId) {
    const err = new Error();
    err.status = 404;
    err.message = 'Missing todoId field in request body';
  }

  Event.findByIdAndUpdate(id, {$pull: {'widgets.todo.list': { '_id': todoId}}}, {new:true})
    .then(response => {
      res.json(response);
    })
    .catch(next);
});


module.exports = router;