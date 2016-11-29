"use strict";

const mongodb = require('mongodb');
const mongo = mongodb.MongoClient;
const ObjectID = require('mongodb').ObjectID;
const config = require('../config.json');
const db_ip = config.database.ip;
const db_port = config.database.port;
const db_name = config.database.name;
const url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;


/*
* Params String: collection, Object: values
* Returns Object: WriteResult
*/
const insert = (collection, values) => {
  if (!collection || !values)
    throw "Collection and Values parameters must be provided";
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, db) => {
      if (err)
      return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      else {
        db.collection(collection)
        .insert(values)
        .then((WriteResult) => {
          let str_result = JSON.stringify(WriteResult);
          db.close();
          return resolve(JSON.parse(str_result));
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
* Returns Object[]: [Object: document, ...]
*/
const find = (collection, query) => {
  if (!collection)
    throw "Collection parameter must be provided";
  return new Promise(function (resolve, reject) {
    mongo.connect(url, function (err, db) {
      if (err)
        return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      let key = query ? Object.keys(query)[0] : undefined;
      let regEx = query ? new RegExp(query[key], "i") : undefined;
      db.collection(collection)
      .find(query ? { [key]: { $regex: regEx } } : {})
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
* Params String: collection [, Object: query {key: value}]
* Returns Object: document
*/
const findOne = (collection, query) => {
  if (!collection || !query)
  throw "Collection and query parameters must be provided";
  return new Promise(function (resolve, reject) {
    mongo.connect(url, function (err, db) {
      if (err)
      return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      let key = Object.keys(query)[0];
      let regEx = new RegExp('^' + query[key] + '$', "i");
      db.collection(collection)
      .findOne({ [key]: { $regex: regEx } })
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
* Params String: collection [, Object: query {key: value}]
* Returns Json: document
*/
const findById = (collection, id) => {
  console.log(id);
  if (!collection || !id)
  throw "Collection and id parameters must be provided";
  return new Promise(function (resolve, reject) {
    mongo.connect(url, function (err, db) {
      if (err)
      return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      db.collection(collection)
      .findOne({ _id: ObjectID(id) })
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
  if (!collection || !query)
  throw "Collection and Query parameters must be provided";
  return new Promise(function (resolve, reject) {
    mongo.connect(url, function (err, db) {
      if (err)
      return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      let key = Object.keys(query)[0];
      let regEx = new RegExp(("^" + query[key] + "$"), "i");
      db.collection(collection)
      .findOne({ [key]: { $regex: regEx } })
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
/*
* Params (String: collection, Object: update {query: {key: value}, values: {key: value [, ...]}})
* Returns Object: WriteResult
*/
const update = (collection, query, update) => {
  if (!collection || !query || !update)
    throw "Collection, query and update parameters must be provided";
  return new Promise(function (resolve, reject) {
    mongo.connect(url, function (err, db) {
      if (err)
        return reject('ERR_DB - Unable to connect to the database - db.js module - Returned ERROR: ' + err);
      let query_key = Object.keys(query)[0];
      if(query_key === 'id' || query_key === '_id')
        query = { _id: ObjectID((query[query_key])) }
      db.collection(collection)
      .update(query, { $set: update })
      .then((WriteResult) => {
        let str_result = JSON.stringify(WriteResult);
        db.close();
        return resolve(JSON.parse(str_result));
      })
      .catch((err) => {
        db.close();
        return reject('ERR_DB - There was a problem updating a document of the "' + collection + '" collection on the database - db.js module - Returned ERROR: ' + err);
      });
    });
  });
}

module.exports = {
  insert: insert,
  update: update,
  find: find,
  findOne: findOne,
  findById: findById,
  exists: exists
}
