goog.provide('anychart.gauges.Circular');

goog.require('anychart'); // otherwise we can't use anychart.chartTypesMap object.
goog.require('anychart.core.Chart');
goog.require('anychart.core.axes.Circular');
goog.require('anychart.core.axisMarkers.CircularRange');
goog.require('anychart.core.gauge.Cap');
goog.require('anychart.core.gauge.pointers.Bar');
goog.require('anychart.core.gauge.pointers.Knob');
goog.require('anychart.core.gauge.pointers.Marker');
goog.require('anychart.core.gauge.pointers.Needle');
goog.require('anychart.core.ui.CircularLabel');

goog.require('anychart.scales');



/**
 * Circular gauge class.<br/>
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @extends {anychart.core.Chart}
 * @constructor
 */
anychart.gauges.Circular = function(opt_data, opt_csvSettings) {
  this.suspendSignalsDispatching();
  goog.base(this);

  /**
   * @type {!Array.<anychart.core.axes.Circular>}
   * @private
   */
  this.axes_ = [];

  /**
   * @type {!Array.<anychart.core.gauge.pointers.Bar>}
   * @private
   */
  this.bars_ = [];

  /**
   * @type {!Array.<anychart.core.gauge.pointers.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   * @type {!Array.<anychart.core.gauge.pointers.Needle>}
   * @private
   */
  this.needles_ = [];

  /**
   * @type {!Array.<anychart.core.gauge.pointers.Knob>}
   * @private
   */
  this.knobs_ = [];

  /**
   * @type {!Array.<anychart.core.axisMarkers.CircularRange>}
   * @private
   */
  this.ranges_ = [];

  /**
   * @type {number}
   * @private
   */
  this.pointerCounter_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.circularRangeCounter_ = 0;

  /**
   * @type {number}
   * @private
   */
  this.knobCounter_ = 0;

  this.data(opt_data || null, opt_csvSettings);
  this.resumeSignalsDispatching(true);
};
goog.inherits(anychart.gauges.Circular, anychart.core.Chart);


/**
 * Supported consistency states. Adds AXES, AXES_MARKERS, GRIDS to anychart.core.SeparateChart states.
 * @type {number}
 */
anychart.gauges.Circular.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Chart.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.GAUGE_POINTERS |
    anychart.ConsistencyState.GAUGE_CAP |
    anychart.ConsistencyState.GAUGE_AXES |
    anychart.ConsistencyState.GAUGE_SCALE |
    anychart.ConsistencyState.GAUGE_AXIS_MARKERS;


/**
 * Default hatch fill type.
 * @type {acgraph.vector.HatchFill.HatchFillType|string}
 */
anychart.gauges.Circular.DEFAULT_HATCH_FILL_TYPE = acgraph.vector.HatchFill.HatchFillType.DIAGONAL_BRICK;


/**
 * Default start angle.
 * @type {number}
 */
anychart.gauges.Circular.DEFAULT_START_ANGLE = -90;


/**
 * Z-index frame.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_FRAME = 1;


/**
 * Z-index axis.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_AXIS = 10;


/**
 * Z-index knob.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_KNOB = 20;


/**
 * Z-index circular range.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_CIRCULAR_RANGE = 30;


/**
 * Z-index pointer.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_POINTER = 40;


/**
 * Z-index cap.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_CAP = 50;


/**
 * Z-index multiplier.
 * @type {number}
 */
anychart.gauges.Circular.ZINDEX_MULTIPLIER = 0.0001;


/** @inheritDoc */
anychart.gauges.Circular.prototype.createChartLabel = function() {
  return new anychart.core.ui.CircularLabel();
};


/**
 * Data for gauge.
 * @param {?(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {(!anychart.gauges.Circular|!anychart.data.View)} Returns itself if used as a setter or the mapping if used as a getter.
 */
anychart.gauges.Circular.prototype.data = function(opt_value, opt_csvSettings) {
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

    this.invalidatePointerBounds();
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW |
        anychart.Signal.NEEDS_RECALCULATION);

    return this;
  }
  return this.data_;
};


