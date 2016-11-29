var info_hub = {
  actions: [],
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
    var actions_div = document.createElement('div');
    for (var i = 0; i < this.actions.length; i++) {
      var btn = document.createElement('button');
      btn.innerHTML = this.actions[i].action_name;
      btn.addEventListener('click', this.actions[i].action_cb);
      actions_div.appendChild(btn);
    }
    banner.appendChild(emoticon);
    banner.appendChild(message);
    banner.appendChild(actions_div);
    return banner;
  },
  ok: function(message, actions){
    this.type = 'message-ok';
    this.emoticon = ':)';
    this.commonData.call(this, message, actions);
  },
  alert: function(message, actions){
    this.type = 'message-alert';
    this.emoticon = ':\\';
    this.commonData.call(this, message, actions);
  },
  error: function(message, actions){
    this.type = 'message-error';
    this.emoticon = ':(';
    this.commonData.call(this, message, actions);
  },
  commonData(message, actions){
    this.actions = [];
    this.message = message;
    if(actions)
      for (var i = 0; i < actions.length; i++)
        this.actions.push({
          action_name: actions[i].action_name,
          action_cb: actions[i].action_cb
        });
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
