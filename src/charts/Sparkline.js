goog.provide('anychart.charts.Sparkline');

goog.require('anychart'); // otherwise we can't use anychart.chartTypesMap object.
goog.require('anychart.core.Chart');
goog.require('anychart.core.axes.Linear');
goog.require('anychart.core.axisMarkers.Line');
goog.require('anychart.core.axisMarkers.Range');
goog.require('anychart.core.axisMarkers.Text');
goog.require('anychart.core.sparkline.series.Base');
goog.require('anychart.enums');
goog.require('anychart.scales');



/**
 * Sparkline chart class.<br/>
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @extends {anychart.core.Chart}
 * @constructor
 */
anychart.charts.Sparkline = function(opt_data, opt_csvSettings) {
  goog.base(this);

  /**
   * @type {anychart.scales.Base}
   * @private
   */
  this.xScale_ = null;

  /**
   * @type {anychart.scales.Base}
   * @private
   */
  this.yScale_ = null;

  /**
   * @type {anychart.core.sparkline.series.Base}
   * @private
   */
  this.series_ = null;

  /**
   * @type {Array.<anychart.core.axisMarkers.Line>}
   * @private
   */
  this.lineAxesMarkers_ = [];

  /**
   * @type {Array.<anychart.core.axisMarkers.Range>}
   * @private
   */
  this.rangeAxesMarkers_ = [];

  /**
   * @type {Array.<anychart.core.axisMarkers.Text>}
   * @private
   */
  this.textAxesMarkers_ = [];

  /**
   * Cache of chart data bounds.
   * @type {acgraph.math.Rect}
   * @private
   */
  this.dataBounds_ = null;

  /**
   * @type {boolean}
   * @protected
   */
  this.connectMissing = false;

  /**
   * @type {Object}
   * @private
   */
  this.statistics_ = {};

  /**
   * Series clip.
   * @type {boolean|anychart.math.Rect}
   * @private
   */
  this.clip_ = true;

  /**
   * Series default settings.
   * @type {Object}
   * @private
   */
  this.seriesDefaults_ = {};

  /**
   * @type {!anychart.core.ui.MarkersFactory}
   * @private
   */
  this.markersInternal_ = new anychart.core.ui.MarkersFactory();
  this.markersInternal_.setParentEventTarget(this);
  this.markersInternal_.setAutoZIndex(anychart.charts.Sparkline.ZINDEX_MARKER);

  /**
   * @type {!anychart.core.ui.LabelsFactory}
   * @private
   */
  this.labelsInternal_ = new anychart.core.ui.LabelsFactory();
  this.labelsInternal_.setParentEventTarget(this);
  this.labelsInternal_.setAutoZIndex(anychart.charts.Sparkline.ZINDEX_LABEL);

  this.data(opt_data || null, opt_csvSettings);
  this.type(anychart.enums.SparklineSeriesType.LINE);
};
goog.inherits(anychart.charts.Sparkline, anychart.core.Chart);


/** @inheritDoc */
anychart.charts.Sparkline.prototype.getType = function() {
  return anychart.enums.ChartTypes.SPARKLINE;
};


/**
 * Supported consistency states. Adds AXES, AXES_MARKERS, GRIDS to anychart.core.Chart states.
 * @type {number}
 */
anychart.charts.Sparkline.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Chart.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.SPARK_SCALES |
    anychart.ConsistencyState.SPARK_SERIES |
    anychart.ConsistencyState.SPARK_AXES_MARKERS;


/**
 * Axis range marker z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_AXIS_RANGE_MARKER = 25.1;


/**
 * Axis line marker z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_AXIS_LINE_MARKER = 25.2;


/**
 * Axis text marker z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_AXIS_TEXT_MARKER = 25.3;


/**
 * Series z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_SERIES = 30;


/**
 * Marker z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_MARKER = 40;


/**
 * Label z-index in chart root layer.
 * @type {number}
 */
anychart.charts.Sparkline.ZINDEX_LABEL = 40;


/**
 * Default hatch fill type.
 * @type {acgraph.vector.HatchFill.HatchFillType|string}
 */
anychart.charts.Sparkline.DEFAULT_HATCH_FILL_TYPE = acgraph.vector.HatchFill.HatchFillType.DIAGONAL_BRICK;


/**
 * Array of marker field names for merging.
 * @type {Array.<string>}
 * @private
 */
anychart.charts.Sparkline.MARKERS_FIELD_NAMES_FOR_MERGE_ = [
  'enabled', 'position', 'anchor', 'offsetX', 'offsetY', 'type', 'size', 'fill', 'stroke'];


/**
 * Array of labels field names for merging.
 * @type {Array.<string>}
 * @private
 */
anychart.charts.Sparkline.LABELS_FIELD_NAMES_FOR_MERGE_ = [
  'enabled', 'background', 'padding', 'position', 'anchor', 'offsetX', 'offsetY', 'rotation', 'width', 'height',
  'fontSize', 'fontFamily', 'fontColor', 'fontOpacity', 'fontDecoration', 'fontStyle', 'fontVariant', 'fontWeight',
  'letterSpacing', 'textDirection', 'lineHeight', 'textIndent', 'vAlign', 'hAlign', 'textWrap', 'textOverflow',
  'selectable', 'disablePointerEvents', 'useHtml'
];


/**
 * @type {!anychart.data.View}
 * @private
 */
anychart.charts.Sparkline.prototype.data_;


/**
 * Series type.
 * @type {string|anychart.enums.SparklineSeriesType}
 * @private
 */
anychart.charts.Sparkline.prototype.type_;


/**
 * @private
 * @type {(number|string|null)}
 */
anychart.charts.Sparkline.prototype.barWidth_ = '90%';


/**
 * @type {anychart.data.View}
 * @private
 */
anychart.charts.Sparkline.prototype.parentView_;


/**
 * @type {goog.Disposable}
 * @private
 */
anychart.charts.Sparkline.prototype.parentViewToDispose_;


/**
 * @type {!anychart.data.Iterator}
 * @private
 */
anychart.charts.Sparkline.prototype.iterator_;


//----------------------------------------------------------------------------------------------------------------------
//
//  Scales.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for default chart X scale.
 * @return {!anychart.scales.Base} Default chart scale value.
 *//**
 * Setter for default chart X scale.<br/>
 * <b>Note:</b> This scale will be passed to all scale dependent chart elements if they don't have their own scales.
 * @example
 * var chart = anychart.sparkline();
 * chart.line([
 *   {x: "10-Dec-2004", y: 20},
 *   {x: "11-Dec-2004", y: 40},
 *   {x: "12-Dec-2004", y: 30}
 * ]);
 * chart.xScale('dateTime');
 * chart.container(stage).draw();
 * @param {(anychart.enums.ScaleTypes|anychart.scales.Base)=} opt_value X Scale to set.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.enums.ScaleTypes|anychart.scales.Base)=} opt_value X Scale to set.
 * @return {!(anychart.scales.Base|anychart.charts.Sparkline)} Default chart scale value or itself for method chaining.
 */
anychart.charts.Sparkline.prototype.xScale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isString(opt_value)) {
      opt_value = anychart.scales.Base.fromString(opt_value, true);
    }
    if (this.xScale_ != opt_value) {
      this.xScale_ = opt_value;
      this.invalidate(anychart.ConsistencyState.SPARK_SCALES, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    if (!this.xScale_) {
      this.xScale_ = new anychart.scales.Ordinal();
    }
    return this.xScale_;
  }
};


/**
 * Getter for default chart Y scale.
 * @example
 * var chart = anychart.sparkline();
 * chart.line([ 10, 12, 14, 11]);
 * chart.yScale().minimum(9).maximum(13);
 * chart.xAxis().labels()
 *     .textFormatter(function(point){ return new Date(point.value).toDateString();});
 * chart.yAxis();
 * chart.container(stage).draw();
 * @return {!anychart.scales.Base} Default chart scale value.
 *//**
 * Setter for chart Y scale.<br/>
 * <b>Note:</b> This scale will be passed to all scale dependent chart elements if they don't have their own scales.
 * @example
 * var chart = anychart.sparkline();
 * chart.line([0.07, 0.9, 14, 2, 89]);
 * chart.yScale('log');
 * chart.xAxis();
 * chart.yAxis();
 * chart.container(stage).draw();
 * @param {(anychart.enums.ScaleTypes|anychart.scales.Base)=} opt_value Y Scale to set.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.enums.ScaleTypes|anychart.scales.Base)=} opt_value Y Scale to set.
 * @return {!(anychart.scales.Base|anychart.charts.Sparkline)} Default chart scale value or itself for method chaining.
 */
