/** @module Cloobster/Menu */
'use strict';

/**
* 	@name Cloobster.Menus 
*	@requires loginService
*
* 	Menu controller 
* 	View and manage menus, products, choices per restaurant.
* 	@constructor
*/
Cloobster.Menu = function($scope, $http, $routeParams, $location, $filter, loginService, Business, Menu, Product, Choice, langService, $log, handleError, validator, listUtil) {

	var activeBusinessId = null,
		choicesResource = null,
		/** Default values for new menus.*/
		defaultMenu = {
			// title: langService.translate("menu.new.default.title") || "My new Menu",
			active: true
		},
		/** Required menu fields. */
		requiredMenuFields = {
			title: true
		},
		/** Default values for new products. */
		defaultProduct = {
			// name: langService.translate("product.new.default.name") || "My new Product",
			price: 0,
			shortDesc: "",
			longDesc: "",
			active: true
		},
		requiredProductFields = {
			name: true
		},
		/** Default values for new choices. */
		defaultChoice = {
			// text: langService.translate("choice.new.default.text") || "My new choice",
			minOccurence: 0,
			maxOccurence: 0,
			price: 0,
			included: 0,
			overridePrice: "NONE",
			options: new Array()
		},
		requiredChoiceFields = {
			text: true
		},
		/** Default values for new options. */
		defaultOption = {
			name: langService.translate("option.new.default.name") || "My new option",
			price: 0
		},
		requiredOptionFields = {
			name: true
		};

	/** Menu resource. */
	$scope.menusResource = null;
	/** Product resource. */
	$scope.productsResource = null;
	/** Business to which these menus belong to. */
	$scope.activeBusiness = null;
	/** Contains menu data. */
	$scope.menus = null;
	/** Currently selected menu. */
	$scope.currentMenu = null;
	/** Products of current menu. */
	$scope.products = null;
	/** Selected product. */
	$scope.currentProduct = null;
	/** List of all existing products. */
	$scope.allProducts = null;
	/** List of products not assigned to any menu.*/
	$scope.orphanedProducts = null;
	/** Choices of current product. */
	$scope.choices = null;
	/** List of all existing choices. */
	$scope.allChoices = null;
	/** List of all products linked with current choice. Null if only one product is linked.*/
	$scope.linkedProductsForChoice = null;
	/** Holds all necessary innformation during menu organization. */
	$scope.organizeMenusContext = false;
	/** Image resource for product images */
	$scope.productImageResource = null;

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
		$scope.menus = $scope.menusResource.query(null, null, null, handleError);

		//init sortable lists

		// jQuery( "#menuList" ).sortable({
		// 	// connectWith: ".connectedSortable",
		// 	items: 'li.sortable',
		// 	axis: "y",
		// 	update: function(event, ui) { 
		// 		$scope.updateMenuOrder(event, ui);
		// 	}
		// }).disableSelection();
		
		jQuery( "#productList" ).sortable({
			// connectWith: ".connectedSortable",
			items: 'li.sortable',
			axis: "y",
			update: function(event, ui) { 
				$scope.updateProductOrder(event, ui);
			}
		}).disableSelection();

		jQuery( "#choicesList" ).sortable({
			// connectWith: ".connectedSortable",
			items: "li.sortable",
			axis: "y",
			update: function(event, ui) { 
				$scope.updateChoiceOrder(event, ui);
			}
		}).disableSelection();

		jQuery( "#organizeList1, #organizeList2" ).sortable({
			// connectWith: ".connectedSortable",
			// items: "li.sortable",
			connectWith: ".organizable-product-list",
			dropOnEmpty: true,
			forcePlaceholderSize: true,
			placeholder: "sortable-placeholder",
			receive: function(event, ui) { 
				$scope.moveProduct(event, ui);
			}
		}).disableSelection();

	};

	$scope.loadMenu = function(menuItem) {
		$log.log("load menu " + menuItem.id);
		
		manageViewHiearchy("menu");

		$scope.currentMenu = menuItem;

		$scope.products = $scope.productsResource.query({"menuId" : menuItem.id} ,function() {
				/** Maps products by id */
				var productsMap = {};

				if($scope.currentMenu.productIds.length == 0)
					return;

				// Build temporary map for quick access to products by id.
				angular.forEach($scope.products, function (product, index) {
					productsMap[product.id] = product;
				});
				
				// clear products array
				$scope.products = [];

				// Rearrange products array according to order array.
				angular.forEach($scope.currentMenu.productIds, function(productId, index) {
					if(productsMap[productId]) {
						// Only add if this 
						$scope.products.push(productsMap[productId]);
						delete productsMap[productId];
					}
				});

				// add all remaining products (for backwards comabtibility)
				angular.forEach(productsMap, function(product) {
					$scope.products.push(product);
				});
			}
			, handleError);

	};
	
	/**
	* @deprecated
	*/
	$scope.fillOrganizeList = function(menuItem, list) {		
		if(list == 1) {
			if(!$scope.organizeMenusContext.menu2 || $scope.organizeMenusContext.menu2.id != menuItem.id) {
				$scope.organizeMenusContext.menu1 = menuItem;
				$scope.organizeMenusContext.productOrganizeList1 = $scope.productsResource.query({"menuId" : menuItem.id},null, null, handleError);	
			}
		} else if(list == 2) {
			if(!$scope.organizeMenusContext.menu1 || $scope.organizeMenusContext.menu1.id != menuItem.id) {
				$scope.organizeMenusContext.menu2 = menuItem;
				$scope.organizeMenusContext.productOrganizeList2 = $scope.productsResource.query({"menuId" : menuItem.id},null, null, handleError);
			}
		} else if(list == 3) {
			//fill list 1 with orphaned products
			$scope.organizeMenusContext.menu1 = {
				id: null,
				title : langService.translate("menus.products.orphaned.title")
			};
			$scope.organizeMenusContext.productOrganizeList1 = $scope.productsResource.query({"noMenu" : true},null, null, handleError);
		}	
	}


	$scope.saveMenu = function() {
		$log.log("save menu ");

		if(!validator.validateModel($scope.currentMenu, requiredMenuFields)) {
			$scope.menuInvalid = true;
			return;
		}
		

		if($scope.currentMenu && $scope.currentMenu.id) {
			$scope.currentMenu.$update(null, null, handleError);	
		} else {
			$scope.currentMenu.$create(saveMenuSuccess, handleError);
		}

		$scope.menuInvalid = false;

		function saveMenuSuccess(menu) {
			$scope.menus.push(menu);
		}
		
	};

	$scope.createMenu = function(title) {
		$scope.currentMenu = new $scope.menusResource(defaultMenu);

		//if title is given directly set and save it
		if(title) {
			$scope.currentMenu.title = title;
			$scope.saveMenu();
			//reset title
			$scope.newCategoryTitle = null;
		}

		$scope.products = new Array();
		$scope.choices = new Array();

		manageViewHiearchy("menu");
	};

	$scope.updateMenuOrder = function(event, ui) {
		$log.log("updateMenuOrder");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpMenu = null; //holds current menu in for each loop
		//TODO optimize sort mechanism to issue less requests
		liElements.each(function(index, ele) {
			if(index > 0) {
				//get corresponding choice resource by optaining the angular scope
				tmpMenu = angular.element(ele).scope().menu;
				tmpMenu.order = index;
				tmpMenu.$update(null, null, handleError);
			}	
		});
	};

	$scope.deleteMenu =  function(menuToDelete) {
		menuToDelete.$delete(angular.noop, handleError);

		angular.forEach($scope.menus, function(menu, index) {
			if(menuToDelete.id == menu.id) {
				$scope.menus.splice(index, 1);
				//exit loop
				return false;
			}
		});

		manageViewHiearchy("menus");

		// $scope.currentMenu = null;
		// $scope.products = null;
	}

	$scope.loadOrphanedProducts = function() {
		manageViewHiearchy("orphaned-products");
	
		$scope.orphanedProducts = $scope.productsResource.query({"noMenu" : true},null, null, handleError);
	}

	$scope.organizeMenus = function() {
		$log.log("organizeMenus");
		manageViewHiearchy("organize-menus");
	}

	$scope.excludeMenu = function(element) {
		if($scope.currentMenu && element && $scope.currentMenu.id == element.id) {
			return false;
		}
		return true;
	}
	/**
	* Toggle active state of menu.
	* Executes a save afterwards.
	*/
	$scope.toggleMenuActive = function() {
		$scope.currentMenu.active = !$scope.currentMenu.active;
		$scope.saveMenu();
	}

	//End Menu logic

	//Start Product logic
	$scope.loadProduct = function(productItem, $event) {
		$log.log("load product " + productItem.id);

		if($event) {
			//checkbox clicked. Do nothing.
			if(jQuery($event.srcElement).is("input")) {
				return;
			}

			if(jQuery($event.originalEvent.srcElement).is("input")) {
				return;
			}

			if(jQuery($event.originalEvent.srcElement).is("button")) {
				return;
			}
			//clicked on icon in <i> of button
			if(jQuery($event.originalEvent.srcElement).is("i") && jQuery($event.originalEvent.srcElement.parentElement).is("button")) {
				return;
			}
		}

		manageViewHiearchy("product");
		

		$scope.currentProduct = productItem;
		$scope.choices = choicesResource.query({"productId": productItem.id},null,null,handleError);
		$scope.productImageResource = Product.buildImageResource(activeBusinessId, productItem.id);
	};

	$scope.createProduct = function() {
		$log.log("create product");

		var newProduct = new $scope.productsResource(defaultProduct);
		
		manageViewHiearchy("product");

		$scope.currentProduct = newProduct;

		$scope.choices = new Array();

		newProduct.menuId = $scope.currentMenu.id;
	}

	function saveProductSuccess(product) {
		$scope.products.push(product);
		$scope.currentMenu.productIds.push(product.id);
		$scope.productImageResource = Product.buildImageResource(activeBusinessId, product.id);
		$scope.saveMenu();
	}

	$scope.saveProduct = function(product) {
		$log.log("save product");

		var productToSave = product || $scope.currentProduct;

		if(!validator.validateModel(productToSave, requiredProductFields)) {
			$scope.productInvalid = true;
			return;
		}

		$scope.productInvalid = false;

		if(productToSave && productToSave.id) {
			productToSave.$update(null, null, handleError);
		} else {
			productToSave.$create(saveProductSuccess, handleError);
		}
	}

	$scope.updateProductOrder = function(event, ui) {
		$log.log("updateProductOrder");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpProduct;

		// Clear product sort array.
		$scope.currentMenu.productIds = [];
		$scope.products.splice(0, $scope.products.length);

		liElements.each(function(index, ele) {
			//get corresponding product
			tmpProduct = angular.element(ele).scope().product;
			if(tmpProduct) {
				$scope.products.push(tmpProduct);
				$scope.currentMenu.productIds.push(tmpProduct.id);
				$log.log("set product " + tmpProduct.name + " index to " + (index));
			}
		});

		$scope.saveMenu();
	};

	$scope.moveProduct = function(event, ui) {
		$log.log("moveProduct");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpProduct = null,
			destinationMenu = ui.sender.attr("id") == "organizeList1" ? $scope.organizeMenusContext.menu2 : $scope.organizeMenusContext.menu1;

		if(!$scope.organizeMenusContext.menu1 || !$scope.organizeMenusContext.menu2) {
			$log.warn("Two menus must be selected to assign products.");
			return false;
		}

		liElements.each(function(index, ele) {
				//get corresponding choice resource by optaining the angular scope
				tmpProduct = angular.element(ele).scope().product;
				if(tmpProduct.menuId != destinationMenu.id) {
					$log.log("move product " + tmpProduct.name +"("+tmpProduct.id+") to menu " + destinationMenu.title + "(" + destinationMenu.id + ")");	
					tmpProduct.menuId = destinationMenu.id;
				}				
				tmpProduct.order = index;
				// tmpProduct.$update(null, null, handleError);
		});
	};

	$scope.moveProductToMenu = function(menuItem) {
		var productToMove = $scope.currentProduct,
			products = $scope.products || $scope.orphanedProducts;
		
		productToMove.menuId = menuItem.id,
		menuItem.productIds.push(productToMove.id);
		// Save new product order.
		menuItem.$update(angular.noop, handleError);
		productToMove.$update(angular.noop, handleError);

		manageViewHiearchy("moved-product");

		
		angular.forEach(products, function(product, index) {
			if(product.id == productToMove.id) {
				//remove from currentMenu 
				if($scope.currentMenu) {					
					$scope.currentMenu.productIds.splice(index,1);
					//TODO do we have to save old menu?
					$scope.currentMenu.$update(angular.noop, handleError);
				}
				if($scope.currentMenu || $scope.orphanedProducts) {
					products.splice(index, 1);
				}				
				//exist loop
				return false;
			}
		});
		
	};

	/**
	*
	* Lists all available products for current business.
	*/
	$scope.showAllProductsList = function() {
		$scope.allProductsList = $scope.productsResource.query(null, null, null, handleError);
		//reset search filter
		$scope.allProductsQuery = {}

		manageViewHiearchy("all-products-list");
	}

	/**
	* Check/Uncheck products regarding the search filter.
	* If less then all filtered spots are checked, check all of them. Otherwise uncheck all.
	*/
	$scope.checkProducts = function() {
		listUtil.checkElements($scope.allProductsList, $scope.allProductsQuery);
	}

	/**
	* Toggle active filter on/off on all products.
	*
	*/
	$scope.toggleProductActiveFilter = function() {
		if(!$scope.allProductsQuery) {
			$scope.allProductsQuery = {
				'active' : false
			}
			return;
		}

		if($scope.allProductsQuery.active === false) {
			delete $scope.allProductsQuery.active;
		} else {
			$scope.allProductsQuery.active = false;
		}

		listUtil.checkElements($scope.allProductsList, null, true);
	}

	/**
	* Toggle special filter on/off on all products.
	*
	*/
	$scope.toggleProductSpecialFilter = function() {
		if(!$scope.allProductsQuery) {
			$scope.allProductsQuery = {
				'special' : true
			}
			return;
		}

		if($scope.allProductsQuery.special == true) {
			delete $scope.allProductsQuery.special;
		} else {
			$scope.allProductsQuery.special = true;
		}

		listUtil.checkElements($scope.allProductsList, null, true);
	}

	/**
	* Toggle noOrder filter on/off on all products.
	*
	*/
	$scope.toggleProductNoOrderFilter = function() {
		if(!$scope.allProductsQuery) {
			$scope.allProductsQuery = {
				'noOrder' : true
			}
			return;
		}

		if($scope.allProductsQuery.noOrder == true) {
			delete $scope.allProductsQuery.noOrder;
		} else {
			$scope.allProductsQuery.noOrder = true;
		}

		listUtil.checkElements($scope.allProductsList, null, true);
	}
	

	/**
	* Toggle hideInDashboard filter on/undefined on all products.
	*
	*/
	$scope.toggleProductHideInDashboardFilter = function() {
		if(!$scope.allProductsQuery) {
			$scope.allProductsQuery = {
				'hideInDashboard' : true
			}
			return;
		}

		if($scope.allProductsQuery.hideInDashboard == true) {
			delete $scope.allProductsQuery.hideInDashboard;
		} else {
			$scope.allProductsQuery.hideInDashboard = true;
		}

		listUtil.checkElements($scope.allProductsList, null, true);
	}

	/**
	* Toggle hideInDashboard filter off/undefined on all products.
	*
	*/
	$scope.toggleProductVisibleOnDashboardFilter = function() {
		if(!$scope.allProductsQuery) {
			$scope.allProductsQuery = {
				'hideInDashboard' : false
			}
			return;
		}

		if($scope.allProductsQuery.hideInDashboard === false) {
			delete $scope.allProductsQuery.hideInDashboard;
		} else {
			$scope.allProductsQuery.hideInDashboard = false;
		}

		listUtil.checkElements($scope.allProductsList, null, true);
	}

	/**
	* Helper method for all products list in menu partial.
	* Checks if filter for shown on dashboard is set to === false
	*/
	$scope.isQueryVisibleOnDashboardActive = function() {
		if(!$scope.allProductsQuery) {
			return false;
		}

		return $scope.allProductsQuery.hideInDashboard === false;
	}

	/**
	* Sets a properties value for all checked products.
	* @param {String} prop
	*	property to set
	* @param {String|Boolean|Number} value
	*	value to set property to
	*/
	$scope.setCheckedProductsProperty = function(prop, value) {
		var ids = [],
			//used in forEach to match returned elements with local ones
			foundElement,
			params;

		if(!$scope.allProductsList && $scope.allProductsList.length > 0) {
			$log.log('Menu.setCheckedProductsProperty: $scope.allProductsList does not exist or is empty.');
			return;
		}

		if(!$scope.productsResource) {
			$log.log('Menu.setCheckedProductsProperty: $scope.productsResource does not exist.');
			return;	
		}

		if(!prop) {
			$log.log('Menu.setCheckedProductsProperty: prop not given');
			return;
		}

		if(angular.isUndefined(value)) {
			$log.log('Menu.setCheckedProductsProperty: value not given');
			return;
		}


		angular.forEach($scope.allProductsList, function(element, index) {
			if(element.checked) {
				ids.push(element.id);	
			}			
		});

		//No elements selected
		if(ids.length == 0) {
			return;	
		}
		//setup request params 
		params = {
			'ids' : ids
		}

		params[prop] = value;

		$scope.productsResource.process(
			params, 
			function(response) {
				//update status on success
				angular.forEach($scope.allProductsList, function(element, index) {
					foundElement = jQuery.grep(response, function(spotFromResponse) {
						return spotFromResponse.id == element.id;
					});

					if(foundElement.length > 1) {
						$log.warn('Menu.setCheckedProductsProperty: more than one returned spot matches with local ones!');
					} else if(!foundElement || foundElement.length == 0) {
						$log.warn('Menu.setCheckedProductsProperty: no matching spot found');
					} else {
						//replace old spot with updated
						$scope.allProductsList[index] = foundElement[0];
					}	
				});
			},
			handleError
		);

		manageViewHiearchy("all-products-list");
	}

	/**
	*
	* Lists all available products for current business.
	*/
	$scope.showAllProducts = function() {
		$scope.allProducts = $scope.productsResource.query(null, null, null, handleError);

		manageViewHiearchy("all-products");
	}

	$scope.copyProduct = function(productToCopy, type) {
		var copiedProduct = angular.copy(productToCopy);

		if(!$scope.currentMenu) {
			$log.log("Can't copy product because no current menu exists.");
			return;
		}

		if(!productToCopy) {
			$log.error("No product to copy provided!");
			return;
		}

		$log.log("copying product " + productToCopy.id);

		//set id null to indicate new status
		copiedProduct.id = null;
		copiedProduct.name += langService.translate("menus.product.copy.name");
		//assign to active menu
		copiedProduct.menuId = $scope.currentMenu.id;

		if(type == "link") {
			linkChoicesToProduct(copiedProduct, productToCopy.id, onSuccess);
		} else if (type == "copy") {
			copyChoicesForProduct(copiedProduct, productToCopy.id, onSuccess);
		} else {
			onSuccess();
		}

		function onSuccess() {
			copiedProduct.$save(null, saveProductSuccess, handleError);
			$scope.allProducts = null;
		}

	}

	function linkChoicesToProduct(product, productId, callback) {
		var choices = null;
		$log.log("linking choices to product");
		choices = choicesResource.query({"productId": productId},null,onSuccess,handleError);

		function onSuccess() {
			product.choices = choices;

			callback();
		}		
	}

	function copyChoicesForProduct(product, productId, callback) {
		var choices = null;
		$log.log("copying choices for product");
		choices = choicesResource.query({"productId": productId},null,onSuccess,handleError);

		function onSuccess() {
			angular.forEach(choices, function(choice) {
				choice.id = null;
			});

			product.choices = choices;

			callback();
		}		
	}

	$scope.deleteProduct =  function(productToDelete) { 
		var products = $scope.products || $scope.orphanedProducts,
			indexToDelete;

		productToDelete.$delete(angular.noop, handleError);

		angular.forEach(products, function(product, index) {
			if(productToDelete.id == product.id) {
				products.splice(index, 1);
				//exit loop
				return false;
			}
		});

		angular.forEach($scope.currentMenu.productIds, function(productId, index) {
			if(productId == productToDelete.id) {
				indexToDelete = index;
			}
		});

		$scope.currentMenu.productIds.splice(indexToDelete,1);

		$scope.saveMenu();

		manageViewHiearchy("moved-product");
	}

	$scope.removeChoice = function(currentChoice) {
		var choiceToRemove = currentChoice, //$scope.choices[index],
			tmpChoiceArray = new Array();


		if(!choiceToRemove) {
			$log.error("Removing choice failed. No choice given.");
			return;
		}
		//remove the choice
		// $scope.choices.splice(index, 1);

		//add all choices to tmpArray that are not linked to removed choice
		angular.forEach($scope.choices, function(element, index) {
			if(choiceToRemove.id != element.id && element.parent != choiceToRemove.id) {
				tmpChoiceArray.push(element);
			}
		});

		// $scope.currentProduct.choices = tmpChoiceArray;
		// $scope.currentProduct.$update(null, null, handleError);

		currentChoice.$delete({'productId':$scope.currentProduct.id,'id':currentChoice.id}, success, handleError);
 

		$scope.choices = tmpChoiceArray;

		function success() {
			$scope.currentChoice = null;
		}

		//if current selected choice is the removed on, hide it
		// if($scope.currentChoice && choiceToRemove.id == $scope.currentChoice.id) {
			
		// }		
	}

	/**
	* @deprecated
	* Load product by an id.
	* @param
	*	product Id
	*/
	$scope.loadProductById = function(id) {	
		var found = null;
		if(found) {
			$scope.loadProduct(found);	
		}
	};

	/**
	* Toggle active state of menu.
	* Executes a save afterwards.
	*/
	$scope.toggleProductActive = function(product) {
		var productToToggle = product || $scope.currentProduct;

		productToToggle.active = !productToToggle.active;
		$scope.saveProduct(productToToggle);
	}

	/**
	* Toggle special flag of product.
	* Executes a save afterwards.
	*/
	$scope.toggleProductSpecial = function(product) {
		var productToToggle = product || $scope.currentProduct;

		productToToggle.special = !productToToggle.special;
		$scope.saveProduct(productToToggle);
	}

	/**
	* Toggle noOrder flag of product.
	* Executes a save afterwards.
	*/
	$scope.toggleProductNoOrder = function(product) {
		var productToToggle = product || $scope.currentProduct;

		productToToggle.noOrder = !productToToggle.noOrder;
		$scope.saveProduct(productToToggle);
	}	

	/**
	* Toggle sepcial flag of product.
	* Executes a save afterwards.
	*/
	$scope.toggleProductDashboard = function(product) {
		var productToToggle = product || $scope.currentProduct;
		
		productToToggle.hideInDashboard = !productToToggle.hideInDashboard;
		$scope.saveProduct(productToToggle);
	}

	//End Product logic

	// //Start Choice logic
	$scope.loadChoice = function(choiceItem) {
		manageViewHiearchy("choice");
		$scope.currentChoice = choiceItem;

		$scope.linkedProductsForChoice = $scope.productsResource.query({"choiceId" : $scope.currentChoice.id},null,null, handleError);

	};


	function saveChoiceSuccess(choice) {
		$scope.choices.push(choice);
	}

	$scope.saveChoice = function() {

		if(!validator.validateModel($scope.currentChoice, requiredChoiceFields)) {
			$scope.choiceInvalid = true;
			return;
		}

		$scope.choiceInvalid = false;

		if($scope.currentChoice && $scope.currentChoice.id) {
			$scope.currentChoice.$update(null, null, handleError);	
		} else {
			$scope.currentChoice.$create(saveChoiceSuccess, handleError);
		}

	};

	$scope.createChoice = function() {
		$log.log("createChoice");
		
		manageViewHiearchy("choice");

		var newChoice = new choicesResource(defaultChoice);
		//reset currentChoice, because we don't want them to be displayed along the new product
		$scope.currentChoice = newChoice;

		$scope.linkedProductsForChoice = null;

		$scope.options = new Array();

		$scope.addOption();

		newChoice.productId = $scope.currentProduct.id;
	}

	$scope.addOption = function() {
		$scope.currentChoice.options.push(angular.copy(defaultOption));
	};
	
	$scope.removeOption = function(index) {
		if($scope.currentChoice.options.length > 1) {
			$scope.currentChoice.options.splice(index, 1);
			$scope.saveChoice();	
		}		
	};

	$scope.updateChoiceOrder = function(event, ui) {
		$log.log("updateChoiceOrder");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpChoice = null,
			updateArray = new Array();

		if(!$scope.currentProduct) {
			$log.log("Can't update choice order because no current product exists.");
			return;
		}

		liElements.each(function(index, ele) {
			if(index > 0) {
				//get corresponding choice resource by optaining the angular scope
				tmpChoice = angular.element(ele).scope().choice;
				// $log.log("set choice " + tmpChoice.text + " index from " + tmpChoice.order + " to " + (index+1));
				// tmpChoice.order = index + 1;
				updateArray.push({"id":tmpChoice.id});
							
				// tmpChoice.$update({"bid" : activeBusinessId});
			}	
		});

		$scope.currentProduct.choices = updateArray;
		$scope.currentProduct.$update(null, null, handleError);
	};

	$scope.showAllChoices = function() {

		$scope.allChoices = choicesResource.query(null, null, null, handleError);

		manageViewHiearchy("all-choices");
	}

	$scope.filterOnlyChoiceParents = function(choiceToFilter) {
		if(!choiceToFilter.parent) {
			return true;
		}
		return false;
	}

	$scope.filterOnlyNotLinkedChoices = function(choiceToFilter) {
		var include = true;

		if(!choiceToFilter) {
			return true;
		}

		angular.forEach($scope.choices, function(choice) {
			if(choice.id == choiceToFilter.id) {
				include = false;
				return false;
			}
		});

		return include;
	}

	$scope.linkChoice = function(choiceToLink) {
		var productId = null;

		if(!$scope.currentProduct) {
			$log.log("Can't link choice because no current product exists.");
			return;
		}

		productId = $scope.currentProduct.id;

		choiceToLink.productId = productId;
		// choiceToLink.$update(null, null, handleError);

		$scope.choices.push(choiceToLink);

		angular.forEach($scope.allChoices, function(element, key) {
			if(element.parent == choiceToLink.id) {
				element.productId = productId;
				$scope.choices.push(element);
				return;
			}
		});

		$scope.currentProduct.choices = $scope.choices;

		$scope.currentProduct.$update(null, null, handleError);

		manageViewHiearchy("product");
	}

	$scope.copyChoice = function(choiceToCopy) {
		var copiedChoice = angular.copy(choiceToCopy),
			copiedSubChoice = null,
			originalId;

		if(!$scope.currentProduct) {
			$log.log("Can't copy choice because no current product exists.");
			return;
		}

		originalId = choiceToCopy.id;
		copiedChoice.id = null;
		copiedChoice.productId = null;

		copiedChoice.$save(null, successChoiceSaved, handleError);

		function successChoiceSaved() {
			$scope.choices.push(copiedChoice);

			angular.forEach($scope.allChoices, function(element, key) {
				if(element.parent == originalId) {
					copiedSubChoice = angular.copy(element);
					copiedSubChoice.id = null;
					copiedSubChoice.productId = null;
					$scope.choices.push(element);
					return;
				}
			});

			$scope.currentProduct.choices = $scope.choices;
			$scope.currentProduct.$update(null, successProductSaved, handleError);

		}

		function successProductSaved() {
			$scope.choices = choicesResource.query({"productId": $scope.currentProduct.id},null,null,handleError);

			manageViewHiearchy("product");
		}

		// $scope.currentProduct.$update(null, success, handleError);
		
	}

	/**
	* Checks if this choice is a parent choice. A choice is a parent
	* when other choices have it assigned in their parent property.
	* @param choice
	*	Choice to check.
	* @return
	*	true if parent
	*/
	$scope.isParent = function(choiceId) {
		var status = false;

		if(!choiceId) {
			return false;
		}

		angular.forEach($scope.choices, function(element, key) {
			if(element.parent == choiceId) {
				status = true;
				return;
			}
		});

		return status;
	}

	$scope.excludeChoice = function(element) {
		if(!$scope.currentChoice || !element || $scope.currentChoice.id == element.id || element.parent) {
			return false;
		}
		return true;
	}

	//initialize price selection popover help
	jQuery('#choiceOverridePriceLabel').popover({
		placement: 'left',
		title: langService.translate("common.help"),
		trigger: 'hover',
		html: true,
		content: langService.translate("menus.choices.field.overridePrice.description")
	});

		//initialize action column help popover
	jQuery('#menusLinkHelp').popover({
		placement: 'left',
		title: langService.translate("common.help"),
		trigger: 'hover',
		html: true,
		content: langService.translate("menus.products.link.description.popover")
	});

	//initialize general symbol help
	jQuery('#symbolLegend').popover({
		placement: 'right',
		title: langService.translate("common.help"),
		trigger: 'hover',
		html: true,
		content: langService.translate("menus.help.symbols.popover")
	});

	//End Choice logic

	/**
	* @private
	* Show products and hides all other sub views.
	*/
	function manageViewHiearchy(state) {
		//ui binds to state of sub elements, to hide them simply set them null
		//but keep parents intact

		switch (state) {
			case "menus":
				$scope.currentMenu = null;
				$scope.products = null;			
			case "menu":
				$scope.allProductsList = null;
				$scope.menuInvalid = false;
				$scope.currentProduct = null;
				$scope.orphanedProducts = null;
				$scope.organizeMenusContext = null;			
			case "product":
				$scope.currentChoice = null;
				$scope.productInvalid = false;
				$scope.allProducts = null;
			case "choice":
				$scope.allChoices = null;
				$scope.choiceInvalid = false;
				break;
			case "all-choices":
				$scope.currentChoice = null;
				break;
			case "all-products-list":
				$scope.orphanedProducts = null;
				$scope.currentMenu = null;
				$scope.products = null;
				$scope.allProducts = null;
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.organizeMenusContext = null;
				break;
			case "orphaned-products":
				$scope.allProductsList = null;
				$scope.currentMenu = null;
				$scope.products = null;
				$scope.allProducts = null;
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.organizeMenusContext = null;
				break;
			case "all-products":
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.orphanedProducts = null;
				$scope.organizeMenusContext = null;
				$scope.allChoices = null;
				break;
			case "organize-menus":
				$scope.organizeMenusContext = {};
				$scope.currentMenu = null;
				$scope.allProducts = null;
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.orphanedProducts = null;
				$scope.allChoices = null;
			break;
			case "moved-product": 
				$scope.allProducts = null;
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.allChoices = null;
			break;
		}
	};

	//end utility

	$scope.setLocationAndLoadMenu = function(menuId) {
		$scope.loadMenu(menuId);
		$location.path($location.path() + "/" + menuId);		
	};

	// Product image methods

	$scope.setProductImage = function(image) {
		$scope.currentProduct.image = {
			url: image.url,
			blobKey: image.blobKey
		};
	}

	$scope.deleteProductImage = function() {
		if($scope.productImageResource) {
			var product = $scope.currentProduct;
			$scope.productImageResource.remove(null,null, function() {
				product.image = null;
			}, handleError);	
		}
	};

	$scope.discardImage = function(image) {
		if(image && image.blobKey) {
			$http['delete']('/uploads/images/' + image.blobKey)
			.error(handleError);
		}
	}

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var menuId = $routeParams.menuId || "",
			businessId = $routeParams.businessId || "";

		//always load menus
		$scope.loadMenus(businessId);
	});
}

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', '$filter', 'login', 'Business', 'Menu', 'Product', 'Choice', 'lang', '$log', 'errorHandler', 'validator', 'listUtil'];