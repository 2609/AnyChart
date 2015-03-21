goog.provide('anychart.core.axes.Linear');
goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.axes.Ticks');
goog.require('anychart.core.ui.LabelsFactory');
goog.require('anychart.core.ui.Title');
goog.require('anychart.enums');
goog.require('anychart.math.Rect');
goog.require('anychart.scales.Base');
goog.require('anychart.scales.ScatterBase');
goog.require('anychart.utils');



/**
 * Axis Class.<br/>
 * Any axis must be bound to a scale.<br/>
 * To obtain a new instance of Axis use {@link anychart.axes.linear}.
 * @example <t>simple-h100</t>
 * anychart.axes.linear()
 *    .scale(anychart.scales.linear())
 *    .container(stage).draw();
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.axes.Linear = function() {
  this.suspendSignalsDispatching();
  goog.base(this);

  this.labelsBounds_ = [];
  this.minorLabelsBounds_ = [];

  this.line_ = acgraph.path();

  this.title()
      .suspendSignalsDispatching()
      .text('Axis title')
      .fontFamily('Tahoma')
      .fontSize('11')
      .fontColor('rgb(34,34,34)')
      .fontWeight('bold')
      .padding(5)
      .margin(10, 5, 10, 5)
      .resumeSignalsDispatching(false);

  this.title().background()
      .suspendSignalsDispatching()
      .stroke({
        'keys': [
          '0 #DDDDDD 1',
          '1 #D0D0D0 1'
        ],
        'angle' : '90'
      })
      .fill({
        'keys': [
          '0 #FFFFFF 1',
          '0.5 #F3F3F3 1',
          '1 #FFFFFF 1'
        ],
        'angle' : '90'
      })
      .enabled(false)
      .resumeSignalsDispatching(false);

  this.labels()
      .suspendSignalsDispatching()
      .enabled(true)
      .offsetX(0)
      .offsetY(0)
      .anchor(anychart.enums.Anchor.CENTER)
      .padding(1, 2, 1, 2)
      .fontFamily('Tahoma')
      .fontSize('11')
      .fontColor('rgb(34,34,34)')
      .textWrap(acgraph.vector.Text.TextWrap.NO_WRAP)
      .resumeSignalsDispatching(false);

  this.labels().background()
      .suspendSignalsDispatching()
      .enabled(false)
      .stroke({
        'keys': [
          '0 #DDDDDD 1',
          '1 #D0D0D0 1'
        ],
        'angle': '90'
      })
      .fill({
        'keys': [
          '0 #FFFFFF 1',
          '0.5 #F3F3F3 1',
          '1 #FFFFFF 1'
        ],
        'angle': '90'
      })
      .resumeSignalsDispatching(false);

  this.minorLabels()
      .suspendSignalsDispatching()
      .enabled(false)
      .offsetX(0)
      .offsetY(0)
      .padding(1, 1, 0, 1)
      .fontFamily('Tahoma')
      .fontSize('11')
      .fontColor('rgb(34,34,34)')
      .textWrap(acgraph.vector.Text.TextWrap.NO_WRAP)
      .resumeSignalsDispatching(false);

  this.minorLabels().background()
      .suspendSignalsDispatching()
      .enabled(false)
      .stroke({
        'keys': [
          '0 #DDDDDD 1',
          '1 #D0D0D0 1'
        ],
        'angle': '90'
      })
      .fill({
        'keys': [
          '0 #FFFFFF 1',
          '0.5 #F3F3F3 1',
          '1 #FFFFFF 1'
        ],
        'angle': '90'
      })
      .resumeSignalsDispatching(false);

  this.ticks()
      .suspendSignalsDispatching()
      .enabled(true)
      .length(5)
      .stroke({'color': '#313131', 'lineJoin': 'round', 'lineCap': 'butt'})
      .resumeSignalsDispatching(false);

  this.minorTicks()
      .suspendSignalsDispatching()
      .enabled(true)
      .length(2)
      .stroke({'color': '#3C3C3C', 'lineJoin': 'round', 'lineCap': 'butt'})
      .resumeSignalsDispatching(false);

  this.overlapMode(anychart.enums.LabelsOverlapMode.NO_OVERLAP);
  this.stroke({'color': '#474747', 'lineJoin': 'round', 'lineCap': 'square'});
  this.staggerMaxLines(2);

  this.resumeSignalsDispatching(true);

  /**
   * Constant to save space.
   * @type {number}
   * @private
   */
  this.ALL_VISUAL_STATES_ = anychart.ConsistencyState.APPEARANCE |
      anychart.ConsistencyState.AXIS_TITLE |
      anychart.ConsistencyState.AXIS_LABELS |
      anychart.ConsistencyState.AXIS_TICKS |
      anychart.ConsistencyState.BOUNDS |
      anychart.ConsistencyState.AXIS_OVERLAP;
};
goog.inherits(anychart.core.axes.Linear, anychart.core.VisualBase);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Linear.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
        anychart.ConsistencyState.APPEARANCE |
        anychart.ConsistencyState.AXIS_TITLE |
        anychart.ConsistencyState.AXIS_LABELS |
        anychart.ConsistencyState.AXIS_TICKS |
        anychart.ConsistencyState.AXIS_OVERLAP;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Linear.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * @type {acgraph.vector.Path}
 * @private
 */
anychart.core.axes.Linear.prototype.line_ = null;


/**
 * @type {string}
 * @private
 */
anychart.core.axes.Linear.prototype.name_ = 'axis';


/**
 * @type {anychart.core.ui.Title}
 * @private
 */
anychart.core.axes.Linear.prototype.title_ = null;


/**
 * @type {anychart.core.ui.LabelsFactory}
 * @private
 */
anychart.core.axes.Linear.prototype.labels_ = null;


/**
 * @type {anychart.core.ui.LabelsFactory}
 * @private
 */
anychart.core.axes.Linear.prototype.minorLabels_ = null;


/**
 * @type {anychart.core.axes.Ticks}
 * @private
 */
anychart.core.axes.Linear.prototype.ticks_ = null;


/**
 * @type {anychart.core.axes.Ticks}
 * @private
 */
anychart.core.axes.Linear.prototype.minorTicks_ = null;


/**
 * @type {string|acgraph.vector.Stroke}
 * @private
 */
anychart.core.axes.Linear.prototype.stroke_ = 'none';


/**
 * @type {anychart.enums.Orientation}
 * @private
 */
anychart.core.axes.Linear.prototype.orientation_;


/**
 * @type {anychart.enums.Orientation}
 * @private
 */
anychart.core.axes.Linear.prototype.defaultOrientation_ = anychart.enums.Orientation.TOP;


/**
 * @type {anychart.scales.Base}
 * @private
 */
anychart.core.axes.Linear.prototype.scale_ = null;


/**
 * @type {anychart.enums.LabelsOverlapMode}
 * @private
 */
anychart.core.axes.Linear.prototype.overlapMode_ = anychart.enums.LabelsOverlapMode.NO_OVERLAP;


/**
 * @type {boolean}
 * @private
 */
anychart.core.axes.Linear.prototype.staggerMode_ = false;


/**
 * @type {?number}
 * @private
 */
anychart.core.axes.Linear.prototype.staggerLines_ = null;


/**
 * @type {?number}
 * @private
 */
anychart.core.axes.Linear.prototype.staggerMaxLines_ = null;


/**
 * @type {number}
 * @private
 */
anychart.core.axes.Linear.prototype.staggerAutoLines_ = 1;


/**
 * @type {anychart.math.Rect}
 * @private
 */
anychart.core.axes.Linear.prototype.pixelBounds_ = null;


/**
 * Axis width.
 * @type {?(number|string)}
 * @private
 */
anychart.core.axes.Linear.prototype.width_ = null;


/**
 * Axis padding.
 * @type {anychart.core.utils.Padding}
 * @private
 */
anychart.core.axes.Linear.prototype.padding_ = null;


/**
 * @type {number}
 * @private
 */
anychart.core.axes.Linear.prototype.offsetY_ = 0;


/**
 * @type {boolean}
 * @private
 */
anychart.core.axes.Linear.prototype.drawFirstLabel_ = true;


/**
 * @type {boolean}
 * @private
 */
anychart.core.axes.Linear.prototype.drawLastLabel_ = true;


/**
 * @type {Array.<Array.<number>>}
 * @private
 */
anychart.core.axes.Linear.prototype.labelsBounds_ = null;


/**
 * @type {Array.<Array.<number>>}
 * @private
 */
anychart.core.axes.Linear.prototype.minorLabelsBounds_ = null;


