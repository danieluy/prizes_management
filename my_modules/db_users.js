
"use strict";
(function(){
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

  const User = function(user_info){
    if(!user_info.userName || !user_info.password || !user_info.role){
      throw new Exception('ERROR: To create a new user, "userName", "password" and "role", must be provided');
      return;
    }
    if(user_info.role !== 'admin' && user_info.role !== 'user'){
      throw new Exception('ERROR: The new user\'s "role" can only be "admin" or "user"');
      return;
    }
    let id = user_info.id ? ObjectID(user_info.id) : null,
        userName = user_info.userName,
        password = user_info.password,
        email = user_info.email,
        role = user_info.role,
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
    User: User,
    findUserName: findUserName
  };

}());
