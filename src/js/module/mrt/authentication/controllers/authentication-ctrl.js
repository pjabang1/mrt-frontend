angular.module('MRT').controller('AuthenticationCtrl', ['$scope', '$location', 'geoModelService', 'geoGroupService', function($scope, $location, geoModelService, geoGroupService) {
		$scope.app.loggedIn = false;
		
		
		$scope.submit = function() {
			
			$location.path("/dashboard");
			console.log('submit');
			
		};
}]);