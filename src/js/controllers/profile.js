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
Cloobster.Profile = function($scope, $http, facebookApi, loginService, Company, $log) {
	
	var ImageResource;

	//Company resource object.
	$scope.company = {
		images: {}
	};

	//Indicates if logo form is in view or edit mode.
	$scope.logoFormMode = "view";

	//Indicates if company profile is in view or edit mode.
	$scope.profileFormMode = "view";	

	//Indicates if logo upload is finished. And toggles the save button accordingly.
	$scope.logoUploadFinished = false;

	//resource to handle CRUD for logo
	$scope.logoResource = null;

	/**
	* Holds an array of fileUpload Information objects.
	* e.g.
	*	 [ { "name": "thefilename", "url": "touseasimagesrc", "blobKey": "usedbytheservertoidentifythefile"}]
	*/
	$scope.fileUploadInformation = [];

	//<-- start logo related actions -->

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
				}
			});
		}
	};

	/**
	* Discards changes made to logo and leaves edit mode.
	*/
	$scope.cancelLogo = function() {
		$scope.logoFormMode = "view";
		$scope.logoUploadFinished = false;

		//$scope.logoResource.$delete();
	};

	//<-- end logo related actions -->

	//<-- start logo related actions -->

	$scope.editProfile = function() {
		$scope.profileFormMode = "edit";
	};

	$scope.cancelProfile = function() {
		$scope.profileFormMode = "view";
	};	

	//<-- end logo related actions -->

	/**
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
	* Loads profile data if user is logged in.
	*/
	function loadProfileData() {
		var account = loginService.getAccount();

		$scope.company = Company.buildResource().get({
			id: account.companyId
		},function() {
			ImageResource = Company.buildImageResource($scope.company.id);
			$scope.company.images = {};
		});
	};

	$scope.$watch(loggedIn, function(newValue, oldValue) {
		if(newValue == true) {
			requestFileUploadInformation();
			loadProfileData();
		}
	});

	/**
	* Initializes the upload plugin for all upload fields.
	* It needs a previously optained fileUpeloadUrl fot setup.
	*/
	function initUploadPlugin() {
		if(!$scope.fileUploadUrl) {
			$log.error('initUploadPlugin: No fileUploadUrl set!');
			return;
		}

		//set up filedupload for logo
		jQuery('#logo').fileupload({
    		dataType: 'json',
    		url: $scope.fileUploadUrl,
    		fail: function(e, data) {
    			$log.error('Upload failed. Reason: '+data.errorThrown);
    			$scope.$apply('logoUploadFinished = false');
    		},
    		done: function (e, data) {
    			//data properties: name, blobkey, url
    			
    			//create logo resource object
    			$scope.logoResource = new ImageResource({
    				name: 'logo',
    				blobKey: data.blobkey,
    				url: data.url
    			});
    			$scope.$apply('logoUploadFinished = true');
       		}
		});

	};

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login', 'Company', '$log'];
