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



	$scope.chartData = {
		title: {
			text: 'World Population (2015)',
			subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)'
		},
		dataRange: {
			min: 0,
			max: 1000000,
			text: ['High', 'Low'],
			realtime: false,
			calculable: true,
			color: ['#ffce54', '#00bff3', '#EB5367']
		},
		series: [
		{
			name: 'World Population (2010)',
			type: 'map',
			mapType: 'world',
			roam: true,
			mapLocation: {
				y: 60
			},
			itemStyle: {
				emphasis: {label: {show: true}}
			},
			markPoint : {
                symbol:'emptyCircle',
                symbolSize : function (v){
                    return 10 + v/100
                },
                effect : {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle:{
                    normal:{
                        label:{show:true}
                    }
                },
                data : [
                  // {name: 'Afghanistan', value: 100},
				   {name: 'Angola', value: 20},
				   //{name: 'Albania', value: 50}

                ]
            },
  			 geoCoord: {
            	'Angola': [-16.56666666, 13.46666666]
            },
			data: [
			{name: 'Afghanistan', value: 28397.812},
			{name: 'Angola', value: 19549.124},
			{name: 'Albania', value: 3150.143}
			]
		 },
		 {
            name: 'Top5',
            type: 'map',
            mapType: 'world',
            roam: true,
            data:[],
            markPoint : {
                symbol:'emptyCircle',
                symbolSize : function (v){
                    return 10 + v/100
                },
                effect : {
                    show: true,
                    shadowBlur : 0
                },
                itemStyle:{
                    normal:{
                        label:{show:true}
                    }
                },
                data : [
                   // {name: 'Albania', value: 193},
                    //{name: 'Angola', value: 50},

                ]
            }
        }
		]
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
