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

var config = {
    prefix: '/proxy/',
    host: null,
    requestMiddleware: [],
    responseMiddleware: [],
    standardMiddleware: false,  // disables all built-in middleware
    processContentTypes: [
        'text/html',
        'application/xml+xhtml',
        'application/xhtml+xml'
    ]
}
 
var host = unblocker.host(config);
var referer = unblocker.referer(config);
var cookies = unblocker.cookies(config);
var hsts = unblocker.hsts(config);
var hpkp = unblocker.hpkp(config);
var csp = unblocker.csp(config);
var redirects = unblocker.redirects(config);
var decompress = unblocker.decompress(config);
var charsets = unblocker.charsets(config);
var urlPrefixer = unblocker.urlPrefixer(config);
var metaRobots = unblocker.metaRobots(config);
var contentLength = unblocker.contentLength(config);
 
config.requestMiddleware = [
    host,
    referer,
    decompress.handleRequest,
    cookies.handleRequest
    // custom requestMiddleware here
];
 
config.responseMiddleware = [
    hsts,
    hpkp,
    csp,
    redirects,
    decompress.handleResponse,
    charsets,
    urlPrefixer,
    cookies.handleResponse,
    metaRobots,
    // custom responseMiddleware here
    contentLength
];

app
  .use(auth.connect(basic))
  .use(unblocker(config))
  .use('/', express.static(__dirname + '/public'))
  .get('/', (req, res) => res.send(`Welcome to private area - ${req.user}!`));

app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(config.prefix + site);
});

//app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
module.exports = app;
