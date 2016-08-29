
"use strict";
const fs = require('fs'),
      mongodb = require('mongodb'),
      mongo = mongodb.MongoClient,
      config = require('../config.json'),
      db_ip = config.database.ip,
      db_port = config.database.port,
      db_name = config.database.name,
      url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name,
      security = require('./security.js'),
      ObjectID = require('mongodb').ObjectID;
let g_current_userNames = [];

// const init = () => {
//   // pre-fetch the user names so that it can use them to check if the new user name already exists
//   let interval = setInterval(()=>{
//     findAll()
//     .then((results) => {
//       if(results.length)
//         clearInterval(interval);
//       g_current_userNames = results.map((result) => result.getUserName());
//     })
//     .catch((err) => {console.error('ERROR Can\'t fetch the current user names - db_users module - Returned ERROR: ' + err)});
//   },500)
// }

const User = function(user_info){
  if(!user_info.userName || !user_info.password || !user_info.role)
    throw 'ERROR: To create a new user, "userName", "password" and "role", must be provided';
  if(user_info.role.toLowerCase() !== 'admin' && user_info.role.toLowerCase() !== 'user')
    throw 'ERROR: The new user\'s "role" can only be "admin" or "user"';

  // Properties
  let id = user_info.id ? ObjectID(user_info.id) : null,
  userName = user_info.userName.toLowerCase(),
  password = user_info.password,
  role = user_info.role.toLowerCase(),
  email = user_info.email ? user_info.email.toLowerCase() : null,
  set_date = user_info.set_date || Date.now();

  // Methods
  const save = () => {
    return new Promise((resolve, reject) => {
      // Check if the userName already exists
      findUserName(userName)
      .then((result) => {
        if(result) return reject('The user name "' + userName + '" is already been taken');
        mongo.connect(url, function(err, db){
          if(err){
            db.close();
            return reject('ERR_DB - Unable to connect to the database - db_users module - Returned ERROR: ' + err);
          }
          else{
            var users = db.collection('users');
            users.insert({
              'userName': userName,
              'password': password,
              'role': role,
              'email': email,
              'set_date': set_date
            }, (WriteResult) => {
              db.close();
              return resolve(WriteResult);
            });
          }
        });
      })

    });

  }

  return {
    getId: () => id.valueOf(),
    getUserName: () => userName,
    setUserName: (_userName) => {userName = _userName},
    getEmail: () => email,
    setEmail: (_email) => {email = _email},
    getRole: () => role,
    setRole: (_role) => {role = _role},
    getSet_date: () => set_date,
    save: save
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
          return resolve((() => {
            if(array.length)
              return new User({
                id: array[0]._id,
                userName: array[0].userName,
                password: array[0].password,
                email: array[0].email,
                role: array[0].role,
                set_date: array[0].set_date
              });
            return null;
          })());
        });
      }
    });
  });
}

module.exports = {
  // init: init,
  User: User,
  findUserName: findUserName
};
