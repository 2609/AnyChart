//region --- Require and Provide
goog.provide('anychart.stockModule.CurrentPriceIndicator');
goog.require('acgraph');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.ui.LabelsFactory');
goog.require('anychart.format.Context');
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
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.mainLabel_ = new anychart.core.ui.LabelsFactory();
  this.mainLabel_.listenSignals(this.labelInvalidated_, this);
  this.label_ = this.mainLabel_.add(null, null, 0);
  this.mainLabel_.markConsistent(anychart.ConsistencyState.ALL);

  /**
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.risingLabel_ = new anychart.core.ui.LabelsFactory();
  this.risingLabel_.listenSignals(this.labelInvalidated_, this);
  this.risingLabel_.markConsistent(anychart.ConsistencyState.ALL);

  /**
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.fallingLabel_ = new anychart.core.ui.LabelsFactory();
  this.fallingLabel_.listenSignals(this.labelInvalidated_, this);
  this.fallingLabel_.markConsistent(anychart.ConsistencyState.ALL);

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, [
    ['value', anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW],
    ['valueField', anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW],
    ['stroke', anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW],
    ['fallingStroke', anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW],
    ['risingStroke', anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW]
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
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.STOCK_PRICE_INDICATOR_LABEL;


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
      anychart.core.settings.strokeNormalizer);

  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.MULTI_ARG,
      'risingStroke',
      anychart.core.settings.strokeNormalizer);

  anychart.core.settings.createDescriptor(
      map,
      anychart.enums.PropertyHandlerType.MULTI_ARG,
      'fallingStroke',
      anychart.core.settings.strokeNormalizer);

  return map;
})();
anychart.core.settings.populate(anychart.stockModule.CurrentPriceIndicator, anychart.stockModule.CurrentPriceIndicator.prototype.SIMPLE_PROPS_DESCRIPTORS);


//endregion
//region --- Infrastructure
/**
 * Sets plot.
 * @param {anychart.stockModule.Plot} value .
 */
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
 * @param {anychart.core.ui.LabelsFactory.Label} label
 * @return {boolean}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.isLabelAnchorLeft = function(label) {
  var anchor = /** @type {anychart.enums.Anchor} */(label.getOption('anchor'));
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

  var values = {
    'axis': {value: axis, type: anychart.enums.TokenType.UNKNOWN},
    'value': {value: labelText, type: anychart.enums.TokenType.NUMBER},
    'tickValue': {value: scaleValue, type: anychart.enums.TokenType.NUMBER},
    'scale': {value: scale, type: anychart.enums.TokenType.UNKNOWN}
  };

  var aliases = {};
  aliases[anychart.enums.StringToken.AXIS_SCALE_MAX] = 'max';
  aliases[anychart.enums.StringToken.AXIS_SCALE_MIN] = 'min';

  var context = new anychart.format.Context(values);
  context.tokenAliases(aliases);

  return context.propagate();
};


/**
 * Returns label position provider.
 * @param {anychart.core.Axis} axis .
 * @param {number} y .
 * @return {!Object}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.getLabelPositionProvider = function(axis, y) {
  var plotBounds = this.plot_.getPlotBounds();
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

  if (!(y >= plotBounds.getTop() && y <= plotBounds.getBottom())) {
    x = y = NaN;
  }

  return {'value': {'x': x, 'y': y}};
};


//endregion
//region --- API
/**
 * Label.
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.ui.LabelsFactory|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.label = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.mainLabel_.setup(opt_value);
    return this;
  } else {
    return this.mainLabel_;
  }
};


/**
 * Falling label.
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.ui.LabelsFactory|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.fallingLabel = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.fallingLabel_.setup(opt_value);
    return this;
  } else {
    return this.fallingLabel_;
  }
};


/**
 * Rising label.
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.ui.LabelsFactory|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.risingLabel = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.risingLabel_.setup(opt_value);
    return this;
  } else {
    return this.risingLabel_;
  }
};


/**
 * Label invalidation handler.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.stockModule.CurrentPriceIndicator.prototype.labelInvalidated_ = function(e) {
  console.log('!!!');
  this.invalidate(anychart.ConsistencyState.BOUNDS | anychart.ConsistencyState.STOCK_PRICE_INDICATOR_LABEL,
      anychart.Signal.NEEDS_REDRAW);
};


/**
 * Target series.
 * @param {(number|anychart.stockModule.Series)=} opt_value .
 * @return {anychart.stockModule.Series|anychart.stockModule.CurrentPriceIndicator}
 */
