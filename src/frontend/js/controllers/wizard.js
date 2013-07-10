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
Cloobster.Wizard = function($scope, $http, $location, $resource, loginService, Company, $routeParams, handleError, Business, $route, $log, $rootScope, Spot, $injector, InfoPage, Menu, Product, randomUtil, langService, DashboardItem, appConfig, utilFn) {
	var businessResource = null;

	/* Holds data of wizard. */
	$scope.wizard = {
		offers : [{}, {}, {}],
		images: {},
		complete: false,
		progress: {
			location: false,
			infopages: false,
			products: false,
			imageLogo: false,
			imageFb: false,
			imageAppheader: false,
			//product images
			offer1: false,
			offer2: false,
			offer3: false
		}
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
			//start saving
			$scope.wizard.saving = true;
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

		utilFn.dumpObject(wizardData, 'Wizard: generate business');
		utilFn.dumpObject(wizardData.images, 'Images');

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
		if(!wizardData) {
			$log.log('Wizard: no wizardData');
			return false;
		}

		if(property && !wizardData[property]) {
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
			logoImage,
			headerImage,
			fbImage,
			imageArray = [];

		if(!checkWizardAndLocation(wizardData, 'images', location)) {
			$scope.wizard.progress.imageLogo = true;
			$scope.wizard.progress.imageAppheader = true;
			$scope.wizard.progress.imageFb = true;
			return;
		}

		resource = Business.buildImageResource(location.id);

		if(wizardData.images.logo) {
			imageArray.push({
				id: wizardData.images.logo.id,
				blobKey: wizardData.images.logo.blobKey,
				url: wizardData.images.logo.url
			});
		}

		if(wizardData.images.appheader) {
			imageArray.push({
				id: wizardData.images.appheader.id,
				blobKey: wizardData.images.appheader.blobKey,
				url: wizardData.images.appheader.url
			});
		}

		if(wizardData.images.fbwallpost) {
			imageArray.push({
				id: wizardData.images.fbwallpost.id,
				blobKey: wizardData.images.fbwallpost.blobKey,
				url: wizardData.images.fbwallpost.url
			});
		}


		$http({
			method: 'PUT',
			url: appConfig['serviceUrl'] + '/b/businesses/'+location.id+'/images',
			data: imageArray
		})
		.success(function(data, status, headers, config) {
			$scope.wizard.progress.imageLogo = true;
			$scope.wizard.progress.imageAppheader = true;
			$scope.wizard.progress.imageFb = true;
		}).error(function(data, status, headers, config) {
			$scope.wizard.progress.imageLogo = true;
			$scope.wizard.progress.imageAppheader = true;
			$scope.wizard.progress.imageFb = true;
			$log.log('Wizard.saveLocationImages: failed to save images')
		});

		// if(wizardData.images.logo) {
		// 	logoImage = new resource({
		// 		id: wizardData.images.logo.id,
		// 		blobKey: wizardData.images.logo.blobKey,
		// 		url: wizardData.images.logo.url
		// 	});
		// 	logoImage.$save(function() {
		// 		$scope.wizard.progress.imageLogo = true;
		// 	});
		// } else {
		// 	$scope.wizard.progress.imageLogo = true;
		// }

		// if(wizardData.images.appheader) {
		// 	headerImage = new resource({
		// 		id: wizardData.images.appheader.id,
		// 		blobKey: wizardData.images.appheader.blobKey,
		// 		url: wizardData.images.appheader.url
		// 	});
		// 	headerImage.$save(function() {
		// 		$scope.wizard.progress.imageAppheader = true;
		// 	});
		// } else {
		// 	$scope.wizard.progress.imageAppheader = true;
		// }

		// if(wizardData.images.fbwallpost) {
		// 	fbImage = new resource({
		// 		id: wizardData.images.fbwallpost.id,
		// 		blobKey: wizardData.images.fbwallpost.blobKey,
		// 		url: wizardData.images.fbwallpost.url
		// 	});
		// 	fbImage.$save(function() {
		// 		$scope.wizard.progress.imageFb = true;
		// 	});
		// } else {
		// 	$scope.wizard.progress.imageFb = true;
		// }

		//set progress 
		// $scope.wizard.progress.images = true;
	}

	function saveProductImage(wizardData, location, imageId, product) {
		var resource,
			image;


		if(!checkWizardAndLocation(wizardData, 'images', location)) {
			$scope.wizard.progress[imageId] = true;	
			return;
		}

		if(!product || !product.id) {
			$scope.wizard.progress[imageId] = true;	
			$log.log("Wizard.saveProductImage: no product");
			return;
		}

		if(!wizardData.images[imageId]) {
			$scope.wizard.progress[imageId] = true;	
			$log.log("Wizard.saveProductImage: no image for product " + product.id);
			return;
		}

		resource = Product.buildImageResource(location.id, product.id);

		image = new resource({
			id: wizardData.images[imageId].id,
			blobKey: wizardData.images[imageId].blobKey,
			url: wizardData.images[imageId].url
		});

		image.$save(function() {
			$scope.wizard.progress[imageId] = true;	
		});
	}

	//create infopage
	function addInfopageByWizard(wizardData, location) {
		var infopage,
			resource;

		if(!wizardData || !wizardData.infopageDescription) {
			$scope.wizard.progress.infopages = true;
			$log.log('Wizard: cannot create infopage without data');
			return;
		}

		if(!location || !location.id) {
			$scope.wizard.progress.infopages = true;
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
				var _imageIndex = index + 1,
					_productImageId = 'offer' + _imageIndex;

				if(offer.title && offer.shortDesc && offer.price) {
					product = new pResource({
						name: offer.title,
						shortDesc: offer.shortDesc,
						longDesc: offer.shortDesc,
						price: offer.price,
						menuId: menu.id,
						active: true,
						special: (index == 0) ? true : false
					});	

					product.choices = new Array();
					product.$save(function(response) {						
						saveProductImage(wizardData, location, _productImageId, response);
						if(index == wizardData.offers.length - 1) {
							$scope.wizard.progress.products = true;
						}
					}, handleError);
				} else {
					$scope.wizard.progress[_productImageId] = true;	
					if(index == wizardData.offers.length - 1) {
						$scope.wizard.progress.products = true;
					}
				}
		
			});
		}
	}

	/**
	* Delete all transient images.
	* Called when user cancels wizard process.
	*/
	function cleanupImages() {
		//issue delete requests for all images
		$scope.deleteWizardImage('logo');
		$scope.deleteWizardImage('appheader');
		$scope.deleteWizardImage('offer1');
		$scope.deleteWizardImage('offer2');
		$scope.deleteWizardImage('offer3');
		$scope.deleteWizardImage('fbwallpost');		
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
		var totalProgressSteps,
			completedSteps,
			complete = true,
			progress,
			progessToCheck = ['location', 'products', 'infopages', 'imageLogo', 'imageAppheader', 'imageFb'];

		if(!newVal) {
			return;
		}
		
		if(Object && Object.keys) {
			totalProgressSteps = Object.keys(newVal).length;
		} else {
			//backwards compatibility
			for (var key in newVal) {
			  if (newVal.hasOwnProperty(key)) {
			  	totalProgressSteps += 1;
			  }
			}
		}
		
		completedSteps = totalProgressSteps;

		angular.forEach(progessToCheck, function(element, index) {
			if(!newVal[element]) {
				complete = false;
				completedSteps -= 1;
			}
		});

		progress = Math.floor(completedSteps/totalProgressSteps * 100);

		jQuery("#wizardProgressBar").css("width", progress+"%");

		if(complete) {
			$scope.locationChangeStartListener();
			$scope.wizard.complete = complete;	
			window.onbeforeunload=null;
		}
	}, true);

	window.onbeforeunload = function(event) {
		if($scope.wizardForm.$dirty) {
			//warn user that changes maybe lost
			//we cant call cleanupImages here :()
			return langService.translate("appwizard.quit.message");
   		}
	}

	//prevent accidental tab switching and data loss
	$scope.locationChangeStartListener =  $scope.$on('$locationChangeStart', function(event, next, current) { 
   		if($scope.wizardForm.$dirty) {
   			//warn user that changes maybe lost
   			var check = confirm(langService.translate("appwizard.quit.message"));

   			if(check == false) {
   				event.preventDefault();	
   			} else {
   				window.onbeforeunload=null;
   				cleanupImages();
   			}
   			
   			//using bootstrap modal does not work, reason not clear
   			// $scope.changeUrl = $location.url($location.url(next).hash());
   			// jQuery("#wizardQuitModal").modal();
   		}
 	});

 	$scope.switchTab = function() {
 		if($scope.changeUrl) {
 			//unregister listener
 			$scope.locationChangeStartListener();
 			jQuery("#wizardQuitModal").modal("hide");
 			cleanupImages();
 			$location.url($scope.changeUrl);
 		}
 	}

	$scope.isWizardWorking = function() {
		return $scope.wizard.complete || $scope.wizard.saving;
	}

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
Cloobster.Wizard.$inject = ['$scope', '$http', '$location', '$resource', 'login', 'Company', '$routeParams', 'errorHandler', 'Business', '$route', '$log', '$rootScope', 'Spot', '$injector', 'InfoPage', 'Menu', 'Product', 'randomUtil', 'lang', 'DashboardItem', 'config', 'utilFn'];
