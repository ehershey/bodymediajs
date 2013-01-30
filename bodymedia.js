'use strict';
// bodymedia.js
//
// Make oauth calls to bodymedia api
//
// Usage: 
// var bodymedia = require('bodymedia');
// bodymedia.call({ redo_auth: false, url: "http://api.bodymedia.com/v2/json/asdsadasdasd" },function(err, body) { if(err) throw err; console.log('got response: ' + body) } );
//
// oauth token data will be saved/pulled from ./perm_token_data.txt
//
// API Key: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Shared Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
//
// The endpoint for OAuth authentication is https://api.bodymedia.com/oauth.
// The endpoint for the API is http://api.bodymedia.com/v2
//
//

var API_KEY = process.env['BODYMEDIA_API_KEY'];
var SHARED_SECRET = process.env['BODYMEDIA_SHARED_SECRET'];

if(!API_KEY)
{
  throw Error("No API KEY found in BODYMEDIA_API_KEY environment variable");
}

if(!SHARED_SECRET)
{
  throw Error("No API KEY found in BODYMEDIA_SHARED_SECRET environment variable");
}

var perm_tokendata_file="./perm_token_data.txt";

var request = require('request');
var qs = require('querystring');
var fs = require('fs');
var http = require('http');
var sys = require('sys');
var npm = require("npm")
var child_process = require('child_process');

module.exports = {}; 

// track time of last request to add delay
//
var last_request_time = 0;
var delay_between_requests_ms = 501;

module.exports.call = function call(options, callback) {

    if(!options.url)
    {
        throw new Error("usage: node bodymedia.js [ --redo_auth ] --url <bodymedia url>");
    }



    if(options.redo_auth) {
        do_initial_auth(options, callback)
    } else {
        fs.exists(perm_tokendata_file, function(exists) {
            if(exists) {
                fs.readFile(perm_tokendata_file,'utf8', function(err, data) { if(err) { throw err; } proceed_using_tokens(options, data, callback); });
            } else { 
                do_initial_auth(options, callback);
            }
        });
    }
}


function do_initial_auth(options, callback) {

    // modified version of example from https://github.com/mikeal/request#readme
    // 
    var oauth = { 
        consumer_key: API_KEY,
        consumer_secret: SHARED_SECRET
    };
    var url = 'https://api.bodymedia.com/oauth/request_token';
    
    console.log("calling url: " + url);
    var delay = getRequestDelay();
    setRequestTime();
    setTimeout(function() {
        setRequestTime();

        request.post({url:url, oauth:oauth}, function (e, r, body) {
            setRequestTime();
            if(e) {
                throw e;
            }
        
            // console.log("body: ");
            // console.log(body);
        
            // oauth_token=a19572f3-8fc1-4e1e-b1f5-db780a32b1cc&oauth_token_secret=b40178d1-4464-4e91-bf3b-a54fe4a37d6a&xoauth_request_auth_url=https%3A%2F%2Flocalhost%2Fgowear%2Faccount%2FauthorizeAccess.do&xoauth_token_expiration_time=1374201969
        
            var access_token = qs.parse(body);
        
 
            // how many ports to try to listen to for localhost callback
            //
            var total_tries_allowed = 2;
            var gport = 8080;


            var port = get_new_port();

            var got_callback = 0;

            var server = http.createServer(function(callback_request,response){  
                if(got_callback++) return;
        
                console.log("received localhost callback request");
                response.writeHeader(200, {"Content-Type": "text/html"});         
        
                var oauth = { 
                    consumer_key: API_KEY,
                    consumer_secret: SHARED_SECRET,
                    token: access_token.oauth_token,
                    verifier: "",
                    token_secret: access_token.oauth_token_secret
                }
                var url = 'https://api.bodymedia.com/oauth/access_token';
    
                console.log("calling url: " + url);
                var delay = getRequestDelay();
                setRequestTime();
                setTimeout(function() {
                    setRequestTime();
                    request.post({url:url, oauth:oauth}, function(err, response, body) { 
                    setRequestTime();
                        if(err) { throw err; } 
    
                        fs.writeFile(perm_tokendata_file,body,'utf8',function(err) { if(err) { throw err; } proceed_using_tokens(options, body, callback); });
                    });
                },delay);
                response.write("<html><body>You can close this window and return to the terminal to continue</body></html>");  
                response.end();  
                callback_request.connection.destroy();
                server.close();
            });
            server.maxConnections = 1;
        
            console.log("setting up localhost callback listener");
            console.log("trying port " + port);
        
            var tries = 1;
        
            server.on('error', function (e) {
                if (e.code == 'EADDRINUSE') {
                    console.log("address in use");
                    if(tries++ >= total_tries_allowed)
                    {  
                        console.log("giving up");
                        process.exit();
                    }
                    port = get_new_port(); 
                    console.log("trying port " + port);
                    server.listen(port);  
                }
            });

            server.listen(port);  
        
            server.on('listening', function() {
                console.log("listening...");  

                npm.load(null, function (er, npm) {
                    // use the npm object, now that it's loaded.
                    //
                    var url = "https://api.bodymedia.com/oauth/authorize?oauth_token=" + access_token.oauth_token + '&api_key=' + API_KEY + '&oauth_callback=' + "http://localhost:" + port + "/";
                    console.log("attempting to open a browser to visit this url: " + url);

                    child_process.exec(npm.config.get('browser') + " \"" + url + "\"", function () {});
                });
            });
        
            
            function get_new_port()
            {
                return gport++;
            }


        });
    },delay);
}

function proceed_using_tokens (options, body, callback) {
    // cconsole.log("body: ");
    // console.log(body);

    var perm_token = qs.parse(body);

    var oauth = {
        consumer_key: API_KEY,
        consumer_secret: SHARED_SECRET,
        token: perm_token.oauth_token,
        token_secret: perm_token.oauth_token_secret
    };

    if(perm_token.nonce) {
        oauth.nonce = perm_token.nonce;
    };
    if(perm_token.timestamp) {
        oauth.timestamp = perm_token.timestamp;
    };

    // var url = 'http://api.bodymedia.com/v1.0/json/goal/DAILY_CAL_BURN?api_key=' + API_KEY;
    var url = options.url + '?api_key=' + API_KEY;

    // console.log("calling url: " + url);
    // console.log("using oauth: " + JSON.stringify(oauth,null,2));


    var delay = getRequestDelay();
    setRequestTime();
    
    setTimeout(function() {
        setRequestTime();
        console.log((new Date()).getTime() + ': calling request.get');
        request.get({url:url, oauth:oauth}, function (e, r, body) {
            setRequestTime();
            if(e) {
                throw e;
            }
            // console.log('body: ');
            // console.log(body);
    
            if(url.indexOf('/json/') != -1) {
                try { 
                    callback(JSON.stringify(JSON.parse(body),null,2));
                } catch(e) {
                    callback(body);
                }
            } else {
                callback(body);
            }
        });
    },delay);

}

function getRequestDelay() {
    var now = (new Date()).getTime();
    var time_since_last_request = now - last_request_time;
    var delay = delay_between_requests_ms - time_since_last_request; 

    // set to minimum of one millisecond
    //
    if(delay < 1) {
        delay = 1;
    }
    console.log('delay: ' + delay);
    return delay;
}

function setRequestTime() {
    last_request_time = (new Date()).getTime();
}
