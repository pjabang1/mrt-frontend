angular.module('MRT').directive('loginSection', searchSection);
function searchSection() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'module/mrt/authentication/templates/login.html'
    };
    return directive;
}
;