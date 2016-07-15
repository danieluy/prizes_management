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

  exports.Prize = (type, sponsor, description, quantity, set_date, due_date, note) => {
    return {
      type: type || '',
      sponsor: sponsor || '',
      description: description || '',
      quantity: quantity || '',
      set_date: set_date || Date.now(),
      due_date: due_date || null,
      note: note || null,
      save: () => {
        return new Promise( (resolve, reject) => {
          mongo.connect(url, (err, db) => {
            let result = null;
            if(err) result = reject('ERR_DB - Unable to connect to the database\nFile: db_prizes.js');
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
                db.close();
              })
              .catch( (err) => {
                result = reject('ERR_DB - Unable to insert in the database\nFile: db_prizes.js');
                db.close();
              });
            }
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
          result = reject('ERR_DB - Unable to connect to the database\nFile: db_prizes.js');
        }
        else{
          var prizes = db.collection('prizes');
          prizes.find().toArray(function(err, data){
            if(err){
              result = reject('ERR_DB - Unable to fetch prizes data\nFile: db_prizes.js');
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

  exports.active =  (unfiltered) => {
    const active = [];
    const todayDate = new Date().getTime();
    for (let i = 0; i < unfiltered.length; i++) {
      if(unfiltered[i].quantity > 0 && unfiltered[i].due_date === '')
        active.push(unfiltered[i]);
      else if(unfiltered[i].quantity > 0 && unfiltered[i].due_date != '' && unfiltered[i].due_date.getTime() >= todayDate)
        active.push(unfiltered[i]);
    };
    return active;
  }

  exports.sort_type = function(unsorted){
    var sorted = unsorted.sort(function(a, b){
      var sort = 0;
      if(a.type > b.type) sort = 1;
      else if(a.type < b.type) sort = -1;
      return sort;
    });
    return sorted;
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
