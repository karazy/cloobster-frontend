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
Cloobster.Profile = function($scope, $http, facebookApi, loginService) {

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
	}

	/**
	* Requests information from server needed to upload files.
	*
	*/
	$scope.requestFileUploadInformation = function() {
		$http.get('/uploads/images').success(function(data, status) {
			$scope.fileUploadUrl = data;
		})
		.failure(function(data, status) {

		});
	}

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login'];
