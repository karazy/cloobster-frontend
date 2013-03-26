//contains all resources used in frontend
angular.module('Cloobster.services').factory('cloobsterResource',['$resource','config', function($resource, config) {
	function ResourceFactory(url, paramDefaults, actions) {
		return $resource(config['serviceUrl'] + url, paramDefaults, actions);
	}

	return ResourceFactory;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Account' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Account',['cloobsterResource', function(cloobsterResource) {
	/**
	*	@name Cloobster.services.Account
	*	
	*/
	var Account = cloobsterResource('/b/accounts/:id',
			//params
			{
				'id': '@id'
			},
			//Custom actions can be called with $'methodname' on the Account.
			{
				/**
				*	@name Cloobster.services.Account#$register
				* 	Called to register a new business account for the Cloobster service.
				*	@params {Object} Object containing all the properties of the Account and Company to be created.
				*/
				'register': { method: 'POST' },
				/*
				* @name Cloobster.services.Account#$update
				* Like a save but uses PUT instead of POST. Feels more restful.
				*/
				'update': { method: 'PUT'}
			}
		);

	return Account;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Business' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Business',['cloobsterResource','login','errorHandler', function($resource,loginService,handleError) {	
	/**
	*	@name Cloobster.services.Business
	*	
	*/
	var resource,
		activeBusinesses,
		activeAccountId;

	function createResource(accountId) {
		return (resource = $resource('/b/businesses/:id',
					//params
					{
						'id': '@id'
					},
					//Custom actions can be called with $'methodname' on the Business.
					{
						/**
						* @name Cloobster.services.Business#$query
						* @override
						* Overrides default query method by adding account as default parameter
						*/
						'query':  {method:'GET', params: {'account' : accountId}, isArray:true},
						/**
						*	@name Cloobster.services.Business#$clone
						* 	Called to register a new business account for the Cloobster service.
						*	@params {Object} Object containing all the properties of the Business to be created.
						*/
						'clone': { method: 'POST'},
						/*
						* @name Cloobster.services.Business#$update
						* Like a save but uses PUT instead of POST. Feels more restful.
						*/
						'update': { method: 'PUT'}
					}
			));
	}

	return {
		buildResource: function(accountId) {
			return createResource(accountId);
		},
		getActiveBusinesses: function(refresh, callback) {
			var accountId = loginService.getAccount()['id'];
			if(accountId) {
				if(!activeBusinesses || (refresh === true) || (activeAccountId != accountId)) {
					if(!resource) {
						createResource(accountId);
					}
					activeBusinesses = resource.query({'account':accountId}, function() {
						if(callback) {
							//TODO if this is a proper function
							callback();
						}
					}, handleError);
					activeAccountId = accountId;
				}
				
				return activeBusinesses;				
			}
			else {
				return [];
			}
		},
		/**
		*	Returns a business image resource used to save, update images assigned to a business.
		*/
		buildImageResource: function(businessId) {
			return $resource('/b/businesses/:businessId/images/:id', {
				'businessId': businessId,
				'id': '@id'
			});
		},
		/**
		* Returns a resource to interact with subscriptions assigned to a business.
		*/
		buildSubscriptionResource: function(businessId) {
			return $resource('/b/businesses/:businessId/subscriptions/:id', {
				'businessId': businessId,
				'id': '@id'
			});
		}
	};
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Menu' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Menu', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.Menu
	*	
	*/
	var Menu = {
		/**
		*
		*/
		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/menus/:mid',
				{
					'mid' : '@id',
					'bid' : businessId
				},
				{
						/**
						* @name Cloobster.services.Menu#$query
						* @override
						* Overrides default query method by overriding businessId as default parameter
						*/
						'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
						/**
						*	@name Cloobster.services.Menu#$clone
						* 	Called to register a new business account for the Cloobster service.
						*	@params {Object} Object containing all the properties of the Business to be created.
						*/
						'clone': { method: 'POST'},
						/*
						* @name Cloobster.services.Menu#$update
						* Like a save but uses PUT instead of POST. Feels more restful.
						*/
						'update': { method: 'PUT'}
				}

				)
		}
	}

	return Menu;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Choice' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Choice', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.Menu
	*	
	*/
	var Choice = {
		/**
		*
		*/
		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/choices/:id',
				{
					'id' : '@id',
					'bid' : businessId
				},
				{
						/**
						* @name Cloobster.services.Choice#$query
						* @override
						* Overrides default query method by adding account as default parameter
						*/
						'query':  {method:'GET', params: {'bid' : businessId}, isArray:true},
						/**
						*	@name Cloobster.services.Choice#$clone
						* 	Called to register a new business account for the Cloobster service.
						*	@params {Object} Object containing all the properties of the Business to be created.
						*/
						'clone': { method: 'POST'},
						/*
						* @name Cloobster.services.Choice#$update
						* Like a save but uses PUT instead of POST. Feels more restful.
						*/
						'update': { method: 'PUT'}
				}

				)
		}
	}

	return Choice;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Product' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Product', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.Menu
	*	
	*/
	var Product = {
		/**
		*
		*/
		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/products/:pid',
				{
					'pid' : '@id',
					'bid' : businessId
				},
				{
						/**
						* @name Cloobster.services.Product#$query
						* @override
						* Overrides default query method by adding account as default parameter
						*/
						'query':  {method:'GET', params: {'bid' : businessId}, isArray:true},
						/**
						*	@name Cloobster.services.Product#$clone
						* 	Called to register a new business account for the Cloobster service.
						*	@params {Object} Object containing all the properties of the Business to be created.
						*/
						'clone': { method: 'POST'},
						/*
						* @name Cloobster.services.Product#$update
						* Like a save but uses PUT instead of POST. Feels more restful.
						*/
						'update': { method: 'PUT'},
						/*
						* @name Cloobster.services.Product#$process
						* Used to update collections of products.
						* @return
						*	Array of products with updated values.
						*/
						'process': { method: 'PUT', isArray:true}
				}

				)
		},
		/**
		*	Returns a InfoPage image resource used to save, update the image assigned to an InfoPage.
		*/
		buildImageResource: function(businessId, infoPageId) {
			return $resource('/b/businesses/:bid/products/:id/image', {
				'bid': businessId,
				'id': infoPageId
			});
		}
	}

	return Product;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Company' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Company',['cloobsterResource','login','errorHandler', function($resource,loginService,handleError) {
		var companyResource,
			activeCompany,
			/**
			*	@name Cloobster.services.Company
			*	
			*/
			Company = {
			getActiveCompany: function(refresh) {
				var companyId = loginService.getAccount()['companyId'];
				if(companyId) {
					if(!activeCompany || (refresh === true) || activeCompany['id'] != companyId) {
						createResource();
						activeCompany = companyResource.get({'id':companyId}, angular.noop, handleError);
					}
					
					return activeCompany;
				}
				else {
					return {};
				}
			},
			/**
			*	Returns a company resource.
			*/
			buildResource: function() {
				createResource();
				return companyResource;
			},
			/**
			*	Returns a company image resource used to save, update images assigned to a company profile.
			*/
			buildImageResource: function(companyId) {
				return $resource('/b/companies/:companyId/images/:id', {
					'companyId': companyId,
					'id': '@id'
				});
			}
		}

		function createResource() {
			if(!companyResource) {
				companyResource = $resource('/b/companies/:id', 
					{
					'id': '@id'
					},
					{
					/*
					* @name Cloobster.services.Company#$update
					* Like a save but uses PUT instead of POST.
					*/
					'update': { method: 'PUT'}
					}
				);
			}
		}

		return Company;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Spot' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Spot', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.Spot
	*	
	*/
	var Spot = {
		/**
		*
		*/
		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/spotsdata/:sid',
				{
					'sid' : '@id',
					'bid' : businessId
				},
				{
						/**
						* @name Cloobster.services.Spot#$query
						* @override
						* Overrides default query method by overriding businessId as default parameter
						*/
						'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
						/*
						* @name Cloobster.services.Spot#$update
						* Like a save but uses PUT instead of POST.
						* Used for udpates on single entities.
						*/
						'update': { method: 'PUT'},
						/*
						* @name Cloobster.services.Spot#$process
						* Used to update collections of spots.
						* @return
						*	Array of spots with updated values.
						*/
						'process': { method: 'PUT', isArray:true},
						/*
						* @name Cloobster.services.Spot#$generate
						* Creates multiple spots at once.
						* @return
						*	Created spots
						*/
						'generate' : { method: 'PUT', isArray:true}
				}

				)
		}
	}

	return Spot;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Area' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Area', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.Area
	*	
	*/
	var Area = {
		/**
		*
		*/
		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/areas/:id',
				{
					'id' : '@id',
					'bid' : businessId
				},
				{
						/**
						* @name Cloobster.services.Area#$query
						* @override
						* Overrides default query method by overriding businessId as default parameter
						*/
						'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
						/*
						* @name Cloobster.services.Area#$update
						* Like a save but uses PUT instead of POST.
						*/
						'update': { method: 'PUT'}
				}

				)
		}
	}

	return Area;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'CompanyAccount' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('CompanyAccount', ['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.CompanyAccount
	*	
	*/
	var CompanyAccount = {
		/**
		*
		*/
		buildResource: function(companyId) {
			return $resource('/b/companies/:cid/accounts/:accountId',
				{
					'accountId' : '@id',
					'cid' : companyId
				},
				{
						/**
						* @name Cloobster.services.CompanyAccount#$query
						* @override
						* Overrides default query method by adding account as default parameter
						*/
						'query':  {method:'GET', params: {'cid' : companyId}, isArray:true},
						/**
						*	@name Cloobster.services.CompanyAccount#$clone
						* 	Called to register a new company account for the Cloobster service.
						*	@params {Object} Object containing all the properties of the Business to be created.
						*/
						'clone': { method: 'POST'},
						/*
						* @name Cloobster.services.CompanyAccount#$update
						* Like a save but uses PUT instead of POST. Feels more restful.
						*/
						'update': { method: 'PUT'}
				}
				)
		}
	}

	return CompanyAccount;
}]);


