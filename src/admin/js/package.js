/** @module CloobsterAdmin */
'use strict';

CloobsterAdmin.Package = function($scope, $http, Package) {

	//available template packages
	$scope.packages = null;
	$scope.currentPackage = null;
	//ui flag, toggling a view of a table showing all templates or single template view
	$scope.showAllPackages = false;	

	//Manage package template functions
	$scope.loadPackages = function() {
		$scope.packages = Package.query({ 'template' : true});
	}

	$scope.showPackage = function(p) {
		$scope.showAllPackages = false;
		$scope.currentPackage = p;
	}

	$scope.showPackages = function() {
		$scope.currentPackage = null;
		$scope.showAllPackages = true;
	}

	$scope.newPackage = function() {
		$scope.showAllPackages = false;
		$scope.currentPackage = new Package();
	}

	$scope.savePackage = function() {
		if(!$scope.currentPackage) {
			return;
		}

		$scope.currentPackage.$save(
			function(response) {
				$scope.currentPackage = null;
				$scope.packages.push(response);
			});

		// if($scope.currentPackage.id) {
		// 	$scope.currentPackage.save();
		// } else {
		// 	//validate new package and save
		// }		
	}

	$scope.deletePackage = function() {
		if(!$scope.currentPackage) {
			return;
		}

		$scope.currentPackage.$delete(
			success,
			function() {alert('handle error')}
		);

		function success() {
			
			angular.forEach($scope.packages, function(p, index) {
				if(p.id == $scope.currentPackage.id) {
					$scope.packages.splice(index, 1);
					$scope.currentPackage = null;
					//exit loop
					return false;
				}
			});
		}
	}

	//Manage package subscription functions


	//General Functions

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
	}


	$scope.loadPackages();

}

CloobsterAdmin.Package.$inject = ['$scope', '$http', 'Package'];

//package resource
CloobsterAdmin.module.factory('Package', ['$resource', function($resource) {

	return $resource('/admin/services/subscriptions/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true}
		})

}]);
