"use strict";
const express = require('express');
const api_router = express.Router();
const bodyParser = require("body-parser");
const Prizes = require('./prizes.js');
const Prize = Prizes.Prize;
const Users = require('./users.js');
const User = Users.User;
const Winners = require('./winners.js');
const Winner = Winners.Winner;
const requireLogin = require('./security.js').requireLogin;

api_router.use((req, res, next) => console.log(req.session))

// Body parser
api_router.use(bodyParser.urlencoded({ extended: false }))

// write CORS headers
api_router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//  Prizes  ////////////////////////////////////////////////////////////////////

api_router.get('/prizes', requireLogin, (req, res) => {
  Prizes.findAll()
  .then((results) => {
    if(results)
      res.status(200).json(results.map((result) => result.getPublicData()));
    else
      res.status(200).json([]);
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem fetching the prizes data", details: err.toString()});
  })
});

api_router.put('/prizes', (req, res) => {
  var p = new Prize({
    type: req.body.type,
    sponsor: req.body.sponsor,
    description: req.body.description,
    stock: req.body.stock,
    due_date: req.body.due_date,
    note: req.body.note
  })
  .save()
  .then((WriteResult) => {
    if(WriteResult.insertedCount > 0){
      res.status(200).json({message: 'The prize has been correctly saved'});
    }
    else
      res.status(500).json({error: "There was a problem creating the prize", details: err.toString()});
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem creating the prize", details: err.toString()});
  })
});

//  Users  /////////////////////////////////////////////////////////////////////

api_router.get('/users', (req, res) => {
  Users.findAll()
  .then((results) => {
    if(results){
      res.status(200).json(results.map((result) => result.getPublicData()));}
    else
      res.status(200).json([]);
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem fetching the winner's data", details: err.toString()});
  })
});

api_router.put('/users', (req, res) => {
  var u = new User({
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

//  Winners  ///////////////////////////////////////////////////////////////////

api_router.get('/winners', (req, res) => {
  Winners.findAll()
  .then((results) => {
    if(results)
      res.status(200).json(results.map((result) => result.getPublicData()));
    else
      res.status(200).json([]);
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem fetching the winner's data", details: err.toString()});
  })
});

api_router.get('/winners/unhandedprizes', (req, res) => {
  Winners.findAll()
  .then((results) => {
    if(results){
      let formatted_results = results.map((result) => result.getPublicData());
      let filtered_results = formatted_results.filter((result) => {
        for (var i = 0; i < result.prizes.length; i++)
          if(!result.prizes[i].handed) return true;
        return false;
      });
      res.status(200).json(filtered_results);
    }
    else
      res.status(200).json([]);
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem fetching the winner's data", details: err.toString()});
  })
});

api_router.post('/winners/findci', (req, res) => {
  let ci = req.body.ci;
  Winners.findByCi(ci)
  .then((winner) => {
    if(winner){
      res.status(200).json({
        winner: {
          ci: winner.getCi(),
          name: winner.getName(),
          lastname: winner.getLastname(),
          facebook: winner.getFacebook(),
          gender: winner.getGender(),
          phone: winner.getPhone(),
          mail: winner.getMail(),
          prizes: winner.getPrizes()
        }
      })
    }
    else{
      res.status(200).json({winner: null})
    }
  })
  .catch((err) => {
    res.status(500).json({error: "There was a problem fetching the winner", details: err.toString()});
  })
});

api_router.post('/winners/handprize', (req, res) => {
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

api_router.put('/winners', (req, res) => {
  Winners.findByCi(req.body.ci)
  .then((winner) => {
    if(winner){
      Prizes.findById(req.body.prize_id)
      .then((prize) => {
        if(prize){
          if(prize.getStock() > 0){
            prize.stockDecrease(1)
            .then((WriteResult) => {
              if(WriteResult.nModified > 0){
                winner.addPrize(req.body.prize_id)
                .then((WriteResult) => {
                  if(WriteResult.nModified > 0)
                   res.status(200).json({message: 'The prize has been correctly assigned'});
                  else
                   res.status(500).json({error: "There was a problem assigning the prize", details: "ERROR [ api-router.js ][ put(/winners) ][ existing winner ][ winner.addPrize("+req.body.prize_id+") ]"});
                })
              }
              else {
                res.status(500).json({error: "There was a problem decreasing the prize's stock", details: "ERROR [ api-router.js ][ put(/winners) ][ existing winner ][ stockDecrease(1) ]"});
              }
            })
          }
          else{
            res.status(500).json({error: "There is not enough stock", details: "ERROR [ api-router.js ][ put(/winners) ][ existing winner ][ prize.getStock() <= 0 ]"});
          }
        }
        else{
          res.status(500).json({error: "There prize couldn't be found", details: "ERROR [ api-router.js ][ put(/winners) ][ existing winner ][ Prizes.findById("+req.body.prize_id+") ]"});
        }
      })
    }
    else{
      let winner = new Winner({
        ci: req.body.ci,
        name: req.body.name,
        lastname: req.body.lastname,
        facebook: req.body.facebook,
        gender: req.body.gender,
        phone: req.body.phone,
        mail: req.body.mail
      })
      winner.save()
      .then((WriteResult) => {
        if(WriteResult.insertedCount > 0){
          Prizes.findById(req.body.prize_id)
          .then((prize) => {
            if(prize){
              if(prize.getStock() > 0){
                prize.stockDecrease(1)
                .then((WriteResult) => {
                  if(WriteResult.nModified > 0){
                    Winners.findByCi(req.body.ci)
                    .then((winner) => {
                      winner.addPrize(req.body.prize_id)
                      .then((WriteResult) => {
                        if(WriteResult.nModified > 0)
                        res.status(200).json({message: 'The prize has been correctly assigned'});
                        else
                        res.status(500).json({error: "There was a problem assigning the prize", details: "ERROR [ api-router.js ][ put(/winners) ][ !existing winner ][ winner.addPrize("+req.body.prize_id+") ]"});
                      })
                    })
                  }
                  else {
                    res.status(500).json({error: "There was a problem decreasing the prize's stock", details: "ERROR [ api-router.js ][ put(/winners) ][ !existing winner ][ stockDecrease(1) ]"});
                  }
                })
              }
              else{
                res.status(500).json({error: "There is not enough stock", details: "ERROR [ api-router.js ][ put(/winners) ][ !existing winner ][ prize.getStock() <= 0 ]"});
              }
            }
            else{
              res.status(500).json({error: "There prize couldn't be found", details: "ERROR [ api-router.js ][ put(/winners) ][ !existing winner ][ Prizes.findById("+req.body.prize_id+") ]"});
            }
          })
        }
        else{
          res.status(500).json({error: "There was a problem saving a new winner", details: "ERROR [ api-router.js ][ put(/winners) ][ !existing winner ][ winner.save() ]"});
        }
      })
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({error: "There was a problem asigning the prize", details: err.toString()});
  })
});

module.exports = api_router;
