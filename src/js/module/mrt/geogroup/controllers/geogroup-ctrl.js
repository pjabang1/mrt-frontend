angular.module('MRT').controller('GeoGroupCtrl', ['$scope', '$filter', '$state', 'geoGroupService', function($scope, $filter, $state, geoGroupService) {

        $scope.data = {};
        $scope.data.filterText = '';
        $scope.search = '';
        $scope.data.geogroups = [];

        geoGroupService.list($scope.data.params).success(function(data) {
            $scope.data.geogroups = data.geogroups;
        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });

        $scope.getFilter = function() {
            return {name: $scope.data.filterText};
        };

        $scope.selected = function(item) {
            geoGroupService.data.selected = item;
        };

    }]).controller('GeoGroupViewCtrl', ['$scope', '$filter', '$stateParams', '$state', 'geoGroupService', 'geographyService', function($scope, $filter, $stateParams, $state, geoGroupService, geographyService) {
        $scope.data = {};
        $scope.templateVar = {};


        $scope.data.changed = false;
        $scope.data.geographies = [];
        $scope.data.geogroupgeographies = [];
        $scope.data.geogroup = {name: '', description: ''};
        $scope.data.params = {};
        $scope.data.params.id = $stateParams.id;

        geographyService.getGeographies($scope.data.params).success(function(data) {
            $scope.data.geographies = data.geographies;
            $scope.sortCountries();
            $scope.getGeographies();

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

        $scope.sortCountries = function() {
            $scope.data.geographies = $filter('orderBy')($scope.data.geographies, 'name');
        };


        $scope.changed = function() {
            $scope.data.changed = true;
        };

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid
            if (isValid) {
                // alert('our form is amazing');
                $scope.data.geogroup.geographies = [];
                angular.forEach($scope.data.geographies, function(geography, key) {
                    if (!angular.isUndefined(geography.selected) && geography.selected === true) {
                        $scope.data.geogroup.geographies.push(geography);
                    }
                });

                geoGroupService.replaceGeographies($scope.data.geogroup).success(function(data) {
                    $state.go('geogroup');
                }).error(function(error) {
                    $scope.status = 'Unable to update geographies : ' + error.message;
                });

                // console.log($scope.data.geogroup);
            }

        };

        $scope.getGeographies = function() {
            geoGroupService.getGeographies($scope.data.params).success(function(data) {

                $scope.data.geogroupgeographies = data.geographies;
                $scope.data.geogroup = data.group;
                // console.log($scope.data.geographies);

                angular.forEach($scope.data.geogroupgeographies, function(geography, key) {
                    $scope.select(geography.geography_id);
                });

                // $scope.data.changed = false;

            }).error(function(error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });

            $scope.select = function(id) {

                var found = $filter('filter')($scope.data.geographies, {id: parseInt(id)}, true);

                if (found.length) {
                    // console.log(found);
                    found[0].selected = true;
                    $scope.data.changed = true;
                }
            };

            $scope.deselect = function(id) {

                var found = $filter('filter')($scope.data.geographies, {id: id}, true);

                if (found.length) {
                    found[0].selected = false;
                    $scope.data.changed = true;
                }
            };
        };









    }]);