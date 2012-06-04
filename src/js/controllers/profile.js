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
Cloobster.Profile = function($scope, $http, facebookApi, loginService, $log) {
	var reader = new FileReader(); //used to handles files

	//indicates if logo form is in view or edit mode
	$scope.logo_form_mode = "view";

	/**
	* Holds an array of fileUpload Information objects.
	* e.g.
	*	 [ { "name": "thefilename", "url": "touseasimagesrc", "blobKey": "usedbytheservertoidentifythefile"}]
	*/
	$scope.fileUploadInformation = [];

	$scope.profile = {

		"logo" : "img/Logo_cloobster_klein.png"
	};


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
		$scope.logo_form_mode = "edit";
	};

	/**
	*
	*/
	$scope.saveLogo = function() {
		// logoForm
		var reader = new FileReader();
		reader.onload = (function(logo) {
        	return function(e) {
        		$log.log('filereader onload');
        	};
      	})(logo);

      	reader.readAsDataURL(logo);
	};

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
			})
			.error(function(data, status) {
				$log.error('Failed to request file upload information. Status: ' + status);
			});
		}
	})();

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login', '$log'];
