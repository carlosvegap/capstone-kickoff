require("dotenv/config")
var express = require('express');
var router = express.Router();
const Parse = require('parse/node')
var axios = require('axios');

Parse.initialize(process.env.NODE_ENV_ID_PROJECT, process.env.NODE_ENV_PROJECT_KEY);
Parse.serverURL = 'http://parseapi.back4app.com';