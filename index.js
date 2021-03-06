'use strict';
//================================== Import Dependencies ====================>

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const jwtStrategy = require('./passport/jwt');
const {
  PORT,
  CLIENT_ORIGIN
} = require('./config');
const {
  dbConnect
} = require('./db-mongoose');
const app = express();

//================================== Middleware ====================>

passport.use(jwtStrategy);
app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);
// body parser
app.use(express.json());

//================================== Mount Routes ====================>
// google log in
const googleLoginRoute = require('./routes/googleLogin.routes');
app.use('/login', googleLoginRoute);
// local sign up
const signupRoute = require('./routes/signup.routes');
app.use('/signup', signupRoute);
//local log in
const localLoginRoute = require('./routes/localLogin.routes');
app.use('/login/local', localLoginRoute);

//protect api route with jwt
app.use(passport.authenticate('jwt', {
  session: false,
  failWithError: true
}));
// Events Route
const eventRoute = require('./routes/events.routes');
app.use('/api', eventRoute);
const userRoute = require('./routes/users.routes');
app.use('/user', userRoute);

app.use((err, req, res, next) => {
  console.log(err);
  err.status = err.status || 500;
  err.message = err.message || 'Internal Server Error';
  err.location = err.location ? err.location : 'unknown';
  res.status(err.status).json({
    message: err.message,
    status: err.status,
    location: err.location
  });
});

//================================== Run Server Logic ====================>

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;