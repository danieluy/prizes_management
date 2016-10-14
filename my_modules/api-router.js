"use strict";
const express = require('express');
const api_router = express.Router();
const bodyParser = require("body-parser");
const Prizes = require('./prizes.js');
const Prize = Prizes.Prize

// Body parser
api_router.use(bodyParser.urlencoded({ extended: false }))

// write CORS headers
api_router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// define the home page route
api_router.post('/', (req, res) => {
  res.json({"message":"JSON response"});
});

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

module.exports = api_router;
