/** @module CloobsterAdmin */
'use strict';

/**
* 	@name CloobsterAdmin.Navigation 
*	@requires $location
*
* 	Checks the active location path.
* 	@constructor
*/
CloobsterAdmin.Navigation = function($scope, $location) {
	var location;

	/**
	*
	*/
	$scope.getActive = function(path) {

		location = $location.path();
		return (location.indexOf(path) === 0) ? "active" : "";
	};
};
CloobsterAdmin.Navigation.$inject = ['$scope', '$location'];

/**
* 	@name CloobsterAdmin.Import
*	@requires $http
*
* 	Manages data import.
* 	@constructor
*/
CloobsterAdmin.Import = function($scope, $http, $anchorScroll) {
	
	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setError(message) {
		showAlert("alert-error", "Error!", message, "Try again", resetForm);
	}

	function setProgress( progress ) {
		$scope.importProgressStyle = { width: progress };
	}

	function importError(data, status) {
		var message = (data.message) ?
			data.message
			: "An unknown error occured, check the server and your connection.";
		setError(message);
	}

	function importSuccess() {
		setProgress("100%");
		showAlert("alert-success", "Done!", "Import done.", "Import more", resetForm);
	}

	function resetForm() {
		$scope.jsonData = "";
		$scope.importProgress = false;
		setProgress("0%");
	}

	$scope.submitImport = function() {
		var dto;
		$scope.importProgress = true;
		try {
			dto = angular.fromJson($scope.jsonData);	
		}
		catch(err) {
			setProgress("30%");
			setError("JSON parsing error: " + err.message);
			return;
		}
		$http.post($scope.importUrl, dto).success(importSuccess)
		.error(importError);
	}

	dismissAlert();
	setProgress("0%");
	resetForm();

	$anchorScroll();
}
CloobsterAdmin.Import.$inject = ['$scope', '$http', '$anchorScroll'];

/**
* 	@name CloobsterAdmin.Configuration
*	@requires $http
*
* 	Manages service configuration.
* 	@constructor
*/
CloobsterAdmin.Configuration = function($scope, $http, $anchorScroll, $timeout) {
	// Get current config from server
	$scope.spotPurePDFConfig = $http.get('/admin/s/configuration/spotpurepdf')
										.error(importError);
	$scope.saveSpotPurePDFConfigProgress = false;
	
	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setError(message) {
		showAlert("alert-error", "Error!", message, "Try again", resetForm);
	}

	function setProgress( progress ) {
		$scope.importProgressStyle = { width: progress };
	}

	function importError(data, status) {
		var message = (data.message) ?
			data.message
			: "An unknown error occured, check the server and your connection.";
		setError(message);
	}

	function importSuccess(data) {
		setProgress("100%");
		showAlert("alert-success", "Done!", "Import done.");
		$scope.defaultFeedbackForm = angular.toJson(data, true);

		$timeout(function() {
			resetForm();
		});
	}

	function resetForm() {
		$scope.importProgress = false;
		$scope.saveSpotPurePDFConfigProgress = false;
		setProgress("0%");
	}

	$scope.saveSpotPurePDFConfig= function() {
		$scope.saveSpotPurePDFConfigProgress = true;
		$http.put("/admin/s/configuration/spotpurepdf", $scope.spotPurePDFConfig).error(importError);
	};

	$scope.saveDefaultFeedback = function() {
		var dto;
		$scope.importProgress = true;
		try {
			dto = angular.fromJson($scope.defaultFeedbackForm);
		}
		catch(err) {
			setProgress("30%");
			setError("JSON parsing error: " + err.message);
			return;
		}
		$http.put("/admin/s/configuration/defaultfeedbackform", dto).success(importSuccess)
		.error(importError);
	}

	dismissAlert();
	setProgress("0%");
	resetForm();

	$scope.defaultFeedbackForm = "Loading ...";
	$http.get("/admin/s/configuration/defaultfeedbackform").success(function(data) {
		$scope.defaultFeedbackForm = angular.toJson(data, true);
	});



	$anchorScroll();
}
CloobsterAdmin.Configuration.$inject = ['$scope', '$http', '$anchorScroll', '$timeout'];

/**
* 	@name CloobsterAdmin.PDFConfiguration
*	@requires $http
*
* 	Manages PDF output configuration.
* 	@constructor
*/
CloobsterAdmin.PDFConfiguration = function($scope, $http, $timeout) {
	// Get current config from server
	$http.get('/admin/s/configuration/spotpurepdf')
		.success(function(data) {
			$scope.spotPurePDFConfig = data;
		})
		.error(handleError);

	function resetForm() {
		$scope.saveSpotPurePDFConfigProgress = false;
	}

	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setError(message) {
		showAlert("alert-error", "Error!", message, "Try again", resetForm);
	}

	function handleError(data, status) {
		var message = (data.message) ?
			data.message
			: "An unknown error occured, check the server and your connection.";
		setError(message);
	}

	function handleSuccess(data) {
		resetForm();
	}

	$scope.saveSpotPurePDFConfig= function() {
		$scope.saveSpotPurePDFConfigProgress = true;
		$http.put("/admin/s/configuration/spotpurepdf", $scope.spotPurePDFConfig)
			.success(resetForm)
			.error(handleError);
	};

	dismissAlert();
	resetForm();
}
CloobsterAdmin.PDFConfiguration.$inject = ['$scope', '$http', '$timeout'];


