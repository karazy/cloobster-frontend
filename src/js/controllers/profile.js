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
Cloobster.Profile = function($scope, $http, facebookApi, loginService, Company, CompanyImage, $log) {
		//Company resource object.
	var company = null,
		//Resource for dealing with company images.
		companyImage = null;

	//Indicates if logo form is in view or edit mode.
	$scope.logoFormMode = "view";

	//Indicates if company profile is in view or edit mode.
	$scope.profileFormMode = "view";	

	//Indicates if logo upload is finished. And toggles the save button accordingly.
	$scope.logoUploadFinished = false;

	/**
	* Holds an array of fileUpload Information objects.
	* e.g.
	*	 [ { "name": "thefilename", "url": "touseasimagesrc", "blobKey": "usedbytheservertoidentifythefile"}]
	*/
	$scope.fileUploadInformation = [];

	$scope.profile = {

		"logo" : "img/Logo_cloobster_klein.png"
	};

	//<-- start logo related actions -->
	/**
	*
	*/
	$scope.getEmptyLogoClass = function() {
		return $scope.profile.logo ? "" : "noLogo";
	}

	/**
	*
	*/
	$scope.editLogo = function() {
		$scope.logoFormMode = "edit";
		$scope.logoUploadFinished = false;
	};

	/**
	*
	*/
	$scope.saveLogo = function() {
		$scope.logoUploadFinished = false;
		$scope.logoFormMode = "view";

		// /b/accounts/{id}/company/{id} PUT
	};

	$scope.cancelLogo = function() {
		$scope.logoFormMode = "view";
		$scope.logoUploadFinished = false;
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
	* Gets called immadiately.
	*/
	(function requestFileUploadInformation() {
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

	})();

	(function loadProfileData() {
		if($scope.loggedInd) {
					var account = loginService.getAccount();

			company = Company.get({
				id: account.id
			});

		}
	})();

	function initUploadPlugin() {
		if(!$scope.fileUploadUrl) {
			$log.error('initUploadPlugin: No fileUploadUrl set!');
			return;
		}
		$('#logo').fileupload({
        		dataType: 'json',
        		url: $scope.fileUploadUrl,
        		fail: function(e, data) {
        			$log.error('Upload failed. Reason: '+data.errorThrown);
        			$scope.logoUploadFinished = false;
        		},
        		done: function (e, data) {
        			$scope.logoUploadFinished = true;        			
       		}
    	});
	};

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login', 'Company', 'CompanyImage', '$log'];
