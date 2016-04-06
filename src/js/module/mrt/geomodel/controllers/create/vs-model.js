// http://codepen.io/stevepepple/post/color-scales-for-charts-and-maps
// https://gka.github.io/palettes/#colors=lightyellow,orange,deeppink,darkred|steps=7|bez=1|coL=1
// http://jsfiddle.net/vis4/cYLZH/
// https://vis4.net/blog/posts/mastering-multi-hued-color-scales/

(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelVsModel', GeoModelVsModel);
    GeoModelVsModel.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log', '$state', 'geoModelService', 'geoIndicatorGroupService', 'geoIndicatorService', 'vsModelHydratorService', 'mapModelService'];

    function GeoModelVsModel($scope, $filter, $stateParams, $modal, $log, $state, geoModelService, geoIndicatorGroupService, geoIndicatorService, vsModelHydratorService, mapModelService) {
      var vm = this;
      $scope.options = {};
      $scope.model = {};
      $scope.ui = {};
      $scope.ui.playing = false;
      $scope.ui.chartData;
      $scope.ui.chartOptions = {data: {}};
      $scope.ui.clusterK = 10; 
      $scope.ui.indicators = [];
      $scope.ui.selectedIndicator = {};
      $scope.updateIndicator = updateIndicator;
      $scope.ui.clusterResults = [];
      $scope.ui.clusterColors = [];
      $scope.ui.centroids = [];
      $scope.ui.themeColors = mapModelService.getColorList();
      $scope.ui.setThemeColor = setThemeColor;

      var currentYear = 2000;

      $scope.slider = { //requires angular-bootstrap to display tooltips
  minValue: currentYear,
  options: {
    floor: currentYear,
    ceil: 2013,
    showTicks: true,
    showTicksValues: true,
    onChange: function(sliderId, modelValue, highValue) {
      // console.log(modelValue);
      currentYear = modelValue;
      updateChartOptions(currentYear.toString(), $scope.ui.clusterK, $scope.ui.selectedIndicator.code);
    },
    ticksTooltip: function(v) {
      return 'Tooltip for ' + v;
    }
  }
};


      loadModel($stateParams.id);

      function loadModel(id) {
        geoModelService.get({id: id}).success(function(data) {
            var model = JSON.parse(data.content);
            model.id = data.id;
            geoModelService.localSave(model);

            $scope.model = geoModelService.getLocalModel();
            // console.log($scope.model);
            if(model.modelType.id === '3-dimentional-bubble') {
              var result = vsModelHydratorService.hydrate($scope.model);
              $scope.ui.chartData = result;
            } else if(model.modelType.id === 'map') {

                $scope.ui.indicators = $scope.model.indicators[0].indicators;
                $scope.ui.selectedIndicator = $scope.ui.indicators[0];
                mapModelService.setModel($scope.model);
                updateSliderSettings($scope.model);

              // console.log($scope.model);

            //  var clusterResults = mapModelService.getClusterResults("2012", 10, "SP.POP.TOTL"); // "SP.POP.TOTL", "SP.DYN.LE00.IN"
              //var colors = mapModelService.getGeoColors(clusterResults);

              // $scope.ui.chartOptions.data = colors;
              updateChartOptions("2012", $scope.ui.clusterK, $scope.ui.selectedIndicator.code);


            }

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }

      function setThemeColor(themeColor) {

      }

      function updateSliderSettings(model) {
        $scope.slider.minValue = getDate(model.from);
        $scope.slider.options.floor = getDate(model.from);
        $scope.slider.options.ceil = getDate(model.to);
      }

      function getDate(dt) {

        var d = new Date(dt);
          if(d && typeof d.getFullYear !== 'undefined') {
              return d.getFullYear();
          }
          return d;
      }

      function updateChartOptions(year, clusters, indicatorCode) {
        // "2012", 10, "SP.POP.TOTL"
        var clusterResults = mapModelService.getClusterResults(year, clusters, indicatorCode); // "SP.POP.TOTL", "SP.DYN.LE00.IN"
        var colors = mapModelService.getGeoColors(clusterResults);
        var clusterColors = mapModelService.getClusterColors(clusterResults);

        $scope.ui.clusterResults = clusterResults;
        $scope.ui.clusterColors = clusterColors;
        $scope.ui.centroids = mapModelService.getCentroids();

        $scope.ui.chartOptions.data = colors;
      }

      function setThemeColor(c) {
        console.log("set theme color");
        console.log(c);
        mapModelService.setThemeColor(c);
        updateChartOptions(currentYear.toString(), $scope.ui.clusterK, $scope.ui.selectedIndicator.code);
      }

      function updateIndicator(indicator) {
        $scope.ui.selectedIndicator = indicator;
        updateChartOptions(currentYear.toString(), $scope.ui.clusterK, $scope.ui.selectedIndicator.code);
      }

    }
})();