/**
 * Getter for the axis title.
 * @return {!anychart.core.ui.Title} Axis title.
 *//**
 * Setter for the axis title.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().title('New title for my axis');
 * chart.yAxis().title(null);
 * @param {(null|boolean|Object|string)=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(null|boolean|Object|string)=} opt_value Axis title.
 * @return {!(anychart.core.ui.Title|anychart.core.axes.Linear)} Axis title or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.title = function(opt_value) {
  if (!this.title_) {
    this.title_ = new anychart.core.ui.Title();
    this.title_.listenSignals(this.titleInvalidated_, this);
    this.registerDisposable(this.title_);
  }

  if (goog.isDef(opt_value)) {
    this.title_.setup(opt_value);
    return this;
  }
  return this.title_;
};


/**
 * Internal title invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.titleInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES_;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_TITLE;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.invalidate(state, signal);
};


/**
 * Getter for axis labels.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().labels().fontSize(14).rotation(-90);
 * @return {!anychart.core.ui.LabelsFactory} Axis labels of itself for method chaining.
 *//**
 * Setter for axis labels.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().labels(false);
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.Linear)} Axis labels of itself for method chaining.
 */
anychart.core.axes.Linear.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory();
    this.labels_.listenSignals(this.labelsInvalidated_, this);
    this.registerDisposable(this.labels_);
  }

  if (goog.isDef(opt_value)) {
    this.labels_.setup(opt_value);
    return this;
  }
  return this.labels_;
};


/**
 * Internal label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.labelsInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES_;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_LABELS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.dropStaggeredLabelsCache_();
  this.dropBoundsCache_();
  this.invalidate(state, signal);
};


/**
 * Getter for axis minor labels.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().minorLabels().fontSize(14).rotation(-90);
 * @return {!anychart.core.ui.LabelsFactory} Axis labels.
 *//**
 * Setter for axis minor labels.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().minorLabels(null);
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null)=} opt_value Axis labels.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.axes.Linear)} Axis labels of itself for method chaining.
 */
anychart.core.axes.Linear.prototype.minorLabels = function(opt_value) {
  if (!this.minorLabels_) {
    this.minorLabels_ = new anychart.core.ui.LabelsFactory();
    this.isHorizontal() ? this.minorLabels_.rotation(0) : this.minorLabels_.rotation(-90);
    this.minorLabels_.listenSignals(this.minorLabelsInvalidated_, this);
    this.registerDisposable(this.minorLabels_);
  }

  if (goog.isDef(opt_value)) {
    this.minorLabels_.setup(opt_value);
    return this;
  }
  return this.minorLabels_;
};


/**
 * Internal minor label invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.minorLabelsInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES_;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_LABELS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.dropBoundsCache_();
  this.invalidate(state, signal);
};


/**
 * Getter for axis ticks.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().ticks().stroke('5 blue').length(5);
 * @return {!anychart.core.axes.Ticks} Axis ticks.
 *//**
 * Setter for axis ticks.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.xAxis().ticks(false);
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.Ticks|anychart.core.axes.Linear)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.ticks = function(opt_value) {
  if (!this.ticks_) {
    this.ticks_ = new anychart.core.axes.Ticks();
    this.ticks_.listenSignals(this.ticksInvalidated_, this);
    this.registerDisposable(this.ticks_);
  }

  if (goog.isDef(opt_value)) {
    this.ticks_.setup(opt_value);
    return this;
  }
  return this.ticks_;
};


/**
 * Internal ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.ticksInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES_;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_TICKS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.invalidate(state, signal);
};


/**
 * Getter for minor axis ticks.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().minorTicks().enabled(true).stroke('5 blue').length(5);
 * @return {!anychart.core.axes.Ticks} Axis ticks.
 *//**
 * Setter for minor axis ticks.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().minorTicks(false);
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null)=} opt_value Axis ticks.
 * @return {!(anychart.core.axes.Ticks|anychart.core.axes.Linear)} Axis ticks or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.minorTicks = function(opt_value) {
  if (!this.minorTicks_) {
    this.minorTicks_ = new anychart.core.axes.Ticks();
    this.minorTicks_.listenSignals(this.minorTicksInvalidated_, this);
    this.registerDisposable(this.minorTicks_);
  }

  if (goog.isDef(opt_value)) {
    this.minorTicks_.setup(opt_value);
    return this;
  }
  return this.minorTicks_;
};


/**
 * Internal minor ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.minorTicksInvalidated_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state = this.ALL_VISUAL_STATES_;
    signal = anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW;
  } else if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state = anychart.ConsistencyState.AXIS_TICKS;
    signal = anychart.Signal.NEEDS_REDRAW;
  }
  this.invalidate(state, signal);
};


/**
 * Getter for axis line stroke settings.
 * @return {!acgraph.vector.Stroke} Axis line stroke settings.
 *//**
 * Setter for series stroke by function.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().stroke(
 *      function(){
 *        return '3 '+ this.sourceColor;
 *      }
 * );
 * @param {function():(acgraph.vector.ColoredFill|acgraph.vector.Stroke)=} opt_fillFunction [function() {
 *  return anychart.color.darken(this.sourceColor);
 * }] Function that looks like <code>function(){
 *    // this.sourceColor -  color returned by fill() getter.
 *    return fillValue; // type acgraph.vector.Fill
 * }</code>.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Setter for stroke settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().stroke('orange', 3, '5 2', 'round');
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|Function|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.core.axes.Linear|acgraph.vector.Stroke)} .
 */
anychart.core.axes.Linear.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != opt_strokeOrFill) {
      var thicknessOld = goog.isObject(this.stroke_) ? this.stroke_['thickness'] || 1 : 1;
      var thicknessNew = goog.isObject(opt_strokeOrFill) ? opt_strokeOrFill['thickness'] || 1 : 1;
      this.stroke_ = opt_strokeOrFill;
      if (thicknessNew == thicknessOld)
        this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
      else
        this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


/**
 * Getter for axis orientation.
 * @return {anychart.enums.Orientation} Axis orientation.
 *//**
 * Setter for axis orientation.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.6, 1.4, 1.9]);
 * chart.yAxis().orientation('right');
 * @param {(string|anychart.enums.Orientation)=} opt_value ['top'] Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(string|anychart.enums.Orientation)=} opt_value Axis orientation.
 * @return {anychart.enums.Orientation|!anychart.core.axes.Linear} Axis orientation or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.orientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var orientation = anychart.enums.normalizeOrientation(opt_value);
    if (this.orientation_ != orientation) {
      this.orientation_ = orientation;
      this.dropStaggeredLabelsCache_();
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.orientation_ || this.defaultOrientation_;
  }
};


/**
 * Set axis default orientation.
 * @param {anychart.enums.Orientation} value Default orientation value.
 */
anychart.core.axes.Linear.prototype.setDefaultOrientation = function(value) {
  this.defaultOrientation_ = value;
};


/**
 * Getter for axis scale.
 * @return {anychart.scales.Base} Axis scale.
 *//**
 * Setter for axis scale.
 * @param {anychart.scales.Base=} opt_value Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {anychart.scales.Base=} opt_value Scale.
 * @return {anychart.scales.Base|!anychart.core.axes.Linear} Axis scale or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.scale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.scale_ != opt_value) {
      this.scale_ = opt_value;
      this.scale_.listenSignals(this.scaleInvalidated_, this);
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.scale_;
  }
};


/**
 * Internal ticks invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.axes.Linear.prototype.scaleInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.dropStaggeredLabelsCache_();
    this.dropBoundsCache_();
    this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
};


/**
 * @param {?(number|string)=} opt_value .
 * @return {anychart.core.axes.Linear|number|string|null} .
 */
anychart.core.axes.Linear.prototype.width = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.width_ != opt_value) {
      this.width_ = opt_value;
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.width_;
};


/**
 * @param {(string|number|Array.<number|string>|{top:(number|string),left:(number|string),bottom:(number|string),right:(number|string)})=} opt_spaceOrTopOrTopAndBottom .
 * @param {(string|number)=} opt_rightOrRightAndLeft .
 * @param {(string|number)=} opt_bottom .
 * @param {(string|number)=} opt_left .
 * @return {!(anychart.core.axes.Linear|anychart.core.utils.Padding)} .
 */
anychart.core.axes.Linear.prototype.padding = function(opt_spaceOrTopOrTopAndBottom, opt_rightOrRightAndLeft, opt_bottom, opt_left) {
  if (!this.padding_) {
    this.padding_ = new anychart.core.utils.Padding();
    this.registerDisposable(this.padding_);
    this.padding_.listenSignals(this.paddingInvalidated_, this);
  }
  if (goog.isDef(opt_spaceOrTopOrTopAndBottom)) {
    this.padding_.setup.apply(this.padding_, arguments);
    return this;
  }
  return this.padding_;
};


