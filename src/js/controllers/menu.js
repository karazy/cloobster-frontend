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
Cloobster.Menu = function($scope, $http, $routeParams, $location, loginService, Business, Menu, Product, Choice, $log) {

	var activeBusinessId = null,
		choicesResource = null;

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
	/** Business to which these menus belong to. */
	$scope.activeBusiness = null;

	//Start Menu logic

	$scope.loadMenus = function(businessId) {
		$log.log("load menus");
		var account;		

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load menus.');
			return;
		}

		//reset current product, so details get hidden when menu changes
		$scope.currentProduct = null;

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		//create menus and products resource
		$scope.menusResource = Menu.buildResource(activeBusinessId);
		$scope.productsResource = Product.buildResource(activeBusinessId);
		choicesResource = Choice.buildResource(activeBusinessId);

		//load menus
		$scope.menus = $scope.menusResource.query();
	};

	$scope.loadMenu = function(menuItem) {
		$log.log("load menu " + menuItem.id);
		
		$scope.currentMenu = menuItem;

		$scope.products = $scope.productsResource.query({"bid" : activeBusinessId, "menuId" : menuItem.id});
	};

	$scope.saveMenu = function() {
		$log.log("save menu ");

		if($scope.currentMenu && $scope.currentMenu.id) {
			$scope.currentMenu.$update({"bid" : activeBusinessId});	
		} else {
			$scope.currentMenu.$save({"bid" : activeBusinessId});
			$scope.menus.push($scope.currentMenu);
		}
		
	};

	$scope.createMenu = function() {
		$scope.currentMenu = new $scope.menusResource();

		$scope.currentMenu.title = "My Menu Title";
	};

	//End Menu logic

	//Start Product logic
	$scope.loadProduct = function(productItem) {
		$log.log("load product " + productItem.id);
		
		$scope.currentProduct = productItem;
		$scope.choices = choicesResource.query({"productId": productItem.id});
	};
	//End Product logic

	//Start Choice logic
	$scope.loadChoice = function(choiceItem) {
		$scope.currentChoice = choiceItem;
	};	
	//End Choice logic

	$scope.setLocationAndLoadMenu = function(menuId) {
		$scope.loadMenu(menuId);
		$location.path($location.path() + "/" + menuId);		
	};

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

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Menu', 'Product', 'Choice', '$log'];