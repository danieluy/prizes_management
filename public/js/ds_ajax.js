// data = {url: 'http://domain/route', successCb: function(), errorCb: function() [, params: {key: value, ...}] }
var dsAjax = (function (){
  var req;
  function init (successCb, errorCb){
    req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200)
        successCb(this.responseText);
      else if (this.readyState == 4)
        errorCb(this.responseText);
    };
  }
  function get (data){
    checkData(data);
    init(data.successCb, data.errorCb);
    req.open('GET', (data.params ? (data.url + '?' + formatParams(data.params)) : data.url), true);
    req.send();
  }
  function post (data){
    checkData(data);
    init(data.successCb, data.errorCb);
    req.open('POST', data.url, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data.params ? req.send(formatParams(data.params)) : req.send();
  }
  function formatParams (params){
    var str_params = '';
    for(var key in params){
      str_params += key + '=' + params[key] + '&';
    }
    return str_params.slice(0,-1);
  }
  function checkData (data){
    if(!data.url)
      throw 'ERROR - dsAjax.js - A URL must be provided';
    if(!data.successCb)
      throw 'ERROR - dsAjax.js - A success handler must be provided';
    if(!data.errorCb)
      throw 'ERROR - dsAjax.js - A error handler must be provided';
    return;
  }
  return {
    post: post,
    get: get
  }
})();
