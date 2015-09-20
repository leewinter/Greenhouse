(function() {
  'use strict';

  var env = require('node-env-file');
  env(__dirname + '/.env');

  var logger = require('koa-logger'),
    routes = require('./routes'),
    serve = require('koa-static'),
    koa = require('koa'),
    scheduler = require('./scheduling/scheduler'),
    app = koa(),
    co = require('co'),
    socketIo = require('./socketIo');

  co(function*() {
    yield scheduler.init();
  });

  if (app.env === 'development') {
    app.use(logger());
  }

  // Initialise any routes I may have
  routes.init(app);

  // Create static folders
  app.use(serve('lib/public'));
  app.use(serve('node_modules'));

  // Add socket IO
  var http = require('http').Server(app.callback());
  socketIo.init(http);

  function init(port) {
    port = port || process.env.HTTP_PORT || 9000;

    http.listen(port, function() {
      console.log('Server listening on port %s in %s mode', port, app.env);
    });
  };

  module.exports = {
    start: init
  };

})();
