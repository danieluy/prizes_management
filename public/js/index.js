(function(){

  'use strict';

  document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('form-login').addEventListener('submit', session.reqLogin);
    document.getElementById('btn-log-out').addEventListener('click', session.reqLogout);
    session.handleLoginModal();
  });

  var session = {
    reqLogin: function (e){
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
          session.handleLogin(res.user);
        },
        errorCb: function(res){
          if(res.error === "You need to be logged in to use this functionallity."){
            console.log("You need to be logged in to use this functionallity.");
          }
        }
      });
    },
    reqLogout: function (e){
      e.preventDefault();
      location.assign('http://' + window.location.host);
      dsAjax.post({
        url: 'http://' + window.location.host + '/logout',
        successCb: function(res){
          session.handleLogin(res.user);
        },
        errorCb: function(res){
          console.error(res);
        }
      });
    },
    handleLogin: function (user){
      if(user){
        sessionStorage.setItem('user', JSON.stringify({
          userName: user.userName,
          role: user.role
        }));
      }
      else{
        sessionStorage.setItem('user', null);
      }
      this.handleLoginModal();
    },
    handleLoginModal: function (){
      var modal = document.getElementById('login-modal');
      var user = JSON.parse(sessionStorage.getItem('user'));
      if(user) modal.classList.add('out');
      else modal.classList.remove('out');
    }
  }

})();
