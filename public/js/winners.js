'use strict';

document.addEventListener("DOMContentLoaded", function(){
  $winners.init();
});

//  PRIZES  ////////////////////////////////////////////////////////////////////
var $winners = {

  init: function(){
    this.domCache();
    this.domListeners();
  },

  domCache: function(){
    this.form_new_winner = document.getElementById('form-new-winner');
    this.prize_to_grant_description = document.getElementById('prize-to-grant-description');
    this.prize_to_grant_type = document.getElementById('prize-to-grant-type');
    this.btn_cancel_grant_prize = document.getElementById('btn-cancel-grant-prize');
    this.btn_grant_prize_ok = document.getElementById('btn-grant-prize-ok');
    this.ci = document.getElementById('txt-grant-ci');
    this.name = document.getElementById('txt-grant-name');
    this.lastname = document.getElementById('txt-grant-lastname');
    this.gender = document.getElementById('lst-grant-gender');
    this.facebook = document.getElementById('txt-grant-facebook');
    this.phone = document.getElementById('txt-grant-phone');
    this.mail = document.getElementById('txt-grant-mail');
  },

  domListeners: function(){
    this.btn_cancel_grant_prize.addEventListener('click', this.cancelGrantPrize.bind(this));
    this.ci.addEventListener('keyup', this.validateCi.bind(this));
    this.btn_grant_prize_ok.addEventListener('click', this.grantPrize.bind(this));
  },

  dinamicDomCache: function(){
    this.grant_buttons = document.getElementsByClassName('btn-grant-prize');
    this.dinamicDomListeners();
  },

  dinamicDomListeners: function(){
    for (var i = 0; i < this.grant_buttons.length; i++)
      this.grant_buttons[i].addEventListener('click', this.diplayGrantForm.bind(this));
  },

  diplayGrantForm: function(e){
    this.render.render_form_new_winner.call(this, {
      show: true,
      id: e.target.getAttribute('data-prize-id'),
      description: e.target.getAttribute('data-prize-description'),
      type: e.target.getAttribute('data-prize-type')
    });
  },

  grantPrize: function(e){
    e.preventDefault();
    ds_spinner.start();
    if(this.form_new_winner.checkValidity()){
      var ci = this.ci.value;
      var name = this.name.value;
      var lastname = this.lastname.value;
      var gender = this.gender.value;
      var facebook = this.facebook.value;
      var phone = this.phone.value;
      var mail = this.mail.value;
      var prize_id = e.target.getAttribute('data-prize-id');
      dsAjax.put({
        onEndCb: ds_spinner.stop,
        url: 'http://' + window.location.host + '/api/winners',
        params: {
          ci: ci,
          name: name,
          lastname: lastname,
          facebook: facebook,
          gender: gender,
          phone: phone,
          mail: mail,
          prize_id: prize_id
        },
        successCb: function(result){
          result = JSON.parse(result);
          info_hub.ok('El premio se asignó correctamente')
        },
        errorCb: function(err){
          let err_obj = JSON.parse(err);
          info_hub.error('No se pudo asignar el premio');
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

  cancelGrantPrize: function(){
    this.render.render_form_new_winner.call(this, {
      show: false
    });
  },

  validateCi: function(e){
    var input_ci = e.target.value;
    var fixed_ci = input_ci;
    if(input_ci.match(/^\d+$/)){
      if(input_ci.length<7 || input_ci.length >8){
        this.ci.setCustomValidity('La cédula debe tener una longitud de 7 a 8 dígitos incluyendo el verificador.');
      }
      else {
        if(input_ci.length === 7) fixed_ci = '0' + input_ci;
        var coeffs = [2,9,8,7,6,3,4];
        var sum = 0;
        for(var i=0; i<coeffs.length; i++){
          var digit = parseInt(fixed_ci.slice(i, i+1));
          var coeff = coeffs[i];
          var multiply = ((digit*coeff).toString());
          var toAdd = multiply.slice(multiply.length-1);
          sum += parseInt(toAdd);
        }
        var verifDig = 10-(sum % 10);
        if(verifDig === 10) verifDig = 0;
        if(verifDig.toString() == fixed_ci.slice(fixed_ci.length-1)){
          this.ci.setCustomValidity('');

          //  THIS SHOULD GO SOMEWHERE ELSE  ///////////////////////////////////
          this.findByCi(input_ci)
          .then((winner) => {
            if(winner) this.warnWinnerExists(winner);
          })
          .catch((err) => {
            let err_obj = JSON.parse(err);
            info_hub.alert('No se ha podido determinar si esta persona ha ganado antes');
            console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
          })
          //////////////////////////////////////////////////////////////////////

        }
        else{
          this.ci.setCustomValidity('Número de cédula NO válido');
        }
      }
    }
    else{
      this.ci.setCustomValidity('Ingresar cédula sin puntos ni guiones');
    }
  },

  warnWinnerExists(winner){
    info_hub.alert(winner.name + ' ' + winner.lastname + ' ha ganado anteriormente.', [
      {
        action_name: 'Ignorar',
        action_cb: function(){info_hub.ok('Que siga ganando!')}
      },
      {
        action_name: 'Cancelar',
        action_cb: function(){document.location.reload(true)}
      }
    ]);
  },

  findByCi(ci){
    return new Promise((resolve, reject) => {
      dsAjax.post({
        onEndCb: ds_spinner.stop,
        url: 'http://' + window.location.host + '/api/winners/findci',
        params: {
          ci: ci
        },
        successCb: function(result){
          result = JSON.parse(result);
          if(result.winner) return resolve(result.winner);
          else return resolve(null);
        },
        errorCb: function(err){
          return reject(err);
        }
      });
    })
  },

  winnerExists: function(ci){
    return new Promise((resolve, reject) => {
      this.findByCi(ci).
      then((winner) => {
        if(winner) return resolve(true);
        else return resolve(false);
      })
      .catch((err) => {
        let err_obj = JSON.parse(err);
        info_hub.error('Ocurrió un error al buscar un ganador');
        console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
      })
    })
  },

  render: {

    render_form_new_winner: function(options){
      if(options.show){
        this.prize_to_grant_description.innerHTML = options.description;
        this.prize_to_grant_type.innerHTML = options.type;
        this.btn_grant_prize_ok.setAttribute('data-prize-id', options.id);
        this.form_new_winner.classList.add('visible');
      }
      else{
        this.prize_to_grant_description.innerHTML = '';
        this.prize_to_grant_type.innerHTML = '';
        this.btn_grant_prize_ok.setAttribute('data-prize-id', '');
        this.form_new_winner.classList.remove('visible');
      }
    }

  }

}
