/**
 *
 *
 */
angular.module('MRT').directive('indicatorTableDisplay', indicatorTableDisplay);

function indicatorTableDisplay($parse, $filter) {
    var directive = {
        restrict: 'AE',
        templateUrl: 'module/mrt/geoindicator/templates/table-display.html',
        replace: true,
        scope: {data: '=', indicator: '=', dates: '=', toggleSelectColumn: '&', toggleSelectCell: '&'},
        link: function(scope, element, attrs) {

          scope.toggleSelectColumn = toggleSelectColumn;
          scope.toggleSelectCell = toggleSelectCell;


          function toggleSelectCell(labelType, label, geography) {
            var data = $filter('filter')(scope.data, {code: geography.code}, true);
            toggleSelect(labelType, label, data);
          }

          function toggleSelectColumn(labelType, label, geoCode) {
            toggleSelect(labelType, label, scope.data);
          }

          function toggleSelect(labelType, label, data) {
            var geography;
            var values;
            var value;
            for(var i = 0; i < data.length; i++) {
              geography = data[i];
              values = geography.values;
              for(var ii = 0; ii <values.length; ii++) {
                var value = values[ii];
                if(value.selectable === true && value.labelType === labelType && value.label === label) {
                  value.selected = true;
                } else {
                  value.selected = false;
                }
              }
            }
          }

          function selectValue() {

          }

        }
    };
    return directive;
}
;
