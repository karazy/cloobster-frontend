CloobsterAdmin.resources = angular.module('CloobsterAdmin.resources', ['ngResource']);

CloobsterAdmin.resources.factory('Subscription', ['$resource', function($resource) {

	return $resource('/admin/m/subscriptions/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);


CloobsterAdmin.resources.factory('Company', ['$resource', function($resource) {

	return $resource('/admin/m/companies/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});
}]);


CloobsterAdmin.resources.factory('Location', ['$resource', function($resource) {

	return $resource('/admin/m/locations/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);

CloobsterAdmin.resources.factory('LocationSubscription', ['$resource', function($resource) {

	return $resource('/admin/m/locations/:bid/subscriptions/:id',
		{
			'id': '@id',
			'bid' : '@businessId'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);

CloobsterAdmin.resources.factory('User', ['$resource', function($resource) {

	return $resource('/admin/user/:id',
		{
			'id': '@id'
		}
	);

}]);

CloobsterAdmin.resources.factory('Template', ['$resource', function($resource){
    return $resource('/admin/s/templates/:id',
      {
        'id': '@id'
      },
      {
        save: {method:'PUT'},
        init: {method:'POST', isArray: true}
      }
    );
}]);

CloobsterAdmin.resources.factory('TrashEntry', ['$resource', function($resource){
    return $resource('/admin/s/trash/:id',
      {
        'id': '@id'
      },
      {
        restore: {method:'DELETE', params: {'restore':'true'}}
      }
    );
}]);

CloobsterAdmin.resources.factory('Account', ['$resource', function($resource){
    return $resource('admin/m/accounts/:id',
      {
        'id': '@id'
      },
      {
        update: {method:'PUT'}
      }
    );
}]);

/**
* @constructor
* Factory function that creates the 'CompanyConfiguration' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('CloobsterAdmin.services').factory('CompanyConfiguration', ['$resource', function($resource) {

	/**
	*	@name Cloobster.services.CompanyConfiguration
	*	
	*/
	var CompanyConfiguration = {

		buildResource: function() {
			return $resource('/admin/m/companies/:id/configurations/:name',
				//params	
				{
					'name' : '@name',
					'id' : '@id'
				},
				//Custom actions can be called with $'methodname'.
				{
					/**
					* @name Cloobster.services.CompanyConfiguration#$query
					* @override
					* Overrides default query method by overriding companyId as default parameter
					*/
					'query':  {method:'GET',  isArray:true}, //params: { 'id' : companyId},
					/*
					* @name Cloobster.services.CompanyConfiguration#$update
					* Like a save but uses PUT instead of POST.
					*/
					'update': { 
						method: 'PUT'
					}
				}
			)
		}

	}
	return CompanyConfiguration;

}]);
