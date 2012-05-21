angular.module('Cloobster.services', ['ngResource']).
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

angular.module('Cloobster.services', []).
    factory('facebookApi', function() {
      var fbApiService; 
      fbApiService = {
        getName = function () {
          
        }
      }
      return fbApiService;
});