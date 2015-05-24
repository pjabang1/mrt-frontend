/**
 * 
 * 
 */
 angular.module('MRT').directive('mrtMapChart', mrtMapChart);

 function mrtMapChart($parse, $timeout) {
 	var directive = {
 		restrict: 'AE',
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		//our data source would be an array
		//passed thru chart-data attribute
		scope: {chartData: '=chartData'},
		link: function(scope, element, attrs) {
// // instantiate the chart------------------
// script plain import
var myChart = echarts.init(element[0]);


// loading---------------------
myChart.showLoading({
				text: "We're building the buildings as fast as we can...please wait! ", //loading text
			});

// ajax getting data...............

// ajax callback
myChart.hideLoading();

myChart.on('DATA_CHANGED', function() {
	console.log('data changed');
});


function updateChartOptions() {
	var chartData = scope.chartData;
	console.log('directive render : ' + chartData.title.text);
	// console.log(chartData.series[0].data);

				// use the chart-------------------
				option = {
					title: {
						text: chartData.title.text,
						subtext: chartData.title.subtext,
					// sublink: 'http://esa.un.org/wpp/Excel-Data/population.htm',
					x: 'center',
					y: 'top'
				},
				tooltip: {
					trigger: 'item',
					formatter: function(params) {
						var value = (params.value + '').split('.');
						value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,')
						+ '.' + value[1];
						return params.seriesName + '<br/>' + params.name + ' : ' + value;
					}
				},
				toolbox: {
					show: true,
					orient: 'vertical',
					x: 'right',
					y: 'center',
					feature: {
						mark: {
							show: true,
							title: 'Mark',
						},
						dataView: {
							show: true,
							title: 'View Data',
							readOnly: true,
							lang: ['View Data', 'Close', 'Refresh']
						},
						restore: {
							show: true,
							title: 'Restore',
						},
						saveAsImage: {
							show: true,
							title: 'Save As Image',
							type: 'png',
							lang: ['Language']
						}
					}
				},
				dataRange: chartData.dataRange,
				series: chartData.series
			};
			myChart.setOption(option, true);
								myChart.refresh();
					myChart.resize();
					myChart.restore();
			// myChart.refresh();
			// myChart.setSeries(option.series);

		};

		updateChartOptions();



		scope.$watch('chartData.series[0].data', function() { 

						$timeout(function() {
            updateChartOptions();
        }, 250); // delay 250 ms
			
		});

		window.onresize = function() {
			myChart.resize();
		};


	}
};
return directive;
}