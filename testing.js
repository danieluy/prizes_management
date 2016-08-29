"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Testing  ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// db_users  ///////////////////////////////////////////////////////////////////
const db_users = require('./my_modules/db_users.js');
// db_users.init();
const User = db_users.User;

function newUser(){
	const new_user = new User({
		id: null,
		userName: 'lalala',
		password: 'pass1234',
		email: null,
		role: 'admin',
		set_date: null
	})
	console.log(new_user.getUserName());
	console.log(new_user);
	return new_user;
}
// newUser();
// setTimeout(newUser, 1100);

function findUserByName(){
	let candidate = 'Tyler Durden';
  db_users.findUserName(candidate)
  .then((result) => {
		if(result)
			console.log('The user name "'+candidate+'" is already taken');
		else
			console.log('The user name "'+candidate+'" is free to use');
	})
  .catch((err) => console.error(err))
}
// findUserByName();

function saveUser(){
	newUser()
	.save()
	.then((WriteResult) => {console.log(WriteResult)})
	.catch((err) => {
		console.error(err);
	})
}
saveUser()
