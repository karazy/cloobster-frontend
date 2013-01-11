/**
*	@name Cloobster.Services
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
CloobsterAdmin.services = angular.module('CloobsterAdmin.services', ["CloobsterAdmin.translations"]);

/** 
* 	@constructor
* 	Factory function for the 'lang' service.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*/
CloobsterAdmin.services.factory('lang', ['$log', 'translation', function($log, translation) {
	/**
	* @private
	* Retrieve browser language.
	*
	*/
	function getBrowserLang() {
		var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
		$log.info('browser language: '+userLang);
		if(userLang === 'undefined'|| userLang.length == 0) {
			//use default language
			userLang = "DE";
		}
		return userLang.substring(0,2).toUpperCase();
	}

	var browserLang = getBrowserLang();

	/**
	*	@name Cloobser.services.lang
	*
	*	Exposes methods for translation and language handling.
	*
	*	@author Frederik Reifschneider
	*/
	var langService = {
		/**
		* @name Cloobster.services.lang#get
		* 
		* Return Browser language.
		*/
		get: function() {
					return getBrowserLang();
		},
		/**
		* @name Cloobster.services.lang#translate
		* 
		* Get translation for given key.
		* @param key
		*		Key for string to translate
		*	@return
		*		Translated string.
		*/
		translate: function(key) {
				
				if(!key || !translation[key]) {
					return "";
				}

				return translation[key][browserLang] || "";
		}
	}

	return langService;
}]);

/** 
*   @constructor
*   Factory function for the 'loadingService' service.
*   Returns the service.
* 
*   @author Frederik Reifschneider
* @inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
CloobsterAdmin.services.factory('loadingService', function() {

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
CloobsterAdmin.services.factory('onStartInterceptor', ['loadingService', '$rootScope', function(loadingService, $rootScope) {
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
CloobsterAdmin.services.factory('onCompleteInterceptor', ['loadingService', '$rootScope','$q', function(loadingService, $rootScope, $q) {
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
