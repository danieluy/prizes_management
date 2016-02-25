(function (){

	// var url = document.getElementById('pageUrl').innerHTML;
	// var socket = io.connect(url);

	//Winners Search///////////////////////////////////////////////////////////////Winners Search/////////////////////////////////////////////////////////////
	var formQuery = document.getElementById('formQuery');
	var txtQuery = document.getElementById('txtQuery');
	var resultsCanvas = document.getElementById('results');
	var g_winners = null;
	var g_prizes = null;
	var g_render_undo = null;


	//Socket.emit////////////////////////////////////////////////////////////////
	formQuery.addEventListener('submit', function(evt){
		evt.preventDefault();
		if(txtQuery.value.length > 0){
			socket.emit('reqWinnerSearch', {txt: txtQuery.value});
		}
		else{
			resultsCanvas.innerHTML = '<div class="result" style="text-align:center"><label><i class="material-icons">&#xE5D8;</i> Ingrese un término de búsqueda. <i class="material-icons">&#xE5D8;</i></label></div>';
		}
	});


	var handOverPrize = function(){
		var winner_index = this.getAttribute('winner');
		var prize_id = this.getAttribute('prize');
		var winner_ci = g_winners[winner_index].ci;
		socket.emit('reqHandOverPrize', {'winner_ci': winner_ci, 'prize_id': prize_id});
	}


	//Socket.on//////////////////////////////////////////////////////////////////
	socket.on('resWinnerResults', function(_results){
		if(_results){
			txtQuery.value = '';
			g_winners = _results[0];
			g_prizes = _results[1];
			displayResults();
		}
		else{
			resultsCanvas.innerHTML = '<div class="result" style="text-align:center"><label>No se encontraron resultados.</label></div>';
		}
	});

	socket.on('resHandOverPrize', function(_winner){
		g_winners = _winner;
		displayResults();
	});

	var undo = function(){
		resultsCanvas.innerHTML = g_render_undo;
		bindEvents();
	}

	var displayResults = function(){
			var results = '';
			for(var i=0; i < g_winners.length; i++){
				results += formatWinner(g_winners[i], i)
			}
			g_render_undo = resultsCanvas.innerHTML;
			resultsCanvas.innerHTML = results;
			bindEvents();
	}

	var bindEvents = function(){
		var btn_show_prizes = document.getElementsByClassName('btn-show-prizes');
		if(btn_show_prizes.length > 0){
			for (var i = 0; i < btn_show_prizes.length; i++) {
				btn_show_prizes[i].addEventListener('click', displayPrizes);
			}
		}

		var btn_undo = document.getElementsByClassName('btn-undo');
		if(btn_undo.length > 0) btn_undo[0].addEventListener('click', undo);

		var btn_hand_over_prize = document.getElementsByClassName('btn-hand-over-prize');
		if(btn_hand_over_prize.length > 0){
			for (var i = 0; i < btn_hand_over_prize.length; i++) {
				btn_hand_over_prize[i].addEventListener('click', handOverPrize);
			}
		}
	}

	var displayPrizes = function(){
		var index = this.getAttribute('winner');
		var winner = g_winners[index];
		var prizes = gatherPrizes(winner);
		g_render_undo = resultsCanvas.innerHTML;
		resultsCanvas.innerHTML = formatPrizes(prizes, index);
		bindEvents();
	}

	var gatherPrizes = function(_winner){
		var unhanded_prizes = [];
		var handed_prizes = [];
		for (var i = 0; i < _winner.prizes.length; i++) {
			var id = _winner.prizes[i].id;
			var date = new Date(_winner.prizes[i].granted);
			var granted = formatDateHours(date);
			var handed = null;
			date = new Date(_winner.prizes[i].handed);
			if(date){
				handed = formatDateHours(date);
			}
			if(!_winner.prizes[i].handed){
				unhanded_prizes.push(gatherInfo(id, granted, null));
			}
			else{
				handed_prizes.push(gatherInfo(id, granted, handed));
			}
		}
		return {unhanded: unhanded_prizes, handed: handed_prizes};
	}
	var gatherInfo = function(_id, _granted, _handed){
		var i = 0;
		var found = false;
		while (i < g_prizes.length && !found) {
			if(_id === g_prizes[i]._id){
				g_prizes[i].granted = _granted;
				if(_handed) g_prizes[i].handed = _handed;
				found = g_prizes[i];
			}
			i++;
		}
		return found;
	}
	var formatDateHours = function(_date){
		return _date.getDate().toString() + '/' + (_date.getMonth() + 1).toString() + '/' +  _date.getFullYear().toString() + ' - ' + _date.getHours() + ':' + _date.getMinutes() + ' hrs.';
	}

	var formatPrizes = function(_prizes, _index){
		var concat = '';
		if(_prizes){
			concat += '<button class="btn-undo"><i class="material-icons">&#xE5C4;</i></button>';
			if(_prizes.unhanded.length)concat += '<h2>Premios no entregados</h2>';
			for (var i = 0; i < _prizes.unhanded.length; i++) {
				var prize = _prizes.unhanded[i];
				concat += '<div class="result">';
				concat += '<label>Tipo </label><span class="result-data">' + prize.type + '</span>';
				concat += '<label>Descripción </label><span class="result-data">' + prize.description + '</span>';
				concat += '<label>Espónsor </label><span class="result-data">' + prize.sponsor + '</span>';
				concat += '<label>Otorgado </label><span class="result-data">' + prize.granted + '</span>';
				concat += '<button class="btn-hand-over-prize" winner="' + _index.toString() + '" prize="' + prize._id + '">Entregar</button>';
				concat += '</div>';
			}
			if(_prizes.handed.length)concat += '<h2>Premios entregados</h2>';
			for (var i = 0; i < _prizes.handed.length; i++) {
				var prize = _prizes.handed[i];
				concat += '<div class="result">';
				concat += '<label>Tipo </label><span class="result-data">' + prize.type + '</span>';
				concat += '<label>Descripción </label><span class="result-data">' + prize.description + '</span>';
				concat += '<label>Espónsor </label><span class="result-data">' + prize.sponsor + '</span>';
				concat += '<label>Otorgado </label><span class="result-data">' + prize.granted + '</span>';
				concat += '<label>Entregado </label><span class="result-data">' + prize.handed + '</span>';
				concat += '</div>';
			}
		}
		return concat;
	}

	var formatWinner = function(_result, index){
		var concat = '<div class="result">';
		if(_result){
			concat += '<label>C.I. </label><span class="result-data ci">' + formatci(_result.ci) + '</span>';
			if(_result.name1 || _result.lastname1) concat += '<label>Nombre </label><span class="result-data name">' + concatName(_result) + '</span>';
			if(_result.gender) concat += '<label>Sexo </label><span class="result-data gender">' + _result.gender + '</span>';
			if(_result.facebook) concat += '<label>Perfil de Facebook </label><a class="result-data facebook" href="' + _result.facebook + '" target="_blank">' + _result.facebook + '</a>';
			if(_result.phone) concat += '<label>Teléfono </label><a class="result-data phone" href="tel:' + _result.phone + '">' + _result.phone + '</a>';
			if(_result.mail) concat += '<label>Email </label><a class="result-data mail" href="mailto:' + _result.mail + '">' + _result.mail + '</a>';
			concat += '<button class="btn-show-prizes" winner="' + index.toString() + '">Ver Premios</button></div>';
		}
		return concat;
	}

	var concatName = function(_fullName){
		var full_name = '';
		if(_fullName.name1) full_name += _fullName.name1 + ' ';
		if(_fullName.lastname1) full_name += _fullName.lastname1;
		return full_name;
	}

	var formatci = function(ci){
		var added = 0;
		while(ci.length < 8){
			ci = '0' + ci;
			added++;
		}
		ci = (ci.slice(0, 1) + '.' + ci.slice(1, 4) + '.' + ci.slice(4, 7) + '-' + ci.slice(7, 8));
		if(added !== 0){
			if(added < 5) added++;
			ci = ci.slice(added, 11);
		}
		// console.log('C.I. ' + ci);
		return ci;
	}

}());
