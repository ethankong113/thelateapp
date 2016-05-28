'use strict';

angular.module('mainApp')
  .controller('friendsController', ['$scope', '$http', function($scope, $http){
    $scope.searchFriends = function(form) {
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
        $scope.friends = friendList
      })
    }

  }])
