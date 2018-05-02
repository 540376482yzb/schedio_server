'use strict';
// if (requestType === 'widgetUpdate') {

//   //Extract name of widget from request body
//   const {widgetName} = req.body;
//   // Ensure user has provided a widget name
//   if (!widgetName) {
//     const err = new Error();
//     err.status = 400;
//     err.message = 'No Widget name provided.';
//     return next(err);
//   }
  

//   /* Here we must further divide out our functionality depending on what kind of request this is. If we want to add an item to a todolist, there must be a todoListItem present in the request body. If there is an apiIdUpdate in the body, we will update the api ID. If there is a setActive key in reqbody, we will set the widget active, if setInactive, we will set the widget inactive.  If none of these commands are present, we will return an error.*/
  
//   //Define a list of Widget Update Commands
//   let widgetCommands = ['addTodoListItem','removeTodoListItem','setActive','setInactive','apiIdUpdate'];
  
//   // Loop through the command list to check req.body for which commands it contains, if any.
//   let counter = 0;
//   widgetCommands.forEach(field => {
//     if (field in req.body) {
//       counter++;
//     }
//   });
  
//   //If req.body contains no widget commands, then we throw an error. The request type was widget update, so widget commands are required.
//   if (counter === 0) {
//     const err = new Error();
//     err.status = 400;
//     err.message = 'No widget commands provided';
//     return next(err);
//   }



//   if (req.body.apiIdUpdate) { 
//     let widgetPath = `widgets.${widgetName}.apiId`;
//     const {apiIdUpdate} = req.body;
//     Event.findByIdAndUpdate(id, {$set: {[widgetPath]:apiIdUpdate}}, {new:true})
//       .then(response => res.json(response))
//       .catch(next);
//   }


//   if (req.body.addTodoListItem) {
//     const addTodoListItem = {
//       title: req.body.addTodoListItem
//     };

//     Event.findByIdAndUpdate(id, {$push: {'widgets.todo.list': addTodoListItem}}, {new:true})
//       .then(response => res.json(response))
//       .catch(next);
//   }
//   // TODO This does not work. Need to fix.
//   if (req.body.removeTodoListItem) {
//     const {removeTodolistItem} = req.body;
//     Event.findByIdAndUpdate(id, {$pull: {'widgets.todo.list': {'title':removeTodolistItem}}}, {new:true})
//       .then(response => res.json(response))
//       .catch(next);
//   }

//   if (req.body.setActive) {
//     let widgetPath = `widgets.${widgetName}.active`;
//     Event.findByIdAndUpdate(id, {$set: {[widgetPath]:true}}, {new:true})
//       .then(response => res.json(response))
//       .catch(next);
//   }

//   if (req.body.setInactive) {
//     let widgetPath = `widgets.${widgetName}.active`;
//     Event.findByIdAndUpdate(id, {$set: {[widgetPath]:false}}, {new:true})
//       .then(response => res.json(response))
//       .catch(next);
//   }

// }