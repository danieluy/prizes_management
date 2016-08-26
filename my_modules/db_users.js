
"use strict";
const fs = require('fs');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const config = require('../config.json');
const db_ip = config.database.ip;
const db_port = config.database.port;
const db_name = config.database.name;
const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
const security = require('./security.js');
const ObjectID = require('mongodb').ObjectID;
let current_userNames = [];

const init = () => {
  // pre-fetch the user names so that it can use them to check if the new user name already exists
  let interval = setInterval(()=>{
    findAll()
    .then((results) => {
      if(results.length)
        clearInterval(interval);
      current_userNames = results.map((result) => result.getUserName());
      console.log('current_userNames');
      console.log(current_userNames);
    })
    .catch((err)=>{console.error('ERROR Can\'t fetch the current user names - db_users module - Returned ERROR: ' + err)});
  },1000)
}

const User = function(user_info){
  console.log('current_userNames.indexOf(user_info.userName) = ', current_userNames.indexOf(user_info.userName));
  if(!user_info.userName || !user_info.password || !user_info.role)
    throw 'ERROR: To create a new user, "userName", "password" and "role", must be provided';
  if(user_info.role.toLowerCase() !== 'admin' && user_info.role.toLowerCase() !== 'user')
    throw 'ERROR: The new user\'s "role" can only be "admin" or "user"';
  if(current_userNames.indexOf(user_info.userName.toLowerCase()) >= 0)
    throw 'ERROR: The user name "' + user_info.userName + '" is already in use';
  let id = user_info.id ? ObjectID(user_info.id) : null,
  userName = user_info.userName.toLowerCase(),
  password = user_info.password,
  role = user_info.role.toLowerCase(),
  email = user_info.email ? user_info.email.toLowerCase() : null,
  set_date = user_info.set_date || Date.now();
  return {
    getId: () => id.valueOf(),
    getUserName: () => userName,
    setUserName: (_userName) => {userName = _userName},
    getEmail: () => email,
    setEmail: (_email) => {email = _email},
    getRole: () => role,
    setRole: (_role) => {role = _role},
    getSet_date: () => set_date
  }
}

const findAll = () => {
  return new Promise(function(resolve, reject){
    mongo.connect(url, function(err, db){
      if(err){
        db.close();
        return reject('ERR_DB - Unable to connect to the database - db_users module - Returned ERROR: ' + err);
      }
      else{
        var users = db.collection('users');
        users.find().toArray((err, array) => {
          db.close();
          if(err) return reject('ERR_DB - Unable to fetch prizes data - db_users module - Returned ERROR: ' + err);
          return resolve(array.map((r) => {
            return new User({
              id: r._id,
              userName: r.userName,
              password: r.password,
              email: r.email,
              role: r.role,
              set_date: r.set_date
            });
          }));
        });
      }
    });
  });
}

const findUserName = (_userName) => {
  return new Promise(function(resolve, reject){
    mongo.connect(url, function(err, db){
      if(err){
        db.close();
        return reject('ERR_DB - Unable to connect to the database - db_users module - Returned ERROR: ' + err);
      }
      else{
        var users = db.collection('users');
        users.find({userName: _userName}).toArray((err, array) => {
          db.close();
          if(err) return reject('ERR_DB - Unable to fetch prizes data - db_users module - Returned ERROR: ' + err);
          return resolve(array.map((r) => {
            return new User({
              id: r._id,
              userName: r.userName,
              password: r.password,
              email: r.email,
              role: r.role,
              set_date: r.set_date
            });
          }));
        });
      }
    });
  });
}

module.exports = {
  init: init,
  User: User,
  findUserName: findUserName
};
