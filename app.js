'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version'
])
.constant('API_URL', 'http://54.200.14.217/?/')
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
        when('/Search', {
            templateUrl: 'app/Views/Search.html',
            controller: ''
        }).
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
        when('/User/:userId', {
            templateUrl: 'app/Views/UserProfile.html',
            controller: 'UserController'
        }).
        when('/User-Account', {
            templateUrl: 'app/Views/UserAccount.html',
            controller: 'UserAccountController'
        }).
        otherwise({redirectTo: '/Home'});
}])

.value('sessionId', null)
.value('user', null)

.run(function($rootScope, $http, API_URL) {

  var prevId = Cookies.get('session');
  if(prevId) {
      $rootScope.sessionId = prevId;
      console.log("prevId exists");
      $http({
              method: 'POST',
              url: API_URL + 'user/getUserDetails',
              data: $.param({sessionId: $rootScope.sessionId}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
        }).then(function mySucces(data) {
                if(data.data.sessionId) {
                    $rootScope.sessionId = data.data.sessionId;
                    Cookies.set('session', data.data.sessionId, { expires: 3 });
                }
                $rootScope.loggedIn = true;
                $rootScope.user = data.data.user;
        }, function myError(response) {
            
        });
  } else {
      $rootScope.loggedIn = false;
      $rootScope.user = null;
  }
})

.controller('MainController', ['$scope', '$routeParams', '$http', 'API_URL', '$rootScope', '$location',
    function($scope, $routeParams, $http, API_URL, $rootScope, $location) {
      var mainController = this;
      $rootScope.searchString ="";

      mainController.logout = function() {
        $http({
              method: 'POST',
              url: API_URL + 'user/logout',
              data: $.param({sessionId: $rootScope.sessionId}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
        }).then(function mySucces(data) {
              if(200 == data.data.status) {
                  console.log(data);
                  $rootScope.loggedIn = false;
                  $rootScope.sessionId = null;
                  $rootScope.user = null;
                  Cookies.remove('session');
              } else {
                  window.alert('Error Logging Out');
              }
        }, function myError(response) {

        });
    };

    mainController.search = function(){
            $location.path("/BeerSearch");
    };
}])

.controller('UserController', ['$scope', '$routeParams', '$rootScope', '$http', 'API_URL',
  function($scope, $routeParams, $rootScope, $http, API_URL) {
      $http({
              method: 'POST',
              url: API_URL + 'user/getUser',
              data: $.param({userId: $routeParams.userId}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
        }).then(function mySucces(data) {
                if(200 == data.data.status) {
                    $scope.usernameText = data.data.user.User_name;
                    $scope.emailText = data.data.user.User_email;
                    $scope.locationText = data.data.user.User_location;
                    if(data.data.sessionId) {
                        $rootScope.sessionId = data.data.sessionId;
                        Cookies.set('session', data.data.sessionId, { expires: 3 });
                    }
                } else {
                  $('#mainView').html('<div class="row"><div class="col-xs-12 text-center"><h1>No User Found</h1></div></div>');
                }
        }, function myError(response) {

        });
  }])

.controller('CreateAccountController', ['$scope', '$rootScope', '$http', 'API_URL',
  function($scope, $rootScope, $http, API_URL) {
    var accountCreate = this;
 
    accountCreate.createAccount = function() {
      $http({
          method: 'POST',
          url: API_URL + 'user/createAccount',
          data: $.param({ userName: accountCreate.usernameText,
                          password: accountCreate.passwordText,
                          email: accountCreate.emailText,
                          location: accountCreate.locationText
                        }),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
    }).then(function mySucces(data) {
            if(200 == data.data.status) {
                $rootScope.user = data.data.user;
                $rootScope.loggedIn = true;
            } else {
                window.alert('Error: ' + data.data.details);
            }
            if(data.sessionId) {
                $rootScope.sessionId = data.data.sessionId;
                Cookies.set('session', data.data.sessionId, { expires: 3 });
            }
    }, function myError(response) {

    });
    };
}])

.controller('UserAccountController', ['$scope', '$rootScope', '$http', 'API_URL',
  function($scope, $rootScope, $http, API_URL) {
    var userAccount = this;

    $http({
          method: 'POST',
          url: API_URL + 'user/getUserDetails',
          data: $.param({sessionId: $rootScope.sessionId}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
    }).then(function mySucces(data) {
            console.log(data);
            $scope.usernameText = data.data.user.User_name;
            $scope.emailText = data.data.user.User_email;
            $scope.locationText = data.data.user.User_location;
            $rootScope.user = data.data.user;
            if(data.data.sessionId) {
                $rootScope.sessionId = data.data.sessionId;
                Cookies.set('session', data.data.sessionId, { expires: 3 });
            }
    }, function myError(response) {
        
    });

    userAccount.saveAccount = function() {
        console.log($rootScope.user);
    };
}])
 
 
.controller('LoginController', ['$scope', '$rootScope', '$http', 'API_URL',
  function($scope, $rootScope, $http, API_URL) {
    var login = this;
 
    login.login = function() {
      $http({
          method: 'POST',
          url: API_URL + 'user/login/',
          data: $.param({userName: login.usernameText, password: login.passwordText}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
    }).then(function mySucces(data) {
            if(200 == data.data.status) {
                $rootScope.user = data.data.user;
                $rootScope.loggedIn = true;
            } else {
                window.alert('Error: ' + data.data.details);
            }
            if(data.data.sessionId) {
                $rootScope.sessionId = data.data.sessionId;
                Cookies.set('session', data.data.sessionId, { expires: 3 });
            }
    }, function myError(response) {

    });
    };
}]);