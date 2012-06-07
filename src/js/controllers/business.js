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
Cloobster.Business = function($scope, $http, $routeParams, loginService, Business, $log) {

	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	$scope.businesses = null;
	$scope.activeBusiness = null;

	/** When true user can edit the business profile. */
	$scope.editMode = false;

	/**
	* Returns all businesses
	*/
	$scope.loadBusinesses = function() {
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load business.');
			return;
		}

		account =  loginService.getAccount();

		$log.log('loadBusinesses for ' + account.id);
		$scope.businessResource = Business.buildResource(account.id);
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

	/**
	* Switches between view and edit mode.
	*/
	$scope.toggleEditMode = function() {
		$scope.editMode = !$scope.editMode;
	}

	/** Watches loggedIn status and initializes controller when status changes to true.
	 *
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			$scope.loadBusinesses();

			//load business details
			if($routeParams && $routeParams.id) {
				$scope.loadBusiness($routeParams.id);
			}
		}
	});

	/**
	*
	*/
	(function init() {


	})();


};

Cloobster.Business.$inject = ['$scope', '$http','$routeParams', 'login', 'Business', '$log'];