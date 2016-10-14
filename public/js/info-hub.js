var info_hub = {
  init: function(){
    this.domCache();
  },
  domCache: function(){
    this.info_hub = document.getElementById('info-hub');
  },
  banner: function(){
    var banner = document.createElement('div');
    banner.classList.add('info-card');
    banner.classList.add('pos-bottom-out');
    banner.classList.add(this.type);
    var emoticon = document.createElement('span');
    emoticon.classList.add('info-emoticon');
    emoticon.innerHTML = this.emoticon;
    var message = document.createElement('span');
    message.classList.add('info-text');
    message.innerHTML = this.message;
    banner.appendChild(emoticon);
    banner.appendChild(message);
    return banner;
  },
  ok: function(message){
    this.type = 'message-ok';
    this.emoticon = ':)';
    this.message = message;
    this.render();
  },
  alert: function(message){
    this.type = 'message-alert';
    this.emoticon = ':\\';
    this.message = message;
    this.render();
  },
  error: function(message){
    this.type = 'message-error';
    this.emoticon = ':(';
    this.message = message;
    this.render();
  },
  render: function(){
    this.info_hub.appendChild(this.banner());
    setTimeout((function(){
      this.info_hub.innerHTML = '';
    }).bind(this), 5000)
  }
}
document.addEventListener('DOMContentLoaded', info_hub.init.bind(info_hub));
