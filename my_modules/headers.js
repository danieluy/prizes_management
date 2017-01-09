"use strict";

const ip = require('ip');

const writeCORS = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  // res.header("Access-Control-Allow-Origin", "http://${{ip.address()}}:1043");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", true);
  next();
}

module.exports = {
  writeCORS: writeCORS
};