anychart.charts.Sparkline.prototype.yScale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isString(opt_value)) {
      opt_value = anychart.scales.Base.fromString(opt_value, false);
    }
    if (this.yScale_ != opt_value) {
      this.yScale_ = opt_value;
      this.invalidate(anychart.ConsistencyState.SPARK_SCALES, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    if (!this.yScale_) {
      this.yScale_ = new anychart.scales.Linear();
    }
    return this.yScale_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Axes markers.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for chart line marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.lineMarker(0)
 *     .value(5.5)
 *     .stroke('2 red')
 *     .layout('horizontal');
 * @param {number=} opt_index Chart line marker index. If not set - creates a new instance and adds it to the end of array.
 * @return {!anychart.core.axisMarkers.Line} Line marker instance by index.
 *//**
 * Setter for chart line marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.lineMarker({value: 5.5});
 * @param {(Object|boolean|null)=} opt_value Chart line marker settings to set.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Setter for chart line marker by index.
 * @example <t>lineChart</t>
 * chart.spline([1, -4, 5, 7, 7]);
 * chart.lineMarker();
 * chart.lineMarker(1).value(2).stroke('green');
 * //turn off first marker
 * chart.lineMarker(0, null);
 * @param {number=} opt_index Chart line marker index.
 * @param {(Object|boolean|null)=} opt_value Chart line marker settings to set.<br/>
 * <b>Note:</b> pass <b>null</b> or <b>'none' to disable marker</b>.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|number)=} opt_indexOrValue Chart line marker settings to set.
 * @param {(Object|boolean|null)=} opt_value Chart line marker settings to set.
 * @return {!(anychart.core.axisMarkers.Line|anychart.charts.Sparkline)} Line marker instance by index or itself for method chaining.
 */
anychart.charts.Sparkline.prototype.lineMarker = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var lineMarker = this.lineAxesMarkers_[index];
  if (!lineMarker) {
    lineMarker = new anychart.core.axisMarkers.Line();
    lineMarker.layout(anychart.enums.Layout.HORIZONTAL);
    lineMarker.zIndex(anychart.charts.Sparkline.ZINDEX_AXIS_LINE_MARKER);
    this.lineAxesMarkers_[index] = lineMarker;
    this.registerDisposable(lineMarker);
    lineMarker.listenSignals(this.onMarkersSignal_, this);
    this.invalidate(anychart.ConsistencyState.SPARK_AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(value)) {
    lineMarker.setup(value);
    return this;
  } else {
    return lineMarker;
  }
};


/**
 * Getter for chart range marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.rangeMarker()
 *     .from(2.5)
 *     .to(5.5)
 *     .fill('blue .1');
 * @param {number=} opt_index Chart range marker index. If not set - creates a new instance and adds it to the end of array.
 * @return {!anychart.core.axisMarkers.Range} Range marker instance by index.
 *//**
 * Setter for chart range marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.rangeMarker({
 *   from: 2.5,
 *   to: 5.5,
 *   fill: 'blue .1'
 * });
 * @param {(anychart.core.axisMarkers.Range|Object)=} opt_value Chart range marker settings to set.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Setter for chart range marker by index.
 * @example <t>lineChart</t>
 * chart.column([1, -4, 5, 7, 7]);
 * chart.rangeMarker(0).from(5).to(10).fill('orange 0.2');
 * chart.rangeMarker(1).from(-5).to(2).fill('green 0.2');
 * // turn off red marker.
 * chart.rangeMarker(0, null);
 * @param {number=} opt_index Chart range marker index.
 * @param {(Object|boolean|null)=} opt_value Chart range marker settings to set.<br/>
 * <b>Note:</b> pass <b>null</b> or <b>'none' to disable to disable marker.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|number)=} opt_indexOrValue Chart range marker settings to set.
 * @param {(Object|boolean|null)=} opt_value Chart range marker settings to set.
 * @return {!(anychart.core.axisMarkers.Range|anychart.charts.Sparkline)} Range marker instance by index or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.rangeMarker = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var rangeMarker = this.rangeAxesMarkers_[index];
  if (!rangeMarker) {
    rangeMarker = new anychart.core.axisMarkers.Range();
    rangeMarker.layout(anychart.enums.Layout.HORIZONTAL);
    rangeMarker.zIndex(anychart.charts.Sparkline.ZINDEX_AXIS_RANGE_MARKER);
    this.rangeAxesMarkers_[index] = rangeMarker;
    this.registerDisposable(rangeMarker);
    rangeMarker.listenSignals(this.onMarkersSignal_, this);
    this.invalidate(anychart.ConsistencyState.SPARK_AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(value)) {
    rangeMarker.setup(value);
    return this;
  } else {
    return rangeMarker;
  }
};


/**
 * Getter for chart text marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.textMarker()
 *     .text('Marker')
 *     .value(3.3)
 *     .align(anychart.enums.Align.LEFT)
 *     .anchor(anychart.enums.Anchor.LEFT_BOTTOM);
 * chart.lineMarker().value(3.3);
 * @param {number=} opt_index Chart text marker index. If not set - creates a new instance and adds it to the end of array.
 * @return {!anychart.core.axisMarkers.Text} Text marker instance by index.
 *//**
 * Setter for chart text marker.
 * @example <t>lineChart</t>
 * chart.line([1, -4, 5, 7, 7]);
 * chart.textMarker({text: 'Marker', value: 3.3});
 * chart.lineMarker().value(3.3);
 * @param {(Object|boolean|null)=} opt_value Chart text marker settings to set.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Setter for chart text marker by index.
 * @example <t>lineChart</t>
 * chart.spline([1, -4, 5, 7, 7]);
 * chart.textMarker(0).value(6).text('Marker 0');
 * chart.textMarker(1).value(2).text('Marker 1');
 * // turn off first marker
 * chart.textMarker(0, null);
 * @param {number=} opt_index Chart text marker index.
 * @param {(Object|boolean|null)=} opt_value Chart text marker settings to set.<br/>
 * <b>Note:</b> pass <b>null</b> or <b>'none' to disable marker.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|number)=} opt_indexOrValue Chart line marker settings to set.
 * @param {(Object|boolean|null)=} opt_value Chart line marker settings to set.
 * @return {!(anychart.core.axisMarkers.Text|anychart.charts.Sparkline)} Line marker instance by index or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.textMarker = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var textMarker = this.textAxesMarkers_[index];
  if (!textMarker) {
    textMarker = new anychart.core.axisMarkers.Text();
    textMarker.layout(anychart.enums.Layout.HORIZONTAL);
    textMarker.zIndex(anychart.charts.Sparkline.ZINDEX_AXIS_TEXT_MARKER);
    this.textAxesMarkers_[index] = textMarker;
    this.registerDisposable(textMarker);
    textMarker.listenSignals(this.onMarkersSignal_, this);
    this.invalidate(anychart.ConsistencyState.SPARK_AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(value)) {
    textMarker.setup(value);
    return this;
  } else {
    return textMarker;
  }
};


/**
 * Listener for markers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.charts.Sparkline.prototype.onMarkersSignal_ = function(event) {
  this.invalidate(anychart.ConsistencyState.SPARK_AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Data
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Series statistics.
 * @param {string=} opt_name Statistics parameter name.
 * @param {number=} opt_value Statistics parameter value.
 * @return {anychart.charts.Sparkline|Object.<number>|number}
 */
anychart.charts.Sparkline.prototype.statistics = function(opt_name, opt_value) {
  if (goog.isDef(opt_name)) {
    if (goog.isDef(opt_value)) {
      this.statistics_[opt_name] = opt_value;
      return this;
    } else {
      return this.statistics_[opt_name];
    }
  } else {
    return this.statistics_;
  }
};


/**
 * Getter for series mapping.
 * @return {!anychart.data.View} Returns current mapping.
 *//**
 * Setter for series mapping.
 * @example <t>listingOnly</t>
 * series.data([20, 7, 10, 14]);
 *  // or
 * series.data([
 *    [1, 22, 13],
 *    [13, 22, 23],
 *    [17, 22, 33],
 *    [21, 22, 43]
 *  ]);
 *  // or
 * series.data([
 *    {name: 'Point 1', value: 10},
 *    {name: 'Point 2', value: 7},
 *    {name: 'Point 3', value: 20},
 *    {name: 'Point 4', value: 14}
 *  ]);
 *   // or
 *  series.data(
 *    '17;21;11.1;4\n'+
 *    '11;11;0.21;0\n'+
 *    '21;17;23.1;1\n'+
 *    '10;.4;14;4.4\n',
 *    {'rowsSeparator': '\n', columnsSeparator: ';'})
 * @example <t>lineChart</t>
 * chart.line().data([1,2,3]);
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed by first param, you can pass CSV parser settings here as a hash map.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {(!anychart.charts.Sparkline|!anychart.data.View)} Returns itself if used as a setter or the mapping if used as a getter.
 */
