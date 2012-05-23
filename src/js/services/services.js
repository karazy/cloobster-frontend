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
  var fbApiService, 
      loggedIn = false,
      uid,
      accessToken;

  $rootScope.fbLoggedIn = false;
    // listen for and handle auth.statusChange events
    FB.Event.subscribe('auth.statusChange', function(response) {
      if (response.authResponse) {
        $rootScope.$apply('fbLoggedIn = true');
        uid = response.authResponse.userID;
        accessToken = response.authResponse.accessToken;

      } else {
        $rootScope.$apply('fbLoggedIn = false');
      }
    });
    
    fbApiService = {
      getUid : function () { return uid; },
      getAccessToken : function () { return accessToken; },
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
              uid = response.authResponse.userID;
              accessToken = response.authResponse.accessToken;
              $rootScope.fbLoggedIn = true;
              loginDeferred.resolve( response );
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

Cloobster.services.factory('config', ['$q','$rootScope', '$log', function($q, $rootScope, $log) {
    var config = { 
          serviceUrl : '',
          debug:  true
        };

     return config;
}]);

Cloobster.services.factory('login', ['$http','$q','$rootScope', '$log', 'config', function($http, $q, $rootScope, $log, configuration) {
  var loginService,
      loggedIn = false,
      account;
  $rootScope.loggedIn = false;

  loginService = {
      getAccount : function() {
          if( loggedIn === true) {
              return account;
          }
          else {
              return {};
          }
      },
      login : function(params) {
          if(angular.isObject(params)) {
            if(!angular.isString(params.login)) {
              $log.error('login parameter must be string');
            }
            if(!angular.isString(params.password)) {
              $log.error('password parameter must be string'); 
            }
          }
          else {
            $log.error('No login parameters given');
          }
          loginDeferred = $q.defer();
          $http.get( configuration.serviceUrl + '/accounts/login',
                    { headers: {'login' : params.login, 'password' : params.password } }).
                success(function(data, status, headers, config) {
                    //data should contain the account object for the login
                    account = data;
                    $rootScope.loggedIn = true;
                    loginDeferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    if(status == 401 || status == 403) {
                      $rootScope.loggedIn = false;
                      loginDeferred.reject('invalid login data');
                    }
                    else {
                      loginDeferred.reject('error during login'); 
                    }
                });
          return loginDeferred.promise;
      },
      loginFb : function(params) {
          if(angular.isObject(params)) {
            if(!angular.isString(params.uid)) {
              $log.error('uid parameter must be string');
            }
            if(!angular.isString(params.token)) {
              $log.error('token parameter must be string'); 
            }
          }
          else {
            $log.error('No login parameters given');
          }
          loginDeferred = $q.defer();
          $http.get( configuration.serviceUrl + '/accounts/loginfb',
                    { params: {'uid' : params.uid, 'token' : params.token } }).
                success(function(data, status, headers, config) {
                    //data should contain the account object for the login
                    account = data;
                    $rootScope.loggedIn = true;
                    loginDeferred.resolve(data);
                }).
                error(function(data, status, headers, config) {
                    if(status == 401 || status == 403) {
                      $rootScope.loggedIn = false;
                      loginDeferred.reject('invalid login data');
                    }
                    else {
                      loginDeferred.reject('error during login'); 
                    }
                });
          return loginDeferred.promise;
      }
  }
  return loginService;
}]);