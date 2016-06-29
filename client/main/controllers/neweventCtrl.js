'use strict';

angular.module('mainApp')
  .controller('neweventController', ['$scope', '$http', function($scope, $http){

    $scope.resetForm = function() {
      $scope.eventtitle = ""
      $scope.eventtime = ""
      $scope.eventgraceperiod = ""
      $scope.eventlocation = ""
      guestlist = []
      $scope.guestlist = guestlist
    };

    $scope.searchFriends = function(form) {
      var friendList = []
      $http({
        url: '/getfriends',
        method: 'GET'
      }).then(function(results){
        console.log(results)
        friendList = []
        for (var i = 0; i < results.data.length; i++) {
          friendList.push(results.data[i])
        }
      }).then(function(){
        console.log(friendList)
        $scope.friends = friendList
      })
    };

    var guestlist = []
    $scope.clickEvent = function ($event) {
      for (var i=0; i < guestlist.length; i++){
        if (guestlist[i].guest == $event.currentTarget.getAttribute("data-friend-id")) {
          guestlist.splice(i,1)
        }
      }
      var newGuest = {
        guest:$event.currentTarget.getAttribute("data-friend-id"),
        status: 'Coming'
      }
      guestlist.push(newGuest)
      $scope.guestlist = guestlist
    };

    var statuslist = []
      $scope.submitForm = function(form) {
        console.log(guestlist)
        $http.post('/createevent', {
            title: form.title.$viewValue,
            date: form.date.$viewValue,
            time: form.time.$viewValue,
            graceperiod: form.graceperiod.$viewValue,
            location: form.location.$viewValue,
            guests: guestlist
        }).then(function(results){
          console.log(results)
        })
      };


  }])
