"use strict"

////////////////////////////////////////////////////////////////////////////////
//  Dependencies  //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const bodyParser = require("body-parser");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const router = require('./my_modules/router.js');
const io = require('socket.io').listen(server);
const fs = require('fs');
const log = require('./my_modules/logger.js');
const db_users = require('./my_modules/db_users.js');
const config = require('./config.json');
const sessions = require('client-sessions');
const security = require('./my_modules/security.js');
////////////////////////////////////////////////////////////////////////////////
//  Configuration  /////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const User = db_users.User;
// Server parameters
const srv_params = {
	ip: config.network.ip,
	port: config.network.port,
	url: function(){ return 'http://' + this.ip + ':' + this.port }
}
// Database parameters
const db_params = {
	ip: config.database.ip,
	port: config.database.port,
	name: config.database.name,
	pass: config.database.password
}
const session = {
	secret: config.session.secret,
	duration: config.session.durationHours,
	active_duration: config.session.activeDurationHours
}
////////////////////////////////////////////////////////////////////////////////
//  Middleware  ////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// Session
app.use(sessions({
	cookieName: 'session',
	secret: session.secret,
	duration: session.duration * 60 * 60 * 1000, // hours
	activeDuration: session.active_duration * 60 * 60 * 1000, // hours
	cookie: {
		ephemeral: false,
		httpOnly: false,
		secure: false
	}
}));
// Routing
app.use('/', router);
////////////////////////////////////////////////////////////////////////////////
//  Server  ////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
server.listen(srv_params.port, () => {
	console.log('Listening on: ' + srv_params.url());
	console.log('Press Ctrl-C to terminate');
});
