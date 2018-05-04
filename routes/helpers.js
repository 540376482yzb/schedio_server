'use strict';
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

/*==============================================
helper functions
*/
//createtoken
function createAuthToken(user) {
  let username;
  if (user.google.username) {
    username = user.google.username;
  } else {
    username = user.local.username;
  }
  return jwt.sign({ user }, JWT_SECRET, {
    subject: username,
    expiresIn: JWT_EXPIRY
  });
}

module.exports = {
  createAuthToken
};
