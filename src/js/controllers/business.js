/** @module Cloobster/Business */
'use strict';

/**
* 	@name Cloobster.Business
*	@requires facebookApi
*	@requires loginService
*
* 	Business controller 
* 	View and manage businesses such as restaurants.
* 	@constructor
*/
Cloobster.Business = function($scope, $http, loginService, Business, $log) {

	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	$scope.businesses = null;
	$scope.activeBusiness = null;

	/**
	* Returns all businesses
	*/
	$scope.loadBusinesses = function() {
		var account;

		if(!loggedIn) {
			$log.log('Not logged in! Failed to load business.');
			return;
		}

		account =  loginService.getAccount();

		$log.log('loadBusinesses for ' + account.id);
		$scope.businessResource = Business.buildResource(account.id).get();
		//load businesses
		$scope.businesses = $scope.businessResource.query();
	};

	/**
	* Deletes a business.
	* @param id
	* 	business to delete
	*/
	$scope.deleteBusiness = function(id) {
		$scope.businessResource.delete({'id' : id});
	};

	/**
	* Loads a complete business.
	* @param id
	* 	business to load
	*/
	$scope.loadBusiness = function(id) {
		$scope.activeBusiness = $scope.businessResource.get({'id' : id});
	};

	/** Watches loggedIn status and initializes controller when status changes to true.
	 *
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			loadBusinesses();
		}
	});


};

Cloobster.Registration.$inject = ['$scope', '$http', 'loginService', 'Business', '$log'];