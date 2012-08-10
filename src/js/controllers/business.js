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
Cloobster.Business = function($scope, $http, $routeParams, $location, loginService, uploadService, langService, Business, $log, handleError) {

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
		};

	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	/** Template resource used to create concrete image resources. */
	$scope.imageResource = null;
	$scope.businesses = null;
	/** The currently selected business. */
	$scope.activeBusiness = null;
	/** In case of delete attempt, the business to delete. */
	$scope.businessToDelete = null;
	/** Property which is currently edited. */
	$scope.activeProperty = null;
	/** When true user can edit the business profile. */
	$scope.editMode = false;
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

		$scope.deletePassword = null;
		
		loginService.authenticatedRequest($scope.deletePassword, function() {
			$scope.businessToDelete.$delete(success, error);
		});

		function success() {
			$scope.businessToDelete = null;
			$scope.deleteError = null;

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

	/**
	* Loads a complete business.
	* @param id
	* 	business to load
	*/
	$scope.loadBusiness = function(id) {
		$scope.activeBusiness = $scope.businessResource.get({'id' : id}, function() {						
			//if no images are included init with empty object
			$scope.activeBusiness.images = $scope.activeBusiness.images || {};

			$scope.imageResource =	createImageResource($scope.activeBusiness.id);
		}, handleError);
	};

	/**
	* Show/hide new business form.
	*/
	$scope.toggleNewBusiness = function() {
		$location.url("/businesses/new");
		// $scope.showNewBusinessForm = !$scope.showNewBusinessForm;
	};

	/**
	* Adds a new business.
	* @param businessName
	*	Name for the new business
	*/
	$scope.addNewBusiness = function() {
		var fields = ['name', 'city', 'address', 'postcode', 'phone', 'description', 'currency'],
			isInvalid = false;

		if($scope.newBusinessForm.$valid) {
			$scope.newBusinessEntity = new $scope.businessResource({
				'name' : $scope.newBusiness.name,
				'city' : $scope.newBusiness.city,
				'address' : $scope.newBusiness.address,
				'postcode' : $scope.newBusiness.postcode,
				'phone' : $scope.newBusiness.phone,
				'description' : $scope.newBusiness.description,
				'currency' : $scope.newBusiness.currency
			});

			$("#addBusinessButton").button("loading");

			$scope.newBusinessEntity.$save(function() {
				//close switches to another url so businesses will be refreshed automatically 
				//and showing the new new business
				$("#addBusinessButton").button("reset");
				$scope.closeNewBusinessForm();
			},
			function(data,status,headers,config) {
				//Error handling
				$("#addBusinessButton").button("reset");
				handleError(data, status, headers, config);
			});
		} else {
			//mark form as dirty to show validation errors
			jQuery.each(fields, function(index, value) {
				if($scope.newBusinessForm[value] && !$scope.newBusinessForm[value].invalid) {
					//mark property as dirty to display error messages
					$scope.newBusinessForm[value].$dirty = true;
					isInvalid = true;
				}

				if(isInvalid) {
					$scope.newBusinessForm.$setDirty();
				}
			})			
		}
	};

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

	/**
	* Switches between view and edit mode.
	*/
	$scope.toggleEditMode = function() {
		$scope.editMode = !$scope.editMode;
	}

	/**
	* Returns "edit" when edit mode is active.
	*/
	$scope.getEditModeClass = function() {
		return ($scope.editMode) ? "edit" : "";
	}

	$scope.editImageData = function(title, value, property) {
		if(!$scope.editMode) {
			return;
		}

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
		if($scope.editMode) {
			$log.log("saveBusiness " + $scope.activeBusiness.id);
			$scope.activeBusiness.$update(null, null, handleError);	
		}
	};

	/**
	* Cancel editing property.
	*/
	$scope.cancelProperty = function() {
		$scope.activeProperty = null;
	};

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
		
		if (!$scope.editMode) {
			return;
		};

		if(!themeId) {
			$log.warn('No theme given.');
		};

		if($scope.activeBusiness.theme != themeId) {
			$scope.activeBusiness.theme = themeId;
			$scope.saveBusiness();
		}
	};

	//end theme methods

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

			//load business details
			if($routeParams && $routeParams.id) {
				$scope.loadBusiness($routeParams.id);
			}

			if($location.path() == "/businesses/new") {
				$scope.showNewBusinessForm = true;
			}

		} else if(newValue == false) {
			$location.url('/');
		}
	});


};

Cloobster.Business.$inject = ['$scope', '$http','$routeParams', '$location', 'login', 'upload', 'lang', 'Business', '$log','errorHandler'];