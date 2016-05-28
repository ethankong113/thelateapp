'use strict';

angular.module('mainApp', ['ngRoute'])
  .config(['$routeProvider', function($routeProvider){
    $routeProvider
      .when('/eventlist/', {
        templateUrl: "../main/templates/eventlist.html",
        controller: "eventlistController"
      })
      .when('/eventlist/:id', {
        templateUrl: "../main/templates/eventdetail.html",
        controller: "eventdetailController"
      })
      .when('/newevent/', {
        templateUrl: "../main/templates/newevent.html",
        controller: "neweventController"
      })
      .when('/friends/', {
        templateUrl: "../main/templates/friends.html",
        controller: "friendsController"
      })
      .when('/profile/', {
        template: "<h1>Hello World Again!</h1>"
      })
      .otherwise({
        redirectTo: '/eventlist/'
      })
  }])
