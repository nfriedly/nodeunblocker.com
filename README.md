# nodeunblocker.com
The original nodeunblocker.com is now gone, but you can grab the code and deploy your own copy.

The majority of the code has been moved to a standalone library: [node-unblocker](https://github.com/nfriedly/node-unblocker)

## Running the website on your computer

Requires [node.js](http://nodejs.org/) >= 6
Then [download the code](https://github.com/nfriedly/nodeunblocker.com/archive/master.zip), unzip it, open up a terminal/command line
`cd` into the directory,
and run `npm install` to set things up.
Then run `npm start` to start the server. It should spawn a new instance for each CPU core you have.

(Note: running `node app.js` *will not work*. The server code is in the [Gatling](https://npmjs.org/package/gatling)
package, which the `npm start` command calls automatically.)

## Running the website on Heroku/Bluemix/Azure/AWS/etc

This project should be runnable on a free [Heroku](http://www.heroku.com/) instance, as well as many other cloud providers, without
modification: clone/download the code and deploy it, or just click one of the buttons below.

[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nfriedly/nodeunblocker.com)
[![Deploy to Bluemix](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/nfriedly/nodeunblocker.com)
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)

