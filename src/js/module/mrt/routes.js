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
            }).state('geomodel-create-country-selection', {
                url: '/geomodel/create/country-selection',
                controller: 'GeoModelCreateCountrySelection',
                templateUrl: 'module/mrt/geomodel/templates/create/country-selection.html'
            })
            .state('geomodel-create-indicator-selection', {
                url: '/geomodel/create/indicator-selection',
                controller: 'GeoModelCreateIndicatorSelection',
                templateUrl: 'module/mrt/geomodel/templates/create/indicator-selection.html'
            })
            .state('geomodel-vs-model', {
                url: '/geomodel/create/vs-model/:id',
                controller: 'GeoModelVsModel',
                templateUrl: 'module/mrt/geomodel/templates/create/vs-model.html'
            })
            .state('geomodel-create-model', {
                url: '/geomodel/create/model/:id/:type',
                controller: 'GeoModelCreateModel',
                templateUrl: 'module/mrt/geomodel/templates/create/model.html'
            })
            .state('geomodel-gallery', {
                url: '/geomodel/gallery',
                controller: 'GeoModelCreateModel',
                templateUrl: 'module/mrt/geomodel/templates/create/model-gallery.html'
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
            .state('geomodel-add-advance', {
                url: '/geomodel/add-advance',
                controller: 'GeoModelAddAdvanceCtrl',
                templateUrl: 'module/mrt/geomodel/templates/add-advance.html'
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
