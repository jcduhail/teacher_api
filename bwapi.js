//const fs = require('fs');
const http = require('http');
const https = require('https');
const config = require('./config/config');
const App = require('./app/app');

// Start Klaud9 App
const app = App(config);

// START THE SERVER
const httpServer = http.createServer(app);

httpServer.listen(config.port);
console.log(`Server on port: ${config.port}`);

//Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
   /* res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);*/

    // Pass to next layer of middleware
    next();
});

// START THE SERVER HTTPS
/*if (config.privateKey !== '' && config.certificate !== '') {
  const privateKey = fs.readFileSync(config.privateKey, 'utf8');
  const certificate = fs.readFileSync(config.certificate, 'utf8');
  const credentials = {
    key: privateKey,
    cert: certificate,
  };

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(config.securePort);

  console.log(`Secure Server on port: ${config.securePort}`);
}*/
