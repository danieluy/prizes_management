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

const db = require('./db.js');

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
  let note = prize_info.note;

  // Returns a new Promise
  const save = () => {
    return new Promise((resolve, reject) => {
      db.insert('users', {
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
        const result = JSON.parse(WriteResult);
        id = result.ops[0]._id;
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
    });
  }

  const update = () => {
    if(!id)
      throw "ERROR: A prize can only be edited after it has been saved";
    return new Promise((resolve, reject) => {
      db.update(
        'prizes',
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
      )
      .then((WriteResult) => {
        const result = JSON.parse(WriteResult);
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
    });
  }

  // Returns a promise
  const stockUpdate = (value) => {
    return new Promise((resolve, reject) => {
      if(isNaN(parseInt(value)) || parseInt(value) <= 0)
        return reject("ERROR: The stock's modifier value must be a integer greater than 0");
      stock += parseInt(value);
      update()
      .then((WriteResult) => {
        const result = JSON.parse(WriteResult);
        return resolve(result);
      })
      .catch((err) => {
        return reject(err);
      });
    });
  }

  return {
    save: save,
    update: update,
    stockPlus: (val) => {stockUpdate(Math.abs(val))},
    stockMinus: (val) => {stockUpdate(Math.abs(val) * -1)},
    stock: () => stock
  }

}

module.exports = {
  Prize: Prize,
}
