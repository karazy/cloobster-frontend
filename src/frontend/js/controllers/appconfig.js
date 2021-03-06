/** @module Cloobster/AppConfig */
'use strict';

/**
* 	@name Cloobster.AppConfig
*
* 	AppConfig controller 
* 	Configure Dashboard, App Theme and Images
* 	@constructor
*/
Cloobster.AppConfig = function($scope, $http, $routeParams, $location, loginService, langService, $log, $timeout, handleError, Business, DashboardItem, listUtil, Product, InfoPage, Menu) {
	var dashboardItemsResource,
		productsResource,
		infoPagesResource,
		menusResource;

	/** Tile configuration map */
	$scope.tiles = {
		"feedback": {	
			//title displayed on tile
			title: langService.translate("tiles.template.feedback") || "Feedback",
			//type identifiying the actions
			type: "feedback",
			//class to add
			cls: "tile-feedback",
			//description to use in detail view
			description: langService.translate("tiles.template.feedback.description"),
			//a tile that just acts as a shorthand to navigation menus, used to add additional styles
			"static": true,
			//feature this tile belongs to
			"feature" : "feedback"
		},
		"products": {	
			title: langService.translate("tiles.template.products") || "Products",
			type: "products",
			cls: "tile-products",
			description: langService.translate("tiles.template.products.description"),
			"static": true,
			"feature" : "products"
		},
		"infopages": {	
			title: langService.translate("tiles.template.infopages") || "Infopages",
			type: "infopages",
			cls: "tile-infopages",
			description: langService.translate("tiles.template.infopages.description"),
			"static": true,
			"feature" : "infopages"
		},
		"actions": {	
			title: langService.translate("tiles.template.actions") || "Service Call",
			type: "actions",
			cls: "tile-actions",
			description: langService.translate("tiles.template.actions.description"),
			"static": true,
			"feature" : "requests-call"
		},
		"infopagesall": {	
			title: langService.translate("tiles.template.allinfopages") || "All Infopages",
			type: "infopagesall",
			cls: "tile-infopages",
			description: langService.translate("tiles.template.infopagesall.description"),
			"static": false,
			"feature" : "infopages"
		},
		"infopagesselected": {	
			title: langService.translate("tiles.template.infopagesselected") || "Selected Infopages",
			type: "infopagesselected",
			cls: "tile-infopages",
			description: langService.translate("tiles.template.infopagesselected.description"),
			"static": false,
			"feature" : "infopages"
		},
		"productsall": {	
			title: langService.translate("tiles.template.productsall") || "All Products",
			type: "productsall",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsall.description"),
			"static": false,
			"feature" : "products"
		},
		"productsspecial": {	
			title: langService.translate("tiles.template.productsspecial") || "Special Products",
			type: "productsspecial",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsspecial.description"),
			"static": false,
			"feature" : "products"
		},
		"productsselected": {	
			title: langService.translate("tiles.template.productsselected") || "Selected Products",
			type: "productsselected",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsselected.description"),
			"static": false,
			"feature" : "products"
		},
		"deztixevents": {	
			title: langService.translate("tiles.template.external.de.ztix.events") || "Ztix Events",
			type: "deztixevents",
			cls: "tile-de-ztix-events",
			description: langService.translate("tiles.template.external.de.ztix.events.description"),
			"static": true,
			"feature" : "de-ztix"
		},
		"menusselected": {	
			title: langService.translate("tiles.template.menusselected") || "Offers category",
			type: "menusselected",
			cls: "tile-products",
			description: langService.translate("tiles.template.menusselected.description"),
			"static": false,
			"feature" : "products"
		},
		// "deztixcoupons": {	
		// 	title: langService.translate("tiles.template.external.de.ztix.coupons") || "Ztix Coupons",
		// 	type: "deztixcoupons",
		// 	cls: "tile-de-ztix-coupons",
		// 	description: langService.translate("tiles.template.external.de.ztix.coupons.description"),
		// 	"static": true,
		// 	"feature" : "de-ztix-coupons"
		// },
		"storecard": {	
			title: langService.translate("tiles.template.storecard") || "Storecard",
			type: "storecard",
			cls: "tile-storecard",
			description: langService.translate("tiles.template.storecard.description"),
			"static": true,
			"feature" : "storecard"
		}
	};
	/** Holds the last tile whose hover delete button was clicked. */
	$scope.lastHoveredTile = null;

	function init (activeBusinessId) {
		if(!activeBusinessId) {
			$log.error("No activeBusinessId supplied");
		}

		dashboardItemsResource = DashboardItem.buildResource(activeBusinessId);

		productsResource = Product.buildResource(activeBusinessId);
		infoPagesResource = InfoPage.buildResource(activeBusinessId);
		menusResource = Menu.buildResource(activeBusinessId);

		$scope.activeBusiness = Business.buildResource(loginService.getAccount().id).get({'id': activeBusinessId}, function(business) {
			setupDragAndDrop();
			setupSorting();
			
		}, handleError);

		//load dashboard items
		$scope.dashboardItems = dashboardItemsResource.query(null, angular.noop, handleError);


	}	

	/**
	* @private
	* Initialize drag and drop functionality for tile configuration with jQuery UI.
	*/
	function setupSorting() {
		jQuery('#tiles-sort-container').sortable({
			update: updateTileOrder
		});
	};

	/**
	* @private
	* Initialize drag and drop functionality for tile configuration with jQuery UI.
	*/
	function setupDragAndDrop() {
		//drag&drop functionality
		jQuery( ".tile-container-templates .tile-template" ).draggable({
			revert: "invalid",
			containment: "document",
			helper: "clone",
			zIndex: 100

		});

	    // jQuery( ".tile-empty" ).droppable(
	    // {
	    // 	accept: ".tile-template",
	    // 	hoverClass: "tile-config-highlight",
	    //   	drop: $scope.addTileToConfig
	    // }
	    // );

	    jQuery( ".tile-container-config" ).droppable(
	    {
	    	accept: ".tile-template",
	    	activeClass: "drop-active",
	      	drop: $scope.addTileToConfig,
	      	activate: function() {
				jQuery('.smartphone-frame .mask').show();
			},
			deactivate: function() {
				jQuery('.smartphone-frame .mask').hide();
			}
	    }
	    );
	}

	/**
	* @private
	* Helper function to create new tile resource from template and save on server.
	*/
	function createTile (template) {
		if(!template) {
			$log.error('No tile template supplied');
			return;
		}
		var newTile = new dashboardItemsResource({'type': template.type});

		function saveSuccess() {
			$scope.dashboardItems.push(newTile);
			$scope.selectTile(newTile);
		}

		newTile.$save(saveSuccess, handleError);
	}	

	/**
	* @private
	* Event handler called after the order of the tiles has been updated.
	*/
	function updateTileOrder (event, ui) {
		var tiles = ui.item.parent().children(), //get all elements
			tmpTile,
			itemIds = [];

		$scope.dashboardItems.splice(0, $scope.dashboardItems.length);

		tiles.each(function(index, ele) {
			//get corresponding tile
			tmpTile = angular.element(ele).scope().item;
			if(tmpTile) {
				$scope.dashboardItems.push(tmpTile);
				itemIds.push(tmpTile.id);
			}
		});

		dashboardItemsResource.update({'itemIds': itemIds}, angular.noop, handleError);	
	}

	/**
	* Drop event handler for tile configuration dropped in an empty slot.
	*/
	$scope.addTileToConfig = function(event, ui) {
		//add tile to html
		//make sure slot is blocked for other elements to drop on?
		if($scope.dashboardItems.length > 9) {
			return;
		}

		var tile = angular.element(ui.draggable[0]).scope().tile;
		createTile(tile);
		$scope.$digest();
	}

	/**
	* Updates existing tile.
	*/
	$scope.updateTile = function() {
		
		if(!$scope.currentTile) {
			$log.log("AppConfig.updateTile: no current tile selected");
			return;
		}

		if(!$scope.currentTile.id) {
			$log.log("AppConfig.updateTile: cant update new tile");
			return;
		}

		$scope.selectTile($scope.currentTile);

		$scope.currentTile.$update(null, null, handleError);
	}

	/**
	* Removes given tile from the configuration.
	* @param {Object} tile
	*	Tile to remove
	*/
	$scope.removeTileFromConfig = function(tile) {

	}

	/**
	* @private
	* Helper function to populate list for tile entities selection
	*/
	function loadEntities (resource, listName) {
		var tile = $scope.currentTile;
		$scope[listName] = resource.query(null, function() {
					var checked = {};
					
					if(tile.entityIds) {
						// build map productId -> checked
						angular.forEach(tile.entityIds, function(checkedItemId) {
							checked[checkedItemId] = true;
						});

						angular.forEach($scope[listName], function(item) {
							item.checked = checked[item.id];
						});
					}
			}, handleError);
	}

	/**
	* Sets given tile as $scope.currentTile
	* @param {Object} tile to set
	*/
	$scope.selectTile = function(tile) {
		$scope.currentTile = tile;

		if(tile.type == 'productsselected') {
			loadEntities(productsResource, 'allProductsList');
		} else if(tile.type == 'infopagesselected') {
			loadEntities(infoPagesResource, 'allInfoPages');
		} else if(tile.type == 'menusselected') {
			loadEntities(menusResource, 'allMenusList');
		} else {
			//delete entity ids for all other types
			//will exist when changing a tile type via radio button
			delete $scope.currentTile.entityIds;
		}
	};

	$scope.confirmDelete = function(tile) {
		$scope.lastHoveredTile = tile;
		$('#deleteHoverTileModal').modal('show');
	};

	$scope.deleteTile = function(tile) {
		if(!tile) {
			$log.log('AppConfig.deleteTile: no tile given');
			return;
		}

		tile.$remove(function() {
			if($scope.currentTile == tile) {
				$scope.currentTile = null;
			}
			angular.forEach($scope.dashboardItems, function(item, index) {
				// Remove item from array
				if(item.id == tile.id) {
					$scope.dashboardItems.splice(index, 1);
					return false;
				}
			})
		}, handleError);
	}

	function updateTileEntitiesAndSave (itemList) {
		if(!$scope.currentTile || !itemList)
			return;

		$scope.currentTile.entityIds = [];
		angular.forEach(itemList, function(item){
			if(item.checked) {
				//for products we only use active 
				if(!item.hasOwnProperty('active') || item.active === true) {
					$scope.currentTile.entityIds.push(item.id);	
				}
			}
		});

		$scope.currentTile.$update(null, null, handleError);
	}

	/**
	* Check/Uncheck products regarding the search filter.
	* If less then all filtered products are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkProducts = function() {
		listUtil.checkElements($scope.allProductsList, $scope.allProductsQuery);
		updateTileEntitiesAndSave($scope.allProductsList);
	}

	$scope.productChecked = function() {
		updateTileEntitiesAndSave($scope.allProductsList);
	};

	/**
	* Check/Uncheck infopages regarding the search filter.
	* If less then all filtered spots are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkInfoPages = function() {
		listUtil.checkElements($scope.allInfoPages, $scope.allInfoPagesQuery);
		updateTileEntitiesAndSave($scope.allInfoPages);
	}

	$scope.infoPageChecked = function() {
		updateTileEntitiesAndSave($scope.allInfoPages);
	};

	/**
	* Check/Uncheck menus regarding the search filter.
	* If less then all filtered menus are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkMenus = function() {
		listUtil.checkElements($scope.allMenusList, $scope.allMenusQuery);
		updateTileEntitiesAndSave($scope.allMenusList);
	}

	$scope.menuChecked = function() {
		updateTileEntitiesAndSave($scope.allMenusList);
	};

	/**
	* Toggle visibility of tile selection type via radio button for products.
	*/
	$scope.showProductTileToggle = function() {
		if(!$scope.currentTile) {
			return false;
		}
		return $scope.currentTile.type == "productsselected" || $scope.currentTile.type == "productsall" || $scope.currentTile.type == "productsspecial";
	}

	/**
	* Toggle visibility of tile selection type via radio button for infopages.
	*/
	$scope.showInfopageTileToggle = function() {
		if(!$scope.currentTile) {
			return false;
		}
		return $scope.currentTile.type == "infopagesall" || $scope.currentTile.type == "infopagesselected";
	}

	/**
	* Save business.
	*/
	$scope.saveBusiness = function() {
		if(!$scope.activeBusiness) {
			$log.error("AppConfig.saveBusiness: no activeBusiness exists");
			return;
		}

		$scope.activeBusiness.$update(null, null, handleError);			
	}

	/**
	* Indicates if a certain feature is enabled (true) or disabled (false).
	*/
	$scope.isFeatureDisabled = function(feature) {
		if(!$scope.activeBusiness || !$scope.activeBusiness.features) {
			return false;
		}	

		if($scope.activeBusiness.features.hasOwnProperty(feature)) {
			return !$scope.activeBusiness.features[feature];
		}

		return false;
	}

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch("loggedIn", function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			init(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});

	//init bootstrapSwitch
	// $('.switch')['bootstrapSwitch']();
	// $('.switch').on('switch-change', function (e, data) {
 //    	var $el = $(data.el),
 //        value = data.value;

 //    	console.log(e + data);
	// });
}

Cloobster.AppConfig.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', '$timeout', 'errorHandler', 'Business', 'DashboardItem','listUtil','Product', 'InfoPage', 'Menu'];