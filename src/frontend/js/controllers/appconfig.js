/** @module Cloobster/AppConfig */
'use strict';

/**
* 	@name Cloobster.AppConfig
*
* 	AppConfig controller 
* 	Configure Dashboard, App Theme and Images
* 	@constructor
*/
Cloobster.AppConfig = function($scope, $http, $routeParams, $location, loginService, langService, $log, $timeout, handleError, Business, DashboardItem, listUtil, Product) {
	var dashboardItemsResource,
			productsResource;

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
			description: langService.translate("tiles.template.feedback.description")
		},
		"products": {	
			title: langService.translate("tiles.template.products") || "Products",
			type: "products",
			cls: "tile-products",
			description: langService.translate("tiles.template.products.description")
		},
		"infopages": {	
			title: langService.translate("tiles.template.infopages") || "Infopages",
			type: "infopages",
			cls: "tile-infopages",
			description: langService.translate("tiles.template.infopages.description")
		},
		"actions": {	
			title: langService.translate("tiles.template.actions") || "Service Call",
			type: "actions",
			cls: "tile-actions",
			description: langService.translate("tiles.template.actions.description")
		},
		"infopagesall": {	
			title: langService.translate("tiles.template.allinfopages") || "All Infopages",
			type: "infopagesall",
			cls: "tile-infopages",
			description: langService.translate("tiles.template.infopagesall.description")
		},
		"productsall": {	
			title: langService.translate("tiles.template.productsall") || "All Products",
			type: "productsall",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsall.description")
		},
		"productsspecial": {	
			title: langService.translate("tiles.template.productsspecial") || "Special Products",
			type: "productsspecial",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsspecial.description")
		},
		"productsselected": {	
			title: langService.translate("tiles.template.productsselected") || "Selected Products",
			type: "productsselected",
			cls: "tile-products",
			description: langService.translate("tiles.template.productsselected.description")
		}
	};

	function init (activeBusinessId) {
		if(!activeBusinessId) {
			$log.error("No activeBusinessId supplied");
		}

		dashboardItemsResource = DashboardItem.buildResource(activeBusinessId);

		productsResource = Product.buildResource(activeBusinessId);

		//load dashboard items
		$scope.dashboardItems = dashboardItemsResource.query(null, angular.noop, handleError);
		$timeout(setupDragAndDrop,0);
		setupSorting();
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
		jQuery( ".tile-container-templates .tile" ).draggable({
			revert: "invalid",
			containment: "document",
			helper: "clone"
		});

	    jQuery( ".tile-empty" ).droppable(
	    {
	    	accept: ".tile",
	    	hoverClass: "tile-config-highlight",
	      	drop: $scope.addTileToConfig
	      // function( event, ui ) {
	      //   $( this )
	      //     .addClass( "ui-state-highlight" )
	      //     .find( "p" )
	      //       .html( "Dropped!" );
	      // }
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
		var tile = angular.element(ui.draggable[0]).scope().tile;
		createTile(tile);
		$scope.$digest();
	}

	/**
	* Removes given tile from the configuration.
	* @param {Object} tile
	*	Tile to remove
	*/
	$scope.removeTileFromConfig = function(tile) {

	}

	$scope.selectTile = function(tile) {
		$scope.currentTile = tile;

		if(tile.type == 'productsselected') {
				$scope.allProductsList = productsResource.query(null, function() {
					var checkedProducts = {};
					
					if(tile.entityIds) {
						// build map productId -> checked
						angular.forEach(tile.entityIds, function(checkedProductId) {
							checkedProducts[checkedProductId] = true;
						});

						angular.forEach($scope.allProductsList, function(product) {
							product.checked = checkedProducts[product.id];
						});
					}
			}, handleError);
		}
	};

	$scope.deleteTile = function(tile) {

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

	function updateTileEntitiesAndSave () {
		if(!$scope.currentTile)
			return;
		$scope.currentTile.entityIds = [];
		angular.forEach($scope.allProductsList, function(item){
			if(item.checked) {
				$scope.currentTile.entityIds.push(item.id);
			}
		});

		$scope.currentTile.$update(null, null, handleError);
	}

	/**
	* Check/Uncheck products regarding the search filter.
	* If less then all filtered spots are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkProducts = function() {
		listUtil.checkElements($scope.allProductsList, $scope.allProductsQuery);
		updateTileEntitiesAndSave();
	}

	$scope.productChecked = function() {
		updateTileEntitiesAndSave();
	};

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
}

Cloobster.AppConfig.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', '$timeout', 'errorHandler', 'Business', 'DashboardItem','listUtil','Product'];