/** 
* 	@constructor
* 	Factory function that creates the 'InfoPage' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('InfoPage',['cloobsterResource', function($resource) {
	/**
	*	@name Cloobster.services.InfoPage
	*	
	*/
	var InfoPage = {
		buildResource: function(businessId, language) {
			 return $resource('/b/businesses/:bid/infopages/:id',
					//params
					{
						'id' : '@id',
						'bid' : businessId
					},
					//Custom actions can be called with $'methodname' on the Account.
					{
						/**
						* @name Cloobster.services.InfoPage#$query
						* @override
						* Overrides default query method by overriding businessId as default parameter
						*/
						'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
						/*
						* @name Cloobster.services.InfoPage#$update
						* Like a save but uses PUT instead of POST.
						*/
						'update': { 
							method: 'PUT',
							headers: {'Content-Language': '*'}
						}
					}
				)
		},
		/**
		*	Returns a InfoPage image resource used to save, update the image assigned to an InfoPage.
		*/
		buildImageResource: function(businessId, infoPageId) {
			return $resource('/b/businesses/:bid/infopages/:id/image', {
				'bid': businessId,
				'id': infoPageId
			});
		}
	}
	return InfoPage;
}]);

/**
* @constructor
* Factory function that creates the 'Documents' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Documents', ['cloobsterResource', function($resource) {

	/**
	*	@name Cloobster.services.Documents
	*	
	*/
	var Documents = {

		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/documents/:id',
				//params
				{
					'id' : '@id',
					'bid' : businessId
				},
				//Custom actions can be called with $'methodname' on the Account.
				{
					/**
					* @name Cloobster.services.Documents#$query
					* @override
					* Overrides default query method by overriding businessId as default parameter
					*/
					'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
					/*
					* @name Cloobster.services.Documents#$update
					* Like a save but uses PUT instead of POST.
					*/
					'update': { 
						method: 'PUT'
					}
				}
			)
		}

	}
	return Documents;

}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Subscription' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
angular.module('Cloobster.services').factory('Subscription',['cloobsterResource', function(cloobsterResource) {
	/**
	*	@name Cloobster.services.Subscription
	*	
	*/
	var Subscription = cloobsterResource('/b/subscriptions/',
			//params
			{
				
			},
			//Custom actions can be called with $'methodname' on the Subscription.
			{
				/*
				* @name Cloobster.services.Subscription#$query
				* Get all subscriptions
				*/
				'query': { method: 'GET', isArray: true}
			}
		);

	return Subscription;
}]);

/**
* @constructor
* Factory function that creates the 'DashboardItem' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Nils Weiher
*/
angular.module('Cloobster.services').factory('DashboardItem', ['cloobsterResource', function($resource) {

	/**
	*	@name Cloobster.services.DashboardItem
	*	
	*/
	var DashboardItem = {

		buildResource: function(businessId) {
			return $resource('/b/businesses/:bid/dashboarditems/:id',
				//params
				{
					'id' : '@id',
					'bid' : businessId
				},
				//Custom actions can be called with $'methodname' on the Account.
				{
					/**
					* @name Cloobster.services.DashboardItem#$query
					* @override
					* Overrides default query method by overriding businessId as default parameter
					*/
					'query':  {method:'GET', params: { 'bid' : businessId}, isArray:true},
					/*
					* @name Cloobster.services.DashboardItem#$update
					* Like a save but uses PUT instead of POST.
					*/
					'update': { 
						method: 'PUT'
					}
				}
			)
		}

	}
	return DashboardItem;

}]);