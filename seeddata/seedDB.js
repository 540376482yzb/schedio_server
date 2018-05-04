'use strict';

//================================== Import Dependencies ====================>
const mongoose = require('mongoose');
const Event = require('../models/events.models');
const User = require('../models/users.models');
const {TEST_DATABASE_URL} = require('../config');
const seedEvents = require('./events.json');
const seedUsers = require('./users.json');

const seedDB = () => {
  mongoose.connect(TEST_DATABASE_URL, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('test DB connected');
    }
  });

  Event.deleteMany({})
    .then(response => {
      console.log('removed all events');

      Event.insertMany(seedEvents)
        .then(response => {
          console.log(`Inserted ${response.length} events into DB`);
        });  
    })
    .catch(err => {
      console.log(err);
    });



  User.deleteMany({})
    .then(response => {
      console.log('removed all users');

      User.insertMany(seedUsers)
        .then(response => {
          console.log(`Inserted ${response.length} users into DB`);
          process.exit();
        })
        .catch(err => {
          console.log(err);
        });
    })
    .catch(err => {
      console.log(err);
    });

};


if (require.main === module) {
  seedDB();
}

module.exports = seedDB;