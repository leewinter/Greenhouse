(function(socketIo) {
  var ioLibrary = require('../scheduling/ioLibrary.js');

  socketIo.init = function(http) {

      var io = require('socket.io')(http);

      io.on('connection', function(socket) {
        console.log('a user connected');

        // Camera axis changed
        socket.on('axisCoordinates', function(axisCoordinates) {
          console.log(axisCoordinates);
          ioLibrary.cameraAxis(axisCoordinates);
        });

        socket.on('disconnect', function() {
          console.log('user disconnected');
        });
      });

  };
})(module.exports)
