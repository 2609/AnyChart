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
  this.label_.listenSignals(this.labelInvalidated_, this);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, [
    ['value', anychart.ConsistencyState.BOUNDS],
    ['valueField', anychart.ConsistencyState.BOUNDS],
    ['stroke', anychart.ConsistencyState.APPEARANCE]
  ]);
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
//region --- Descriptors
/**
 * Simple properties descriptors.
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.SIMPLE_PROPS_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};

  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.SINGLE_ARG,
      'value',
      function(value) {return anychart.enums.normalizeDataSource(value) || anychart.utils.normalizeTimestamp(value);});

  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.SINGLE_ARG,
      'valueField',
      anychart.core.settings.asIsNormalizer);

  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.MULTI_ARG,
      'stroke',
      acgraph.vector.normalizeStroke);

  return map;
})();
anychart.core.settings.populate(anychart.stockModule.CurrentPriceIndicator, anychart.stockModule.CurrentPriceIndicator.prototype.SIMPLE_PROPS_DESCRIPTORS);


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
      labelText = +parseFloat(scaleValue).toFixed(2);
      break;
    case anychart.enums.ScaleTypes.LOG:
      labelText = +scaleValue.toFixed(2);
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
anychart.stockModule.CurrentPriceIndicator.prototype.label = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.label_.setup(opt_value);
    return this;
  } else {
    return this.label_;
  }
};


/**
 * Label invalidation handler.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.stockModule.CurrentPriceIndicator.prototype.labelInvalidated_ = function(e) {
  this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Target series.
 * @param {number|anychart.stockModule.Series} opt_value .
 * @return {anychart.stockModule.Series|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.series = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value))
      opt_value = this.plot_.getSeries(opt_value);
    if (this.series_ !== opt_value) {
      this.series_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.series_;
};


/**
 * Target axis.
 * @param {number|anychart.core.Axis} opt_value .
 * @return {anychart.core.Axis|anychart.stockModule.CurrentPriceIndicator} .
 */
anychart.stockModule.CurrentPriceIndicator.prototype.axis = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isNumber(opt_value))
      opt_value = this.plot_.yAxis(opt_value);
    if (this.axis_ !== opt_value) {
      this.axis_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.axis_;
};


//endregion
//region --- Drawing
/**
 * Removing.
 */
anychart.stockModule.CurrentPriceIndicator.prototype.remove = function() {
  var line = this.getLine();
  line.clear();
  line.parent(null);
  this.label_.container(null);
};


/**
 * Drawing.
 * @return {anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.draw = function() {
  if (!this.checkDrawingNeeded())
    return this;

  var line = this.getLine();

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.line.parent(container);
    this.label_.container(container);

    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */(this.zIndex());
    this.line.zIndex(zIndex);
    this.label_.zIndex(zIndex);

    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }
  
  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    var series = this.series_ || this.plot_.getSeries(0);
    var axis = this.axis_ || this.plot_.yAxis(0);
    var yScale = axis.scale();
    var stroke = this.getOption('stroke');
    var thickness = acgraph.vector.getThickness(stroke) || 1;
    var fieldValue = this.getOption('valueField') || series.drawer.valueFieldName;
    var row = series.getSelectableData().getRowByDataSource(this.getValue('value'), fieldValue);
    var seriesValue = row ? row.get(fieldValue) : null;

    if (seriesValue) {
      var yRatio = yScale.transform(seriesValue);
      var plotBounds = this.plot_.getPlotBounds();

      var y = plotBounds.getBottom() - yRatio * plotBounds.height;
      y = anychart.utils.applyPixelShift(y, thickness);

      line.clear();
      line
          .moveTo(plotBounds.left, y)
          .lineTo(plotBounds.getRight(), y);
      line.clip(/** @type {anychart.math.Rect} */(this.parentBounds()));

      if (axis && axis.enabled() && this.label_.enabled()) {
        var labelFormatProvider = this.getLabelsFormatProvider(axis, yRatio);
        var labelFormat = this.label_.format() || anychart.utils.DEFAULT_FORMATTER;
        this.label_.text(labelFormat.call(labelFormatProvider, labelFormatProvider));
        this.label_.autoAnchor(axis.orientation() == anychart.enums.Orientation.LEFT ?
            anychart.enums.Anchor.RIGHT_CENTER : anychart.enums.Anchor.LEFT_CENTER);

        var axisBounds = axis.getPixelBounds();
        var axisEnabled = axis.enabled();
        var left = axisEnabled ? axisBounds.getLeft() : plotBounds.getRight();
        var right = axisEnabled ? axisBounds.getRight() : plotBounds.getLeft();

        var x;
        switch (axis.orientation()) {
          case anychart.enums.Orientation.LEFT:
            x = this.isLabelAnchorLeft(this.label_) ? right : right;
            break;
          case anychart.enums.Orientation.RIGHT:
            x = this.isLabelAnchorLeft(this.label_) ? left : left;
            break;
        }

        if (y >= plotBounds.getTop() && y <= plotBounds.getBottom()) {
          this.label_
              .container(/** @type {acgraph.vector.ILayer} */(this.container()))
              .x(/** @type {number}*/(x))
              .y(/** @type {number}*/(y));
        } else {
          this.label_.container(null);
        }
      }
    } else {
      line.clear();
      this.label_.container(null);
    }
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    line.stroke(this.getOption('stroke'));

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  this.label_.draw();
};


//endregion
//region --- Serialize and Setup
/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.disposeInternal = function() {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'disposeInternal');

  this.plot_ = null;
  this.axis_ = null;
  this.series_ = null;

  this.remove();
  if (this.line)
    this.line.dispose();

  this.label_.dispose();
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.serialize = function() {
  var json = anychart.stockModule.CurrentPriceIndicator.base(this, 'serialize');

  config['series'] = this.series();
  config['axis'] = this.axis();
  config['stroke'] = this.stroke();
  config['valueField'] = this.valueField();
  config['value'] = this.value();
  
  return json;
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.setupByJSON = function(config, opt_default) {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'setupByJSON', config, opt_default);

  this.series(config['series']);
  this.axis(config['axis']);
  this.stroke(config['stroke']);
  this.valueField(config['valueField']);
  this.value(config['value']);

  this.label_.setupByJSON(config['label'], opt_default);
};


//endregion
//exports
(function() {
  var proto = anychart.stockModule.CurrentPriceIndicator.prototype;
  // proto['value'] = proto.value;
  // proto['valueField'] = proto.valueField
  // proto['stroke'] = proto.stroke;
  proto['label'] = proto.label;
  proto['axis'] = proto.axis;
  proto['series'] = proto.series;
})();