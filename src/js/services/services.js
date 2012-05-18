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