'use strict';

/* Config parameters */
var Karazy = {
		environment : "${karazy.environment}"
};

/* Cloobster namespace. Create if not exists.*/
var CloobsterAdmin =  {};

// Declare app level module which depends on filters, and services
CloobsterAdmin.module = angular.module('CloobsterAdmin', ['ngResource', 'CloobsterAdmin.services', 'CloobsterAdmin.directives', 'CloobsterAdmin.filters']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  	$locationProvider.hashPrefix = '!';
  	$routeProvider.when('/main', {templateUrl: 'partials/main.html'});
    $routeProvider.when('/dummydata', {templateUrl: 'partials/dummydata.html'});
    $routeProvider.when('/templates', {templateUrl: 'partials/templates.html', controller: CloobsterAdmin.Templates});
    $routeProvider.when('/trash', {templateUrl: 'partials/trash.html', controller: CloobsterAdmin.TrashCan});
    $routeProvider.when('/configuration', {templateUrl: 'partials/configuration.html'});
    $routeProvider.when('/packages', {templateUrl: 'partials/packages.html', controller:CloobsterAdmin.Package});
    $routeProvider.otherwise({redirectTo: '/main'});
 }]);

CloobsterAdmin.module.directive('alert', function(){
    return {
      restrict: 'A',
      replace: true,
      transclude: false,
      scope: { alert:'=' },
      template: '<div class="alert alert-block fade in" ng-class="alert.type" ng-show="alert.show">'+
	  				'<h4 class="alert-heading" ng-bind="alert.title">Error!</h4>'+
	  				'<span ng-bind="alert.message"></span>'+
	  				'<p><button type="button" class="btn" ng-click="dismissAlert()" data-dismiss="alert" ng-bind="alert.buttonText"></button></p>'+
				'</div>',
      // The linking function will add behavior to the template
      link: function(scope, element, attrs) {
      	scope.dismissAlert = function() {
          scope.alert.show = false;
      		if(angular.isFunction(scope.alert.continueFn)) {
      			scope.alert.continueFn();
      		}
      	};
      }
    };
  });

CloobsterAdmin.module.factory('Template', ['$resource', function($resource){
    return $resource('/admin/services/templates/:id',
      {
        'id': '@id'
      },
      {
        save: {method:'PUT'},
        init: {method:'POST', isArray: true}
      }
    );
}]);

CloobsterAdmin.module.factory('TrashEntry', ['$resource', function($resource){
    return $resource('/admin/services/trash/:id',
      {
        'id': '@id'
      },
      {
        restore: {method:'DELETE', params: {'restore':'true'}}
      }
    );
}]);


