var url = require('url');
var querystring = require('querystring');
var unblocker = require('unblocker');
var express = require('express');
var auth = require('http-auth');

require('dotenv').config();

var basic = auth.basic({
        realm: "Private Area"
    }, (username, password, callback) => {
        callback(username === process.env.USER_NAME && password === process.env.USER_PASSW);
    }
);

basic.on('fail', (result, req) => {
  console.log(`User authentication failed: ${result.user}`);
});

basic.on('error', (error, req) => {
  console.log(`Authentication error: ${error.code + " - " + error.message}`);
});

const PORT = process.env.PORT || 5000;

var app = express();

var unblockerConfig = {
    prefix: '/proxy/'
};


app
  .use(auth.connect(basic))
  .use(unblocker(unblockerConfig))
  .use('/', express.static(__dirname + '/public'))
  .get( '/', (req, res) => res.send(`Welcome to private area - ${req.user}!`))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(unblockerConfig.prefix + site);
});

/*const express = require('express');
const auth = require('http-auth');

require('dotenv').config();

const basic = auth.basic({
        realm: "Private Area"
    }, (username, password, callback) => {
        callback(username === process.env.USER_NAME && password === process.env.USER_PASSW);
    }
);

basic.on('fail', (result, req) => {
  console.log(`User authentication failed: ${result.user}`);
});

basic.on('error', (error, req) => {
  console.log(`Authentication error: ${error.code + " - " + error.message}`);
});

const PORT = process.env.PORT || 5000;
 
express()
  .use(auth.connect(basic))
  .get('/', (req, res) => res.send(`Hello from express - ${req.user}!`))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));*/



