(function(){

   var db_users = require('./db_users');
   var bcrypt = require('bcryptjs');

   exports.login = function(name, pass){
      return new Promise(function(resolve, reject){
         db_users.userName(name).then(function(user){
            if(user.length === 1 && bcrypt.compareSync(pass, user[0].password)){
               return resolve({'user': {'userName': user[0].userName, 'role': user[0].role}, 'err': null});
            }
         }).catch(function(err){
            console.log(err);
            return reject({'user': null, 'err': "Los datos ingresados son incorrectos, inténtelo nuevamente.\n" + err});
         });
      });
   }

   exports.hashpass = function(_pass){
      return bcrypt.hashSync(_pass, bcrypt.genSaltSync(10));
   }

}());
