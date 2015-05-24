/**
 * 
 * 
 */
angular.module('MRT').directive('indicatorTable', indicatorTable);

function indicatorTable($parse) {
    var directive = {
        restrict: 'AE',
        // templateUrl: 'pension/tpls/term/term-search-pageview.html',
        replace: true,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {data: '=data'},
        link: function(scope, element, attrs) {

            var container = element[0];
  
            var data = function () {
                // return scope.data;
                // console.log(scope.data);
                return scope.data;
                // return Handsontable.helper.createSpreadsheetData(100, 12);
            };
            

            var hot = new Handsontable(container, {
                data: scope.data,
                height: 396,
                colHeaders: true,
                rowHeaders: true,
                stretchH: 'all',
                columnSorting: false,
                contextMenu: true,
                minSpareRows: 1
                // fixedRowsTop: 1
            });

            scope.$watch('data', function() { 
                console.log('changed');
                // hot.render();
                console.log(scope.data);
                hot.loadData(scope.data);
            });

        }
    };
    return directive;
}
;
