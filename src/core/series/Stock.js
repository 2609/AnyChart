/**
 * @fileoverview anychart.core.series.Stock file.
 * @suppress {extraRequire}
 */
goog.provide('anychart.core.series.Stock');
goog.require('anychart.core.drawers.Area');
goog.require('anychart.core.drawers.Candlestick');
goog.require('anychart.core.drawers.Column');
goog.require('anychart.core.drawers.Line');
goog.require('anychart.core.drawers.Marker');
goog.require('anychart.core.drawers.OHLC');
goog.require('anychart.core.drawers.RangeArea');
goog.require('anychart.core.drawers.RangeColumn');
goog.require('anychart.core.drawers.RangeSplineArea');
goog.require('anychart.core.drawers.RangeStepArea');
goog.require('anychart.core.drawers.Spline');
goog.require('anychart.core.drawers.SplineArea');
goog.require('anychart.core.drawers.StepArea');
goog.require('anychart.core.drawers.StepLine');
goog.require('anychart.core.series.Base');
goog.require('anychart.core.utils.StockHighlightContextProvider');
goog.require('anychart.data.Table');



/**
 * Class that represents a series for the user.
 * @param {!anychart.core.IChart} chart
 * @param {!anychart.core.IPlot} plot
 * @param {string} type
 * @param {anychart.core.series.TypeConfig} config
 * @constructor
 * @extends {anychart.core.series.Base}
 */
anychart.core.series.Stock = function(chart, plot, type, config) {
  anychart.core.series.Stock.base(this, 'constructor', chart, plot, type, config);

  /**
   * Series data interface.
   * @type {anychart.data.TableSelectable}
   * @private
   */
  this.data_ = null;

  /**
   * Original data source.
   * @type {anychart.data.Table|anychart.data.TableMapping|Array|string}
   * @private
   */
  this.dataSource_ = null;

  /**
   * Contains data instance that should be disposed.
   * @type {goog.disposable.IDisposable}
   * @private
   */
  this.dataToDispose_ = null;

  /**
   * Currently highlighted point.
   * @type {anychart.data.TableSelectable.RowProxy}
   * @private
   */
  this.highlightedRow_ = null;

  /**
   * Currently last point.
   * @type {anychart.data.TableSelectable.RowProxy}
   * @private
   */
  this.lastRow_ = null;

  this.canBeInteractive = false;
};
goog.inherits(anychart.core.series.Stock, anychart.core.series.Base);