/**
 * Listens to data invalidation.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.gauges.Circular.prototype.dataInvalidated_ = function(e) {
  if (e.hasSignal(anychart.Signal.DATA_CHANGED)) {
    this.invalidatePointerBounds();
    this.invalidate(
        anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW |
        anychart.Signal.NEEDS_RECALCULATION);
  }
};


/**
 * Gauge cap.
 * @param {(Object|boolean)=} opt_value .
 * @return {anychart.gauges.Circular|!anychart.core.gauge.Cap} .
 */
anychart.gauges.Circular.prototype.cap = function(opt_value) {
  if (!this.cap_) {
    this.cap_ = new anychart.core.gauge.Cap();
    this.cap_.zIndex(anychart.gauges.Circular.ZINDEX_CAP);
    this.cap_.gauge(this);
    this.registerDisposable(this.cap_);
    this.cap_.listenSignals(this.onCapSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_CAP, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(opt_value)) {
    this.cap_.setup(opt_value);
    return this;
  } else {
    return this.cap_;
  }
};


/**
 * Listener for axes invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.gauges.Circular.prototype.onCapSignal_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.GAUGE_CAP;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state |= anychart.ConsistencyState.BOUNDS;
  }
  // if there are no signals, state == 0 and nothing happens.
  this.invalidate(state, signal);
};


/**
 * Circular range..
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.axisMarkers.CircularRange|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.range = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var circularRange = this.ranges_[index];
  if (!circularRange) {
    circularRange = new anychart.core.axisMarkers.CircularRange();
    this.ranges_[index] = circularRange;
    circularRange.zIndex(anychart.gauges.Circular.ZINDEX_CIRCULAR_RANGE + anychart.gauges.Circular.ZINDEX_MULTIPLIER * this.circularRangeCounter_);
    this.circularRangeCounter_++;
    circularRange.gauge(this);
    circularRange.axisIndex(0);
    this.registerDisposable(circularRange);
    circularRange.listenSignals(this.onCircularRangeSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
  }

  if (goog.isDef(value)) {
    circularRange.setup(value);
    return this;
  } else {
    return circularRange;
  }
};


/**
 * Listener for pointers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.gauges.Circular.prototype.onCircularRangeSignal_ = function(event) {
  this.invalidate(anychart.ConsistencyState.GAUGE_AXIS_MARKERS, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Bar pointer.
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.gauge.pointers.Bar|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.bar = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var bar = this.bars_[index];
  if (!bar) {
    bar = new anychart.core.gauge.pointers.Bar();
    this.bars_[index] = bar;
    bar.zIndex(anychart.gauges.Circular.ZINDEX_POINTER + anychart.gauges.Circular.ZINDEX_MULTIPLIER * this.pointerCounter_);
    bar.dataIndex(this.pointerCounter_++);
    bar.axisIndex(0);
    bar.gauge(this);
    this.registerDisposable(bar);
    bar.listenSignals(this.onPointersSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
  }

  if (goog.isDef(value)) {
    bar.setup(value);
    return this;
  } else {
    return bar;
  }
};


/**
 * Marker pointer.
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.gauge.pointers.Marker|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.marker = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var marker = this.markers_[index];
  if (!marker) {
    marker = new anychart.core.gauge.pointers.Marker();
    this.markers_[index] = marker;
    marker.zIndex(anychart.gauges.Circular.ZINDEX_POINTER + anychart.gauges.Circular.ZINDEX_MULTIPLIER * this.pointerCounter_);
    marker.dataIndex(this.pointerCounter_++);
    marker.axisIndex(0);
    marker.gauge(this);
    this.registerDisposable(marker);
    marker.listenSignals(this.onPointersSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
  }

  if (goog.isDef(value)) {
    marker.setup(value);
    return this;
  } else {
    return marker;
  }
};


/**
 * Needle pointer.
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.gauge.pointers.Needle|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.needle = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var needle = this.needles_[index];
  if (!needle) {
    needle = new anychart.core.gauge.pointers.Needle();
    this.needles_[index] = needle;
    needle.zIndex(anychart.gauges.Circular.ZINDEX_POINTER + anychart.gauges.Circular.ZINDEX_MULTIPLIER * this.pointerCounter_);
    needle.dataIndex(this.pointerCounter_++);
    needle.axisIndex(0);
    needle.gauge(this);
    this.registerDisposable(needle);
    needle.listenSignals(this.onPointersSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
  }

  if (goog.isDef(value)) {
    needle.setup(value);
    return this;
  } else {
    return needle;
  }
};


/**
 * Knob pointer.
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.gauge.pointers.Knob|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.knob = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var knob = this.knobs_[index];
  if (!knob) {
    knob = new anychart.core.gauge.pointers.Knob();
    this.knobs_[index] = knob;
    knob.zIndex(anychart.gauges.Circular.ZINDEX_KNOB + anychart.gauges.Circular.ZINDEX_MULTIPLIER * this.knobCounter_);
    knob.dataIndex(this.knobCounter_++);
    knob.axisIndex(0);
    knob.gauge(this);
    this.registerDisposable(knob);
    knob.listenSignals(this.onPointersSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION);
  }

  if (goog.isDef(value)) {
    knob.setup(value);
    return this;
  } else {
    return knob;
  }
};


/** invalidates pointers */
anychart.gauges.Circular.prototype.invalidatePointerBounds = function() {
  var pointers = goog.array.concat(this.bars_, this.markers_, this.needles_, this.knobs_);

  for (var i = 0, len = pointers.length; i < len; i++) {
    var pointer = pointers[i];
    if (pointer) pointer.invalidate(anychart.ConsistencyState.BOUNDS);
  }
};


/**
 * Listener for pointers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.gauges.Circular.prototype.onPointersSignal_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.GAUGE_POINTERS;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION)) {
    state |= anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_SCALE;

    signal |= anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEEDS_RECALCULATION;
  }

  // if there are no signals, state == 0 and nothing happens.
  this.invalidate(state, signal);
};


/**
 * Axis.
 * @param {number|Object=} opt_indexOrValue .
 * @param {Object=} opt_value .
 * @return {!anychart.core.axes.Circular|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.axis = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var axis = this.axes_[index];
  if (!axis) {
    axis = new anychart.core.axes.Circular();
    axis.zIndex(anychart.gauges.Circular.ZINDEX_AXIS);
    axis.gauge(this);
    this.axes_[index] = axis;
    this.registerDisposable(axis);
    axis.listenSignals(this.onAxisSignal_, this);
    this.invalidate(anychart.ConsistencyState.GAUGE_AXES, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(value)) {
    axis.setup(value);
    return this;
  } else {
    return axis;
  }
};


/**
 * Listener for axes invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.gauges.Circular.prototype.onAxisSignal_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.GAUGE_AXES;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state |= anychart.ConsistencyState.BOUNDS |
        anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_AXIS_MARKERS;
  }
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    state |= anychart.ConsistencyState.GAUGE_SCALE | anychart.ConsistencyState.BOUNDS;
  }
  // if there are no signals, state == 0 and nothing happens.
  this.invalidate(state, signal);
};


/**
 * Gets axis for index.
 * @param {number} index Axis index.
 * @return {anychart.core.axes.Circular}
 */
anychart.gauges.Circular.prototype.getAxis = function(index) {
  return this.axes_[index];
};


/**
 * Enclose frame path with straight line.
 * @param {boolean=} opt_value [false] Boolean flag.
 * @return {anychart.gauges.Circular|boolean}
 */
anychart.gauges.Circular.prototype.encloseWithStraightLine = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.encloseWithStraightLine_ != opt_value) {
      this.encloseWithStraightLine_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }

    return this;
  } else {
    return this.encloseWithStraightLine_;
  }
};


