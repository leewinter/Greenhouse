function socketIoService() {
  'use strict';

  var socket = io();

  this.emitAxisCoordinates = function(horizontal, vertical) {
    if(horizontal == null || isNaN(horizontal)){
      horizontal = 50;
    }
    if(vertical == null || isNaN(vertical)){
      vertical = 50;
    }
    socket.emit('axisCoordinates', {
      horizontal: horizontal,
      vertical: vertical
    });
  };

};

angular.module('myApp')
  .service('socketIoService', [socketIoService]);
