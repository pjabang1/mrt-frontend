(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelVsModel', GeoModelVsModel);
    GeoModelVsModel.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log', '$state', 'geoModelService', 'geoIndicatorGroupService', 'geoIndicatorService'];

    function GeoModelVsModel($scope, $filter, $stateParams, $modal, $log, $state, geoModelService, geoIndicatorGroupService, geoIndicatorService) {
      var vm = this;
      $scope.options = {};
      $scope.options.models = [
        {'id': 'mckinsey-matrix', 'name': 'GE McKinsey 9 Box Matrix'},
        {'id' : 'bg-matrix', 'name': 'BG Matrix'}
      ];

      $scope.next = next;

      function next() {
        $state.go("geomodel-create-country-selection");
      }



    }
})();
