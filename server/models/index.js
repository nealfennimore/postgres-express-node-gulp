'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/db.json')[env];
var sequelize = new Sequelize(config.database, config.username, config.password, config);
var db        = {};
var chalk     = require('chalk');

// Test database connection
sequelize.authenticate()
         .complete(function(err) {
          if (!!err) {
            console.log(chalk.bold.red('Unable to connect to the database:'), err);
          } else {
            console.log(chalk.bold.green('DB connection has been established successfully.'));
          }
        });

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
