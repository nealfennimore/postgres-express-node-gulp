'use strict';

var path = require('path');
var _ = require('lodash');

var config = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'app-secret'
  },
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  config,
  require('./db.json')[config.env] || {});