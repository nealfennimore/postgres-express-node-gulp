/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config');
var chalk = require('chalk');

var models = require('./models');

// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
require('./config/express')(app);
require('./routes')(app);

app.listen(config.port, config.ip, function () {
  console.log(
    chalk.blue('Express server listening on ') + chalk.bold.yellow('%d') + chalk.blue(', in ') + chalk.bold.green('%s') + chalk.blue(' mode'), config.port, app.get('env')
  );
});

// var socketio = require('socket.io')(server, {
//   serveClient: (config.env === 'production') ? false : true,
//   path: '/socket.io-client'
// });
// require('./config/socketio')(socketio);
// Expose app
exports = module.exports = app;