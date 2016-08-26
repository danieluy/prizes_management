"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Testing  ///////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// db_users  ///////////////////////////////////////////////////////////////////
const db_users = require('./my_modules/db_users.js');
db_users.init();
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
}
// newUser();
setTimeout(newUser, 1100);

function findUserByName(){
  db_users.findUserName('franco')
  .then((results) => {console.log(results)})
  .catch((err) => console.error(err))
}
// findUserByName();