/**
 * Listener for padding invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.core.axes.Linear.prototype.paddingInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.dropStaggeredLabelsCache_();
    this.dropBoundsCache_();
    this.invalidate(this.ALL_VISUAL_STATES_,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);

  }
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.invalidateParentBounds = function() {
  this.dropStaggeredLabelsCache_();
  this.dropBoundsCache_();
  this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
};


/**
 * Gets axis pixel bounds.
 * @return {anychart.math.Rect} Pixel bounds.
 * @private
 */
anychart.core.axes.Linear.prototype.getPixelBounds_ = function() {
  if (!this.pixelBounds_ || this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    var orientation = this.orientation();

    var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());

    if (parentBounds) {
      var parentLength, parentSize;

      parentBounds.top = Math.round(parentBounds.top);
      parentBounds.left = Math.round(parentBounds.left);
      parentBounds.width = Math.round(parentBounds.width);
      parentBounds.height = Math.round(parentBounds.height);

      var padding = this.padding();
      var length;

      if (orientation == anychart.enums.Orientation.LEFT || orientation == anychart.enums.Orientation.RIGHT) {
        parentLength = parentBounds.height;
        parentSize = parentBounds.width;
        length = padding.tightenHeight(parentLength);
      } else {
        parentLength = parentBounds.width;
        parentSize = parentBounds.height;
        length = padding.tightenWidth(parentLength);
      }

      var size = this.width_ ?
          anychart.utils.normalizeSize(this.width_, parentSize) :
          this.getSize_(parentBounds, length);

      var x, y;

      var topPad = anychart.utils.normalizeSize(/** @type {number|string} */(padding.top()), parentBounds.height);
      var rightPad = anychart.utils.normalizeSize(/** @type {number|string} */(padding.right()), parentBounds.width);
      var bottomPad = anychart.utils.normalizeSize(/** @type {number|string} */(padding.bottom()), parentBounds.height);
      var leftPad = anychart.utils.normalizeSize(/** @type {number|string} */(padding.left()), parentBounds.width);

      var width, height;
      switch (this.orientation()) {
        case anychart.enums.Orientation.TOP:
          y = parentBounds.top + topPad;
          x = parentBounds.left + leftPad;
          height = size;
          width = length;
          break;
        case anychart.enums.Orientation.RIGHT:
          y = parentBounds.top + topPad;
          x = parentBounds.left + parentBounds.width - leftPad - size - rightPad;
          height = length;
          width = size;
          break;
        case anychart.enums.Orientation.BOTTOM:
          y = parentBounds.top + parentBounds.height - topPad - size - bottomPad;
          x = parentBounds.left + leftPad;
          height = size;
          width = length;
          break;
        case anychart.enums.Orientation.LEFT:
          y = parentBounds.top + topPad;
          x = parentBounds.left + leftPad;
          height = length;
          width = size;
          break;
      }
      this.pixelBounds_ = new anychart.math.Rect(Math.round(x), Math.round(y), Math.round(width), Math.round(height));
    } else {
      this.pixelBounds_ = new anychart.math.Rect(0, 0, 0, 0);
    }
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }
  return this.pixelBounds_;
};


/**
 * @private
 */
anychart.core.axes.Linear.prototype.dropBoundsCache_ = function() {
  if (this.labelsBoundingRects_) this.labelsBoundingRects_.length = 0;
  this.labelsBounds_.length = 0;
  this.minorLabelsBounds_.length = 0;
  this.overlappedLabels_ = null;
};


/**
 * Returns an object with indexes of labels to draw.
 * @param {anychart.math.Rect=} opt_bounds Parent bounds.
 * @return {boolean|Object.<string, Array.<boolean>>} Object with indexes of labels to draw.
 * or Boolean when there are no labels.
 * @private
 */
anychart.core.axes.Linear.prototype.getOverlappedLabels_ = function(opt_bounds) {
  if (!this.overlappedLabels_ || this.hasInvalidationState(anychart.ConsistencyState.AXIS_OVERLAP)) {
    if (this.overlapMode_ == anychart.enums.LabelsOverlapMode.ALLOW_OVERLAP) {
      return false;
    } else {
      var scale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.scale());
      var labels = [];
      var minorLabels = [];

      if (scale) {
        var i, j;

        /**
         * Index of previous major label which is displayed.
         * @type {number}
         */
        var prevDrawableLabel = -1;
        /**
         * Index of the next label, which we should display and it doesn't overlap previous major label and the
         * very last if it is on.
         * @type {number}
         */
        var nextDrawableLabel = -1;
        /**
         * Index of previous minor label which is displayed.
         * @type {number}
         */
        var prevDrawableMinorLabel = -1;

        var scaleTicksArr = scale.ticks().get();
        var ticksArrLen = scaleTicksArr.length;
        var tickVal, ratio, bounds1, bounds2, bounds3, bounds4;
        var tempRatio;
        var k = -1;
        var isLabels = this.labels().enabled();

        if (scale instanceof anychart.scales.ScatterBase) {
          var scaleMinorTicksArr = scale.minorTicks().get();
          i = 0;
          j = 0;
          var minorTicksArrLen = scaleMinorTicksArr.length;
          var minorTickVal, minorRatio;
          var isMinorLabels = this.minorLabels().enabled();

          while (i < ticksArrLen || j < minorTicksArrLen) {
            tickVal = scaleTicksArr[i];
            minorTickVal = scaleMinorTicksArr[j];
            ratio = scale.transform(tickVal);
            minorRatio = scale.transform(minorTickVal);
            bounds1 = bounds2 = bounds3 = bounds4 = null;

            if (nextDrawableLabel == -1 && isLabels) {
              k = i;
              while (nextDrawableLabel == -1 && k < ticksArrLen) {
                if ((k == 0 && this.drawFirstLabel()) || (k == ticksArrLen - 1 && this.drawLastLabel()) || (k != 0 && k != ticksArrLen - 1))
                  bounds1 = this.getLabelBounds_(k, true, opt_bounds);
                else
                  bounds1 = null;

                if (prevDrawableLabel != -1)
                  bounds2 = this.getLabelBounds_(prevDrawableLabel, true, opt_bounds);
                else
                  bounds2 = null;

                if (k != ticksArrLen - 1 && this.drawLastLabel())
                  bounds3 = this.getLabelBounds_(ticksArrLen - 1, true, opt_bounds);
                else
                  bounds3 = null;

                if (!(anychart.math.checkRectIntersection(bounds1, bounds2) ||
                    anychart.math.checkRectIntersection(bounds1, bounds3))) {
                  tempRatio = scale.transform(scaleTicksArr[k]);
                  if ((tempRatio <= 0 && this.drawFirstLabel()) || (tempRatio >= 1 && this.drawLastLabel()))
                    nextDrawableLabel = k;
                  else if (tempRatio > 0 && tempRatio < 1)
                    nextDrawableLabel = k;
                }
                k++;
              }
            }

            if (((ratio <= minorRatio && i < ticksArrLen) || j == minorTicksArrLen)) {
              if (isLabels && i == nextDrawableLabel && this.labels().enabled()) {
                prevDrawableLabel = i;
                nextDrawableLabel = -1;
                labels.push(true);
              } else {
                labels.push(false);
              }
              i++;
              if (ratio == minorRatio && (this.labels().enabled() || this.ticks().enabled())) {
                minorLabels.push(false);
                j++;
              }
            } else {
              if (isMinorLabels) {
                bounds1 = this.getLabelBounds_(j, false, opt_bounds);

                if (prevDrawableLabel != -1)
                  bounds2 = this.getLabelBounds_(prevDrawableLabel, true, opt_bounds);

                if (nextDrawableLabel != -1)
                  bounds3 = this.getLabelBounds_(nextDrawableLabel, true, opt_bounds);

                if (prevDrawableMinorLabel != -1)
                  bounds4 = this.getLabelBounds_(prevDrawableMinorLabel, false, opt_bounds);

                var label = this.minorLabels().getLabel(j);
                var isLabelEnabled = label ?
                    goog.isDef(label.enabled()) ?
                        label.enabled() :
                        true :
                    true;

                if (!(anychart.math.checkRectIntersection(bounds1, bounds2) ||
                    anychart.math.checkRectIntersection(bounds1, bounds3) ||
                    anychart.math.checkRectIntersection(bounds1, bounds4)) && isLabelEnabled) {

                  tempRatio = scale.transform(scaleMinorTicksArr[j]);
                  if ((tempRatio <= 0 && this.drawFirstLabel()) || (tempRatio >= 1 && this.drawLastLabel())) {
                    prevDrawableMinorLabel = j;
                    minorLabels.push(true);
                  } else if (tempRatio > 0 && tempRatio < 1) {
                    prevDrawableMinorLabel = j;
                    minorLabels.push(true);
                  } else {
                    minorLabels.push(false);
                  }

                } else {
                  minorLabels.push(false);
                }
              } else {
                minorLabels.push(false);
              }
              j++;
            }
          }
          if (!isMinorLabels) minorLabels = false;
        } else if (scale instanceof anychart.scales.Ordinal) {
          for (i = 0; i < ticksArrLen; i++) {
            if (isLabels) {
              if ((i == 0 && this.drawFirstLabel()) || (i == ticksArrLen - 1 && this.drawLastLabel()) || (i != 0 && i != ticksArrLen - 1))
                bounds1 = this.getLabelBounds_(i, true, opt_bounds);
              else
                bounds1 = null;

              if (prevDrawableLabel != -1)
                bounds2 = this.getLabelBounds_(prevDrawableLabel, true, opt_bounds);
              else
                bounds2 = null;

              if (i != ticksArrLen - 1 && this.drawLastLabel())
                bounds3 = this.getLabelBounds_(ticksArrLen - 1, true, opt_bounds);
              else
                bounds3 = null;

              if (i == 0) {
                if (this.drawFirstLabel()) {
                  prevDrawableLabel = i;
                  labels.push(true);
                } else {
                  labels.push(false);
                }
              } else if (i == ticksArrLen - 1) {
                if (this.drawLastLabel()) {
                  prevDrawableLabel = i;
                  labels.push(true);
                } else {
                  labels.push(false);
                }
              } else if (!(anychart.math.checkRectIntersection(bounds1, bounds2) ||
                  anychart.math.checkRectIntersection(bounds1, bounds3))) {
                prevDrawableLabel = i;
                labels.push(true);
              } else {
                labels.push(false);
              }
            } else {
              labels.push(false);
            }
          }
        }
      }
      if (!isLabels) labels = false;
      this.overlappedLabels_ = {labels: labels, minorLabels: minorLabels};
    }
    this.markConsistent(anychart.ConsistencyState.AXIS_OVERLAP);
  }
  return this.overlappedLabels_;
};


