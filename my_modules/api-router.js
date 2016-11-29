"use strict";
const express = require('express');
const api_router = express.Router();
const bodyParser = require("body-parser");
const Prizes = require('./prizes.js');
const Prize = Prizes.Prize;
const Winners = require('./winners.js');
const Winner = Winners.Winner;

// Body parser
api_router.use(bodyParser.urlencoded({ extended: false }))

// write CORS headers
api_router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//  Prizes  ////////////////////////////////////////////////////////////////////

api_router.get('/prizes', (req, res) => {
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

//  Winners  ///////////////////////////////////////////////////////////////////

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

api_router.put('/winners', (req, res) => {
  // console.log("api_router.put('/winners',...");
  // console.log('req.body.prize_id', req.body.prize_id);
  // console.log('req.body.ci', req.body.ci);
  // console.log('req.body.name', req.body.name);
  // console.log('req.body.lastname', req.body.lastname);
  Winners.findByCi(req.body.ci)
  .then((winner) => {
    // console.log('winner', winner);
    if(winner){
      Prizes.findById(req.body.prize_id)
      .then((prize) => {
        if(prize){
          console.log('prize', prize);
          if(prize.getStock() > 0){
            prize.stockDecrease(1)
            .then((Writeresult) => {
              if(WriteResult.nModified > 0){
                winner.addPrize(req.body.prize_id)
                .then((WriteResult) => {
                  if(WriteResult.nModified > 0)
                  res.status(200).json({message: 'The prize has been correctly assigned'});
                  else
                  res.status(500).json({error: "There was a problem assigning the prize", details: "ERROR on Winner's method: " + winner + ".addPrize(" + req.body.prize_id + ")"});
                })
              }
              else {
                res.status(500).json({error: "There was a problem prize's stock", details: "ERROR on Prizes's method: prize.stockDecrease(1)"});
              }
            })
          }
          else{
            res.status(500).json({error: "There is not enough stock", details: "ERROR trying to assign a prize to an existing winner"});
          }
        }
        else{
          res.status(500).json({error: "There prize couldn't be found", details: "ERROR trying to assign a prize to an existing winner"});
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
              // I was debuging at this point
              console.log('prize.getStock() =', prize.getStock());
              if(prize.getStock() > 0){
                prize.stockDecrease(1)
                .then((Writeresult) => {
                  if(WriteResult.nModified > 0){
                    Winners.findByCi(req.body.ci)
                    .then((winner) => {
                      winner.addPrize(req.body.prize_id)
                      .then((WriteResult) => {
                        if(WriteResult.nModified > 0)
                        res.status(200).json({message: 'The prize has been correctly assigned'});
                        else
                        res.status(500).json({error: "There was a problem assigning the prize", details: "ERROR on Winner's method: " + winner + ".addPrize(" + req.body.prize_id + ")"});
                      })
                    })
                  }
                  else {
                    res.status(500).json({error: "There was a problem prize's stock", details: "ERROR on Prizes's method: prize.stockDecrease(1)"});
                  }
                })
              }
              else{
                res.status(500).json({error: "There is not enough stock", details: "ERROR trying to assign a prize to a new winner"});
              }
            }
            else{
              res.status(500).json({error: "There prize couldn't be found", details: "ERROR trying to assign a prize to a new winner"});
            }
          })
        }
        else{
          res.status(500).json({error: "There was a problem saving a new winner", details: "ERROR on Winner's method: " + winner + ".save()"});
        }
      })
    }
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({error: "There was a problem asigning the prize", details: err.toString()});
  })
});

// api_router.post('/winners/addprize', (req, res) => {
//   Winners.findByCi(req.body.ci)
//   .then((winner) => {
//     if(winner){
//       winner.addPrize(req.body.prize_id)
//       .then((WriteResult) => {
//         if(WriteResult.nModified > 0)
//         res.status(200).json({message: 'The prize has been correctly added'});
//         else
//         res.status(500).json({error: "There was a problem adding the prize", details: err.toString()});
//       })
//     }
//     else res.status(500).json({error: "The winner couldn't be found", details: 'Winners.findByCi() returned null for the value ' + req.body.ci});
//   })
//   .catch((err) => {
//     res.status(500).json({error: "There was a problem adding the prize", details: err.toString()});
//   })
// });

module.exports = api_router;
