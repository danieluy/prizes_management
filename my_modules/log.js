(function(){

   var fs = require('fs');

   exports.event = function(_data){
      var date = new Date();
      var header = date.getFullYear() + (date.getMonth() + 1);
      fs.appendFile('./eventlog.txt', header + ' - ' + _data + '\n', function (err) {
      	if (err) throw err;
      });
   }

}());
