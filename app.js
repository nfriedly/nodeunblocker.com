/***************
 * node-unblocker: Web Proxy for evading firewalls and content filters,
 * similar to CGIProxy or PHProxy
 *
 *
 * This project is hosted on github:  https://github.com/nfriedly/nodeunblocker.com
 *
 * By Nathan Friedly - http://nfriedly.com
 * Released under the terms of the Affero GPL v3
 */

var url = require('url');
var querystring = require('querystring');
var express = require('express');
var Unblocker = require('unblocker');
var Transform = require('stream').Transform;
var youtube = require('unblocker/examples/youtube/youtube.js')

var app = express();

var google_analytics_id = process.env.GA_ID || null;

function addGa(html) {
    if (google_analytics_id) {
        var ga = [
			"<!-- Google tag (gtag.js) -->",
			"<script async src=\"https://www.googletagmanager.com/gtag/js?id=" + google_analytics_id + "\"></script>",
			"<script>",
			"  window.dataLayer = window.dataLayer || [];",
			"  function gtag(){dataLayer.push(arguments);}",
			"  gtag('js', new Date());",
			"\n",
			"  gtag('config', " + google_analytics_id + ");",
			"</script>"
			].join("\n");
        html = html.replace("<head>", "<head>\n\n" + ga);
    }
    return html;
}

function googleAnalyticsMiddleware(data) {
    if (data.contentType == 'text/html') {

        // https://nodejs.org/api/stream.html#stream_transform
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                this.push(addGa(chunk.toString()));
                next();
            }
        }));
    }
}

function forceUpgrade(html) {
    var meta = [
		"<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">"
		].join("\n");
    html = html.replace("</head>", meta + "\n\n</head>");
    return html;
}

function forceHttpsUpgradeMiddleware(data) {
    if (data.contentType == 'text/html') {

        // https://nodejs.org/api/stream.html#stream_transform
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                this.push(forceUpgrade(chunk.toString()));
                next();
            }
        }));
    }
}

function tetrioPatch(html) {
    var meta = [
		"<meta http-equiv=\"Content-Security-Policy\" content=\"upgrade-insecure-requests\">"
		].join("\n");
    html = html.replace("<meta name=googlebot content=notranslate>", "<meta name=googlebot content=notranslate>\n\n" + meta);
    return html;
}

function tetrioPatchMiddleware(data) {
    if (data.contentType == 'text/html') {

        // https://nodejs.org/api/stream.html#stream_transform
        data.stream = data.stream.pipe(new Transform({
            decodeStrings: false,
            transform: function(chunk, encoding, next) {
                this.push(tetrioPatch(chunk.toString()));
                next();
            }
        }));
    }
}

var unblocker = new Unblocker({
    prefix: '/proxy/',
    requestMiddleware: [
        youtube.processRequest
    ],
    responseMiddleware: [
        googleAnalyticsMiddleware,
		tetrioPatch
    ]
});

// this line must appear before any express.static calls (or anything else that sends responses)
app.use(unblocker);

// serve up static files *after* the proxy is run
app.use('/', express.static(__dirname + '/public'));

// this is for users who's form actually submitted due to JS being disabled or whatever
app.get("/no-js", function(req, res) {
    // grab the "url" parameter from the querystring
    var site = querystring.parse(url.parse(req.url).query).url;
    // and redirect the user to /proxy/url
    res.redirect(unblockerConfig.prefix + site);
});

const port = process.env.PORT || process.env.VCAP_APP_PORT || 8080;

app.listen(port, function() {
    console.log(`node unblocker process listening at http://localhost:${port}/`);
}).on("upgrade", unblocker.onUpgrade); // onUpgrade handles websockets
