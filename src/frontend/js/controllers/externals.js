/** @module Cloobster/InfoPage */
'use strict';


/**
* 	@name Cloobster.Externals
*
* 	Controller for external Data ProvidersInfopage controller 
* 	@constructor
*/
Cloobster.Externals = function($scope, $routeParams, $http, $location, $log, lang, errorHandler, LocationConfiguration) {

	var baseFolder = 'partials/externals/';
	/**
	* List of all external providers.
	*/
	$scope.externals = [
		{
			name: lang.translate('externals.de.ztix.name'),
			template: baseFolder + 'de_ztix_config.html',
			id: 'de.ztix'
		}
		// {
		// 	name: lang.translate('externals.de.panoramafotobuch.name'),
		// 	template: baseFolder + 'de_panoramafotobuch_config.html',
		// 	id: 'de.panoramafotobuch'
		// }
	]
	/** LocationConfiguration Resource */
	$scope.locConfigResource = null;
	/** Selected {@link Cloobster.Externals#externals} */
	$scope.currentExternal = null;
	/** Active external configuration html template. */
	$scope.externalTemplate = null;
	/** Configuration on server */
	$scope.currentConfiguration = null;

	function init(businessId) {
		$scope.locConfigResource = LocationConfiguration.buildResource(businessId);
	}

	$scope.loadExternal = function(external) {

		if(!external) {
			$log.log('Cloobster.Externals.loadExternal: no external given');
			return;
		}

		$scope.currentExternal = external;

		loadConfiguration(external);


		function onSuccess(response) {
			$scope.externalTemplate = response;
			// $scope.$digest();
		}
	}

	function loadConfiguration(external) {
		if(!external) {
			$log.log('Cloobster.Externals.loadConfiguration: no external given');
			return;
		}

		$scope.currentConfiguration = $scope.locConfigResource.get({name: external.id}, onSuccess, onError);

		function onSuccess(response) {
			$scope.currentConfiguration = response;
		}

		function onError(_response, _status, _headers, _config) {
			if(_response.status == 404) {
				//create new configuration
				$scope.currentConfiguration = new $scope.locConfigResource();

				$scope.currentConfiguration.$update({name: external.id}, angular.noop, function(_response, _status, _headers, _config) {
					$scope.currentExternal = null;
					errorHandler(_response, _status, _headers, _config);
				});

			} else {
				errorHandler(_response, _status, _headers, _config);
				$scope.currentExternal = null;
			}
		}
	}

	$scope.saveConfiguration = function() {
		if(!$scope.currentConfiguration) {
			$log.log('Cloobster.Externals.saveConfiguration: no $scope.currentConfiguration exists');
			return;
		}

		$scope.currentConfiguration.$update({name: $scope.currentExternal.id} ,angular.noop, errorHandler);
	}

		/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			init(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});	

}

Cloobster.Externals.$inject = ['$scope', '$routeParams', '$http', '$location', '$log', 'lang', 'errorHandler', 'LocationConfiguration'];