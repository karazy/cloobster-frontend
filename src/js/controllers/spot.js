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
			barcode : "barcode001"
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


	$scope.loadSpot = function(spotItem) {
		$log.log("load spot " + spot.id);
		
		$scope.currentSpot = spotItem;

		//init sortable lists
		// jQuery( "#spotList" ).sortable({
		// 	// connectWith: ".connectedSortable",
		// 	items: 'li.sortable',
		// 	axis: "y",
		// 	update: function(event, ui) { 
		// 		$scope.updateMenuOrder(event, ui);
		// 	}
		// }).disableSelection();
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
		$scope.spots = $scope.spotsResource.query();
	};


	$scope.saveSpot = function() {		
		if($scope.currentSpot && $scope.currentSpot.id) {
			$log.log("update spot " + $scope.currentSpot.id);
			$scope.currentSpot.$update({"bid" : activeBusinessId});	
		} else {
			$log.log("save new spot");
			$scope.currentSpot.$save({"bid" : activeBusinessId});
			$scope.mspots.push($scope.currentSpot);
		}
	};

	$scope.createSpot = function() {
		$scope.currentSpot = new $scope.spotsResource(defaultSpot);
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