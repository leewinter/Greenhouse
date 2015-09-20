(function(microControllerController) {
  // Welcome to the microController Controller roller :S
  'use strict';

  var Router = require('koa-router'),
    koaBody = require('koa-body')(),
    fs = require('co-fs'),
    gpio = require('../../db/gpio.js'),
    db = require('../../db/pinDb.js'),
    scheduler = require('../../scheduling/scheduler.js'),
    router = new Router({
      prefix: '/microController'
    });

  microControllerController.init = function(app) {
    // Get
    router.get('/', getMicroController);

    // Register
    app.use(router.routes());
  };

  // Get methods
  var getMicroController = function*(next) {

      if (this.request.query.microController) {
        var result = yield db.getPins(this.request.query.microController);

        this.body = result;
        this.status = 200;
      } else {
        this.body = 'querystring params, microController, must be defined';
        this.status = 400;
      }

      yield next;
    },
    // Post methods
    postPins = function*(next) {

      var postObject = this.request.body;

      var result = yield db.updatePins(postObject);
      // update events
      yield scheduler.refreshJobs();

      this.body = getBody(result);
      this.status = 200;

      yield next;
    };

})(module.exports);