anychart.stockModule.CurrentPriceIndicator.prototype.series = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var seriesIndex = +opt_value;
    if (goog.isNumber(opt_value))
      opt_value = this.plot_.getSeries(opt_value);
    if (this.series_ !== opt_value) {
      this.seriesIndex_ = seriesIndex;
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
 * @param {(number|anychart.core.Axis)=} opt_value .
 * @return {anychart.core.Axis|anychart.stockModule.CurrentPriceIndicator} .
 */
anychart.stockModule.CurrentPriceIndicator.prototype.axis = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var axisIndex = +opt_value;
    if (goog.isNumber(opt_value))
      opt_value = /** @type {anychart.core.Axis} */(this.plot_.yAxis(opt_value));
    if (this.axis_ !== opt_value) {
      this.axisIndex_ = axisIndex;
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

  var labelFormatProvider;
  var line = this.getLine();
  var series = this.series_ || this.plot_.getSeries(0);
  var isSeriesOHLCBased = !!(series.drawer.flags & anychart.core.drawers.Capabilities.IS_OHLC_BASED);
  var fieldValue = this.getOption('valueField') || series.drawer.valueFieldName;

  var stroke = /** @type {acgraph.vector.Stroke} */(this.getOption('stroke'));
  var row = series.getSelectableData().getRowByDataSource(this.getOption('value'), fieldValue);
  var seriesValue = row ? row.get(fieldValue) : null;

  if (!seriesValue)
    this.remove();

  var axis = this.axis_ || this.plot_.yAxis(0);
  var yScale = axis.scale();

  var yRatio = yScale.transform(seriesValue);
  var plotBounds = this.plot_.getPlotBounds();

  var stateLF;
  if (isSeriesOHLCBased) {
    var risingStroke = /** @type {acgraph.vector.Stroke} */(this.getOption('risingStroke'));
    var fallingStroke = /** @type {acgraph.vector.Stroke} */(this.getOption('fallingStroke'));

    var openValue = row.get('open');
    var closeValue = row.get('close');

    var rising = closeValue > openValue;
    if (rising) {
      stroke = risingStroke ? risingStroke : stroke;
      stateLF = this.risingLabel_;
    } else {
      stroke = fallingStroke ? fallingStroke : stroke;
      stateLF = this.fallingLabel_;
    }
  }

  var thickness = /** @type {number} */(acgraph.vector.getThickness(/** @type {acgraph.vector.Stroke} */(stroke)) || 1);

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
    var y = plotBounds.getBottom() - yRatio * plotBounds.height;
    y = anychart.utils.applyPixelShift(y, thickness);

    line.clear();
    line
        .moveTo(plotBounds.left, y)
        .lineTo(plotBounds.getRight(), y);
    line.parent(/** @type {acgraph.vector.ILayer} */(this.container()));

    console.log(this.label_.getFinalSettings('enabled'));

    if (axis && axis.enabled() && this.label_.getFinalSettings('enabled')) {
      var labelPositionProvider = this.getLabelPositionProvider(axis, y);
      
      if (isNaN(labelPositionProvider['value']['x'])) {
        this.labelDisabled = true;
        this.label_.clear();
      } else {
        if (this.labelDisabled || isSeriesOHLCBased) {
          this.invalidate(anychart.ConsistencyState.STOCK_PRICE_INDICATOR_LABEL);
          this.labelDisabled = false;
        }
        labelFormatProvider = this.getLabelsFormatProvider(axis, yRatio);
        this.label_.formatProvider(labelFormatProvider);
        this.mainLabel_.dropCallsCache();
        this.label_.positionProvider(labelPositionProvider);
      }
    } else {
      this.label_.clear();
      this.labelDisabled = true;
    }
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.STOCK_PRICE_INDICATOR_LABEL)) {
    if (axis && axis.enabled() && this.label_.getFinalSettings('enabled')) {
      labelFormatProvider = this.getLabelsFormatProvider(axis, yRatio);
      this.label_.formatProvider(labelFormatProvider);
      this.mainLabel_.dropCallsCache();
      this.label_.autoAnchor(axis.orientation() == anychart.enums.Orientation.LEFT ? anychart.enums.Anchor.RIGHT_CENTER : anychart.enums.Anchor.LEFT_CENTER);
      var labelStateOrder = [];
      if (isSeriesOHLCBased) {
        labelStateOrder.push(
            this.label_.autoSettings,
            stateLF.ownSettings,
            this.mainLabel_.ownSettings,
            this.mainLabel_.autoSettings,
            stateLF.themeSettings,
            this.mainLabel_.themeSettings);
      } else {
        labelStateOrder.push(
            this.label_.autoSettings,
            this.mainLabel_.ownSettings,
            this.mainLabel_.autoSettings,
            this.mainLabel_.themeSettings);
      }
      this.label_.stateOrder(labelStateOrder);
    } else {
      this.label_.clear();
      this.labelDisabled = true;
    }
    this.markConsistent(anychart.ConsistencyState.STOCK_PRICE_INDICATOR_LABEL);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    line.stroke(stroke);
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  if (!this.labelDisabled)
    this.label_.draw();

  this.mainLabel_.markConsistent(anychart.ConsistencyState.ALL);
  this.risingLabel_.markConsistent(anychart.ConsistencyState.ALL);
  this.fallingLabel_.markConsistent(anychart.ConsistencyState.ALL);

  return this;
};


