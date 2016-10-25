'use strict';

document.addEventListener("DOMContentLoaded", function(){ ds_spinner.init() });

var ds_spinner = {
  init: function(){
    this.domCache()
  },
  domCache: function(){
    this.spinner = document.getElementById('ds-spinner')
  },
  start: function(){
    ds_spinner.spinner.classList.add('start-spinning');
  },
  stop: function(){
    ds_spinner.spinner.classList.remove('start-spinning')
  }
}
