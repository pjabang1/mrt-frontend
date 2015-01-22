angular.module('MRT').directive('loginSection', searchSection);
function searchSection() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'tpls/mrt/tpls/section/login-section.html'
    };
    return directive;
}
;