/** @module Cloobster/Services */

/**
*	@name Cloobster.Services
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/

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
	function handleError(_response, _status, _headers, _config) {
		var response;
		if(arguments.length > 1) {
			response = {};
			response.data = _response;
			response.status = _status;
			response.headers = _headers;
			response.config = _config;
		}
		else {
			if(_response.hasOwnProperty('data')) {
				response = _response;	
			}
			else {
				response = {
					'data': _response
				}
			}
			
		}

		var errorKey = response.data['errorKey'],
			responseMessage = response.data['message'];

		$rootScope.error = true;
		// Set the error message to the first valid message out of the following:
		// - translation from the specified error key
		// - translation from the http status code
		// - untranslated message from the response
		// - translated generic error text
		// - placeholder text

		$rootScope.errorMessage = langService.translate(errorKey) || langService.translate('error.'+ response.status)
			|| responseMessage || langService.translate('error.general') || "Error during communication with service.";

		// Log the response.
		$log.error("Error during http method, response object: " + angular.toJson(response));

		if(response.status == 405) {
			// User tried to modify read-only resource.
			// Should only happen if a user deletes a resource, while another user edits.
			// Return to businesses view.
			$location.path('businesses');
		}
	}
	
	handleError.reset = function() {
		$rootScope.error = false;
	};

	return handleError;
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
Cloobster.services.factory('login', ['$window','$http','$q','$rootScope', '$log', 'config', '$location','lang',
	function($window, $http, $q, $rootScope, $log, appConfig, $location,lang, Company, handleError) {
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
	$rootScope.customer = false;

	$rootScope.$on('$routeChangeSuccess',function(event, current, previous) {
		if(current.$route && current.$route.hasOwnProperty('customer')) {
			$rootScope.customer = true;
		}
	});

	/**
	*	Callback to handle $http request success.
	*	Resolves the login promise returned by the various login methods.
	*
	*	@private
	*/
	function loginSuccess (data, status, headers, config) {
		//data should contain the account object for the login
		account = data;
		// Cockpit users currently cant use any frontend functions.
		if(account.role === 'cockpituser') {
			loginDeferred.reject({'errorKey': 'login.error.cockpituser'});
			return;
		}
		if(account.role === 'user') {
			loginDeferred.reject({'errorKey': 'error.403'});
			return;
		}
		loggedIn = true;
		$rootScope.loggedIn = true;
		if(account.accessToken) {
			accessToken = account.accessToken;
		}
		if(saveLogin === true) {
			$window.localStorage['accessToken'] = accessToken;
		}
		// Save access token as default header.

		$http.defaults.headers.common['X-Auth'] = accessToken;

		// Reset activeBusinessId on rootScope.
		$rootScope.activeBusinessId = null;

		loginDeferred.resolve(data);
	}

	/**
	*	Callback to handle $http failure during login.
	*	Rejects the deferred login promise returned by the various login methods.
	*
	*	@private
	*/
	function loginError (data, status, headers, config) {
		var response = {'data': data, 'status':status, 'headers':headers, 'config': config };

		$rootScope.loggedIn = false;
		
		// login data was not correct
		if(status == 401 || status == 403) {
			if(existsSavedLogin()) {
				saveLogin = false;
				$window.localStorage.removeItem('accessToken');
			}
		}

		loginDeferred.reject( response );
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
		/*
		*
		* @param {string} token Token supplied via a link from an email message.
		* @param {string} password new password for this account.(already validated)
		*/
		passwordReset: function(token, password) {
			return $http.put( appConfig['serviceUrl'] + '/accounts/password-reset/'+token, { 'password' : password});
		},
		/*
		*
		* @param {string} email Request password reset for an account with that e-mail address.
		*/
		requestPasswordReset: function(email) {
			return $http.post( appConfig['serviceUrl'] + '/accounts/password-reset', { 'email' : email});
		},
		/*
		* Execute a HTTP request with authentication via login and password instead of accessToken.
		* Used to make sure, that the session was not used.
		*
		* @param {string} password Plain-text password of the logged in user.
		* @param {function} doRequest Function to call to make a http request with the account credentials.
		*/
		authenticatedRequest: function(password, doRequest) {
			delete $http.defaults.headers.common['X-Auth'];
			$http.defaults.headers.common['login'] = account.login;
			$http.defaults.headers.common['password'] = password;

			doRequest();

			delete $http.defaults.headers.common['login'];
			delete $http.defaults.headers.common['password'];

			// Set auth header with access token again.
			$http.defaults.headers.common['X-Auth'] = accessToken;
		},
		/**
		*	@name Cloobster.services.login#confirmEmail
		*
		*	Confirm the email adress of a user account with a token
		*	recieved from the registration confirmation mail.
		*
		*	@param {string} token, unique id created during account creation.
		*	@returns {HttpPromise} {@link angular.module.ng.$q promise} with the standard 'then' method,
		*		will be resolved with the confirmation data from the Server
		*		or rejected with a reason for the failure.
		*/
		confirmEmail: function (token) {
			return $http.put( appConfig['serviceUrl'] + '/b/accounts/confirmation/' + token, null);
		},
		/**
		*	@name Cloobster.services.login#confirmEmailUpdate
		*
		*	Confirm the new email adress of a user account with a token
		*	recieved from a confirmation mail.
		*
		*	@param {string} token, unique id created during account update.
		*	@returns {HttpPromise} {@link angular.module.ng.$q promise}
		*/
		confirmEmailUpdate: function (token) {
			return $http.put( appConfig['serviceUrl'] + '/b/accounts/email-confirmation/' + token, null);
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
		*	Set the account information of the logged in account.
		*
		*	@param {Object} _account Update the currenty logged in account.
		*/
		setAccount: function(_account) {
			if(loggedIn === true) {
				account = _account;
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

			if(loginDeferred)

			if( existsSavedLogin() ) {
				accessToken = $window.localStorage['accessToken'];

				if($window.localStorage['accessTokenTransient']) {
					$window.localStorage.removeItem('accessToken');
					$window.localStorage.removeItem('accessTokenTransient');
				}

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
		logout : function(redirectPath) {
			saveLogin = false;
			loggedIn = false;
			$rootScope.loggedIn = false;
			account = null;
			presetLogin = "";

			delete $http.defaults.headers.common['X-Auth'];

			if(existsSavedLogin()) {
				$window.localStorage.removeItem('accessToken');
			}

			if(redirectPath) {
				$location.path(redirectPath);
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
		function initUploadPlugin(fileInput, resource, fileAddCallback, fileUploadCallback, fileUploadProgressCallback) {
			// Destroy first to make sure we dont double the initialisation
			try {
				jQuery(fileInput).fileupload('destroy');	
			} catch(e) {
				$log.log('Services.initUploadPlugin: failed to destroy fileupload' + e);
			}
			
			$('#foo').unbind('fileuploadadd');
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
       	},
       	progress: function(e, data) {
       		(fileUploadProgressCallback || angular.noop)(data);
       	},
		    add: function (e, data) {
        	addedFile = data;
        	fileAddCallback(data.files[0].name, data.files[0]);
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
			getFileUploadObject : function(fileInput, resource, fileAddCallback, fileUploadCallback, fileUploadProgressCallback) {
				var userAbort = false,
						uploadRequest = null;
				initUploadPlugin(fileInput, resource, fileAddCallback, fileUploadCallback, fileUploadProgressCallback);

				return {
					/**
					* Triggers file upload.
					*/
					upload: function() {
						userAbort = false;
						//if file has beed added to queue, upload it
						if(addedFile) {
							requestFileUploadInformation().then(function() {
								// We have the upload url, start the upload.
								if(!userAbort) {
									jQuery(fileInput).fileupload('option','url', fileUploadUrl);
									uploadRequest = addedFile.submit();
								}
								else {
									fileUploadCallback(false, {'errorThrown': 'abort'});
								}
							}, function(data) {
								// Get upload url failed.
								fileUploadCallback(false, data);
							});
							
						};
					},
					/**
					*  Use File API (if supported) to check dimensions of added file.
					*
					*/
					checkImageDimensions: function(callback, minWidth, minHeight) {
						if(!callback) {
							return;
						}
						minHeight = parseInt(minHeight) || 0;
						minWidth = parseInt(minWidth) || 0;

						if(minWidth == 0 && minHeight == 0) {
							// No constraints to check
							return;
						}

						if(addedFile && window.FileReader) {
							var fr = new FileReader;

							fr.onload = function() { // file is loaded
							    var img = new Image;

							    img.onload = function() {
							      if(img.width < minWidth || img.height < minHeight) {
							      	callback(false);
							      }
							      else {
							      	callback(true);
							      }
							    };

							    img.src = fr.result; // is the data URL because called with readAsDataURL
							};

							fr.readAsDataURL(addedFile.files[0]);
							// Return true to see that we have a check in progress.
							return true;
						}
						else {
							return false;
						}
					},
					/**
					*  Cancel fileupload in progress.
					*
					*/
					cancel: function() {
						userAbort = true;
						if(uploadRequest) {
							uploadRequest.abort();
						}
					}
				};
			},

			requestImageCrop : function(blobKey, leftX, topY, rightX, bottomY) {
				return $http.put(appConfig['serviceUrl'] + '/uploads/images/'+ blobKey,
					{'leftX': leftX, 'topY': topY, 'rightX': rightX, 'bottomY': bottomY});
			},
			deleteUpload: function(blobKey) {
				return $http['delete'](appConfig['serviceUrl'] + '/uploads/images/'+ blobKey);
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

/** 
* 	@constructor
* 	Factory function for the 'loadingService' service.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*	@inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
Cloobster.services.factory('loadingService', function() {

  var service = {
  	/**
	* @name Cloobster.services.loadingService#requestCount
	* 
	* Number of running requests.
	*/
    requestCount: 0,
    /**
	* @name Cloobster.services.loadingService#isLoading
	* 
	* Indicates if a request is running.
	* @return true if requestCount > 0, false otherwise
	*/
    isLoading: function() {
      return service.requestCount > 0;
    }
  };
  return service;
});

/** 
* 	@constructor
* 	Factory function for the 'onStartInterceptor' service.
* 	Returns the service. Acts as an interceptor for http requests.
*	Increases the requestCount of loadingService when a new request starts and sets $rootScope.ajaxLoading 	
*
* 	@author Frederik Reifschneider
*	@inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
Cloobster.services.factory('onStartInterceptor', ['loadingService', '$rootScope', function(loadingService, $rootScope) {
  return function (data, headersGetter) {
    loadingService.requestCount++;
    $rootScope.ajaxLoading = loadingService.isLoading();
    return data;
  };
}]);

/** 
* 	@constructor
* 	Factory function for the 'onCompleteInterceptor' service.
* 	Returns the service. Acts as an interceptor for http requests.
*	Decreases the requestCount of loadingService when a new request starts and sets $rootScope.ajaxLoading 
* 
* 	@author Frederik Reifschneider
*	@inspiredby https://groups.google.com/forum/#!msg/angular/BbZ7lQgd1GI/GJBTXcJLQMkJ
*/
Cloobster.services.factory('onCompleteInterceptor', ['loadingService', '$rootScope','$q', function(loadingService, $rootScope, $q) {
  	return function (promise) {
            return promise.then(function (response) {
            	loadingService.requestCount--;
                $rootScope.ajaxLoading = loadingService.isLoading();
                return response;

            }, function (response) {
                loadingService.requestCount--;
                $rootScope.ajaxLoading = loadingService.isLoading();
                return $q.reject(response);
            });
    };
}]);

/**
* Add Cloobster.services.onCompleteInterceptor as $http interceptor.
*/
Cloobster.services.config(['$httpProvider', function($httpProvider) {
  $httpProvider.responseInterceptors.push('onCompleteInterceptor');
}]);

/**
* Add Cloobster.services.onStartInterceptor as $http transform method.
*/
Cloobster.services.run(['$http','onStartInterceptor',function($http, onStartInterceptor) {
  $http.defaults.transformRequest.push(onStartInterceptor);
}]);

/** 
* 	@constructor
* 	Factory function for the 'helper' service.
* 	Provides a number of useful helper methods.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*/
Cloobster.services.factory('helper', function() {

  var helperFunctions = {

    /*
	* Get css class for field highlighting.
	* @param {NgModelController} input ng-model controller for the input to check.
	* @returns error if dirty && invalid
	*		  success if dirty && !invalid
	*         empty string otherwise
	*/
	getFieldInputClass : function(input) {
		if(input.$dirty && input.$invalid) {
			return "error";
		} else if (input.$dirty && !input.$invalid) {
			return "success";
		} else {
			return "";
		}
	}
  };

  return helperFunctions;
});

/** 
* 	@constructor
* 	Factory function for the 'validator' service.
*		Contains methods 
* 
* 	@author Nils Weiher
*/
Cloobster.services.factory('validator', function() {

	var validator = {
		/*
		* @param model
		*	The object to validate
		* @param requiredFields
		*	Object containing the required fields
		* @return
		*	True if valid model
		*/
		validateModel : function(model, requiredFields) {
			for(var field in requiredFields) {
				if(requiredFields[field] === true) {
					if(!model[field] || !model[field].length > 0) {
						return false;
					}
				}
			}

			return true;
		}
	}

	return validator;
});

/**
* @constructor
* Factory function for 'listUtil' service.
* Contains convienient methods to handle lists
* 
* 	@author Frederik Reifschneider
*
*/
Cloobster.services.factory('listUtil', ['$filter','$log', function($filter,$log) {

	var listFunctions = {
		/**
		* Check/Uncheck elements regarding the given search filter.
		* If less then all filtered spots are checked, check all of them. Otherwise uncheck all.
		* @param {Array<Object>} list
		*	List of objects to check/uncheck
		* @param {Object} filter (optional)
		*  e.g. someProduct.name= 'XYZ' where someProduct is a product object and list gets filtered by name value
		* @param {Boolean} uncheck (optional)
		*	True to force uncheck on all elements
		*/
		checkElements: function(list, filter, uncheck) {
			var filtered = null,
				setChecked;

			if(!list && list.length > 0) {
				$log.log('Cloobster.services.listUtil.checkElements: list does not exist or is empty.');
				return;
			}
			
			if(filter) {
				filtered = $filter('filter')(list, filter);	
			} else {
				filtered = list;
			}
			
			if(!uncheck) {
				setChecked = jQuery.grep(filtered, function(element) {
					return element.checked;
				}).length < filtered.length;


				angular.forEach(filtered, function(element, index) {
					element.checked = setChecked;		
				});
			} else {
				angular.forEach(filtered, function(element, index) {
					element.checked = false;		
				});
			}

		}
	}	

	return listFunctions;
}]);

/**
* @constructor
* Factory function for 'randomUtil' service.
* Contains convienient to generate random strings for testing purpose.
* 
* 	@author Frederik Reifschneider
*
*/
Cloobster.services.factory('randomUtil', function() {
	var randomFns = {
		/**
		* Generate a random string of given length.
		* String consists of letters and numbers.
		*/
		genRndString: function(length) {
			var _length = length || 10,
				_text = "",
				possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	    	for( var i=0; i < length; i++ ) {
	    		_text += possible.charAt(Math.floor(Math.random() * possible.length));	
	    	}
	        
	    	return _text;
		},
		/**
		* Generates a random integer for given range.
		* @return 
		*	a random integer 
		*/
		genRndNumber: function(min, max) {
			var _number = Math.random() * (max - min) + min;

			return Math.floor(_number);
		}
	}

	return randomFns;
});


