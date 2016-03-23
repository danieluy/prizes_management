(function(){
   "use strict"
   var fs = require('fs');
   var mongodb = require('mongodb');
   var mongo = mongodb.MongoClient;
   var config = require('../config.json');
   var db_ip = config.connection.database.ip;
   var db_port = config.connection.database.port;
   var db_name = config.connection.database.name;
   var url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
   var security = require('./security.js');

   var userName = exports.userName = function(_userName){
      return new Promise(function(resolve, reject){
         mongo.connect(url, function(err, db){
            var result = null;
            if(err){
               result = reject('ERR_DB - Unable to connect to the database\nfile: db_users.js\n' + err.toString());
            }
            else{
               var users = db.collection('users');
               users.find({userName: _userName}).toArray(function(err, _data){
                  if(err){
                     result = reject('ERR_DB - Unable to fetch users data\nfile: db_users.js\n' + err.toString());
                  }
                  else{
                     result = resolve(_data[0]);
                  }
                  db.close();
               });
            }
            return result;
         });
      });
   }

   exports.newUser = function(_newUser){
      //_newUser = {userName: name, password: pass, email: email || null, role: role}
      return new Promise(function(resolve, reject){
         var result = null;
         userName(_newUser.userName).then(function(_user){
            if(!_user){
               mongo.connect(url, function(err, db){
                  if(err){
                     result = reject('ERR_DB - Unable to connect to the database\nfile: db_users.js\n' + err.toString());
                  }
                  else{
                     var users = db.collection('users');
                     var hash = security.hashpass(_newUser.password);
                     console.log('>>> hash');
                     console.log(hash);
                     users.insert(
                        {
                           userName: _newUser.userName,
                           password: hash,
                           email: _newUser.email,
                           role: _newUser.role,
                           set_date: Date.now()
                        }
                     )
                     db.close();
                     result = resolve ('El usuaio "' + _newUser.userName + '" se ha creado con exito.')
                  }
               });
            }
            else{
               result = reject ('El nombre de usuario "' + _newUser.userName + '" ya está en uso, seleccione otro, gracias.');
            }
         }).catch(function(_err){
            result = reject ('ERR_DB - Unable to check the user name\nfile: db_users.js\n' + err.toString());
         });
         return result;
      });
   }

}());
