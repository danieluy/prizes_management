"use strict"
//Dependencies//////////////////////////////////////////////////////////////////
var bodyParser = require("body-parser");
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');

//Configuration/////////////////////////////////////////////////////////////////
var config = require('./config.json');

var hostIp = config.connection.lan.ip;
var port = config.connection.lan.port;

var db_ip = config.connection.database.ip;
var db_port = config.connection.database.port;
var db_name = config.connection.database.name;
var db_pass = config.connection.database.password;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Logger////////////////////////////////////////////////////////////////////////
var log = require('./my_modules/log.js');
// Testing function
// for (var i = 1; i <= 5; i++) {
// 	log.event(i + ' - Entrada en el registro');
// }


//Security//////////////////////////////////////////////////////////////////////
var sessions = require('client-sessions');
var security = require('./my_modules/security.js');


//Database////////////////////////////////////////////////////////////////////
var db_winners = require('./my_modules/db_winners.js');
var db_prizes = require('./my_modules/db_prizes.js');
var db_users = require('./my_modules/db_users.js');

//Middleware////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({extended: false}));

//Session Config.
var secret = config.session.secret;
var duration = config.session.durationHours;
var activeDuration = config.session.activeDurationHours;
app.use(sessions({
	cookieName: 'session',
	secret: secret,
	duration: duration * 60 * 60 * 1000,
	activeDuration: activeDuration * 60 * 60 * 1000,
	cookie:
	{
		ephemeral: false,
		httpOnly: false,
		secure: false
	}
}));

function requireLogin(req, res, next){
	if(!req.session.user){
		req.session.reset();
		renderPage('/login', res, {
			errorMessage: "Debe iniciar sesión, gracias."
		});
	}
	else{
		next();
	}
}
function checkRoleAdmin(req, res, next){
	if(req.session.user.role !== 'admin'){
		renderPage('/login', res, {
			errorMessage: "Debe iniciar sesión como Administrador, gracias."
		});
	}
	else{
		next();
	}
}
function checkRoleUser(req, res, next){
	if(req.session.user.role !== 'user'){
		renderPage('/login', res, {
			errorMessage: "Debe iniciar sesión como Usuario, gracias."
		});
	}
	else{
		next();
	}
}
function checkRoleEditor(req, res, next){
	if(req.session.user.role !== 'editor'){
		renderPage('/login', res, {
			errorMessage: "Debe iniciar sesión como Usuario, editor."
		});
	}
	else{
		next();
	}
}

//Public folders
app.use(express.static(__dirname + '/public'));



//Express Locals////////////////////////////////////////////////////////////////
//app.locals.config = config;

app.locals.pageUrl = hostIp + ':' + port;
// app.locals.databasePath = 'mongodb://' + db_ip + ':' + db_port + '/' + db_name;

app.locals.pageTitle = 'Radiocero';

//Routing///////////////////////////////////////////////////////////////////////

//GET///////////////////////////////////////////////////////////////////////////
app.get('/', function(req, res){
	res.redirect('/home');
});

app.get('/home', function(req, res){
	renderPage('/home', res, {
		errorMessage: null
	});
});

app.get('/login', requireLogin, function(req, res){
	renderPage('/login', res, {
		errorMessage: null
	});
});

app.get('/logout', requireLogin, function(req, res){
	if(req.session.user)
	log.event(req.session.user.userName + ' has logged out.');
	req.session.reset();
	renderPage('/login', res, {
		errorMessage: null
	});
});

app.get('/register', requireLogin, checkRoleAdmin, function(req, res){
	renderPage('/register', res, {
		errorMessage: null
	});
});

app.get('/premios', requireLogin, function(req, res){
	renderPage('/premios', res, {
		errorMessage: null
	});
});

app.get('/ganadores', requireLogin, function(req, res){
	renderPage('/ganadores', res, {
		errorMessage: null
	});
});

app.get('/*', function(req, res){
	res.render('404', {title: '404'});
});



function renderPage(address, res, variables){
	var data = {};
	switch(address){
		case '/home':
		data = {
			title: 'Inicio',
			errorMessage: variables.errorMessage
		};
		break;

		case '/login':
		data = {
			title: 'Inicio de Sesión',
			errorMessage: variables.errorMessage
		};
		break;

		case '/register':
		data = {
			title: 'Alta de Usuario',
			errorMessage: variables.errorMessage
		};
		break;

		case '/premios':
		data = {
			title: 'Premios',
			errorMessage: variables.errorMessage
		};
		break;

		case '/ganadores':
		data = {
			title: 'Ganadores',
			errorMessage: variables.errorMessage
		};
		break;

		default:
		console.log('Default, lpm!');
	}
	res.render('index', data);
}


