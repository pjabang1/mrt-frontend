(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelCreateIndicatorSelection', GeoModelCreateIndicatorSelection);
    GeoModelCreateIndicatorSelection.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log',  '$state', 'geoModelService', 'geoIndicatorGroupService', 'geoIndicatorService'];

    function GeoModelCreateIndicatorSelection($scope, $filter, $stateParams, $modal, $log, $state, geoModelService, geoIndicatorGroupService, geoIndicatorService) {
      var vm = this;
      $scope.data = {};
      $scope.options = {};
      $scope.options.selectType = "group";
      $scope.data.indicators = [];
      $scope.data.groups = [];
      $scope.toggled = function(open) {
    $log.log('Dropdown is now: ', open);
  };


      $scope.model = geoModelService.getLocalModel();
      // $scope.model.data = {};

      var defaultIndicator = {name: "Indicator Group", indicators: []};

      // console.log($scope.model);

      // $scope.model.data.indicators = defaultIndicator;

      $scope.chartOptions = {};
      $scope.toggleSelection = toggleSelection;
      $scope.toggleGroupExpand = toggleGroupExpand;
      $scope.toggleGroupSelect = toggleGroupSelect;
      $scope.countSelected = countSelected;
      $scope.clear = clear;
      $scope.back = back;
      $scope.next = next;
      $scope.addIndicatorGroup = addIndicatorGroup;
      $scope.addIndicatorGroupToDimension = addIndicatorGroupToDimension;
      $scope.addIndicatorToGroup = addIndicatorToGroup;
      $scope.copyIndicatorGroup = copyIndicatorGroup;
      $scope.selectDimension = selectDimension;
      $scope.loadIndicatorValues = loadIndicatorValues;
      $scope.selectedIndicator = null;
      $scope.selectIndicator = selectIndicator;
      $scope.getValues = getValues;
      var model = geoModelService.getLocalModel();

      loadModelIndicatorValues($scope.model);
      loadIndicators();


      function loadIndicators() {
      geoIndicatorService.getGeoIndicators({}).success(function(data) {
          $scope.data.indicators = data.geoindicators;
          loadGroups();
      }).error(function(error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });

    }

    function selectIndicator(indicator) {
      $scope.selectedIndicator = indicator;
    }

    function getGeographyIds(geographies) {
      var ids = [];
      for(var i = 0; i < geographies.length; i++) {
        ids.push(geographies[i].id);
      }
      return ids;
    }

    function loadModelIndicatorValues(model) {
      var indicators;
      var groups;
      var indicator;
      for(var i = 0; i < model.indicators.length; i++) {
        groups = model.indicators[i];

        for(var ii = 0; ii < groups.indicators.length; ii++) {
          indicator = groups.indicators[ii];
          indicator = appendIndicatorDates(model, indicator);
          loadIndicatorValues(model.geographies, indicator);
        }
      }
    }

    function loadIndicatorValues(geographies, indicator) {
      if(typeof indicator.loaded === "undefined") {
        indicator.loaded = false;
      }

      if(indicator.loaded !== true) {
        getValues(geographies, indicator);
      }
    }

    function appendIndicatorDates(model, indicator) {
      if(typeof indicator.from === "undefined") {
        indicator.from = getDate(model.from);
      }
      if(typeof indicator.to === "undefined") {
        indicator.to = getDate(model.to);
      }
      return indicator;
    }

    function getValues(geographies, indicator) {
        var params = {};
        indicator = appendIndicatorDates($scope.model, indicator);
        indicator.loading = true;
        params.from = getDate(String(indicator.from));
        params.to = getDate(String(indicator.to));
        params.id = indicator.id;
        params["geography_ids[]"] = getGeographyIds(geographies);
        geoIndicatorService.getGeoIndicatorValues(params).success(function (data) {
            indicator.loading = false;
            indicator.loaded = true;
            updateIndicatorValues(data[0], indicator);
        }).error(function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });

    }

    function updateIndicatorValues(data, indicator) {
      indicator.dates = data.dates;
      indicator.geographies = geoIndicatorService.hydrateValues(data.values, data.dates, data.geographies);
      indicator.summary = geoIndicatorService.getSummary(indicator.geographies);
    }

    function getDate(dt) {

      var d = new Date(dt);
        if(d && typeof d.getFullYear !== 'undefined') {
            return d.getFullYear();
        }
        return d;
    }

    function getNewIndicator() {
      var indicator = angular.copy(defaultIndicator);
      var length = $scope.model.indicators.length+1;
      var selectedDimension = getSelectedDimension();
      indicator.name = indicator.name + " " + length;
      indicator.id = "id" + length;
      indicator.dimension = selectedDimension.id;
      return indicator;
    }

    function getSelectedDimension() {
      return $scope.model.selectedDimension;
    }


    function addIndicatorGroup() {
      $scope.model.indicators.push(getNewIndicator());
    }

    function addIndicatorGroupToDimension(dimension) {
      var indicator = getNewIndicator();
      indicator.dimension = dimension.id;
      $scope.model.indicators.push(indicator);
    }



    function addIndicatorToGroup(indicator, group) {
      var indicatorCopy = angular.copy(indicator);
      var found = $filter('filter')(group.indicators, {code: indicatorCopy.code}, true);
      if(!found.length) {

        group.indicators.push(indicatorCopy);
        loadIndicatorValues(model.geographies, indicatorCopy);

      }
    }

    $scope.remove = function(items, item) {
      var index = items.indexOf(item);
      items.splice(index, 1);
    }

    function copyIndicatorGroup(group, dimension) {
      loadChildren(group, false, function() {
        var indicator = getNewIndicator();
        indicator.name = angular.copy(group.name);
        if(typeof dimension !== "undefined") {
          indicator.dimension = dimension.id;
        }
        $scope.model.indicators.push(indicator);
        for(var i = 0; i < group.children.length; i++) {
          addIndicatorToGroup(group.children[i], indicator);
        }
        // indicator.indicators = angular.copy(group.children);
        // console.log(indicator);

      });

    }



    function loadGroups() {
      geoIndicatorGroupService.list({}).success(function(data) {
          $scope.data.groups = [];
          var length = data.groups.length;
          for(var i = 0; i < length; i++) {
            data.groups[i].loaded = false;
            data.groups[i].selected = false;
            data.groups[i].expand = false;
            data.groups[i].children = [];
            $scope.data.groups.push(data.groups[i]);
          }
      }).error(function(error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });
    }

      var data = {
				USA: {fillKey: 'lt50' },
				RUS: {fillKey: 'lt50' },
				MLI: {fillKey: 'lt50' },
				BRA: {fillKey: 'lt50' },
				ARG: {fillKey: 'lt50'},
				COL: {fillKey: 'lt50' },
				AUS: {fillKey: 'lt50' },
				ZAF: {fillKey: 'lt50' },
				SWE: {fillKey: 'lt50' }
			};

      $scope.chartOptions.data = {};
      var country = {};

      function clear() {

        for (var key in $scope.chartOptions.data) {
          if ($scope.chartOptions.data.hasOwnProperty(key)) {
            $scope.chartOptions.data[key].fillKey = "defaultFill";
          }
        }
        var length = $scope.data.geographies.length;
        for(var i = 0; i < length; i++) {
          $scope.data.geographies[i].selected = false;
        }
        resetGroupSelection();
        $scope.chartOptions.updated = Date.now();
      }

      function back() {
        geoModelService.localSave(model);
        $state.go("geomodel-create-country-selection");
      }

      function selectDimension(dimension) {
        $scope.model.selectedDimension = dimension;
      }

      function next() {

        // model = $scope.model.indicators;
        console.log(JSON.stringify($scope.model));
        geoModelService.localSave($scope.model);
        // $state.go("geomodel-create-country-selection");
      }

      function countSelected(row) {
        var $return = 0;
        var children = row.children
        var length = children.length;
        var child;
        for(var i = 0; i < length; i++) {
          if(children[i].selected === true) {
            $return++;
          }
        }
        return $return > 0 ? $return : '';
      }

      function resetGroupSelection() {
        var groups = $scope.data.geogroups;
        var length = groups.length;
        var group;
        var cLength;
        for(var i = 0; i< length; i++) {
          group = groups[i];
          group.selected = false;
          cLength = group.children.length;
          for(var ii = 0; ii < cLength; ii++) {
            group.children[ii].selected = false;
          }

        }
      }


      function toggleSelection(row, parent) {
        if(typeof row.selected == "undefined") {
          row.selected = false;
        }
        row.selected = !row.selected;

        var indicator = angular.copy(row);
        var group = angular.copy(parent);
        if(typeof parent !== "undefined") {
          addIndicator(indicator, group);
        }
      }

      function addIndicator(indicator, group) {
        var modelIndicators = $scope.model.data.indicators;
        var length = modelIndicators.length;
        var selectedGroup = null;
        for(var i = 0; i < length; i++) {
          if(modelIndicators[i].id === group.id) {
            selectedGroup = i;
          }
        }

        if(selectedGroup !== null) {
          addIndicatorToModelGroup(indicator, selectedGroup);
        }

      }

      /**
      * add to model indicator groups
      **/
      function addIndicatorToModelGroup(indicator, group) {
        var length = group.indicators.length;
        for(var i = 0; i < length; i++) {
          group.indicators.push(indicator);
        }
      }



      function togggleChartSelection(code) {
        if(typeof $scope.chartOptions.data[code] === "undefined") {
          $scope.chartOptions.data[code] = {fillKey: 'selectedFill'};
        } else {
          $scope.chartOptions.data[code].fillKey = $scope.chartOptions.data[code].fillKey === "selectedFill" ? "defaultFill" : "selectedFill";
        }
      }

      function toggleGroupExpand(group) {
        if(group.loaded !== true) {
          loadChildren(group);
        }
        group.expand = !group.expand;
      }

      function toggleGroupSelect(group) {
        // group.selected = !group.selected;
        if(group.loaded !== true) {
          loadChildren(group, true);
        } else {
          _toggleGroupSelect(group);
        }
      }

      function _toggleGroupSelect(group) {
        var length = group.children.length;
        // if(group.selected === true) {
          for(var i = 0; i < length; i++) {
            group.children[i].selected = group.selected;
            // toggleSelection(group.children[i].id);
          }
        //}
      }


      function loadChildren(group, toggleGroupExpand, callback) {
        geoIndicatorGroupService.getIndicators({id: group.id}).success(function(data) {
          var g = data.group;
          var indicators = data.indicators;
          var length = indicators.length;
          var indicator;
          for(var i = 0; i < length; i++) {
            indicator = indicators[i];
            var found = $filter('filter')($scope.data.indicators, {id: indicator.geoindicator_id}, true);
            if (found.length) {
              group.children.push(found[0]);
            } else {
            }
          }
          group.loaded = true;
          if(typeof toggleGroupExpand !== "undefined" && toggleGroupExpand === true) {
            _toggleGroupSelect(group);
          }

          if(typeof callback !== "undefined") {
            callback();
          }


        }).error(function(error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }


    }
})();
