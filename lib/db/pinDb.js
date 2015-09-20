(function(pinDatastore) {
  'use strict';

  var Datastore = require('nedb'),
    wrap = require('co-nedb'),
    db = new Datastore({
      filename: './appData/datastores/pin.db',
      autoload: true
    }),
    pinDb = wrap(db),
    gpio = require('./gpio.js');
  db.persistence.compactDatafile();

  pinDatastore.getPins = function*(mController) {
    try {
      var result = yield pinDb.findOne({
        microController: mController
      });
      if (result) {
        return result;
      } else {
        // We must have nothing in the database. Slap the requested micro controller in
        var defaults = gpio.getPins(mController);
        var success = yield pinDatastore.postPins(defaults);
        if (success) {
          return defaults;
        } else {
          throw 'shit went wrong bro! couldnt insert default controller into db';
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  pinDatastore.getAllPins = function*() {
    try {
      var result = yield pinDb.find({});
      return result;
    } catch (e) {
      console.log(e);
    }
  };

  pinDatastore.postPins = function*(pins) {
    try {
      yield pinDb.insert(pins);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  pinDatastore.updatePins = function*(pins) {
    try {
      var result = yield pinDb.update({
        _id: pins._id
      }, pins, {});
      return yield pinDatastore.getPins(pins.microController);
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  pinDatastore.updatePin = function*(microController, pin) {
    try {
      var result = yield pinDatastore.getPins(microController);
      for (var i = 0; i < result.pins.length; i++) {
        if(result.pins[i].pin == pin.pin){
          result.pins[i] = pin;
        }
      }
      var updateResult = yield pinDb.update({
        microController: microController
      }, result, {});
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

})(module.exports);
