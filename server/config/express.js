/**
 * Express configuration
 */

'use strict';

var express = require('express');
var config = require('./');
var path = require('path');
var handlerbars = require('express-handlebars');
var morgan = require('morgan');
var favicon = require('serve-favicon');

var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var passport = require('passport');
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);


module.exports = function(app) {
  var env = app.get('env');
  var db_uri = config.dialect + '://' + config.username + ':' + config.password + '@localhost/' + config.database;

  app.use(express.static(config.root + '/client'));
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser());
  app.use(passport.initialize());

  app.use(session({
    store: new pgSession({
      conString: db_uri,
      tableName: 'session'
    }),
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 24 * 30 }
  }));

  app.set('views', config.root + '/client/views');
  app.engine('.hbs', handlerbars({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: config.root + '/client/views/layouts/',
    partialsDir: config.root + '/client/views/partials/'
  }));
  app.set('view engine', '.hbs');

  if ('development' === env || 'test' === env) {
    app.use(require('connect-livereload')());
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client/views');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', config.root + '/client');
    app.use(morgan('dev'));
  }
};