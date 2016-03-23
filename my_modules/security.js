(function(){

   var db_users = require('./db_users');
   var bcrypt = require('bcryptjs');

   exports.login = function(name, pass){
      return new Promise(function(resolve, reject){
         db_users.userName(name).then(function(user){
            if(user && bcrypt.compareSync(pass, user.password)){
               return resolve({eval: true, user: {'userName': user.userName, 'role': user.role}});
            }
            else{
               return resolve({eval: false, user: null});
            }
         }).catch(function(err){
            return reject('ERR_DB - There was a problem connecting to the user\'s database.\nfile: security.js\n' + err.toString());
         });
      });
   }

   exports.hashpass = function(_pass){
      var hash = bcrypt.hashSync(_pass, bcrypt.genSaltSync(10));
      return hash;
   }

}());
