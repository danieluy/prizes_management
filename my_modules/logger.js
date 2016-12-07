(function(){

   var fs = require('fs');

   exports.event = function(_event){
      fs.appendFile('./eventlog.txt', timeStamp() + ' - ' + _event + '\n', function (err) {
      	if (err) throw err;
      });
   }

   exports.error = function(_error){
      fs.appendFile('./errorlog.txt', timeStamp() + ' - ' + _error + '\n', function (err) {
      	if (err) throw err;
      });
   }

   function timeStamp (){
      var date = new Date();
      var year = date.getFullYear().toString();
      var month = (date.getMonth() + 1).toString();
      var day = date.getDate().toString();
      var hrs = date.getHours().toString();
      var min = date.getMinutes().toString();
      var sec = date.getSeconds().toString();
      return
        '[[' + (day.length > 1 ? day : '0' + day) + '/' + (month.length > 1 ? month : '0' + month) + '/' + year + ' ' +
        (hrs.length > 1 ? hrs : '0' + hrs) + ':' + (min.length > 1 ? min : '0' + min) + ':' + (sec.length > 1 ? sec : '0' + sec) + ']]';
   }

}());
