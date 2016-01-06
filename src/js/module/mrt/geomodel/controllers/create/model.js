(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelCreateModel', GeoModelCreateModel);
    GeoModelCreateModel.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log', '$state', '$interval', 'geoModelService', 'geoIndicatorGroupService', 'geoIndicatorService'];

    function GeoModelCreateModel($scope, $filter, $stateParams, $modal, $log, $state, $interval, geoModelService, geoIndicatorGroupService, geoIndicatorService) {
      var vm = this;
      $scope.modelTypes = geoModelService.getModelTypes();
      $scope.options = {};
      $scope.options.models = [
        {'id': 'mckinsey-matrix', 'name': 'GE McKinsey 9 Box Matrix'},
        {'id' : 'bg-matrix', 'name': 'BG Matrix'}
      ];


      if($stateParams.id) {
        loadModel($stateParams.id);
      } else {
        geoModelService.start();
        $scope.model = geoModelService.getLocalModel();
      }

      $scope.next = next;
      $scope.selectModelType = selectModelType;

      function loadModel(id) {
        geoModelService.get({id: id}).success(function(data) {
            var model = JSON.parse(data.content);
            model.id = data.id;
            geoModelService.localSave(model);
            $scope.model = geoModelService.getLocalModel();
        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }

      function next() {
        if(typeof $scope.model.modelType == "undefined") {
          selectModelType($scope.modelTypes[0]);
        }
        geoModelService.localSave($scope.model);
        $state.go("geomodel-create-country-selection");
      }

      // need to move this to service
      function selectModelType(modelType) {
        $scope.model.modelType = modelType;
        if(typeof $scope.model.selectedDimension === "undefined") {
          $scope.model.selectedDimension = modelType.dimensions[0];
        }
      }

      $scope.today = function() {
          $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function () {
          $scope.dt = null;
      };


      $scope.disabled = function(date, mode) {
          return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.openFrom = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.fromOpened = true;
      };

      $scope.openTo = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          $scope.toOpened = true;
      };



      $scope.initDate = new Date('2016-15-20');
      $scope.formats = ['yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.datepickerOptions = {
          datepickerMode:"'year'",
          minMode:"'year'",
          maxMode:"'year'",
      //minDate:"minDate",
      showWeeks:"false",
  };




    }
})();
