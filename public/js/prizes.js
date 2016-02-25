String.prototype.capitalize = function(){
	return this.replace(/(?:^|\s)\S/g, function(a){
		return a.toUpperCase();
	});
};

(function (){


	// var url = document.getElementById('pageUrl').innerHTML;
	// var socket = io.connect(url);

	//Grant Prize///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	var formGrant = document.getElementById('formGrant');
	var txtGrantCi = document.getElementById('txtGrantCi');
	var txtGrantName1 = document.getElementById('txtGrantName1');
	var txtGrantLastname1 = document.getElementById('txtGrantLastname1');
	var lstGrantGender = document.getElementById('lstGrantGender');
	var txtGrantFacebook = document.getElementById('txtGrantFacebook');
	var txtGrantPhone = document.getElementById('txtGrantPhone');
	var txtGrantMail = document.getElementById('txtGrantMail');
	var selGrantPrize = document.getElementById('selGrantPrize');
	var selEditPrize = document.getElementById('selEditPrize');
	var subConditional = document.getElementById('subConditional');
	var subAnyway = document.getElementById('subAnyway');
	var subCancel = document.getElementById('subCancel');
	var divPrevPrizes = document.getElementById('divPrevPrizes');
	var sponsorsList = document.getElementById('sponsorsList');
	var prizesTypeList  = document.getElementById('prizesTypeList');
	var selEditPrize = document.getElementById('selEditPrize');
	var prizeEdit = document.getElementById('prizeEdit');
	var sel_prize_type = document.getElementById('sel_prize_type');
	var sel_prize_sponsor = document.getElementById('sel_prize_sponsor');
	var sel_prize_description = document.getElementById('sel_prize_description');
	var sel_prize_quantity = document.getElementById('sel_prize_quantity');
	var sel_prize_due_date = document.getElementById('sel_prize_due_date');
	var sel_prize_note = document.getElementById('sel_prize_note');
	var grantAnyway = false;
	var updatedPrizes = [];

	selEditPrize.addEventListener('change', function(){
		var sel_id = selEditPrize.value;
		socket.emit('reqPrizeData', sel_id);
		socket.on('resPrizeData', function(_prize){
			sel_prize_type.value = _prize.type;
			sel_prize_sponsor.value = _prize.sponsor;
			sel_prize_description.value = _prize.description;
			sel_prize_quantity.value = _prize.quantity;
			sel_prize_due_date.value = _prize.due_date ? formatDate(_prize.due_date) : null;
			sel_prize_note.value = _prize.note;
		});
	});

	var formatDate = function(_string){
		var parsed_date = Date.parse(_string)
		parsed_date += 86400000;//Adds a day that got lost due to the time in the stored data.
		var date = new Date(parsed_date);
		var year = date.getFullYear().toString();
		var month = (date.getMonth() + 1).toString();
		var day = date.getDate().toString();
		console.log(parsed_date);
		return year + '-' + (month.length > 1 ? month : '0' + month) + '-' + (day.length > 1 ? day : '0' + day);
	}

	prizeEdit.addEventListener('submit', function(e){
		e.preventDefault();
		socket.emit('reqUpdatePrize', {
			id: selEditPrize.value,
			type: sel_prize_type.value,
			sponsor: sel_prize_sponsor.value,
			description: sel_prize_description.value,
			quantity: sel_prize_quantity.value,
			due_date: sel_prize_due_date.value,
			note: sel_prize_note.value
		});
	});

	subAnyway.addEventListener('click', function(){
		grantAnyway = true;
	});
	subCancel.addEventListener('click', function(){
		location.reload();
	});

	formGrant.addEventListener('submit', function(e){
		e.preventDefault();
		checkIfPrize();
		if(!grantAnyway){
			socket.emit('reqGrantPrizeIf', {
				ci: txtGrantCi.value,
				name1: txtGrantName1.value,
				lastname1: txtGrantLastname1.value,
				gender: lstGrantGender.value === 'no selection' ? null : lstGrantGender.value,
				facebook: txtGrantFacebook.value,
				phone: txtGrantPhone.value,
				mail: txtGrantMail.value,
				prize: selGrantPrize.value
			})
		}
		else{
			updatedPrizes.push({'id': selGrantPrize.value, 'handed': false, 'granted': Date(Date.now())});
			socket.emit('grantPrizeAnyway', {
				ci: txtGrantCi.value,
				updatedPrizes: updatedPrizes
			})
		}
	}, false);


	socket.emit('reqUpdateData');

	socket.on('resAlreadyWinner', function(_prizes_data){
		var prizes_info = _prizes_data[0];
		var winner_prizes = _prizes_data[1];
		updatedPrizes = winner_prizes;
		divPrevPrizes.innerHTML = '<h3 class="prize-h3">Esta persona ya ha ganado ' + ((prizes_info.length>1) ? 'los siguentes premios.' : 'el siguiente premio.') + '</h3>';
		for(var i=0; i<prizes_info.length; i++){
			var prevPize = prizes_info[i];
			divPrevPrizes.innerHTML += '<div class="prevPrizeBox">'+
												'<span class="prevPrizeNum">' + (i+1) + '</span>'+
												'<span class="prevPrizeData"><strong>Tipo</strong>: ' + prevPize.type + '</span>'+
												'<span class="prevPrizeData"><strong>Descripción</strong>: ' + prevPize.description + '</span>'+
												'<span class="prevPrizeData"><strong>Espónsor</strong>: ' + prevPize.sponsor + '</span>'+
												'<span class="prevPrizeData"><strong>Stock</strong>: ' + prevPize.quantity + '</span>'+
												'</div>';
		}
		showHideGrant();
		scrollToSpot(divPrevPrizes);
	});

	socket.on('alreadyWinnerBut', function(error){
		divPrevPrizes.innerHTML = 'Esta persona ya ha ganado anteriormente.\nLos premios no se pueden mostrar en este momento debido al siguiente error:\n' + error.toString();
		showHideGrant();
	});

	socket.on('saveWinnerError', function(data){
		alert(data);
		location.reload();
	});

	socket.on('saveWinnerOk', function(data){
		alert(data);
		location.reload();
	});

	socket.on('resUpdatePrizesList', function(_prizesList){
		if(_prizesList && _prizesList.length > 0){
			selGrantPrize.innerHTML = '<option value="no selection" disabled selected>Premio *</option>';
			selEditPrize.innerHTML = '<option value="no selection" disabled selected>Premio *</option>';
			for (var i = 0; i < _prizesList.length; i++) {
				var onePrize = _prizesList[i];
				var option ='<option value="'+
					onePrize._id + '"><span class="capitalize">'+
					onePrize.type.capitalize()+ '</span> - <span class="capitalize">'+
					onePrize.description.capitalize()+ '</span> - <span class="capitalize">'+
					onePrize.sponsor.capitalize()+ '</span></option>';
				selGrantPrize.insertAdjacentHTML('beforeend', option);
				selEditPrize.insertAdjacentHTML('beforeend', option);
			};
		}
		sel_prize_type.value = '';
		sel_prize_sponsor.value = '';
		sel_prize_description.value = '';
		sel_prize_quantity.value = '';
		sel_prize_due_date.value = '';
		sel_prize_note.value = '';
	});

	socket.on('resUpdateSponsorsList', function(_sponsorsList){
		for (var i = 0; i < _sponsorsList.length; i++) {
			var option = '<option value="' + _sponsorsList[i].capitalize() + '"></option>';
			sponsorsList.insertAdjacentHTML('beforeend', option);
		};
	});

	socket.on('resUpdatePrizesTypeList', function(_prizesTypeList){
		for (var i = 0; i < _prizesTypeList.length; i++) {
			var option = '<option value="' + _prizesTypeList[i].capitalize() + '"></option>';
			prizesTypeList.insertAdjacentHTML('beforeend', option);
		};
	});

	var showHideGrant = function(){
		subConditional.classList.toggle('hidden');
		subCancel.classList.toggle('hidden');
		subAnyway.classList.toggle('hidden');
		divPrevPrizes.classList.toggle('hidden');
	}

	var scrollToSpot = function(spot){
		var body = document.getElementsByTagName('body');
		body[0].scrollTop = spot.offsetTop;
	}

}());
