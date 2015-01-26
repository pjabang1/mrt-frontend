'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('MRT').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'module/mrt/app/templates/index.html'
        })
		.state('dashboard', {
            url: '/dashboard',
            templateUrl: 'module/mrt/app/templates/dashboard.html'
        })
        .state('geomodel', {
            url: '/geomodel',
            controller: 'GeoModelCtrl',
            templateUrl: 'module/mrt/geomodel/templates/geomodel-index.html'
        })
         .state('view-fund', {
            url: '/view-fund/:phoneId',
            controller: 'ViewFundCtrl',
            templateUrl: 'tpls/mrt/tpls/tpls/view-fund.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'tables.html'
        });
}]);
