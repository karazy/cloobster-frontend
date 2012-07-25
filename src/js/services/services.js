/* @module Cloobster/Services */

/**
*	@name Cloobster.Services
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.services = angular.module('Cloobster.services', ['ngResource', "Cloobster.translations"]);

/** 
*	@constructor
* 	Provider for the 'config' service.
* 	Returns configuration object used in all services.
* 
* 	@author Nils Weiher
*/
Cloobster.services.provider('config', function() {
	var self = this;
	/**
		Default config can be overridden with setConfig.
		@private
	*/
	self.config_ = {
		'serviceUrl' : '',
		'priceRegExp' : /([0123456789]+)\.([0123456789]*)/,
		'currencyFormats' : {
			'EUR': '$1,$2 €',
			'USD': '\$ $1.$2'
		}
	}

	/**
		Override the configuration paramters with the supplied map.

		@param {Object.<string, string>} config Paramter object for configuration.
			Only 'serviceUrl' is used at the moment.
	*/
	self.setConfig = function (config) {
		self.config_['serviceUrl'] = config['serviceUrl'];
		self.config_['priceRegExp'] = config['priceRegExp'];
		self.config_['currencyFormats'] = config['currencyFormats'];
	};

	self.setServiceUrl = function(serviceUrl) {
		self.config_['serviceUrl'] = serviceUrl;
	};

	self.setPriceRegExp = function(value) {
		self.config_['priceRegExp'] = value;
	};

	/**
	*	If called with one argument, override the currency formats with the specified map.
	*	If called with two arguments, set the format string (specified by the second argument)
	*	for currency specified by the first argument.
	*	@param {(Object.<string, string>|string)} a1 - Map or currency identifier if called with the second argument.
	*	@param {=string} a2 - format string for regex replacement for currency values.
	*/
	self.setCurrencyFormats = function(a1, a2) {
		if(arguments.length == 1) {
			self.config_['currencyFormats'] = a1;
		}

		if(arguments.length == 2) {
			self.config_['currencyFormats'][a1] = a2;
		}
	};

	self.$get = function() {
		return self.config_;
	};
});

Cloobster.services.factory('errorHandler',['$rootScope','$location','$log','lang','config', function($rootScope,$location,$log,langService,config) {
	/**
	*	Service to handle callback for errors during Resource methods.(get,save,query, etc.).
	*	
	*	@param {Object} response Object containing response and request data of the failed HTTP request.
	*/
	function handleError(response) {
		var errorKey = response.data['errorKey'],
			responseMessage = response.data['message'];

		$rootScope.error = true;
		// Set the error message to the first valid message out of the following:
		// - translation from the specified error key
		// - trasnlation from the http status code
		// - untranslated message from the response
		// - translated generic error text
		// - placeholder text

		$rootScope.errorMessage = langService.translate('common.error.'+ errorKey) || langService.translate('common.error.'+ response.status)
			|| responseMessage || langService.translate('common.error') || "Error during communication with service.";

		// Log the response.
		$log.error("Error during resource method, response object: " + angular.toJson(response));

		if(response.status == 405) {
			// User tried to modify locked business resource.
			// Return to businesses view.
			$location.path('businesses');
		}
	}

	return handleError;
}]);


