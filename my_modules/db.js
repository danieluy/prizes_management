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


/*
* Params String: collection, Object: values
* Returns Json: WriteResult
*/
const insert = (collection, values) => {
  if(!collection || !values)
    throw "Collection and Values must be provided";
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, db) => {
      if(err)
        return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      else{
        db.collection(collection)
        .insert(values)
        .then((WriteResult) => {
          let result = JSON.stringify(WriteResult);
          db.close();
          return resolve(result);
        })
        .catch((err) => {
          db.close();
          return reject('ERR_DB - There was a problem inserting into the "' + collection + '" collection on the database - db.js module - Returned ERROR: ' + err);
        });
      }
    });
  });
}
/*
* Params String: collection [, Object: query {key: value}]
* Returns Array[Json: document, ...]
*/
const find = (collection, query) => {
  if(!collection)
    throw "Collection must be provided";
  return new Promise(function(resolve, reject){
    mongo.connect(url, function(err, db){
      if(err)
        return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
        let key = query ? Object.keys(query)[0] : null;
        let regEx = query ? new RegExp(query[key], "i") : null;
        db.collection(collection)
        .find(query ? { [key] : { $regex : new RegExp(query[key], "i") } } : {})
        .toArray()
        .then((result) => {
          db.close();
          return resolve(result);
        })
        .catch((err) => {
          db.close();
          return reject('ERR_DB - There was a problem querying the "' + collection + '" collection on the database - db.js module - Returned ERROR: ' + err);
        });
    });
  });
}
/*
* Params String: collection, Object: query {key: value}
* Returns Boolean
*/
const exists = (collection, query) => {
  if(!collection || !query)
    throw "Collection and Query must be provided";
  return new Promise(function(resolve, reject){
    mongo.connect(url, function(err, db){
      if(err)
        return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      let key = Object.keys(query)[0];
      let regEx = new RegExp(query[key], "i");
      db.collection(collection)
      .findOne({ [key] : { $regex : regEx } })
      .then((result) => {
        db.close();
        return resolve(result ? true : false);
      })
      .catch((err) => {
        db.close();
        return reject('ERR_DB - There was a problem querying the "' + collection + '" collection on the database - db.js module - Returned ERROR: ' + err);
      })
    });
  });
}


module.exports = {
  insert: insert,
  find: find,
  exists: exists
}
