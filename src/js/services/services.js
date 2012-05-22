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
      var loggedIn = false;
      $rootScope.fbLoggedIn = false;
      // listen for and handle auth.statusChange events
      FB.Event.subscribe('auth.statusChange', function(response) {
          if (response.authResponse) {
              $rootScope.$apply('fbLoggedIn = true');
              var uid = response.authResponse.userID;
              var accessToken = response.authResponse.accessToken;
            
            } else {
              $rootScope.$apply('fbLoggedIn = false');
            }
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
        //getLoggedIn : function () { return loggedIn.promise; },
        logout : function() { FB.logout(); },
        login : function() {
          loginDeferred = $q.defer();
          FB.login(function(response) {
            $rootScope.$apply(function() {
              if (response.authResponse) {
                loginDeferred.resolve();
            } else {
                loginDeferred.reject('user cancelled login');
            }  
            }); 
          }, {scope: 'email'});
          return loginDeferred.promise;
        }
      }
      return fbApiService;
}]);