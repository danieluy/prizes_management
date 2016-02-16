//////   CI   //////////////////////////////////////////////////////////////////////////////////////////////////////////////
var ci = document.getElementById('txtGrantCi');

function validateci(){
  var ciNumber = ci.value;
  if(!isNaN(ciNumber)){
    if(ciNumber.length<7 || ciNumber.length >8){
      ci.setCustomValidity('La cédula debe tener una longitud de 7 a 8 dígitos incluyendo el verificador.');
    }
    else {
      if(ciNumber.length === 7) ciNumber = '0' + ciNumber;
      var coeffs = [2,9,8,7,6,3,4];
      var sum = 0;
      for(var i=0; i<coeffs.length; i++){
        var digit = parseInt(ciNumber.slice(i, i+1));
        var coeff = coeffs[i];
        var multiply = ((digit*coeff).toString());
        var toAdd = multiply.slice(multiply.length-1);
        sum += parseInt(toAdd);
      }
      var verifDig = 10-(sum % 10);
      if(verifDig === 10) verifDig = 0;
      if(verifDig.toString() == ciNumber.slice(ciNumber.length-1)){
        ci.setCustomValidity('');
      }
      else{
        ci.setCustomValidity('Número de cédula NO válido');
      }
    }
  }
  else{
    ci.setCustomValidity('No ingresar puntos ni guiones, solo números.');
  }
}
//////   Prize not null   //////////////////////////////////////////////////////////////////////////////////////////////////
var selGrantPrize = document.getElementById('selGrantPrize');

function checkIfPrize(){
  if(selGrantPrize.value === 'no selection'){
    selGrantPrize.setCustomValidity('Seleccione un premio.');
  }
  else{
    selGrantPrize.setCustomValidity('');
  }
}