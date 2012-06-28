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
Cloobster.Menu = function($scope, $http, $routeParams, $location, loginService, Business, Menu, Product, Choice, langService, $log) {

	var activeBusinessId = null,
		choicesResource = null,
		/** Default values for new menus.*/
		defaultMenu = {
			title: langService.translate("menu.new.default.title"),
			active: false
		},
		/** Default values for new products. */
		defaultProduct = {
			name: langService.translate("product.new.default.name"),
			price: 1,
			shortDesc: "",
			longDesc: "",
			active: false
		},
		/** Default values for new choices. */
		defaultChoice = {
			text: langService.translate("choice.new.default.text"),
			minOccurence: 0,
			maxOccurence: 0,
			price: 0,
			included: 0,
			overridePrice: "NONE",
			options: new Array()
		},
		/** Default values for new options. */
		defaultOption = {
			name: langService.translate("option.new.default.name"),
			price: 0
		};

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
	$scope.choices = null;
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

		//reset currentProduct, so details get hidden when menu changes
		$scope.currentProduct = null;

		//reset currentChoice, so details get hidden when menu changes
		$scope.currentChoice = null;
		
		$scope.currentMenu = menuItem;

		$scope.products = $scope.productsResource.query({"bid" : activeBusinessId, "menuId" : menuItem.id});

		//make products sortable via drag&drop
		
		jQuery( "#productList" ).sortable({
			connectWith: ".connectedSortable",
			items: 'li.sortable',
			update: function(event, ui) { 
				$scope.updateProductOrder(event, ui);
			}
		}).disableSelection();

		jQuery( "#choicesList" ).sortable({
			connectWith: ".connectedSortable",
			items: 'li.sortable',
			update: function(event, ui) { 
				$scope.updateChoiceOrder(event, ui);
			}
		}).disableSelection();

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
		$scope.currentMenu = new $scope.menusResource(defaultMenu);

		$scope.currentChoice = null;

		$scope.currentProduct = null;

		$scope.products = new Array();
		$scope.choices = new Array();
	};

	//End Menu logic

	//Start Product logic
	$scope.loadProduct = function(productItem) {
		$log.log("load product " + productItem.id);
		
		//reset currentChoice, so details get hidden when product changes
		$scope.currentChoice = null;

		$scope.currentProduct = productItem;
		$scope.choices = choicesResource.query({"productId": productItem.id});
	};

	$scope.createProduct = function() {
		$log.log("create product");

		var newProduct = new $scope.productsResource(defaultProduct);
		//reset currentChoice, because we don't want them to be displayed along the new product
		$scope.currentChoice = null;

		$scope.currentProduct = newProduct;

		$scope.choices = new Array();

		newProduct.menuId = $scope.currentMenu.id;
	}

	$scope.saveProduct = function() {
		$log.log("save product");

		var product = $scope.currentProduct;

		if(product && product.id) {
			product.$update({"bid" : activeBusinessId});	
		} else {
			product.$save({"bid" : activeBusinessId});
			$scope.products.push(product);
		}

	}

	$scope.updateProductOrder = function(event, ui) {
		$log.log("updateProductOrder");
		//handle index update, update old product and new product
	};

	//End Product logic

	//Start Choice logic
	$scope.loadChoice = function(choiceItem) {
		$scope.currentChoice = choiceItem;
	};

	$scope.saveChoice = function() {
		if($scope.currentChoice && $scope.currentChoice.id) {
			$scope.currentChoice.$update({"bid" : activeBusinessId});	
		} else {
			$scope.currentChoice.$save({"bid" : activeBusinessId});
			$scope.choices.push($scope.currentChoice);
		}

	};

	$scope.createChoice = function() {
		$log.log("createChoice");

		var newChoice = new choicesResource(defaultChoice);
		//reset currentChoice, because we don't want them to be displayed along the new product
		$scope.currentChoice = newChoice;

		$scope.options = new Array();

		$scope.addOption();

		newChoice.productId = $scope.currentProduct.id;
	}

	$scope.addOption = function() {
		$scope.currentChoice.options.push(angular.copy(defaultOption));
	};
	
	$scope.removeOption = function(index) {
		$scope.currentChoice.options.splice(index, 1);
	};

	$scope.updateChoiceOrder = function(event, ui) {
		$log.log("updateChoiceOrder");
		//handle index update, update old choice and new choice
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

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Menu', 'Product', 'Choice', 'lang', '$log'];