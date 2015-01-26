angular.module('MRT').directive('geoModelWeight', geoModelWeight);
function geoModelWeight() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'js/module/mrt/geomodel/templates/geomodel-weight.html',
        link: function(scope, element, attrs) {
            // alert("hey");
        }
    };
    return directive;
}
;