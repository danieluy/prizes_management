"use strict"
//Dependencies//////////////////////////////////////////////////////////////////
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const fs = require('fs');

//Configuration/////////////////////////////////////////////////////////////////
const config = require('./config.json');

const hostIp = config.connection.lan.ip;
const port = config.connection.lan.port;

const db_ip = config.connection.database.ip;
const db_port = config.connection.database.port;
const db_name = config.connection.database.name;
const db_pass = config.connection.database.password;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

//Logger////////////////////////////////////////////////////////////////////////
const log = require('./my_modules/logger.js');
// Testing function
// for (var i = 1; i <= 5; i++) {
// 	log.event('Log entry #' + i);
// }


//Security//////////////////////////////////////////////////////////////////////
const sessions = require('client-sessions');
const security = require('./my_modules/security.js');


//Database////////////////////////////////////////////////////////////////////
const db_winners = require('./my_modules/db_winners.js');
const db_prizes = require('./my_modules/db_prizes.js');
const db_users = require('./my_modules/db_users.js');
const Prize = db_prizes.Prize;
const Winner = db_winners.Winner;

//Middleware////////////////////////////////////////////////////////////////////
app.use(bodyParser.urlencoded({extended: false}));

//Session Config.
const session_secret = config.session.secret;
const session_duration = config.session.durationHours;
const session_active_duration = config.session.activeDurationHours;
app.use(sessions({
	cookieName: 'session',
	secret: session_secret,
	duration: session_duration * 60 * 60 * 1000,
	activeDuration: session_active_duration * 60 * 60 * 1000,
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

//Public folders
app.use(express.static(__dirname + '/public'));



//Express Locals////////////////////////////////////////////////////////////////
//app.locals.config = config;

app.locals.pageUrl = hostIp + ':' + port;
app.locals.pageTitle = 'Radiocero';

//Routing///////////////////////////////////////////////////////////////////////

//THIS SECTION HAS TO BE COMPLETELY REWRITTEN/////////////////////////////////////THIS SECTION HAS TO BE COMPLETELY REWRITTEN///////////////////////////////////

//GET///////////////////////////////////////////////////////////////////////////
app.get('/', function(req, res){
	res.redirect('/home');
});

app.get('/home', function(req, res){
	res.render('index', {
		title: 'Inicio',
		errorMessage: null
	});
});

//  Login  ---------------------------------------------------------------------
app.get('/login', requireLogin, function(req, res){
	res.render('index', {
		title: 'Inicio de Sesión',
		errorMessage: null
	});
});

app.post('/login', function(req, res){
	var userName = req.body.user.toLowerCase();
	var pass = req.body.pass;
	security.login(userName, pass).then(function(login_eval){
		if(login_eval.eval){
			log.event(login_eval.user.userName + ' has logged in.');
			req.session.user = login_eval.user;
			res.redirect('back');
		}
		else{
			res.render('index', {
				title: 'Inicio de Sesión',
				errorMessage: 'Los datos ingresados no son correctos, intentelo de nuevo.'
			});
		}
	}).catch(function(err){
		log.error(err);
		res.render('index', {
			title: 'Inicio de Sesión',
			errorMessage: err
		});
	});
});

app.get('/logout', requireLogin, function(req, res){
	if(req.session.user){
		log.event(req.session.user.userName + ' has logged out.');
		req.session.reset();
	}
	res.redirect('/');
});

app.get('/register', requireLogin, checkRoleAdmin, function(req, res){
	res.render('index', {
		title: 'Alta de Usuario',
		errorMessage: null
	});
});

app.get('/premios', requireLogin, function(req, res){
	res.render('index', {
		title: 'Premios',
		errorMessage: null
	});
});

// app.get('/ganadores', requireLogin, function(req, res){
// 	renderPage('/ganadores', res, {
// 		errorMessage: null
// 	});
// });

app.get('/*', function(req, res){
	res.render('404', {
		title: '404'
	});
});


// DELETEEEEEEEEEEEEEEEE  ------------------------------------------------------
function renderPage(address, res, options){
	var data = {};
	switch(address){
		case '/home':
		data = {
			title: 'Inicio',
			errorMessage: options.errorMessage
		};
		break;

		case '/login':
		data = {
			title: 'Inicio de Sesión',
			errorMessage: options.errorMessage
		};
		break;

		case '/register':
		data = {
			title: 'Alta de Usuario',
			errorMessage: options.errorMessage
		};
		break;

		case '/premios':
		data = {
			title: 'Premios',
			errorMessage: options.errorMessage
		};
		break;

		case '/ganadores':
		data = {
			title: 'Ganadores',
			errorMessage: options.errorMessage
		};
		break;

		default:
		console.log('Default, lpm!');
	}
	res.render('index', data);
}


//POST /////////////////////////////////////////////////////////////////////////
app.post('/newPrize', function(req, res){

	let type = req.body.type.toLowerCase(),
			sponsor = req.body.sponsor.toLowerCase(),
			description = req.body.description.toLowerCase(),
			quantity = parseInt(req.body.quantity),
			due_date = req.body.due_date,
			note = req.body.note.toLowerCase();

	if(type && sponsor && description && quantity){
		const newPrize = new Prize(type, sponsor, description, quantity, due_date, note);
		newPrize.save()
		.then( res.redirect('/premios') )
		.catch( (err) => {
			renderPage('/premios', res, {
				errorMessage:
					'Ha ocurrido un error, inténtelo de nuevo. Gracias.'+
					'\nDetalles: ' + err
			})
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
// app.post('/login', function(req, res){
// 	var userName = req.body.user.toLowerCase();
// 	var pass = req.body.pass;
// 	security.login(userName, pass).then(function(login_eval){
// 		if(login_eval.eval){
// 			log.event(login_eval.user.userName + ' has logged in.');
// 			req.session.user = login_eval.user;
// 			res.redirect('/');
// 		}
// 		else{
// 			renderPage('/login', res, {
// 				errorMessage: 'Los datos ingresados no son correctos, intentelo de nuevo.'
// 			});
// 		}
// 	}).catch(function(err){
// 		renderPage('/login', res, {
// 			errorMessage: err
// 		});
// 		log.error(err);
// 	});
// });

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
			db_winners.query(txtQuery.txt).then( (_winners) => {
				if(_winners){
					var ids_array = gatherPrizesIds(_winners);
					db_prizes.ids(ids_array).then(function(_prizes){
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

	// WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS WORKING ON THIS
	socket.on('reqGrantPrizeIf', function(_data){
		db_winners.ci(_data.ci)
		.then((_winner) => {
			if(_winner){// Handles the pre-existing Winner's cases
				var prizes_id = _winner.getPrizes.map(prize => prize.id);
				// db_prizes.ids(prizes_id)
				// .then(function(_prizes_info){
				// 	// var clean_info = [];
				// 	// for (var i = 0; i < _prizes_info.length; i++) {
				// 	// 	clean_info.push(_prizes_info[i][0]);
				// 	// }
				// 	const clean_info = _prizes_info.map(prize_info => prize_info[0]);
				// 	io.to(socket.id).emit('resAlreadyWinner', [clean_info, _winner.prizes]);//on js/prizes.js > handle the _winner.prizes
				// })
				// .catch(function(err){
				// 	io.to(socket.id).emit('resRenderMessage', {
				// 		message: null,
				// 		alert: null,
				// 		error: 'ERR_DB - There was a problem trying to fetch data from the database<br>file: app.js<br>' + err,
				// 		instruction: null
				// 	});
				// });
			}
			else{// Handles the new Winner's cases
				const newWinner = new Winner(// params: _id, _ci, _name, _lastname, _facebook, _gender, _phone, _mail, _prizes[]
					null,
					_data.ci,
					_data.name,
					_data.lastname,
					_data.facebook,
					_data.gender,
					_data.phone,
					_data.mail,
					[{
						'id': _data.prize,
						'handed': false,
						'granted': (Date.now())
					}]
				);
				newWinner.save()
				.then((WriteResult) => {
					io.to(socket.id).emit('resRenderMessage', {
						message: 'El premio se ha otorgado con exito.',
						alert: null,
						error: null,
						instruction: null
					});
				})
				.catch((err) => {
					io.to(socket.id).emit('resRenderMessage', {
						message: null,
						alert: null,
						error: err.toString(),
						instruction: null
					});
				});
				// decrPrizeStock(_data.prize.id);
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
		var ids_array = [prize_id];
		db_prizes.ids(ids_array).then(function(array){
			var foundPrize = array[0];
			io.to(socket.id).emit('resPrizeData', foundPrize);
		}).catch(function(err){
			console.log(err);
		});
	});

	socket.on('reqUpdatePrize', (data) => {
		// Prize.update({_id: data.id},
		// 	{
		// 		type: data.type,
		// 		sponsor: data.sponsor,
		// 		description: data.description,
		// 		quantity: data.quantity,
		// 		due_date: data.due_date,
		// 		note: data.note
		// 	}, null, function(err, updatedPrize){
		// 		if(err){
		// 			console.log('Prize.update >> ' + err);
		// 		}
		// 		else{
		// 			updatePrizesList(socket);
		// 		}
		// 	});
		});
	});

	function gatherPrizesIds(_winners){
		var prizes_ids = [];
		if(_winners){
			for (var i = 0; i < _winners.length; i++) {
				var winner = _winners[i];
				for (var j = 0; j < winner.prizes.length; j++) {
					var prize = winner.prizes[j];
					prizes_ids.push(prize.id);
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
		var ids_array = [prize_id];
		db_prizes.ids(ids_array)
		.then(function(array_value){
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
		})
		.catch(function(err){
			console.log(err);
		});
	}

	//Database Handlers///////////////////////////////////////////////////////////

	//Prize's codes///////////////////////////////////////////////////////////////
	function updatePrizesList(socket){
		db_prizes.all()
		.then(function(_data){
			const active_sorted_prizes = db_prizes.sort_type(db_prizes.active(_data));
			io.sockets.emit('resUpdatePrizesList', active_sorted_prizes);
		})
		.catch(function(err){
			console.log(err);
			io.to(socket.id).emit('resRenderMessage', {
				message: null,
				alert: null,
				error: 'ERROR_AT_METHOD_updatePrizesList()\n' + err,
				instruction: null
			});
		});
	}

	function updateSponsorsList(socket){
		db_prizes.distinct('sponsor')
		.then(function(_sponsors){
			io.sockets.emit('resUpdateSponsorsList', _sponsors);
		})
		.catch(function(){
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
		console.log('Listening on: http://' + hostIp + ':' + port + '\nPress Ctrl-C to terminate.');
	});

	//Others////////////////////////////////////////////////////////////////////////
	// String.prototype.capitalize = function(){
	// 	return this.replace(/(?:^|\s)\S/g, function(a){
	// 		return a.toUpperCase();
	// 	});
	// };
