const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

module.exports = (config) => {
  const app = express();

  // configure app to use bodyParser()
  // this will let us get the data from a POST
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // ROUTES
  routes(app);

  app.use((req, res, next) => {
    // catch 404 and forwarding to error handler
    const err = new Error('Not Found');
    err.status = 404;

    next(err);
  });

  // error handlers
  // development error handler
  if (config.env === 'dev' || config.env === 'local') {
    /* eslint no-unused-vars: ["off"] */
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err,
      });
    });
  }

  // production error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {},
    });
  });

  return app;
};
