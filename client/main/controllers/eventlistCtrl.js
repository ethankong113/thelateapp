'use strict';

angular.module('mainApp')
  .controller('eventlistController', ['$scope', '$http', function($scope, $http){
    var eventList = []
    $http.get('/geteventlist')
      .then(function(results){
        for (var i = 0; i < results.data.length; i++) {
          eventList.push(results.data[i])
        }
      })
      .then(function() {
        $scope.events = eventList
      })
  }])
