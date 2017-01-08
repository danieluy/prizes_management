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
const requireLogin = require('./security.js').requireLogin;
const headers = require('./headers.js');

// Require login
json_api_router.use(requireLogin);

// Body parser
json_api_router.use(bodyParser.json());

// write CORS headers
json_api_router.use(headers.writeCors);

// test only
// json_api_router.use((req, res, next) =>{
//   console.log('json_api_router', req.session.user);
//   next();
// })

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

// Winners  ////////////////////////////////////////////////////////////////////
json_api_router.post('/winners/handprize', (req, res) => {
  let winner_ci = req.body.winner_ci;
  let prize_id = req.body.prize_id;
  if(winner_ci && prize_id){
    Prizes.findById(prize_id)
    .then((prize) => {
      if(prize){
        Winners.findByCi(winner_ci)
        .then((winner) => {
          if(winner){
            winner.handOverPrize(prize_id)
            .then((WriteResult) => {
              if(WriteResult.nModified > 0){
                res.status(200).json({message: "The prize was correctly handed over"});
              }
              else {
                res.status(500).json({error: "There was a problem handing over the prize", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ winner.handOverPrize("+prize_id+") ]"});
              }
            })
          }
          else{
            res.status(500).json({error: "The winner could not be found", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ Winners.findByCi("+winner_ci+") ]"});
          }
        })
      }
      else{
        res.status(500).json({error: "The prize could not be found", details: "ERROR [ api-router.js ][ post(/winners/handprize) ][ Prizes.findById("+prize_id+") ]"});
      }
    })
    .catch((err) => {
      res.status(500).json({error: "There was a problem handing over the prize", details: err.toString()});
    })
  }
  else {
    res.status(400).json({error: "Bad request, a winner's ci and prize id must be provided", details: "ERROR [ api-router.js ][ post(/winners/handprize) ]"});
  }
});
