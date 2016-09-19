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
  let id = prize_info.id ? ObjectID(prize_info.id) : null;
  let type = prize_info.type.toLowerCase();
  let sponsor = prize_info.sponsor.toLowerCase();
  let description = prize_info.description.toLowerCase();
  let stock = parseInt(prize_info.stock);
  let set_date = Date.now();
  let due_date = prize_info.due_date ? new Date(prize_info.due_date).getTime() : null;
  let note = prize_info.note ? prize_info.note.toLowerCase() : null;

  const save = () => {
    return new Promise((resolve, reject) => {
      mongo.connect(url, function(err, db){
        if(err) return reject('ERR_DB - Unable to connect to the database - db_prizes module - Returned ERROR: ' + err);
        else{
          const prizes = db.collection('prizes');
          const WriteResult = prizes.insert({
            'type': type,
            'sponsor': sponsor,
            'description': description,
            'stock': stock,
            'set_date': set_date,
            'due_date': due_date,
            'note': note
          });
          db.close();
          return resolve('The prize "' + type + ' - ' + description + '" was saved');
        }
      });
    });
  }

  return {
    save: save
  }

}

module.exports = {
  Prize: Prize,
}
