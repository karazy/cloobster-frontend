/** @module Cloobster/Profile */
'use strict';

/**
* 	@name Cloobster.Profile 
*	@requires facebookApi
*	@requires loginService
*
* 	Profile controller 
* 	View and manage profiles.
* 	@constructor
*/
Cloobster.Profile = function($scope, $http, facebookApi, loginService, Company, $log, Account, handleError) {
	
	var ImageResource,
		/** Holds the Id of the active modal dialog. */
		activeModalDialog;

	//Company resource object.
	$scope.company = {
		images: {}
	};

	/** Logged in account */
	$scope.account = null;

	//Indicates if logo upload is finished. And toggles the save button accordingly.
	$scope.logoUploadFinished = false;

	//resource to handle CRUD for logo
	$scope.logoResource = null;

	$scope.activeModel = null;

	/** True if company edit mode is active. */
	$scope.editModeCompany = false;
	/** True if account edit mode is active. */
	$scope.editModeAccount = false;

	/**
	* Holds an array of fileUpload Information objects.
	* e.g.
	*	 [ { "name": "thefilename", "url": "touseasimagesrc", "blobKey": "usedbytheservertoidentifythefile"}]
	*/
	$scope.fileUploadInformation = [];

	/**
	* Returns an empty string if logo is defined "nologo" otherwise.
	*/
	$scope.getEmptyLogoClass = function() {
		return $scope.company.images ?  ($scope.company.images.logo ? "" : "noLogo") : "nologo";
	}

	/**
	* Toggles edit mode for logo image.
	*/
	$scope.editLogo = function() {
		$scope.logoFormMode = "edit";
		$scope.logoUploadFinished = false;
	};

	/**
	* Saves uploaded company logo. 
	*/
	$scope.saveLogo = function() {
		if($scope.logoResource) {
			$scope.logoUploadFinished = false;
			$scope.logoFormMode = "view";
		
			$scope.logoResource.$save(function() {
				//success callback
				//set saved logo as new company logo
				$scope.company.images.logo = {
					url: $scope.logoResource.url,
					blobKey: $scope.logoResource.blobkey
				};

				$scope.logoResource = null;
			});
		}
	};

	/**
	* Discards changes made to logo and leaves edit mode.
	*/
	$scope.cancelLogo = function() {
		$scope.logoFormMode = "view";
		$scope.logoUploadFinished = false;

		//delete image from images bucket
		if($scope.logoResource && $scope.logoResource.blobKey) {
			$http['delete']('/uploads/images/' + $scope.logoResource.blobKey)
			.success(function() {
				$scope.logoResource = null;
			})
			.error(function() {
				//handle error
			});
		}
	};

	/**
	* Set error false and hide the error box.
	*/
	$scope.hideError = function() {
		$scope.error = false;
	};

	/**
	* Switches between view and edit mode.
	* @param editMode
	*	company or account to toggel corresponding edit mode
	*/
	$scope.toggleEditMode = function(editMode) {
		if(editMode == "company") {
			$scope.editModeCompany = !$scope.editModeCompany;	
		}
		if(editMode == "account") {
			$scope.editModeAccount = !$scope.editModeAccount;	
		}
	}

	/**
	* Returns "edit" when edit mode is active.
	* @param editMode
	*	company or account to toggle corresponding edit mode
	*/
	$scope.getEditModeClass = function(editMode) {
		if(editMode.toLowerCase() == "company") {
			return ($scope.editModeCompany) ? "edit" : "";
		}

		if(editMode.toLowerCase() == "account") {
			return ($scope.editModeAccount) ? "edit" : "";	
		}
		
	}
	
	/**
	* Save company.
	*/
	$scope.saveCompany = function() {
		$scope.company.$update(function() {
			//success
		}, handleError);
	}

	/**
	* Save company.
	*/
	$scope.saveAccount = function() {
		$scope.account.$update(function() {
			//success
		}, handleError);
	}

	/**
	* Cancel editing property.
	*/
	$scope.cancelProperty = function() {
		$scope.activeProperty = null;
		$scope.activeModel = null;
	};

	//<-- end logo related actions -->


	/** Watches loggedIn status and initializes controller when status changes to true.
	 *
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue == true) {
			requestFileUploadInformation();
			loadProfileData();
		}
	});

	/**
	* @private
	* Requests information from server needed to upload files.
	*/
	function requestFileUploadInformation() {
		$log.log('requestFileUploadInformation');

		if(!$scope.fileUploadUrl) {
			$http.get('/uploads/imagesurl').success(function(data, status) {
				$log.log('requestFileUploadInformation -> success');
				$scope.fileUploadUrl = data;
				initUploadPlugin();
			})
			.error(function(data, status) {
				$log.error('Failed to request file upload information. Status: ' + status);
			});
		}
	};

	/**
	* @private
	* Loads profile data if user is logged in.
	*/
	function loadProfileData() {
		$scope.account = new Account(loginService.getAccount());

		$scope.company = Company.buildResource().get({
			id: $scope.account.companyId
		},function() {
			ImageResource = Company.buildImageResource($scope.company.id);
			//if no images are included init with empty object
			$scope.company.images = $scope.company.images || {};
		});
	};

	/**
	* @private
	* Initializes the upload plugin for all upload fields.
	* It needs a previously optained fileUpeloadUrl fot setup.
	*/
	function initUploadPlugin() {
		if(!$scope.fileUploadUrl) {
			$log.error('initUploadPlugin: No fileUploadUrl set!');
			return;
		}
		//selector, upload url, imageresource
		//set up filedupload for logo
		// jQuery('#logo').fileupload({
  //   		dataType: 'json',
  //   		// acceptFileType: /(\.|\/)(gif|jpe?g|png)$/i,
  //   		url: $scope.fileUploadUrl,
  //   		fail: function(e, data) {
  //   			$log.error('Upload failed. Reason: '+data.errorThrown);
  //   			$scope.$apply('logoUploadFinished = false');
  //   			if(data.textStatus == 400) {
  //   				//token is invalid request new one
  //   				// requestFileUploadInformation();
  //   				// $scope.error = true;
  //   				// $scope.errorMessage = "Upload failed. Please retry."
  //   			}
  //   		},
  //   		done: function (e, data) {
  //   			//data properties: name, blobKey, url
  //   			var images = data.result;
  //   			//create logo resource object
  //   			$scope.logoResource = new ImageResource({
  //   				id: 'logo',
  //   				blobKey: images[0].blobKey,
  //   				url: images[0].url
  //   			});
  //   			$scope.$apply('logoUploadFinished = true');
  //      		}
		// });

	};

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login', 'Company', '$log', 'Account', 'errorHandler'];