Cloobster.services.factory('cloobsterResource',['$resource','config', function($resource, config) {
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
Cloobster.services.factory('Account',['cloobsterResource', function(cloobsterResource) {
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
Cloobster.services.factory('Business',['cloobsterResource', function($resource) {	
	/**
	*	@name Cloobster.services.Business
	*	
	*/
	var Business = {
		buildResource: function(accountId) {
			return $resource('/b/businesses/:id',
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
			)
		},
		/**
		*	Returns a business image resource used to save, update images assigned to a business.
		*/
		buildImageResource: function(businessId) {
			return $resource('/b/businesses/:businessId/images/:id', {
				'businessId': businessId,
				'id': '@id'
			});
		}
	}

	return Business;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Menu' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('Menu', ['cloobsterResource', function($resource) {
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
Cloobster.services.factory('Choice', ['cloobsterResource', function($resource) {
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
Cloobster.services.factory('Product', ['cloobsterResource', function($resource) {
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
						'update': { method: 'PUT'}
				}

				)
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
Cloobster.services.factory('Company',['cloobsterResource', function($resource) {
		/**
		*	@name Cloobster.services.Company
		*	
		*/
		var Company = {
			/**
			*	Returns a company resource.
			*/
			buildResource: function() {
				return $resource('/b/companies/:id', 
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

		return Company;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'Spot' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('Spot', ['cloobsterResource', function($resource) {
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
						*/
						'update': { method: 'PUT'}
				}

				)
		}
	}

	return Spot;
}]);

/** 
* 	@constructor
* 	Factory function that creates the 'CompanyAccount' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('CompanyAccount', ['cloobsterResource', function($resource) {
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
* 	Factory function that returns the 'facebookApi' service and
* 	adds listener for Facebook 'auth.statusChange' events.
*
* 	@see Cloobster.services.facebookApi
* 
* 	@author Nils Weiher
*/
Cloobster.services.factory('facebookApi', ['$q','$rootScope', function($q, $rootScope) {
	var fbApiService, 
	loggedIn = false,
	uid,
	accessToken,
	fbInitReceived = false;

	function subscribeFb () {
		FB.Event.subscribe('auth.statusChange', function(response) {
			if (response.authResponse) {
				// 'apply' the fbLoggedIn status so that every watcher
				// is notified of the status change.
				$rootScope.$apply('fbLoggedIn = true');
				// Save the unique id of the user returned by facebook.
				// We use that for authentication with the Cloobster service.
				uid = response.authResponse.userID;
				// save the accessToken returned by facebook to be used
				// for further calls to the API on behalf of the logged in user
				accessToken = response.authResponse.accessToken;
			} else {
				$rootScope.$apply('fbLoggedIn = false');
			}
		});
	}
	// Set the fbLoggedin variable for binding, so that templates can
	// react on status changes.
	$rootScope.fbLoggedIn = false;
	// listen for and handle auth.statusChange events
	$rootScope.$on('fbInit', function (event) {
		if(!fbInitReceived) {
			subscribeFb();
			fbInitReceived = true;
		}
	});

	if(window['FB']) {
		if(!fbInitReceived) {
			subscribeFb();
			fbInitReceived = true;
		}
	}

	/**
	*	@name Cloobser.services.facebookApi
	*
	*	Handles communication with Facebook SDK and listens to status changes.
	*	Authentication, retrieving of user data.
	*	
	*	@author Nils Weiher
	*/
	fbApiService = {
		/**
		*	@name Cloobser.services.facebookApi#getUid
		*	
		*	Get Uid of the logged in facebook account.
		*	
		*	@returns {String} uid of currently logged in account
		*/
		getUid : function () { return uid; },
		/**
		*	@name Cloobser.services.facebookApi#getAccessToken
		*
		*	Get access token from logged in facebook account.
		*	Used for further Api calls and authorization with Cloobster.
		*
		*	@returns {String} accessToken of currently logged in account
		*/
		getAccessToken : function () { return accessToken; },
		/*
		*	@name Cloobser.services.facebookApi#getUser
		*
		*	Get the User object of the currently logged in facebook acocunt.
		*	Fields depends on the accesstoken that was issued.
		*	Calls FB.api('/me')
		*	(currently only public visible profile and email are transmitted)
		*
		*	@returns {Object} promise object which should be resolved to user in the future.
		*/
		getUser : function () {
			// Create a deffered object to resolve/reject promise in the future
			var userDeferred = $q.defer();
			FB.api('/me', function(response) {
				if (!response || response.error) {
					// we need to use apply here as this function will be
					// called form outside the angular scope.
					// without apply the callbacks and the promise would not be resolved.
					$rootScope.$apply(function() {
						response = (response? response : 'error calling FB.api("/me")')
						userDeferred.reject(response);
					});		
				}
				else {
					$rootScope.$apply(function() {
						userDeferred.resolve(response);
					});
				}
			});

			return userDeferred.promise;
		},
		/**
		*	@name Cloobser.services.facebookApi#logout
		*	Log the user out of the Facebook account.
		*	Calls FB.logout()
		*/
		logout : function() { FB.logout(); },
		/**
		*	@name Cloobster.services.facebookApi#login
		*	Start a Facebook login and return the promise.
		*	Calls FB.login(callback)
		*	@returns {Object} promise which will be resolved with the login response or rejected with an errror message.
		*/
		login : function() {
			var loginDeferred = $q.defer();
			FB.login(function(response) {
				$rootScope.$apply(function() {
					if (response.authResponse) {
						uid = response.authResponse.userID;
						accessToken = response.authResponse.accessToken;
						$rootScope.fbLoggedIn = true;
						loginDeferred.resolve( response );
					} else {
						loginDeferred.reject((response.error ? response.error : 'user cancelled login'));
					}  
				}); 
			}, {scope: 'email'});
			// the email scope means we request access to the email saved for the Facebook account
			// more permission can be requested here in the future
			return loginDeferred.promise;
		}
	}
	return fbApiService;
}]);

/** 
* 	@constructor
* 	Factory function for the 'login' service.
* 	Returns the service.
* 
* 	@author Nils Weiher
*/
Cloobster.services.factory('login', ['$window','$http','$q','$rootScope', '$log', 'config', 
	function($window, $http, $q, $rootScope, $log, appConfig) {
		var loginService,
			loggedIn = false,
			account,
			loginDeferred,
			saveLogin = false,
			//used to prefill login form
			presetLogin = "",
			accessToken = null;

		// Set variable in the $rootScope so that its available for data binding.
		$rootScope.loggedIn = false;

	/**
	*	Callback to handle $http request success.
	*	Resolves the login promise returned by the various login methods.
	*
	*	@private
	*/
	function loginSuccess (data, status, headers, config) {
		//data should contain the account object for the login
		account = data;
		loggedIn = true;
		$rootScope.loggedIn = true;
		if(account.accessToken) {
			accessToken = account.accessToken;
		}
		if(saveLogin === true) {
			$window.localStorage['accessToken'] = accessToken;

			//$window.localStorage['login'] = account.login;
			//$window.localStorage['hash'] = account.passwordHash;
		}
		// Save access token as default header.

		$http.defaults.headers.common['X-Auth'] = accessToken;
		//set http default headers
		//$http.defaults.headers.common.login = account.login;
		//$http.defaults.headers.common.passwordHash = account.passwordHash;

		loginDeferred.resolve(data);
	}

	/**
	*	Callback to handle $http failure during login.
	*	Rejects the deferred login promise returned by the various login methods.
	*
	*	@private
	*/
	function loginError (data, status, headers, config) {
		$rootScope.loggedIn = false;
		// login data was not correct
		if(status == 401 || status == 403) {
			loginDeferred.reject({message: 'invalid login data'});
			
			if(existsSavedLogin()) {
				saveLogin = false;
				$window.localStorage.removeItem('accessToken');
			}
		}
		// server error during login
		else if (status == 500) {
			// Server returns error object in body
			loginDeferred.reject(data);
		}
		else {
			loginDeferred.reject({message: 'error during login request'}); 
		}
	}

	function existsSavedLogin() {
		if($window.localStorage['accessToken']) {
			return true;
		}
		else
			return false;
	}

	/**
	*	@name Cloobser.services.login
	*
	*	Handles communication with Cloobster account service.
	*	Retrieving account data, etc.
	*
	*	@author Nils Weiher
	*/
	loginService = {
		/**
		*	@name Cloobster.services.login#confirmEmail
		*
		*	Confirm the email adress of a user account with a token
		*	recieved from the registration confirmation mail.
		*
		*	@params {string} token, unique id created during account creation.
		*	@returns {Object} {@link angular.module.ng.$q promise} with the standard 'then' method,
		*		will be resolved with the confirmation data from the Server
		*		or rejected with a reason for the failure.
		*/
		confirmEmail: function (token) {
			loginDeferred = $q.defer();
			
			$http.put( appConfig['serviceUrl'] + '/b/accounts/confirmation/' + token, null).
			success(function (data) {
				// resolve the promise with the JSON object returned by the server.
				loginDeferred.resolve(data);
			}).error(loginError);

			return loginDeferred.promise;
		},
		/**
		*	@name Cloobster.services.login#confirmEmailUpdate
		*
		*	Confirm the new email adress of a user account with a token
		*	recieved from a confirmation mail.
		*
		*	@params {string} token, unique id created during account creation.
		*	@returns {Object} {@link angular.module.ng.$q promise} with the standard 'then' method,
		*		will be resolved with the confirmation data from the Server
		*		or rejected with a reason for the failure.
		*/
		confirmEmailUpdate: function (token) {
			loginDeferred = $q.defer();
			
			$http.put( appConfig['serviceUrl'] + '/b/accounts/email-confirmation/' + token, null).
			success(function (data) {
				// resolve the promise with the JSON object returned by the server.
				loginDeferred.resolve(data);
			}).error(loginError);

			return loginDeferred.promise;
		},
		/**
		*	@name Cloobster.services.login#getAccount
		*	Retrieve the logged in account.
		*
		*	@returns {Object} account of the logged in user or an empty object.
		*/
		getAccount : function() {
			if( loggedIn === true) {
				return account;
			}
			else {
				return {};
			}
		},
		/**
		*	@name Cloobster.services.login#existsSavedLogin
		*	Check if there exists saved login data.
		*
		*	@returns {boolean} true if login and hash is saved in the local storage,
		*		false if no saved login exists.
		*/
		existsSavedLogin: existsSavedLogin,
		/**
		*	@name Cloobster.services.login#loginResume
		*
		*	Use the saved login data to retrieve the user account.
		*
		*	@returns {Object} {@link angular.module.ng.$q promise} Object which	will
		*		be resolved with the user account data, or rejected with an error message.
		*/
		loginResume : function () {
			loginDeferred = $q.defer();

			if( existsSavedLogin() ) {
				accessToken = $window.localStorage['accessToken'];

				saveLogin = false;

				$http.get( appConfig['serviceUrl'] + '/accounts/login',
					{ headers: {	
						'X-Auth' : accessToken
					} }).
					success(loginSuccess).error(loginError);
				
			}
			else {
				// No login and hash saved in local storage.
				loginDeferred.reject({message: 'no saved login found'}); 
			}
			return loginDeferred.promise;
		},
		/**
		*	@name Cloobster.services.login#login
		*
		*	Do a login with the given login parameters.
		*
		*	@params {{login: string, password: string}} params Object containing login 
		*		and password for the account.
		*	@returns {Object} {@link angular.module.ng.$q promise} Object which	will
		*		be resolved with the user account data, or rejected with an error message.
		*/
		login : function(params) {
			if(angular.isObject(params)) {
				if(!angular.isString(params.login)) {
					$log.error('login parameter must be string');
				}
				if(!angular.isString(params.password)) {
					$log.error('password parameter must be string'); 
				}
			}
			else {
				$log.error('No login parameters given');
			}
			saveLogin = params.save;
			loginDeferred = $q.defer();
			$http.post( appConfig['serviceUrl'] + '/accounts/tokens', null,
				{ headers: {'login' : params.login, 'password' : params.password } }).
			success(loginSuccess).error(loginError);
			return loginDeferred.promise;
		},
		/**
		*	@name Cloobster.services.login#loginFb
		*
		*	Do a Facebook login with the given uid and accessToken.
		*
		*	@params {Object} params Object with the following properties:
		*		- **uid** - {string} UID of the Facebook account to login
		*		- **accessToken** - {string} valid accessToken issued by Facebook for this user
		*	@returns {Object} {@link angular.module.ng.$q promise} Object which	will
		*		be resolved with the user account data, or rejected with an error message.
		*/
		loginFb : function(params) {
			if(angular.isObject(params)) {
				if(!angular.isString(params.uid)) {
					$log.error('uid parameter must be string');
				}
				if(!angular.isString(params.token)) {
					$log.error('token parameter must be string'); 
				}
			}
			else {
				$log.error('No login parameters given');
			}
			saveLogin = params.save;
			loginDeferred = $q.defer();
			$http.get( appConfig['serviceUrl'] + '/accounts/loginfb',
				{ params: {'uid' : params.uid, 'token' : params.token } }).
			success(loginSuccess).error(loginError);
			return loginDeferred.promise;
		},
		/**
		*	@name Cloobster.services.login#logout
		*
		*	Logout the user from the application.
		*	Reset all status variables and remove saved login data from the local storage.
		*/
		logout : function() {
			saveLogin = false;
			loggedIn = false;
			$rootScope.loggedIn = false;
			account = null;
			presetLogin = "";

			delete $http.defaults.headers.common['X-Auth'];

			if(existsSavedLogin()) {
				$window.localStorage.removeItem('accessToken');
			}
		},

		/**
		* @name Cloobster.services.login#setPresetLogin
		* Set the presetLogin.
		* @param {string} value for presetLogin
		*/
		setPresetLogin : function(value) {
			presetLogin = value;
		},

		/**
		* @name Cloobster.services.login#setPresetLogin
		* Get the presetLogin.
		* @return {string} presetLogin
		*/
		getPresetLogin : function() {
			return presetLogin;
		}
	}
	return loginService;
}]);

/** 
* 	@constructor
* 	Factory function for the 'upload' service.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('upload', ['$window','$http','$q','$rootScope', '$log', 'config', 
	function($window, $http, $q, $rootScope, $log, appConfig) {
		var uploadService = null,
			fileUploadUrl,
			addedFile = null;

		/* For the time being we request the url directly before the upload.
		/* $rootScope.$watch('loggedIn', function(newValue, oldValue) { 
			if(newValue == true) {
				requestFileUploadInformation();
			}			
		});
		*/

		/**
		* @private
		* Requests information from server needed to upload files.
		* @returns {Httppromise} 
		*/
		function requestFileUploadInformation() {
			$log.log('requestFileUploadInformation');

			return $http.get(appConfig['serviceUrl']+ '/uploads/imagesurl').success(function(data, status) {
				$log.log('requestFileUploadInformation -> success');
				fileUploadUrl = data;
			})
			.error(function(data, status) {
				$log.error('Failed to request file upload information. Status: ' + status);
				return data;
			});
		};

		/**
		* @private
		* Initializes the upload plugin for a concrete file input element fields.
		* It needs a previously optained fileUpeloadUrl for setup.
		*/
		function initUploadPlugin(fileInput, resource, fileAddCallback, fileUploadCallback) {
			// if(!fileUploadUrl) {
			// 	$log.error('initUploadPlugin: No fileUploadUrl set!');
			// 	return;
			// }
			//selector, upload url, imageresource
			//set up filedupload for logo
			// jQuery(fileInput).fileupload({
	  //   		dataType: 'json',
	  //   		acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
	  //   		autoUpload: true,
	  //   		url: fileUploadUrl,
	  //   		fail: function(e, data) {
	  //   			$log.error('Upload failed. Reason: '+data.errorThrown);
	    		

	  //   			if(data.textStatus == 400) {
	  //   				//token is invalid request new one
	  //   				// requestFileUploadInformation();
	  //   				// $scope.error = true;
	  //   				// $scope.errorMessage = "Upload failed. Please retry."
	  //   			}
	  //   			callback(false);
	  //   		},
	  //   		done: function (e, data) {
	  //   			//data properties: name, blobKey, url
	  //   			var images = data.result;
	  //   			//create logo resource object
	  //   			resource.blobKey = images[0].blobKey;
	  //   			resource.url = images[0].url;

	  //   			callback(true);

	  //      	}
			// });

				jQuery(fileInput).fileupload({
					fail: function(e, data) {
	    			$log.error('Upload failed. Error thrown: '+data.errorThrown + ', status: '+ data.textStatus);

	    			fileUploadCallback(false, data);
	    		},
	    		done: function (e, data) {
	    			//data properties: name, blobKey, url
	    			var images = data.result;
	    			//create logo resource object
	    			resource.blobKey = images[0].blobKey;
	    			resource.url = images[0].url;

	    			addedFile = null;

	    			fileUploadCallback(true, data);	    			    			
	       	}
				});

        jQuery(fileInput).fileupload('option', {
            url: fileUploadUrl,
            maxFileSize: 10000000,
            autoUpload: false,
            acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
            process: [
                {
                    action: 'load',
                    fileTypes: /^image\/(gif|jpeg|png)$/,
                    maxFileSize: 20000000 // 20MB
                }
            ]
        });

        jQuery(fileInput).bind('fileuploadadd', function (e, data) {
        	addedFile = data;
        	fileAddCallback(data.files[0].name);
        });

		};

		uploadService = {

			/**
			* Initializes a fileupload.
			* @param fileInput
			*		The html file input that should be configured.
			* @param resource
			*		Imageresource used to set blobKey and url.
			*	@param fileAddCallback
			*		Called when a file has beed added for upload.
			*	@param fileUploadCallback
			*		Called when upload has finished.
			*/
			getFileUploadObject : function(fileInput, resource, fileAddCallback, fileUploadCallback) {

				initUploadPlugin(fileInput, resource, fileAddCallback, fileUploadCallback);

				return {
					/**
					* Triggers file upload.
					*/
					upload: function() {
						//if file has beed added to queue, upload it
						if(addedFile) {
							requestFileUploadInformation().then(function() {
								// We have the upload url, start the upload.
								jQuery(fileInput).fileupload('option','url', fileUploadUrl);
								addedFile.submit();
							}, function(data) {
								// Get upload url failed.
								fileUploadCallback(false, data);
							});
							
						};
					}
				}
				;

			}


		};

		return uploadService;
}]);


/** 
* 	@constructor
* 	Factory function for the 'lang' service.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('lang', ['$log', 'translation', function($log, translation) {
	/**
	* @private
	* Retrieve browser language.
	*
	*/
	function getBrowserLang() {
		var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
		$log.info('browser language: '+userLang);
		if(userLang === 'undefined'|| userLang.length == 0) {
			//use default language
			userLang = "DE";
		}
		return userLang.substring(0,2).toUpperCase();
	}

	var browserLang = getBrowserLang();

	/**
	*	@name Cloobser.services.lang
	*
	*	Exposes methods for translation and language handling.
	*
	*	@author Frederik Reifschneider
	*/
	var langService = {
		/**
		* @name Cloobster.services.lang#get
		* 
		* Return Browser language.
		*/
		get: function() {
					return getBrowserLang();
		},
		/**
		* @name Cloobster.services.lang#translate
		* 
		* Get translation for given key.
		* @param key
		*		Key for string to translate
		*	@return
		*		Translated string.
		*/
		translate: function(key) {
				
				if(!key || !translation[key]) {
					return "";
				}

				return translation[key][browserLang] || "";
		}
	}

	return langService;

}]);
