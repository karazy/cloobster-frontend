'use strict';

/* Config parameters */
var Karazy = {
	environment : "prod"
};

/* CloobsterAdmin namespace. Create if not exists.*/
var CloobsterAdmin =  window.CloobsterAdmin || {};

// Declare app level module which depends on filters, and services
CloobsterAdmin.module = angular.module('CloobsterAdmin', ['CloobsterAdmin.services','CloobsterAdmin.resources', 'CloobsterAdmin.directives', 'CloobsterAdmin.filters','ui.directives']).
  config(['$routeProvider', '$locationProvider','$httpProvider', function($routeProvider, $locationProvider,$httpProvider) {
    // Set API Version header
    $httpProvider.defaults.headers.common['cloobster-api'] = '2';

  	$locationProvider.hashPrefix = '!';
  	$routeProvider.when('/main', {templateUrl: 'partials/main.html'});
    $routeProvider.when('/dummydata', {templateUrl: 'partials/dummydata.html'});
    $routeProvider.when('/templates', {templateUrl: 'partials/templates.html', controller: CloobsterAdmin.Templates});
    $routeProvider.when('/trash', {templateUrl: 'partials/trash.html', controller: CloobsterAdmin.TrashCan});
    $routeProvider.when('/configuration', {templateUrl: 'partials/configuration.html'});
    $routeProvider.when('/management', {templateUrl: 'partials/management.html', controller:CloobsterAdmin.Package});
    $routeProvider.when('/management/:activeTab', {templateUrl: 'partials/management.html', controller:CloobsterAdmin.Package});
    $routeProvider.otherwise({redirectTo: '/main'});
 }]);

CloobsterAdmin.module.run(['$http', '$rootScope','$location', function($http, $rootScope, $location) {
  $http.get('/admin/user').success(function(response) {
    $rootScope.user = response;
    if($rootScope.user.awesome == false) {
      $location.url('/management');
    }
  });
}]);

CloobsterAdmin.module.directive('alert', function(){
    return {
      restrict: 'A',
      replace: true,
      transclude: false,
      scope: { alert:'=' },
      template: '<div class="alert alert-block fade in" ng-class="alert.type" ng-show="alert.visible">'+
            '<button type="button" class="close" ng-click="dismissAlert()">&times;</button>'+
	  				'<h4 class="alert-heading" ng-bind="alert.title">Error!</h4>'+
	  				'<span ng-bind="alert.message"></span>'+
	  				'<p ng-show="alert.buttonText"><button type="button" class="btn" ng-click="dismissAlert()" data-dismiss="alert" ng-bind="alert.buttonText"></button></p>'+
				'</div>',
      // The linking function will add behavior to the template
      link: function(scope, element, attrs) {
        scope.alert = {};
        scope.alert.show = function(type, title, message, buttonText, continueFn) {
          scope.alert.type = type;
          scope.alert.visible = true;
          scope.alert.message = message;
          scope.alert.title = title;
          scope.alert.buttonText = buttonText;
          scope.alert.continueFn =  continueFn;
        };

      	scope.alert.dismiss = scope.dismissAlert = function() {
          scope.alert.visible = false;
      		if(angular.isFunction(scope.alert.continueFn)) {
      			scope.alert.continueFn();
      		}
      	};
      }
    };
  });
