'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
        when('/createAccount', {
            templateUrl: 'Views/UserCreation.html',
            controller: ''
        }).
        when('/login', {
            templateUrl: 'Views/Login.html',
            controller: ''
        }).
        otherwise({redirectTo: '/view1'});
}]);
