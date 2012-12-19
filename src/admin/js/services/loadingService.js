/** 
*   @constructor
*   Factory function for the 'loadingService' service.
*   Returns the service.
* 
*   @author Frederik Reifschneider
* @inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
CloobsterAdmin.module.factory('loadingService', function() {

  var service = {
    /**
  * @name Cloobster.services.loadingService#requestCount
  * 
  * Number of running requests.
  */
    requestCount: 0,
    /**
  * @name Cloobster.services.loadingService#isLoading
  * 
  * Indicates if a request is running.
  * @return true if requestCount > 0, false otherwise
  */
    isLoading: function() {
      return service.requestCount > 0;
    }
  };
  return service;
});

/** 
*   @constructor
*   Factory function for the 'onStartInterceptor' service.
*   Returns the service. Acts as an interceptor for http requests.
* Increases the requestCount of loadingService when a new request starts and sets $rootScope.ajaxLoading  
*
*   @author Frederik Reifschneider
* @inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
CloobsterAdmin.module.factory('onStartInterceptor', ['loadingService', '$rootScope', function(loadingService, $rootScope) {
  return function (data, headersGetter) {
    loadingService.requestCount++;
    $rootScope.ajaxLoading = loadingService.isLoading();
    return data;
  };
}]);

/** 
*   @constructor
*   Factory function for the 'onCompleteInterceptor' service.
*   Returns the service. Acts as an interceptor for http requests.
* Decreases the requestCount of loadingService when a new request starts and sets $rootScope.ajaxLoading 
* 
*   @author Frederik Reifschneider
* @inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
CloobsterAdmin.module.factory('onCompleteInterceptor', ['loadingService', '$rootScope','$q', function(loadingService, $rootScope, $q) {
    return function (promise) {
            return promise.then(function (response) {
              loadingService.requestCount--;
                $rootScope.ajaxLoading = loadingService.isLoading();
                return response;

            }, function (response) {
                loadingService.requestCount--;
                $rootScope.ajaxLoading = loadingService.isLoading();
                return $q.reject(response);
            });
    };
}]);

/**
* Add Cloobster.services.onCompleteInterceptor as $http interceptor.
*/
CloobsterAdmin.services.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('onCompleteInterceptor');
}]);

/**
* Add Cloobster.services.onStartInterceptor as $http transform method.
*/
CloobsterAdmin.services.run(['$http','onStartInterceptor',function($http, onStartInterceptor) {
  $http.defaults.transformRequest.push(onStartInterceptor);
}]);