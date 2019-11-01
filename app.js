var url = require('url');
var querystring = require('querystring');
var unblocker = require('unblocker');
var Transform = require('stream').Transform;
var express = require('express');
var auth = require('http-auth');

require('dotenv').config();

var basic = auth.basic({
        realm: "Private Area"
    }, (username, password, callback) => {
        callback(username === process.env.USER_NAME && password === process.env.USER_PASSW);
    }
);

const PORT = process.env.PORT || 5000;

var app = express();

var unblockerConfig = {
    prefix: '/proxy/'
};

// this line must appear before any express.static calls (or anything else that sends responses)
app.use(unblocker(unblockerConfig));

app
  .use(auth.connect(basic))
  .use('/', express.static(__dirname + '/public'))
  //.get('/', (req, res) => res.send(`Hello from express - ${req.user}!`))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


// this is for users who's form actually submitted due to JS being disabled or whatever
app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(unblockerConfig.prefix + site);
});

// serve up static files *after* the proxy is run
//app.use('/', express.static(__dirname + '/public'));
