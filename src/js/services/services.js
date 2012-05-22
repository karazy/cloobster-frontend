Cloobster.services = angular.module('Cloobster.services', ['ngResource']).
    factory('Account', function($resource) {
      var Account = $resource('/b/accounts/:id',
          //params
          {
            
          },
          //additional actions
          {
            register: { method: 'POST' }
          }
      );
 
      return Account;
});

Cloobster.services.
    factory('facebookApi', ['$q','$rootScope', function($q, $rootScope) {
      var fbApiService; 
      var loggedIn = $q.defer();
      // listen for and handle auth.statusChange events
      FB.Event.subscribe('auth.statusChange', function(response) {
          $rootScope.$apply(function() {
            if (response.authResponse) {
              loggedIn.resolve(true);
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
            
            } else {
              loggedIn.resolve(false);
            }
          })
        });
      
      fbApiService = {
        getUser : function () {
          var userDeferred = $q.defer();
          FB.api('/me', function(user) {
            $rootScope.$apply(function() {
              userDeferred.resolve(user);
            });
          });
          return userDeferred.promise;
        },
        getLoggedIn : function () { return loggedIn.promise; },
        logout : function() { FB.logout(); }
      }
      return fbApiService;
}]);