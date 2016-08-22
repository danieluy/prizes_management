"use strict";

(function(){

  const fs = require('fs');
  const mongodb = require('mongodb');
  const mongo = mongodb.MongoClient;
  const config = require('../config.json');
  const db_ip = config.connection.database.ip;
  const db_port = config.connection.database.port;
  const db_name = config.connection.database.name;
  const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
  const ObjectID = require('mongodb').ObjectID;



  const Prize = function(_id, _type, _sponsor, _description, _quantity, _due_date, _note){

    let id = _id || null,
        type = _type,
        sponsor = _sponsor,
        description = _description,
        quantity = _quantity,
        set_date = Date.now(),
        due_date = _due_date ? new Date(_due_date).getTime() : null,
        note = _note || null

    const save = () => {
      return new Promise((resolve, reject) => {
        mongo.connect(url, (err, db) => {
          if(err){
            db.close();
            return reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: ' + err);
          }
          else{
            const prizes = db.collection('prizes');
            const prize_to_save = {
              type: type,
              sponsor: sponsor,
              description: description,
              quantity: quantity,
              set_date: set_date,
              due_date: due_date,
              note: note
            }
            prizes.insert(prize_to_save, (err, WriteResult) => {
              db.close();
              if(err) return reject('ERROR_DB - There was a problem inserting data - db_prizes module - Returned ERROR: ' + err);
              else{
                id = ObjectID(WriteResult.insertedIds[0]);
                return resolve(WriteResult);
              }
            });
          }
        });
      });
    }

    const decrStock = (_amount) => {
      if(quantity - _amount >= 0){
        quantity = quantity - _amount;
        save().then(() => quantity).catch(() => -1)
      }
    }

    const update = () => {
      // functionality goes here ;)
      return;
    }

    const getInfo = () => {
      const data = {
        id: id,
        type: type,
        sponsor: sponsor,
        description: description,
        quantity: quantity,
        set_date: set_date,
        due_date: due_date,
        note: note
      }
      console.log('<<< data >>>');
      console.log(data);
      return {
        data
      }
    }

    return {
      save: save,
      update: update,
      decrStock: decrStock,
      getId: () => id,
      getInfo: getInfo
    }
  }

  const all = function(){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database\n' + err);
        }
        else{
          var prizes = db.collection('prizes');
          prizes.find().toArray(function(err, data){
            if(err){
              result = reject('ERR_DB - Unable to fetch prizes data\n' + err);
            }
            else{
              result = resolve(data);
            }
            db.close();
          });
        }
        return result;
      });
    });
  }

  const id = function(_id){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database\nfile: db_prizes.js');
        }
        else{
          var prizes = db.collection('prizes');
          var objectId = new ObjectID(_id);
          prizes.find({_id : objectId}).toArray(function(err, data){
            if(err){
              result = reject('ERR_DB - Unable to fetch prizes data\nfile: db_prizes.js');
            }
            else{
              result = resolve(new Prize(data._id, data.type, data.sponsor, data.description, data.quantity, data.due_date, data.note));
            }
            db.close();
          });
        }
        return result;
      });
    });
  }

  const ids = (_ids_array) => {
    return Promise.all(
      // Resturns an array containing a new Promise for each id in the _ids_array
      (() => _ids_array.map((_id) => id(_id)))()
    );
  }

  const decrPrizeStock = (_prizeId, _amount) => {
    return new Promise((resolve, reject) => {
      id(_prizeId)
      .then((_prize) => {
        if(_prize.decrStock(_amount) >= 0) return resolve();
        else return reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: Stock insuficiente id:'+_prize.getId())
      })
      .catch((err) => {
        reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: ' + err);
      });
    });
  }

  //  Test the dates  ----------------------------------------------------------
  const active =  (prizes) => {
    return prizes.filter((prize) => {
      return ((prize.quantity > 0 && !prize.due_date) || (prize.quantity > 0 && prize.due_date && prize.due_date >= new Date()))
    })
  }

  const sort_type = function(prizes){
    return prizes.sort((a, b) => {
      return a.type >= b.type ? 1 : -1;
    });
  }

  const distinct = function(field){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database\nfile: db_prizes.js');
        }
        else{
          var prizes = db.collection('prizes');
          prizes.distinct(field, function(err, _data){
            if(err){
              result = reject('ERR_DB - Unable to fetch prizes data\nfile: db_prizes.js');
            }
            else{
              result = resolve(_data);
            }
            db.close();
          });
        }
        return result;
      });
    });
  }

  const return_stock = function(prize_id){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database\nfile: db_prizes.js');
        }
        else{
          var prizes = db.collection('prizes');
          var objectId = new ObjectID(prize_id);
          prizes.update({_id : objectId}, { $inc: { quantity: 1} }, function(err, result){
            if(err){
              result = reject('ERR_DB - Unable to fetch prizes data\nfile: db_prizes.js');
            }
            else{
              result = resolve(result);
            }
            db.close();
          });
        }
        return result;
      });
    });
  }

  module.exports = {
    Prize: Prize,
    all: all,
    id: id,
    ids: ids,
    decrPrizeStock: decrPrizeStock,
    active: active,
    sort_type: sort_type,
    distinct: distinct,
    return_stock: return_stock
  };

}());