CloobsterAdmin.SelectBusiness = function($scope, $http) {
	$scope.businessSelected = false;
	$scope.message = "Loading businesses ...";
	$scope.business = {};

	$http.get('/admin/s/businesses').success( function(data ) {
		delete $scope.message;
		$scope.businesses = data;
		$scope.$watch('business', function(newVal, old, scope) {
			if(newVal.hasOwnProperty('id')) {
				scope.businessSelected = true;
			scope.importUrl = '/admin/s/businesses/'+newVal.id+'/feedbackforms';	
			}
		});
		$scope.business = $scope.businesses[0];
	}).error(function(status, data ) {
		$scope.message = status + " Error loading businesses."
	});
}
CloobsterAdmin.SelectBusiness.$inject = ['$scope', '$http'];

CloobsterAdmin.Templates = function($scope, Template) {

	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setTemplate() {
		if($scope.templates.length > 0) {
			$scope.template = $scope.templates[0];
		}
	}

	$scope.templates = Template.query(setTemplate);

	$scope.initTemplates = function() {
		$scope.templates = Template.init({}, setTemplate);
	};

	$scope.saveTemplate = function() {
		if($scope.editTemplateForm.$valid) {
			$scope.template.$save({}, angular.noop, function(data, status) {
				// Error callback.
				showAlert("alert-error", "Error code"+ status, "Error", "Close");
			});
		}
	};

	dismissAlert();
}
CloobsterAdmin.Templates.$inject = ['$scope', 'Template'];


CloobsterAdmin.TrashCan = function($scope, TrashEntry) {
	$scope.restoring = [];
	$scope.trashEntries = TrashEntry.query( function() {
		angular.forEach($scope.trashEntries, function(value, index) {
			$scope.restoring[index] = false;
		});
	});
	
	

	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setError(message) {
		showAlert("alert-error", "Error!", message, "Close");
	}


	$scope.restore = function(index) {
		var entry = $scope.trashEntries[index];
		$scope.restoring[index] = true;
		entry.$restore(function() {
			$scope.restoring[index] = false;
			$scope.trashEntries.splice(index,1);
		}, function(response) {
			$scope.restoring[index] = true;
			setError("Could not restore entity, http code:" + response.status+ ", message: " + response.message);
		});
	};

	dismissAlert();
};
CloobsterAdmin.TrashCan.$inject = ['$scope','TrashEntry'];

CloobsterAdmin.Fixes = function($scope, $http) {
	
};
CloobsterAdmin.Fixes.$inject = ['$scope', '$http'];

/**
* 	@name CloobsterAdmin.Import
*	@requires $http
*
* 	Manages data import.
* 	@constructor
*/
CloobsterAdmin.InfoPages = function($scope, $http, $anchorScroll) {
	
	function showAlert( type, title, message, buttonText, continueFn) {
		$scope.importAlert.type = type;
		$scope.importAlert.show = true;
		$scope.importAlert.message = message;
		$scope.importAlert.title = title;
		$scope.importAlert.buttonText = buttonText;
		$scope.importAlert.continueFn =  continueFn;
	}

	function dismissAlert() {
		$scope.importAlert = { show: false, type: "alert-error", message: "", title: "", buttonText:"Action", continueFn: dismissAlert};
	}

	function setError(message) {
		showAlert("alert-error", "Error!", message, "Try again", resetForm);
	}

	function setProgress( progress ) {
		$scope.importProgressStyle = { width: progress };
	}

	function importError(data, status) {
		var message = (data.message) ?
			data.message
			: "An unknown error occured, check the server and your connection.";
		setError(message);
	}

	function importSuccess() {
		setProgress("100%");
		showAlert("alert-success", "Done!", "All pages generated.", "Okay");
	}

	function resetForm() {
		$scope.infoPageCount = 30;
		$scope.generateProgress = false;
		setProgress("0%");
	}

	$scope.generate = function() {
		var promise,
			config = {};
		$scope.generateProgress = true;

		if($scope.useLang) {
			if(!$scope.lang) {
				// Error no language entered.
				setError("Enter a language key.");
				return;
			}

			// Set language header.
			config['headers'] = {
				'Content-Language': $scope.lang
			}
		}
		$http.post('/admin/s/businesses/'+$scope.business.id+'/infopages/'+$scope.infoPageCount, {}, config)
			.success(importSuccess)
			.error(importError);
	}

	dismissAlert();
	resetForm();

	$anchorScroll();
}
CloobsterAdmin.InfoPages.$inject = ['$scope', '$http', '$anchorScroll'];