anychart.charts.Sparkline.prototype.data = function(opt_value, opt_csvSettings) {
  if (goog.isDef(opt_value)) {
    goog.dispose(this.parentViewToDispose_); // disposing a view created by the series if any;
    if (opt_value instanceof anychart.data.View)
      this.parentView_ = this.parentViewToDispose_ = opt_value.derive(); // deriving a view to avoid interference with other view users
    else if (opt_value instanceof anychart.data.Set)
      this.parentView_ = this.parentViewToDispose_ = opt_value.mapAs();
    else
      this.parentView_ = (this.parentViewToDispose_ = new anychart.data.Set(
          (goog.isArray(opt_value) || goog.isString(opt_value)) ? opt_value : null, opt_csvSettings)).mapAs();
    this.registerDisposable(this.parentViewToDispose_);
    this.data_ = this.parentView_;
    this.data_.listenSignals(this.dataInvalidated_, this);
    if (this.series_)
      this.series_.invalidate(anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_RECALCULATION | anychart.Signal.NEEDS_REDRAW);
    return this;
  }
  return this.data_;
};


/**
 * Gets an array of reference 'y' fields from the row iterator points to.
 * Reference fields are defined using referenceValueNames and referenceValueMeanings.
 * If there is only one field - a value is returned.
 * If there are several - array.
 * If any of the two is undefined - returns null.
 *
 * @return {*} Fetches significant scale values from current data row.
 */
anychart.charts.Sparkline.prototype.getReferenceScaleValues = function() {
  var iterator = this.getIterator();
  var yScale = this.yScale();

  var val = iterator.get('value');
  if (yScale.isMissing(val)) return null;

  return val;
};


/**
 * Listens to data invalidation.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.charts.Sparkline.prototype.dataInvalidated_ = function(e) {
  if (e.hasSignal(anychart.Signal.DATA_CHANGED)) {
    this.dispatchSignal(anychart.Signal.NEEDS_RECALCULATION | anychart.Signal.DATA_CHANGED);
  }
};


/**
 * DO NOT PUBLISH.
 */
anychart.charts.Sparkline.prototype.resetCategorisation = function() {
  if (this.data_ != this.parentView_)
    goog.dispose(this.data_);
  this.data_ = /** @type {!anychart.data.View} */(this.parentView_);
};


/**
 * DO NOT PUBLISH.
 * @param {!Array.<*>|boolean} categories If Array - ordinal scale, if false - scatter scale with numbers,
 *    true - datetime scale.
 */
anychart.charts.Sparkline.prototype.categoriseData = function(categories) {
  this.data_ = this.parentView_.prepare('x', categories);
};


/**
 * Returns current mapping iterator.
 * @return {!anychart.data.Iterator} Current series iterator.
 */
anychart.charts.Sparkline.prototype.getIterator = function() {
  return this.iterator_ || this.getResetIterator();
};


/**
 * Returns new default iterator for the current mapping.
 * @return {!anychart.data.Iterator} New iterator.
 */
anychart.charts.Sparkline.prototype.getResetIterator = function() {
  return this.iterator_ = this.data().getIterator();
};


/**
 * @param {string|anychart.enums.SparklineSeriesType} type Series type.
 * @private
 * @return {anychart.core.sparkline.series.Base}
 */
anychart.charts.Sparkline.prototype.createSeriesByType_ = function(type) {
  var ctl = anychart.core.sparkline.series.Base.SeriesTypesMap[type];
  var instance;

  if (ctl) {
    instance = new ctl(this);
    this.registerDisposable(instance);

    this.series_ = instance;
    instance.setAutoZIndex(anychart.charts.Sparkline.ZINDEX_SERIES);
    instance.listenSignals(this.seriesInvalidated_, this);

    this.seriesDefaults_ = this.series_.getDefaults();

    this.invalidate(anychart.ConsistencyState.SPARK_SERIES | anychart.ConsistencyState.SPARK_SCALES,
        anychart.Signal.NEEDS_REDRAW);

  } else {
    anychart.utils.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, [type + ' series']);
    instance = null;
  }

  return instance;
};


/**
 * Series signals handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.charts.Sparkline.prototype.seriesInvalidated_ = function(event) {
  var state = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.SPARK_SERIES;
  }
  if (event.hasSignal(anychart.Signal.DATA_CHANGED)) {
    state |= anychart.ConsistencyState.SPARK_SERIES;
    this.invalidateSeries_();
  }
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION)) {
    state |= anychart.ConsistencyState.SPARK_SCALES;
  }
  this.invalidate(state, anychart.Signal.NEEDS_REDRAW);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Series specific settings
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter/setter for sparkline series type.
 * @param {(string|anychart.enums.SparklineSeriesType)=} opt_type Series type.
 * @return {string|anychart.enums.SparklineSeriesType|anychart.charts.Sparkline} .
 */
anychart.charts.Sparkline.prototype.type = function(opt_type) {
  if (goog.isDef(opt_type)) {
    opt_type = anychart.enums.normalizeSparklineSeriesType(opt_type);
    if (this.type_ != opt_type) {
      this.type_ = opt_type;
      if (this.series_) {
        this.series_.dispose();
        this.series_ = null;
      }
      this.invalidate(anychart.ConsistencyState.SPARK_SERIES, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.type_;
};


/**
 * Getter for series clip settings.
 * @return {boolean|anychart.math.Rect} Current clip settings.
 *//**
 * Setter for series clip settings. Clips visible part of a series by a rectangle (or chart).
 * @example <t>lineChart</t>
 * chart.yScale().minimum(2);
 * chart.line([1, 4, 7, 1]).clip(false);
 * @param {(boolean|anychart.math.Rect)=} opt_value [False, if series is created manually.<br/>True, if created via chart] Enable/disable series clip.
 * @return {anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(boolean|anychart.math.Rect)=} opt_value [False, if series is created manually.<br/>True, if created via chart] Enable/disable series clip.
 * @return {anychart.charts.Sparkline|boolean|anychart.math.Rect} .
 */
anychart.charts.Sparkline.prototype.clip = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNull(opt_value)) opt_value = false;
    if (this.clip_ != opt_value) {
      this.clip_ = opt_value;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.BOUNDS,
            anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.clip_;
  }
};


/**
 * Getter for current point width settings.
 * @return {string|number} Point width pixel value.
 *//**
 * Setter for point width settings.
 * @example
 * chart = anychart.sparkline();
 * chart.column([0.3, 1.6, 1.2, 1.9]).pointWidth(35);
 * chart.container(stage).draw();
 * @param {(number|string)=} opt_value Point width pixel value.
 * @return {anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(number|string|null)=} opt_value Point width pixel value.
 * @return {string|number|anychart.charts.Sparkline} Bar width pixel value or Bar instance for chaining call.
 */
anychart.charts.Sparkline.prototype.pointWidth = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.barWidth_ != opt_value) {
      this.barWidth_ = opt_value;
      if (this.series_ && this.series_.isWidthBased())
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL | anychart.ConsistencyState.APPEARANCE,
            anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.barWidth_;
  }
};


/**
 * Getter for connect missing points setting.
 * @return {boolean} Current setting.
 *//**
 * Setter for connect missing points setting.
 * @example <t>lineChart</t>
 * var blueLine = chart.sparkline([
 *    ['A1', 1],
 *    ['A2', 1.6],
 *    ['A3', 'missing'],
 *    ['A4', 1.1],
 *    ['A5', 1.9]
 * ]).connectMissingPoints(false);
 * var redLine = chart.sparkline([
 *    ['A1', 2],
 *    ['A2', 2.6],
 *    ['A3', 'missing'],
 *    ['A4', 2.1],
 *    ['A5', 2.9]
 * ]).connectMissingPoints(true);
 * @param {boolean=} opt_value [false] If set to <b>true</b>, the series will not be interrupted on missing points.<br/>
 *   Defaults to <b>false</b>. Markers will not be drawn for missing points in both cases.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_value The value to be set.
 * @return {!anychart.charts.Sparkline|boolean} The setting, or itself for method chaining.
 */
