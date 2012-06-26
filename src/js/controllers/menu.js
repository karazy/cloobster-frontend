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

	var activeBusinessId = null;

	/** Menu Resource. */
	$scope.menusResource = null;
	/** */
	$scope.productsResource = null;
	/** Contains menu data. */
	$scope.menus = null;
	/** Currently selected menu. */
	$scope.currentMenu = null;
	/** */
	$scope.products = null;
	/** */
	$scope.currentProduct = null;

	//Start Menu logic

	$scope.loadMenus = function(businessId) {
		$log.log("load menus");
		var account;

		activeBusinessId = businessId;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load menus.');
			return;
		}

		account =  loginService.getAccount();
		//TODO submit real business Id
		$scope.menusResource = Menu.buildResource(account.id, activeBusinessId);
		//load menus
		$scope.menus = $scope.menusResource.query();
	};

	$scope.loadMenu = function(menuId) {
		$log.log("load menu " + menuId);
		//TODO submit real business Id
		$scope.currentMenu = $scope.menusResource.get({"bid" : activeBusinessId, "mid" : menuId});
	};

	$scope.getActive = function(menuId) {
		$log.log("get active for " + menuId);
		if($scope.currentMenu && $scope.currentMenu.id == menuId) {
			return "active";
		}

		return "";
	}

	//End Menu logic

	//Start Product logic

	//End Product logic

	$scope.setLocationAndLoadMenu = function(menuId) {
		$scope.loadMenu(menuId);
		$location.path($location.path() + "/" + menuId);		
	}

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var menuId = $routeParams.menuId || "",
			businessId = $routeParams.businessId || "";

		//always load menus
		$scope.loadMenus(businessId);

		//if menuId exists load specific menu with products and highlight in list
		// if(menuId) {
		// 	$scope.loadMenu(menuId);
		// }

	});
}

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Menu', '$log'];