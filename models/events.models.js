'use strict';
//================================== Import Dependencies ====================>
const mongoose = require('mongoose');


//================================== Define ToDo list Schema -- SubDocument of EventSchema ====================>

const TodoSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  completed: {
    type:Boolean,
    default:false
  }
});


const WidgetSchema = new mongoose.Schema({
  eventbrite: {
    active: {
      type:Boolean,
      default:false,
    }, 
    apiId: {
      type:String,
    },
  },
  yelp: {
    active: {
      type:Boolean,
      default:false,
    },
    apiId: {
      type:String
    }
  },
  gplaces: {
    active: {
      type:Boolean,
      default:false,
    },
    apiId: {
      type:String
    }
  },
  reiApi: {
    active: {
      type:Boolean,
      default:false
    },
    apiId: {
      type:String
    }
  },
  todo: {
    active: {
      type:Boolean,
      default:false
    },
    list:[TodoSchema]
  }
});


//================================== Define EventSchema ====================>

const EventSchema = new mongoose.Schema({
  title: {
    type:String,
    required:true
  },
  widgets: {
    type: WidgetSchema
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  location: String,
  startdate:{
    type: Date
  },
  enddate: {
    type:Date
  },
});

//================================== Define Schema Transform ====================>

EventSchema.set('toObject', {
  transform:function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});




//================================== Export Event Schema Model ====================>

module.exports = mongoose.model('Event', EventSchema);