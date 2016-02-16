(function(){

   var mongodb = require('mongodb');
   var ObjectID = require('mongodb').ObjectID;
   var mongo = mongodb.MongoClient;
   var url = 'mongodb://localhost/rcrmc2016';

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
