var url = require('url');
var querystring = require('querystring');
var express = require('express');
var unblocker = require('unblocker');
var Transform = require('stream').Transform;

// Authentication module.
/*var auth = require('http-auth');
var basic = auth.basic({
		realm: "Simon Area."
	}, (username, password, callback) => { 
	    // Custom authentication
	    // Use callback(error) if you want to throw async error.
		callback(username === "Tina" && password === "Bullock");
	}
);*/
// Setup server
var app = express();
var server = require('http').createServer(app);

var unblockerConfig = {
    prefix: '/proxy/',
    responseMiddleware: [
        googleAnalyticsMiddleware
    ]
};


//app.use(auth.connect(basic));

// this line must appear before any express.static calls (or anything else that sends responses)
app.use(unblocker(unblockerConfig));

// serve up static files *after* the proxy is run
app.use('/', express.static(__dirname + '/public'));


// this is for users who's form actually submitted due to JS being disabled or whatever
app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(unblockerConfig.prefix + site);
});

// Setup route.
app.get('/', (req, res) => {
    res.send(`Hello from express - ${req.user}!`);
});

// for compatibility with gatlin and other servers, export the app rather than passing it directly to http.createServer
module.exports = app;
