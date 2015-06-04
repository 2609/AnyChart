goog.provide('anychart.charts.Pyramid');

goog.require('anychart.core.PyramidFunnelBase');



/**
 * Pyramid Chart Class.<br/>
 * <b>Note:</b> Use method {@link anychart.pyramid} to get an instance of this class:
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the chart.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @extends {anychart.core.PyramidFunnelBase}
 * @constructor
 */
anychart.charts.Pyramid = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);
};
goog.inherits(anychart.charts.Pyramid, anychart.core.PyramidFunnelBase);


/** @inheritDoc */
anychart.charts.Pyramid.prototype.getType = function() {
  return anychart.enums.ChartTypes.PYRAMID;
};


/**
 * @inheritDoc
 */
anychart.charts.Pyramid.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  json['type'] = anychart.enums.ChartTypes.PYRAMID;
  json['reversed'] = this.reversed();

  return {'chart': json};
};


/**
 * @inheritDoc
 */
anychart.charts.Pyramid.prototype.setupByJSON = function(config) {
  this.reversed(config['reversed']);

  goog.base(this, 'setupByJSON', config);
};


//exports
anychart.charts.Pyramid.prototype['reversed'] = anychart.charts.Pyramid.prototype.reversed;

// from PyramidFunnelBase
anychart.charts.Pyramid.prototype['baseWidth'] = anychart.charts.Pyramid.prototype.baseWidth;
anychart.charts.Pyramid.prototype['connectorLength'] = anychart.charts.Pyramid.prototype.connectorLength;//doc
anychart.charts.Pyramid.prototype['connectorStroke'] = anychart.charts.Pyramid.prototype.connectorStroke;//doc
anychart.charts.Pyramid.prototype['data'] = anychart.charts.Pyramid.prototype.data;//doc|ex
anychart.charts.Pyramid.prototype['fill'] = anychart.charts.Pyramid.prototype.fill;//doc|ex
anychart.charts.Pyramid.prototype['getType'] = anychart.charts.Pyramid.prototype.getType;
anychart.charts.Pyramid.prototype['hatchFill'] = anychart.charts.Pyramid.prototype.hatchFill;//doc|ex
anychart.charts.Pyramid.prototype['hatchFillPalette'] = anychart.charts.Pyramid.prototype.hatchFillPalette;//doc|ex
anychart.charts.Pyramid.prototype['hoverFill'] = anychart.charts.Pyramid.prototype.hoverFill;//doc|ex
anychart.charts.Pyramid.prototype['hoverHatchFill'] = anychart.charts.Pyramid.prototype.hoverHatchFill;//doc|ex
anychart.charts.Pyramid.prototype['hoverLabels'] = anychart.charts.Pyramid.prototype.hoverLabels;//doc|ex
anychart.charts.Pyramid.prototype['hoverMarkers'] = anychart.charts.Pyramid.prototype.hoverMarkers;
anychart.charts.Pyramid.prototype['hoverStroke'] = anychart.charts.Pyramid.prototype.hoverStroke;//doc|ex
anychart.charts.Pyramid.prototype['labels'] = anychart.charts.Pyramid.prototype.labels;//doc|ex
anychart.charts.Pyramid.prototype['markerPalette'] = anychart.charts.Pyramid.prototype.markerPalette;//doc|ex
anychart.charts.Pyramid.prototype['markers'] = anychart.charts.Pyramid.prototype.markers;
anychart.charts.Pyramid.prototype['overlapMode'] = anychart.charts.Pyramid.prototype.overlapMode;//doc
anychart.charts.Pyramid.prototype['palette'] = anychart.charts.Pyramid.prototype.palette;//doc|ex
anychart.charts.Pyramid.prototype['pointsPadding'] = anychart.charts.Pyramid.prototype.pointsPadding;//doc
anychart.charts.Pyramid.prototype['stroke'] = anychart.charts.Pyramid.prototype.stroke;//doc|ex
anychart.charts.Pyramid.prototype['tooltip'] = anychart.charts.Pyramid.prototype.tooltip;
