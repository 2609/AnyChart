goog.provide('anychart.modules.radarArea');

goog.require('anychart');
goog.require('anychart.radar.Chart');
goog.require('anychart.radar.series.Area');


/**
 * Default line chart.
 * xAxis, yAxis, grids.
 * @param {...(anychart.data.View|anychart.data.Set|Array)} var_args Line chart data.
 * @return {anychart.radar.Chart} Chart with defaults for line series.
 */
anychart.radarAreaChart = function(var_args) {
  var chart = new anychart.radar.Chart();

  for (var i = 0, count = arguments.length; i < count; i++) {
    chart.area(arguments[i]);
  }

  chart.title().text('Chart Title');

  chart.xAxis();
  chart.yAxis();

  chart.grid(0)
      .layout(anychart.enums.RadialGridLayout.CIRCUIT);

  chart.minorGrid()
      .evenFill('none')
      .oddFill('none')
      .stroke('black 0.1')
      .layout(anychart.enums.RadialGridLayout.CIRCUIT);

  chart.grid(1)
      .evenFill('none')
      .oddFill('none')
      .layout(anychart.enums.RadialGridLayout.RADIAL);

  return chart;
};

//exports
goog.exportSymbol('anychart.radarAreaChart', anychart.radarAreaChart);