angular.module('MRT').directive('geoModelTable', geoModelTable);
function geoModelTable() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'js/module/mrt/geomodel/templates/geomodel-table.html'
    };
    return directive;
}
;