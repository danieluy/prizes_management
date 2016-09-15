"use strict";
const db_users = require('./db_users');
const bcrypt = require('bcryptjs');

const login = (name, pass) => {
  return new Promise((resolve, reject) => {
    db_users.findUserName(name)
    .then((user) => {
      console.log('findUserName user');
      console.log(user);
      if(user && bcrypt.compareSync(pass, user.getPassword()))
        return resolve({'userName': user.getUserName(), 'role': user.getRole()});
      else
        return resolve(null);
    })
    .catch((err) => {
      reject(err)
    });
  });
}

const hashPass = (_pass) => bcrypt.hashSync(_pass, bcrypt.genSaltSync(10));

const requireLogin = (req, res, next) => {
  if(!req.session.user){
    req.session.reset();
    res.status(401).json({error: "You need to be logged in to use this functionallity.", user: null});
  }
  else
    next();
}

const checkRoleAdmin = (req, res, next) => {
	if(req.session.user.role !== 'admin'){
		// renderPage('/login', res, {
		// 	errorMessage: "Debe iniciar sesión como Administrador, gracias."
		// });
	}
	else{
		next();
	}
}

const checkRoleUser = (req, res, next) => {
	if(req.session.user.role !== 'user'){
		// renderPage('/login', res, {
		// 	errorMessage: "Debe iniciar sesión como Usuario, gracias."
		// });
	}
	else{
		next();
	}
}

module.exports = {
  hashPass: hashPass,
  login: login,
  requireLogin: requireLogin,
  isAdmin: checkRoleAdmin,
  isUser: checkRoleUser
};
