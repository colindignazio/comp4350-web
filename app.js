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
            controller: 'SearchController'
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
        when('/TopDrinks', {
            templateUrl: 'app/Views/TopDrinks.html',
            controller: 'TopDrinksController'
        }).
        when('/Feed', {
            templateUrl: 'app/Views/Feed.html',
            controller: 'FeedController'
        }).
        when('/BeerPage/:beerId', {
            templateUrl: 'app/Views/BeerPage.html',
            controller: 'BeerPageController'
        }).
        otherwise({redirectTo: '/Home'});
}])

.value('sessionId', null)
.value('user', null)

.run(function($rootScope, $http, API_URL) {

  var prevId = Cookies.get('session');
  if(prevId) {
      $rootScope.sessionId = prevId;
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

.controller('FeedController', ['$scope', '$routeParams', '$rootScope', '$http', 'API_URL',
  function($scope, $routeParams, $rootScope, $http, API_URL) {

      var feedController = this;

      feedController.reviews = [];

      $http({
            method: 'POST',
            url: API_URL + 'follow/getRecentReviewsSession',
            data: $.param({sessionId: $rootScope.sessionId}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'json'
      }).then(function mySucces(data) {
              if(data.data.status == 200) {
                feedController.reviews = data.data.details;
              }
      }, function myError(response) {

      });
  }])

.controller('UserController', ['$scope', '$routeParams', '$rootScope', '$http', 'API_URL',
  function($scope, $routeParams, $rootScope, $http, API_URL) {

      var userController = this;
      var validUser = false;

      userController.reviews = [];
      userController.followed = false;

      $http({
              method: 'POST',
              url: API_URL + 'user/getUser',
              data: $.param({userId: $routeParams.userId}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
        }).then(function mySucces(data) {
                validUser = (200 == data.data.status);
                if(validUser) {
                    $scope.usernameText = data.data.user.User_name;
                    $scope.emailText = data.data.user.User_email;
                    $scope.locationText = data.data.user.User_location;
                    userController.reviews = data.data.user.reviews;
                    if(data.data.sessionId) {
                        $rootScope.sessionId = data.data.sessionId;
                        Cookies.set('session', data.data.sessionId, { expires: 3 });
                    }
                } else {
                  $('#mainView').html('<div class="row"><div class="col-xs-12 text-center"><h1>No User Found</h1></div></div>');
                }
        }, function myError(response) {

      });

      userController.follow = function() {
        $http({
          method: 'POST',
          url: API_URL + 'follow/followUser',
          data: $.param({sessionId: $rootScope.sessionId, followeeId: $routeParams.userId}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
        }).then(function mySucces(data) {
            userController.followed = true;
        }, function myError(response) {
        });
      };

      userController.unfollow = function() {
        $http({
          method: 'POST',
          url: API_URL + 'follow/unfollowUser',
          data: $.param({sessionId: $rootScope.sessionId, followeeId: $routeParams.userId}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
        }).then(function mySucces(data) {
            userController.followed = false;
        }, function myError(response) {
        });
      };

      userController.viewBeer = function(beerId) {
          $location.path('/BeerPage/' + beerId);
      };

      $http({
          method: 'POST',
          url: API_URL + 'follow/isUserFollowed',
          data: $.param({sessionId: $rootScope.sessionId, followeeId: $routeParams.userId}),
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          responseType: 'json'
      }).then(function mySucces(data) {
          if(200 == data.data.status) {
            userController.followed = data.data.details;
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
    };
}])
.controller('SearchController', ['$scope', '$rootScope', '$http', 'API_URL', '$location',
  function($scope, $rootScope, $http, API_URL, $location) {
    var search = this;
    search.sortType     = 'Name'; // set the default sort type
    search.sortReverse  = false;  // set the default sort order
    search.searchBeer   = '';     // set the default search/filter term
    search.beerPrompt = "Search name, brewery or type";
    search.userPrompt = "Search username, email or location";
    search.placeHolder = search.beerPrompt;

    search.userResults = [];
    search.beerResults = [];
    search.advancedBeerResults = [];
    search.showSimple = true;
    search.searchTab = "beer";// beer, user, advanced
    search.searchType = "Beer";
    search.beerName = "";
    search.beerType = "";
    search.brewery = "";
    search.minPrice = "";
    search.maxPrice = "";
    search.minRating = "";
    search.maxRating = "";
    search.beerContent ="";

    function inListCheck(list, item){
      var isInList = false;
      for(var j in list){
        if(list[j].Beer_id == item.Beer_id)
          isInList = true;
      }
      return isInList;
    }


      search.loadPage = function(beerPage){
          $rootScope.lastBeer = beerPage.Beer_id;
          $location.path('/BeerPage/' + beerPage.Beer_id);
      }

      search.loadUser = function(userPage) {
          $location.path('/User/' + userPage.User_id);
      }

      search.advancedSearch = function() {
          $http({
              method: 'POST',
              url: API_URL + 'Beer/advancedSearch/',
              data: $.param({beerName: search.beerName,
                  beerType: search.beerType,
                  brewery: search.brewery,
                  minPrice: search.minPrice,
                  maxPrice: search.maxPrice,
                  minRating: search.minRating,
                  maxRating: search.maxRating,
                  beerContent: search.beerContent}),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              responseType: 'json'
          }).then(function mySucces(data) {
              if(200 == data.data.status) {
                  search.advancedBeerResults = data.data.searchResults;
              } else {
                  window.alert('Error: ' + data.data.details);
              }
          }, function myError(response) {
          });
      };


 
    search.search = function() {
      if(search.searchType=='User') {
          //Search user database
          $http({
                method: 'POST',
                url: API_URL + 'user/search/',
                data: $.param({searchToken: search.searchToken}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json'
          }).then(function mySucces(data) {
                  if(200 == data.data.status) {
                        search.userResults = data.data.searchResults;
                  } else {
                      window.alert('Error: ' + data.data.details);
                  }
                
          }, function myError(response) {

          });
      } else if(search.searchType=='Beer') {
            //Search the beverages
            $http({
                method: 'POST',
                url: API_URL + 'Beer/search/',
                data: $.param({searchToken: search.searchToken}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json'
          }).then(function mySucces(data) {
            if(200 == data.data.status) {
              search.beerResults = data.data.searchResults;
              } else {
                      window.alert('Error: ' + data.data.details);
              }
          }, function myError(response) {

          });
      } else {
        window.alert('Please select either beers or users to search');
      }
    
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
}])

.controller('TopDrinksController', ['$scope', '$rootScope', '$http', 'API_URL', '$location',
    function($scope, $rootScope, $http, API_URL, $location) {
        var topDrinks = this;
        topDrinks.topResults = [];
            $http({
                method: 'GET',
                url: API_URL + 'beer/getTopDrinks',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json'
            }).then(function mySucces(data) {
                if(200 == data.data.status) {
                    topDrinks.topResults = data.data.results;
                } else {
                    window.alert('Error: ' + data.data.details);
                }
            }, function myError(response) {

            });
        topDrinks.loadPage = function(beerPage){
            $rootScope.lastBeer = beerPage.Beer_id;
            $location.path('/BeerPage/' + beerPage.Beer_id);
        }
    }])
.controller('BeerPageController', ['$scope', '$rootScope', '$http', 'API_URL', '$routeParams', 
    function($scope, $rootScope, $http, API_URL, $routeParams) {
        var beer = this;
        beer.beer_id = $routeParams.beerId;
        beer.reviews = [];

        $http({
            method: 'POST',
            url: API_URL + 'beer/searchById',
            data: $.param({beverage_id: beer.beer_id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'json'
        }).then(function mySucces(data) {
            if(200 == data.data.status) {
                beer.beerObject = data.data.results;
            } else {
                window.alert('Error: ' + data.data.details);
            }
        }, function myError(response) {

        });

        $http({
            method: 'POST',
            url: API_URL + 'BeerReview/getSpecificBeerReviews',
            data: $.param({beer_id: beer.beer_id}),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            responseType: 'json'
        }).then(function mySucces(data) {
            if(200 == data.data.status) {
                beer.reviews = data.data.results;
            } else {
               window.alert('Error: ' + data.data.details);
            }
        }, function myError(response) {

        });
        beer.newReviewStars = null;
        beer.leaveReview = function(){
            if($rootScope.loggedIn == false){
                window.alert("You must be logged in to leave a review!");
                return;
            }
            if(beer.newReviewStars == null){
                window.alert("You must assign a star rating!");
                return;
            }
            //window.alert("User: "  +$rootScope.user.User_id + "\nBeerID: " + beer.beer_id + "\nStars: " + beer.newReviewStars + "\nReview: " + beer.newReview);
            $http({
                method: 'POST',
                url: API_URL + 'BeerReview/create',
                data: $.param({user_id: $rootScope.user.User_id, beer_id: beer.beer_id, stars: beer.newReviewStars, review: beer.newReview, price: beer.pricePaid, storeName: beer.storeName, storeAddress: beer.storeAddress}),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                responseType: 'json'
            }).then(function mySucces(data) {
                if(200 == data.status) {
                    //window.alert("Review left successfully!");
                    //At some point make this so it doesn't require a page reload
                } else {
                    window.alert('Error: ' + data.data.details);
                }
            }, function myError(response) {

            });
        }

    }]);