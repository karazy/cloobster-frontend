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
    $rootScope.$on('fbInit', function (event) {
        FB.Event.subscribe('auth.statusChange', function(response) {
            if (response.authResponse) {
                $rootScope.$apply('fbLoggedIn = true');
                uid = response.authResponse.userID;
                accessToken = response.authResponse.accessToken;
            } else {
                $rootScope.$apply('fbLoggedIn = false');
            }
        });
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

Cloobster.services.factory('login', ['$window','$http','$q','$rootScope', '$log', 'config',
function($window, $http, $q, $rootScope, $log, configuration) {
  var loginService,
      loggedIn = false,
      account,
      loginDeferred,
      saveLogin = false;

  $rootScope.loggedIn = false;

  function loginSuccess (data, status, headers, config) {
    //data should contain the account object for the login
    account = data;
    loggedIn = true;
    $rootScope.loggedIn = true;
    if(saveLogin === true) {
        $window.localStorage['login'] = account.login;
        $window.localStorage['hash'] = account.passwordHash;
    }
    loginDeferred.resolve(data);
  }

  function loginError (data, status, headers, config) {
    if(status == 401 || status == 403) {
      $rootScope.loggedIn = false;
      loginDeferred.reject({message: 'invalid login data'});
      
      if($window.localStorage['login']) {
          saveLogin = false;

          $window.localStorage.removeItem('login');
          $window.localStorage.removeItem('hash');
      }
    }
    else if (status == 500) {
      // Server returns error object in body
      loginDeferred.reject(data);
    }
    else {
      loginDeferred.reject({message: 'error during login'}); 
    }
  }

  loginService = {
      confirmEmail: function (token) {
          loginDeferred = $q.defer();
          if( loggedIn === true) {
              $http.put( configuration.serviceUrl + '/b/accounts/emailconfirmation', {confirmationToken: token},
                    { headers: {'login' : account.login, 'passwordHash' : account.passwordHash } }).
                success(function (data) {
                    loginDeferred.resolve(data);
                }).error(loginError);
          }
          else {
              confirmDeferred.reject('account must be logged in');
          }
          return loginDeferred.promise;
      },
      getAccount : function() {
          if( loggedIn === true) {
              return account;
          }
          else {
              return {};
          }
      },
      existsSavedLogin: function() {
          if($window.localStorage['login'] && $window.localStorage['hash']) {
            return true;
          }
          else
            return false;
      },
      loginResume : function () {
          loginDeferred = $q.defer();

          if($window.localStorage['login']) {
              saveLogin = true;
              storedLogin = $window.localStorage['login'];
              storedHash = $window.localStorage['hash'];
              
              $http.get( configuration.serviceUrl + '/accounts/login',
                        { headers: {'login' : storedLogin, 'passwordHash' : storedHash } }).
                        success(loginSuccess).error(loginError);
              
          }
          else {
              loginDeferred.reject({message: 'no saved login found'}); 
          }
          return loginDeferred.promise;
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
          saveLogin = params.save;
          loginDeferred = $q.defer();
          $http.get( configuration.serviceUrl + '/accounts/login',
                    { headers: {'login' : params.login, 'password' : params.password } }).
                success(loginSuccess).error(loginError);
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
          saveLogin = params.save;
          loginDeferred = $q.defer();
          $http.get( configuration.serviceUrl + '/accounts/loginfb',
                    { params: {'uid' : params.uid, 'token' : params.token } }).
                success(loginSuccess).error(loginError);
          return loginDeferred.promise;
      },
      logout : function() {
          saveLogin = false;
          loggedIn = false;
          $rootScope.loggedIn = false;
          account = null;
          if($window.localStorage['login']) {
              $window.localStorage.removeItem('login');
              $window.localStorage.removeItem('hash');
          }
      }
  }
  return loginService;
}]);