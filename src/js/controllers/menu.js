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
Cloobster.Menu = function($scope, $http, $routeParams, $location, loginService, Business, Menu, Product, Choice, langService, $log) {

	var activeBusinessId = null,
		choicesResource = null,
		/** Default values for new menus.*/
		defaultMenu = {
			title: langService.translate("menu.new.default.title") || "My new Menu",
			active: false
		},
		/** Default values for new products. */
		defaultProduct = {
			name: langService.translate("product.new.default.name") || "My new Product",
			price: 1,
			shortDesc: "",
			longDesc: "",
			active: false
		},
		/** Default values for new choices. */
		defaultChoice = {
			text: langService.translate("choice.new.default.text") || "My new choice",
			minOccurence: 0,
			maxOccurence: 0,
			price: 0,
			included: 0,
			overridePrice: "NONE",
			parent : null,
			options: new Array()
		},
		/** Default values for new options. */
		defaultOption = {
			name: langService.translate("option.new.default.name") || "My new option",
			price: 0
		};

	/** error flag */
	$scope.error = false;
	/** error message */
	$scope.errorMessage = "";
	/** Menu Resource. */
	$scope.menusResource = null;
	/** */
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

	/**
	* Set error false and hide the error box.
	*/
	$scope.hideError = function() {
		$scope.error = false;
	};

	/**
	*	Callback for errors during Resource methods.(get,save,query, etc.).
	*	
	*	@private
	*	@param {Object} response Object containing response and request data of the failed HTTP request.
	*/
	function handleError(response) {
		$scope.error = true;
		$scope.errorMessage = (response.data.hasOwnProperty('message') && response.data.message ?

			response.data.message
			: langService.translate('common.error.'+ response.status));
		if(!$scope.errorMessage) {
			// Translate a generic error message
			$scope.errorMessage = langService.translate('common.error')|| "Error during communication with service.";
		}
		// Log the response.
		$log.error("Error during resource method, response data: " + angular.toJson(response));
	}

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

		jQuery( "#menuList" ).sortable({
			// connectWith: ".connectedSortable",
			items: 'li.sortable',
			axis: "y",
			update: function(event, ui) { 
				$scope.updateMenuOrder(event, ui);
			}
		}).disableSelection();
		
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
	};

	$scope.loadMenu = function(menuItem) {
		$log.log("load menu " + menuItem.id);
		
		manageViewHiearchy("menu");

		$scope.currentMenu = menuItem;

		$scope.products = $scope.productsResource.query({"menuId" : menuItem.id},null, null, handleError);

	};


	$scope.saveMenu = function() {
		$log.log("save menu ");

		if($scope.currentMenu && $scope.currentMenu.id) {
			$scope.currentMenu.$update(null, null, handleError);	
		} else {
			$scope.currentMenu.$save(saveMenuSuccess, handleError);
		}

		function saveMenuSuccess(menu) {
			$scope.menus.push(menu);
		}
		
	};

	$scope.createMenu = function() {
		$scope.currentMenu = new $scope.menusResource(defaultMenu);

		// $scope.currentChoice = null;
		// $scope.allChoices = null;
		// $scope.allProducts = null;
		// $scope.currentProduct = null;
		manageViewHiearchy("menu");

		$scope.products = new Array();
		$scope.choices = new Array();
	};

	$scope.updateMenuOrder = function(event, ui) {
		$log.log("updateMenuOrder");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpMenu = null; //holds current menu in for each loop

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
		menuToDelete.$delete(emptyFn, handleError);

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

	//End Menu logic

	//Start Product logic
	$scope.loadProduct = function(productItem) {
		$log.log("load product " + productItem.id);

		manageViewHiearchy("product");
		

		$scope.currentProduct = productItem;
		$scope.choices = choicesResource.query({"productId": productItem.id},null,null,handleError);
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
	}

	$scope.saveProduct = function() {
		$log.log("save product");

		var product = $scope.currentProduct;

		if(product && product.id) {
			product.$update(null, null, handleError);	
		} else {
			product.$save(saveProductSuccess, handleError);
		}

	}

	$scope.updateProductOrder = function(event, ui) {
		$log.log("updateProductOrder");
		var liElements = ui.item.parent().children(), //get all li elements
			tmpProduct = null;

		liElements.each(function(index, ele) {
			if(index > 0) {
				//get corresponding choice resource by optaining the angular scope
				tmpProduct = angular.element(ele).scope().product;
				$log.log("set product " + tmpProduct.name + " index from " + tmpProduct.order + " to " + (index));
				tmpProduct.order = index;
				tmpProduct.$update(null, null, handleError);
			}	
		});
	};

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
		productToDelete.$delete(emptyFn, handleError);

		angular.forEach($scope.products, function(product, index) {
			if(productToDelete.id == product.id) {
				$scope.products.splice(index, 1);
				//exit loop
				return false;
			}
		});

		manageViewHiearchy("menu");
	}

	$scope.removeChoice = function(currentChoice) {
		var choiceToRemove = currentChoice, //$scope.choices[index],
			tmpChoiceArray = new Array();


		if(!choiceToRemove) {
			$log.error("Removing choice failed. No choice exists at index " + index);
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

		$scope.currentProduct.choices = tmpChoiceArray;
		$scope.currentProduct.$update(null, null, handleError);

		$scope.choices = tmpChoiceArray;

		//if current selected choice is the removed on, hide it
		if($scope.currentChoice && choiceToRemove.id == $scope.currentChoice.id) {
			$scope.currentChoice = null;
		}		
	}

	/**
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

	//End Product logic

	// //Start Choice logic
	$scope.loadChoice = function(choiceItem) {
		manageViewHiearchy("choice");
		$scope.currentChoice = choiceItem;

		$scope.linkedProductsForChoice = $scope.productsResource.query({"choiceId" : $scope.currentChoice.id},null,null);

	};


	function saveChoiceSuccess(choice) {
		$scope.choices.push(choice);
	}

	$scope.saveChoice = function() {
		if($scope.currentChoice && $scope.currentChoice.id) {
			$scope.currentChoice.$update(null, null, handleError);	
		} else {
			$scope.currentChoice.$save(saveChoiceSuccess, handleError);
		}

	};

	$scope.createChoice = function() {
		$log.log("createChoice");
		
		manageViewHiearchy("choice");

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
		$scope.saveChoice();
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

	//End Choice logic

	//start utility

	function emptyFn() {

	}


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
				// $scope.currentProduct = null;
				// $scope.currentChoice = null;
				// $scope.allChoices = null;
				// $scope.allProducts = null;
				// $scope.orphanedProducts = null;
				// break;
			case "menu":
				$scope.currentProduct = null;
				// $scope.currentChoice = null;
				// $scope.allChoices = null;
				// $scope.allProducts = null;
				$scope.orphanedProducts = null;
				// break;
			case "product":
				$scope.currentChoice = null;
				// $scope.allChoices = null;
				$scope.allProducts = null;
				// break;
			case "choice":
				$scope.allChoices = null;
				// $scope.allProducts = null;
				break;
			case "all-choices":
				$scope.currentChoice = null;
				// $scope.allProducts = null;
				break;
			case "orphaned-products":
				$scope.currentMenu = null;
				$scope.allProducts = null;
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				break;
			case "all-products":
				$scope.currentProduct = null;
				$scope.currentChoice = null;
				$scope.orphanedProducts = null;
			break;
		}
	}

	//end utility

	$scope.setLocationAndLoadMenu = function(menuId) {
		$scope.loadMenu(menuId);
		$location.path($location.path() + "/" + menuId);		
	};

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var menuId = $routeParams.menuId || "",
			businessId = $routeParams.businessId || "";

		//always load menus
		$scope.loadMenus(businessId);
	});
}

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Menu', 'Product', 'Choice', 'lang', '$log'];