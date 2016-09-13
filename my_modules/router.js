"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const security = require('./security');

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });

// Body parser
router.use(bodyParser.urlencoded({ extended: false }))

// define the home page route
router.get('/', function(req, res){
  res.render('index');
});

// define the about route
router.post('/login', function(req, res){
  console.log('req.url', req.url);
  security.login(req.body.userName, req.body.password)
  .then((user) => {
    console.log('user');
    console.log(user);
    if(user) res.json({error: null, user: user});
    else res.status(401).json({error: 'Wrong user name or password.', user: null});
  })
  .catch((err) => {
    console.error('ERROR_Login - router.js module - Returned error: ' + err);
    res.status(503).json({error: 'There was a problem with the login process, please try again later.', user: null});
  })
});

module.exports = router;