anychart.charts.Sparkline.prototype.connectMissingPoints = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = !!opt_value;
    if (this.connectMissing != opt_value) {
      this.connectMissing = opt_value;
      if (this.series_ && !this.series_.isWidthBased())
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.SERIES_HATCH_FILL,
            anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.connectMissing;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Coloring
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets final normalized fill or stroke color.
 * @param {acgraph.vector.Fill|acgraph.vector.Stroke|Function} color Normal state color.
 * @param {...(acgraph.vector.Fill|acgraph.vector.Stroke|Function)} var_args .
 * @return {!(acgraph.vector.Fill|acgraph.vector.Stroke)} Normalized color.
 */
anychart.charts.Sparkline.prototype.normalizeColor = function(color, var_args) {
  var fill;
  if (goog.isFunction(color)) {
    var sourceColor = arguments.length > 1 ?
        this.normalizeColor.apply(this, goog.array.slice(arguments, 1)) :
        this.seriesDefaults_['color'];
    var scope = {
      'index': this.getIterator().getIndex(),
      'sourceColor': sourceColor,
      'iterator': this.getIterator()
    };
    fill = color.call(scope);
  } else
    fill = color;
  return fill;
};


/**
 * Getter for current fill color.
 * @return {!acgraph.vector.Fill} Current fill color.
 *//**
 * Sets fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.fill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.fill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.fill_) {
      this.fill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.fill_ || this.seriesDefaults_['fill'];
};


/**
 * Getter for current negative fill color.
 * @return {!acgraph.vector.Fill} Current negativeFill color.
 *//**
 * Sets negative fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.negativeFill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.negativeFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.negativeFill_) {
      this.negativeFill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.negativeFill_ || this.seriesDefaults_['negativeFill'];
};


/**
 * Getter for current first fill color.
 * @return {!acgraph.vector.Fill} Current first fill color.
 *//**
 * Sets first fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.firstFill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.firstFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.firstFill_) {
      this.firstFill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.firstFill_ || this.seriesDefaults_['firstFill'];
};


/**
 * Getter for current last fill color.
 * @return {!acgraph.vector.Fill} Current last fill color.
 *//**
 * Sets last fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.lastFill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.lastFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.lastFill_) {
      this.lastFill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.lastFill_ || this.seriesDefaults_['lastFill'];
};


/**
 * Getter for current fill color of maximum point value.
 * @return {!acgraph.vector.Fill} Current maximum fill color.
 *//**
 * Sets maximum fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.maxFill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.maxFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.maxFill_) {
      this.maxFill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.maxFill_ || this.seriesDefaults_['maxFill'];
};


/**
 * Getter for current fill color of minimum point value.
 * @return {!acgraph.vector.Fill} Current min fill color.
 *//**
 * Sets min fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <c>Solid fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill('green');
 * chart.container(stage).draw();
 * @example <c>Linear gradient fill</c>
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill(['green', 'yellow']);
 * chart.container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill('green', 0.4);
 * chart.container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill(['black', 'yellow'], 45, true, 0.5);
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 * chart.container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('column');
 * chart.minFill({
 *  src: 'http://static.anychart.com/underwater.jpg',
 *  mode: acgraph.vector.ImageFillMode.STRETCH
 * });
 * chart.container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.charts.Sparkline|Function} .
 */
anychart.charts.Sparkline.prototype.minFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.minFill_) {
      this.minFill_ = fill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.minFill_ || this.seriesDefaults_['minFill'];
};


/**
 * Method that gets final fill color for the current point, with all fallbacks taken into account.
 * @param {boolean} usePointSettings If point settings should count too (iterator questioning).
 * @return {!acgraph.vector.Fill} Final fill for the current row.
 */
anychart.charts.Sparkline.prototype.getFinalFill = function(usePointSettings) {
  var iterator = this.getIterator();
  var val = /** @type {number} */ (iterator.get('value'));
  var index = iterator.getIndex();

  var finalFill;
  if (usePointSettings && goog.isDef(iterator.get('fill'))) {
    //user settings defined
    finalFill = iterator.get('fill');
  } else if (index == iterator.getRowsCount() - 1 && goog.isDef(this.lastFill())) {
    //last point
    finalFill = this.lastFill();
  } else if (index == 0 && goog.isDef(this.firstFill())) {
    //first point
    finalFill = this.firstFill();
  } else if (val == this.statistics('max') && goog.isDef(this.maxFill())) {
    //point have max value
    finalFill = this.maxFill();
  } else if (val == this.statistics('min') && goog.isDef(this.minFill())) {
    //point have min value
    finalFill = this.minFill();
  } else if (val < 0 && goog.isDef(this.negativeFill())) {
    //point have negative value
    finalFill = this.negativeFill();
  } else {
    //another case
    finalFill = this.fill();
  }

  var result = /** @type {!acgraph.vector.Fill} */(this.normalizeColor(/** @type {acgraph.vector.Fill|Function} */(finalFill)));
  return acgraph.vector.normalizeFill(result);
};


/**
 * Getter for current stroke settings.
 * @return {!acgraph.vector.Stroke} Current stroke settings.
 *//**
 * Setter for chart stroke by function.
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('line');
 * chart.stroke(
 *      function(){
 *        return '3 '+ this.sourceColor;
 *      }
 * );
 * chart.container(stage).draw();
 * @param {function():(acgraph.vector.ColoredFill|acgraph.vector.Stroke)=} opt_fillFunction [function() {
 *  return anychart.color.darken(this.sourceColor);
 * }] Function that looks like <code>function(){
 *    // this.sourceColor -  color returned by fill() getter.
 *    return fillValue; // type acgraph.vector.Fill
 * }</code>.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * Setter for stroke settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}
 * @example
 * var chart = anychart.sparkLine([1, 4, 7, 1]);
 * chart.type('line');
 * chart.stroke('orange', 3, '5 2', 'round');
 * chart.container(stage).draw();
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|Function|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|Function|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.charts.Sparkline|acgraph.vector.Stroke|Function} .
 */
anychart.charts.Sparkline.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = goog.isFunction(opt_strokeOrFill) ?
        opt_strokeOrFill :
        acgraph.vector.normalizeStroke.apply(null, arguments);
    if (stroke != this.stroke_) {
      this.stroke_ = stroke;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.stroke_ || this.seriesDefaults_['stroke'];
};


/**
 * Method that gets final line color for the current point, with all fallbacks taken into account.
 * @return {!acgraph.vector.Stroke} Final stroke for the current row.
 */
anychart.charts.Sparkline.prototype.getFinalStroke = function() {
  return acgraph.vector.normalizeStroke(/** @type {!acgraph.vector.Stroke} */(this.normalizeColor(/** @type {!acgraph.vector.Stroke} */(this.stroke()))));
};


// Fill and stroke settings are located here, but you should export them ONLY in series themselves.
/**
 * Gets final normalized pattern/hatch fill.
 * @param {acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|string|boolean} hatchFill Normal state hatch fill.
 * @return {acgraph.vector.HatchFill|acgraph.vector.PatternFill} Normalized hatch fill.
 */
anychart.charts.Sparkline.prototype.normalizeHatchFill = function(hatchFill) {
  var fill;
  var index = this.getIterator().getIndex();
  if (goog.isFunction(hatchFill)) {
    var sourceHatchFill = acgraph.vector.normalizeHatchFill(anychart.charts.Sparkline.DEFAULT_HATCH_FILL_TYPE);
    var scope = {
      'index': index,
      'sourceHatchFill': sourceHatchFill,
      'iterator': this.getIterator()
    };
    fill = acgraph.vector.normalizeHatchFill(hatchFill.call(scope));
  } else if (goog.isBoolean(hatchFill)) {
    fill = hatchFill ? acgraph.vector.normalizeHatchFill(anychart.charts.Sparkline.DEFAULT_HATCH_FILL_TYPE) : null;
  } else
    fill = acgraph.vector.normalizeHatchFill(hatchFill);
  return fill;
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.hatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.hatchFill_) {
      this.hatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return goog.isDef(this.hatchFill_) ? this.hatchFill_ : this.seriesDefaults_['hatchFill'];
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.negativeHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.negativeHatchFill_) {
      this.negativeHatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return goog.isDef(this.negativeHatchFill_) ? this.negativeHatchFill_ : this.seriesDefaults_['negativeHatchFill'];
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.firstHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.firstHatchFill_) {
      this.firstHatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.firstHatchFill_ || this.seriesDefaults_['firstHatchFill'];
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.lastHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.lastHatchFill_) {
      this.lastHatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.lastHatchFill_ || this.seriesDefaults_['lastHatchFill'];
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.maxHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.maxHatchFill_) {
      this.maxHatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.maxHatchFill_ || this.seriesDefaults_['maxHatchFill'];
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * var chart = anychart.column();
 * chart.column([0.3, 3, 2.2, 1.7]).hatchFill('diamiond', 'grey', 5, 5);
 * chart.container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type or state of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.charts.Sparkline|Function|boolean} Hatch fill.
 */
