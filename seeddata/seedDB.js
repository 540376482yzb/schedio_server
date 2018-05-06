'use strict';

//================================== Import Dependencies ====================>
const mongoose = require('mongoose');
const Event = require('../models/events.models');
const User = require('../models/users.models');
const {TEST_DATABASE_URL} = require('../config');
const seedEvents = require('./events.json');
const seedUsers = require('./users.json');

const seedDB = () => {

  return User.remove({})
    .then(result => {
      console.info('dropped collection');
      return Event.remove({});
    })
    .then(response => {
      console.log('dropped events');
      return Event.insertMany(seedEvents);
    })
    .then(response => {
      console.log(`Inserted ${response.length} events into DB`);
      return User.insertMany(seedUsers);
    })
    .then(response => {
      console.log(`Inserted ${response.length} users into DB`);
    })
    .catch(err => {
      console.log(err);
    });
   

};


if (require.main === module) {
  seedDB();
}

module.exports = seedDB;