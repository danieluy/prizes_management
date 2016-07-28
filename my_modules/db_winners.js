(function(){

  fs = require('fs');
  var mongodb = require('mongodb');
  var mongo = mongodb.MongoClient;
  const config = require('../config.json');
  var db_ip = config.connection.database.ip;
  var db_port = config.connection.database.port;
  var db_name = config.connection.database.name;
  var url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;



  //------------------------------   WORKING ON THIS   -------------------------------------------//
  exports.Winner = (ci, name, lastname, facebook, gender, phone, mail, prize) => {
    return {
      ci: ci,
      name1: name || null,
      lastname1: lastname || null,
      facebook: facebook || null,
      gender: gender || null,
      phone: phone || null,
      mail: mail || null,
      prizes: [],
      addPrize: () => {
        this.prizes.push({ 'id': prize, 'handed': false, 'granted': Date.now() });
      },
      save: () => {
      //   return new Promise( (resolve, reject) => {
      //     mongo.connect(url, (err, db) => {
      //       let result = null;
      //       if(err) result = reject('ERR_DB - Unable to connect to the database\nFile: db_prizes.js');
      //       else{
      //         const prizes = db.collection('prizes');
      //         prizes.insert(
      //           {
      //             type: type,
      //             sponsor: sponsor,
      //             description: description,
      //             quantity: quantity,
      //             set_date: set_date,
      //             due_date: due_date,
      //             note: note
      //           }
      //         )
      //         .then( () => {
      //           result = resolve();
      //         })
      //         .catch( (err) => {
      //           result = reject('ERR_DB - Unable to insert in the database\nFile: db_prizes.js');
      //         });
      //       }
      //       db.close();
      //       return result;
      //     });
      //   });
      }
    }
  }

  exports.query = function(_query){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result;
        if(err){
          result = reject('ERR_DB - Unable to connect to the database<br>file: db_winners.js<br>' + err.toString());
        }
        else{
          var winners = db.collection('winners');
          var _regExpr = new RegExp(_query, "i");
          winners.find({$or:
            [
              {'ci': _regExpr},
              {'name1': _regExpr},
              {'lastname1': _regExpr},
              {'facebook': _regExpr},
              {'phone': _regExpr},
              {'mail': _regExpr}
            ]
          }).toArray(function(err, data){
            if(err){
              result = reject('ERR_DB - Unable to fetch winners data<br>file: db_winners.js<br>' + err.toString());
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

  exports.ci = function(_ci){
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err) return reject('ERR_DB - Unable to connect to the database<br>file: db_winners.js<br>' + err.toString());
        var winners = db.collection('winners');
        winners.findOne({ci: _ci}, function(err, data){
          if(err){
            result = reject('ERR_DB - Unable to fetch winners data<br>file: db_winners.js<br>' + err.toString());
          }
          else{
            result = resolve(data);
          }
          db.close();
        });
        return result;
      });
    });
  };

  exports.updateprizes = function(_data){
    var winner_ci = _data[0];
    var updated_prizes = _data[1];
    return new Promise(function(resolve, reject){
      mongo.connect(url, function(err, db){
        var result = null;
        if(err) return reject('ERR_DB - Unable to connect to the database<br>file: db_winners.js<br>' + err.toString());
        var winners = db.collection('winners');
        winners.update({ci: winner_ci}, {$set: {prizes: updated_prizes}}, function(err, write_result){
          if(err){
            result = reject('ERR_DB - Unable to fetch winners data<br>file: db_winners.js<br>' + err.toString());
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
        winners.find({}).toArray(function(err, data){
          if(err){
            result = reject('ERR_DB - Unable to fetch to the winners data\n' + err);
          }
          else if(data.length){
            result = resolve(data);
          }
          db.close();
        });
        return result;
      });
    });
  };

}());
