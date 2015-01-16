'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('Pension').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'pension/tpls/index.html'
        })
        .state('list-funds', {
            url: '/list-funds',
            controller: 'ListFundsCtrl',
            templateUrl: 'pension/tpls/list-funds.html'
        })
         .state('view-fund', {
            url: '/view-fund/:phoneId',
            controller: 'ViewFundCtrl',
            templateUrl: 'pension/tpls/view-fund.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'tables.html'
        });
}]);
