(function(){
  'use strict';
  document.addEventListener("DOMContentLoaded", function(){
    login_form = document.getElementById('form-login');
    login_form.addEventListener('submit', handleLoginPOST);
  });
  var login_form;
  function handleLoginPOST(e){
    e.preventDefault();
    console.log('POST request fired');
  }
  // data = {method: [GET, POST]}
  function ajax(data, cb){

  }
})();
