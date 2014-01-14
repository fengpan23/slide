"use strict";
var winston = require('winston');

require('winston-mongodb').Mongo;

winston.add(winston.transports.File, {filename: 'log/all-logs.txt'});
winston.add(winston.transports.MongoDB, {db: 'test'});

exports.logger = winston;
