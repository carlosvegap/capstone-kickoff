const Parse = require('parse/node')

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';

exports.Parse = Parse;