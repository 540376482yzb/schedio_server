'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  local: {
    firstname: {
      type: String,
      default: ''
    },
    username: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    }
  },
  google: {
    id: { type: String },
    firstname: {
      type: String
    },
    username: {
      type: String,
      lowercase: true
    },
    photo: {
      type: String
    }
  }
});

userSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.local.password;
  }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.local.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
