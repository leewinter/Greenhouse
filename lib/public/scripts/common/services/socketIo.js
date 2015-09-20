function socketIoService() {
  'use strict';

  var socket = io();

  this.emitAxisCoordinates = function(horizontal, vertical) {
    socket.emit('axisCoordinates', {
      horizontal: horizontal || 50,
      vertical: vertical || 50
    });
  };

};

angular.module('myApp')
  .service('socketIoService', [socketIoService]);
