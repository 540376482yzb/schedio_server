'use strict';
//================================== Import Dependencies ====================>
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);
const app = require('../index');
require('dotenv').config();  
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const Event = require('../models/events.models');


//================================== Test Event Routes ====================>

const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImxvY2FsIjp7ImZpcnN0bmFtZSI6IkppbW15IEJvb2JvcCIsInVzZXJuYW1lIjoiamJvb2JvcCJ9LCJpZCI6IjVhZWM2ZDM3MDNlOWUyMDlkOWM1MzllMCJ9LCJpYXQiOjE1MjU0ODUyOTQsImV4cCI6MTUyNjA5MDA5NCwic3ViIjoiamJvb2JvcCJ9.8d-8E1MHvJ2wBOeorglGR7YXY_fmig1ASTVXWEvD_LQ';

const decodedToken = jwt.decode(authToken, JWT_SECRET);

describe('GET /api/events', function () {
  it('Should return a list of events associated with the user', function() {
    return chai.request(app)
      .get('/api/events')
      .set('Authorization',`Bearer ${authToken}`)
      .then(response => {
        expect(response).to.be.an('Object');
        expect(response).to.have.status(200);
        expect(response.body).to.be.an('Array');
        expect(response.body[0].user).to.equal(decodedToken.user.id);
      });
  });
});

describe('POST /api/events', function () {
  const newEvent = {'title':'Schedio Event', starttime:Date.now(), 'initWidgets':['weather','todo']};
  it('Should create a new event with the weather and todo Widgets displayed, with a user ID referencing the creating user', function() { 
    return chai.request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newEvent)
      .then(response => {
        expect(response).to.be.an('Object');
        expect(response.body.widgets.weather.displayed).to.equal(true);
        expect(response.body.widgets.todo.displayed).to.equal(true);
        expect(response.body.user).to.equal(decodedToken.user.id);
      });

  });
});


describe('PUT /api/events', function() {
  it('Should rename the event title to `Applebees Dinner`', function() {
    return chai.request(app)
      .put('/api/events/5aed2c4fe235b238ba0da123')
      .set('Authorization', `Bearer ${authToken}`)
      .send({'title':'Applebees Dinner'})
      .then(response => {
        expect(response).to.have.status(200);
        return Event.find({'_id':'5aed2c4fe235b238ba0da123'});
      })
      .then(res => {
        expect(res[0].title).to.equal('Applebees Dinner');
      })
  });
});

describe('DELETE /api/events/5aed2c4fe235b238ba0da123', function() {
  it('Should delete the correct event', function () {

  });
});