//region Infrastructure
//----------------------------------------------------------------------------------------------------------------------
//
//  Infrastructure
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.series.Stock.prototype.getCategoryWidth = function() {
  var xScale = this.getXScale();
  if (xScale instanceof anychart.scales.StockOrdinalDateTime)
    return this.pixelBoundsCache.width / (xScale.getMaximumIndex() - xScale.getMinimumIndex());
  else
    return this.getSelectableData().getMinDistance() / (xScale.getMaximum() - xScale.getMinimum()) * this.pixelBoundsCache.width;
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getPointOption = function(name) {
  return undefined;
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getPreFirstPoint = function() {
  return this.data_.getPreFirstRow();
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getPostLastPoint = function() {
  return this.data_.getPostLastRow();
};


/**
 * Getter for the main stock chart.
 * @return {anychart.charts.Stock}
 */
anychart.core.series.Stock.prototype.getMainChart = function() {
  return /** @type {anychart.charts.Stock} */(this.chart);
};
//endregion


//region Working with data
//----------------------------------------------------------------------------------------------------------------------
//
//  Working with data
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets and sets data for the series.
 * @param {(anychart.data.TableMapping|anychart.data.Table|Array.<Array.<*>>|string)=} opt_value
 * @param {Object.<({column: (number|string), type: anychart.enums.AggregationType, weights: (number|string)}|number|string)>=} opt_mappingSettings
 *   An object where keys are field names and values are objects with fields:
 *      - 'column': number - Column index, that the field should get values from;
 *      - 'type': anychart.enums.AggregationType - How to group values for the field. Defaults to 'close'.
 *      - 'weights': number - Column to get weights from for 'weightedAverage' grouping type. Note: If type set to
 *          'weightedAverage', but opt_weightsColumn is not passed - uses 'average' grouping instead.
 *   or numbers - just the column index to get values from. In this case the grouping type will be set to 'close'.
 * @param {Object=} opt_csvSettings CSV parser settings if the string is passed.
 * @return {anychart.data.TableMapping|anychart.data.Table|Array.<Array.<*>>|string|anychart.core.series.Stock}
 */
anychart.core.series.Stock.prototype.data = function(opt_value, opt_mappingSettings, opt_csvSettings) {
  if (goog.isDef(opt_value)) {
    var chart = this.getMainChart();
    chart.suspendSignalsDispatching();
    var data;
    // deregistering data source
    if (this.data_) {
      data = this.data_;
      // we need this zeroing to let the chart check if the data source is still relevant
      this.data_ = null;
      chart.deregisterSource(/** @type {!anychart.data.TableSelectable} */(data));
    }

    // disposing previously created data
    if (this.dataToDispose_) {
      goog.dispose(this.dataToDispose_);
      this.dataToDispose_ = null;
    }

    // saving source value here
    this.dataSource_ = opt_value;

    // creating data table if needed
    if (goog.isArray(opt_value) || goog.isString(opt_value)) {
      data = new anychart.data.Table();
      data.addData(opt_value, false, opt_csvSettings);
      this.dataToDispose_ = opt_value = data;
    }

    // creating data mapping if needed
    if (opt_value instanceof anychart.data.Table) {
      opt_value = opt_value.mapAs(opt_mappingSettings);
      if (!opt_mappingSettings) {
        opt_value.addField('value', 1, anychart.enums.AggregationType.AVERAGE);
        opt_value.addField('size', 2, anychart.enums.AggregationType.SUM);
        opt_value.addField('open', 1, anychart.enums.AggregationType.FIRST);
        opt_value.addField('high', 2, anychart.enums.AggregationType.MAX);
        opt_value.addField('low', 3, anychart.enums.AggregationType.MIN);
        opt_value.addField('close', 4, anychart.enums.AggregationType.LAST);
        opt_value.addField('volume', 5, anychart.enums.AggregationType.SUM);
      }
      if (!this.dataToDispose_)
        this.dataToDispose_ = opt_value;
    }

    // applying passed value if it is suitable.
    if (opt_value instanceof anychart.data.TableMapping) {
      this.data_ = opt_value.createSelectable();
      this.registerDataSource();
    } else {
      this.dataSource_ = null;
    }
    chart.resumeSignalsDispatching(true);
    return this;
  }
  return this.dataSource_;
};


/**
 * Registers current selectable in the main chart.
 * @protected
 */
anychart.core.series.Stock.prototype.registerDataSource = function() {
  this.getMainChart().registerSource(/** @type {!anychart.data.TableSelectable} */(this.getSelectableData()), false);
};


/**
 * Returns current series data as TableSelectable (if any data is set).
 * @return {anychart.data.TableSelectable}
 */
anychart.core.series.Stock.prototype.getSelectableData = function() {
  return this.data_;
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getDetachedIterator = function() {
  return this.data_.getIterator();
};
//endregion


//region Path manager interface methods
//----------------------------------------------------------------------------------------------------------------------
//
//  Path manager interface methods
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.series.Stock.prototype.getColorResolutionContext = function(opt_baseColor) {
  return {
    'sourceColor': opt_baseColor || this.getSeriesOption(anychart.opt.COLOR) || 'blue'
  };
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getHatchFillResolutionContext = function() {
  return {
    'sourceHatchFill': this.getAutoHatchFill()
  };
};
//endregion


//region Drawing points
//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing points
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.series.Stock.prototype.retrieveDataColumns = function() {
  // we do not report empty data drawing because it is not actually an error
  if (!this.data_) return null;
  var fields = this.getYValueNames();
  var res = [];
  for (var i = 0; i < fields.length; i++) {
    var column = this.data_.getFieldColumn(fields[i]);
    if (!goog.isString(column) && isNaN(column)) {
      anychart.utils.warning(anychart.enums.WarningCode.STOCK_WRONG_MAPPING, undefined, [this.seriesType(), fields[i]]);
      return null;
    }
    res.push(column);
  }
  return res;
};


/**
 * Returns values, needed to be counted on in scale min/max determining.
 * @return {!Array.<number>}
 */
anychart.core.series.Stock.prototype.getScaleReferenceValues = function() {
  var columns = this.retrieveDataColumns();
  var res = [];
  if (columns) {
    var i, len = columns.length;
    for (i = 0; i < len; i++) {
      var column = columns[i];
      res.push(this.data_.getColumnMin(column));
      res.push(this.data_.getColumnMax(column));
    }

    var row = this.data_.getPreFirstRow();
    if (row) {
      for (i = 0; i < len; i++) {
        res.push(row.getColumn(columns[i]));
      }
    }

    row = this.data_.getPostLastRow();
    if (row) {
      for (i = 0; i < len; i++) {
        res.push(row.getColumn(columns[i]));
      }
    }
  }
  return res;
};
//endregion


//region Interactivity
//----------------------------------------------------------------------------------------------------------------------
//
//  Interactivity
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Prepares series data for highlight.
 * @param {number} value
 * @return {anychart.data.TableSelectable.RowProxy}
 */
anychart.core.series.Stock.prototype.prepareHighlight = function(value) {
  return this.data_.search(value, anychart.enums.TableSearchMode.EXACT);
};


/**
 * Updates last row. Used in plot.
 */
anychart.core.series.Stock.prototype.updateLastRow = function() {
  this.lastRow_ = this.data_.getLastRow();
};


/**
 * Highlights series data.
 * @param {number} value
 */
anychart.core.series.Stock.prototype.highlight = function(value) {
  this.highlightedRow_ = this.prepareHighlight(value);
};


/**
 * Removes series highlight.
 */
anychart.core.series.Stock.prototype.removeHighlight = function() {
  this.highlightedRow_ = null;
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getSeriesState = function() {
  return this.seriesState;
};


/**
 * WE DO NOT CURRENTLY EXPORT THIS METHOD.
 * Hovers all points of the series. Use <b>unhover</b> method for unhover series.
 * @return {!anychart.core.series.Stock}
 */
anychart.core.series.Stock.prototype.hoverSeries = function() {
  if (!(this.seriesState & anychart.PointState.HOVER)) {
    this.seriesState = anychart.PointState.HOVER;
    this.invalidate(anychart.ConsistencyState.SERIES_COLOR, anychart.Signal.NEEDS_REDRAW);
  }
  return this;
};


/**
 * WE DO NOT CURRENTLY EXPORT THIS METHOD.
 * Removes hover from the series or point by index.
 * @return {!anychart.core.series.Stock}
 */
anychart.core.series.Stock.prototype.unhover = function() {
  if (this.seriesState != anychart.PointState.NORMAL) {
    this.seriesState = anychart.PointState.NORMAL;
    this.invalidate(anychart.ConsistencyState.SERIES_COLOR, anychart.Signal.NEEDS_REDRAW);
  }
  return this;
};
//endregion


//region Format/position formatters generation
//----------------------------------------------------------------------------------------------------------------------
//
//  Format/position formatters generation
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.series.Stock.prototype.createTooltipContextProvider = function() {
  if (!this.tooltipContext) {
    this.tooltipContext = new anychart.core.utils.StockHighlightContextProvider(this, this.drawer.yValueNames, false);
  }
  this.tooltipContext.applyReferenceValues();
  return this.tooltipContext;
};


/**
 * Creates context provider for legend items text formatter function.
 * @return {Object} Legend context provider.
 * @protected
 */
anychart.core.series.Stock.prototype.createLegendContextProvider = function() {
  if (!this.legendProvider)
    this.legendProvider = new anychart.core.utils.StockHighlightContextProvider(this, this.drawer.yValueNames, false);
  this.legendProvider.applyReferenceValues();
  return this.legendProvider;
};


/**
 * Returns current point for the legend.
 * @return {?anychart.data.TableSelectable.RowProxy}
 */
anychart.core.series.Stock.prototype.getCurrentPoint = function() {
  return this.highlightedRow_ || this.lastRow_;
};
//endregion


//region Legend
//----------------------------------------------------------------------------------------------------------------------
//
//  Legend
//
//----------------------------------------------------------------------------------------------------------------------
// /** @inheritDoc */
// anychart.core.series.Stock.prototype.onLegendItemSignal = function(event) {
//   var signal = anychart.Signal.NEED_UPDATE_LEGEND;
//   var force = false;
//   //if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
//   //  signal |= anychart.Signal.BOUNDS_CHANGED;
//   //  force = true;
//   //}
//   this.dispatchSignal(signal, force);
// };


/** @inheritDoc */
anychart.core.series.Stock.prototype.getLegendIconColor = function(legendItemJson, colorType, baseColor, context) {
  if (!legendItemJson && this.check(anychart.core.drawers.Capabilities.IS_OHLC_BASED)) {
    var name;
    var rising = context['open'] < context['close'];
    if (colorType == anychart.enums.ColorType.STROKE) {
      name = rising ? anychart.opt.RISING_STROKE : anychart.opt.FALLING_STROKE;
    } else if (colorType == anychart.enums.ColorType.HATCH_FILL) {
      if (this.check(anychart.core.drawers.Capabilities.USES_STROKE_AS_FILL))
        return null;
      name = rising ? anychart.opt.RISING_HATCH_FILL : anychart.opt.FALLING_HATCH_FILL;
    } else {
      if (this.check(anychart.core.drawers.Capabilities.USES_STROKE_AS_FILL)) {
        name = rising ? anychart.opt.RISING_STROKE : anychart.opt.FALLING_STROKE;
        colorType = anychart.enums.ColorType.STROKE;
      } else {
        name = rising ? anychart.opt.RISING_FILL : anychart.opt.FALLING_FILL;
      }
    }
    var resolver = anychart.core.series.Base.getColorResolver([name], colorType);
    return resolver(this, anychart.PointState.NORMAL, true);
  } else {
    return anychart.core.series.Stock.base(this, 'getLegendIconColor', legendItemJson, colorType, baseColor, context);
  }
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getLegendIconType = function(type, context) {
  if (String(type).toLowerCase() == anychart.enums.LegendItemIconType.RISING_FALLING) {
    if (this.check(anychart.core.drawers.Capabilities.IS_OHLC_BASED)) {
      return (context[anychart.opt.OPEN] < context[anychart.opt.CLOSE]) ?
          anychart.enums.LegendItemIconType.TRIANGLE_UP :
          anychart.enums.LegendItemIconType.TRIANGLE_DOWN;
    }
  }
  return anychart.core.series.Stock.base(this, 'getLegendIconType', type, context);
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.getLegendItemText = function(context) {
  return this.name() + (isNaN(context['value']) ? '' : (': ' + anychart.utils.toNumber(context['value']).toFixed(2)));
};
//endregion


//region Serialization/Deserialization/Disposing
//----------------------------------------------------------------------------------------------------------------------
//
//  Serialization/Deserialization/Disposing
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @inheritDoc
 */
anychart.core.series.Stock.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  return json;
};


/**
 * @inheritDoc
 */
anychart.core.series.Stock.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
};


/** @inheritDoc */
anychart.core.series.Stock.prototype.disposeInternal = function() {
  if (this.data_) {
    var data = this.data_;
    // we need this zeroing to let the chart check if the data source is still relevant
    this.data_ = null;
    this.getMainChart().deregisterSource(/** @type {!anychart.data.TableSelectable} */(data));
  }

  this.highlightedRow_ = null;
  this.lastRow_ = null;

  goog.base(this, 'disposeInternal');
};
//endregion


//exports
anychart.core.series.Stock.prototype['data'] = anychart.core.series.Stock.prototype.data;
