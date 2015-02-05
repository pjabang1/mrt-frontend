angular.module('MRT').directive('geoModelGeMatrix', GeoModelGeMatrix);
function GeoModelGeMatrix() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'js/module/mrt/geomodel/templates/geomodel-ge-matrix.html'
    };
    return directive;
}
;