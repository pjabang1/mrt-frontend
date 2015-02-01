angular.module('MRT').directive('geoModelCluster', geoModelCluster);
function geoModelCluster() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'js/module/mrt/geomodel/templates/geomodel-cluster.html',
        link: function(scope, element, attrs) {
            // alert("hey");
        }
    };
    return directive;
};