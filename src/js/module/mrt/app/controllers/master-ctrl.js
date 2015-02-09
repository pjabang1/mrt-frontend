/**
 * Master Controller
 */
angular.module('MRT')
		.controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {
	/**
	 * Sidebar Toggle & Cookie Control
	 *
	 */

	// $scope.term = 'Hairdressers';

	var mobileView = 992;
	$scope.app = {};
	$scope.app.loggedIn = true;
	$scope.app.unsavedChanges = false;

	$scope.$on('$locationChangeStart', function(event) {
		if ($scope.app.unsavedChanges === true) {
			var answer = confirm("You have unsaved changes. Are you sure you want to leave this page?")
			if (!answer) {
				event.preventDefault();
			}
		}
	});

	$scope.getWidth = function() {
		return window.innerWidth;
	};

	$scope.$watch($scope.getWidth, function(newValue, oldValue)
	{
		if (newValue >= mobileView)
		{
			if (angular.isDefined($cookieStore.get('toggle')))
			{
				if ($cookieStore.get('toggle') == false)
				{
					$scope.toggle = false;
				}
				else
				{
					$scope.toggle = true;
				}
			}
			else
			{
				$scope.toggle = true;
			}
		}
		else
		{
			$scope.toggle = false;
		}

	});

	$scope.toggleSidebar = function()
	{
		$scope.toggle = !$scope.toggle;

		$cookieStore.put('toggle', $scope.toggle);
	};

	window.onresize = function() {
		$scope.$apply();
	};
}
