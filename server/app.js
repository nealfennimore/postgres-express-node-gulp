/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var Sequelize = require('sequelize');
var config = require('./config/environment');
var chalk = require('chalk');

// Connect to database
var sequelize = new Sequelize(config.pg.uri)
// Test database connection
sequelize.authenticate()
         .complete(function(err) {
          if (!!err) {
            console.log(chalk.bold.red('Unable to connect to the database:'), err);
          } else {
            console.log(chalk.bold.green('DB connection has been established successfully.'));
          }
        });

// Populate DB with sample data
// if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
require('./config/express')(app);
require('./routes')(app);
// require('./models')(sequelize, Sequelize);

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