/**
 * Set gauge start angle.
 * @example
 * var gauge = anychart.circularGauge([1, 1.2, 1.4, 1.6, 1.2]);
 * gauge.startAngle(45);
 * gauge.container(stage).draw();
 * @param {(string|number)=} opt_value .
 * @return {(number|anychart.gauges.Circular)} .
 */
anychart.gauges.Circular.prototype.startAngle = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = goog.math.standardAngle(anychart.utils.toNumber(opt_value) || 0);
    if (this.startAngle_ != opt_value) {
      this.startAngle_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.startAngle_;
  }
};


/**
 * Set gauge sweep angle.
 * @example
 * var gauge = anychart.circularGauge([1, 1.2, 1.4, 1.6, 1.2]);
 * gauge.sweepAngle(45);
 * gauge.container(stage).draw();
 * @param {(string|number)=} opt_value .
 * @return {(number|anychart.gauges.Circular)} .
 */
anychart.gauges.Circular.prototype.sweepAngle = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = goog.math.clamp(anychart.utils.toNumber(opt_value) || 0, -360, 360);
    if (this.sweepAngle_ != opt_value) {
      this.sweepAngle_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.sweepAngle_;
  }
};


/**
 * Gauge frame fill.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.fill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.fill_) {
      this.fill_ = fill;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.fill_ || '#eee';
};


/**
 * Gauge frame stroke
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.gauges.Circular|acgraph.vector.Stroke} .
 */
