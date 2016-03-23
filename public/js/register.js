(function(){

   var form = document.getElementsByTagName('form');
   var name = document.getElementById('txtName');
   var pass = document.getElementById('txtPass');
   var pass2 = document.getElementById('txtPass2');
   var email = document.getElementById('txtEmail');
   var role = document.getElementById('selRole');

   form[0].addEventListener('submit', function(e){
      e.preventDefault();
      if(pass.value === pass2.value){
         socket.emit('reqNewUser', {
            name: name.value,
            pass: pass.value,
            email: email.value,
            role: role.value
         });
      }
      else{
         infoHub.render('alert', 'Las contraseñas no coinsiden');
      }
   });

}());
