/** @module Cloobster/Management */
'use strict';

/**
* 	@name Cloobster.Management
*	@requires loginService
*
* 	Management controller 
* 	handles dynamic loading of menus, products, choices by examining
*	the browser Url and loading according data.
* 	@constructor
*/
Cloobster.Management = function($scope, $http, $log, $location, $routeParams) {



	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			var path = $location.path();
			
			// var mid = $routeParams.mid || "",
			// 	pid = $routeParams.pid || "";

			//examine path
			//check for mid
			//check if products shall be loaded
			//check for pid
			if(path.match(/\/menus/)) {
				$scope.menuPartial = "partials/menus.html";	
			} else {
				$scope.menuPartial = "";
			}
			
			if(path.match(/menus\/.*\/products/)) {
				$scope.productPartial = "partials/products.html";
			} else {
				$scope.productPartial = "";
			}
			
			

			// if($routeParams && $routeParams.mid) {
			// 	$scope.loadMenus($routeParams.mid);
			// }

			// if($routeParams && $routeParams.pid) {
			// 	$scope.loadMenus($routeParams.pid);
			// }			

			// if($location.path() == "/businesses/new") {
			// 	$scope.showNewBusinessForm = true;
			// }

		} else if(newValue == false) {
			$location.url('/');
		}
	});

}

Cloobster.Management.$inject = ['$scope', '$http', '$log', '$location', '$routeParams',];