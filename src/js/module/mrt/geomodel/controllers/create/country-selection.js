(function() {
    'use strict';

    angular
        .module('MRT')
        .controller('GeoModelCreateCountrySelection', GeoModelCreateCountrySelection);
    GeoModelCreateCountrySelection.$inject = ['$scope', '$filter', '$stateParams', '$modal', '$log', '$state', 'geoModelService', 'geoGroupService', 'geographyService'];

    function GeoModelCreateCountrySelection($scope, $filter, $stateParams, $modal, $log, $state, geoModelService, geoGroupService, geographyService) {
      var vm = this;
      $scope.data = {};
      $scope.options = {};
      $scope.options.selectType = "group";
      $scope.data.geographies = [];
      $scope.data.geogroups = [];

      $scope.chartOptions = {};
      $scope.chartOptions.data = {};
      $scope.toggleSelection = toggleSelection;
      $scope.toggleGroupExpand = toggleGroupExpand;
      $scope.toggleGroupSelect = toggleGroupSelect;
      $scope.countSelected = countSelected;
      $scope.clear = clear;
      $scope.go = go;
      var model = geoModelService.getLocalModel();
      console.log(model);

      geographyService.getGeographies({}).success(function(data) {
          $scope.data.geographies = tickSelectedGeographies(data.geographies);
          loadGroups();
      }).error(function(error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
      });

      function tickSelectedGeographies(geographies) {
        for(var i = 0; i < geographies.length; i++) {
          var found = $filter('filter')(model.geographies, {id: parseInt(geographies[i].id)}, true);
          if (found.length) {
            geographies[i].selected = true;
            chartSelect(geographies[i].code_3);
          } else {
            geographies[i].selected = false;
          }
        }
        $scope.chartOptions.updated = Date.now();

        return geographies;
      }

      function saveGeographies() {
        model.geographies = [];
        var geographies = $scope.data.geographies;
        for(var i = 0; i < geographies.length; i++) {
          if(geographies[i].selected === true) {
            model.geographies.push(geographies[i]);
          }
        }
        geoModelService.localSave(model);
      }

      function go(page) {
        saveGeographies();
        $state.go(page);
      }




      function loadGroups() {
      geoGroupService.list({}).success(function(data) {
          $scope.data.geogroups = [];
          var length = data.geogroups.length;
          for(var i = 0; i < length; i++) {
            data.geogroups[i].loaded = false;
            data.geogroups[i].selected = false;
            data.geogroups[i].expand = false;
            data.geogroups[i].children = [];
            $scope.data.geogroups.push(data.geogroups[i]);
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


      function toggleSelection(code) {
        togggleChartSelection(code);
        var length = $scope.data.geographies.length;

        for(var i = 0; i < length; i++) {
          country =  $scope.data.geographies[i];
          if(country.code_3 === code) {
            country.selected = (country.selected === "undefined") ? true : !country.selected;
          }
        }
        $scope.chartOptions.updated = Date.now();
      }


      function chartSelect(code) {
        $scope.chartOptions.data[code] = {fillKey: 'selectedFill'};
      }

      function chartDeSelect(code) {
        $scope.chartOptions.data[code] = {fillKey: 'defaultFill'};
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
            group.children[i].selected = group.selected === true ? false : true;
            toggleSelection(group.children[i].code_3);
          }
        // }
      }


      function loadChildren(group, toggleGroupExpand) {
        geoGroupService.getGeographies({id: group.id}).success(function(data) {
          var g = data.group;
          var geographies = data.geographies;
          var length = geographies.length;
          var geography;
          for(var i = 0; i < length; i++) {
            geography = geographies[i];
            var found = $filter('filter')($scope.data.geographies, {id: parseInt(geography.geography_id)}, true);
            if (found.length) {
              group.children.push(found[0]);
            } else {
            }
          }
          group.loaded = true;
          if(typeof toggleGroupExpand !== "undefined" && toggleGroupExpand === true) {
            _toggleGroupSelect(group);
          }

        }).error(function(error) {
          $scope.status = 'Unable to load customer data: ' + error.message;
        });
      }


    }
})();
