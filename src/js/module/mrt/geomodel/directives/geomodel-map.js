angular.module('MRT').directive('geoModelMap', GeoModelMap);
function GeoModelMap() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'js/module/mrt/geomodel/templates/geomodel-map.html'
    };
    return directive;
}
;