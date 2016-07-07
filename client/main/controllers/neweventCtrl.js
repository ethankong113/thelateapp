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
        if (guestlist[i].guest == $event.currentTarget.getAttribute("data-friend")) {
          guestlist.splice(i,1)
        }
      }
      var newGuest = {
        guest:$event.currentTarget.getAttribute("data-friend"),
        status: 'Coming'
      }
      guestlist.push(newGuest)
      $scope.guestlist = guestlist
    };

    var statuslist = []
      $scope.submitForm = function(form) {
        var time =  turnToMinute(form.time.$viewValue)

        console.log("Date: " + typeof(form.date.$viewValue))
        console.log(form.date.$viewValue)
        console.log(form.graceperiod.$viewValue)

        console.log("GracePeriod: " + typeof(form.graceperiod.$viewValue))
        /*
        $http.post('/createevent', {
            title: form.title.$viewValue,
            date: form.date.$viewValue,
            time: form.time.$viewValue,
            graceperiod: form.graceperiod.$viewValue,
            location: form.location.$viewValue,
            guests: guestlist
        }).then(function(results){
          console.log(results)
        })*/
      };

    function turnToMinute(time) {
      var minute = parseInt(time.slice(3,5))
      var hour = parseInt(time.slice(0,2))
      var eventTime = hour*60 + minute
      return eventTime;
    }

    function turnToTime(time) {
      var min = time%60
      var hr = Math.floor(time/60)
      var minute
      var hour
      if (min < 10) {
        minute = "0" + min.toString()
      } else if (min>=10) {
        minute = min.toString()
      }
      if (hr < 10) {
        hour = "0" + hr.toString()
      } else if (hr >= 10) {
        hour = hr.toString()
      }
      var eventTime = hour + ":" + minute
      return eventTime;
    }

  }])
