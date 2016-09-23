"use strict";

const fs = require('fs');
const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const config = require('../config.json');
const db_ip = config.database.ip;
const db_port = config.database.port;
const db_name = config.database.name;
const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
const ObjectID = require('mongodb').ObjectID;

const Prize = function(prize_info){

  if(!prize_info.type || !prize_info.sponsor || !prize_info.description || !prize_info.stock)
    throw 'ERROR: To create a new prize, "type", "sponsor", "description" and "stock", must be provided';
  if(isNaN(parseInt(prize_info.stock)))
    throw 'ERROR: The stock value must be a integer';

  // Properties
  let id = prize_info.id;
  let type = prize_info.type;
  let sponsor = prize_info.sponsor;
  let description = prize_info.description;
  let stock = parseInt(prize_info.stock);
  let set_date = prize_info.set_date;
  let update_date = prize_info.update_date;
  let due_date = prize_info.due_date ? new Date(prize_info.due_date).getTime() : null;
  let note = prize_info.note ? prize_info.note : null;

  // Returns a new Promise
  const save = () => {
    return new Promise((resolve, reject) => {
      mongo.connect(url, function(err, db){
        if(err) return reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: ' + err);
        else{
          const prizes = db.collection('prizes');
          prizes.insert({
            'type': type,
            'sponsor': sponsor,
            'description': description,
            'stock': stock,
            'set_date': Date.now(),
            'update_date': null,
            'due_date': due_date,
            'note': note
          })
          .then((WriteResult) => {
            id = WriteResult.ops[0]._id;
            db.close();
            return resolve('The prize "' + type + ' - ' + description + '" was saved');
          })
          .catch((err) => {
            db.close();
            return reject('ERR_DB - There was a problem insertin on the database - db_prizes module - Returned ERROR: ' + err);
          });
        }
      });
    });
  }

  const update = () => {
    if(!id)
      throw "ERROR: A prize can only be edited after it has been saved";
    return new Promise((resolve, reject) => {
      mongo.connect(url, function(err, db){
        if(err) return reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: ' + err);
        else{
          const prizes = db.collection('prizes');
          const WriteResult = prizes.update(
            {
              _id: ObjectID(id)
            },
            {
              'type': type,
              'sponsor': sponsor,
              'description': description,
              'stock': stock,
              'update_date': Date.now(),
              'due_date': due_date,
              'note': note
            }
          );
          db.close();
          return resolve('The prize "' + type + ' - ' + description + '" was saved');
        }
      });
    });
  }

  // Returns a promise
  const stockIncrease = (value) => {
    return new Promise((resolve, reject) => {
      if(isNaN(parseInt(value)) || parseInt(value) <= 0)
        return reject("ERROR: The stock's modifier value must be a integer greater than 0");
      stock += parseInt(value);
      update()
      .then((result) => {
        return resolve(result);
      })
      .catch((err) => {
        stock -= parseInt(value);
        return reject(err);
      })
    });
  }

  // Returns a promise
  const stockDecrease = (value) => {
    if(isNaN(parseInt(value)) || parseInt(value) <= 0)
      throw "ERROR: The stock's modifier value must be a integer greater than 0";
    if(stock - parseInt(value) < 0)
      throw "ERROR: The decrease value can't be superior to the actual stock";
    stock -= parseInt(value);
    return new Promise((resolve, reject) => {
      update().then()
    });
  }

  return {
    save: save,
    stockIncrease: stockIncrease,
    stockDecrease: stockDecrease,
    update: update,
    stock: () => stock
  }

}

module.exports = {
  Prize: Prize,
}
