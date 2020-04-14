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

var http = require('http');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var url = require('url');
var querystring = require('querystring');
var express = require('express');
var Unblocker = require('unblocker');
var Transform = require('stream').Transform;

var app = express();

var google_analytics_id = process.env.GA_ID || null;

function addGa(html) {
    if (google_analytics_id) {
        var ga = [
            "<script type=\"text/javascript\">",
            "var _gaq = []; // overwrite the existing one, if any",
            "_gaq.push(['_setAccount', '" + google_analytics_id + "']);",
            "_gaq.push(['_trackPageview']);",
            "(function() {",
            "  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;",
            "  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';",
            "  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);",
            "})();",
            "</script>"
            ].join("\n");
        html = html.replace("</body>", ga + "\n\n</body>");
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

var unblockerConfig = {
    prefix: '/proxy/',
    responseMiddleware: [
        googleAnalyticsMiddleware
    ]
};

var unblocker = Unblocker(unblockerConfig)

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

// start one process per cpu core + one master process
if (cluster.isMaster) {
    console.log('Master nodeunblocker.com process is running with pid', process.pid);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log('worker died, pid was', worker.process.pid);
        // start a new worker in 10 seconds, unless all workers are dead, then exit
        setTimeout(function() {
            if (numCPUs > 1 && Object.keys(cluster.workers).length > 0) {
                cluster.fork();
            } else {
                console.log('all workers have died, exiting');
                process.exit(code);
            }
        }, 10 * 1000);
    });
} else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    var server = http.createServer(app);

    server.listen(process.env.PORT || 3000);

    server.on('upgrade', unblocker.onUpgrade);

    console.log('nodeunblocker.com worker process started with pid', process.pid);
}