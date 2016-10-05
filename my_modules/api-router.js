"use strict";
const express = require('express');
const api_router = express.Router();

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

module.exports = api_router;
