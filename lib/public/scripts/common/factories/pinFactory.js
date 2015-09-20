function pinFactory($http) {
  'use strict';

  var urlBase = '/pin';
  var pinFactory = {};

  pinFactory.getPin = function(microController, pinNo) {
    return $http.get(urlBase, {
      params: {
        microController: microController,
        pinNo: pinNo
      }
    });
  };

  pinFactory.updatePin = function(microController, pinObject) {
    return $http.put(urlBase, {
      microController: microController,
      pinObject: pinObject
    });
  }

  return pinFactory;
};

angular.module('myApp')
  .factory('pinFactory', ['$http', pinFactory]);