anychart.gauges.Circular.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (stroke != this.stroke_) {
      this.stroke_ = stroke;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.stroke_ || '#ccc';
};


/**
 * Gauge radius in pixels.
 * @return {number} .
 */
anychart.gauges.Circular.prototype.getPixRadius = function() {
  return this.gaugeRadius_;
};


/**
 * Internal getter for fixed gauge start angle. All for human comfort.
 * @return {number}
 */
anychart.gauges.Circular.prototype.getStartAngle = function() {
  return this.startAngle_ + anychart.gauges.Circular.DEFAULT_START_ANGLE;
};


/**
 * Gets X coordinate of gauge center point.
 * @return {number}
 */
anychart.gauges.Circular.prototype.getCx = function() {
  return this.cx_;
};


/**
 * Gets Y coordinate of gauge center point.
 * @return {number}
 */
anychart.gauges.Circular.prototype.getCy = function() {
  return this.cy_;
};


/**
 * Circular space around gauge.
 * @param {(number|string)=} opt_value .
 * @return {string|anychart.gauges.Circular} .
 */
anychart.gauges.Circular.prototype.circularPadding = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.utils.normalizeToPercent(opt_value);
    if (this.circularPadding_ != opt_value) {
      this.circularPadding_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.circularPadding_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Creates gauge frame path.
 * @param {!acgraph.vector.Path} path .
 * @param {number} cx .
 * @param {number} cy .
 * @param {number} radius .
 * @private
 */
anychart.gauges.Circular.prototype.createFrame_ = function(path, cx, cy, radius) {
  var sweepAngle = this.sweepAngle_;
  var startAngle = this.getStartAngle();

  var endAngle = startAngle + sweepAngle;

  var startAngleRad = goog.math.toRadians(startAngle);
  var endAngleRad = goog.math.toRadians(endAngle);

  this.capRadius_ = this.cap_ && this.cap_.enabled() ?
      anychart.utils.normalizeSize(/** @type {string} */(this.cap_.radius()), radius) :
      0;

  var startCenterPt_x = cx + (radius * Math.cos(startAngleRad));
  var startCenterPt_y = cy + (radius * Math.sin(startAngleRad));

  var endCenterPt_x = cx + (radius * Math.cos(endAngleRad));
  var endCenterPt_y = cy + (radius * Math.sin(endAngleRad));

  if (sweepAngle % 360 == 0 && sweepAngle != 0) {
    path.circularArc(cx, cy, radius + this.pixCircularPadding_, radius + this.pixCircularPadding_, startAngle, sweepAngle);
  } else if (Math.abs(sweepAngle) > 180 && this.encloseWithStraightLine_) {
    path.circularArc(
        startCenterPt_x,
        startCenterPt_y,
        this.pixCircularPadding_,
        this.pixCircularPadding_,
        sweepAngle < 0 ? startAngle + 90 : startAngle + 270,
        sweepAngle < 0 ? -90 : 90);
    path.circularArc(
        cx,
        cy,
        radius + this.pixCircularPadding_,
        radius + this.pixCircularPadding_,
        startAngle,
        sweepAngle, true);
    path.circularArc(
        endCenterPt_x,
        endCenterPt_y,
        this.pixCircularPadding_,
        this.pixCircularPadding_,
        endAngle,
        sweepAngle < 0 ? -90 : 90, true);
  } else {
    var sweepAboutCap = 360 - Math.abs(sweepAngle) - 90;
    if (sweepAboutCap > 0) {
      path.circularArc(
          startCenterPt_x,
          startCenterPt_y,
          this.pixCircularPadding_,
          this.pixCircularPadding_,
          sweepAngle < 0 ? startAngle + 90 : startAngle + 270,
          sweepAngle < 0 ? -90 : 90);
      path.circularArc(
          cx,
          cy,
          radius + this.pixCircularPadding_,
          radius + this.pixCircularPadding_,
          startAngle,
          sweepAngle, true);
      path.circularArc(
          endCenterPt_x,
          endCenterPt_y,
          this.pixCircularPadding_,
          this.pixCircularPadding_,
          endAngle,
          sweepAngle < 0 ? -90 : 90, true);
      path.circularArc(
          cx,
          cy,
          this.pixCircularPadding_ + this.capRadius_,
          this.pixCircularPadding_ + this.capRadius_,
          sweepAngle < 0 ? endAngle - 45 : endAngle + 45,
          sweepAngle < 0 ? -sweepAboutCap : sweepAboutCap, true);
    } else {
      //calculate intersection point
      var angle = goog.math.toRadians(sweepAngle < 0 ? endAngle - 45 : endAngle + 45);
      var x1 = cx + Math.cos(angle) * (this.pixCircularPadding_ + this.capRadius_);
      var y1 = cy + Math.sin(angle) * (this.pixCircularPadding_ + this.capRadius_);

      angle = goog.math.toRadians(sweepAngle < 0 ? endAngle - 90 : endAngle + 90);
      var x2 = endCenterPt_x + Math.cos(angle) * this.pixCircularPadding_;
      var y2 = endCenterPt_y + Math.sin(angle) * this.pixCircularPadding_;

      angle = goog.math.toRadians(sweepAngle < 0 ? endAngle - 45 + 360 - sweepAngle + 90 : endAngle + 45 + 360 - sweepAngle - 90);
      var x10 = cx + Math.cos(angle) * (this.pixCircularPadding_ + this.capRadius_);
      var y10 = cy + Math.sin(angle) * (this.pixCircularPadding_ + this.capRadius_);

      angle = goog.math.toRadians(sweepAngle < 0 ? startAngle + 90 : startAngle - 90);
      var x20 = startCenterPt_x + Math.cos(angle) * this.pixCircularPadding_;
      var y20 = startCenterPt_y + Math.sin(angle) * this.pixCircularPadding_;


      var A1 = (y1 - y2);
      var B1 = (x2 - x1);
      var C1 = (x1 * y2 - x2 * y1);

      var A2 = (y10 - y20);
      var B2 = (x20 - x10);
      var C2 = (x10 * y20 - x20 * y10);

      var x_inters = (B1 * C2 - B2 * C1) / (A1 * B2 - A2 * B1);
      var y_inters = (C1 * A2 - C2 * A1) / (A1 * B2 - A2 * B1);

      var intersectPointRadius = Math.sqrt(Math.pow(x_inters - cx, 2) + Math.pow(y_inters - cy, 2));

      if (intersectPointRadius < radius) {
        path.circularArc(
            startCenterPt_x,
            startCenterPt_y,
            this.pixCircularPadding_,
            this.pixCircularPadding_,
            sweepAngle < 0 ? startAngle + 90 : startAngle + 270,
            sweepAngle < 0 ? -90 : 90);
        path.circularArc(
            cx,
            cy,
            radius + this.pixCircularPadding_,
            radius + this.pixCircularPadding_,
            startAngle,
            sweepAngle, true);
        path.circularArc(
            endCenterPt_x,
            endCenterPt_y,
            this.pixCircularPadding_,
            this.pixCircularPadding_,
            endAngle,
            sweepAngle < 0 ? -90 : 90, true);

        path.lineTo(x_inters, y_inters);
      } else {
        path.circularArc(cx, cy, radius + this.pixCircularPadding_, radius + this.pixCircularPadding_, 0, 360);
      }
    }
  }

  path.close();
};


/**
 * Calculating common values.
 * @param {anychart.math.Rect} bounds Bounds of the content area.
 * @private
 */
anychart.gauges.Circular.prototype.calculate_ = function(bounds) {
  if (!this.framePath) this.framePath = this.rootElement.path();
  else this.framePath.clear();

  this.outerGaugeRadius_ = 1;
  this.pixCircularPadding_ = anychart.utils.normalizeSize(this.circularPadding_, this.outerGaugeRadius_);
  this.gaugeRadius_ = this.outerGaugeRadius_ - this.pixCircularPadding_;

  this.createFrame_(this.framePath, 0, 0, this.gaugeRadius_);

  var tmpBounds = this.framePath.getBounds();

  var wRatio, hRatio, ratio, left, top;

  wRatio = bounds.width / tmpBounds.width;
  hRatio = bounds.height / tmpBounds.height;

  ratio = Math.min(wRatio, hRatio);

  left = bounds.left + bounds.width / 2 - (tmpBounds.width / 2 * ratio);
  top = bounds.top + bounds.height / 2 - (tmpBounds.height / 2 * ratio);

  this.outerGaugeRadius_ = ratio;
  this.cx_ = left + Math.abs(tmpBounds.left) * ratio;
  this.cy_ = top + Math.abs(tmpBounds.top) * ratio;

  this.pixCircularPadding_ = this.pixCircularPadding_ * this.outerGaugeRadius_;
  this.gaugeRadius_ = this.outerGaugeRadius_ - this.pixCircularPadding_;

  /**
   * Bounds of gauge. (Not bounds of content area).
   * @type {anychart.math.Rect}
   * @private
   */
  this.outerGaugeBounds_ = new anychart.math.Rect(
      left,
      top,
      tmpBounds.width * ratio,
      tmpBounds.height * ratio
      );

  /**
   * Bounds of gauge without circular padding.
   * @type {anychart.math.Rect}
   * @private
   */
  this.gaugeBounds_ = new anychart.math.Rect(
      left + this.pixCircularPadding_,
      top + this.pixCircularPadding_,
      tmpBounds.width * ratio - this.pixCircularPadding_,
      tmpBounds.height * ratio - this.pixCircularPadding_
      );
};


/**
 * Bounds of gauge without circular padding.
 * @return {anychart.math.Rect}
 */
anychart.gauges.Circular.prototype.getContentBounds = function() {
  return this.gaugeBounds_ ? this.gaugeBounds_.clone() : anychart.math.rect(0, 0, 0, 0);
};


/**
 * Bounds of gauge without circular padding.
 * @return {anychart.math.Rect}
 */
anychart.gauges.Circular.prototype.getGaugeBounds = function() {
  return this.outerGaugeBounds_ ? this.outerGaugeBounds_.clone() : anychart.math.rect(0, 0, 0, 0);
};


/** @inheritDoc */
anychart.gauges.Circular.prototype.setLabelSettings = function(label, bounds) {
  label.parentBounds(this.getGaugeBounds());
  label.parentRadius(this.getPixRadius());
  label.cx(this.getCx());
  label.cy(this.getCy());
  label.startAngle(this.getStartAngle());
  label.sweepAngle(this.sweepAngle());
};


/**
 * Draw circular gauge content items.
 * @param {anychart.math.Rect} bounds Bounds of gauge content area.
 */
anychart.gauges.Circular.prototype.drawContent = function(bounds) {
  var i, len, axis, pointer, range;

  var pointers = goog.array.concat(this.bars_, this.markers_, this.needles_, this.knobs_);
  anychart.core.Base.suspendSignalsDispatching(this.cap_, this.axes_, this.ranges_, pointers);

  if (this.hasInvalidationState(anychart.ConsistencyState.GAUGE_SCALE)) {

    var iterator = this.data().getIterator();

    var needAutoCalc = false;
    goog.array.forEach(this.axes_, function(axis) {
      axis.scale().startAutoCalc();
      needAutoCalc = needAutoCalc || axis.scale().needsAutoCalc();
    });

    if (needAutoCalc) {
      for (i = 0, len = pointers.length; i < len; i++) {
        pointer = pointers[i];
        if (pointer) {
          var axisIndex = pointer.axisIndex();

          iterator.select(pointer.dataIndex());
          axis = this.axes_[axisIndex];
          axis.scale().extendDataRange(iterator.get('value'));
          if (pointer instanceof anychart.core.gauge.pointers.Bar)
            axis.scale().extendDataRange(0);
        }
      }
    }

    goog.array.forEach(this.axes_, function(axis) {
      axis.scale().finishAutoCalc();
    });

    this.invalidate(anychart.ConsistencyState.GAUGE_AXES);
    this.invalidate(anychart.ConsistencyState.GAUGE_AXIS_MARKERS);
    this.markConsistent(anychart.ConsistencyState.GAUGE_SCALE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    this.calculate_(bounds);

    this.framePath.clear();
    this.createFrame_(this.framePath, this.cx_, this.cy_, this.gaugeRadius_);
    this.framePath.zIndex(anychart.gauges.Circular.ZINDEX_FRAME);
    this.framePath.parent(this.rootElement);

    if (this.cap_) this.cap_.invalidate(anychart.ConsistencyState.BOUNDS);

    for (i = 0, len = this.axes_.length; i < len; i++) {
      axis = this.axes_[i];
      if (axis) axis.invalidate(anychart.ConsistencyState.BOUNDS);
    }

    for (i = 0, len = pointers.length; i < len; i++) {
      pointer = pointers[i];
      if (pointer) pointer.invalidate(anychart.ConsistencyState.BOUNDS);
    }

    for (i = 0, len = this.ranges_.length; i < len; i++) {
      range = this.ranges_[i];
      if (range) range.invalidate(anychart.ConsistencyState.BOUNDS);
    }

    this.invalidate(anychart.ConsistencyState.GAUGE_CAP |
        anychart.ConsistencyState.GAUGE_AXES |
        anychart.ConsistencyState.GAUGE_POINTERS |
        anychart.ConsistencyState.GAUGE_AXIS_MARKERS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.framePath.stroke(this.stroke());
    this.framePath.fill(this.fill());

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.GAUGE_CAP)) {
    if (this.cap_)
      this.cap_
        .container(this.rootElement)
        .draw();

    this.markConsistent(anychart.ConsistencyState.GAUGE_CAP);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.GAUGE_AXES)) {
    for (i = 0, len = this.axes_.length; i < len; i++) {
      axis = this.axes_[i];
      if (axis) {
        axis
            .container(this.rootElement)
            .draw();
      }
    }

    this.markConsistent(anychart.ConsistencyState.GAUGE_AXES);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.GAUGE_POINTERS)) {
    for (i = 0, len = pointers.length; i < len; i++) {
      pointer = pointers[i];
      if (pointer) {
        pointer
            .container(this.rootElement)
            .draw();
      }
    }

    this.markConsistent(anychart.ConsistencyState.GAUGE_POINTERS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.GAUGE_AXIS_MARKERS)) {
    for (i = 0, len = this.ranges_.length; i < len; i++) {
      range = this.ranges_[i];
      if (range) {
        range
            .container(this.rootElement)
            .draw();
      }
    }

    this.markConsistent(anychart.ConsistencyState.GAUGE_AXIS_MARKERS);
  }

  anychart.core.Base.resumeSignalsDispatchingFalse(this.cap_, this.axes_, this.ranges_, pointers);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Defaults.
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.gauges.Circular.prototype.restoreDefaults = function() {
  this.startAngle(0);
  this.sweepAngle(360);
  this.circularPadding('10%');
  this.fill(/** @type {acgraph.vector.Fill} */({'keys': ['rgb(255, 255, 255)', 'rgb(220, 220, 220)'], 'angle': 315}));
  this.encloseWithStraightLine(false);

  this.title().enabled(false);
  this.background().enabled(false);
};


/** @inheritDoc */
anychart.gauges.Circular.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);

  this.fill(config['fill']);
  this.stroke(config['stroke']);
  this.startAngle(config['startAngle']);
  this.sweepAngle(config['sweepAngle']);
  this.data(config['data']);
  if (goog.isDef(config['cap']))
    this.cap(config['cap']);
  this.circularPadding(config['circularPadding']);
  this.encloseWithStraightLine(config['encloseWithStraightLine']);

  var i, len;
  var axes = config['axes'];
  if (axes) {
    for (i = 0, len = axes.length; i < len; i++) {
      this.axis(axes[i]);
    }
  }

  var bars = config['bars'];
  if (bars) {
    for (i = 0, len = bars.length; i < len; i++) {
      this.bar(bars[i]);
    }
  }

  var markers = config['markers'];
  if (markers) {
    for (i = 0, len = markers.length; i < len; i++) {
      this.marker(markers[i]);
    }
  }

  var needles = config['needles'];
  if (needles) {
    for (i = 0, len = needles.length; i < len; i++) {
      this.needle(needles[i]);
    }
  }

  var knobs = config['knobs'];
  if (knobs) {
    for (i = 0, len = knobs.length; i < len; i++) {
      this.knob(knobs[i]);
    }
  }

  var ranges = config['ranges'];
  if (ranges) {
    for (i = 0, len = ranges.length; i < len; i++) {
      this.range(ranges[i]);
    }
  }
};


