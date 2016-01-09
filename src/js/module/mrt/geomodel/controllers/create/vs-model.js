(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelVsModel', GeoModelVsModel);
    GeoModelVsModel.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log', '$state', 'geoModelService', 'geoIndicatorGroupService', 'geoIndicatorService', 'vsModelHydratorService'];

    function GeoModelVsModel($scope, $filter, $stateParams, $modal, $log, $state, geoModelService, geoIndicatorGroupService, geoIndicatorService, vsModelHydratorService) {
      var vm = this;
      $scope.options = {};
      $scope.model = {};
      $scope.ui = {};
      $scope.ui.chartData;

      loadModel($stateParams.id);

      function loadModel(id) {
        geoModelService.get({id: id}).success(function(data) {
            var model = JSON.parse(data.content);
            model.id = data.id;
            geoModelService.localSave(model);

            $scope.model = geoModelService.getLocalModel();
            console.log($scope.model);
            if(model.modelType.id === '3-dimentional-bubble') {
              var result = vsModelHydratorService.hydrate($scope.model);
              $scope.ui.chartData = result;
            }

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }


    }
})();
