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

    initialiseGrid();
  };
  var gridRows = 100;
  var gridColumns = 100;
  $scope.gridRows = [];

  function initialiseGrid() {
    for (var i = 0; i < gridRows; i++) {
      var row = {row: i, columns: []};
      for (var j = 0; j < gridColumns; j++) {
        row.columns.push({column:j});
      }
      $scope.gridRows.push(row);
    }
  };

  $scope.goToGrid = function(row,column){
    $scope.horizontalPercentage = column;
    $scope.verticalPercentage = row;
    sendRequest();
  };

  function sendRequest() {
    if (!$scope.movementCalled) {
      console.log($scope.horizontalPercentage,$scope.verticalPercentage);
      socketIoService.emitAxisCoordinates(100 - $scope.horizontalPercentage, $scope.verticalPercentage);
      $scope.movementCalled = true;
      $timeout(function() {
        $scope.movementCalled = false;
      }, 50)
    }
  };

  $scope.init();

}]);
