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
Cloobster.Menu = function($scope, $http, $routeParams, $location, loginService, Business, Menu, Product, Choice, langService, $log, handleError) {

	var activeBusinessId = null,
		choicesResource = null,
		/** Default values for new menus.*/
		defaultMenu = {
			title: langService.translate("menu.new.default.title") || "My new Menu",
			active: true
		},
		/** Default values for new products. */
		defaultProduct = {
			name: langService.translate("product.new.default.name") || "My new Product",
			price: 0,
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
			options: new Array()
		},
		/** Default values for new options. */
		defaultOption = {
			name: langService.translate("option.new.default.name") || "My new option",
			price: 0
		};

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
	/** Holds all necessary innformation during menu organization. */
	$scope.organizeMenusContext = false;

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
		var order = 0;

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
		$scope.currentMenu.productIds.push(product.id);
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
			tmpProduct;

		// Clear product sort array.
		$scope.currentMenu.productIds = [];

		liElements.each(function(index, ele) {
			//get corresponding product
			if(index > 0) {
				tmpProduct = angular.element(ele).scope().product;
				if(tmpProduct) {
					$scope.currentMenu.productIds.push(tmpProduct.id);
					$log.log("set product " + tmpProduct.name + " index to " + (index));
				}
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

		angular.forEach(products, function(product, index) {
			if(product.id == productToMove.id) {
				$scope.currentMenu.productIds.splice(index,1);
				products.splice(index, 1);
				//exist loop
				return false;
			}
		});
		productToMove.$update(angular.noop, handleError);

		manageViewHiearchy("moved-product");
	
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

		$scope.linkedProductsForChoice = $scope.productsResource.query({"choiceId" : $scope.currentChoice.id},null,null, handleError);

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
				$scope.organizeMenusContext = null;
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

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var menuId = $routeParams.menuId || "",
			businessId = $routeParams.businessId || "";

		//always load menus
		$scope.loadMenus(businessId);
	});
}

Cloobster.Menu.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'Business', 'Menu', 'Product', 'Choice', 'lang', '$log', 'errorHandler'];