//endregion
//region --- Serialize and Setup
/**
 * Sets default settings.
 * @param {!Object} config
 */
anychart.stockModule.CurrentPriceIndicator.prototype.setThemeSettings = function(config) {
  anychart.core.settings.copy(this.themeSettings, this.SIMPLE_PROPS_DESCRIPTORS, config);
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.disposeInternal = function() {
  anychart.stockModule.CurrentPriceIndicator.base(this, 'disposeInternal');

  this.plot_ = null;
  this.axis_ = null;
  this.series_ = null;

  this.remove();
  if (this.line)
    this.line.dispose();

  this.mainLabel_.clear();
  this.mainLabel_.dispose();
  this.risingLabel_.dispose();
  this.fallingLabel_.dispose();
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.serialize = function() {
  var json = anychart.stockModule.CurrentPriceIndicator.base(this, 'serialize');

  anychart.core.settings.serialize(this, this.SIMPLE_PROPS_DESCRIPTORS, json, 'Current price indicator');

  if (!isNaN(this.seriesIndex_))
    json['series'] = this.seriesIndex_;
  if (!isNaN(this.axisIndex_))
    json['axis'] = this.axisIndex_;

  json['mainLabel'] = this.mainLabel_.serialize();
  json['risingLabel'] = this.risingLabel_.getChangedSettings();
  json['fallingLabel'] = this.fallingLabel_.getChangedSettings();

  return json;
};


/** @inheritDoc */
anychart.stockModule.CurrentPriceIndicator.prototype.setupByJSON = function(config, opt_default) {
  if (opt_default) {
    this.setThemeSettings(config);
  } else {
    anychart.core.settings.deserialize(this, this.SIMPLE_PROPS_DESCRIPTORS, config);
  }

  this.series(config['series']);
  this.axis(config['axis']);

  this.mainLabel_.setupInternal(!!opt_default, config['label']);
  this.risingLabel_.setupInternal(!!opt_default, config['risingLabel']);
  this.fallingLabel_.setupInternal(!!opt_default, config['fallingLabel']);

  anychart.stockModule.CurrentPriceIndicator.base(this, 'setupByJSON', config, opt_default);
};


//endregion
//exports
(function() {
  var proto = anychart.stockModule.CurrentPriceIndicator.prototype;
  // proto['value'] = proto.value;
  // proto['valueField'] = proto.valueField
  // proto['stroke'] = proto.stroke;
  proto['label'] = proto.label;
  proto['fallingLabel'] = proto.fallingLabel;
  proto['risingLabel'] = proto.risingLabel;
  proto['axis'] = proto.axis;
  proto['series'] = proto.series;
})();