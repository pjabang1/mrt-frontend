angular.module('Pension').controller('TabMetricCtrl', ['$scope', 'termService', function($scope, termService) {
    $scope.data = termService.data;
    $scope.$watch(function() {
        return termService.data;
    }, function(newValue) {
        $scope.data = termService.data;
    });

    
    $scope.tabs = [
        {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
        {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            alert('You\'ve selected the alert tab!');
        });
    };
}]);