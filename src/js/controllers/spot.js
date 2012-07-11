	/** @module Cloobster/Spot */
'use strict';

/**
* 	@name Cloobster.Spot
*	@requires loginService
*
* 	Spot controller 
* 	View and manage spots.
* 	@constructor
*/

Cloobster.Spot = function($scope, $http, $routeParams, $location, loginService, Business, Spot, langService, $log) {
		//default information when adding a new barcode
	var defaultSpot = {
			name: langService.translate("barcode.new.default.name") || "New table",
			barcode : "",
			qrImageUrl: null,
			active: true
		},
		//Id of active business
		activeBusinessId = null;

	/** Spot Resource. */
	$scope.spotsResource = null;
	/** Contains spots data. */
	$scope.spots = null;
	/** Currently selected spot. */
	$scope.currentSpot = null;
	/** Business to which these spots belong to. */
	$scope.activeBusiness = null;
	/** error flag */
	$scope.error = false;
	/** error message */
	$scope.errorMessage = "";

	/**
	* Set error false and hide the error box.
	*/
	$scope.hideError = function() {
		$scope.error = false;
	};

	/**
	*	Callback for errors during Resource methods.(get,save,query, etc.).
	*	
	*	@private
	*	@param {Object} response Object containing response and request data of the failed HTTP request.
	*/
	function handleError(response) {
		$scope.error = true;
		$scope.errorMessage = (response.data.hasOwnProperty('message') && response.data.message ?

			response.data.message
			: langService.translate('common.error.'+ response.status));
		if(!$scope.errorMessage) {
			// Translate a generic error message
			$scope.errorMessage = langService.translate('common.error')|| "Error during communication with service.";
		}
		// Log the response.
		$log.error("Error during resource method, response data: " + angular.toJson(response));
	};


	$scope.loadSpot = function(spotItem) {
		$log.log("load spot " + spotItem.id);
		
		$scope.currentSpot = spotItem;
	};

	/**
	* 
	*/
	$scope.loadSpots = function(businessId) {
		$log.log("load spots for business " + businessId);
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load spots.');
			return;
		}

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		//create spots resource
		$scope.spotsResource = Spot.buildResource(activeBusinessId);

		//load spots
		$scope.spots = $scope.spotsResource.query(
			function() { 
				//success
			},
			function(request) {
				//error			
				if(request.status = 404) {
					$scope.error = true;
					$scope.errorMessage = "Could not lot spots.";
				}
			}
		);
	};


	$scope.saveSpot = function() {		
		if($scope.currentSpot && $scope.currentSpot.id) {
			$log.log("update spot " + $scope.currentSpot.id);
			$scope.currentSpot.$update(
				function() { 
					//success
				},
				function(request) {
					//error			
					$scope.error = true;
					$scope.errorMessage = "Could not update spot. Status " + request.status;
				}
			);	
		} else {
			$log.log("save new spot");
			$scope.currentSpot.$save(
				function() { 
					//success
				},
				function(request) {
					//error			
					$scope.error = true;
					$scope.errorMessage = "Could not save spot. Status " + request.status;
				}
			);
			$scope.spots.push($scope.currentSpot);
		}
	};

	$scope.createSpot = function() {
		var newSpot = angular.copy(defaultSpot);

		// defaultSpot.barcode = generateDummyBarcode();

		$scope.currentSpot = new $scope.spotsResource(defaultSpot);
	}

	$scope.deleteSpot = function(spotToDelete) {
		spotToDelete.$delete(angular.noop, handleError);
		$scope.currentSpot = null;
	}


	function generateDummyBarcode() {
		var prefix = activeBusinessId || "barcode",
			suffix = "1";

			if($scope.spots) {
				suffix = $scope.spots.length;
			}
			
			return prefix + "-" + suffix;
	}


	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var spotId = $routeParams.spotId || "",
			businessId = $routeParams.businessId || "";

		if(newVal == true && businessId) {
			//load pots
			$scope.loadSpots(businessId);	
		}

	});	


}

Cloobster.Spot.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Spot', 'lang', '$log'];