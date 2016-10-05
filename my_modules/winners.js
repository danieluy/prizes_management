(function(){
  'use strict'

  const fs = require('fs');
  const mongodb = require('mongodb');
  const mongo = mongodb.MongoClient;
  const config = require('../config.json');
  const db_ip = config.connection.database.ip;
  const db_port = config.connection.database.port;
  const db_name = config.connection.database.name;
  const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
  const ObjectID = require('mongodb').ObjectID;

  const Winner = exports.Winner = function (_id, _ci, _name, _lastname, _facebook, _gender, _phone, _mail, _prizes){
    // Converts the ID value or values recieved to Mongo's ObjecId
    if(_prizes){
      _prizes.forEach((_prize) => {
        _prize.id = ObjectID(_prize.id);
      });
    }
    // Private attributes
    let id = _id || null;
    let ci = _ci;
    let name = _name || null;
    let lastname = _lastname || null;
    let facebook = _facebook || null;
    let gender = _gender || null;
    let phone = _phone || null;
    let mail = _mail || null;
    const prizes = _prizes || [];
    // Private Mathods
    const save = () => {
      return new Promise( (resolve, reject) => {
        mongo.connect(url, (err, db) => {
          if(err){
            db.close();
            return reject('ERR_DB - Unable to connect to the database - db_winners module - Returned ERROR: ' + err);
          }
          else{
            const winners = db.collection('winners');
            const winner_to_save = {
              ci: ci,
              name: name,
              lastname: lastname,
              facebook: facebook,
              gender: gender,
              phone: phone,
              mail: mail,
              prizes: prizes
            }
            winners.insert(winner_to_save, (err, WriteResult) => {
              db.close();
              if(err) return reject('ERROR_DB - There was a problem inserting data - db_winners module - Returned ERROR: ' + err);
              else{
                id = ObjectID(WriteResult.insertedIds[0]);
                return resolve(WriteResult);
              }
            });
          }
        });
      });
    }
    const addPrize = (prize_id) => {
      prizes.push({ 'id': ObjectID(prize_id), 'handed': false, 'granted': Date.now() });
      save();
    }

    return {
      // Public Methods
      addPrize: addPrize,
      save: save,
      // Public Properties
      getPrizes: () => prizes
    }
  }

  exports.ci = (_ci) => {
    return new Promise((resolve, reject) => {
      mongo.connect(url, (err, db) => {
        if(err) return reject('ERR_DB - Unable to connect to the database - db_winners module - Returned ERROR: ' + err);
        const winners = db.collection('winners');
        winners.findOne({ci: _ci}, (err, r) => {
          db.close();
          if(err){
            return reject('ERR_DB - Unable to fetch winners data - db_winners module - Returned ERROR: ' + err);
          }
          else{
            if(!r) return resolve(null);
            return resolve(new Winner(r._id, r.ci, r.name, r.lastname, r.facebook, r.gender, r.phone, r.mail, r.prizes));
          }
        });
      });
    });
  };

  exports.query = function(_query){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database - db_winners module - Returned ERROR: ' + err);
        }
        else{
          var winners = db.collection('winners');
          var _regExpr = new RegExp(_query, "i");
          winners.find({$or:
            [
              {'ci': _regExpr},
              {'name': _regExpr},
              {'lastname': _regExpr},
              {'facebook': _regExpr},
              {'phone': _regExpr},
              {'mail': _regExpr}
            ]
          }).toArray(function(err, data){
            if(err){
              result = reject('ERR_DB - Unable to fetch winners data - db_winners module - Returned ERROR: ' + err);
            }
            else if(data.length > 0){
              result = resolve(data);
            }
            else{
              result = resolve(null);
            }
            db.close();
          });
        }
        return result;
      });
    });
  };

  exports.updatePrizes = function(winner_ci, updated_prizes){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err) return reject('ERR_DB - Unable to connect to the database - db_winners module - Returned ERROR: ' + err);
        var winners = db.collection('winners');
        winners.update({ci: winner_ci}, {$set: {prizes: updated_prizes}}, function(err, write_result){
          if(err){
            result = reject('ERR_DB - Unable to fetch winners data - db_winners module - Returned ERROR: ' + err);
          }
          else{
            result = resolve(write_result);
          }
          db.close();
        });
        return result;
      });
    });
  }

  exports.findAll = function(){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err) return reject('ERR_DB - Unable to connect to the database\n' + err);
        var winners = db.collection('winners');
        winners.find({}).toArray(function(err, found_winners){
          if(err){
            result = reject('ERR_DB - Unable to fetch to the winners data\n' + err);
          }
          else if(data.length){
            result = resolve(found_winners);
          }
          db.close();
        });
        return result;
      });
    });
  };

}());
