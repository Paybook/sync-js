

var paybook = {};
var api = require('./api');
var action = require('./actions');
var store = require('./store');
paybook.api = api;
paybook.action = action;
paybook.store = store;

module.exports = paybook;