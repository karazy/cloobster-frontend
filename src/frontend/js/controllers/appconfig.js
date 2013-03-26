/** @module Cloobster/AppConfig */
'use strict';

/**
* 	@name Cloobster.AppConfig
*
* 	AppConfig controller 
* 	Configure Dashboard, App Theme and Images
* 	@constructor
*/
Cloobster.AppConfig = function($scope, $http, $routeParams, $location, loginService, langService, $log, $timeout, handleError, Business, DashboardItem) {
	var dashboardItemsResource;

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
			description: ""
		},
		"products": {	
			title: langService.translate("tiles.template.products") || "Products",
			type: "products",
			cls: "tile-products",
			description: ""
		},
		"infopages": {	
			title: langService.translate("tiles.template.infopages") || "Infopages",
			type: "infopages",
			cls: "tile-infopages",
			description: ""
		},
		"actions": {	
			title: langService.translate("tiles.template.actions") || "Service Call",
			type: "actions",
			cls: "",
			description: ""
		},
		"infopagesall": {	
			title: langService.translate("tiles.template.allinfopages") || "All Infopages",
			type: "infopagesall",
			cls: "tile-infopages",
			description: ""
		},
		"productsall": {	
			title: langService.translate("tiles.template.productsall") || "All Products",
			type: "productsall",
			cls: "tile-products",
			description: ""
		},
		"productsspecial": {	
			title: langService.translate("tiles.template.productsspecial") || "Special Products",
			type: "productsspecial",
			cls: "tile-products",
			description: ""
		}
	};

	function init (activeBusinessId) {
		if(!activeBusinessId) {
			$log.error("No activeBusinessId supplied");
		}

		dashboardItemsResource = DashboardItem.buildResource(activeBusinessId);

		//load dashboard items
		$scope.dashboardItems = dashboardItemsResource.query(null, angular.noop, handleError);
	}

	$timeout(setupDragAndDrop, 1000);

	/**
	* @private
	* Initialize drag and drop functionality for tile configuration with jQuery UI.
	*/
	function setupDragAndDrop() {
		//drag&drop functionality
		jQuery( ".tile-container-templates .tile" ).draggable({
			revert: true,
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
	* Drop event handler for tile configuration dropped in an empty slot.
	*/
	$scope.addTileToConfig = function(event, ui) {
		//add tile to html
		//make sure slot is blocked for other elements to drop on?

	}

	/**
	* Removes given tile from the configuration.
	* @param {Object} tile
	*	Tile to remove
	*/
	$scope.removeTileFromConfig = function(tile) {

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
}

Cloobster.AppConfig.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', '$timeout', 'errorHandler', 'Business', 'DashboardItem'];