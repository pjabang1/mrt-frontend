/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('Pension').directive('tabMetric', tabMetric);

function tabMetric() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'pension/tpls/tab-metric.html'
    };
    return directive;
}
;