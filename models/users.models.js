'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  methods: {
    local: {
      firstname: {
        type: String
      },
      username: {
        type: String
      }
    },
    google: {
      firstname: {
        type: String
      },
      username: {
        type: String
      },
      email: {
        type: String,
        lowercase: true
      },
      photo: {
        type: String
      }
    }
  }
});

userSchema.set('toObject', {
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.methods.local.password;
  }
});

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
