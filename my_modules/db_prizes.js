(function(){

  "use strict"

  const fs = require('fs');
  const mongodb = require('mongodb');
  const mongo = mongodb.MongoClient;
  const config = require('../config.json');
  const db_ip = config.connection.database.ip;
  const db_port = config.connection.database.port;
  const db_name = config.connection.database.name;
  const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
  const ObjectID = require('mongodb').ObjectID;

  exports.Prize = function (_type, _sponsor, _description, _quantity, _set_date, _due_date, _note){
    let type = _type,
        sponsor = _sponsor,
        description = _description,
        quantity = _quantity,
        set_date = _set_date || Date.now(),
        due_date = _due_date || null,
        note = _note || null
    return {
      save: () => {
        return new Promise( (resolve, reject) => {
          mongo.connect(url, (err, db) => {
            let result = null;
            if(err) result = reject('ERR_DB - Unable to connect to the database');
            else{
              const prizes = db.collection('prizes');
              prizes.insert(
                {
                  type: type,
                  sponsor: sponsor,
                  description: description,
                  quantity: quantity,
                  set_date: set_date,
                  due_date: due_date,
                  note: note
                }
              )
              .then( () => {
                result = resolve();
              })
              .catch( (err) => {
                result = reject('ERR_DB - Unable to insert in the database');
              });
            }
            db.close();
            return result;
          });
        });
      }
    }
  }

  exports.all = function(){
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

  const id = exports.id = function(_id){
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
              result = resolve(data);
            }
            db.close();
          });
        }
        return result;
      });
    });
  }

  exports.ids = (_ids_array) => {
    return Promise.all(
      (() => {
        let stack = [];
        for(let i=0; i < _ids_array.length; i++){
          stack.push( id(_ids_array[i]) );
        }
        return stack;
      }())
    );
  }

  //  Test the dates  ----------------------------------------------------------
  exports.active =  (prizes) => {
    return prizes.filter((prize) => {
      return ((prize.quantity > 0 && !prize.due_date) || (prize.quantity > 0 && prize.due_date && prize.due_date >= new Date()))
    })
  }

  exports.sort_type = function(prizes){
    return prizes.sort((a, b) => {
      return a.type >= b.type ? 1 : -1;
    });
  }

  exports.distinct = function(field){
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

  exports.return_stock = function(prize_id){
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

}());
