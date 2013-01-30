'use strict';
// call_bodymedia_url.js
//
// Make oauth calls to bodymedia api
//
// Usage: 
// node call_bodymedia_url.js [ --redo_auth ] --url <bodymedia url>
// Example:
// node call_bodymedia_url.js --redo_auth --url 'http://api.bodymedia.com/v1.0/json/goal/DAILY_CAL_BURN'
//
// oauth token data will be saved/pulled from ./perm_token_data.txt
//
var argv = require('optimist').argv;

var bodymedia = require('bodymedia');

bodymedia.call(argv, function(body) { console.log(body) });

