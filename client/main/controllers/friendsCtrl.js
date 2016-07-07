'use strict';

angular.module('mainApp')
  .controller('friendsController', ['$scope', '$http', function($scope, $http){
    $scope.searchUsers = function(form){
      searchUsers(form)
    }

    $scope.someFunction = function(event, form) {
      if(event.keyCode === 13) {
        searchUsers(form)
      }
    }

    //the follow function will help you find users.
    var userList = []
    function searchUsers(form) {
      var query = form.keyword.$viewValue.toString()
      $http({
        url: '/searchusers',
        method: 'GET',
        params: {keyword: query}
      }).then(function(users){
        userList = []
        for (var i = 0; i < users.data.length; i++) {
          userList.push(users.data[i])
        }
      }).then(function(){
        console.log("checking: " + userList)
        if (userList.length===0) {
          $scope.message = "We couldn't find the user."
          $scope.users = []
        } else {
          $scope.message = null
          $scope.users = userList
          console.log(userList)
        }
      })
    }

    //this will hep you add a friend.
    $scope.addFriend = function(event) {
      var friendship = event.currentTarget.getAttribute("data-friendship")
      if (friendship === "false") {
        var friend = event.currentTarget.getAttribute("data-friend")
        console.log("Ok")
        $http.post('/addfriend', {
          friend: friend
        }).then(function(results) {
          //if we add a friend, we will update the friendship here.
          var friend = event.currentTarget.getAttribute("data-friend")
          for (var i=0; i < userList.length; i++) {
            if (userList[i].username===friend) {
              userList[i].friendship = true
              $scope.users = userList
            }
          }
        })
      }
    }

  }])
