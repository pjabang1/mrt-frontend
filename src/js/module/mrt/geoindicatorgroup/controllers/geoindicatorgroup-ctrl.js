angular.module('MRT').controller('GeoIndicatorGroupCtrl', ['$scope', '$filter', 'geoIndicatorGroupService', function($scope, $filter, geoIndicatorGroupService) {

        $scope.data = {};
        $scope.search = '';
        $scope.data.geoindicatorgroups = [];

        geoIndicatorGroupService.list($scope.data.params).success(function(data) {

            $scope.data.geoindicatorgroups = data.groups;

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });


    }]).controller('GeoIndicatorGroupViewCtrl', ['$scope', '$filter', '$state', '$stateParams', 'geoIndicatorGroupService', 'geoIndicatorService', function($scope, $filter, $state, $stateParams, geoIndicatorGroupService, geoIndicatorService) {
        $scope.data = {};
        $scope.templateVar = {};

        $scope.data.changed = false;
        $scope.data.list = [];
        $scope.data.selectedList = [];
        $scope.data.group = {name: '', description: ''};
        $scope.data.params = {};
        $scope.data.params.id = $stateParams.id;

        geoIndicatorService.getGeoIndicators($scope.data.params).success(function(data) {
            $scope.data.list = data.geoindicators;
            $scope.sortList();
            $scope.getIndicators();

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

        $scope.sortList = function() {
            $scope.data.list = $filter('orderBy')($scope.data.list, 'name');
        };


        $scope.changed = function() {
            $scope.data.changed = true;
        };

        // function to submit the form after all validation has occurred			
        $scope.submitForm = function(isValid) {

            // check to make sure the form is completely valid
            if (isValid) {
                // alert('our form is amazing');
                $scope.data.group.indicators = [];
                angular.forEach($scope.data.list, function(item, key) {
                    if (!angular.isUndefined(item.selected) && item.selected === true) {
                        $scope.data.group.indicators.push(item);
                    }
                });

                geoIndicatorGroupService.replace($scope.data.group).success(function(data) {
                    $state.go('geoindicatorgroup');
                    console.log($scope.data.group);
                }).error(function(error) {
                    $scope.status = 'Unable to update indicators : ' + error.message;
                });

                // console.log($scope.data.geogroup);
            }

        };

        $scope.getIndicators = function() {
            geoIndicatorGroupService.getIndicators($scope.data.params).success(function(data) {
                
                $scope.data.selectedList = data.indicators;
                $scope.data.group = data.group;

                angular.forEach($scope.data.selectedList, function(item, key) {
                    $scope.select(item.geoindicator_id);
                });

                // $scope.data.changed = false;

            }).error(function(error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });

            $scope.select = function(id) {

                var found = $filter('filter')($scope.data.list, {id: id}, true);
                // console.log($scope.data.list);
                if (found.length) {
                    // console.log('selected' + id);
                    // console.log(found);
                    found[0].selected = true;
                    $scope.data.changed = true;
                }
            };

            $scope.deselect = function(id) {

                var found = $filter('filter')($scope.data.list, {id: id}, true);

                if (found.length) {
                    found[0].selected = false;
                    $scope.data.changed = true;
                }
            };
        };









    }]);