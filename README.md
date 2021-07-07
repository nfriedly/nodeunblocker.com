# nodeunblocker.com

Evade internet censorship!

The original nodeunblocker.com is gone, but it's now easier than ever to deploy your own copy.

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/nfriedly/nodeunblocker.com)
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/nfriedly/nodeunblocker.com)
[![Deploy to Bluemix](https://cloud.ibm.com/devops/setup/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/nfriedly/nodeunblocker.com)
[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://azuredeploy.net/)
[![Deploy to AWS](https://oneclick.amplifyapp.com/button.svg)](https://console.aws.amazon.com/amplify/home#/deploy?repo=https://github.com/nfriedly/nodeunblocker.com)

## Now with YouTube support (sort of)

I went ahead and activated the [youtube example](https://github.com/nfriedly/node-unblocker/blob/master/examples/youtube/youtube.js), it replaces youtube.com video pages with a custom page that just streams the video (but actually works). 

To disable it just add `//` to the beginning of [this line of code in app.js](https://github.com/nfriedly/nodeunblocker.com/blob/5355bbfa8cfe2b5d2e6e5aae41ea21936a3be9a5/app.js#L59) like so:

```js
//        youtube.processRequest
```

## Running the website on your computer

1. Install [node.js](http://nodejs.org/)
2. [Download the code](https://github.com/nfriedly/nodeunblocker.com/archive/master.zip)
3. Unzip it
4. Open up a terminal/command line
5. `cd` into the directory
6. Run `npm install` to grab the dependencies.
7. Run `npm start` to start the server. It should spawn a new instance for each CPU core you have.

(Note: running `node app.js` *will not work*. The server code is in the [Gatling](https://npmjs.org/package/gatling)
package, which the `npm start` command calls automatically.)

After that, it will be live on your computer and accessible from your computer at http://localhost:8080/ - accessing it from another computer is beyond the scope of this guide, but it is possible.

## Running the website on Heroku/Bluemix/Azure/AWS/etc

This project should be runnable without modification on a free [Heroku](http://www.heroku.com/) instance, as well as many other cloud providers. Clone/download the code and deploy it, or just click one of the buttons above.

# About the project

The the core of the nodeunblocker.com has been extracted into a [standalone library](https://github.com/nfriedly/node-unblocker) to make it more flexible, but everything you need to run the website is right here.

This project is released under the terms of the [GNU Affero General Public License version 3](https://www.gnu.org/licenses/agpl-3.0.html).

All source code is copyright [Nathan Friedly](http://nfriedly.com/).
