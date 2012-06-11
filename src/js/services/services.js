/** @module Cloobster/Services */

/**
*	@name Cloobster.Services
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.services = angular.module('Cloobster.services', ['ngResource']);

/** 
* 	@constructor
* 	Factory function that creates the 'Account' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('Account', function($resource) {
	/**
	*	@name Cloobster.services.Account
	*	
	*/
	var Account = $resource('/b/accounts/:id',
			//params
			{

			},
			//Custom actions can be called with $'methodname' on the Account.
			{
				/**
				*	@name Cloobster.services.Account#$register
				* 	Called to register a new business account for the Cloobster service.
				*	@params {Object} Object containing all the properties of the Account and Company to be created.
				*/
				register: { method: 'POST' }
			}
		);

	return Account;
});

/** 
* 	@constructor
* 	Factory function that creates the 'Business' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('Business', function($resource) {
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
});

/** 
* 	@constructor
* 	Factory function that creates the 'Company' resource service.
* 	See ngResource for further information on resource objects.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('Company', function($resource) {
		/**
		*	@name Cloobster.services.Company
		*	
		*/
		var Company = {
			/**
			*	Returns a company resource.
			*/
			buildResource: function() {
				return $resource('/b/companies/:id', {
					'id': '@id'
				});	
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
});

/** 
* 	@constructor
* 	Factory function that returns the 'facebookApi' service and
* 	adds listener for Facebook 'auth.statusChange' events.
*
* 	@see Cloobster.services.facebookApi
* 
* 	@author Nils Weiher
*/
Cloobster.services.
factory('facebookApi', ['$q','$rootScope', function($q, $rootScope) {
	var fbApiService, 
	loggedIn = false,
	uid,
	accessToken;
	// Set the fbLoggedin variable for binding, so that templates can
	// react on status changes.
	$rootScope.fbLoggedIn = false;
	// listen for and handle auth.statusChange events
	$rootScope.$on('fbInit', function (event) {
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
	});

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
			loginDeferred = $q.defer();
			FB.login(function(response) {
				$rootScope.$apply(function() {
					if (response.authResponse) {
						uid = response.authResponse.userID;
						accessToken = response.authResponse.accessToken;
						$rootScope.fbLoggedIn = true;
						loginDeferred.resolve( response );
					} else {
						reason = (response.error ? response.error : 'user cancelled login');
						loginDeferred.reject(reason);
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
*	@constructor
* 	Factory function for the 'config' service.
* 	Returns configuration object used in all services.
* 
* 	@author Nils Weiher
*/
Cloobster.services.factory('config', ['$q','$rootScope', '$log', function($q, $rootScope, $log) {
	var config = { 
		serviceUrl : '',
		debug:  true
	};

	return config;
}]);

/** 
* 	@constructor
* 	Factory function for the 'login' service.
* 	Returns the service.
* 
* 	@author Nils Weiher
*/
Cloobster.services.factory('login', ['$window','$http','$q','$rootScope', '$log', 'config', 
	function($window, $http, $q, $rootScope, $log, configuration) {
		var loginService,
			loggedIn = false,
			account,
			loginDeferred,
			saveLogin = false;

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
		if(saveLogin === true) {
			$window.localStorage['login'] = account.login;
			$window.localStorage['hash'] = account.passwordHash;
		}
		//set http default headers
		$http.defaults.headers.common.login = account.login;
		$http.defaults.headers.common.passwordHash = account.passwordHash;

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
			
			if($window.localStorage['login']) {
				saveLogin = false;

				$window.localStorage.removeItem('login');
				$window.localStorage.removeItem('hash');
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
			
			$http.put( configuration.serviceUrl + '/b/accounts/emailconfirmation', {confirmationToken: token}).
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
		existsSavedLogin: function() {
			if($window.localStorage['login'] && $window.localStorage['hash']) {
				return true;
			}
			else
				return false;
		},
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

			if($window.localStorage['login']) {
				saveLogin = true;
				storedLogin = {
					'login' : $window.localStorage['login'],
					'passwordHash' : $window.localStorage['hash']
				}
				
				$http.get( configuration.serviceUrl + '/accounts/login',
					{ headers: storedLogin }).
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
		*	@params {Object} params Object with the following properties:
		*		- **login** - {string} login name of the account
		*		- **password** - {string} password for the account
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
			$http.get( configuration.serviceUrl + '/accounts/login',
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
			$http.get( configuration.serviceUrl + '/accounts/loginfb',
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

			delete $http.defaults.headers.common.login;
			delete $http.defaults.headers.common.passwordHash;

			if($window.localStorage['login']) {
				$window.localStorage.removeItem('login');
				$window.localStorage.removeItem('hash');
			}
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
	function($window, $http, $q, $rootScope, $log, config) {
		var uploadService = null,
			fileUploadUrl;

		$rootScope.$watch('loggedIn', function(newValue, oldValue) { 
			if(newValue == true) {
				requestFileUploadInformation();
			}			
		});

		/**
		* @private
		* Requests information from server needed to upload files.
		*/
		function requestFileUploadInformation() {
			$log.log('requestFileUploadInformation');

			if(!fileUploadUrl) {
				$http.get('/uploads/imagesurl').success(function(data, status) {
					$log.log('requestFileUploadInformation -> success');
					fileUploadUrl = data;
				})
				.error(function(data, status) {
					$log.error('Failed to request file upload information. Status: ' + status);
				});
			}
		};

		/**
		* @private
		* Initializes the upload plugin for a concrete file input element fields.
		* It needs a previously optained fileUpeloadUrl for setup.
		*/
		function initUploadPlugin(fileInput, resource, statusObject) {
			// if(!fileUploadUrl) {
			// 	$log.error('initUploadPlugin: No fileUploadUrl set!');
			// 	return;
			// }
			//selector, upload url, imageresource
			//set up filedupload for logo
			jQuery('#'+fileInput).fileupload({
	    		dataType: 'json',
	    		// acceptFileType: /(\.|\/)(gif|jpe?g|png)$/i,
	    		url: fileUploadUrl,
	    		fail: function(e, data) {
	    			$log.error('Upload failed. Reason: '+data.errorThrown);
	    			// $scope.$apply('logoUploadFinished = false');
	    			
	    			statusObject.status = false;

	    			if(data.textStatus == 400) {
	    				//token is invalid request new one
	    				// requestFileUploadInformation();
	    				// $scope.error = true;
	    				// $scope.errorMessage = "Upload failed. Please retry."
	    			}
	    		},
	    		done: function (e, data) {
	    			//data properties: name, blobKey, url
	    			var images = data.result;
	    			//create logo resource object
	    			resource.blobKey = images[0].blobKey;
	    			resource.url = images[0].url;

	    			statusObject.status = true;
	    			// $scope.$apply('logoUploadFinished = true');
	       		}
			});

		};

		uploadService = {

			/**
			* Initializes a fileupload.
			* @param fileInput
			*	The html file input that should be configured.
			* @param resource
			*	
			*
			*/
			getFileUploadObject : function(fileInput, resource) {
				var status = {
					finished: false
				};

				initUploadPlugin(fileInput, resource, status);
				return status;

			}


		};

		return uploadService;
}]);