//POST /////////////////////////////////////////////////////////////////////////
app.post('/newPrize', function(req, res){

	var type = req.body.type.toLowerCase();
	var sponsor = req.body.sponsor.toLowerCase();
	var description = req.body.description.toLowerCase();
	var quantity = parseInt(req.body.quantity);
	var due_date = req.body.due_date;
	var note = req.body.note.toLowerCase();

	if(type && sponsor && description && quantity){
		var newPrize = new Prize({
			type: type,
			sponsor: sponsor,
			description: description,
			quantity: quantity,
			set_date: Date.now(),
			due_date: due_date,
			note: note
		});
		newPrize.save(function(err){
			if(err){
				renderPage('/premios', res, {
					errorMessage: 'Ha ocurrido un error, inténtelo de nuevo. Gracias.'
				});
			}
			else{
				res.redirect('/premios');
			}
		});
		updateSponsorsList();
		updatePrizesList();
		updatePrizesTypeList();
	}
	else{
		renderPage('/premios', res, {
			errorMessage: 'Falta completar alguno de los campos obligatorios.'
		});
	}
});

//Sessions handling/////////////////////////////////////////////////////////////
app.post('/login', function(req, res){
	var userName = req.body.user.toLowerCase();
	var pass = req.body.pass;
	security.login(userName, pass).then(function(login_eval){
		if(login_eval.eval){
			log.event(login_eval.user.userName + ' has logged in.');
			req.session.user = login_eval.user;
			res.redirect('/');
		}
		else{
			renderPage('/login', res, {
				errorMessage: 'Los datos ingresados no son correctos, intentelo de nuevo.'
			});
		}
	}).catch(function(err){
		renderPage('/login', res, {
			errorMessage: err
		});
		log.error(err);
	});
});

