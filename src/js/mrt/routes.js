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
            templateUrl: 'tpls/mrt/tpls/index.html'
        })
		.state('dashboard', {
            url: '/dashboard',
            templateUrl: 'tpls/mrt/tpls/dashboard.html'
        })
        .state('list-funds', {
            url: '/list-funds',
            controller: 'ListFundsCtrl',
            templateUrl: 'tpls/mrt/tpls/list-funds.html'
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
