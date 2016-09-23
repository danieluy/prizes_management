"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Testing  ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// db  /////////////////////////////////////////////////////////////////////////
const db = require('./my_modules/db.js');

// db.exists('users', {userName: 'Tyler Durden'})
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// db.find('users')
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// db.find('users', {userName: 'admin'})
// .then((result) => {console.log(result)})
// .catch((err) => {console.error(err)});

// db_users  ///////////////////////////////////////////////////////////////////
const db_users = require('./my_modules/db_users.js');
const User = db_users.User;

function newUser(){
	const new_user = new User({
		id: null,
		userName: 'admin',
		password: 'pass1234',
		email: null,
		role: 'user',
		set_date: null
	})
	return new_user;
}
// const nu = newUser();
// nu.save()
// .then((result) => {console.log(result);console.log('Inserted id:', nu.getId())})
// .catch((err) => {console.error(err)});
// console.log(nu.getId());

function findUserByName(){
	let candidate = 'Tyler Durden';
  db_users.findUserName(candidate)
  .then((result) => {
		if(result) console.log('The user name "'+candidate+'" is already taken');
		else console.log('The user name "'+candidate+'" is free to use');
	})
  .catch((err) => console.error(err))
}
// findUserByName();

// db_prizes  //////////////////////////////////////////////////////////////////
const db_prizes = require('./my_modules/db_prizes.js');
const Prize = db_prizes.Prize;

function newPrize(){
	const newPrize = new Prize({
		type: 'Entrada de cine',
		sponsor: 'Movie Center',
		description: 'The Matrix',
		stock: '10',
		set_date: null,
		due_date: '2016-10-09',
		note: 'The Matrix es una película de Ciencia Ficción escrita y dirigida por Lana y Lilly Wachowski y protagonizada por Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss y Hugo Weaving. Estrenada en los Estados Unidos el 31 de marzo de 1999.'
	});
	return newPrize;
}
// newPrize().save().then((result) => {console.log(result)}).catch((err) => {console.error(err)});

function increaseStock(){
	let value = '2';
	const np = newPrize();
	np.save().then((result) => {
		console.log(result);
		setTimeout(()=>{
			np.stockIncrease(value)
			.then((data) => console.log('data', data))
			.catch((err) => console.log('err', err))
			console.log('Original stock =', np.stock());
			console.log('Increase value =', value);
			console.log('Increased stock =', np.stock());
		},1000)
	}).catch((err) => {console.error(err)});
}
// increaseStock()

function decreaseStock(){
	let value = '5a';
	const np = newPrize();
	np.save().then((result) => {
		console.log(result);
		setTimeout(()=>{
			console.log('Original stock =', np.stock());
			console.log('Decrease value =', value);
			np.stockDecrease(value);
			console.log('Decreased stock =', np.stock());
		},1000)
	}).catch((err) => {console.error(err)});
}
// decreaseStock();
