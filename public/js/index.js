(function(){

  'use strict';
  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('form-login').addEventListener('submit', reqLogin);
    document.getElementById('btn-log-out').addEventListener('click', reqLogout);
    handleLoginModal();
  });

  function reqLogin(e){
    e.preventDefault();
    var userName = document.getElementById('login-userName').value;
    var password = document.getElementById('login-password').value;
    dsAjax.post({
      url: 'http://' + window.location.host + '/login',
      params: {
        userName: userName,
        password: password
      },
      successCb: function(res){
        res = JSON.parse(res);
        handleLogin(res.user);
      },
      errorCb: function(res){
        if(res.error === "You need to be logged in to use this functionallity."){
          console.log("You need to be logged in to use this functionallity.");
        }
      }
    });
  }

  function reqLogout(e){
    e.preventDefault();
    location.assign('http://' + window.location.host);
    dsAjax.post({
      url: 'http://' + window.location.host + '/logout',
      successCb: function(res){
        handleLogin(res.user);
      },
      errorCb: function(res){
        console.error(res);
      }
    });
  }

  function handleLogin(user){
    if(user){
      sessionStorage.setItem('user', JSON.stringify({
        userName: user.userName,
        role: user.role
      }));
    }
    else{
      sessionStorage.setItem('user', null);
    }
    handleLoginModal();
  }

  function handleLoginModal(){
    var modal = document.getElementById('login-modal');
    var user = JSON.parse(sessionStorage.getItem('user'));
    if(user) modal.classList.add('out');
    else modal.classList.remove('out');
  }


})();
