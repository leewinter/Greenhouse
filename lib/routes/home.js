(function(home) {
  'use strict';

  var parse = require('co-body'),
    Router = require('koa-router'),
    fs = require('co-fs'),
    router = new Router();

  home.init = function(app) {    

    //Get
    router.get('/', getIndex);

    app.use(router.routes());
  };

  var getIndex = function*(next) {
    this.body = yield fs.readFile('./lib/public/views/index.html', 'utf8');
  };

})(module.exports);
