(function(){

   fs = require('fs');
   var mongodb = require('mongodb');
   var mongo = mongodb.MongoClient;
   const config = require('../config.json');
   var db_ip = config.connection.database.ip;
   var db_port = config.connection.database.port;
   var db_name = config.connection.database.name;
   var url = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;
   var ObjectID = require('mongodb').ObjectID;

   exports.all = function(){
      return new Promise(function(resolve, reject){
         mongo.connect(url, function(err, db){
            var result = null;
            if(err){
               result = reject('ERR_DB - Unable to connect to the database\nFile: db_prizes.js\n' + err.toString());
            }
            else{
               var prizes = db.collection('prizes');
               prizes.find().toArray(function(err, data){
                  if(err){
                     result = reject('ERR_DB - Unable to fetch prizes data\nFile: db_prizes.js\n' + err.toString());
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

   var id = exports.id = function(_id){
      return new Promise(function(resolve, reject){
         mongo.connect(url, function(err, db){
            var result = null;
            if(err){
               result = reject('ERR_DB - Unable to connect to the database\nfile: db_prizes.js\n' + err.toString());
            }
            else{
               var prizes = db.collection('prizes');
               var objectId = new ObjectID(_id);
               prizes.find({_id : objectId}).toArray(function(err, data){
                  if(err){
                     result = reject('ERR_DB - Unable to fetch prizes data\nfile: db_prizes.js\n' + err.toString());
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

   exports.ids = function(_ids_array){
     return Promise.all(stackPromises(_ids_array));
   }
   function stackPromises(_ids_array){
     var stack = [];
     for(var i=0; i<_ids_array.length; i++){
       stack.push(id(_ids_array[i]));
     }
     return stack;
   }

   exports.active = function (unfiltered){
   	var filtered = [];
   	var todayDate = new Date().getTime();
   	for (var i = 0; i < unfiltered.length; i++) {
   		var onePrize = unfiltered[i];
   		if(onePrize.due_date === null){
   			 filtered.push(onePrize);
   		}
   		else if(onePrize.quantity > 0 && onePrize.due_date.getTime() >= todayDate){
   			filtered.push(onePrize);
   		}
   	};
   	return filtered;
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
              result = reject('ERR_DB - Unable to connect to the database\nfile: db_prizes.js\n' + err.toString());
           }
           else{
              var prizes = db.collection('prizes');
              prizes.distinct(field, function(err, _data){
                 if(err){
                    result = reject('ERR_DB - Unable to fetch prizes data\nfile: db_prizes.js\n' + err.toString());
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
