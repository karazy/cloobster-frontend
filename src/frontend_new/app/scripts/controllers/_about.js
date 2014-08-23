'use strict';

/**
 * @ngdoc function
 * @name frontendNewApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the frontendNewApp
 */
angular.module('frontendNewApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