//Socket.IO/////////////////////////////////////////////////////////////////////
io.sockets.on('connection', function(socket){

	socket.on('reqNewUser', function(form){
		var newUser = {
			userName: form.name,
			password: form.pass,
			email: form.email.length > 0 ? form.email : null,
			role: form.role
		};
		if(newUser.userName && newUser.password && newUser.role){
			db_users.newUser(newUser).then(function(_result){
				io.to(socket.id).emit('resRenderMessage', {
					message: _result,
					alert: null,
					error: null,
					instruction: null
				});
				log.event('Nuevo ' + (newUser.role === 'admin' ? 'administrador' : 'usuario') + ' creado: ' + newUser.userName + ' - ' + ((newUser.email) ? (newUser.email) : 'sin email'));
			}).catch(function(_err){
				io.to(socket.id).emit('resRenderMessage', {
					message: null,
					alert: _err,
					error: null,
					instruction: null
				});
			});
		}
		else{
			io.to(socket.id).emit('resRenderMessage', {
				message: null,
				alert: null,
				error: 'Alguno de los valores requeridos no fue completado',
				instruction: null
			});
		}
	});

	socket.on('reqWinnerSearch', function(txtQuery){
		if(txtQuery.txt !== ''){
			db_winners.query(txtQuery.txt).then(function(_winners){
				if(_winners){
					var ids_array = gatherPrizesIds(_winners);
					findPrizes(ids_array).then(function(_prizes){
						io.to(socket.id).emit('resWinnerResults', [_winners, _prizes]);
					}).catch(function(err){
						console.log(err);
					});
				}
				else{
					io.to(socket.id).emit('resWinnerResults', null);
				}
			}).catch(function(err){
				console.log(err);
			});
		}
	});

	socket.on('reqGrantPrizeIf', function(_data){
		db_winners.ci(_data.ci).then(function(_winner){
			if(_winner){
				var prizes_id = [];
				for (var i = 0; i < _winner.prizes.length; i++) {
					prizes_id.push(_winner.prizes[i].id);
				}
				db_prizes.ids(prizes_id).then(function(_prizes_info){
					var clean_info = [];
					for (var i = 0; i < _prizes_info.length; i++) {
						clean_info.push(_prizes_info[i][0]);
					}
					io.to(socket.id).emit('resAlreadyWinner', [clean_info, _winner.prizes]);//on js/prizes.js > handle the _winner.prizes
				}).catch(function(err){
					io.to(socket.id).emit('resRenderMessage', {
						message: null,
						alert: null,
						error: 'ERR_DB - There was a problem trying to fetch data from the database<br>file: app.js<br>' + err.toString(),
						instruction: null
					});
				});
			}
			else{
				var newWinner = new Winner({
					ci: _data.ci,
					name1: _data.name1 || null,
					lastname1: _data.lastname1 || null,
					facebook: _data.facebook || null,
					gender: _data.gender || null,
					phone: _data.phone || null,
					mail: _data.mail || null,
					prizes: [{'id': _data.prize, 'handed': false, 'granted': Date(Date.now())}]
				});
				newWinner.save(function(err){
					if(err){
						io.to(socket.id).emit('saveWinnerError', err);
					}
					else{
						io.to(socket.id).emit('saveWinnerOk', 'El premio se ha otorgado con exito.');
					}
				})
				decrPrizeStock(_data.prize.id);
			}
		}).catch(function(err){
			io.to(socket.id).emit('resRenderMessage', {
				message: null,
				alert: null,
				error: err.toString(),
				instruction: null
			});
		});
	});

	socket.on('grantPrizeAnyway', function(data){
		Winner.update({ci: data.ci}, {prizes: data.updatedPrizes}, null, function(err, updatedWinner){
			if(err){
				io.to(socket.id).emit('saveWinnerError', err);
			}
			else{
				io.to(socket.id).emit('saveWinnerOk', 'El premio se ha otorgado con exito.');
			}
		});
		var lastPrize = data.updatedPrizes[data.updatedPrizes.length-1];
		decrPrizeStock(lastPrize.id);
	});

	socket.on('reqUpdateData', function(){
		updatePrizesList(socket);
		updateSponsorsList(socket);
		updatePrizesTypeList(socket);
	});

	socket.on('reqHandOverPrize', function(_data){
		var winner_ci = _data.winner_ci;
		var prize_id = _data.prize_id;
		//Find the winner
		db_winners.ci(winner_ci).then(function(_winner){
			//Get the winner prizes
			var prizes = _winner.prizes;
			//Change prize status
			changeHandedState(prizes, prize_id);
			//Update all winner prizes info
			db_winners.updateprizes([winner_ci, prizes]).then(function(_write_result){
				//User feedback
				io.to(socket.id).emit('resRenderMessage', {
					message: 'El premio ha sido entregado al ganador.',
					alert: null,
					error: null,
					instruction: null
				});
				db_winners.ci(winner_ci).then(function(_winner){
					io.to(socket.id).emit('resHandOverPrize', [_winner]);
				});
			});
		}).catch(function(err){
			console.log(err);
			io.to(socket.id).emit('resRenderMessage', {
				message: null,
				alert: null,
				error: err.toString(),
				instruction: null
			});
		});
	});

	socket.on('reqReturnPrize', function(_data){
		console.log('reqReturnPrize was called');
		var winner_ci = _data.winner_ci;
		var prize_id = _data.prize_id;
		//Find the winner
		db_winners.ci(winner_ci).then(function(_winner){
			//Get the winner prizes
			var prizes = _winner.prizes;
			//Change prize status
			var prizes_changed = removePrize(prizes, prize_id);
			//Update all winner prizes info
			db_winners.updateprizes([winner_ci, prizes_changed]).then(function(_write_result){
				db_prizes.return_stock(prize_id).then(function(_result){
					io.to(socket.id).emit('resRenderMessage', {
						message: 'El premio ha sido devuelto al stock.',
						alert: null,
						error: null,
						instruction: null
					});
				});
			});
		}).catch(function(err){
			console.log(err);
			io.to(socket.id).emit('resRenderMessage', {
				message: null,
				alert: null,
				error: err.toString(),
				instruction: null
			});
		});
	});


	socket.on('reqPrizeData', function(prize_id){
		var ids_array = [{'id': prize_id}];
		findPrizes(ids_array).then(function(array){
			var foundPrize = array[0];
			io.to(socket.id).emit('resPrizeData', foundPrize);
		}).catch(function(err){
			console.log(err);
		});
	});

	socket.on('reqUpdatePrize', function(data){
		Prize.update({_id: data.id},
			{
				type: data.type,
				sponsor: data.sponsor,
				description: data.description,
				quantity: data.quantity,
				due_date: data.due_date,
				note: data.note
			}, null, function(err, updatedPrize){
				if(err){
					console.log('Prize.update >> ' + err);
				}
				else{
					console.log(updatedPrize);
					updatePrizesList(socket);
				}
			});
		});
	});

	function gatherPrizesIds(_winners){
		var prizes_ids = [];
		if(_winners){
			for (var i = 0; i < _winners.length; i++) {
				var winner = _winners[i];
				for (var j = 0; j < winner.prizes.length; j++) {
					var prize = winner.prizes[j];
					prizes_ids.push({'id': prize.id});
				}
			}
		}
		return prizes_ids;
	}

	function changeHandedState(_prizes, _prize_id){
		var i = 0;
		var one_changed = false;
		while (i < _prizes.length && !one_changed) {
			if(_prizes[i].id === _prize_id && !_prizes[i].handed){
				_prizes[i].handed = true;
				one_changed = true;
			}
			i++;
		}
		return;
	}

	function removePrize(_prizes, _prize_id){
		var i = 0;
		var prizes_changed = [];
		var one_removed = false;
		for (var i = 0; i < _prizes.length; i++) {
			if(_prizes[i].id !== _prize_id || _prizes[i].handed || !one_removed){
				prizes_changed.push(_prizes[i]);
			}
			else{
				one_removed = true;
			}
		}
		return prizes_changed;
	}

	function decrPrizeStock(prize_id){
		var ids_array = [{'id': prize_id}];
		findPrizes(ids_array).then(function(array_value){
			var foundPrize = array_value[0];
			var decremented = foundPrize.quantity - 1;
			Prize.update({_id: foundPrize._id}, {quantity: decremented}, null, function(err, updatedWinner){
				if(err){
					console.log('Prize.decrement >> ' + err);
				}
				else{
					updatePrizesList();
				}
			});
		}).catch(function(err){
			console.log(err);
		});
	}

