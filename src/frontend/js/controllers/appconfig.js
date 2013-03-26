/** @module Cloobster/AppConfig */
'use strict';

/**
* 	@name Cloobster.AppConfig
*
* 	AppConfig controller 
* 	Configure Dashboard, App Theme and Images
* 	@constructor
*/
Cloobster.AppConfig = function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, Business) {


	$scope.tiles = [
		{	
			title: langService.translate("tiles.template.feedback") || "Feedback",
			type: "feedback",
			cls: "tile-feedback"
		},
		{	
			title: langService.translate("tiles.template.products") || "Products",
			type: "products",
			cls: "tile-products"
		},
		{	
			title: langService.translate("tiles.template.infopages") || "Infopages",
			type: "infopages",
			cls: "tile-infopages"
		},
		{	
			//title of tile
			title: langService.translate("tiles.template.allinfopages") || "All Infopages",
			type: "allinfopages",
			cls: "tile-allinfopages"
		}
	];

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

Cloobster.AppConfig.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'Business'];