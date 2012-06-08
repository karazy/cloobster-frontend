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
Cloobster.Business = function($scope, $http, $routeParams, loginService, uploadService, Business, $log) {

	/** Holds the Id of the active modal dialog. */
	var activeModalDialog = "",
		imageResource;

	/** Resource for CRUD on businesses. */	
	$scope.businessResource = null;
	$scope.businesses = null;
	/** The currently selected business. */
	$scope.activeBusiness = null;
	/** Property which is currently edited. */
	$scope.activeProperty = null;
	/** When true user can edit the business profile. */
	$scope.editMode = false;
	$scope.activeFileUpload = null;

	function checkNested(obj, properties) {
		  var args = properties.split('.');
	      // obj = args.shift();

	  for (var i = 0; i < args.length; i++) {
	    if (!obj.hasOwnProperty(args[i]) && obj[args[i]]) {
	      return false;
	    }
	    obj = obj[args[i]];
	  }
	  return true;
	}

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
	* Deletes a business.
	* @param id
	* 	business to delete
	*/
	$scope.deleteBusiness = function(id) {
		$scope.businessResource.delete({'id' : id});
	};

	/**
	* Loads a complete business.
	* @param id
	* 	business to load
	*/
	$scope.loadBusiness = function(id) {
		$scope.activeBusiness = $scope.businessResource.get({'id' : id}, function() {
			imageResource =	Business.buildImageResource($scope.activeBusiness.id);
			//if no images are included init with empty object
			$scope.activeBusiness.images = $scope.activeBusiness.images || {};
			
			$scope.activeFileUpload = uploadService.getFileUploadObject('fileModal', imageResource);
		});
	};

	/**
	* Switches between view and edit mode.
	*/
	$scope.toggleEditMode = function() {
		$scope.editMode = !$scope.editMode;
	}

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

		jQuery('#fileModal').modal('toggle');
	}

	/**
	* Save edited property.
	*/
	$scope.saveProperty = function() {
		var property = $scope.activeProperty.property;
		if(checkNested($scope.activeBusiness, property)) {
			$scope.activeBusiness[property] = $scope.activeProperty.value;
			$scope.activeBusiness.$update();

			$(activeModalDialog).modal('hide');
		}
	};

	$scope.cancelProperty = function() {
		$scope.activeProperty = null;
	}

	/** Watches loggedIn status and initializes controller when status changes to true.
	 *
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			$scope.loadBusinesses();

			//load business details
			if($routeParams && $routeParams.id) {
				$scope.loadBusiness($routeParams.id);
			}


		}
	});


};

Cloobster.Business.$inject = ['$scope', '$http','$routeParams', 'login', 'upload', 'Business', '$log'];