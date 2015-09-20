function microControllerFactory($http) {
  'use strict';

  var urlBase = '/microController';
  var microControllerFactory = {};

  microControllerFactory.getMicroControllerTypes = function() {
    // Spoof this data for now until we have a service for it
    // return $http.get(urlBase);
    return [{
      name: 'PI Rev 2 model B',
      value: 'pi_rev_2_model_b'
    }];
  };

  microControllerFactory.getMicroController = function(microController) {
    return $http.get(urlBase, {
      params: {
        microController: microController
      }
    });
  };

  return microControllerFactory;
};

angular.module('myApp')
  .factory('microControllerFactory', ['$http', microControllerFactory]);
