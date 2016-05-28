'use strict';

angular.module('mainApp')
  .controller('eventdetailController', ['$scope', '$http', '$location', function($scope, $http, $location){

    var eventId = $location.absUrl().split('eventlist/:')[1]
    var eventDetail = {}

    $http.get('/eventdetail/' + eventId)
      .then(function(results){
        console.log(results.data)
        $scope.detail = results.data
        $scope.detail.date = results.data.date.split('T')[0]
      })

    $scope.checkIn = function($event){
      console.log($event.currentTarget)
      console.log($event.currentTarget.id)
      $http.post('/checkin', {
        status: $event.currentTarget.id,
        eventId: eventId
      }).then(function(results){
        console.log("Receiving data from server.")
        for(var i=0; i < $scope.detail.guests.length; i++){
          if ($scope.detail.guests[i].name == results.data){
            $scope.detail.guests[i].status = $event.currentTarget.id
          }
        }
      })
    }

  }])
