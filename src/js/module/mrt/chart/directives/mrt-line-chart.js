/**
 * 
 * 
 */
angular.module('MRT').directive('mrtLineChart', mrtLineChart);

function mrtLineChart($parse) {
	var directive = {
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		scope: {chartData: '=chartData'},
		link: function(scope, element, attrs) {

			var myChart = echarts.init(element[0]);

			myChart.showLoading({
				text: "We're building the buildings as fast as we can...please wait! ", //loading text
			});

// ajax getting data...............

// ajax callback
			myChart.hideLoading();

// use the chart-------------------
			var option = {
				legend: {// legend configuration
					// padding: 5, // The inner padding of the legend, in px, defaults to 5. Can be set as array - [top, right, bottom, left].
					//itemGap: 10, // The pixel gap between each item in the legend. It is horizontal in a legend with horizontal layout, and vertical in a legend with vertical layout. 
					data: ['usd', 'gbp']
				},
				tooltip: {// tooltip configuration
					trigger: 'item', // trigger type. Defaults to data trigger. Can also be: 'axis'
				},
				xAxis: [// The horizontal axis in Cartesian coordinates
					{
						type: 'category', // Axis type. xAxis is category axis by default. As for value axis, please refer to the 'yAxis' chapter.
						data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					}
				],
				yAxis: [// The vertical axis in Cartesian coordinates
					{
						type: 'value', // Axis type. yAxis is value axis by default. As for category axis, please refer to the 'xAxis' chapter.
						//boundaryGap: [0.1, 0.1], // Blank border on each side of the coordinate axis. Value in the array represents percentage. 
						splitNumber: 4                      // Applicable to value axis. The number of segments. Defaults to 5. 
					}
				],
				series: [
					{
						name: 'usd', // series name
						type: 'line', // chart type, line, scatter, bar, pie, radar
						 itemStyle: {normal: {areaStyle: {type: 'default'}}},
						data: [112, 23, 45, 56, 233, 343, 454, 89, 343, 123, 45, 123]
					},
					{
						name: 'gbp', // series name
						type: 'line', // chart type, line, scatter, bar, pie, radar
						data: [45, 123, 145, 526, 233, 343, 44, 829, 33, 123, 45, 13]
					}
				]
			};
			myChart.setOption(option);


// Add some data------------------
			option.legend.data.push('win');
			option.series.push({
				name: 'win', // series name
				type: 'line', // chart type, line, scatter, bar, pie, radar
				data: [112, 23, 45, 56, 233, 343, 454, 89, 343, 123, 45, 123]
			});

			myChart.setOption(option);
		}
	};
	return directive;
}