/** @inheritDoc */
anychart.gauges.Circular.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  json['type'] = anychart.enums.GaugeTypes.CIRCULAR;

  json['fill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.fill()));
  json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  json['startAngle'] = this.startAngle();
  json['sweepAngle'] = this.sweepAngle();
  json['data'] = this.data().serialize();
  if (this.cap_)
    json['cap'] = this.cap().serialize();
  json['circularPadding'] = this.circularPadding();
  json['encloseWithStraightLine'] = this.encloseWithStraightLine();

  var i, len;
  var axes = [];
  for (i = 0, len = this.axes_.length; i < len; i++) {
    axes.push(this.axes_[i].serialize());
  }
  json['axes'] = axes;

  var bars = [];
  for (i = 0, len = this.bars_.length; i < len; i++) {
    bars.push(this.bars_[i].serialize());
  }
  json['bars'] = bars;

  var markers = [];
  for (i = 0, len = this.markers_.length; i < len; i++) {
    markers.push(this.markers_[i].serialize());
  }
  json['markers'] = markers;

  var needles = [];
  for (i = 0, len = this.needles_.length; i < len; i++) {
    needles.push(this.needles_[i].serialize());
  }
  json['needles'] = needles;

  var knobs = [];
  for (i = 0, len = this.knobs_.length; i < len; i++) {
    knobs.push(this.knobs_[i].serialize());
  }
  json['knobs'] = knobs;

  var ranges = [];
  for (i = 0, len = this.ranges_.length; i < len; i++) {
    ranges.push(this.ranges_[i].serialize());
  }
  json['ranges'] = ranges;


  return {'gauge': json};
};