/**
 * @private
 */
anychart.core.axes.Linear.prototype.dropStaggeredLabelsCache_ = function() {
  this.staggeredLabels_ = null;
};


/**
 * Applies stagger labels mode and returns an object with indexes of labels to draw.
 * @param {anychart.math.Rect=} opt_bounds Parent bounds.
 * @return {boolean|Object.<string, boolean|Array.<boolean>>} Object with indexes of labels to draw.
 * or Boolean when there are no labels.
 * @private
 */
anychart.core.axes.Linear.prototype.applyStaggerMode_ = function(opt_bounds) {
  if (!this.staggeredLabels_) {
    var scale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.scale());
    if (!(scale && this.labels().enabled()))
      return this.staggeredLabels_ = {labels: false, minorLabels: false};

    this.staggerAutoLines_ = 1;
    this.currentStageLines_ = 1;
    var labels;
    var scaleTicksArr = scale.ticks().get();
    var ticksArrLen = scaleTicksArr.length;
    var i, j, k, bounds1, bounds2, bounds3, states;

    if (!goog.isNull(this.staggerLines_)) {
      this.currentStageLines_ = this.staggerLines_;
    } else {
      var isConvergence = false;
      i = 1;
      while (!isConvergence && i <= ticksArrLen) {
        isConvergence = true;

        for (k = 0; k < i; k++) {
          for (j = k; j < ticksArrLen - i; j = j + i) {
            bounds1 = this.getLabelBounds_(j, true, opt_bounds);
            bounds2 = this.getLabelBounds_(j + i, true, opt_bounds);

            if (anychart.math.checkRectIntersection(bounds1, bounds2)) {
              isConvergence = false;
              i++;
              break;
            }
          }
          if (!isConvergence) break;
        }
      }
      this.staggerAutoLines_ = isConvergence ? i : ticksArrLen;

      if (!goog.isNull(this.staggerMaxLines_) && this.staggerAutoLines_ > this.staggerMaxLines_) {
        this.currentStageLines_ = this.staggerMaxLines_;
      } else {
        this.currentStageLines_ = this.staggerAutoLines_;
      }
    }

    var limitedLineNumber = (!goog.isNull(this.staggerLines_) ||
        !goog.isNull(this.staggerMaxLines_) && this.staggerAutoLines_ > this.staggerMaxLines_);

    if (limitedLineNumber && this.overlapMode() == anychart.enums.LabelsOverlapMode.NO_OVERLAP) {
      states = [];
      for (j = 0; j < this.currentStageLines_; j++) {
        var prevDrawableLabel = -1;
        for (i = j; i < ticksArrLen; i = i + this.currentStageLines_) {
          bounds1 = this.getLabelBounds_(i, true, opt_bounds);

          if (prevDrawableLabel != -1)
            bounds2 = this.getLabelBounds_(prevDrawableLabel, true, opt_bounds);
          else
            bounds2 = null;

          if (i != ticksArrLen - 1 && this.drawLastLabel())
            bounds3 = this.getLabelBounds_(ticksArrLen - 1, true, opt_bounds);
          else
            bounds3 = null;

          if (i == 0) {
            if (this.drawFirstLabel()) {
              prevDrawableLabel = i;
              states[i] = true;
            } else {
              states[i] = false;
            }
          } else if (i == ticksArrLen - 1) {
            if (this.drawLastLabel()) {
              prevDrawableLabel = i;
              states[i] = true;
            } else {
              states[i] = false;
            }
          } else if (!(anychart.math.checkRectIntersection(bounds1, bounds2) ||
              anychart.math.checkRectIntersection(bounds1, bounds3))) {
            prevDrawableLabel = i;
            states[i] = true;
          } else {
            states[i] = false;
          }
        }
      }
      if (!this.drawFirstLabel()) states[0] = false;
      if (!this.drawLastLabel()) states[states.length - 1] = false;
      labels = {labels: states, minorLabels: false};
    } else {
      if (!this.drawFirstLabel() || !this.drawLastLabel()) {
        states = [];
        for (i = 0; i < ticksArrLen; i++) {
          if (i == 0 && !this.drawFirstLabel()) states[i] = false;
          else if (i == ticksArrLen - 1 && !this.drawLastLabel()) states[i] = false;
          else states[i] = true;
        }
      }
      labels = {labels: states ? states : true, minorLabels: false};
    }

    this.linesSize_ = [];
    this.staggerLabelslines_ = [];
    if (!this.labelsBoundingRects_) this.labelsBoundingRects_ = [];
    var bounds;
    k = 0;
    for (i = 0; i < ticksArrLen; i++) {
      if (!states || (states && states[i])) {
        if (this.labelsBoundingRects_[i]) {
          bounds = this.labelsBoundingRects_[i];
        } else {
          var points = this.getLabelBounds_(i, true, opt_bounds);
          this.labelsBoundingRects_[i] = bounds = anychart.math.Rect.fromCoordinateBox(points);
        }

        var size = this.isHorizontal() ? bounds.height : bounds.width;
        if (!this.linesSize_[k] || this.linesSize_[k] < size) this.linesSize_[k] = size;
        if (!this.staggerLabelslines_[k]) this.staggerLabelslines_[k] = [];
        this.staggerLabelslines_[k].push(i);
        (k + 1) % this.currentStageLines_ == 0 ? k = 0 : k++;
      }
    }

    return this.staggeredLabels_ = labels;
  } else {
    return this.staggeredLabels_;
  }
};


/**
 * Calculate labels to draw.
 * @param {anychart.math.Rect=} opt_bounds Parent bounds.
 * @return {boolean|Object.<string, boolean|Array.<boolean>>} Object with indexes of labels to draw.
 * or Boolean when there are no labels.
 * @private
 */
anychart.core.axes.Linear.prototype.calcLabels_ = function(opt_bounds) {
  return this.staggerMode() ?
      this.applyStaggerMode_(opt_bounds) :
      this.getOverlappedLabels_(opt_bounds);
};


/**
 * Calculates the size of an axis (for horizontal - height, for vertical - width)
 * @param {anychart.math.Rect} parentBounds Parent bounds.
 * @param {number} length Axis length.
 * @return {number} Size.
 * @private
 */
