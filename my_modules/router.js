"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const security = require('./security');

// Body parser
router.use(bodyParser.urlencoded({ extended: false }))

//  home  //////////////////////////////////////////////////////////////////////
router.get('/', (req, res) => {
  res.render('index');
});
//  login  /////////////////////////////////////////////////////////////////////
router.post('/login', (req, res) => {
  security.login(req.body.userName, req.body.password)
  .then((user) => {
    if(user) {
      req.session.user = user.userName;
      req.session.role = user.role;
      res.json({error: null, user: user});
    }
    else {
      req.session.reset();
      res.status(401).json({error: 'Wrong user name or password.', user: null});
    }
  })
  .catch((err) => {
    res.status(503).json({error: 'There was a problem with the login process, please try again later.', user: null});
  })
});
//  logout  ////////////////////////////////////////////////////////////////////
router.post('/logout', (req, res) => {
  if(req.session){
    req.session.reset();
    res.json({error: null, user: null});
  }
});


module.exports = router;
