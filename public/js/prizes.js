
'use strict';

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById('btn-sub-prize').addEventListener('click', $prizes.reqNewPrize);
  $prizes.init();
});
//  PRIZES  ////////////////////////////////////////////////////////////////////
var $prizes = {
  init: function(){
    this.domCache();
    this.reqGetPrizesList();
  },
  domCache: function(){
    this.prizes_list = document.getElementById('ul-list-users');
  },
  reqGetPrizesList: function(){
    dsAjax.get({
      url: 'http://' + window.location.host + '/api/prizes',
      onEndCb: ds_spinner.stop,
      successCb: (function(results){
        this.prizes = JSON.parse(results);
        this.render.list.call(this);
      }).bind($prizes),
      errorCb: function(err){
        let err_obj = JSON.parse(err);
        info_hub.error('No se ha guardado el premio');
        console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
      },
    })
  },
  reqNewPrize: function(e){
    e.preventDefault();
    ds_spinner.start();
    var form = document.getElementById('form-new-prize');
    if(form.checkValidity()){
      var type = document.getElementById('txt-type').value;
      var sponsor = document.getElementById('txt-sponsor').value;
      var description = document.getElementById('txt-description').value;
      var stock = document.getElementById('txt-stock').value;
      var due_date = document.getElementById('date-duedate').value;
      due_date = due_date === '' ? null : inputTypeDateForwardSlash(due_date);
      var note = document.getElementById('txt-note').value;
      note = note === '' ? null : note;
      dsAjax.put({
        onEndCb: ds_spinner.stop,
        // delayMs: 5000,
        url: 'http://' + window.location.host + '/api/prizes',
        params: {
          type: type,
          sponsor: sponsor,
          description: description,
          stock: stock,
          due_date: due_date,
          note: note
        },
        successCb: function(result){
          result = JSON.parse(result);
          if(result.error){
            info_hub.error('No se ha guardado el premio');
            console.error('ERROR:',result.error, '\nDetails: ', result.details);
          }
          else{
            info_hub.ok('El premio se guardó correctamente!');
            $dataFields.getPrizes();
          }
        },
        errorCb: function(err){
          let err_obj = JSON.parse(err);
          info_hub.error('No se ha guardado el premio');
          console.error('ERROR:', err_obj.error, '\nDetails: ', err_obj.details);
        }
      });
    }
    else {
      ds_spinner.stop();
      info_hub.alert('Por favor completa todos los campos destacados');
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
      for(var i = 0; i < this.prizes.length; i++){
        var prize =  this.prizes[i];

        var li = document.createElement('li');
        li.classList.add('list-item');

        var div = document.createElement('div');

        var data_stock = document.createElement('span');
        data_stock.classList.add('data-stock');
        data_stock.innerHTML = prize.stock;

        var data_description = document.createElement('span');
        data_description.classList.add('data-description');
        data_description.innerHTML = prize.description;

        var data_type = document.createElement('span');
        data_type.classList.add('data-type');
        data_type.innerHTML = prize.type;

        var data_sponsor = document.createElement('i');
        data_sponsor.classList.add('data-sponsor');
        data_sponsor.innerHTML = ' - ' + prize.sponsor;
        data_type.appendChild(data_sponsor);

        var data_dates = document.createElement('div');
        data_dates.classList.add('data-dates');
        var set_date_label = document.createElement('span');
        set_date_label.innerHTML = 'Premio creado el';
        var set_date = document.createElement('span');
        set_date.classList.add('data-date');
        set_date.innerHTML = this.formatDateToRender(prize.set_date);
        data_dates.appendChild(set_date_label);
        data_dates.appendChild(set_date);
        if(prize.due_date){
          var due_date_label = document.createElement('span');
          due_date_label.innerHTML = ' vence el ';
          var due_date = document.createElement('span');
          due_date.classList.add('data-date');
          due_date.innerHTML = this.formatDateToRender(prize.due_date);
          data_dates.appendChild(due_date_label);
          data_dates.appendChild(due_date);
        }

        if(prize.note){
          console.log('prize.note', typeof prize.note);
          var data_notes = document.createElement('p');
          data_notes.classList.add('data-notes');
          data_notes.innerHTML = prize.note;
        }

        var list_actions = document.createElement('div');
        list_actions.classList.add('list-actions');

        var button_grant_prize = document.createElement('button');
        button_grant_prize.setAttribute('type', 'button');
        button_grant_prize.classList.add('btn-ok');
        button_grant_prize.classList.add('btn-grant-prize');
        button_grant_prize.setAttribute('data-prize-id', prize.id);
        button_grant_prize.setAttribute('data-prize-description', prize.description);
        button_grant_prize.setAttribute('data-prize-type', prize.type);
        button_grant_prize.innerHTML = 'Otorgar';

        var button_edit_prize = document.createElement('button');
        button_edit_prize.setAttribute('type', 'button');
        button_edit_prize.classList.add('btn-cancel');
        button_edit_prize.classList.add('btn-edit-prize');
        button_edit_prize.setAttribute('data-prize-id', prize.id);
        button_edit_prize.innerHTML = 'Editar';

        list_actions.appendChild(button_grant_prize);
        list_actions.appendChild(button_edit_prize);

        div.appendChild(data_stock);
        div.appendChild(data_description);
        div.appendChild(data_type);
        div.appendChild(data_dates);
        if(prize.note) div.appendChild(data_notes);
        div.appendChild(list_actions);

        li.appendChild(div);

        this.prizes_list.appendChild(li);

        $winners.dinamicDomCache();
      }
    }
  }
}
