/**
 * 
 * 
 */
angular.module('MRT').directive('mrtChart', mrtChart);

function mrtChart($parse) {
	var directive = {
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		scope: {chartData: '=chartData'},
		link: function(scope, element, attrs) {

			var myChart = echarts.init(element[0]);
			var chartData = scope.chartData;

			myChart.showLoading({
				text: "We're building the buildings as fast as we can...please wait! ", //loading text
			});

			myChart.hideLoading();


			function updateChartOptions() {
				if(typeof chartData.xAxis === 'undefined') {
					myChart.setOption(chartData, true);
				} else if(typeof chartData.xAxis[0].data !== 'undefined' && chartData.xAxis[0].data.length) {
					console.log(chartData);
					myChart.setOption(chartData);
				}
			}

			scope.$watch('chartData.updatedAt', function() { 
				updateChartOptions();
			});

			// window.onresize = myChart.resize;
		}
	};
	return directive;
}