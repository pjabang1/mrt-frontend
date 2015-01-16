/**
 * 
 * 
 */
angular.module('Pension').directive('termSearch', termSearch);

function termSearch($parse) {
    var directive = {
        restrict: 'AE',
        templateUrl: 'pension/tpls/term/term-search.html',
        scope: true,
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        link: function(scope, element, attrs) {
           
        }
    };
    return directive;
}
;
