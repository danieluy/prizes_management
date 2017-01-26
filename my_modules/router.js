"use strict";
const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const security = require('./security');
const headers = require('./headers.js');
const path = require('path');

// Body parser
router.use(bodyParser.urlencoded({ extended: false }))

// write CORS headers
router.use(headers.writeCORS);

// test only
// router.use((req, res, next) =>{
//   console.log('router', req.session.user);
//   next();
// })

//  home  //////////////////////////////////////////////////////////////////////
router.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/users', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/prizes', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/winners', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../public/index.html'))
});

//  login  /////////////////////////////////////////////////////////////////////
router.post('/login', (req, res) => {
  security.login(req.body.userName, req.body.password)
    .then((user) => {
      if (user) {
        req.session.user = user.userName;
        req.session.role = user.role;
        res.status(200).json({ error: null, user: user });
      }
      else {
        req.session.reset();
        res.status(200).json({ error: 'Wrong user name or password.', user: null });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(503).json({ error: 'There was a problem with the login process, please try again later.', details: err.toString() });
    })
});

//  logout  ////////////////////////////////////////////////////////////////////
router.post('/logout', (req, res) => {
  if (req.session)
    req.session.reset();
  res.status(200).json({ error: null, user: null });
});


module.exports = router;
