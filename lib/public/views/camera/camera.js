'use strict';

angular.module('myApp.camera', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/camera', {
    templateUrl: 'views/camera/camera.html',
    controller: 'CameraCtrl'
  });
}])

.controller('CameraCtrl', ['$scope', 'socketIoService', function($scope, socketIoService) {

  $scope.init = function() {
    $(document).foundation({});

    $('#verticalSlider').on('change.fndtn.slider', function() {
      $scope.verticalPercentage = $('#verticalSlider').attr('data-slider');

      socketIoService.emitAxisCoordinates(100 - $scope.horizontalPercentage, 100 - $scope.verticalPercentage);
    });

    $('#horizontalSlider').on('change.fndtn.slider', function() {
      $scope.horizontalPercentage = $('#horizontalSlider').attr('data-slider');

      socketIoService.emitAxisCoordinates(100 - $scope.horizontalPercentage, 100 - $scope.verticalPercentage);
    });

  };

  $scope.init();

}]);
