(function(){

   var fs = require('fs');

   exports.event = function(_data){
      fs.appendFile('./log.txt', _data + '\n', function (err) {
      	if (err) throw err;
      });
   }

}());
