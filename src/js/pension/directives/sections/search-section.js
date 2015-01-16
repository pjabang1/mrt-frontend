angular.module('Pension').directive('searchSection', searchSection);
function searchSection() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/search-section.html'
    };
    return directive;
}
;