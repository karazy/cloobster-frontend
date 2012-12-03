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

Cloobster.Spot = function($scope, $http, $routeParams, $location, $filter, loginService, Business, Area, Spot, Menu, langService, $log, handleError, helperFn) {
		//default information when adding a new barcode
	var defaultSpot = {
			name: langService.translate("barcode.new.default.name") || "New Spot",
			barcode : "",
			qrImageUrl: null,
			active: true
		},
		defaultArea = {
			name: langService.translate("area.new.default.name") || "My Service Area",
			active: true,
			menuIds: []
		},
		//Id of active business
		activeBusinessId = null,
		movedCategory = false;
		

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
	/* When creating multiple spots at once, spotMassCreation holds the data. */
	$scope.spotMassCreation = null;
	/** Business to which these spots belong to. */
	$scope.activeBusiness = null;
	/** A temporary order list of menus assigned to current area. */
	$scope.currentAreaCategories = null;

	//Drag&Drop for menus assignment
	jQuery( "#assignedMenusList, #allMenusList" ).sortable({
		connectWith: ".organizable-list",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "sortable-placeholder",
		receive: function(event, ui) { 
			$scope.moveCategory(event, ui);
		}
	}).disableSelection();

	jQuery( "#assignedMenusList" ).sortable({
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "sortable-placeholder",
		stop: function(event, ui) { 
			$scope.updateCategoryOrder(event, ui);
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
		$scope.areas = $scope.areasResource.query(angular.noop,	handleError);

		manageViewHiearchy("areas");
	};

	$scope.loadArea = function(areaItem) {
		manageViewHiearchy("area");
		$scope.currentArea = areaItem;
		//initially show content of spots tab
		$scope.show = 'spots';
		$scope.spots = $scope.spotsResource.query({"areaId" : areaItem.id}, null, null, handleError);
		//Reset search field for spots
		$scope.spotsQuery = null
		$scope.currentAreaCategories = new Array();
		if(!$scope.currentArea.menuIds) {
			$scope.currentArea.menuIds = new Array();
		} else {
			//create a temporary order list of menu items based on menuIds
			angular.forEach($scope.currentArea.menuIds, function(mId) {
				angular.forEach($scope.menus, function(menu) {
					if(mId == menu.id) {
						$scope.currentAreaCategories.push(menu);
					}
				});
			});
		}
	};

	$scope.createArea = function() {
		var newArea = angular.copy(defaultArea);
		$scope.currentArea = new $scope.areasResource(newArea);
		$scope.spots = new Array();
		$scope.currentAreaCategories = [];
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
		loginService.authenticatedRequest($scope.deletePassword, function() {
			// Do a request here. Login and password headers
			// will be set before this function will be called, and reset after.
			areaToDelete.$delete(function() { // success
				manageViewHiearchy("areas");
				jQuery("#deleteAreaModal").modal('hide');
				// Delete area from list.
				angular.forEach($scope.areas, function(area, index) {
					if(areaToDelete.id == area.id) {
						$scope.areas.splice(index, 1);
						//exit loop
						return false;
					}
				});
			}, function(data,status) {//error during save
				if(status == 403) {
					$scope.deleteError = langService.translate('profile.account.wrongpassword') || 'Incorrect password.'
				}
			});
		});
		
		$scope.deletePassword = null;

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

	/**
	* Toggle active state of area.
	* Executes a save afterwards.
	*/
	$scope.toggleAreaActive = function() {
		$scope.currentArea.active = !$scope.currentArea.active;
		$scope.saveArea();
	}


	//areas end


	//start spots

	$scope.loadSpot = function(spotItem, $event) {
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

	/**
	* Toggle active state of spot.
	* Executes a save afterwards.
	*/
	$scope.toggleSpotActive = function() {
		$scope.currentSpot.active = !$scope.currentSpot.active;
		$scope.saveSpot();
	}

	/**
	* Generate multiple spots at once.
	*
	*/
	$scope.generateSpots = function() {

		if(!$scope.spots) {
			$log.error('Spot.generateSpots: no spots collection exists');
			return;
		}

		if(!$scope.spotsResource) {
			$log.error('Spot.generateSpots: no spotsResource exists');
			return;
		}

		//1. PUT /b/businesses/{id}/spots/ Param: name, startNumber, count, Return complete array
		//2. Update view
		//3. clear spotMassCreation

		//form not valid
		if($scope.spotMassCreationForm.$invalid) {
			$log.warn('Spot.generateSpots: form is invalid');			
			return;
		}

		$scope.spotsResource.generate( 
			{
				'name' : $scope.spotMassCreation.name,
				'startNumber' : $scope.spotMassCreation.startNumber,
				'count' : $scope.spotMassCreation.count,
				'areaId' : $scope.currentArea.id
			},
			function(response) {
				//success
				$scope.spots = $scope.spots.concat(response);
			},
			// Error callback
			handleError
		);

		$scope.spotMassCreation = null;
		jQuery("#spotMassCreationDialog").modal('toggle');
	}

	/**
	* Sets active state for all checked spots.
	* @param active
	*	true to set spots active, false otherwise
	*/
	$scope.setCheckedSpotsActiveState = function(active) {
		var ids = [],
			//used in forEach to match returned spots with local ones
			foundSpot;

		if(!$scope.spots && $scope.spots.length > 0) {
			$log.log('Spot.setSpotsActiveState: $scope.spots does not exist or is empty.');
			return;
		}

		if(!$scope.spotsResource) {
			$log.log('Spot.setSpotsActiveState: $scope.spotsResource does not exist.');
			return;	
		}

		angular.forEach($scope.spots, function(element, index) {
			if(element.checked) {
				ids.push(element.id);	
			}			
		});

		//No spots selected
		if(ids.length == 0) {
			return;	
		}

		$scope.spotsResource.process(
			{
			'ids' : ids,
			'active' : active
			}, 
			function(response) {
				//update status on success
				angular.forEach($scope.spots, function(element, index) {
					foundSpot = jQuery.grep(response, function(spotFromResponse) {
						return spotFromResponse.id == element.id;
					});

					if(foundSpot.length > 1) {
						$log.warn('Spot.setSpotsActiveState: more than one returned spot matches with local ones!');
					} else if(!foundSpot || foundSpot.length == 0) {
						$log.warn('Spot.setSpotsActiveState: no matching spot found');
					} else {
						//replace old spot with updated
						$scope.spots[index] = foundSpot[0];
					}	
				});
			},
			handleError
		);

		manageViewHiearchy("area");
	}

	/**
	* Deletes all checked spots.
	*/
	$scope.deleteCheckedSpots = function() {
		var ids = [],
			//used in forEach to match returned spots with local ones
			foundSpot,
			indexesToRemove = [],
			clearedSpots = [];

		if(!$scope.spots && $scope.spots.length > 0) {
			$log.log('Spot.setSpotsActiveState: $scope.spots does not exist or is empty.');
			return;
		}

		if(!$scope.spotsResource) {
			$log.log('Spot.setSpotsActiveState: $scope.spotsResource does not exist.');
			return;	
		}

		angular.forEach($scope.spots, function(element, index) {
			if(element.checked) {
				ids.push(element.id);	
			}				
		});

		//No spots selected
		if(ids.length == 0) {
			return;	
		}

		$scope.spotsResource.process(
			{
			'ids' : ids,
			'remove': true
			},
			function(response) {
				//update status on success
				angular.forEach($scope.spots, function(element, index) {
					foundSpot = jQuery.grep(response, function(spotFromResponse) {
						return spotFromResponse.id == element.id;
					});

					// if(foundSpot.length > 1) {
					// 	$log.warn('Spot.deleteCheckedSpots: more than one returned spot matches with local ones!');
					// } else 
					if(!foundSpot || foundSpot.length == 0) {
						//this is non removed spot so add it
						clearedSpots.push(element);
					} 
					// else {
					// 	//remove spot from list
					// 	indexesToRemove.push(index);						
					// }	
				});				
				$scope.spots = clearedSpots;

				// for (var i = indexesToRemove.length - 1; i >= 0; i--) {
				// 	$scope.spots.splice(i, 1);
				// };
				// angular.forEach(indexesToRemove, function(element, index) {
				// 	$scope.spots.splice(element, 1);
				// });

			},
			handleError	
		);

		manageViewHiearchy("area");
	}

	/**
	* Check/Uncheck spots regarding the search filter.
	* If less then all filtered spots are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkSpots = function() {
		var filtered = null,
			setChecked;

		if(!$scope.spots && $scope.spots.length > 0) {
			$log.log('Spot.setSpotsActiveState: $scope.spots does not exist or is empty.');
			return;
		}
		
		filtered = $filter('filter')($scope.spots, $scope.spotsQuery);

		setChecked = jQuery.grep(filtered, function(element) {
			return element.checked;
		}).length < filtered.length;


		angular.forEach(filtered, function(element, index) {
			element.checked = setChecked;		
		});
	}

	/**
	* Count checked spots.
	*/
	$scope.getCheckedSpotsCount = function() {
		var filtered;

		filtered = $filter('filter')($scope.spots, { 'checked' : true});

		return filtered.length;
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
	* Event handler for drag&drop category assignment.
	*/
	$scope.moveCategory = function(event, ui) {
		var category = angular.element(ui.item).scope().category,
			index;

		//remove category from user
		if(ui.sender.attr("id") == "assignedMenusList") {
			angular.forEach($scope.currentArea.menuIds, function(element, index) {
				if(element == category.id) {
					$scope.currentArea.menuIds.splice(index, 1);
					$scope.currentAreaCategories.splice(index, 1);
					$scope.saveArea();
					return false;
				};
			});
		} else {
			index = ui.item.index();
			//add category to list at index
			$scope.currentArea.menuIds.splice(index, 0, category.id);

			//$scope.currentArea.menuIds.push(category.id);
			//add at correct index
			//$scope.currentAreaCategories.push(category);
			$scope.currentAreaCategories.splice(index, 0, category);


			$scope.saveArea();
		};
		//prevent updateCategoryOrder from execution
		movedCategory = true;
	};

	$scope.updateCategoryOrder = function(event, ui) {
		var liElements = ui.item.parent().children(), //get all li elements
			tmpCategory = null,
			//contains elements in new order
			updateArray = new Array();

		if(movedCategory) {
			movedCategory = false;
			//return because this is handled by moveCategory
			return;
		}

		if(!$scope.currentArea) {
			$log.log("Can't update menu order because no current area exists.");
			return;
		}

		liElements.each(function(index, ele) {
			//get corresponding choice resource by optaining the angular scope
			tmpCategory = angular.element(ele).scope().category;
			updateArray.push(tmpCategory.id);
		});
		//not named categoryIds because of legacy
		$scope.currentArea.menuIds = updateArray;
		$scope.currentArea.$update(null, null, handleError);
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

	/**
	* Use function from helper service.
	*
	*/
	$scope.getFieldInputClass = function(input) {
		return helperFn.getFieldInputClass(input);
	}


}

Cloobster.Spot.$inject = ['$scope', '$http', '$routeParams', '$location', '$filter', 'login', 'Business', 'Area', 'Spot', 'Menu', 'lang', '$log', 'errorHandler', 'helper'];