//Database Handlers//////////////////////////////////////////////////////////

//Prize's codes/////////////////////////////////////////////////////////////////
function findPrizes(ids_array){
	return Promise.all(stackPromises(ids_array)).then(function(_prizes){
		return _prizes;
	}).catch(function(err){
		console.log('ERR_DB0005 - No se pudo recuperar la lista de tipos de premios.\n' + err);
	});
}
function stackPromises(ids_array){
	var stack = [];
	for(var i=0; i<ids_array.length; i++){
		stack.push(findPrize(ids_array[i].id));
	}
	return stack;
}
function findPrize(id){
	return new Promise(function(resolve, reject){
		Prize.findById(id, function(err, _prize){
			if(err) return reject(err);
			return resolve(_prize);
		});
	});
}

function updatePrizesList(socket){
	db_prizes.all().then(function(_data){
		var prizes = _data;
		var active_prizes = db_prizes.active(prizes);
		var sorted_prizes = db_prizes.sort_type(active_prizes);
		io.sockets.emit('resUpdatePrizesList', sorted_prizes);//Emits for every user conected
	}).catch(function(err){
		console.log(err);
		io.to(socket.id).emit('resRenderMessage', {
			message: null,
			alert: null,
			error: err,
			instruction: null
		});
	});
}

function updateSponsorsList(socket){
	db_prizes.distinct('sponsor').then(function(_sponsors){
		io.sockets.emit('resUpdateSponsorsList', _sponsors);
	}).catch(function(){
		console.log(err);
		io.to(socket.id).emit('resRenderMessage', {
			message: null,
			alert: null,
			error: 'ERR_DB - No se puede mostrar la lista de espónsors\n' + err,
			instruction: null
		});
	});
}

function updatePrizesTypeList(socket){
	db_prizes.distinct('type').then(function(_prizes_types){
		io.sockets.emit('resUpdatePrizesTypeList', _prizes_types);
	}).catch(function(){
		console.log(err);
		io.to(socket.id).emit('resRenderMessage', {
			message: null,
			alert: null,
			error: 'ERR_DB - No se puede mostrar la lista de tipos de premios\n' + err,
			instruction: null
		});
	});
}


//Server port configuration/////////////////////////////////////////////////////
server.listen(port, function(){
	console.log('Listening on: ' + hostIp + ':' + port + '\nPress Ctrl-C to terminate.');
});

//Others////////////////////////////////////////////////////////////////////////
String.prototype.capitalize = function(){
	return this.replace(/(?:^|\s)\S/g, function(a){
		return a.toUpperCase();
	});
};
