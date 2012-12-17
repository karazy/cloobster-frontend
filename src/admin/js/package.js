/** @module CloobsterAdmin */
'use strict';

CloobsterAdmin.Package = function($scope, $http) {


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

}

CloobsterAdmin.Package.$inject = ['$scope', '$http'];

