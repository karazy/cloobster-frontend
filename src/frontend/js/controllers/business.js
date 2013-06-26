/** @module Cloobster/Business */
'use strict';

/**
* 	@name Cloobster.Business
*	@requires facebookApi
*	@requires loginService
*
* 	Business controller 
* 	View and manage businesses such as restaurants.
* 	@constructor
*/
Cloobster.Business = function($scope, $http, $routeParams, $location, loginService, uploadService, langService, Business, $log, handleError, Company, Subscription, langcodes, $rootScope) {

		/** Holds the Id of the active modal dialog.
		@type {string} */
	var activeModalDialog = "",
		/** Active image resource. */
		activeImage,
		/** Id of business to delete. */
		businessDeleteId,
		defaultBusiness = {
			currency : "EUR"
		},
		defaultPaymentMethod = {
			name: langService.translate("paymentmethod.new.default.name") || "New payment method"
		},
		/** Google Map options */
		mapOptions = {
			// center on Darmstadt for now
    	center: new google.maps.LatLng(49.882247,8.652023),
    	zoom: 8,
    	mapTypeId: google.maps.MapTypeId.ROADMAP
  	},
  	/** reference to the Google Map */
  	map,
  	/** For geocoding searches */
  	geocoder,
  	/** Map marker*/
  	marker;
 	
	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	/** Template resource used to create concrete image resources. */
	$scope.imageResource = null;
	/** Subscription resource */
	$scope.subscriptionResource = null;
	$scope.businesses = null;
	$scope.subscriptions = null;
	/** The currently selected business. */
	$scope.activeBusiness = null;
	/** Subscription of activeBusiness */
	$scope.activeSubscription = null;
	/** Subscription of pendingBusiness */
	$scope.pendingSubscription = null;
	/** In case of delete attempt, the business to delete. */
	$scope.businessToDelete = null;
	/** Property which is currently edited. */
	$scope.activeProperty = null;
	/** True if file upload is active. */
	$scope.activeFileUpload = null;
	/** Contains the information about a new business. */
	$scope.newBusiness = {
			currency : "EUR"
	};
	/** When true shows the form for a new business. */
	$scope.showNewBusinessForm = false;
	/** Error flag. */
	$scope.error = false;
	/** Error message. */ 
	$scope.errorMessage = "";
	/** A map with language names and codes. */
	$scope.langcodes = langcodes;
	/** Filter object for language selection dialog. */
	$scope.languageQuery = {};

	// if(!$rootScope.businessWizardEvent) {
	// 	$rootScope.businessWizardEvent = $rootScope.$on("wizard-create-app", function(eventData, wizardData) {		
	// 		addBusinessByWizard(wizardData);
	// 	});	
	// }
	


	/**
	* Returns all businesses
	*/
	$scope.loadBusinesses = function() {
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load business.');
			return;
		}

		account =  loginService.getAccount();

		$log.log('loadBusinesses for ' + account.id);
		$scope.businessResource = Business.buildResource(account.id);
		//load businesses
		$scope.businesses = $scope.businessResource.query(null, null, null, handleError);
	};

	/**
	* Load all available subscriptions.
	*/
	$scope.loadSubscriptions = function() {
		// Delete previous subscriptions, needed because we sometimes refresh them
		if($scope.subscriptions && $scope.subscriptions.length != 0) {
			$scope.subscriptions.splice(0, $scope.subscriptions.length);	
		}
		
		$scope.subscriptions = Subscription.query(angular.noop, handleError);
	}

	/**
	* Display the delete business modal dialog.
	* @param business
	*	Business to show delete dialog for.
	*/
	$scope.showDeleteDialog = function(business) {
		$scope.businessToDelete = business; 
		jQuery("#deleteModal").modal('show');
	};

	/**
	* Deletes a business.
	* @param id
	* 	business to delete
	*/
	$scope.deleteBusiness = function() {
		var errorMessageInvalid = langService.translate("business.action.delete.invalid");
		
		
		loginService.authenticatedRequest($scope.deletePassword, function() {
			$scope.businessToDelete.$delete(success, error);
		});

		$scope.deletePassword = null;

		function success() {
			$scope.businessToDelete = null;
			$scope.deleteError = null;
			$rootScope.activeBusinessId = null;

			$scope.$broadcast('update-businesses');

			//hide delete dialog
			jQuery("#deleteModal").modal('hide');
			//navigate to business overview
			$location.url('/businesses');
		}

		function error(response) {
			if(response.status == 403) {
				$scope.deleteError = errorMessageInvalid;
			} else {
				$scope.deleteError = langService.translate("common.error");
			}
		}
	};


	$scope.showLocationSettings = function(business) {
		if(business && business.id) {
			$location.url("/businesses/"+business.id);
		}
	}

	/**
	* Loads a complete business.
	* @param id
	* 	business to load
	*/
	$scope.loadBusiness = function(id) {
		$scope.activeBusiness = $scope.businessResource.get({'id' : id, 'countSpots' : true}, function() {						
			//if no images are included init with empty object
			$scope.activeBusiness.images = $scope.activeBusiness.images || {};
			//if no lang array exists create one
			$scope.activeBusiness.lang = $scope.activeBusiness.lang || [];

			$scope.imageResource =	createImageResource($scope.activeBusiness.id);

			$scope.loadBusinessSubscriptions($scope.activeBusiness);
			
			// init map
			initMap($scope.activeBusiness);

			if(!$scope.activeBusiness.geoLat && !$scope.activeBusiness.geoLong) {
				centerOnLocation($scope.activeBusiness, true);				
			}
			else {
				map.setZoom(14);
			}

			// Center Google Map
			registerAddressWatch();

		}, handleError);
	};

	/**
	* Load subscriptions for a business.
	* @param business
	*	business to load subscriptions for
	*/
	$scope.loadBusinessSubscriptions = function(business) {
		$scope.subscriptionResource = Business.buildSubscriptionResource(business.id);

		if(business.activeSubscriptionId) {
			$scope.activeSubscription = $scope.subscriptionResource.get(
				{ 'id' : business.activeSubscriptionId },
				checkStaleSubscription,
				handleError
			);	
		}

		if(business.pendingSubscriptionId) {
			$scope.pendingSubscription = $scope.subscriptionResource.get({ 'id' : business.pendingSubscriptionId});
		}
	};

	/**
	* Show/hide new business form.
	*/
	$scope.toggleNewBusiness = function() {
		$location.url("#/businesses/new");
		// $scope.showNewBusinessForm = !$scope.showNewBusinessForm;
	};

	/**
	* Adds a new business.
	* @param businessName
	*	Name for the new business
	*/
	$scope.addNewBusiness = function() {
		// var fields = ['name', 'city', 'address', 'postcode', 'phone', 'description', 'currency'],
		// 	isInvalid = false;

		if(!$scope.newBusiness.name) {
			return;
		}

		$scope.newBusinessEntity = new $scope.businessResource($scope.newBusiness);

		$scope.newBusinessEntity.$save(function(response) {
			$scope.$broadcast('update-businesses');
			$location.url('/businesses/'+response.id);
		}, handleError);

		return;
	};

	function addBusinessByWizard(wizardData) {
		var resource,
			entity;

		if(!wizardData && !wizardData.newLocationName) {
			console.error('Wizard: cannot save business without name');
			return;
		}

		console.log('Wizard: generate business: ' + wizardData.newLocationName);

		resource = Business.buildResource(loginService.getAccount().id);
		entity = new resource({
			"name": wizardData.newLocationName
		});

		entity.$save(function(response) {
			// wizardData.locationId = entity.id;
			$rootScope.$broadcast('wizard-created-business', wizardData, entity.id);
			$scope.$broadcast('update-businesses');			
		}, handleError);
	}

	/**
	* Closes the new business form and resets values.
	*/
	$scope.closeNewBusinessForm = function() {
		$scope.toggleNewBusiness();
		//restore def values
		$scope.newBusiness = angular.copy(defaultBusiness);
		// $scope.newBusinessForm.$setDirty(false);
		$location.url("/businesses");
	}

	$scope.editImageData = function(title, value, property) {

		$scope.activeProperty = {
			'title' : title,
			'value' : value,
			'property' : property
		};

		activeModalDialog = "#fileModal";

		jQuery('#fileModal').modal('toggle');
	}

	/**
	* Save edited property.
	*/
	$scope.saveProperty = function() {
		var property = $scope.activeProperty.property;
		if($scope.activeBusiness.hasOwnProperty(property)) {
			$scope.activeBusiness[property] = $scope.activeProperty.value;
			$scope.activeBusiness.$update();

			$(activeModalDialog).modal('hide');
		}
	};

	/**
	* Save active business.
	*/
	$scope.saveBusiness = function() {
		$log.log("saveBusiness " + $scope.activeBusiness.id);
		$scope.activeBusiness.$update(null, null, handleError);	
	};

	/**
	* Cancel editing property.
	*/
	$scope.cancelProperty = function() {
		$scope.activeProperty = null;
	};

	//image editing start

	$scope.setImage = function(image) {
		$log.info("save image " + image);
		//make sure that images exist!
		$scope.activeBusiness.images = $scope.activeBusiness.images || {};
		//set saved logo as new business logo
		$scope.activeBusiness.images[image.id] = {
			url: image.url,
			blobKey: image.blobKey
		};
	};

	$scope.discardImage = function(image) {
		if(image && image.blobKey) {
			$http['delete']('/uploads/images/' + image.blobKey)
			.error(handleError);
		}
	};

	/**
	*
	* Deletes an existing image based on given imageId
	*/
	$scope.deleteExistingImage = function(imageId) {
		if(!imageId) {
			$log.log('Business.deleteExistingImage > no ImageId given');
			return;
		}

		if(!$scope.activeBusiness) {
			$log.log('Business.deleteExistingImage > no activeBusiness not set');
			return;
		}

		if(!$scope.activeBusiness.images) {
			$log.log('Business.deleteExistingImage > activeBusiness has no images property');
			return;
		}

		if(!$scope.activeBusiness.images[imageId]) {
			$log.log('Business.deleteExistingImage > activeBusiness.images has no image with id=' + imageId);
			return;
		}

		if(!$scope.imageResource) {
			$log.log('Business.deleteExistingImage > no image resource exists');
			return;
		}

		$log.log('Business.deleteExistingImage > deleting image with id='+imageId);

		$scope.imageResource.remove(
			{'id' : imageId},
			angular.noop,
			handleError
		);

		$scope.activeBusiness.images[imageId] = null;
		delete $scope.activeBusiness.images[imageId];
	}

	//image editing end

	// start payment methods

	$scope.addPaymentMethod = function() {
		if(!$scope.activeBusiness.paymentMethods) {
			$scope.activeBusiness.paymentMethods = new Array();
		}
		
		$scope.activeBusiness.paymentMethods.push(angular.copy(defaultPaymentMethod));
	};

	$scope.removePaymentMethod = function(index) {
		$scope.activeBusiness.paymentMethods.splice(index, 1);
		$scope.saveBusiness();
	};

	// end payment methods

	//start theme methods

	/**
	* @name Cloobster.Business.activateTheme
	* @description
	*	Sets the given theme as active theme and saves the business.
	* @param {themeId}
	*	Id of theme to set as active.
	*/
	$scope.activateTheme = function(themeId) {
		if(!themeId) {
			$log.warn('No theme given.');
		};

		if($scope.activeBusiness.theme != themeId) {
			$scope.activeBusiness.theme = themeId;
			$scope.saveBusiness();
		}
	};

	//end theme methods

	//start language methods
	
	$scope.saveLanguageSelection = function() {
		// if(!$scope.activeBusiness.lang) {
			$scope.activeBusiness.lang = [];
		// }

		angular.forEach($scope.langcodes, function(lang, key) {
			if(lang.selected) {
				$scope.activeBusiness.lang.push(lang.code);
			}
		});

		$scope.saveBusiness();
		//hide lang selection window
		$scope.langSelection = false;
	}

	$scope.loadLanguageSelection = function() {
		//show lang selection window
		$scope.langSelection = true;
		//calc dynamic height for language box
		jQuery('.data-container-dynamic').height(jQuery(window).height() * 0.6);

		//reset filters
		$scope.languageQuery.lang = '';
		$scope.languageQuery.selected = '';
		$scope.languageQuery.active = true;

		angular.forEach($scope.langcodes, function(lang, key) {
			if(jQuery.inArray(lang.code, $scope.activeBusiness.lang) >= 0) {
				lang.selected = true;
			}
		});
	}

	//end language methods
	
	/**
	* Filter given business based on trash status.
	* @return
	*	true if not trashed
	*/
	$scope.filterTrashedBusiness = function(business) {
		return !business.trash;
	}

	/*
	* Get css class for field highlighting.
	* @returns error if dirty && invalid
	*		  sucess if dirty && !invalid
	*         empty string otherwise
	*/
	$scope.getFieldInputClass = function(dirty, invalid) {
		if(dirty && invalid) {
			return "error";
		} else if (dirty && !invalid) {
			return "success";
		} else {
			return "";
		}
	};

	//start subscription methods

	$scope.setActivePackageForLocation = function(subscription) {
		var newSubscription;

		if(!subscription) {
			$log.log('setActivePackageForLocation: no subscription provided');
			return;
		}

		if(subscription.templateId) {
			$log.log('setActivePackageForLocation: this is not a subscription template');
			return;
		}
		
		newSubscription = {
			// name: subscription.name,
			// fee: subscription.fee,
			// maxSpotCount: subscription.maxSpotCount,
			// basic: subscription.basic,
			templateId: subscription.id
			// status: 'PENDING'
		}

		newSubscription = new $scope.subscriptionResource(newSubscription);

		newSubscription.$save(function() {
			$scope.pendingSubscription = newSubscription;
		});
	}

	$scope.cancelPendingSubscription = function() {
		if(!$scope.pendingSubscription) {
			$log.log('cancelPendingSubscription: no pending subscription exists');
			return;
		}
		
		$scope.pendingSubscription.$delete(function() {
			$scope.pendingSubscription = null;
		}, error);

		function error(response) {
			//
			if(response && response.status == 409) {
				if($scope.subscriptionResource) {
					$scope.cancelPendingSubscriptionError = true;
					$scope.activeBusiness.pendingSubscriptionId = null;
					$scope.pendingSubscription = null;
					// Reload the business and subscriptions to get actual data
					$scope.loadBusiness($routeParams['businessId']);
				}				
			} else {
				handleError(response);
			}
		}
	}

	function checkStaleSubscription() {
		var found = false;
		if(!$scope.activeSubscription) {
			return;
		}

		angular.forEach($scope.subscriptions, function(s) {
			if(s.id == $scope.activeSubscription.templateId) {
				found = true;				
			}
		});

		if(!found) {
			$scope.staleSubscription = true;
		}
	}

	//end subscriptions methods

	/**
	* @name Cloobster.Login~hideError
	*
	* Set error false and hide the error box.
	*/
	$scope.hideError = function() {
		$scope.error = false;
	};

	/**
	* Creates an image resource. 
	* @see Cloobster.services.Business#buildImageResource
	*
	* @param businessId
	*	Id of business for which to create the resource
	* @return
	*	ImageResource
	*/
	function createImageResource(businessId) {
		return Business.buildImageResource(businessId);
	};

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			$scope.loadBusinesses();
			$scope.loadSubscriptions();

			$scope.company = Company.buildResource().get({
				'id': loginService.getAccount()['companyId']
			}, angular.noop, handleError);

			//load business details
			if($routeParams['businessId']) {
				$scope.loadBusiness($routeParams['businessId']);				
			}

			if($location.path() == "/businesses/new") {
				$scope.showNewBusinessForm = true;
			}

		} else if(newValue == false) {
			$location.url('/');
		}
	});

	//initialize payment method symbol help
	jQuery('#paymentMethodLabel').popover({
		placement: 'right',
		title: langService.translate("common.help"),
		trigger: 'hover',
		html: true,
		content: langService.translate("business.help.paymentmethod.popover")
	});

	//initialize coordinates symbol help
	jQuery('#coordinatesLabel').popover({
		placement: 'right',
		title: langService.translate("common.help"),
		trigger: 'hover',
		html: true,
		content: langService.translate("business.help.coordinates.popover")
	});

	// Watch the address of the active business for changes
	function registerAddressWatch() {
		$scope.$watch('activeBusiness.address + activeBusiness.postcode + activeBusiness.city', function(newValue, oldValue) {
			if(newValue !== oldValue) {
				centerOnLocation($scope.activeBusiness, true);
			}
		});
	}

 	// Init Map
 	function initMap (location) {
 		var hasGeoLocation = false;
 		if(location && location.geoLat && location.geoLong) {
 			// center map on geo location, if exists
 			mapOptions.center = new google.maps.LatLng(location.geoLat, location.geoLong); 			
 			hasGeoLocation = true;
 		}

 		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
 		map.setZoom(14);
	  geocoder = new google.maps.Geocoder();

	  // register click event
	  google.maps.event.addListener(map, 'click', function(e) {
    	placeMarker(e.latLng);
    	setCoordsOnActiveBusiness(e.latLng);    	
    	$scope.$digest();
    	$scope.saveBusiness();
  	});

  	if(hasGeoLocation) {
  		placeMarker(mapOptions.center);  		
  	}
 	}

 	// Place map marker on the specified position
 	function placeMarker(position) {
 		// remove previous marker
 		if(marker) {
 			marker.setMap(null);
 		}

  	marker = new google.maps.Marker({
  	  position: position,
	    map: map
  	});

  	map.panTo(position);

	}

	// Set geoLat and geoLong fields for the activeBusiness
	function setCoordsOnActiveBusiness(latLng) {
		if(latLng) {
			$scope.activeBusiness.geoLat = latLng.lat();
			$scope.activeBusiness.geoLong = latLng.lng();
		}
	}
  
  // Center the google map based on given location address
	function centerOnLocation(location, setCoordsOnLocation) {
	  var address = location.address + ' ' + location.postcode + ' ' + location.city;

	  geocoder.geocode( { 'address': address}, function(results, status) {				  	
	    if (status == google.maps.GeocoderStatus.OK) {
	    	if(setCoordsOnLocation) {
	    		setCoordsOnActiveBusiness(results[0].geometry.location);
	    		try {
	    			$scope.$digest();	
	    		}
	    		catch(e) {
	    			$log.info('Cloobster.Business.centerOnLocation: Skipped $scope.digest()');
	    		}
	    		
	    		$scope.saveBusiness();
	    	}
	    	$scope.activeCoords = results[0].geometry.location;
	    	map.setZoom(14);
	    	map.setCenter(results[0].geometry.location);
	    	placeMarker(results[0].geometry.location);
	    } else {
	    	$log.error('Cloobster.Business.centerOnLocation: Geocode was not successful for the following reason ' + status);
	    }
	  });
	}

};

Cloobster.Business.$inject = ['$scope', '$http','$routeParams', '$location', 'login', 'upload', 'lang', 'Business', '$log','errorHandler','Company', 'Subscription', 'langcodes', '$rootScope'];