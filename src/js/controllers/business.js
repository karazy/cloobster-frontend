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
Cloobster.Business = function($scope, $http, $routeParams, $location, loginService, uploadService, Business, $log) {

		/** Holds the Id of the active modal dialog.
		@type {string} */
	var activeModalDialog = "",
		/** Template resource used to create concrete image resources. */
		imageResource,
		/** Active image resource. */
		activeImage,
		/** Id of business to delete. */
		businessDeleteId;

	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	$scope.businesses = null;
	/** The currently selected business. */
	$scope.activeBusiness = null;
	/** Property which is currently edited. */
	$scope.activeProperty = null;
	/** When true user can edit the business profile. */
	$scope.editMode = false;
	/** True if file upload is active */
	$scope.activeFileUpload = null;
	/** Contains the information about a new business. */
	$scope.newBusiness = null;
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
		$scope.businesses = $scope.businessResource.query();
	};

	/**
	* Display the delete business modal dialog.
	* @param business
	*	Business to show delete dialog for.
	*/
	$scope.showDeleteDialog = function(business) {
		$scope.activeBusiness = business; 
		jQuery("#deleteModal").modal('show');
	};

	/**
	* Deletes a business.
	* @param id
	* 	business to delete
	*/
	$scope.deleteBusiness = function(id) {
		$scope.businessResource['delete']({'id' : id});

		//hide delete dialog
		jQuery("#deleteModal").modal('hide');
	};

	/**
	* Loads a complete business.
	* @param id
	* 	business to load
	*/
	$scope.loadBusiness = function(id) {
		$scope.activeBusiness = $scope.businessResource.get({'id' : id}, function() {
			imageResource =	createImageResource($scope.activeBusiness.id);
			//if no images are included init with empty object
			$scope.activeBusiness.images = $scope.activeBusiness.images || {};

			$scope.activeFileUpload = uploadService.getFileUploadObject('fileModal', imageResource);
		});
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
		var fields = ['name', 'city', 'address', 'postcode', 'phone', 'description'],
			isInvalid = false;

		if($scope.newBusinessForm.$valid) {
			$scope.newBusinessEntity = new $scope.businessResource({
				'name' : $scope.newBusiness.name,
				'city' : $scope.newBusiness.city,
				'address' : $scope.newBusiness.address,
				'postcode' : $scope.newBusiness.postcode,
				'phone' : $scope.newBusiness.phone,
				'description' : $scope.newBusiness.description
			});

			$("#addBusinessButton").button("loading");

			$scope.newBusinessEntity.$save(function() {
				//close switches to another url so businesses will be refreshed automatically 
				//and showing the new new business
				$scope.closeNewBusinessForm();
			});
		} else {
			//mark form as dirty to show validation errors
			jQuery.each(fields, function(index, value) {
				if($scope.newBusinessForm[value] && !$scope.newBusinessForm[value].invalid) {
					//mark proeprty as dirty to display error messages
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
		$scope.newBusiness = {};
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

	$scope.editSimpleData = function(title, value, property, inputType) {
		var modalDialog = "";

		if(!$scope.editMode) {
			return;
		}

		$scope.activeProperty = {
			'title' : title,
			'value' : value,
			'property' : property
		};

		switch(inputType) {
			case 'text': modalDialog = '#textModal'; break;
			case 'textarea': modalDialog = '#textareaModal'; break;
			case 'file': modalDialog = '#fileModal'; break;
			default: modalDialog = '#textModal'; break;
		};

		activeModalDialog = modalDialog;

		$(modalDialog).on('hide', function () {
  			$scope.cancelProperty();
		});

		jQuery(modalDialog).modal('toggle');
	};

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
		$scope.activeBusiness.$update();
	};

	/**
	* Cancel editing property.
	*/
	$scope.cancelProperty = function() {
		$scope.activeProperty = null;
	};

	/**
	* Save last edited image in images property.
	*/
	$scope.saveImage = function() {
		var property = $scope.activeProperty.property;

		
		activeImage = new imageResource({
    				id: property,
    				blobKey: imageResource.blobKey,
    				url: imageResource.url
    	});

		//save image under the given property. e. g. logo
		imageResource.id = property;

		activeImage.$save(function() {
			//success callback
			//make sure that images exist!
			$scope.activeBusiness.images = $scope.activeBusiness.images || {};
			//set saved logo as new business logo
			$scope.activeBusiness.images[property] = {
				url: imageResource.url + '=s128',
				blobKey: imageResource.blobKey
			};
		});

		$(activeModalDialog).modal('hide');
	}

	/**
	* Discards changes made to an image and leaves edit mode.
	*/
	$scope.cancelImage = function() {
		// $scope.logoFormMode = "view";
		// $scope.logoUploadFinished = false;

		//delete image from images bucket
		if(activeImage && activeImage.blobKey) {
			$http['delete']('/uploads/images/' + activeImage.blobKey)
			.success(function() {
				activeImage = null;
			})
			.error(function() {
				//handle error
			});
		}
	};

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

Cloobster.Business.$inject = ['$scope', '$http','$routeParams', '$location', 'login', 'upload', 'Business', '$log'];