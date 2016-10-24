goog.provide('anychart.standalones.axes.Radar');
goog.require('anychart.core.axes.Radar');



/**
 * @constructor
 * @extends {anychart.core.axes.Radar}
 */
anychart.standalones.axes.Radar = function() {
  anychart.standalones.axes.Radar.base(this, 'constructor');
};
goog.inherits(anychart.standalones.axes.Radar, anychart.core.axes.Radar);
anychart.core.makeStandalone(anychart.standalones.axes.Radar, anychart.core.axes.Radar);


/** @inheritDoc */
anychart.standalones.axes.Radar.prototype.setupByJSON = function(config) {
  anychart.standalones.axes.Radar.base(this, 'setupByJSON', config);
  this.startAngle(config['startAngle']);
};


/** @inheritDoc */
anychart.standalones.axes.Radar.prototype.serialize = function() {
  var json = anychart.standalones.axes.Radar.base(this, 'serialize');
  json['startAngle'] = this.startAngle();
  return json;
};


/**
 * Returns axis instance.<br/>
 * <b>Note:</b> Any axis must be bound to a scale.
 * @return {!anychart.standalones.axes.Radar}
 */
anychart.standalones.axes.radar = function() {
  var axis = new anychart.standalones.axes.Radar();
  axis.setup(anychart.getFullTheme()['standalones']['radarAxis']);
  return axis;
};


/**
 * Returns axis instance.<br/>
 * <b>Note:</b> Any axis must be bound to a scale.
 * @return {!anychart.standalones.axes.Radar}
 * @deprecated Since 7.12.0. Use anychart.standalones.axes.radar instead.
 */
anychart.axes.radar = function() {
  anychart.core.reporting.warning(anychart.enums.WarningCode.DEPRECATED, null, ['anychart.axes.radar', 'anychart.standalones.axes.radar'], true);
  return anychart.standalones.axes.radar();
};


//exports
goog.exportSymbol('anychart.axes.radar', anychart.axes.radar);
goog.exportSymbol('anychart.standalones.axes.radar', anychart.standalones.axes.radar);
anychart.standalones.axes.Radar.prototype['draw'] = anychart.standalones.axes.Radar.prototype.draw;
anychart.standalones.axes.Radar.prototype['parentBounds'] = anychart.standalones.axes.Radar.prototype.parentBounds;
anychart.standalones.axes.Radar.prototype['container'] = anychart.standalones.axes.Radar.prototype.container;
anychart.standalones.axes.Radar.prototype['startAngle'] = anychart.standalones.axes.Radar.prototype.startAngle;