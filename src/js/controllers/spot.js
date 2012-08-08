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

Cloobster.Spot = function($scope, $http, $routeParams, $location, loginService, Business, Area, Spot, Menu, langService, $log, handleError) {
		//default information when adding a new barcode
	var defaultSpot = {
			name: langService.translate("barcode.new.default.name") || "New Spot",
			barcode : "",
			qrImageUrl: null,
			active: true
		},
		defaultArea = {
			name: langService.translate("area.new.default.name") || "My Service Area",
			active: true
		},
		//Id of active business
		activeBusinessId = null;

	/** Area resource. */
	$scope.areasResource = null;
	/** Spot resource. */
	$scope.spotsResource = null;
	/** Menu resource.*/
	$scope.menusResource = null;
	/** Spots assigned to current area. */
	$scope.spots = null;
	/** Areas assigned*/
	$scope.areas = null;
	/** Currently selected area. */
	$scope.currentArea = null;
	/** Currently selected spot. */
	$scope.currentSpot = null;
	/** Business to which these spots belong to. */
	$scope.activeBusiness = null;

	//Drag&Drop for menus assignment
	jQuery( "#assignedMenusList, #allMenusList" ).sortable({
		connectWith: ".organizable-list",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "sortable-placeholder",
		receive: function(event, ui) { 
			$scope.moveMenu(event, ui);
		}
	}).disableSelection();


	// areas start
	$scope.loadAreas = function(businessId) {
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load areas.');
			return;
		}

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		//create areas resource
		$scope.areasResource = Area.buildResource(activeBusinessId);
		//create spots resource
		$scope.spotsResource = Spot.buildResource(activeBusinessId);
		//create menu resource
		$scope.menusResource = Menu.buildResource(activeBusinessId);
		//only load menus once
		$scope.menus = $scope.menusResource.query(angular.noop, handleError);	

		//load spots
		$scope.areas = $scope.areasResource.query(
			function() { 
				//success
			},
			function(request) {
				//error			
				if(request.status = 404) {
					$scope.error = true;
					$scope.errorMessage = "Could not lot areas.";
				}
			}
		);

		manageViewHiearchy("areas");
	};

	$scope.loadArea = function(areaItem) {
		manageViewHiearchy("area");
		$scope.currentArea = areaItem;
		$scope.spots = $scope.spotsResource.query({"areaId" : areaItem.id}, null, null, handleError);		
		if(!$scope.currentArea.menuIds) {
			$scope.currentArea.menuIds = new Array();
		}		
	};

	$scope.createArea = function() {
		var newArea = angular.copy(defaultArea);
		$scope.currentArea = new $scope.areasResource(newArea);
		$scope.spots = new Array();
		manageViewHiearchy("area");
	};

	$scope.saveArea = function() {
		if($scope.currentArea && $scope.currentArea.id) {
			$log.log("update area " + $scope.currentArea.id);
			$scope.currentArea.$update(angular.noop, handleError);
		} else {
			$log.log("save new area");
			$scope.currentArea.$save(
				function() { 
					$scope.areas.push($scope.currentArea);
				},
				// Error callback
				handleError
			);
		}
	};

	$scope.deleteArea = function(areaToDelete) {
		manageViewHiearchy("areas");

		// spotToDelete.$delete(angular.noop, handleError);

		// angular.forEach($scope.spots, function(spot, index) {
		// 	if(spot.id == $scope.currentSpot.id) {
		// 		$scope.spots.splice(index, 1);
		// 		//exit loop
		// 		return;
		// 	}
		// });

		// $scope.currentSpot = null;
	};


	//areas end

	/**
	* 
	*/
	// $scope.loadSpots = function(businessId) {
	// 	$log.log("load spots for business " + businessId);
	// 	var account;

	// 	if(!$scope.loggedIn) {
	// 		$log.log('Not logged in! Failed to load spots.');
	// 		return;
	// 	}

	// 	activeBusinessId = businessId;

	// 	account =  loginService.getAccount();

	// 	$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

	// 	//create spots resource
	// 	$scope.spotsResource = Spot.buildResource(activeBusinessId);

	// 	//load spots
	// 	$scope.spots = $scope.spotsResource.query(
	// 		function() { 
	// 			//success
	// 		},
	// 		function(request) {
	// 			//error			
	// 			if(request.status = 404) {
	// 				$scope.error = true;
	// 				$scope.errorMessage = "Could not lot spots.";
	// 			}
	// 		}
	// 	);
	// };

	//start spots

	$scope.loadSpot = function(spotItem) {
		$log.log("load spot " + spotItem.id);
		
		$scope.currentSpot = spotItem;
		manageViewHiearchy("spot");
	};


	$scope.saveSpot = function() {		
		if($scope.currentSpot && $scope.currentSpot.id) {
			$log.log("update spot " + $scope.currentSpot.id);
			$scope.currentSpot.$update(angular.noop, handleError);
		} else {
			$log.log("save new spot");
			$scope.currentSpot.$save(
				function() { 
					$scope.spots.push($scope.currentSpot);
				},
				// Error callback
				handleError
			);
		}
	};

	$scope.createSpot = function() {
		var newSpot = angular.copy(defaultSpot);
		$scope.currentSpot = new $scope.spotsResource(defaultSpot);
		$scope.currentSpot.areaId = $scope.currentArea.id;
		manageViewHiearchy("spot");
	}

	$scope.deleteSpot = function(spotToDelete) {
		spotToDelete.$delete(angular.noop, handleError);

		angular.forEach($scope.spots, function(spot, index) {
			if(spot.id == $scope.currentSpot.id) {
				$scope.spots.splice(index, 1);
				//exit loop
				return;
			}
		});

		manageViewHiearchy("area");
	}

	//end spots

	//start menus

	$scope.filterAssignedMenus = function(menuToFilter) {
		var result = true;
		if(!$scope.currentArea) {
			return true;
		};

		angular.forEach($scope.currentArea.menuIds, function(element, index) {
			if(element == menuToFilter.id) {
				result = false;
				return false;
			}
		});

		return result;
	}

	$scope.filterNotAssignedMenus = function(menuToFilter) {
		var result = false;
		if(!$scope.currentArea) {
			return true;
		};

		angular.forEach($scope.currentArea.menuIds, function(element, index) {
			if(element == menuToFilter.id) {
				result = true;
				return false;
			}
		});

		return result;
	}

	/**
	* Event handler for drag&drop menu assignment.
	*/
	$scope.moveMenu = function(event, ui) {
		var menu = angular.element(ui.item).scope().menu;

		//remove menu from user
		if(ui.sender.attr("id") == "assignedMenusList") {
			angular.forEach($scope.currentArea.menuIds, function(element, index) {
				if(element == menu.id) {
					$scope.currentArea.menuIds.splice(index, 1);
					$scope.saveArea();
					return false;
				};
			});
		} else {
			//add menu to list
			$scope.currentArea.menuIds.push(menu.id);
			$scope.saveArea();
		}
	};

	//end menus

	/**
	* @private
	* Manages which elements can be seen on partial.
	*/
	function manageViewHiearchy(state) {
		//ui binds to state of sub elements, to hide them simply set them null
		//but keep parents intact

		switch (state) {
			case "areas":
				$scope.currentArea = null;
				$scope.spots = null;
				// break;
			case "area":
				$scope.currentSpot = null;
				// break;
			case "spot":

				break;
		}
	};



	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var spotId = $routeParams.spotId || "",
			businessId = $routeParams.businessId || "";

		if(newVal == true && businessId) {
			//load areas
			$scope.loadAreas(businessId);
		}

	});	


}

Cloobster.Spot.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Area', 'Spot', 'Menu', 'lang', '$log', 'errorHandler'];