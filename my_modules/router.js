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
  security.login(req.body.userName, req.body.password)
  .then((user) => {
    console.log('user');
      console.log(user);
    if(user) res.json(user);
    else res.json(null);
  })
  .catch((err) => {
    console.error('ERROR_Login - Returned error: ' + err);
    res.send('ERROR_Login - Returned error: ' + err);
  })
});

module.exports = router;
