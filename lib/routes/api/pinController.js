(function(pinController) {
  'use strict';

  var Router = require('koa-router'),
    koaBody = require('koa-body')(),
    fs = require('co-fs'),
    gpio = require('../../db/gpio.js'),
    db = require('../../db/pinDb.js'),
    scheduler = require('../../scheduling/scheduler.js'),
    router = new Router({
      prefix: '/pin'
    });

  pinController.init = function(app) {
    // Get
    //router.get('/', getPins);
    router.get('/', getPin);

    // Post
    //router.post('/', koaBody, postPins);
    router.put('/', koaBody, putPin);

    // Register
    app.use(router.routes());
  };


  // Get methods
  var getPins = function*(next) {
      var result = yield db.getPins('rpi');

      this.body = result;
      this.status = 200;

      yield next;
    },
    getPin = function*(next) {

      if (this.request.query.pinNo && this.request.query.microController) {
        var result = yield db.getPin(this.request.query.microController, this.request.query.pinNo);
        this.body = result;
        this.status = 200;
      } else {
        this.body = 'querystring params, pinNo & microController, must be defined';
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
    },
    putPin = function*(next) {

      var postObject = this.request.body;

      if (postObject.pinObject && postObject.microController) {
        var result = yield db.updatePin(postObject.microController, postObject.pinObject);
        // Update events
        // yield scheduler.refreshJobs(postObject.microController);
        yield scheduler.refreshJobsForPin(postObject.microController, postObject.pinObject);
        this.body = result;
        this.status = 200;
      } else {
        this.body = 'params, pinObject & microController, must be defined';
        this.status = 400;
      }

      yield next;
    };

})(module.exports);
