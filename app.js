'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
        when('/Create-Account', {
            templateUrl: 'app/Views/UserCreation.html',
            controller: 'CreateAccountController'
        }).
        when('/Login', {
            templateUrl: 'app/Views/Login.html',
            controller: 'LoginController'
        }).
        when('/BeerSearch', {
            templateUrl: 'app/Views/BeerSearch.html',
            controller: 'beerController'
        }).
        when('/Home', {
            templateUrl: 'app/Views/Home.html',
            controller: ''
        }).
        when('/User-Account', {
            templateUrl: 'app/Views/UserAccount.html',
            controller: 'UserAccountController'
        }).
        otherwise({redirectTo: '/Home'});
}])

.value('sessionId', null)
.value('user', null)

.run(function($rootScope, $http) {

  //app util functions
  $rootScope.UTIL = {
 
    sendRequest: function(method, params, sendSession, callback) {
        $.ajax({
            url: "http://localhost/Boozr/API/?/" + method,
            type: "post",
            data: params,
            dataType: "json",
            success: function (data) {
                console.log(data);
                if(data.sessionId) {
                    $rootScope.sessionId = data.sessionId;
                    Cookies.set('session', data.sessionId, { expires: 3 });
                }
                if (callback) callback(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {

            }
        });
    }

  };

  var prevId = Cookies.get('session');
  if(prevId) {
      $rootScope.sessionId = prevId;
      console.log("prevId exists");
      $http({
              method: 'POST',
              url: 'http://localhost/Boozr/API/?/user/getUserDetails',
              data: "sessionId=" + $rootScope.sessionId,
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
        }).then(function mySucces(data) {
                $('#navbarLeftItems').html('<li><a href="#/User-Account">' + data.data.user.User_name + '</a></li><li><a ng-click="">Logout</a></li>');
        }, function myError(response) {
            
        });
  } else {

  }
})

.controller('CreateAccountController', function($scope, $rootScope) {
    var accountCreate = this;
 
    accountCreate.createAccount = function() {
      $scope.UTIL.sendRequest('User/createAccount', { userName: accountCreate.usernameText, 
                                                      password: accountCreate.passwordText, 
                                                      email: accountCreate.emailText, 
                                                      location: accountCreate.locationText
                                                    }, false,
          function(response) {
              if(200 == response.status) {
                  $('#navbarLeftItems').html('<li><a href="#/User-Account">' + accountCreate.usernameText + '</a></li>');
                  $rootScope.user = response.user;
              } else {
                  window.alert('Error: ' + response.details);
              }
          });
    };
})

.controller('UserAccountController', function($scope, $rootScope, $http) {
    var userAccount = this;

    $http({
          method: 'POST',
          url: 'http://localhost/Boozr/API/?/user/getUserDetails',
          data: "sessionId=" + $rootScope.sessionId,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
    }).then(function mySucces(data) {
            $scope.usernameText = data.data.user.User_name;
            $scope.emailText = data.data.user.User_email;
            $scope.locationText = data.data.user.User_location;
    }, function myError(response) {
        
    });

    userAccount.saveAccount = function() {
        console.log($rootScope.user);
    };
})
 
 
.controller('LoginController', function($scope, $rootScope) {
    var login = this;
 
    login.login = function() {
      $scope.UTIL.sendRequest('user/login', {userName: login.usernameText, password: login.passwordText}, false, function(response) {
          if(200 == response.status) {
              $('#navbarLeftItems').html('<li><a href="#/User-Account">' + login.usernameText + '</a></li>');
              $rootScope.user = response.user;
          } else {
              window.alert('Error: ' + response.details);
          }
      });
    };
});