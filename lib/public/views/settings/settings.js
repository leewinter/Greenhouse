'use strict';

angular.module('myApp.settings', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/settings', {
    templateUrl: 'views/settings/settings.html',
    controller: 'SettingsCtrl'
  });
}])

.controller('SettingsCtrl', ['$scope', '$http', 'microControllerFactory', 'pinFactory', function($scope, $http, microControllerFactory, pinFactory) {

  $scope.init = function() {
    $scope.eventOptions = [{
      eventName: 'Read'
    }, {
      eventName: 'Write'
    }];

    $scope.microControllerTypes = microControllerFactory.getMicroControllerTypes();

    resetNewEvent();

    $('.time_element').clockpicker({
      placement: 'bottom',
      align: 'left',
      autoclose: true,
      'default': 'now'
    });

    $(document).foundation({
      abide: {
        live_validate: true, // validate the form as you go
        validate_on_blur: true, // validate whenever you focus/blur on an input field
        focus_on_invalid: true, // automatically bring the focus to an invalid input field
        error_labels: true, // labels with a for="inputId" will recieve an `error` class
        // the amount of time Abide will take before it validates the form (in ms).
        // smaller time will result in faster validation
        timeout: 1000
      }
    });

  };

  $scope.loadMicroController = function() {
    //$http.get('/pin')
    microControllerFactory.getMicroController($scope.selectedMicroControllerType)
      .then(function(response) {
        console.log(response);
        $scope.microController = response.data;
      }, function(response) {
        console.log(response);
      });
  };

  function resetNewEvent() {
    $scope.newEvent = {
      type: $scope.eventOptions[1].eventName,
      typeConfig: 'on'
    };
  };

  function postPin(pin) {
    pinFactory.updatePin($scope.selectedMicroControllerType, pin)
      .then(function(response) {
        console.log(response);
        // Close modal
        jQuery('#myModal').foundation('reveal', 'close');
      }, function(response) {
        console.log(response);
      });
  };

  $scope.hasEvents = function(pin) {
    return pin.currentEvents && pin.currentEvents.length > 0 ? 'alert' : 'success';
  };

  $scope.removeEvent = function(event) {
    var index = $scope.currentEditPin.currentEvents.indexOf(event);
    $scope.currentEditPin.currentEvents.splice(index, 1);
    postPin($scope.currentEditPin);
  };

  $scope.editPin = function(pin) {
    $scope.currentEditPin = pin;
    jQuery('#myModal').foundation('reveal', 'open');
  };

  $scope.addEventToPin = function(pin) {
    if (!$scope.newEvent.name) {
      console.log('An event name is required ya muppet');
      return;
    }
    if (!$scope.newEvent.schedule) {
      console.log('An event scheduled time is required ya dafty');
      return;
    }

    if (pin.currentEvents) {
      var duplicateName = false;
      for (var i = 0; i < pin.currentEvents.length; i++) {
        if (pin.currentEvents[i].name === $scope.newEvent.name) {
          duplicateName = true;
        }
      }
      if (duplicateName) {
        console.log('That would be a duplicate event name for this pin ya idiot');
      } else {
        // Submit a pin update save
        pin.currentEvents.push($scope.newEvent);
        postPin(pin);
      }
    } else {
      // No events already so slap it in
      pin.currentEvents = [];
      pin.currentEvents.push($scope.newEvent);
      postPin(pin);
    }

    resetNewEvent();
  };

  $scope.init();

}]);
