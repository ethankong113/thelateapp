'use strict';

angular.module('mainApp')
  .controller('friendsController', ['$scope', '$http', function($scope, $http){
    $scope.searchFriends = function(form){
      searchFriends(form)
    }

    $scope.someFunction = function(event, form) {
      if(event.keyCode === 13) {
        searchFriends(form)
      }
    }

    function searchFriends(form) {
      var query = form.keyword.$viewValue
      var friendList = []
      $http({
        url: '/searchfriends',
        method: 'GET',
        params: {keyword: query}
      }).then(function(results){
        friendList = []
        for (var i = 0; i < results.data.length; i++) {
          friendList.push(results.data[i])
        }
      }).then(function(){
        console.log(friendList)
        $scope.friends = friendList
      })
    }

    $scope.addFriend = function($event) {
      var friendId = $event.currentTarget.getAttribute("data-friend-id")
      $http.post('/addfriend', {
        friendId: friendId
      }).then(function(results) {
        console.log(results)
      })
    }

  }])
