'use strict';

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('form-login').addEventListener('submit', $session.reqLogin);
  document.getElementById('btn-log-out').addEventListener('click', $session.reqLogout);
  $session.handleLoginModal();
  $navigation.init();
  $dataFields.init();
});

//  NAVIGATION  ////////////////////////////////////////////////////////////////
var $navigation = {
  init: function(){
    this.href = window.location.href;
    this.domCache();
    this.domListeners();
  },
  update: function(){
    this.domCache();
    this.cardTabsListeners();
  },
  domCache: function(){
    if(!this.ancors){
      this.ancors = document.getElementsByClassName('ancor');
    }
    this.working_section = document.getElementById(this.href.slice(this.href.indexOf('/#') + 2));
    this.card_tabs = this.working_section ? this.working_section.getElementsByClassName('nav-button') : null;
    this.content_forms = this.working_section ? this.working_section.getElementsByClassName('content-form') : null;
  },
  domListeners: function(){
    window.addEventListener('resize', this.render.navigateTo.bind(this));
    for (var i = 0; i < this.ancors.length; i++){
      this.ancors[i].addEventListener('click', this.render.navigateTo.bind(this));
    }
    this.cardTabsListeners();
  },
  cardTabsListeners: function(){
    if(this.card_tabs && this.card_tabs.length){
      for (var i = 0; i < this.card_tabs.length; i++){
        this.card_tabs[i].addEventListener('click', this.render.changeCard.bind(this));
      }
    }
  },
  render: {
    navigateTo: function(e){
      e.preventDefault();
      if(e.target !== window)
        this.href = window.location.origin + '/' + e.target.getAttribute('href');
      window.location.href = this.href;
      this.update();
    },
    changeCard: function(e){
      for (var i = 0; i < this.content_forms.length; i++) {
        if(this.content_forms[i].id === e.target.getAttribute('data-content-id')){
          this.content_forms[i].classList.add('selected');
        }
        else{
          this.content_forms[i].classList.remove('selected');
        }
      }
    }
  }
}




//  DATA FIELDS  ///////////////////////////////////////////////////////////////
var $dataFields = {
  dom: {},
  prizes: [],
  prize_types: [],
  init: function(){
    this.domCache();
    this.getPrizes();
  },
  domCache: function(){
    this.dom.prizes_type_list = document.getElementById('prizes-type-list');
  },
  getPrizes: function(){
    ds_spinner.start();
    dsAjax.get({
      // delayMs: 3000,
      onEndCb: ds_spinner.stop,
      url: 'http://' + window.location.host + '/api/prizes',
      successCb: function(prizes){
        $dataFields.prizes = JSON.parse(prizes);
        $dataFields.render();
      },
      errorCb: function(err){
        let err_obj = JSON.parse(err);
        console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
      }
    })
  },
  updatePrizes: function(prize){
    this.prizes.push(prize);
    prize_types.push(prize.type);
    this.render();
  },
  render: function(){
    // Prize's types list
    this.dom.prizes_type_list.innerHTML = '';
    for (let i = 0; i < this.prizes.length; i++) {
      if(this.prize_types.indexOf(this.prizes[i].type) < 0){
        this.prize_types.push(this.prizes[i].type);
        let option = document.createElement('option');
        option.value = this.prizes[i].type;
        this.dom.prizes_type_list.appendChild(option);
      }
    }

  }
}




//  SESSION  ///////////////////////////////////////////////////////////////////
var $session = {
  reqLogin: function (e){
    ds_spinner.start();
    e.preventDefault();
    var userName = document.getElementById('login-userName').value;
    var password = document.getElementById('login-password').value;
    dsAjax.post({
      onEndCb: ds_spinner.stop,
      url: 'http://' + window.location.host + '/login',
      params: {
        userName: userName,
        password: password
      },
      successCb: function(res){
        res = JSON.parse(res);
        $session.handleLogin(res.user);
      },
      errorCb: function(res){
        if(res.error === "You need to be logged in to use this functionallity."){
          console.error("You need to be logged in to use this functionallity.");
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
        $session.handleLogin(res.user);
      },
      errorCb: function(err){
        console.error(err);
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
