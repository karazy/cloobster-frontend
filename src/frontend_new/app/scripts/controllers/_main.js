'use strict';

/**
 * @ngdoc function
 * @name frontendNewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the frontendNewApp
 */
angular.module('frontendNewApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
