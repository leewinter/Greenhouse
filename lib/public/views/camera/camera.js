'use strict';

angular.module('myApp.camera', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/camera', {
    templateUrl: 'views/camera/camera.html',
    controller: 'CameraCtrl'
  });
}])

.controller('CameraCtrl', ['$scope', 'socketIoService', '$timeout', function($scope, socketIoService, $timeout) {

  $scope.init = function() {
    $(document).foundation({});

    $('#verticalSlider').on('change.fndtn.slider', function() {
      $scope.verticalPercentage = $('#verticalSlider').attr('data-slider');
      sendRequest();
    });

    $('#horizontalSlider').on('change.fndtn.slider', function() {
      $scope.horizontalPercentage = $('#horizontalSlider').attr('data-slider');
      sendRequest();
    });
  };

  function sendRequest() {
    if (!$scope.movementCalled) {
      socketIoService.emitAxisCoordinates(100 - $scope.horizontalPercentage, 100 - $scope.verticalPercentage);
      $scope.movementCalled = true;
      $timeout(function() {
        $scope.movementCalled = false;
      }, 50)
    }
  };

  $scope.init();

}]);
