goog.provide('anychart.core.utils.MapPointContextProvider');
goog.require('anychart.core.utils.IContextProvider');
goog.require('anychart.core.utils.SeriesPointContextProvider');



/**
 * Series point context provider.
 * @implements {anychart.core.utils.IContextProvider}
 * @param {(anychart.core.SeriesBase|anychart.core.sparkline.series.Base)} series Series.
 * @param {Array.<string>} referenceValueNames Reference value names to be applied.
 * @extends {anychart.core.utils.SeriesPointContextProvider}
 * @constructor
 */
anychart.core.utils.MapPointContextProvider = function(series, referenceValueNames) {
  anychart.core.utils.MapPointContextProvider.base(this, 'constructor', series, referenceValueNames, false);
};
goog.inherits(anychart.core.utils.MapPointContextProvider, anychart.core.utils.SeriesPointContextProvider);


/** @inheritDoc */
anychart.core.utils.MapPointContextProvider.prototype.applyReferenceValues = function() {
  var iterator = this['series'].getIterator();
  var value;
  this['index'] = iterator.getIndex();
  for (var i = 0; i < this.referenceValueNames.length; i++) {
    value = this.referenceValueNames[i];
    this[value] = iterator.get(value);
  }

  var regionId = iterator.meta('regionId');
  if (regionId)
    this['id'] = regionId;

  if (this['series'].name)
    this['seriesName'] = this['series'].name() || 'Series: ' + this['series'].index();

  var pointGeoProp = iterator.meta('regionProperties');
  if (pointGeoProp) {
    this['name'] = pointGeoProp['name'];
    this['regionProperties'] = pointGeoProp;
  }
};