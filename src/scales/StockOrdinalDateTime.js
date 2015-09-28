goog.provide('anychart.scales.StockOrdinalDateTime');
goog.require('anychart.scales.StockOrdinalTicksIterator');
goog.require('anychart.scales.StockScatterDateTime');
goog.require('anychart.utils');



/**
 * Stock ordinal date time scale.
 * @param {!(anychart.charts.Stock|anychart.core.stock.Scroller)} chartOrScroller
 * @constructor
 * @extends {anychart.scales.StockScatterDateTime}
 */
anychart.scales.StockOrdinalDateTime = function(chartOrScroller) {
  goog.base(this, chartOrScroller);
};
goog.inherits(anychart.scales.StockOrdinalDateTime, anychart.scales.StockScatterDateTime);


/** @inheritDoc */
anychart.scales.StockOrdinalDateTime.prototype.transform = function(value) {
  return this.transformInternal(value, this.keyIndexTransformer.getIndexByKey(anychart.utils.normalizeTimestamp(value)));
};


/** @inheritDoc */
anychart.scales.StockOrdinalDateTime.prototype.inverseTransform = function(ratio) {
  var result = ratio * (this.maxIndex - this.minIndex) + this.minIndex;
  return this.keyIndexTransformer.getKeyByIndex(result);
};


/** @inheritDoc */
anychart.scales.StockOrdinalDateTime.prototype.transformInternal = function(key, index) {
  return (index - this.minIndex) / (this.maxIndex - this.minIndex);
};


/** @inheritDoc */
anychart.scales.StockOrdinalDateTime.prototype.transformAligned = function(key) {
  return this.transformInternal(key, Math.ceil(this.keyIndexTransformer.getIndexByKey(anychart.utils.normalizeTimestamp(key))));
};


/** @inheritDoc */
anychart.scales.StockOrdinalDateTime.prototype.ensureTicksIteratorCreated = function() {
  if (!this.ticksIterator)
    this.ticksIterator = new anychart.scales.StockOrdinalTicksIterator(this);
};


//exports
anychart.scales.StockOrdinalDateTime.prototype['transform'] = anychart.scales.StockOrdinalDateTime.prototype.transform;
anychart.scales.StockOrdinalDateTime.prototype['inverseTransform'] = anychart.scales.StockOrdinalDateTime.prototype.inverseTransform;
