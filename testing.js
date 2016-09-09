"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Testing  ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// db_users  ///////////////////////////////////////////////////////////////////
const db_users = require('./my_modules/db_users.js');
const User = db_users.User;

function newUser(){
	const new_user = new User({
		id: null,
		userName: 'admin',
		password: 'pass1234',
		email: 'danielsosa.dev@gmail.com',
		role: 'admin',
		set_date: null
	})
	return new_user;
}
// newUser();
// setTimeout(newUser, 1100);

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

function saveUser(){
	newUser().save()
	.then((WriteResult) => {
		console.log(WriteResult)
	})
	.catch((err) => {
		console.error(err);
	})
}
saveUser()