anychart.charts.Sparkline.prototype.minHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.minHatchFill_) {
      this.minHatchFill_ = hatchFill;
      if (this.series_)
        this.series_.invalidate(anychart.ConsistencyState.SERIES_HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.minHatchFill_ || this.seriesDefaults_['minHatchFill'];
};


/**
 * Method that gets the final hatch fill for a current point, with all fallbacks taken into account.
 * @param {boolean} usePointSettings If point settings should count too (iterator questioning).
 * @return {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} Final hatch fill for the current row.
 */
anychart.charts.Sparkline.prototype.getFinalHatchFill = function(usePointSettings) {
  var iterator = this.getIterator();
  var val = /** @type {number} */ (iterator.get('value'));
  var index = iterator.getIndex();

  var finalHatchFill;
  if (usePointSettings && goog.isDef(iterator.get('hatchFill'))) {
    //user settings defined
    finalHatchFill = iterator.get('hatchFill');
  } else if (index == iterator.getRowsCount() - 1 && goog.isDef(this.lastHatchFill())) {
    //last point
    finalHatchFill = this.lastHatchFill();
  } else if (index == 0 && goog.isDef(this.firstHatchFill())) {
    //first point
    finalHatchFill = this.firstHatchFill();
  } else if (val == this.statistics('max') && goog.isDef(this.maxHatchFill())) {
    //point have max value
    finalHatchFill = this.maxHatchFill();
  } else if (val == this.statistics('min') && goog.isDef(this.minHatchFill())) {
    //point have min value
    finalHatchFill = this.minHatchFill();
  } else if (val < 0 && goog.isDef(this.negativeHatchFill())) {
    //point have negative value
    finalHatchFill = this.negativeHatchFill();
  } else {
    //another case
    finalHatchFill = this.hatchFill();
  }

  return /** @type {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} */(
      this.normalizeHatchFill(
          /** @type {acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|string} */(finalHatchFill)));
};


/**
 * Merge factory settings.
 * @param {Array.<anychart.core.ui.MarkersFactory|anychart.core.ui.MarkersFactory.Marker|
 * anychart.core.ui.LabelsFactory|anychart.core.ui.LabelsFactory.Label|Object>} settings Array of marker settings.
 * @param {Array.<string>} fields Entries fields to merge.
 * @return {Object} Object with merged settings.
 * @private
 */
anychart.charts.Sparkline.prototype.mergeFactorySettings_ = function(settings, fields) {
  var res = {};

  var isDefinedEnabledState = false;
  for (var i = settings.length; i--;) {
    var setting = settings[i];
    if (setting) {
      var isJson = !(setting instanceof anychart.core.VisualBase);
      var enabled = isJson ? setting['enabled'] : setting['enabled']();
      if (!isDefinedEnabledState) isDefinedEnabledState = goog.isBoolean(enabled);
      if (enabled || (!isDefinedEnabledState && !goog.isBoolean(enabled))) {
        for (var j = 0, fieldsCount = fields.length; j < fieldsCount; j++) {
          var field = fields[j];
          var value = isJson ? setting[field] : setting[field]();
          if (goog.isDef(value))
            res[field] = value instanceof anychart.core.Base ? value.serialize() : value;
        }
      }
    }
  }

  return res;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Markers.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for data markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.markers().size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Markers instance.
 *//**
 * Setter for series data markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.markers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.markers = function(opt_value) {
  if (!this.markers_) {
    this.markers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.markers_);
    this.markers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.markers_.setup(opt_value);
    return this;
  }
  return this.markers_;
};


/**
 * Getter for data negative markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.negativeMarkers().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Marker instance.
 *//**
 * Setter for data negative markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.negativeMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data negative markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data negative markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.negativeMarkers = function(opt_value) {
  if (!this.negativeMarkers_) {
    this.negativeMarkers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.negativeMarkers_);
    this.negativeMarkers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.negativeMarkers_.setup(opt_value);
    return this;
  }
  return this.negativeMarkers_;
};


/**
 * Getter for data first markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.firstMarkers().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Marker instance.
 *//**
 * Setter for data first markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.firstMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data first markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data first markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.firstMarkers = function(opt_value) {
  if (!this.firstMarkers_) {
    this.firstMarkers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.firstMarkers_);
    this.firstMarkers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.firstMarkers_.setup(opt_value);
    return this;
  }
  return this.firstMarkers_;
};


/**
 * Getter for data last markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.lastMarkers().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Marker instance.
 *//**
 * Setter for data last markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.lastMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data last markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data last markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.lastMarkers = function(opt_value) {
  if (!this.lastMarkers_) {
    this.lastMarkers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.lastMarkers_);
    this.lastMarkers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.lastMarkers_.setup(opt_value);
    return this;
  }
  return this.lastMarkers_;
};


/**
 * Getter for data max markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.maxMarkers().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Marker instance.
 *//**
 * Setter for data max markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.maxMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data max markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data max markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.maxMarkers = function(opt_value) {
  if (!this.maxMarkers_) {
    this.maxMarkers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.maxMarkers_);
    this.maxMarkers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.maxMarkers_.setup(opt_value);
    return this;
  }
  return this.maxMarkers_;
};


/**
 * Getter for data min markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.minMarkers().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory.Marker} Marker instance.
 *//**
 * Setter for data min markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.minMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data min markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data min markers settings.
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.minMarkers = function(opt_value) {
  if (!this.minMarkers_) {
    this.minMarkers_ = new anychart.core.ui.MarkersFactory.Marker();
    this.registerDisposable(this.minMarkers_);
    this.minMarkers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.minMarkers_.setup(opt_value);
    return this;
  }
  return this.minMarkers_;
};


/**
 * Returns markers factory.
 * @return {!anychart.core.ui.MarkersFactory}
 */
anychart.charts.Sparkline.prototype.getMarkersInternal = function() {
  return this.markersInternal_;
};


/**
 * Method that gets final marker for the current point, with all fallbacks taken into account.
 * @param {boolean} usePointSettings If point settings should count too (iterator questioning).
 * @return {?anychart.core.ui.MarkersFactory.Marker} .
 */
anychart.charts.Sparkline.prototype.getFinalMarker = function(usePointSettings) {
  var iterator = this.getIterator();
  var val = /** @type {number} */ (iterator.get('value'));
  var index = iterator.getIndex();

  var customMarker;
  if (usePointSettings) {
    //user settings defined
    customMarker = iterator.get('marker');
  }

  var firstOrLastMarkers;
  var defaultFirstOrLastMarkers;
  if (index == iterator.getRowsCount() - 1) {
    //last point
    firstOrLastMarkers = this.lastMarkers();
    defaultFirstOrLastMarkers = this.seriesDefaults_['lastMarkers'];
  } else if (index == 0) {
    //first point
    firstOrLastMarkers = this.firstMarkers();
    defaultFirstOrLastMarkers = this.seriesDefaults_['firstMarkers'];
  }

  var maxOrMinMarkers;
  var defaultMaxOrMinMarkers;
  if (val == this.statistics('max')) {
    //point have max value
    maxOrMinMarkers = this.maxMarkers();
    defaultMaxOrMinMarkers = this.seriesDefaults_['maxMarkers'];
  } else if (val == this.statistics('min')) {
    //point have min value
    maxOrMinMarkers = this.minMarkers();
    defaultMaxOrMinMarkers = this.seriesDefaults_['minMarkers'];
  }

  var negativeMarkers;
  var defaultNegativeMarkers;
  if (val < 0) {
    //point have negative value
    negativeMarkers = this.negativeMarkers();
    defaultNegativeMarkers = this.seriesDefaults_['negativeMarkers'];
  }

  //another case
  var markers = this.markers();
  var defaultMarkers = this.seriesDefaults_['markers'];

  var autoFill = this.getFinalFill(true);
  var autoColor = {'fill': autoFill, 'stroke': anychart.color.darken(autoFill)};

  var defaultSettings = [defaultFirstOrLastMarkers, defaultMaxOrMinMarkers, defaultNegativeMarkers, defaultMarkers];
  var finalDefaultMarkers = this.mergeFactorySettings_(defaultSettings, anychart.charts.Sparkline.MARKERS_FIELD_NAMES_FOR_MERGE_);

  var settings = [customMarker, firstOrLastMarkers, maxOrMinMarkers, negativeMarkers, markers, autoColor, finalDefaultMarkers];
  var finalSettings = this.mergeFactorySettings_(settings, anychart.charts.Sparkline.MARKERS_FIELD_NAMES_FOR_MERGE_);

  var marker = this.markersInternal_.getMarker(index);
  var res = null;
  if (finalSettings['enabled']) {
    var position = finalSettings['position'] || this.markersInternal_.position();
    var positionProvider = this.series_.createPositionProvider(/** @type {anychart.enums.Position|string} */(position));

    if (marker) {
      marker.positionProvider(positionProvider);
    } else {
      marker = this.markersInternal_.add(positionProvider, index);
    }

    marker.resetSettings();
    marker.currentMarkersFactory(this.markersInternal_);
    marker.setSettings(/** @type {Object} */(finalSettings));
    res = marker;
  } else if (marker) {
    marker.clear();
  }

  return res;
};


/**
 * Listener for markers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.charts.Sparkline.prototype.markersInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    if (this.series_) this.series_.invalidate(anychart.ConsistencyState.SERIES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Labels.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for data markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.markers().size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Markers instance.
 *//**
 * Setter for series data markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.markers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.labels_);
    this.labels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.labels_.setup(opt_value);
    return this;
  }
  return this.labels_;
};


/**
 * Getter for data negative labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.negativeLabels().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Marker instance.
 *//**
 * Setter for data negative labels.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.negativeMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data negative labels settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data negative labels settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.negativeLabels = function(opt_value) {
  if (!this.negativeLabels_) {
    this.negativeLabels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.negativeLabels_);
    this.negativeLabels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.negativeLabels_.setup(opt_value);
    return this;
  }
  return this.negativeLabels_;
};


/**
 * Getter for data first labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.firstLabels().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Marker instance.
 *//**
 * Setter for data first labels.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.firstMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data first labels settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data first labels settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.firstLabels = function(opt_value) {
  if (!this.firstLabels_) {
    this.firstLabels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.firstLabels_);
    this.firstLabels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.firstLabels_.setup(opt_value);
    return this;
  }
  return this.firstLabels_;
};


/**
 * Getter for data last labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.lastLabels().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Marker instance.
 *//**
 * Setter for data last labels.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.lastMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data last labels settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data last labels settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.lastLabels = function(opt_value) {
  if (!this.lastLabels_) {
    this.lastLabels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.lastLabels_);
    this.lastLabels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.lastLabels_.setup(opt_value);
    return this;
  }
  return this.lastLabels_;
};


/**
 * Getter for data max labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.maxLabels().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Marker instance.
 *//**
 * Setter for data max labels.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.maxMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data max labels settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data max labels settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.maxLabels = function(opt_value) {
  if (!this.maxLabels_) {
    this.maxLabels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.maxLabels_);
    this.maxLabels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.maxLabels_.setup(opt_value);
    return this;
  }
  return this.maxLabels_;
};


/**
 * Getter for data min labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.minLabels().enabled(true).size(10);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.LabelsFactory.Label} Marker instance.
 *//**
 * Setter for data min labels.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off labels.
 * @example
 * var chart = anychart.sparkLine([1, 1.4, 1.2, 2]);
 * chart.minMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Data min labels settings.
 * @return {!anychart.charts.Sparkline} {@link anychart.charts.Sparkline} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Data min labels settings.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.charts.Sparkline)} Markers instance or itself for chaining call.
 */
anychart.charts.Sparkline.prototype.minLabels = function(opt_value) {
  if (!this.minLabels_) {
    this.minLabels_ = new anychart.core.ui.LabelsFactory.Label();
    this.registerDisposable(this.minLabels_);
    this.minLabels_.listenSignals(this.labelsInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.minLabels_.setup(opt_value);
    return this;
  }
  return this.minLabels_;
};


/**
 * Returns labels factory.
 * @return {!anychart.core.ui.LabelsFactory}
 */
anychart.charts.Sparkline.prototype.getLabelsInternal = function() {
  return this.labelsInternal_;
};


/**
 * Method that gets final label for the current point, with all fallbacks taken into account.
 * @param {boolean} usePointSettings If point settings should count too (iterator questioning).
 * @return {?anychart.core.ui.LabelsFactory.Label} .
 */
anychart.charts.Sparkline.prototype.getFinalLabel = function(usePointSettings) {
  var iterator = this.getIterator();
  var val = /** @type {number} */ (iterator.get('value'));
  var index = iterator.getIndex();

  var customLabel;
  if (usePointSettings) {
    //user settings defined
    customLabel = iterator.get('label');
  }

  var firstOrLastLabels;
  var defaultFirstOrLastLabels;
  if (index == iterator.getRowsCount() - 1) {
    //last point
    firstOrLastLabels = this.lastLabels();
    defaultFirstOrLastLabels = this.seriesDefaults_['lastLabels'];
  } else if (index == 0) {
    //first point
    firstOrLastLabels = this.firstLabels();
    defaultFirstOrLastLabels = this.seriesDefaults_['firstLabels'];
  }

  var maxOrMinLabels;
  var defaultMaxOrMinLabels;
  if (val == this.statistics('max')) {
    //point have max value
    maxOrMinLabels = this.maxLabels();
    defaultMaxOrMinLabels = this.seriesDefaults_['maxLabels'];
  } else if (val == this.statistics('min')) {
    //point have min value
    maxOrMinLabels = this.minLabels();
    defaultMaxOrMinLabels = this.seriesDefaults_['minLabels'];
  }

  var negativeLabels;
  var defaultNegativeLabels;
  if (val < 0) {
    //point have negative value
    negativeLabels = this.negativeLabels();
    defaultNegativeLabels = this.seriesDefaults_['negativeLabels'];
  }

  //another case
  var labels = this.labels();
  var defaultLabels = this.seriesDefaults_['labels'];

  var defaultSettings = [defaultFirstOrLastLabels, defaultMaxOrMinLabels, defaultNegativeLabels, defaultLabels];
  var finalDefaultLabels = this.mergeFactorySettings_(defaultSettings, anychart.charts.Sparkline.LABELS_FIELD_NAMES_FOR_MERGE_);

  var settings = [customLabel, firstOrLastLabels, maxOrMinLabels, negativeLabels, labels, finalDefaultLabels];
  var finalSettings = this.mergeFactorySettings_(settings, anychart.charts.Sparkline.LABELS_FIELD_NAMES_FOR_MERGE_);

  var label = this.labelsInternal_.getLabel(index);
  var res = null;
  if (finalSettings['enabled']) {
    var position = finalSettings['position'] || this.labelsInternal_.position();
    var positionProvider = this.series_.createPositionProvider(/** @type {anychart.enums.Position|string} */(position));
    var formatProvider = this.series_.createFormatProvider();

    if (label) {
      label.formatProvider(formatProvider);
      label.positionProvider(positionProvider);
    } else {
      label = this.labelsInternal_.add(formatProvider, positionProvider, index);
    }

    label.resetSettings();
    label.currentLabelsFactory(this.labelsInternal_);
    label.setSettings(/** @type {Object} */(finalSettings));
    res = label;
  } else if (label) {
    label.clear();
  }
  return res;
};


/**
 * Listener for markers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.charts.Sparkline.prototype.labelsInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    if (this.series_) this.series_.invalidate(anychart.ConsistencyState.SERIES_LABELS, anychart.Signal.NEEDS_REDRAW);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Calculation.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Calculate sparkline chart properties.
 */
anychart.charts.Sparkline.prototype.calculate = function() {
  /** @type {anychart.data.Iterator} */
  var iterator;
  /** @type {*} */
  var value;

  if (this.hasInvalidationState(anychart.ConsistencyState.SPARK_SCALES)) {
    var x, y;
    var xScale = /** @type {anychart.scales.Base} */ (this.xScale());
    var yScale = /** @type {anychart.scales.Base} */ (this.yScale());
    if (xScale.needsAutoCalc()) xScale.startAutoCalc();
    if (yScale.needsAutoCalc()) yScale.startAutoCalc();

    iterator = this.getResetIterator();

    while (iterator.advance()) {
      x = iterator.get('x');
      y = iterator.get('value');
      if (goog.isDef(x))
        xScale.extendDataRange(x);
      if (goog.isDef(y))
        yScale.extendDataRange(y);
    }

    var scalesChanged = false;
    if (xScale.needsAutoCalc()) scalesChanged |= xScale.finishAutoCalc();
    if (yScale.needsAutoCalc()) scalesChanged |= yScale.finishAutoCalc();

    if (scalesChanged)
      this.invalidateSeries_();

    //calc statistics
    var seriesMax = -Infinity;
    var seriesMin = Infinity;
    var seriesSum = 0;
    var seriesPointsCount = 0;

    iterator = this.getResetIterator();

    while (iterator.advance()) {
      value = this.getReferenceScaleValues();
      if (value) {
        y = anychart.utils.toNumber(value);
        if (!isNaN(y)) {
          seriesMax = Math.max(seriesMax, y);
          seriesMin = Math.min(seriesMin, y);
          seriesSum += y;
        }
      }
      seriesPointsCount++;
    }
    var seriesAverage = seriesSum / seriesPointsCount;

    this.statistics('max', seriesMax);
    this.statistics('min', seriesMin);
    this.statistics('sum', seriesSum);
    this.statistics('average', seriesAverage);
    this.statistics('pointsCount', seriesPointsCount);

    this.markConsistent(anychart.ConsistencyState.SPARK_SCALES);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Draw sparkline chart content items.
 * @param {anychart.math.Rect} bounds Bounds of sparkline content area.
 */
anychart.charts.Sparkline.prototype.drawContent = function(bounds) {
  if (this.hasInvalidationState(anychart.ConsistencyState.SPARK_SERIES)) {
    if (!this.series_)
      this.series_ = this.createSeriesByType_(this.type_);
  }

  this.calculate();
  if (this.isConsistent())
    return;

  anychart.core.Base.suspendSignalsDispatching(this.series_);

  //calculate axes space first, the result is data bounds
  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    //bounds of data area
    this.dataBounds_ = bounds.clone().round();
    if (this.series_.isWidthBased())
      this.series_.fixBounds(this.dataBounds_);

    this.invalidateSeries_();
    this.invalidate(anychart.ConsistencyState.SPARK_AXES_MARKERS |
        anychart.ConsistencyState.SPARK_SERIES);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SPARK_AXES_MARKERS)) {
    var markers = goog.array.concat(
        this.lineAxesMarkers_,
        this.rangeAxesMarkers_,
        this.textAxesMarkers_);

    for (var i = 0, count = markers.length; i < count; i++) {
      var axesMarker = markers[i];
      if (axesMarker) {
        axesMarker.suspendSignalsDispatching();
        if (axesMarker.isHorizontal()) {
          axesMarker.scale(/** @type {anychart.scales.Base} */(this.yScale()));
        } else {
          axesMarker.scale(/** @type {anychart.scales.Base} */(this.xScale()));
        }
        axesMarker.parentBounds(this.dataBounds_);
        axesMarker.container(this.rootElement);
        axesMarker.draw();
        axesMarker.resumeSignalsDispatching(false);
      }
    }
    this.markConsistent(anychart.ConsistencyState.SPARK_AXES_MARKERS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SPARK_SERIES)) {
    var series = this.series_;
    if (series) {
      series.container(this.rootElement);
      series.parentBounds(this.dataBounds_);

      this.series_.startDrawing();

      var iterator = this.getResetIterator();
      while (iterator.advance()) {
        this.series_.drawPoint();
      }

      this.series_.finalizeDrawing();
    }
    this.markConsistent(anychart.ConsistencyState.SPARK_SERIES);
  }

  anychart.core.Base.resumeSignalsDispatchingFalse(this.series_);
};


/**
 * Invalidates APPEARANCE for all width-based series.
 * @private
 */
anychart.charts.Sparkline.prototype.invalidateWidthBasedSeries_ = function() {
  if (this.series_ && this.series_.isWidthBased())
    this.series_.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.SERIES_HATCH_FILL);
};


/**
 * Invalidates APPEARANCE for all width-based series.
 * @private
 */
anychart.charts.Sparkline.prototype.invalidateSeries_ = function() {
  if (this.series_)
    this.series_.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.SERIES_HATCH_FILL);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Defaults.
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.charts.Sparkline.prototype.restoreDefaults = function() {
  this.title().enabled(false);
  this.background().enabled(false);
  this.margin(0);
  this.padding(0);

  this.pointWidth('95%');

  this.markers(null);
  this.maxMarkers().fill('red');
  this.minMarkers().fill('blue');

  this.labels().enabled(false).background().enabled(false);
  this.negativeLabels().enabled(false).background().enabled(false);
  this.firstLabels().enabled(false).background().enabled(false);
  this.lastLabels().enabled(false).background().enabled(false);
  this.minLabels().enabled(false).background().enabled(false);
  this.maxLabels().enabled(false).background().enabled(false);

  this.hatchFill(null);
};


/** @inheritDoc */
anychart.charts.Sparkline.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);

  var i, json, scale;
  var lineAxesMarkers = config['lineAxesMarkers'];
  var rangeAxesMarkers = config['rangeAxesMarkers'];
  var textAxesMarkers = config['textAxesMarkers'];
  var scales = config['scales'];

  this.data(config['data']);

  this.type(config['seriesType']);
  this.clip(config['clip']);
  this.data(config['data']);
  this.connectMissingPoints(config['connectMissingPoints']);
  this.pointWidth(config['pointWidth']);

  var scalesInstances = {};
  if (goog.isObject(scales)) {
    for (i in scales) {
      if (!scales.hasOwnProperty(i)) continue;
      json = scales[i];
      if (goog.isString(json)) {
        scale = anychart.scales.Base.fromString(json, false);
      } else {
        scale = anychart.scales.Base.fromString(json['type'], false);
        scale.setup(json);
      }
      scalesInstances[i] = scale;
    }
  }

  json = config['xScale'];
  if (goog.isNumber(json)) {
    scale = scalesInstances[json];
  } else if (goog.isString(json)) {
    scale = anychart.scales.Base.fromString(json, null);
    if (!scale)
      scale = scalesInstances[json];
  } else if (goog.isObject(json)) {
    scale = anychart.scales.Base.fromString(json['type'], true);
    scale.setup(json);
  } else {
    scale = null;
  }
  if (scale)
    this.xScale(scale);

  json = config['yScale'];
  if (goog.isNumber(json)) {
    scale = scalesInstances[json];
  } else if (goog.isString(json)) {
    scale = anychart.scales.Base.fromString(json, null);
    if (!scale)
      scale = scalesInstances[json];
  } else if (goog.isObject(json)) {
    scale = anychart.scales.Base.fromString(json['type'], false);
    scale.setup(json);
  } else {
    scale = null;
  }
  if (scale)
    this.yScale(scale);

  if (goog.isArray(lineAxesMarkers)) {
    for (i = 0; i < lineAxesMarkers.length; i++) {
      json = lineAxesMarkers[i];
      this.lineMarker(i, json);
      if (goog.isObject(json) && 'scale' in json) this.lineMarker(i).scale(scalesInstances[json['scale']]);
    }
  }

  if (goog.isArray(rangeAxesMarkers)) {
    for (i = 0; i < rangeAxesMarkers.length; i++) {
      json = rangeAxesMarkers[i];
      this.rangeMarker(i, json);
      if (goog.isObject(json) && 'scale' in json) this.rangeMarker(i).scale(scalesInstances[json['scale']]);
    }
  }

  if (goog.isArray(textAxesMarkers)) {
    for (i = 0; i < textAxesMarkers.length; i++) {
      json = textAxesMarkers[i];
      this.textMarker(i, json);
      if (goog.isObject(json) && 'scale' in json) this.textMarker(i).scale(scalesInstances[json['scale']]);
    }
  }

  this.stroke(config['stroke']);

  this.lastFill(config['lastFill']);
  this.firstFill(config['firstFill']);
  this.maxFill(config['maxFill']);
  this.minFill(config['minFill']);
  this.negativeFill(config['negativeFill']);
  this.fill(config['fill']);

  this.lastHatchFill(config['lastHatchFill']);
  this.firstHatchFill(config['firstHatchFill']);
  this.maxHatchFill(config['maxHatchFill']);
  this.minHatchFill(config['minHatchFill']);
  this.negativeHatchFill(config['negativeHatchFill']);
  this.hatchFill(config['hatchFill']);

  if (config['lastMarkers']) this.lastMarkers().setupByJSON(config['lastMarkers']);
  if (config['firstMarkers']) this.firstMarkers().setupByJSON(config['firstMarkers']);
  if (config['maxMarkers']) this.maxMarkers().setupByJSON(config['maxMarkers']);
  if (config['minMarkers']) this.minMarkers().setupByJSON(config['minMarkers']);
  if (config['negativeMarkers']) this.negativeMarkers().setupByJSON(config['negativeMarkers']);
  if (config['markers']) this.markers().setupByJSON(config['markers']);

  if (config['firstLabels']) this.firstLabels().setupByJSON(config['firstLabels']);
  if (config['lastLabels']) this.lastLabels().setupByJSON(config['lastLabels']);
  if (config['maxLabels']) this.maxLabels().setupByJSON(config['maxLabels']);
  if (config['minLabels']) this.minLabels().setupByJSON(config['minLabels']);
  if (config['negativeLabels']) this.negativeLabels().setupByJSON(config['negativeLabels']);
  if (config['labels']) this.labels().setupByJSON(config['labels']);
};


