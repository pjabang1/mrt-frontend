angular.module('Pension').directive('leadingSectors', leadingSectors);
function leadingSectors() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/leading-sectors.html'
    };
    return directive;
}
;