# nodeunblocker.com
The original nodeunblocker.com is now gone, but you can grab the code and deploy your own copy

The majority of the code has been moved to a standalone library: [node-unblocker](https://github.com/nfriedly/node-unblocker)

## Running the website on your computer

Requires [node.js](http://nodejs.org/) >= 6
Then [download node-unblocker](https://github.com/nfriedly/node-unblocker/archive/master.zip),
`cd` into the `examples/nodeunblocker.com/` directory,
and run `npm install` to set things up.
Then run `npm start` to start the server. It should spawn a new instance for each CPU
core you have.

(Note: running `node app.js` *will not work*. The server code is in the [Gatling](https://npmjs.org/package/gatling)
package, which the `npm start` command calls automatically.)

## Running the website on heroku/bluemix/modulous/etc

This project should be runnable on a free [Heroku](http://www.heroku.com/) instance without
modification - just copy the `examples/nodeunblocker.com/` folder to a new git repo and push it.