anychart.core.axes.Linear.prototype.getSize_ = function(parentBounds, length) {
  var bounds, size, i, delta, len;
  var maxLabelSize = 0;
  var maxMinorLabelSize = 0;
  var ticksLength = 0;
  var minorTicksLength = 0;
  var titleSize = 0;

  var title = this.title();
  var ticks = this.ticks();
  var minorTicks = this.minorTicks();
  var labels = this.labels();
  var minorLabels = this.minorLabels();
  var orientation = /** @type {anychart.enums.Orientation} */(this.orientation());

  var line = this.line_;
  line.stroke(this.stroke_);

  if (title.enabled()) {
    if (!title.container()) title.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    title.suspendSignalsDispatching();
    title.parentBounds(parentBounds);
    title.orientation(orientation);
    titleSize = this.isHorizontal() ? title.getContentBounds().height : title.getContentBounds().width;
    title.resumeSignalsDispatching(false);
  }

  if (ticks.enabled() && ticks.position() == anychart.enums.SidePosition.OUTSIDE) {
    ticksLength = ticks.length();
  }

  if (minorTicks.enabled() && minorTicks.position() == anychart.enums.SidePosition.OUTSIDE) {
    minorTicksLength = minorTicks.length();
  }

  var scale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.scale());

  var isLabels = /** @type {boolean} */(labels.enabled() && goog.isDef(scale));
  var isMinorLabels = /** @type {boolean} */(minorLabels.enabled() && goog.isDef(scale) && scale instanceof anychart.scales.ScatterBase);

  var width = this.isHorizontal() ? length : 0;
  var height = this.isHorizontal() ? 0 : length;

  var tempBounds = new anychart.math.Rect(0, 0, width, height);

  var overlappedLabels = this.calcLabels_(tempBounds);

  var ticksArr;

  if (isLabels) {
    ticksArr = scale.ticks().get();
    var drawLabels = goog.isObject(overlappedLabels) ? overlappedLabels.labels : !overlappedLabels;
    if (this.staggerMode()) {
      for (i = 0; i < this.linesSize_.length; i++) {
        maxLabelSize += this.linesSize_[i];
      }
    } else {
      for (i = 0, len = ticksArr.length; i < len; i++) {
        var drawLabel = goog.isArray(drawLabels) ? drawLabels[i] : drawLabels;
        if (drawLabel) {
          bounds = goog.math.Rect.fromCoordinateBox(this.getLabelBounds_(i, true, tempBounds));
          size = this.isHorizontal() ? bounds.height : bounds.width;
          if (size > maxLabelSize) maxLabelSize = size;
        }
      }
    }
  }

  if (isMinorLabels && !this.staggerMode()) {
    var drawMinorLabels = goog.isObject(overlappedLabels) ? overlappedLabels.minorLabels : !overlappedLabels;
    for (i = 0, len = drawMinorLabels.length; i < len; i++) {
      var drawMinorLabel = goog.isArray(drawMinorLabels) ? drawMinorLabels[i] : drawMinorLabels;
      if (drawMinorLabel) {
        bounds = goog.math.Rect.fromCoordinateBox(this.getLabelBounds_(i, false, tempBounds));
        size = this.isHorizontal() ? bounds.height : bounds.width;
        if (size > maxMinorLabelSize) maxMinorLabelSize = size;
      }
    }
  }

  var minorSize = maxMinorLabelSize + minorTicksLength;
  var majorSize = maxLabelSize + ticksLength;

  var ticksAndLabelsSize = (minorSize > majorSize) ? minorSize : majorSize;
  delta = ticksAndLabelsSize + titleSize;
  return /** @type {number} */(delta);
};


/**
 * Returns remaining parent bounds to use elsewhere.
 * @example <t>simple-h100</t>
 * var axis = anychart.axes.linear();
 * axis
 *     .orientation('left')
 *     .scale(anychart.scales.ordinal().values([1,2,3]))
 *     .container(stage).draw();
 * var label = anychart.ui.label();
 * label
 *     .parentBounds(axis.getRemainingBounds())
 *     .width('100%')
 *     .height('100%')
 *     .padding(15)
 *     .background()
 *       .enabled(true)
 *       .fill('blue 0.2')
 * label.container(stage).draw();
 * @return {!anychart.math.Rect} Parent bounds without the space used by the title.
 */
anychart.core.axes.Linear.prototype.getRemainingBounds = function() {
  var parentBounds = this.parentBounds();

  if (parentBounds) {
    var remainingBounds = parentBounds.clone();
    var axisBounds = this.getPixelBounds_();
    var padding = this.padding();
    var widenHeight = padding.widenHeight(axisBounds.height);
    var widenWidth = padding.widenWidth(axisBounds.width);

    switch (this.orientation()) {
      case anychart.enums.Orientation.TOP:
        remainingBounds.height -= widenHeight;
        remainingBounds.top += widenHeight;
        break;
      case anychart.enums.Orientation.RIGHT:
        remainingBounds.width -= widenWidth;
        break;
      case anychart.enums.Orientation.BOTTOM:
        remainingBounds.height -= widenHeight;
        break;
      case anychart.enums.Orientation.LEFT:
        remainingBounds.width -= widenWidth;
        remainingBounds.left += widenWidth;
        break;
    }

    return remainingBounds;
  } else return new anychart.math.Rect(0, 0, 0, 0);
};


/**
 * Calculate label bounds.
 * @param {number} index Label index.
 * @param {boolean} isMajor Major labels or minor.
 * @param {anychart.math.Rect=} opt_parentBounds Parent bounds.
 * @return {Array.<number>} Label bounds.
 * @private
 */
anychart.core.axes.Linear.prototype.getLabelBounds_ = function(index, isMajor, opt_parentBounds) {
  if (!isMajor && this.scale() && !(this.scale() instanceof anychart.scales.ScatterBase))
    return null;

  var boundsCache = isMajor ? this.labelsBounds_ : this.minorLabelsBounds_;
  if (goog.isDef(boundsCache[index]))
    return boundsCache[index];

  var bounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.getPixelBounds_();
  var lineBounds = goog.isDef(opt_parentBounds) ? opt_parentBounds : this.line_.getBounds();
  var ticks = isMajor ? this.ticks() : this.minorTicks();
  var ticksLength = ticks.length();
  var lineThickness = this.line_.stroke()['thickness'] ? this.line_.stroke()['thickness'] : 1;
  var labels = isMajor ? this.labels() : this.minorLabels();

  var x, y;
  var scale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.scale());
  var scaleTicks = isMajor ? scale.ticks() : scale.minorTicks();

  var value = scaleTicks.get()[index];
  var ratio;
  if (goog.isArray(value)) {
    ratio = (scale.transform(value[0], 0) + scale.transform(value[1], 1)) / 2;
    value = value[0];
  } else {
    ratio = scale.transform(value, .5);
  }

  var isEnabled = ticks.enabled();
  var position = ticks.position();

  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      x = Math.round(bounds.left + ratio * bounds.width);
      y = lineBounds.top - lineThickness / 2;
      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        y -= ticksLength;
      }
      break;
    case anychart.enums.Orientation.RIGHT:
      x = lineBounds.left + lineThickness / 2;
      y = Math.round(bounds.top + ratio * bounds.height);

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        x += ticksLength;
      }
      break;
    case anychart.enums.Orientation.BOTTOM:
      x = Math.round(bounds.left + ratio * bounds.width);
      y = lineBounds.top + lineThickness / 2;

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        y += ticksLength;
      }
      break;
    case anychart.enums.Orientation.LEFT:
      x = lineBounds.left - lineThickness / 2;
      y = Math.round(bounds.top + ratio * bounds.height);

      if (position == anychart.enums.SidePosition.OUTSIDE && isEnabled) {
        x -= ticksLength;
      }
      break;
  }

  var formatProvider = this.getLabelsFormatProvider_(index, value);
  var positionProvider = {'value': {'x': x, 'y': y}};

  var labelBounds = labels.measure(formatProvider, positionProvider, undefined, index);

  switch (this.orientation()) {
    case anychart.enums.Orientation.TOP:
      labelBounds.top += labelBounds.height / 2;
      break;
    case anychart.enums.Orientation.RIGHT:
      labelBounds.left += labelBounds.width / 2;
      break;
    case anychart.enums.Orientation.BOTTOM:
      labelBounds.top += labelBounds.height / 2;
      break;
    case anychart.enums.Orientation.LEFT:
      labelBounds.left += labelBounds.width / 2;
      break;
  }


  return boundsCache[index] = labelBounds.toCoordinateBox();
};


/**
 * Getter for the first label drawing flag.
 * @return {boolean} Drawing flag.
 *//**
 * Setter for the first label drawing flag.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.4, 1.6, 1.9]);
 * chart.yAxis().drawFirstLabel(false);
 * @param {boolean=} opt_value [true] Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_value Drawing flag.
 * @return {boolean|!anychart.core.axes.Linear} Drawing flag or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.drawFirstLabel = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.drawFirstLabel_ != opt_value) {
      this.drawFirstLabel_ = opt_value;
      this.dropStaggeredLabelsCache_();
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.drawFirstLabel_;
};


/**
 * Getter for the last label drawing flag.
 * @return {boolean} Drawing flag.
 *//**
 * Setter for the last label drawing flag.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.4, 1.6, 1.9]);
 * chart.yAxis().drawFirstLabel(false);
 * @param {boolean=} opt_value [true] Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_value Drawing flag.
 * @return {boolean|!anychart.core.axes.Linear} Drawing flag or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.drawLastLabel = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.drawLastLabel_ != opt_value) {
      this.drawLastLabel_ = opt_value;
      this.dropStaggeredLabelsCache_();
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.drawLastLabel_;
};


/**
 * Getter for overlap mode for labels.
 * @return {anychart.enums.LabelsOverlapMode} OverlapMode flag.
 *//**
 * Setter for overlap mode for labels.
 * @example <t>lineChart</t>
 * var data = [
 *     ['2002 January', 1],
 *     ['2002 Febrary', 2],
 *     ['2002 March', 4],
 *     ['2002 April', 3],
 *     ['2002 May', 2],
 *     ['2002 June', 4],
 *     ['2002 Jule', 5],
 *     ['2002 August', 1]
 * ];
 * chart.xAxis().staggerMode(false).overlapMode(true);
 * chart.line(data);
 * @param {(anychart.enums.LabelsOverlapMode|string)=} opt_value [anychart.enums.LabelsOverlapMode.NO_OVERLAP] Value to set.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.enums.LabelsOverlapMode|string)=} opt_value Value to set.
 * @return {anychart.enums.LabelsOverlapMode|!anychart.core.axes.Linear} Drawing flag or itself for method chaining.
 */
