'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('MRT').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes

        $stateProvider
            .state('index', {
                url: '/',
                controller: 'AuthenticationCtrl',
                templateUrl: 'module/mrt/app/templates/index.html'
            })
            .state('dashboard', {
                url: '/dashboard',
                controller: 'DashboardCtrl',
                templateUrl: 'module/mrt/app/templates/dashboard.html'
            })
            .state('geomodel-weight', {
                url: '/geomodel/weight/:id',
                controller: 'GeoModelWeightCtrl',
                templateUrl: 'module/mrt/geomodel/templates/weight-index.html'
            }).state('geomodel', {
                url: '/geomodel',
                controller: 'GeoModelCtrl',
                templateUrl: 'module/mrt/geomodel/templates/index.html'
            })
            .state('geography', {
                url: '/geography',
                controller: 'GeographyCtrl',
                templateUrl: 'module/mrt/geography/templates/index.html'
            })
            .state('geogroup', {
                url: '/geogroup',
                controller: 'GeoGroupCtrl',
                templateUrl: 'module/mrt/geogroup/templates/index.html'
            })
            .state('geogroup-view', {
                url: '/geogroup-view/:id',
                controller: 'GeoGroupViewCtrl',
                templateUrl: 'module/mrt/geogroup/templates/view.html'
            })
            .state('geoindicatorgroup', {
                url: '/geoindicatorgroup',
                controller: 'GeoIndicatorGroupCtrl',
                templateUrl: 'module/mrt/geoindicatorgroup/templates/index.html'
            })
            .state('geoindicatorgroup-view', {
                url: '/geoindicatorgroup-view/:id',
                controller: 'GeoIndicatorGroupViewCtrl',
                templateUrl: 'module/mrt/geoindicatorgroup/templates/view.html'
            })
            .state('geoindicator', {
                url: '/geoindicator',
                controller: 'GeoIndicatorCtrl',
                templateUrl: 'module/mrt/geoindicator/templates/index.html',

            })
            .state('geoindicator-view', {
                url: '/geoindicator/view/:id',
                controller: 'GeoIndicatorViewCtrl',
                templateUrl: 'module/mrt/geoindicator/templates/view.html'
            })
            .state('geoindicator-add', {
                url: '/geoindicator/add',
                controller: 'GeoIndicatorAddCtrl',
                templateUrl: 'module/mrt/geoindicator/templates/add.html'
            })
            .state('geoindicator-edit', {
                url: '/geoindicator/edit/:id',
                controller: 'GeoIndicatorAddCtrl',
                templateUrl: 'module/mrt/geoindicator/templates/add.html'
            })
            .state('geomodel-cluster', {
                url: '/geomodel/cluster',
                controller: 'GeoModelCtrl',
                templateUrl: 'module/mrt/geomodel/templates/geomodel-cluster-index.html'
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
