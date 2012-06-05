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
	// var reader = new FileReader(); //used to handles files

	//indicates if logo form is in view or edit mode
	$scope.logoFormMode = "view";

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
		$scope.logoFormMode = "edit";
	};

	/**
	*
	*/
	$scope.saveLogo = function() {
		// logoForm
		// var reader = new FileReader();
		// reader.onload = (function(logo) {
  //       	return function(e) {
  //       		$log.log('filereader onload');
  //       	};
  //     	})(logo);

  //     	reader.readAsDataURL(logo);
	};

	$scope.cancelLogo = function() {
		$scope.logoFormMode = "view";
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
				initUploadPlugin();
			})
			.error(function(data, status) {
				$log.error('Failed to request file upload information. Status: ' + status);
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
        		},
        		done: function (e, data) {
            	$.each(data.result, function (index, file) {
	                $('<p/>').text(file.name).appendTo(document.body);
    	        });
       		}
    	});
	};

};
Cloobster.Profile.$inject = ['$scope', '$http', 'facebookApi', 'login', '$log'];