/**
 * @inheritDoc
 */
anychart.charts.Sparkline.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  var i;
  var scalesIds = {};
  var scales = [];
  var scale;
  var config;
  var objId;

  scalesIds[goog.getUid(this.xScale())] = this.xScale().serialize();
  scales.push(scalesIds[goog.getUid(this.xScale())]);
  json['xScale'] = scales.length - 1;
  if (this.xScale() != this.yScale()) {
    scalesIds[goog.getUid(this.yScale())] = this.yScale().serialize();
    scales.push(scalesIds[goog.getUid(this.yScale())]);
  }
  json['yScale'] = scales.length - 1;
  json['type'] = anychart.enums.ChartTypes.SPARKLINE;

  json['seriesType'] = this.type();
  json['clip'] = (this.clip_ instanceof anychart.math.Rect) ? this.clip_.serialize() : this.clip_;
  json['data'] = this.data().serialize();
  json['connectMissingPoints'] = this.connectMissingPoints();
  json['pointWidth'] = this.pointWidth();


  if (goog.isFunction(this['lastFill'])) {
    if (goog.isFunction(this.lastFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series last fill']);
    } else if (goog.isDef(this.lastFill())) {
      json['lastFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.lastFill()));
    }
  }
  if (goog.isFunction(this['lastHatchFill'])) {
    if (goog.isFunction(this.lastHatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series last hatch fill']);
    } else if (goog.isDef(this.lastHatchFill())) {
      json['lastHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.lastHatchFill()));
    }
  }
  json['lastMarkers'] = this.lastMarkers().serialize();
  json['lastLabels'] = this.lastLabels().serialize();
  if (goog.isFunction(this['firstFill'])) {
    if (goog.isFunction(this.firstFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series first fill']);
    } else if (goog.isDef(this.lastHatchFill())) {
      json['firstFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.lastHatchFill()));
    }
  }
  if (goog.isFunction(this['firstHatchFill'])) {
    if (goog.isFunction(this.firstHatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series first hatch fill']);
    } else if (goog.isDef(this.firstHatchFill())) {
      json['firstHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.firstHatchFill()));
    }
  }
  json['firstMarkers'] = this.firstMarkers().serialize();
  json['firstLabels'] = this.firstLabels().serialize();
  if (goog.isFunction(this['maxFill'])) {
    if (goog.isFunction(this.maxFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series max fill']);
    } else if (goog.isDef(this.maxFill())) {
      json['maxFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.maxFill()));
    }
  }
  if (goog.isFunction(this['maxHatchFill'])) {
    if (goog.isFunction(this.maxHatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series max hatch fill']);
    } else if (goog.isDef(this.maxHatchFill())) {
      json['maxHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.maxHatchFill()));
    }
  }
  json['maxMarkers'] = this.maxMarkers().serialize();
  json['maxLabels'] = this.maxLabels().serialize();
  if (goog.isFunction(this['minFill'])) {
    if (goog.isFunction(this.minFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series min fill']);
    } else if (goog.isDef(this.minFill())) {
      json['minFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.minFill()));
    }
  }
  if (goog.isFunction(this['minHatchFill'])) {
    if (goog.isFunction(this.minHatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series min hatch fill']);
    } else if (goog.isDef(this.minHatchFill())) {
      json['minHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.minHatchFill()));
    }
  }
  json['minMarkers'] = this.minMarkers().serialize();
  json['minLabels'] = this.minLabels().serialize();
  if (goog.isFunction(this['negativeFill'])) {
    if (goog.isFunction(this.negativeFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series negative fill']);
    } else if (goog.isDef(this.negativeFill())) {
      json['negativeFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.negativeFill()));
    }
  }
  if (goog.isFunction(this['negativeHatchFill'])) {
    if (goog.isFunction(this.negativeHatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series negative hatch fill']);
    } else if (goog.isDef(this.negativeHatchFill())) {
      json['negativeHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.negativeHatchFill()));
    }
  }
  json['negativeMarkers'] = this.negativeMarkers().serialize();
  json['negativeLabels'] = this.negativeLabels().serialize();
  if (goog.isFunction(this['fill'])) {
    if (goog.isFunction(this.fill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series fill']);
    } else if (goog.isDef(this.fill())) {
      json['fill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.fill()));
    }
  }
  if (goog.isFunction(this['hatchFill'])) {
    if (goog.isFunction(this.hatchFill())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series hatch fill']);
    } else if (goog.isDef(this.hatchFill())) {
      json['hatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hatchFill()));
    }
  }
  json['markers'] = this.markers().serialize();
  json['labels'] = this.labels().serialize();
  if (goog.isFunction(this['stroke'])) {
    if (goog.isFunction(this.stroke())) {
      anychart.utils.warning(anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION, null, ['Series stroke']);
    } else if (goog.isDef(this.stroke())) {
      json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke}*/(this.stroke()));
    }
  }

  var lineAxesMarkers = [];
  for (i = 0; i < this.lineAxesMarkers_.length; i++) {
    var lineAxesMarker = this.lineAxesMarkers_[i];
    config = lineAxesMarker.serialize();
    scale = lineAxesMarker.scale();
    if (scale) {
      objId = goog.getUid(scale);
      if (!scalesIds[objId]) {
        scalesIds[objId] = scale.serialize();
        scales.push(scalesIds[objId]);
        config['scale'] = scales.length - 1;
      } else {
        config['scale'] = goog.array.indexOf(scales, scalesIds[objId]);
      }
    }
    lineAxesMarkers.push(config);
  }
  json['lineAxesMarkers'] = lineAxesMarkers;

  var rangeAxesMarkers = [];
  for (i = 0; i < this.rangeAxesMarkers_.length; i++) {
    var rangeAxesMarker = this.rangeAxesMarkers_[i];
    config = rangeAxesMarker.serialize();
    scale = rangeAxesMarker.scale();
    if (scale) {
      objId = goog.getUid(scale);
      if (!scalesIds[objId]) {
        scalesIds[objId] = scale.serialize();
        scales.push(scalesIds[objId]);
        config['scale'] = scales.length - 1;
      } else {
        config['scale'] = goog.array.indexOf(scales, scalesIds[objId]);
      }
    }
    rangeAxesMarkers.push(config);
  }
  json['rangeAxesMarkers'] = rangeAxesMarkers;

  var textAxesMarkers = [];
  for (i = 0; i < this.textAxesMarkers_.length; i++) {
    var textAxesMarker = this.textAxesMarkers_[i];
    config = textAxesMarker.serialize();
    scale = textAxesMarker.scale();
    if (scale) {
      objId = goog.getUid(scale);
      if (!scalesIds[objId]) {
        scalesIds[objId] = scale.serialize();
        scales.push(scalesIds[objId]);
        config['scale'] = scales.length - 1;
      } else {
        config['scale'] = goog.array.indexOf(scales, scalesIds[objId]);
      }
    }
    textAxesMarkers.push(config);
  }
  json['textAxesMarkers'] = textAxesMarkers;

  json['scales'] = scales;
  return {'chart': json};
};


anychart.chartTypesMap[anychart.enums.ChartTypes.SPARKLINE] = anychart.sparkline;


//exports
goog.exportSymbol('anychart.sparkline', anychart.sparkline);
anychart.charts.Sparkline.prototype['xScale'] = anychart.charts.Sparkline.prototype.xScale;
anychart.charts.Sparkline.prototype['yScale'] = anychart.charts.Sparkline.prototype.yScale;

anychart.charts.Sparkline.prototype['lineMarker'] = anychart.charts.Sparkline.prototype.lineMarker;
anychart.charts.Sparkline.prototype['rangeMarker'] = anychart.charts.Sparkline.prototype.rangeMarker;
anychart.charts.Sparkline.prototype['textMarker'] = anychart.charts.Sparkline.prototype.textMarker;

anychart.charts.Sparkline.prototype['type'] = anychart.charts.Sparkline.prototype.type;
anychart.charts.Sparkline.prototype['data'] = anychart.charts.Sparkline.prototype.data;
anychart.charts.Sparkline.prototype['clip'] = anychart.charts.Sparkline.prototype.clip;

anychart.charts.Sparkline.prototype['connectMissingPoints'] = anychart.charts.Sparkline.prototype.connectMissingPoints;
anychart.charts.Sparkline.prototype['pointWidth'] = anychart.charts.Sparkline.prototype.pointWidth;

anychart.charts.Sparkline.prototype['lastFill'] = anychart.charts.Sparkline.prototype.lastFill;
anychart.charts.Sparkline.prototype['lastHatchFill'] = anychart.charts.Sparkline.prototype.lastHatchFill;
anychart.charts.Sparkline.prototype['lastMarkers'] = anychart.charts.Sparkline.prototype.lastMarkers;
anychart.charts.Sparkline.prototype['lastLabels'] = anychart.charts.Sparkline.prototype.lastLabels;

anychart.charts.Sparkline.prototype['firstFill'] = anychart.charts.Sparkline.prototype.firstFill;
anychart.charts.Sparkline.prototype['firstHatchFill'] = anychart.charts.Sparkline.prototype.firstHatchFill;
anychart.charts.Sparkline.prototype['firstMarkers'] = anychart.charts.Sparkline.prototype.firstMarkers;
anychart.charts.Sparkline.prototype['firstLabels'] = anychart.charts.Sparkline.prototype.firstLabels;

anychart.charts.Sparkline.prototype['maxFill'] = anychart.charts.Sparkline.prototype.maxFill;
anychart.charts.Sparkline.prototype['maxHatchFill'] = anychart.charts.Sparkline.prototype.maxHatchFill;
anychart.charts.Sparkline.prototype['maxMarkers'] = anychart.charts.Sparkline.prototype.maxMarkers;
anychart.charts.Sparkline.prototype['maxLabels'] = anychart.charts.Sparkline.prototype.maxLabels;

anychart.charts.Sparkline.prototype['minFill'] = anychart.charts.Sparkline.prototype.minFill;
anychart.charts.Sparkline.prototype['minHatchFill'] = anychart.charts.Sparkline.prototype.minHatchFill;
anychart.charts.Sparkline.prototype['minMarkers'] = anychart.charts.Sparkline.prototype.minMarkers;
anychart.charts.Sparkline.prototype['minLabels'] = anychart.charts.Sparkline.prototype.minLabels;

anychart.charts.Sparkline.prototype['negativeFill'] = anychart.charts.Sparkline.prototype.negativeFill;
anychart.charts.Sparkline.prototype['negativeHatchFill'] = anychart.charts.Sparkline.prototype.negativeHatchFill;
anychart.charts.Sparkline.prototype['negativeMarkers'] = anychart.charts.Sparkline.prototype.negativeMarkers;
anychart.charts.Sparkline.prototype['negativeLabels'] = anychart.charts.Sparkline.prototype.negativeLabels;

anychart.charts.Sparkline.prototype['fill'] = anychart.charts.Sparkline.prototype.fill;
anychart.charts.Sparkline.prototype['hatchFill'] = anychart.charts.Sparkline.prototype.hatchFill;
anychart.charts.Sparkline.prototype['markers'] = anychart.charts.Sparkline.prototype.markers;
anychart.charts.Sparkline.prototype['labels'] = anychart.charts.Sparkline.prototype.labels;

anychart.charts.Sparkline.prototype['stroke'] = anychart.charts.Sparkline.prototype.stroke;

anychart.charts.Sparkline.prototype['getType'] = anychart.charts.Sparkline.prototype.getType;