anychart.core.axes.Linear.prototype.overlapMode = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var overlap = anychart.enums.normalizeLabelsOverlapMode(opt_value, this.overlapMode_);
    if (this.overlapMode_ != overlap) {
      this.overlapMode_ = overlap;
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.overlapMode_;
};


/**
 * Getter for stagger mode state.
 * @return {boolean} Current stagger mode state.
 *//**
 * Setter for stagger mode state.
 * @example <t>lineChart</t>
 * var data = [
 *     ['January', 1],
 *     ['Febrary', 2],
 *     ['March', 4],
 *     ['April', 3],
 *     ['May', 2],
 *     ['June', 4],
 *     ['Jule', 5],
 *     ['August', 1]
 * ];
 * chart.xAxis().staggerMode(true);
 * chart.line(data);
 * @param {boolean=} opt_value [true] On/off stagger mode.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_value On/off.
 * @return {boolean|!anychart.core.axes.Linear} .
 */
anychart.core.axes.Linear.prototype.staggerMode = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.staggerMode_ != opt_value) {
      this.staggerMode_ = opt_value;
      this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.staggerMode_;
};


/**
 * Getter for stagger lines.
 * @return {?number} Current stagger line settings.
 *//**
 * Setter for stagger lines.<br/>
 * <b>Note:</b> pass <b>null</b> to enable autocalculation.
 * @example <t>lineChart</t>
 * var data = [
 *     ['January', 1],
 *     ['Febrary', 2],
 *     ['March', 4],
 *     ['April', 3],
 *     ['May', 2],
 *     ['June', 4],
 *     ['Jule', 5],
 *     ['August', 1]
 * ];
 * chart.xAxis().staggerLines(4);
 * chart.line(data);
 * @param {?number=} opt_value [null] Count of stager lines.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(number|null)=} opt_value Fixed/auto.
 * @return {null|number|!anychart.core.axes.Linear} .
 */
anychart.core.axes.Linear.prototype.staggerLines = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = goog.isNull(opt_value) ? null : anychart.utils.normalizeToNaturalNumber(opt_value);
    if (this.staggerLines_ != opt_value) {
      this.staggerLines_ = opt_value;
      this.dropStaggeredLabelsCache_();
      if (this.staggerMode_)
        this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.staggerLines_;
};


/**
 * Getter for maximum stagger lines.
 * @return {?number} Current stagger line settings.
 *//**
 * Setter for maximum stagger lines in autocalculation mode (if {@link anychart.core.axes.Linear#staggerLines} passed null).<br/>
 * @example
 * var leftChart = anychart.cartesian();
 * var data = [
 *     ['January', 1],
 *     ['Febrary', 2],
 *     ['March', 4],
 *     ['April', 3],
 *     ['May', 2],
 *     ['June', 4],
 *     ['Jule', 5],
 *     ['August', 1]
 * ];
 * leftChart.xAxis().staggerLines(4);
 * leftChart.line(data);
 * leftChart.bounds(anychart.math.rect(0,0,'49%','100%'));
 * leftChart.container(stage).draw();
 * var rightChart = anychart.cartesian();
 * var data = [
 *     ['January', 1],
 *     ['Febrary', 2],
 *     ['March', 4],
 *     ['April', 3],
 *     ['May', 2],
 *     ['June', 4],
 *     ['Jule', 5],
 *     ['August', 1]
 * ];
 * rightChart.xAxis().staggerMaxLines(2);
 * rightChart.line(data);
 * rightChart.bounds(anychart.math.rect('51%',0,'50%','100%'));
 * rightChart.container(stage).draw();
 * @param {(number|null)=} opt_value [2] Limits the number of lines to be used when drawing labels. If we need less – we use less, but never – more.
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(number|null)=} opt_value .
 * @return {null|number|!anychart.core.axes.Linear} .
 */
