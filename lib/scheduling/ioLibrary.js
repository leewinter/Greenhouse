(function(ioLibrary) {
  'use strict';

  var five = require('johnny-five'),
    Raspi = null,
    rpiBoard = null,
    arduinoBoard = null;

  var pinCollection = [];

  var verticalServo = null;
  var horizontalServo = null;

  ioLibrary.init = function(pins) {
    try {
      // Try and create rpi board
      // Raspi = require('raspi-io');
      // rpiBoard = new five.Board({
      //   io: new Raspi()
      // });
      // rpiBoard.on("ready", function() {
      //   verticalServo = new five.Servo("P1-" + 24);
      //   horizontalServo = new five.Servo("P1-" + 26);
      // });
      arduinoBoard = new five.Board();
      arduinoBoard.on("ready", function() {
        // Register all pins here
        for (var i = 0; i < pins.length; i++) {
          if (pins[i].microController == 'arduino') {
            var obj = {
              microController: pins[i].microController,
              pin: pins[i].pin,
              configuredPin: ioLibrary.createPin(pins[i].type, pins[i].pin)
            };
            pinCollection.push(obj);
          }
        }
      });

      console.log('ioLibrary initialised');
    } catch (e) {
      console.log('Error during ioLibrary intilisation: ', e);
      if (e.message == 'Unable to parse revision information in /proc/cpuinfo') {
        console.log('Try running this code from an rpi instead?');
      }
    }
  };

  ioLibrary.createPin = function(type, pin) {
    switch (event.type) {
      case 'Write':
        console.log('Calling ', event.type);
        return write(pin);
        break;
      case 'Read':
        console.log('Calling ', event.type);
        return null;
        break;
      default:
        console.log('Event type not recognised ', event.type);
        return null;
    }
  };

  ioLibrary.cameraAxis = function(axis) {
    try {
      if (rpiBoard) {
        // Convert axis percentage to 180 arc
        verticalServo.to(axis.vertical * 1.8);
        horizontalServo.to(axis.horizontal * 1.8);
      } else {
        console.log('We dont seem to have a board to use so spoofing event call');
      }
    } catch (e) {
      console.log(e);
    }
  };

  ioLibrary.callEvent = function(microController, pin, event) {
    console.log('ioLibrary callEvent() ', pin.pin, event.name);
    try {
      if(microController == 'arduino' && !arduinoBoard){
        console.log('Ardunio board is not initiated');
        return;
      }

      for (var i = 0; i < pinCollection.length; i++) {
        if (pinCollection[i].microController == microController && pinCollection[i].pin == pin.pin) {
          switch (event.type) {
            case 'Write':
              if (event.typeConfig == 'on') {
                pinCollection[i].configuredPin.open();
              } else {
                pinCollection[i].configuredPin.close();
              }
              break;
            case 'Read':

              break;
            default:
              break;
          }
          break;
        }
      }

    } catch (e) {
      console.log(e);
    }
  };

  function write(pin) {
    // if (rpiBoard) {
    //
    // } else {
    //   console.log('We dont seem to have a board to use so spoofing event call');
    // }
    var relay = new five.Relay(pin);
    // if (typeConfig == 'on') {
    //   relay.open();
    // } else {
    //   relay.close();
    // }
    return relay;
  };

})(module.exports);
