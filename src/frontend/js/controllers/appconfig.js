/** @module Cloobster/AppConfig */
'use strict';

/**
* 	@name Cloobster.AppConfig
*
* 	AppConfig controller 
* 	Configure Dashboard, App Theme and Images
* 	@constructor
*/
Cloobster.AppConfig = function($scope, $http, $routeParams, $location, loginService, langService, $log, $timeout, handleError, Business) {


	$scope.tiles = [
		{	
			//title displayed on tile
			title: langService.translate("tiles.template.feedback") || "Feedback",
			//type identifiying the actions
			type: "feedback",
			//class to add
			cls: "tile-feedback",
			//description to use in detail view
			description: ""
		},
		{	
			title: langService.translate("tiles.template.products") || "Products",
			type: "products",
			cls: "tile-products",
			description: ""
		},
		{	
			title: langService.translate("tiles.template.infopages") || "Infopages",
			type: "infopages",
			cls: "tile-infopages",
			description: ""
		},
		{	
			title: langService.translate("tiles.template.allinfopages") || "All Infopages",
			type: "allinfopages",
			cls: "tile-infopages",
			description: ""
		}
	];

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
			
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}

Cloobster.AppConfig.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', '$timeout', 'errorHandler', 'Business'];