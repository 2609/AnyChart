//region --- Require and Provide
goog.provide('anychart.stockModule.CurrentPriceIndicator');
goog.require('acgraph');
goog.require('anychart.core.ui.CrosshairLabel');
//endregion



/**
 * Stock current price indicator class.
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.stockModule.CurrentPriceIndicator = function() {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'constructor');

  /**
   * @type {anychart.stockModule.Plot}
   * @private
   */
  this.plot_ = null;


  /**
   * @type {anychart.core.ui.CrosshairLabel}
   * @private
   */
  this.label_ = new anychart.core.ui.CrosshairLabel();
  this.label_.zIndex(1000).enabled(true);
};
goog.inherits(anychart.stockModule.CurrentPriceIndicator, anychart.core.VisualBase);


//region --- Signals and States
/**
 * Supported consistency states.
 * @type {number}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE;


/**
 * Supported signals.
 * @type {number}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


//endregion
//region --- Infrastructure
anychart.stockModule.CurrentPriceIndicator.prototype.setPlot = function(value) {
  this.plot_ = value;
};


/**
 * Create line.
 * @return {acgraph.vector.Path}
 * @protected
 */
anychart.stockModule.CurrentPriceIndicator.prototype.getLine = function() {
  return this.line ? this.line : this.line = /** @type {acgraph.vector.Element} */(acgraph.path());
};


//endregion
//region --- Utils
/**
 * @param {anychart.core.ui.CrosshairLabel} label
 * @return {boolean}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.isLabelAnchorLeft = function(label) {
  var anchor = label.getFinalAnchor();
  return anchor == anychart.enums.Anchor.LEFT_TOP ||
      anchor == anychart.enums.Anchor.LEFT_CENTER ||
      anchor == anychart.enums.Anchor.LEFT_BOTTOM;
};


/**
 * Gets format provider for label.
 * @param {anychart.core.Axis|anychart.mapModule.elements.Axis} axis
 * @param {number} ratio
 * @return {Object} Labels format provider.
 * @protected
 */
anychart.stockModule.CurrentPriceIndicator.prototype.getLabelsFormatProvider = function(axis, ratio) {
  if (!axis) return null;

  var scale = axis.scale();
  var scaleType = scale.getType();
  var scaleValue = scale.inverseTransform(ratio);

  var labelText;
  switch (scaleType) {
    case anychart.enums.ScaleTypes.LINEAR:
      labelText = +parseFloat(scaleValue).toFixed();
      break;
    case anychart.enums.ScaleTypes.LOG:
      labelText = +scaleValue.toFixed(1);
      break;
    case anychart.enums.ScaleTypes.ORDINAL:
      labelText = String(scaleValue);
      break;
    case anychart.enums.ScaleTypes.DATE_TIME:
      var date = new Date(scaleValue);
      var mm = date.getMonth() + 1;
      var dd = date.getDate();
      var yy = date.getFullYear();

      mm = mm < 10 ? '0' + mm : '' + mm;
      dd = dd < 10 ? '0' + dd : '' + dd;

      labelText = mm + '-' + dd + '-' + yy;

      break;
  }

  return {
    'value': labelText,
    'rawValue': scaleValue,
    'max': scale.max ? scale.max : null,
    'min': scale.min ? scale.min : null,
    'scale': scale
  };
};


//endregion
//region --- API
/**
 * Label.
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.ui.CrosshairLabel|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.labels = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.label_.setup(opt_value);
    return this;
  } else {
    return this.label_;
  }
};


/**
 * Target series.
 * @param {} opt_value .
 */
anychart.stockModule.CurrentPriceIndicator.prototype.series = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.series_ !== opt_value) {
      this.series_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.series_;
};


/**
 * Target series.
 * @param {} opt_value .
 */
anychart.stockModule.CurrentPriceIndicator.prototype.axis = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.axis_ !== opt_value) {
      this.axis_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.axis_;
};


/**
 * Target series.
 * @param {} opt_value .
 */
anychart.stockModule.CurrentPriceIndicator.prototype.value = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.value_ !== opt_value) {
      this.value_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.value_;
};


/**
 * Get/set indicator line stroke.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line joint style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!(anychart.stockModule.CurrentPriceIndicator|acgraph.vector.Stroke)} LineMarker line settings or LineMarker instance for method chaining.
 */
anychart.stockModule.CurrentPriceIndicator.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var stroke = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != stroke) {
      this.stroke_ = stroke;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


//endregion
//region --- Drawing
anychart.stockModule.CurrentPriceIndicator.prototype.draw = function() {
  if (!this.checkDrawingNeeded())
    return this;

  var yScale = this.axis_.scale();
  var thickness = acgraph.vector.getThickness(this.stroke()) || 1;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    var data = this.series_.getSelectableData();
    var rowProxy = data.search(this.value_, anychart.enums.TableSearchMode.EXACT);
    var seriesValue = rowProxy.get('close');

    var yRatio = yScale.transform(seriesValue);
    var plotBounds = this.plot_.getPlotBounds();

    var y = plotBounds.getBottom() - yRatio * plotBounds.height;
    y = anychart.utils.applyPixelShift(y, thickness);
    var line = this.getLine().clear();
    line
        .moveTo(plotBounds.left, y)
        .lineTo(plotBounds.getRight(), y);
    line.stroke(this.stroke());


    if (this.axis_ && this.axis_.enabled() && this.label_.enabled()) {
      var labelFormatProvider = this.getLabelsFormatProvider(this.axis_, yRatio);
      var labelFormat = this.label_.format() || anychart.utils.DEFAULT_FORMATTER;
      this.label_.text(labelFormat.call(labelFormatProvider, labelFormatProvider));

      var axisBounds = this.axis_.getPixelBounds();
      var axisEnabled = this.axis_.enabled();
      var left = axisEnabled ? axisBounds.getLeft() : plotBounds.getRight();
      var right = axisEnabled ? axisBounds.getRight() : plotBounds.getLeft();

      var x;
      switch (this.axis_.orientation()) {
        case anychart.enums.Orientation.LEFT:
          x = this.isLabelAnchorLeft(this.label_) ? right - 1 : right + 1;
          break;
        case anychart.enums.Orientation.RIGHT:
          x = this.isLabelAnchorLeft(this.label_) ? left - 1 : left + 1;
          break;
      }

      this.label_.x(/** @type {number}*/(x)).y(/** @type {number}*/(y));

    }

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.line.parent(container);
    this.label_.container(container);

    // this.labels().container(container);
    // this.minorLabels().container(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  this.label_.draw();
};


//endregion
//region --- Serialize and Setup
/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.disposeInternal = function() {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'disposeInternal');
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.serialize = function() {
  var json = anychart.stockModule.CurrentPriceIndicator.base(this, 'serialize');
  return json;
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.setupByJSON = function(config, opt_default) {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'setupByJSON', config, opt_default);
};


//endregion
