"use strict";
const Users = require('./users');
const bcrypt = require('bcryptjs');

const login = (name, pass) => {
  return new Promise((resolve, reject) => {
    Users.findByName(name)
      .then((user) => {
        if (user && bcrypt.compareSync(pass, user.getPassword()))
          return resolve({ 'userName': user.getUserName(), 'role': user.getRole() });
        return resolve(null);
      })
      .catch((err) => {
        return reject(err)
      });
  });
}

const hashPass = (_pass) => bcrypt.hashSync(_pass, bcrypt.genSaltSync(10));

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    req.session.reset();
    res.status(401).json({ error: "You need to be logged in to use this functionality", user: null });
  }
  else
    next();
}

const checkRoleAdmin = (req, res, next) => {
  if (req.session.role !== 'admin') {
    // req.session.reset();
    res.status(401).json({ error: "You need to have administrative privileges to use this functionality", user: null });
  }
  else
    next();
}

module.exports = {
  hashPass: hashPass,
  login: login,
  requireLogin: requireLogin,
  checkRoleAdmin: checkRoleAdmin
};