anychart.core.axes.Linear.prototype.staggerMaxLines = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.utils.normalizeToNaturalNumber(opt_value);
    if (this.staggerMaxLines_ != opt_value) {
      this.staggerMaxLines_ = opt_value;
      this.dropStaggeredLabelsCache_();
      if (this.staggerMode_)
        this.invalidate(this.ALL_VISUAL_STATES_, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.staggerMaxLines_;
};


/**
 * Whether an axis is horizontal.
 * @return {boolean} If the axis is horizontal.
 */
anychart.core.axes.Linear.prototype.isHorizontal = function() {
  var orientation = this.orientation();
  return orientation == anychart.enums.Orientation.TOP ||
      orientation == anychart.enums.Orientation.BOTTOM;
};


/**
 * Axis line drawer for top orientation.
 * @param {number} pixelShift Pixel shift for sharp display.
 * @private
 */
anychart.core.axes.Linear.prototype.drawTopLine_ = function(pixelShift) {
  var lineThickness = this.stroke()['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var bounds = this.getPixelBounds_();
  var y = bounds.top + bounds.height + lineThickness / 2;
  this.line_
      .moveTo(bounds.left + pixelShift, y)
      .lineTo(bounds.left - pixelShift + bounds.width, y);
};


/**
 * Axis line drawer for right orientation.
 * @param {number} pixelShift Pixel shift for sharp display..
 * @private
 */
anychart.core.axes.Linear.prototype.drawRightLine_ = function(pixelShift) {
  var lineThickness = this.stroke()['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var bounds = this.getPixelBounds_();
  var x = bounds.left - lineThickness / 2;
  this.line_
      .moveTo(x, bounds.top + pixelShift)
      .lineTo(x, bounds.top - pixelShift + bounds.height);
};


/**
 * Axis line drawer for bottom orientation.
 * @param {number} pixelShift Pixel shift for sharp display.
 * @private
 */
anychart.core.axes.Linear.prototype.drawBottomLine_ = function(pixelShift) {
  var lineThickness = this.stroke()['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var bounds = this.getPixelBounds_();
  var y = bounds.top - lineThickness / 2;
  this.line_
      .moveTo(bounds.left + pixelShift, y)
      .lineTo(bounds.left - pixelShift + bounds.width, y);
};


/**
 * Axis line drawer for left orientation.
 * @param {number} pixelShift Pixel shift for sharp display.
 * @private
 */
anychart.core.axes.Linear.prototype.drawLeftLine_ = function(pixelShift) {
  var lineThickness = this.stroke()['thickness'] ? parseFloat(this.stroke()['thickness']) : 1;
  var bounds = this.getPixelBounds_();
  var x = bounds.left + bounds.width + lineThickness / 2;
  this.line_
      .moveTo(x, bounds.top + pixelShift)
      .lineTo(x, bounds.top - pixelShift + bounds.height);
};


/**
 * Gets format provider for label.
 * @param {number} index Label index.
 * @param {string|number} value Label value.
 * @return {Object} Labels format provider.
 * @private
 */
anychart.core.axes.Linear.prototype.getLabelsFormatProvider_ = function(index, value) {
  var scale = this.scale();

  var labelText, labelValue;
  if (scale instanceof anychart.scales.Linear) {
    labelText = parseFloat(value);
    labelValue = parseFloat(value);
  } else if (scale instanceof anychart.scales.Ordinal) {
    labelText = scale.ticks().names()[index];
    labelValue = value;
  } else if (scale instanceof anychart.scales.DateTime) {
    var date = new Date(value);
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yy = date.getFullYear();

    mm = mm < 10 ? '0' + mm : '' + mm;
    dd = dd < 10 ? '0' + dd : '' + dd;

    labelText = mm + '-' + dd + '-' + yy;
    labelValue = value;
  }

  return {
    'index': index,
    'value': labelText,
    'tickValue': labelValue,
    'max': scale.max ? scale.max : null,
    'min': scale.min ? scale.min : null,
    'scale': scale
    //TODO as soon as it is possible:
    //sum -- the sum data values from series bound to this axis (depends on orientation)
    //average -- the sum divided by the number of points
    //median -- axis median
    //mode -- axis mode
  };
};


/**
 * Axis labels drawer.
 * @param {number|string} value Scale ratio.
 * @param {number} ratio Scale ratio.
 * @param {number} index Scale label index.
 * @param {number} pixelShift Pixel shift for sharp display.
 * @param {boolean} isMajor Is major label.
 * @private
 */
anychart.core.axes.Linear.prototype.drawLabel_ = function(value, ratio, index, pixelShift, isMajor) {
  var bounds = this.getPixelBounds_();
  var lineBounds = this.line_.getBounds();

  var ticksLength, labels, ticks;
  if (isMajor) {
    ticks = this.ticks();
    ticksLength = ticks.length();
    labels = this.labels();
  } else {
    ticks = this.minorTicks();
    ticksLength = ticks.length();
    labels = this.minorLabels();
  }

  var lineThickness = this.line_.stroke()['thickness'] ? this.line_.stroke()['thickness'] : 1;
  var labelBounds = anychart.math.Rect.fromCoordinateBox(this.getLabelBounds_(index, isMajor));
  var orientation = this.orientation();
  var staggerSize = 0;

  if (isMajor) {
    var incSize = true;
    if (this.currentStageLines_ > 1 && this.staggerMode()) {
      for (var i = 0, len = this.staggerLabelslines_.length; i < len; i++) {
        var line = this.staggerLabelslines_[i];
        for (var j = 0, len_ = line.length; j < len_; j++) {
          if (index == line[j]) {
            incSize = false;
            break;
          }
        }
        if (!incSize) break;
        staggerSize += this.linesSize_[i];
      }
    }
  }

  var x, y;
  switch (orientation) {
    case anychart.enums.Orientation.TOP:
      x = Math.round(bounds.left + ratio * bounds.width) + pixelShift;
      y = lineBounds.top - lineThickness / 2 - labelBounds.height / 2 - staggerSize;

      if (this.ticks_.position() == anychart.enums.SidePosition.OUTSIDE && ticks.enabled()) {
        y -= ticksLength;
      }
      break;
    case anychart.enums.Orientation.RIGHT:
      x = lineBounds.left + lineThickness / 2 + labelBounds.width / 2 + staggerSize;
      y = Math.round(bounds.top + bounds.height - ratio * bounds.height) + pixelShift;

      if (this.ticks_.position() == anychart.enums.SidePosition.OUTSIDE && ticks.enabled()) {
        x += ticksLength;
      }
      break;
    case anychart.enums.Orientation.BOTTOM:
      x = Math.round(bounds.left + ratio * bounds.width) + pixelShift;
      y = lineBounds.top + lineThickness / 2 + labelBounds.height / 2 + staggerSize;

      if (this.ticks_.position() == anychart.enums.SidePosition.OUTSIDE && ticks.enabled()) {
        y += ticksLength;
      }
      break;
    case anychart.enums.Orientation.LEFT:
      x = lineBounds.left - lineThickness / 2 - labelBounds.width / 2 - staggerSize;
      y = Math.round(bounds.top + bounds.height - ratio * bounds.height) + pixelShift;

      if (this.ticks_.position() == anychart.enums.SidePosition.OUTSIDE && ticks.enabled()) {
        x -= ticksLength;
      }
      break;
  }

  var formatProvider = this.getLabelsFormatProvider_(index, value);
  var positionProvider = {'value': {x: x, y: y}};

  labels.add(formatProvider, positionProvider, index);
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.checkDrawingNeeded = function() {
  if (this.isConsistent())
    return false;

  if (!this.enabled()) {
    if (this.hasInvalidationState(anychart.ConsistencyState.ENABLED)) {
      this.remove();
      this.markConsistent(anychart.ConsistencyState.ENABLED);
      this.title().invalidate(anychart.ConsistencyState.CONTAINER);
      this.ticks().invalidate(anychart.ConsistencyState.CONTAINER);
      this.minorTicks().invalidate(anychart.ConsistencyState.CONTAINER);
      this.labels().invalidate(anychart.ConsistencyState.CONTAINER);
      this.minorLabels().invalidate(anychart.ConsistencyState.CONTAINER);
      this.invalidate(
          anychart.ConsistencyState.CONTAINER |
          anychart.ConsistencyState.AXIS_TITLE |
          anychart.ConsistencyState.AXIS_TICKS |
          anychart.ConsistencyState.AXIS_LABELS
      );
    }
    return false;
  }
  this.markConsistent(anychart.ConsistencyState.ENABLED);
  return true;
};


/**
 * Axis drawing.
 * @return {anychart.core.axes.Linear} An instance of {@link anychart.core.axes.Linear} class for method chaining.
 */
anychart.core.axes.Linear.prototype.draw = function() {
  var scale = /** @type {anychart.scales.Linear|anychart.scales.Ordinal} */(this.scale());

  if (!scale) {
    anychart.utils.error(anychart.enums.ErrorCode.SCALE_NOT_SET);
    return this;
  }

  if (!this.checkDrawingNeeded())
    return this;

  var lineDrawer, ticksDrawer, minorTicksDrawer;
  var minorTicks, ticks;
  var lineThickness;
  var orientation = /** @type {anychart.enums.Orientation} */(this.orientation());

  this.title().suspendSignalsDispatching();
  this.labels().suspendSignalsDispatching();
  this.minorLabels().suspendSignalsDispatching();
  this.ticks().suspendSignalsDispatching();
  this.minorTicks().suspendSignalsDispatching();

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    if (!this.line_) {
      this.line_ = acgraph.path();
      this.registerDisposable(this.line_);
    }
    this.line_.clear();
    this.line_.stroke(this.stroke_);

    lineThickness = this.line_.stroke()['thickness'] ? parseFloat(this.line_.stroke()['thickness']) : 1;
    var pixelShift = lineThickness % 2 == 0 ? 0 : 0.5;

    switch (orientation) {
      case anychart.enums.Orientation.TOP:
        lineDrawer = this.drawTopLine_;
        break;
      case anychart.enums.Orientation.RIGHT:
        lineDrawer = this.drawRightLine_;
        break;
      case anychart.enums.Orientation.BOTTOM:
        lineDrawer = this.drawBottomLine_;
        break;
      case anychart.enums.Orientation.LEFT:
        lineDrawer = this.drawLeftLine_;
        break;
    }
    lineDrawer.call(this, pixelShift);

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */(this.zIndex());
    this.title().zIndex(zIndex);
    this.line_.zIndex(zIndex);
    this.ticks().zIndex(zIndex);
    this.minorTicks().zIndex(zIndex);
    this.labels().zIndex(zIndex);
    this.minorLabels().zIndex(zIndex);
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.title().container(container);
    this.line_.parent(container);
    this.ticks().container(container);
    this.minorTicks().container(container);

    this.labels().container(container);
    this.minorLabels().container(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_TITLE)) {
    var title = this.title();
    title.parentBounds(this.getPixelBounds_());
    title.orientation(orientation);
    title.draw();
    this.markConsistent(anychart.ConsistencyState.AXIS_TITLE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_TICKS)) {
    ticks = this.ticks();
    ticks.orientation(/** @type {anychart.enums.Orientation} */ (orientation));
    ticks.draw();
    ticksDrawer = ticks.getTicksDrawer();

    minorTicks = this.minorTicks();
    minorTicks.orientation(/** @type {anychart.enums.Orientation} */ (orientation));
    minorTicks.draw();
    minorTicksDrawer = minorTicks.getTicksDrawer();

    this.markConsistent(anychart.ConsistencyState.AXIS_TICKS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.AXIS_LABELS)) {
    var labels = this.labels();
    if (!labels.container()) labels.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    labels.parentBounds(/** @type {anychart.math.Rect} */(this.parentBounds()));
    labels.clear();

    var minorLabels = this.minorLabels();
    if (!minorLabels.container()) minorLabels.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    minorLabels.parentBounds(/** @type {anychart.math.Rect} */(this.parentBounds()));
    minorLabels.clear();

    this.markConsistent(anychart.ConsistencyState.AXIS_LABELS);
  }

  if (goog.isDef(ticksDrawer) || goog.isDef(minorTicksDrawer)) {
    var i, j, overlappedLabels, needDrawLabels, needDrawMinorLabels;

    var scaleTicksArr = scale.ticks().get();
    var ticksArrLen = scaleTicksArr.length;
    var tickThickness = this.ticks().stroke()['thickness'] ? parseFloat(this.ticks_.stroke()['thickness']) : 1;
    var tickVal, ratio, drawLabel, drawTick;
    var pixelBounds = this.getPixelBounds_();
    var lineBounds = this.line_.getBounds();
    lineThickness = this.line_.stroke()['thickness'] ? parseFloat(this.line_.stroke()['thickness']) : 1;

    if (scale instanceof anychart.scales.ScatterBase) {
      overlappedLabels = this.calcLabels_();

      if (goog.isObject(overlappedLabels)) {
        needDrawLabels = overlappedLabels.labels;
        needDrawMinorLabels = overlappedLabels.minorLabels;
      } else {
        needDrawLabels = !overlappedLabels;
        needDrawMinorLabels = !overlappedLabels;
      }

      var scaleMinorTicksArr = scale.minorTicks().get();
      var minorTickThickness = this.minorTicks_.stroke()['thickness'] ? parseFloat(this.minorTicks_.stroke()['thickness']) : 1;

      i = 0;
      j = 0;
      var minorTicksArrLen = scaleMinorTicksArr.length;
      var minorTickVal, minorRatio, prevMajorRatio;

      while (i < ticksArrLen || j < minorTicksArrLen) {
        tickVal = scaleTicksArr[i];
        minorTickVal = scaleMinorTicksArr[j];
        ratio = scale.transform(tickVal);
        minorRatio = scale.transform(minorTickVal);

        if (((ratio <= minorRatio && i < ticksArrLen) || j == minorTicksArrLen)) {
          var majorPixelShift = tickThickness % 2 == 0 ? 0 : -.5;
          drawLabel = goog.isArray(needDrawLabels) ? needDrawLabels[i] : needDrawLabels;
          drawTick = (goog.isArray(needDrawLabels) && needDrawLabels[i]) || goog.isBoolean(needDrawLabels);
          if (drawTick && ticksDrawer)
            ticksDrawer.call(
                ticks,
                ratio,
                pixelBounds,
                lineBounds,
                lineThickness,
                majorPixelShift);

          if (drawLabel)
            this.drawLabel_(tickVal, scale.transform(tickVal, .5), i, majorPixelShift, true);
          prevMajorRatio = ratio;
          i++;
        } else {
          var minorPixelShift = minorTickThickness % 2 == 0 ? 0 : -.5;
          drawLabel = goog.isArray(needDrawMinorLabels) ? needDrawMinorLabels[j] : needDrawMinorLabels;
          drawTick = (goog.isArray(needDrawMinorLabels) && needDrawMinorLabels[j]) || goog.isBoolean(needDrawMinorLabels);

          if (drawTick && minorTicksDrawer && prevMajorRatio != minorRatio)
            minorTicksDrawer.call(
                minorTicks,
                minorRatio,
                pixelBounds,
                lineBounds,
                lineThickness,
                minorPixelShift);

          if (drawLabel && prevMajorRatio != minorRatio)
            this.drawLabel_(minorTickVal, scale.transform(minorTickVal, .5), j, minorPixelShift, false);
          j++;
        }
      }
      if (needDrawMinorLabels) this.minorLabels().draw();

    } else if (scale instanceof anychart.scales.Ordinal) {
      var labelsStates = this.calcLabels_();
      needDrawLabels = goog.isObject(labelsStates) ? labelsStates.labels : !labelsStates;
      pixelShift = tickThickness % 2 == 0 ? 0 : -.5;

      for (i = 0; i < ticksArrLen; i++) {
        tickVal = scaleTicksArr[i];
        var leftTick, rightTick, labelPosition;
        if (goog.isArray(tickVal)) {
          leftTick = tickVal[0];
          rightTick = tickVal[1];
          labelPosition = (scale.transform(tickVal[0], 0) + scale.transform(tickVal[1], 1)) / 2;
        } else {
          leftTick = rightTick = tickVal;
          labelPosition = scale.transform(tickVal, .5);
        }
        ratio = scale.transform(leftTick, 0);

        if (ticksDrawer) {
          ticksDrawer.call(
              ticks,
              ratio,
              pixelBounds,
              lineBounds,
              lineThickness,
              pixelShift);

          if (i == ticksArrLen - 1)
            ticksDrawer.call(
                ticks,
                scale.transform(rightTick, 1),
                pixelBounds,
                lineBounds,
                lineThickness,
                pixelShift);
        }

        drawLabel = goog.isArray(needDrawLabels) ? needDrawLabels[i] : needDrawLabels;
        if (drawLabel)
          this.drawLabel_(leftTick, labelPosition, i, pixelShift, true);
      }
    }

    this.labels().draw();
  }

  this.title().resumeSignalsDispatching(false);
  this.labels().resumeSignalsDispatching(false);
  this.minorLabels().resumeSignalsDispatching(false);
  this.ticks().resumeSignalsDispatching(false);
  this.minorTicks().resumeSignalsDispatching(false);

  return this;
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.remove = function() {
  if (this.title_) this.title_.remove();
  if (this.line_) this.line_.parent(null);
  this.ticks().remove();
  this.minorTicks().remove();
  if (this.labels_) this.labels_.remove();
  if (this.minorLabels_) this.minorLabels_.remove();
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['title'] = this.title().serialize();
  json['labels'] = this.labels().serialize();
  json['minorLabels'] = this.minorLabels().serialize();
  json['ticks'] = this.ticks().serialize();
  json['minorTicks'] = this.minorTicks().serialize();
  json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  json['staggerMode'] = this.staggerMode();
  json['staggerLines'] = this.staggerLines();
  json['staggerMaxLines'] = this.staggerMaxLines();
  json['width'] = this.width();
  json['orientation'] = this.orientation();
  json['drawFirstLabel'] = this.drawFirstLabel();
  json['drawLastLabel'] = this.drawLastLabel();
  json['overlapMode'] = this.overlapMode();
  return json;
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.title(config['title']);
  this.labels(config['labels']);
  this.minorLabels(config['minorLabels']);
  this.ticks(config['ticks']);
  this.minorTicks(config['minorTicks']);
  this.staggerMode(config['staggerMode']);
  this.staggerLines(config['staggerLines']);
  this.staggerMaxLines(config['staggerMaxLines']);
  this.stroke(config['stroke']);
  this.width(config['width']);
  this.orientation(config['orientation']);
  this.drawFirstLabel(config['drawFirstLabel']);
  this.drawLastLabel(config['drawLastLabel']);
  this.overlapMode(config['overlapMode']);
};


/** @inheritDoc */
anychart.core.axes.Linear.prototype.disposeInternal = function() {
  goog.base(this, 'disposeInternal');

  delete this.scale_;
  this.labelsBounds_ = null;
  this.minorLabelsBounds_ = null;

  this.title_ = null;
  this.padding_ = null;

  goog.dispose(this.line_);
  this.line_ = null;

  this.ticks_ = null;

  this.minorTicks_ = null;

  this.pixelBounds_ = null;

  this.labels_ = null;
  this.minorLabels_ = null;
};


//exports
anychart.core.axes.Linear.prototype['staggerMode'] = anychart.core.axes.Linear.prototype.staggerMode;//doc|ex
anychart.core.axes.Linear.prototype['staggerLines'] = anychart.core.axes.Linear.prototype.staggerLines;//doc|ex
anychart.core.axes.Linear.prototype['staggerMaxLines'] = anychart.core.axes.Linear.prototype.staggerMaxLines;//doc|ex
anychart.core.axes.Linear.prototype['title'] = anychart.core.axes.Linear.prototype.title;//doc|ex
anychart.core.axes.Linear.prototype['labels'] = anychart.core.axes.Linear.prototype.labels;//doc|ex
anychart.core.axes.Linear.prototype['minorLabels'] = anychart.core.axes.Linear.prototype.minorLabels;//doc|ex
anychart.core.axes.Linear.prototype['ticks'] = anychart.core.axes.Linear.prototype.ticks;//doc|ex
anychart.core.axes.Linear.prototype['minorTicks'] = anychart.core.axes.Linear.prototype.minorTicks;//doc|ex
anychart.core.axes.Linear.prototype['stroke'] = anychart.core.axes.Linear.prototype.stroke;//doc|ex
anychart.core.axes.Linear.prototype['orientation'] = anychart.core.axes.Linear.prototype.orientation;//doc|ex
anychart.core.axes.Linear.prototype['scale'] = anychart.core.axes.Linear.prototype.scale;//doc|ex
anychart.core.axes.Linear.prototype['width'] = anychart.core.axes.Linear.prototype.width;
anychart.core.axes.Linear.prototype['getRemainingBounds'] = anychart.core.axes.Linear.prototype.getRemainingBounds;//doc|ex
anychart.core.axes.Linear.prototype['drawFirstLabel'] = anychart.core.axes.Linear.prototype.drawFirstLabel;//doc|ex
anychart.core.axes.Linear.prototype['drawLastLabel'] = anychart.core.axes.Linear.prototype.drawLastLabel;//doc|ex
anychart.core.axes.Linear.prototype['overlapMode'] = anychart.core.axes.Linear.prototype.overlapMode;//doc|ex
anychart.core.axes.Linear.prototype['isHorizontal'] = anychart.core.axes.Linear.prototype.isHorizontal;//doc
