'use strict';

document.addEventListener("DOMContentLoaded", function(){
  $users.init();
});

//  PRIZES  ////////////////////////////////////////////////////////////////////
var $users = {

  init: function(){
    this.domCache();
    this.domListeners();
    this.reqUsersList();
  },

  domCache: function(){
    this.users_list = document.getElementById('ul-list-users');
    this.form_new_user = document.getElementById('form-new-user');
    this.name = document.getElementById('txt-userName');
    this.password = document.getElementById('txt-password');
    this.password_2 = document.getElementById('txt-password2');
    this.role = document.getElementById('sel-role');
    this.email = document.getElementById('user-email');
    this.btn_submit_new_user = document.getElementById('btn-sub-new-user');
  },

  domListeners: function(){
    this.btn_submit_new_user.addEventListener('click', this.reqPutNewUser.bind(this));
  },

  reqUsersList: function(){
    ds_spinner.start();
    dsAjax.get.call(this, {
      onEndCb: ds_spinner.stop,
      url: 'http://' + window.location.host + '/api/users',
      params: null,
      successCb: (function(users){
        this.users = JSON.parse(users);
        this.render.list.call(this);
      }).bind(this),
      errorCb: function(err){
        let err_obj = JSON.parse(err);
        info_hub.error('Ocurrió un problema al obtener los usuarios');
        console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
      }
    });
  },

  reqPutNewUser: function(e){
    e.preventDefault();
    ds_spinner.start();
    var password = this.password.value;
    var password_2 = this.password_2.value;

    this.password_2.setCustomValidity('');
    if(password !== password_2)
      this.password_2.setCustomValidity('Las contraseñas no coinciden');

    if(this.form_new_user.checkValidity()){
      console.log('this.form_new_user.checkValidity()');
      var name = this.name.value;
      var role = this.role.value;
      var email = this.email.value;
      dsAjax.put.call(this, {
        onEndCb: ds_spinner.stop,
        url: 'http://' + window.location.host + '/api/users',
        params: {
          name: name,
          role: role,
          password: password,
          email: email
        },
        successCb: (function(result){
          result = JSON.parse(result);
          info_hub.ok('Usuario creado con éxito');
          this.reqUsersList();
        }).bind(this),
        errorCb: function(err){
          let err_obj = JSON.parse(err);
          info_hub.error('No se pudo crear el usuario');
          console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
        }
      });
    }
    else {
      ds_spinner.stop();
      info_hub.alert('Por favor completa todos los campos marcados con *');
      console.error('Se deben completar todos los campos marcados con *');
    }
  },

  formatDateToRender: function(date){
    if(date){
      var date = new Date(date);
      return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getUTCFullYear();
    }
    else
    return null;
  },

  render: {
    list: function(){
      if(this.users && this.users.length){
        this.users_list.innerHTML = '';
        for (var i = 0; i < this.users.length; i++) {
          var user = this.users[i];

          var list_item = document.createElement('li');
          list_item.classList.add('list-item');

          var item_avatar = document.createElement('span');
          item_avatar.classList.add('item-avatar');
          item_avatar.innerHTML = user.userName.slice(0, 1).toUpperCase();

          var item_data = document.createElement('div');
          item_data.classList.add('item-data');

          var data_name = document.createElement('span');
          data_name.classList.add('data-name');
          data_name.innerHTML = user.userName;

          var data_right = document.createElement('span');
          data_right.classList.add('data-right');

          var data_role = document.createElement('span');
          data_role.classList.add('data-role');
          data_role.innerHTML = user.role.toLowerCase() === 'admin' ? 'administrador' : 'usuario';

          var date_label = document.createElement('small');
          date_label.innerHTML = ' creado el ';

          var data_set_date = document.createElement('span');
          data_set_date.classList.add('data-set_date');
          data_set_date.innerHTML = this.formatDateToRender(user.set_date);

          data_right.appendChild(data_role);
          data_right.appendChild(date_label);
          data_right.appendChild(data_set_date);

          item_data.appendChild(data_name);
          item_data.appendChild(data_right);

          list_item.appendChild(item_avatar);
          list_item.appendChild(item_data);
          console.log(list_item);

          this.users_list.appendChild(list_item)
        }
      }
    }
  }

}
// <li class="list-item">
//   <span class="item-avatar">A</span>
//   <div class="item-data">
//     <span class="data-name">Admin</span>
//     <span class="data-right">
//       <span class="data-role">Administrador</span>
//       <small> creado el </small>
//       <span class="data-set_date">15/02/2016</span>
//     </span>
//   </div>
// </li>
