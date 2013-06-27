/** @module Cloobster/Wizard */
'use strict';

/**
* 	@name Cloobster.Wizard 
*	@requires $location
*	@requires Clooobster.Services.login
*
* 	Profile controller 
* 	View and manage wizard.
* 	@constructor
*/
Cloobster.Wizard = function($scope, $http, $location, $resource, loginService, Company, $routeParams, handleError, Business, $route, $log, $rootScope, Spot, $injector, InfoPage, Menu, Product, randomUtil, langService, DashboardItem, appConfig) {
	var businessResource = null;

	/* Holds data of wizard. */
	$scope.wizard = {
		offers : [{}, {}, {}],
		complete: false,
		progress: {}
	};

	//a dummy resource used for image uploads. the correct saving happens later with the correct resource
	$scope.imageResource =	$resource('');

	//wizard logic
	$scope.generateApp = function() {
		if(!$scope.wizard) {
			//no wizard data
			return;
		}

		$scope.wizardForm.$dirty = true;
		$scope.wizardForm.newLocationName.$dirty = true;
		$scope.wizardForm.infopageDescription.$dirty = true;
		$scope.wizardForm.offer1Title.$dirty = true;
		$scope.wizardForm.offer1Shortdesc.$dirty = true;
		$scope.wizardForm.offer1Price.$dirty = true;

		if($scope.wizardForm.$valid) {
			//fire initial creation event
			// $rootScope.$broadcast('wizard-create-app', $scope.wizard);
			addBusinessByWizard($scope.wizard, locationCreated);
		}

		function locationCreated(location) {
			loadWelcomeSpot(location);
			addInfopageByWizard($scope.wizard, location);
			addProductsByWizard($scope.wizard, location);
			saveLocationImages($scope.wizard, location);
		}
	}

	//create business
	function addBusinessByWizard(wizardData, callback) {
		var resource,
			entity;

		if(!wizardData || !wizardData.newLocationName) {
			$log.log('Wizard: cannot save business without name');
			return;
		}

		$log.log('Wizard: generate business: ' + wizardData.newLocationName);

		resource = Business.buildResource(loginService.getAccount().id);
		entity = new resource({
			"name": wizardData.newLocationName,
			"fbUrl": wizardData.fbUrl
		});

		entity.$save(function(response) {
			$scope.$broadcast('update-businesses');		
			$scope.createdLocation = entity;
			$scope.wizard.progress.location = true;			
			callback(entity);
		}, handleError);
	}

	function checkWizardAndLocation(wizardData, property, location) {
		if(!wizardData || !wizardData[property]) {
			$log.log('Wizard: cannot proceed without wizard data for ' + property);
			return false;
		}

		if(!location || !location.id) {
			$log.log('Wizard: cannot proceed without location');
			return false;
		}

		return true;
	}

	function saveLocationImages(wizardData, location) {
		var resource,
			image;
		//get image resource
		//save images

		if(!checkWizardAndLocation(wizardData, 'images', location)) {
			return;
		}

		if(!wizardData.images) {
			$log.log('Wizard.saveLocationImages: No images exist.');
			return;
		}

		resource = Business.buildImageResource(location.id);

		if(wizardData.images.logo) {
			image = new resource({
				id: wizardData.images.logo.id,
				blobKey: wizardData.images.logo.blobKey,
				url: wizardData.images.logo.url
			});
			image.$save();
		}

		if(wizardData.images.appheader) {
			image = new resource({
				id: wizardData.images.appheader.id,
				blobKey: wizardData.images.appheader.blobKey,
				url: wizardData.images.appheader.url
			});
			image.$save();
		}

		if(wizardData.images.fbwallpost) {
			image = new resource({
				id: wizardData.images.fbwallpost.id,
				blobKey: wizardData.images.fbwallpost.blobKey,
				url: wizardData.images.fbwallpost.url
			});
			image.$save();
		}

		//set progress 
		// $scope.wizard.progress.images = true;
	}

	function saveProductImage(wizardData, location, imageId, product) {
		var resource,
			image;


		if(!checkWizardAndLocation(wizardData, 'images', location)) {
			return;
		}

		if(!product || product.id) {
			$log.log("Wizard.saveProductImage: no product");
			return;
		}

		if(!wizardData.images[imageId]) {
			$log.log("Wizard.saveProductImage: no image for product " + product.id);
			return;
		}

		resource = Product.buildImageResource(location.id, product.id);

		image = new resource({
			id: wizardData.images[imageId].id,
			blobKey: wizardData.images[imageId].blobKey,
			url: wizardData.images[imageId].url
		});

		image.$save();

		// if(wizardData.images.offer2) {
		// 	resource = Product.buildImageResource(location.id, wizardData.offers[1].id);

		// 	image = new resource({
		// 		id: wizardData.images.offer2.id,
		// 		blobKey: wizardData.images.offer2.blobKey,
		// 		url: wizardData.images.offer2.url
		// 	});
		// 	image.$save();
		// }

		// if(wizardData.images.offer3) {
		// 	resource = Product.buildImageResource(location.id, wizardData.offers[2].id);

		// 	image = new resource({
		// 		id: wizardData.images.offer3.id,
		// 		blobKey: wizardData.images.offer3.blobKey,
		// 		url: wizardData.images.offer3.url
		// 	});
		// 	image.$save();
		// }
	}

	//create infopage
	function addInfopageByWizard(wizardData, location) {
		var infopage,
			resource;

		if(!wizardData || !wizardData.infopageDescription) {
			$log.log('Wizard: cannot create infopage without data');
			return;
		}

		if(!location || !location.id) {
			$log.log('Wizard: cannot create infopage without location id');
			return;
		}
		

		resource = InfoPage.buildResource(location.id);
		infopage = new resource({ 'translations' : {} });

		infopage.title = langService.translate("appwizard.infopage.title");
		infopage.html = wizardData.infopageDescription;
		infopage.$save(function() {
			$scope.wizard.progress.infopages = true;
		}, handleError);		
	}

	function addProductsByWizard(wizardData, location) {
		var mResource,
			pResource,
			menu,
			product;

		if(!wizardData) {
			$log.log('Wizard: cannot create products without data');
			return;
		}

		if(!location || !location.id) {
			$log.log('Wizard: cannot create products without location id');
			return;
		}

		mResource = Menu.buildResource(location.id);
		pResource = Product.buildResource(location.id);

		menu = new mResource({
			title: "Angebote",
			active: true
		});

		menu.$save(saveProducts, handleError);

		function saveProducts() {
			angular.forEach(wizardData.offers, function(offer, index) {

				if(offer.title && offer.shortDesc && offer.price) {
					product = new pResource({
						name: offer.title,
						shortDesc: offer.shortDesc,
						longDesc: offer.shortDesc,
						price: offer.price,
						menuId: menu.id,
						active: true
					});	

					product.choices = new Array();
					product.$save(function(response) {
						var _imageIndex = index + 1,
							_productImageId = 'offer' + _imageIndex;

						saveProductImage(wizardData, location, _productImageId, response);
						if(index == wizardData.offers.length - 1) {
							$scope.wizard.progress.products = true;
						}
					}, handleError);
				} else {
					if(index == wizardData.offers.length - 1) {
						$scope.wizard.progress.products = true;
					}
				}
		
			});
		}
	}

	function resetWizard() {

	}

	function loadWelcomeSpot (location) {
		
		if(!location) {
			$log.log('Wizard: cannot load spot without location');
			return;
		}

		if(!$scope.spotResource) {
			$scope.spotResource = Spot.buildResource($rootScope.activeBusinessId);
		}

		$scope.welcomeSpots = $scope.spotResource.query({'bid' : location.id, 'welcome' : true});
	}

	$scope.setWizardImage = function(image, type) {
		var _id = image.id;

		$scope.wizard.images = $scope.wizard.images || {};
		$scope.wizard.images[_id] = image;
	}

	$scope.deleteWizardImage = function(imageId) {

		if(!$scope.wizard || !$scope.wizard.images ||  !$scope.wizard.images[imageId] || !$scope.wizard.images[imageId].blobKey) {
			$log.log('Wizard.deleteWizardImage: no image to delete for ' + imageId)
			return;
		}
		//hard delete on blobstore since image is not yet assgined to existing business
		$http['delete'](appConfig['serviceUrl'] + '/uploads/images/'+ $scope.wizard.images[imageId].blobKey);
		delete $scope.wizard.images[imageId];
	}

	// $scope.discardWizardImage = function(image, type) {
	// 	if(!$scope.wizard.images) {
	// 		return;
	// 	}

	// 	$scope.wizard.images[type] = null;
	// 	//delete image from blobstore
	// }

	$scope.showLocationDetails = function() {
		if(!$scope.createdLocation || !$scope.createdLocation.id) {
			return;
		}
		$location.url("/businesses/"+$scope.createdLocation.id);
	}

	$scope.$watch('wizard.progress', function(newVal, oldVal) {
		if(newVal.location && newVal.products && newVal.infopages) {
			$scope.wizard.complete = true;
		}
	}, true);

	$scope.fillWithDummyData = function() {
		$scope.wizard.newLocationName = randomUtil.genRndString(15);
		$scope.wizard.infopageDescription = randomUtil.genRndString(100);
		$scope.wizard.offers[0].title = randomUtil.genRndString(5);
		$scope.wizard.offers[0].shortDesc = randomUtil.genRndString(30);
		$scope.wizard.offers[0].price = randomUtil.genRndNumber(0, 1000);
		$scope.wizard.offers[1].title = randomUtil.genRndString(5);
		$scope.wizard.offers[1].shortDesc = randomUtil.genRndString(30);
		$scope.wizard.offers[1].price = randomUtil.genRndNumber(0, 1000);
		$scope.wizard.offers[2].title = randomUtil.genRndString(5);
		$scope.wizard.offers[2].shortDesc = randomUtil.genRndString(30);
		$scope.wizard.offers[2].price = randomUtil.genRndNumber(0, 1000);
		$scope.wizard.fbUrl = "https://www.facebook.com/Cloobster";
	}

};
Cloobster.Wizard.$inject = ['$scope', '$http', '$location', '$resource', 'login', 'Company', '$routeParams', 'errorHandler', 'Business', '$route', '$log', '$rootScope', 'Spot', '$injector', 'InfoPage', 'Menu', 'Product', 'randomUtil', 'lang', 'DashboardItem', 'config'];
