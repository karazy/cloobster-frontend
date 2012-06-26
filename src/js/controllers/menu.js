/** @module Cloobster/Menu */
'use strict';

/**
* 	@name Cloobster.Menus 
*	@requires facebookApi
*	@requires loginService
*
* 	Menu controller 
* 	View and manage profiles.
* 	@constructor
*/
Cloobster.Menu = function($scope, $http, $routeParams, $location, loginService, Menu, $log) {

	/** Menu Resource. */
	$scope.menusResource = null;
	/** Contains menu data. */
	$scope.menus = null;
	/** Currently selected menu. */
	$scope.currentMenu = null;

	$scope.loadMenus = function() {
		$log.log("load menus");
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load menus.');
			return;
		}

		account =  loginService.getAccount();
		//TODO submit real business Id
		$scope.menusResource = Menu.buildResource(account.id, 263);
		//load menus
		$scope.menus = $scope.menusResource.query();
	};

	$scope.loadMenu = function(menuId) {
		$log.log("load menu " + menuId);
	};

	$scope.setLocationAndLoadMenu = function(menuId) {
		$scope.loadMenu(menuId);
		$location.path($location.path() + "/" + menuId);		
	}

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var menuId = $routeParams.menuId || "";

		//always load menus
		$scope.loadMenus();

		//if menuId exists load specific menu with products and highlight in list
		if(menuId) {
			$scope.loadMenu(menuId);
		}

	});
}

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Menu', '$log'];