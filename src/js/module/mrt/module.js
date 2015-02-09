angular.module('MRT', ['app-parameters', 'ui.bootstrap', 'ui.router', 'ngCookies', 'ngTable', 'ngAnimate', 'vr.directives.slider', 'ui.select', 'ngSanitize', 'angular-loading-bar', 'LocalStorageModule']);
// 'ui.slider',
angular.module('MRT').config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('mrt');
});