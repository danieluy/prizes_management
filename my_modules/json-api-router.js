"use strict";
const express = require('express');
const json_api_router = express.Router();
const bodyParser = require("body-parser");
const Prizes = require('./prizes.js');
const Prize = Prizes.Prize;
const Users = require('./users.js');
const User = Users.User;
const Winners = require('./winners.js');
const Winner = Winners.Winner;

// Body parser
json_api_router.use(bodyParser.json());

// write CORS headers
json_api_router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

//  Users  /////////////////////////////////////////////////////////////////////

json_api_router.put('/users', (req, res) => {
  let u = new User({
    userName: req.body.name,
    password: req.body.password,
    role: req.body.role,
    email: req.body.email
  })
  .save()
  .then((WriteResult) => {
    if(WriteResult.insertedCount > 0){
      res.status(200).json({message: 'The user has been correctly saved'});
    }
    else
      res.status(500).json({error: "There was a problem creating the user", details: err.toString()});
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem creating the user", details: err.toString()});
  })
});

module.exports = json_api_router;
