"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Testing  ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// db  /////////////////////////////////////////////////////////////////////////
const db = require('./my_modules/db.js');

// db.exists('users', {userName: 'admin'})
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// db.find('users')
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// db.find('users', {userName: 'admin'})
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// Users  ///////////////////////////////////////////////////////////////////

const Users = require('./my_modules/users.js');
const User = Users.User;

function newUser() {
	return new User({
		id: null,
		userName: 'Tyler Durden',
		password: 'pass1234',
		email: 'tyler@fc.com',
		role: 'user',
		set_date: null
	});
}
// const nu = newUser();
// nu.save()
// 	.then((result) => { console.log(result); console.log('Inserted id:', nu.getId()) })
// 	.catch((err) => { console.error(err) });
// console.log(nu.getId());

function findUserByName(candidate) {
	Users.findByName(candidate)
	.then((result) => {
		if (result) console.log('The user name "' + candidate + '" is already taken');
		else console.log('The user name "' + candidate + '" is free to use');
	})
	.catch((err) => console.error(err))
}
// findUserByName('adMIn');

// Prizes  /////////////////////////////////////////////////////////////////////

const Prizes = require('./my_modules/prizes.js');
const Prize = Prizes.Prize;
let g_prize_id = null;

function newPrize() {
	const newPrize = new Prize({
		type: 'Estadía',
		sponsor: 'Hotel Colonia',
		description: 'Dos noches con desayuno',
		stock: 2,
		due_date: '2016/12/01', // < yyyy/MM/dd >
		note: "Hotel 3 estrellas en el corazón de Colonia del Sacramento"
	});
	newPrize.save()
	.then((result) => {
		g_prize_id = result.ops[0]._id;
		console.log('g_prize_id:', g_prize_id);
	})
	.catch((err) => { console.error(err) });
}
newPrize();


function increaseStock(value) {
	Prizes.findById('583d78c534a50e180aa2830e')
	.then((result) => {
		console.log('Original stock =', result.getStock());
		console.log('Increase value =', value);
		result.stockIncrease(value)
		.then((WriteResult) => {
			console.log('WriteResult', WriteResult)
			console.log('Increased stock =', result.getStock());
		})
		.catch((err) => {
			console.log(err)
		})
	})
	.catch((err) => { console.error(err) });
}
// increaseStock('10')


function decreaseStock(value) {
	Prizes.findById('583d78c534a50e180aa2830e')
	.then((result) => {
		console.log('Original stock =', result.getStock());
		console.log('Decrease value =', value);
		result.stockDecrease(value)
		.then((WriteResult) => {
			console.log('WriteResult', WriteResult)
			console.log('Decreased stock =', result.getStock());
		})
		.catch((err) => {
			console.log(err)
		})
	})
	.catch((err) => { console.error(err) });
}
// decreaseStock('50')

//  Winners  ///////////////////////////////////////////////////////////////////

const Winners = require('./my_modules/winners.js');
const Winner = Winners.Winner;

function newWinner(){
	var w = new Winner({
		ci:'1234561',
		name:'Tyler',
		lastname:'Durden',
		facebook: 'https://es-la.facebook.com/tyler.durden',
		gender: 'M',
		phone: '099000111',
		mail: 'tyler@tfc.com'
	});
	w.save()
	.then((WriteResult) => {
		console.log(WriteResult);
	})
	.catch((err) => {
		console.log(err)
	})
}
// newWinner();

function findByCi(ci){
	Winners.findByCi(ci)
	.then(w => console.log(w.getName(), w.getLastname(), w.getFacebook()))
	.catch(err => console.log(err));
}
// findByCi('1234561');

function addDeletePrizes(){

	Winners.findByCi('1234561')
	.then((w) => {
		w.addPrize('asdfbdgdts3456rth3w4f').then(res => console.log(res));
		// w.addPrize('lhdtbyhdtyjfy').then(res => console.log(res));
		// w.deletePrize('asdfbdgdts3456rth3w4f').then(res => console.log(res));
	})
	.catch(err => console.log(err));
}
// addDeletePrizes();

function newWinnerAddPrize(){
	var w = new Winner({
		ci:'1234561',
		name:'Tyler',
		lastname:'Durden',
		facebook: 'https://es-la.facebook.com/tyler.durden',
		gender: 'M',
		phone: '099000111',
		mail: 'tyler@tfc.com'
	});
	w.save()
	.then((WriteResult) => {
		Winners.findByCi('1234561')
		.then((w) => {
			w.addPrize('asdfbdgdts3456rth3w4f').then(res => console.log(res));
			// w.addPrize('lhdtbyhdtyjfy').then(res => console.log(res));
			// w.deletePrize('asdfbdgdts3456rth3w4f').then(res => console.log(res));
		})
	})
	.catch((err) => {
		console.log(err)
	})
}
// newWinnerAddPrize();
