"use strict";
// const fs = require('fs');
// const mongodb = require('mongodb');
// const mongo = mongodb.MongoClient;
// const config = require('../config.json');
// const db_ip = config.database.ip;
// const db_port = config.database.port;
// const db_name = config.database.name;
// const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
// const ObjectID = require('mongodb').ObjectID;
const db = require('./db.js');
const hashPass = require('./security.js').hashPass;

const User = function(user_info){

  if (!user_info.userName || !user_info.password || !user_info.role)
    throw 'ERROR: To create a new user, "userName", "password" and "role", must be provided';
  if (user_info.role.toLowerCase() !== 'admin' && user_info.role.toLowerCase() !== 'user')
    throw 'ERROR: The new user\'s "role" can only be "admin" or "user"';

  // Properties
  let id = user_info.id;
  let userName = user_info.userName;
  let password = user_info.password;
  let role = user_info.role.toLowerCase();
  let email = user_info.email ? user_info.email : null;
  let set_date = user_info.due_date || Date.now();

  // Methods
  const save = () => {
    if(id)
      throw "ERROR: This prize has already been saved, try using the update method";
    return new Promise((resolve, reject) => {
      // Check if the userName already exists
      db.exists('users', {userName: userName})
      .then((result) => {
        if(result)
          return reject('The user name "' + userName + '" is already been taken');
        db.insert('users', {
          'userName': userName,
          'password': hashPass(password),
          'role': role,
          'email': email,
          'set_date': set_date
        })
        .then((WriteResult) => {
          id = WriteResult.ops[0]._id;
          return resolve(WriteResult);
        })
        .catch((err) => {
          return reject(err);
        });
      })
      .catch((err) => {
        return reject(err);
      });
    });
  }

  return {
    getId: () => id,
    getUserName: () => userName,
    getEmail: () => email,
    setEmail: (_email) => {email = _email},
    getRole: () => role,
    setRole: (_role) => {role = _role},
    getSet_date: () => set_date,
    getPassword: () => password,
    setPassword: (_password) => {password = hashPass(_password)},
    save: save
  }
}

const findAll = () => {
  return new Promise(function(resolve, reject){
    db.find('users')
    .then((results) => {
      if(results.length)
        return resolve(results.map((result) => {
          return new User({
            id: result._id,
            userName: result.userName,
            password: result.password,
            email: result.email,
            role: result.role,
            set_date: result.set_date
          });
        }));
      return resolve([]);
    })
    .catch((err) => {
      return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
    });
  });
}

const findByName = (userName) => {
  if(!userName)
    throw "The parameter userName must be provided";
  return new Promise(function(resolve, reject){
    db.findOne('users', {userName: userName.toString()})
    .then((result) => {
      if(result)
        return resolve (new User({
          id: result._id,
          userName: result.userName,
          password: result.password,
          email: result.email,
          role: result.role,
          set_date: result.set_date
        }));
      return resolve(null);
    })
    .catch((err) => {
      return reject('ERR_DB - Unable to fetch prizes data - Users module - Returned ERROR: ' + err);
    });
  });
}

module.exports = {
  User: User,
  findByName: findByName,
  findAll: findAll
};