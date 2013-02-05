CloobsterAdmin.ChannelsController = function($scope, $http) {
	var channelsLoading = false,
			locationsLoading = false;
	$scope.channels = null;
	$scope.refreshing = false;

	function buildChannelUrl(channel) {
		if(channel) {
			return "/admin/m/locations/" + channel['locationId'] + '/channels/' + channel['id'];
		}
	}

	$scope.sendLocationWarning = function() {
		var location = this.location,
				scope = this;
		if(location) {
			this.sendLocationWarningProgress = true;
			this.sendLocationWarningText = 'Sending ...';
			$http.post("/admin/m/locations/"+location.id+'/offlinewarning', null).success(function(data) {
				scope.sendLocationWarningProgress = false;
				scope.sendLocationWarningText= 'Done';
			});
		}
	}

	$scope.sendWarning = function(index) {
		var channel = this.channel,
				scope = this;
		if(channel) {
			this.sendWarningProgress = true;
			this.sendWarningText = 'Sending ...';
			$http.post(buildChannelUrl(channel)+'/warning', null).success(function(data) {
				scope.sendWarningProgress = false;
				$scope.locations[channel.locationId].channels[index] = data;
				scope.sendWarningText= 'Done';
			});
		}
	}

	$scope.removeChannel = function(index) {
		var channel = this.channel,
				scope = this;
		if(channel) {
			this.removeChannelProgress = true;
			this.removeChannelText = 'Removing ...';
			$http['delete'](buildChannelUrl(channel), null).success(function() {
				$scope.locations[channel.locationId].channels.splice(index, 1);

				scope.removeChannelProgress = false;
				scope.removeChannelText = 'Done';
			});
		}
	}

	function loadLocationsAndChannels() {
		$scope.refreshing = true;
		locationsLoading = true;
		channelsLoading = true;
		$scope.locations = {};

		$http.get("/admin/m/locations").success(function (data) {
			angular.forEach(data, function(location, index) {
				if($scope.locations[location.id]) {
					angular.extend($scope.locations[location.id], location);
				}
				else {
					$scope.locations[location.id] = location;
				}
			});
			locationsLoading = false;
			$scope.refreshing = locationsLoading || channelsLoading;
		});

		$scope.refresh();
	}

	$scope.refresh = function() {
		$scope.refreshing = true;
		angular.forEach($scope.locations, function(location, index) {
			location['channels'] = [];
		});
		$http.get("/admin/m/channels").success(function(data) {
			angular.forEach(data, function(channel, index) {
				if($scope.locations[channel.locationId]) {
					if(!$scope.locations[channel.locationId]['channels']) {
						$scope.locations[channel.locationId]['channels'] = [];
					}
					$scope.locations[channel.locationId].channels.push(channel);					
				}
				else {
					$scope.locations[channel.locationId] = { 'channels' : [channel] };
				}
			});
			$scope.channels = data;
			channelsLoading = false;
			$scope.refreshing = locationsLoading || channelsLoading;
		});

	};



	loadLocationsAndChannels();
}
CloobsterAdmin.ChannelsController.$inject = ['$scope', '$http'];