//exports
anychart.gauges.Circular.prototype['stroke'] = anychart.gauges.Circular.prototype.stroke;
anychart.gauges.Circular.prototype['fill'] = anychart.gauges.Circular.prototype.fill;

anychart.gauges.Circular.prototype['startAngle'] = anychart.gauges.Circular.prototype.startAngle;
anychart.gauges.Circular.prototype['sweepAngle'] = anychart.gauges.Circular.prototype.sweepAngle;

anychart.gauges.Circular.prototype['data'] = anychart.gauges.Circular.prototype.data;

anychart.gauges.Circular.prototype['cap'] = anychart.gauges.Circular.prototype.cap;
anychart.gauges.Circular.prototype['axis'] = anychart.gauges.Circular.prototype.axis;

anychart.gauges.Circular.prototype['bar'] = anychart.gauges.Circular.prototype.bar;
anychart.gauges.Circular.prototype['marker'] = anychart.gauges.Circular.prototype.marker;
anychart.gauges.Circular.prototype['needle'] = anychart.gauges.Circular.prototype.needle;
anychart.gauges.Circular.prototype['knob'] = anychart.gauges.Circular.prototype.knob;

anychart.gauges.Circular.prototype['range'] = anychart.gauges.Circular.prototype.range;

anychart.gauges.Circular.prototype['circularPadding'] = anychart.gauges.Circular.prototype.circularPadding;
anychart.gauges.Circular.prototype['encloseWithStraightLine'] = anychart.gauges.Circular.prototype.encloseWithStraightLine;
