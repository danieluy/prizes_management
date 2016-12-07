/*
* This function is intended to be used with the <input type="date" /> HTML label
* in order to obtain a UTC date out of it
*
* Params String: date_string (format: 'yyyy-MM-dd')
* Returns Date: UTC new Date object
*/
var inputTypeDateToUTC = function(date_string){
  if(!date_string || date_string === '') throw 'Parameter mismatch error, a date string must be provided';
  if(!date_string.match(/^\d{4}\-\d{2}\-\d{2}$/)) throw 'Parameter mismatch format error, expected "yyyy-MM-dd"';
  var date = new Date(date_string);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),  date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
/*
* This function is intended to be used with the <input type="date" /> HTML label
* in order to obtain a UTC convertible date string out of it, for some reason
* this happens when the string uses '/' as separator instead of '-'
*
* Params String: date_string (format: 'yyyy-MM-dd')
* Returns Date: UTC date_string (format: 'yyyy/MM/dd')
*/
var inputTypeDateForwardSlash = function(date_string){
  if(!date_string || date_string === '') throw 'Parameter mismatch error, a date string must be provided';
  if(!date_string.match(/^\d{4}\-\d{2}\-\d{2}$/)) throw 'Parameter mismatch format error, expected "yyyy-MM-dd"';
  return date_string.replace(/-/g, "/");
}
