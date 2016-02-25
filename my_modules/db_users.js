(function(){

   fs = require('fs');
   var mongodb = require('mongodb');
   var mongo = mongodb.MongoClient;
   const config = require('../config.json');
   var db_ip = config.connection.database.ip;
   var db_port = config.connection.database.port;
   var db_name = config.connection.database.name;
   var url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;

   exports.userName = function(_userName){
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
                     result = resolve(_data);
                  }
                  db.close();
               });
            }
            return result;
         });
      });
   }

}());
