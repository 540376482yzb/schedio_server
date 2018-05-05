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


//================================== Define EventSchema ====================>

const EventSchema = new mongoose.Schema({
  title: {
    type:String,
    default:'New Event'
  },
  widgets: {
    // These are just some mockup widgets we might have I suppose we'll need to decide on exactly what we want soon enough. 
    outdooractivities: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      }
    },
    weather: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      }
    },
    todo: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      },
      list: [TodoSchema]
    },
    publicevents: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      }
    },
    foodanddining: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      }
    },
    sports: {
      displayed: {type:Boolean,default:false},
      info:{
        type:Object,default:{}
      }
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User'
  },
  location: {},
  starttime:{
    type: String,
    default: Date.now()
  }
});

//================================== Define Schema Transform ====================>

EventSchema.set('toObject', {
  transform:function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

TodoSchema.set('toObject', {
  transform:function (doc,ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});




//================================== Export Event Schema Model ====================>

module.exports = mongoose.model('Event', EventSchema);