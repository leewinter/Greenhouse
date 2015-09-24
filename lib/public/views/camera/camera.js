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

    initialiseGrid();
  };
  var gridRows = 100;
  var gridColumns = 100;
  $scope.gridRows = [];

  function initialiseGrid() {
    for (var i = 0; i < gridRows; i++) {
      for (var j = 0; j < gridColumns; j++) {
        $scope.gridRows.push({
          column: j,
          row: i
        });
      }
    }
  };

  $scope.getNumber = function(num) {
    var newArray = new Array(num);
    return newArray;
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
