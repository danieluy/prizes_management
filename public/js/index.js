(function(){

  'use strict';
  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('form-login').addEventListener('submit', handleLoginPOST);
  });

  function handleLoginPOST(e){
    e.preventDefault();
    var userName = document.getElementById('login-userName').value;
    var password = document.getElementById('login-password').value;
    console.log('handleLoginPOST', userName, password);
    dsAjax.post({
      url: window.location.href + 'login',
      params: {
        userName: userName,
        password: password
      },
      successCb: function(response){
        console.log(response);
      },
      errorCb: function(response){
        console.error(response);
      }
    });
  }

})();
