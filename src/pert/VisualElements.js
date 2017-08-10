goog.provide('anychart.pertModule.VisualElements');

goog.require('anychart.core.Base');
goog.require('anychart.core.settings');
goog.require('anychart.core.ui.LabelsFactory');
goog.require('anychart.core.ui.Tooltip');



/**
 * Pert visual element settings collector.
 * @constructor
 * @extends {anychart.core.Base}
 * @implements {anychart.core.settings.IObjectWithSettings}
 * @implements {anychart.core.settings.IResolvable}
 */
anychart.pertModule.VisualElements = function() {
  anychart.pertModule.VisualElements.base(this, 'constructor');

  /**
   * @type {acgraph.vector.Fill}
   * @private
   */
  this.color_;

  /**
   * @type {acgraph.vector.Fill|Function}
   * @private
   */
  this.fill_;

  /**
   * @type {acgraph.vector.Fill|Function}
   * @private
   */
  this.hoverFill_;

  /**
   * @type {acgraph.vector.Fill|Function}
   * @private
   */
  this.selectFill_;

  /**
   * @type {acgraph.vector.Stroke|Function}
   * @private
   */
  this.stroke_;

  /**
   * @type {acgraph.vector.Stroke|Function}
   * @private
   */
  this.hoverStroke_;

  /**
   * @type {acgraph.vector.Stroke|Function}
   * @private
   */
  this.selectStroke_;

  /**
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.labels_;

  /**
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.hoverLabels_;

  /**
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.selectLabels_;

  /**
   * @type {anychart.core.ui.Tooltip}
   * @private
   */
  this.tooltip_ = null;

  /**
   * Labels container.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.labelsContainer_ = null;

  /**
   * Parent PertVisualElements settings object.
   * @type {?anychart.pertModule.VisualElements}
   * @private
   */
  this.parent_ = null;

  /**
   * Resolution chain cache.
   * @type {?Array.<Object|null|undefined>}
   * @private
   */
  this.resolutionChainCache_ = null;

  /**
   * @type {!Object.<string, anychart.core.settings.PropertyDescriptorMeta>}
   */
  this.descriptorsMeta = {};
  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, [
    ['color', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['fill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['hoverFill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['selectFill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['stroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['hoverStroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['selectStroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
  ]);
};
goog.inherits(anychart.pertModule.VisualElements, anychart.core.Base);


/**
 * Supported signals mask.
 * @type {number}
 */
anychart.pertModule.VisualElements.prototype.SUPPORTED_SIGNALS =
    anychart.core.Base.prototype.SUPPORTED_SIGNALS |
    anychart.Signal.NEEDS_REDRAW_LABELS |
    anychart.Signal.NEEDS_REDRAW_APPEARANCE |
    anychart.Signal.NEEDS_UPDATE_TOOLTIP;


/**
 * Supported consistency states mask.
 * @type {number}
 */
anychart.pertModule.VisualElements.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Base.prototype.SUPPORTED_CONSISTENCY_STATES;


/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.pertModule.VisualElements.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};
  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'color', anychart.core.settings.fillNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'fill', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'hoverFill', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'selectFill', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'stroke', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'hoverStroke', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'selectStroke', anychart.core.settings.fillOrFunctionNormalizer]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.pertModule.VisualElements, anychart.pertModule.VisualElements.PROPERTY_DESCRIPTORS);


//region --- IObjectWithSettings implementation
/**
 * @override
 * @param {string} name
 * @return {*}
 */
anychart.pertModule.VisualElements.prototype.getOption = anychart.core.settings.getOption;


//endregion
//region --- IResolvable + Parent implementation
/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.resolutionChainCache = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.resolutionChainCache_ = opt_value;
  }
  return this.resolutionChainCache_;
};


/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.getResolutionChain = anychart.core.settings.getResolutionChain;


/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.getLowPriorityResolutionChain = function() {
  var sett = [this.themeSettings];
  if (this.parent_) {
    sett = goog.array.concat(sett, this.parent_.getLowPriorityResolutionChain());
  }
  return sett;
};


/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.getHighPriorityResolutionChain = function() {
  var sett = [this.ownSettings];
  if (this.parent_) {
    sett = goog.array.concat(sett, this.parent_.getHighPriorityResolutionChain());
  }
  return sett;
};


/**
 * Gets/sets parent settings object.
 * @param {anychart.pertModule.VisualElements=} opt_value - Value.
 * @return {?anychart.pertModule.VisualElements} - Current parent object.
 */
anychart.pertModule.VisualElements.prototype.parent = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.parent_ != opt_value) {
      if (goog.isNull(opt_value)) {
        //this.parent_ is not null here.
        this.parent_.unlistenSignals(this.parentInvalidated_, this);
        this.parent_ = null;
      } else {
        if (this.parent_)
          this.parent_.unlistenSignals(this.parentInvalidated_, this);
        this.parent_ = opt_value;
        this.parent_.listenSignals(this.parentInvalidated_, this);
      }
    }
    return this;
  }
  return this.parent_;
};


/**
 * .
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.pertModule.VisualElements.prototype.parentInvalidated_ = function(e) {
  var state = 0;
  var signal = 0;

  if (e.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.APPEARANCE;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }

  if (e.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state |= anychart.ConsistencyState.BOUNDS;
    signal |= anychart.Signal.BOUNDS_CHANGED;
  }

  if (e.hasSignal(anychart.Signal.ENABLED_STATE_CHANGED)) {
    state |= anychart.ConsistencyState.ENABLED;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }

  this.resolutionChainCache_ = null;

  this.invalidate(state, signal);
};


//endregion


/**
 * Gets final fill.
 * @param {anychart.PointState|number} state - Current state.
 * @param {anychart.format.Context} provider - Context provider.
 * @return {!acgraph.vector.Fill} - Final fill.
 */
anychart.pertModule.VisualElements.prototype.getFinalFill = function(state, provider) {
  var result;
  var fill;

  switch (state) {
    case anychart.PointState.HOVER:
      fill = this.getOption('hoverFill');
      break;
    case anychart.PointState.SELECT:
      fill = this.getOption('selectFill');
      break;
    default:
      fill = this.getOption('fill');
  }

  result = fill;

  if (goog.isFunction(fill)) {
    provider['sourceColor'] = this.getOption('color');
    result = fill.call(provider);
  }

  return /** @type {!acgraph.vector.Fill} */ (result);
};


/**
 * Gets final stroke.
 * @param {anychart.PointState|number} state - Current state.
 * @param {anychart.format.Context} provider - Context provider.
 * @return {!acgraph.vector.Stroke} - Final stroke.
 */
anychart.pertModule.VisualElements.prototype.getFinalStroke = function(state, provider) {
  var result;
  var stroke;

  switch (state) {
    case anychart.PointState.HOVER:
      stroke = this.getOption('hoverStroke');
      break;
    case anychart.PointState.SELECT:
      stroke = this.getOption('selectStroke');
      break;
    default:
      stroke = this.getOption('stroke');
  }

  result = stroke;

  if (goog.isFunction(stroke)) {
    provider['sourceColor'] = this.getOption('color');
    result = stroke.call(provider);
  }

  return /** @type {!acgraph.vector.Stroke} */ (result);
};


/**
 * Gets or sets labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.pertModule.VisualElements)} - Labels instance or itself for chaining call.
 */
anychart.pertModule.VisualElements.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    this.labels_ = new anychart.core.ui.LabelsFactory();
    this.labels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.labels_);
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
 * Gets or sets select labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.pertModule.VisualElements)} - Labels instance or itself for chaining call.
 */
anychart.pertModule.VisualElements.prototype.selectLabels = function(opt_value) {
  if (!this.selectLabels_) {
    this.selectLabels_ = new anychart.core.ui.LabelsFactory();
    this.selectLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.selectLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.selectLabels_.setup(opt_value);
    return this;
  }
  return this.selectLabels_;
};


/**
 * Gets or sets hover labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.pertModule.VisualElements)} - Labels instance or itself for chaining call.
 */
anychart.pertModule.VisualElements.prototype.hoverLabels = function(opt_value) {
  if (!this.hoverLabels_) {
    this.hoverLabels_ = new anychart.core.ui.LabelsFactory();
    this.hoverLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.hoverLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.hoverLabels_.setup(opt_value);
    return this;
  }
  return this.hoverLabels_;
};


/**
 * Listener for labels invalidation.
 * @param {anychart.SignalEvent} event - Invalidation event.
 */
anychart.pertModule.VisualElements.prototype.labelsInvalidated = function(event) {
  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_LABELS);
};


/**
 * Getter for tooltip settings.
 * @param {(Object|boolean|null)=} opt_value - Tooltip settings.
 * @return {!(anychart.pertModule.VisualElements|anychart.core.ui.Tooltip)} - Tooltip instance or self for method chaining.
 */
anychart.pertModule.VisualElements.prototype.tooltip = function(opt_value) {
  if (!this.tooltip_) {
    this.tooltip_ = new anychart.core.ui.Tooltip(0);
    this.registerDisposable(this.tooltip_);
    this.tooltip_.listenSignals(this.onTooltipSignal_, this);
  }
  if (goog.isDef(opt_value)) {
    this.tooltip_.setup(opt_value);
    return this;
  } else {
    return this.tooltip_;
  }
};


/**
 * Tooltip invalidation handler.
 * @param {anychart.SignalEvent} event - Event object.
 * @private
 */
anychart.pertModule.VisualElements.prototype.onTooltipSignal_ = function(event) {
  this.dispatchSignal(anychart.Signal.NEEDS_UPDATE_TOOLTIP);
};


/**
 * Gets tooltip config. Includes formatter-functions.
 * @return {Object}
 */
anychart.pertModule.VisualElements.prototype.getCurrentTooltipConfig = function() {
  var config = this.tooltip().serialize();
  var titleFormat = this.tooltip().getOption('titleFormat');
  var format = this.tooltip().getOption('format');
  if (titleFormat && titleFormat != anychart.utils.DEFAULT_FORMATTER)
    config['titleFormat'] = titleFormat;
  if (format && format != anychart.utils.DEFAULT_FORMATTER)
    config['format'] = format;
  return config;
};


/**
 * Gets/sets labels container.
 * @param {acgraph.vector.Layer=} opt_value - Value to be set.
 * @return {acgraph.vector.Layer|anychart.pertModule.VisualElements|null} - Current value or itself for method chaining.
 */
anychart.pertModule.VisualElements.prototype.labelsContainer = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.labelsContainer_ != opt_value) {
      this.labelsContainer_ = opt_value;
      this.labels().container(this.labelsContainer_);
    }
    return this;
  }
  return this.labelsContainer_;
};


/**
 * Draws labels.
 * @return {anychart.pertModule.VisualElements}
 */
anychart.pertModule.VisualElements.prototype.drawLabels = function() {
  this.labels().draw();
  return this;
};


/**
 * Clears labels.
 * @return {anychart.pertModule.VisualElements}
 */
anychart.pertModule.VisualElements.prototype.clearLabels = function() {
  this.labels().clear();
  return this;
};


/**
 * Sets all labels parent event target.
 * @param {goog.events.EventTarget} parentEventTarget - Parent event target.
 * @return {anychart.pertModule.VisualElements}
 */
anychart.pertModule.VisualElements.prototype.setLabelsParentEventTarget = function(parentEventTarget) {
  this.labels().setParentEventTarget(parentEventTarget);
  return this;
};


// /**
//  * Util method. Use it to deeply compare two objects.
//  * NOTE: Currently (01 Aug 2016) we can't create tooltip with background without fill and stroke.
//  * This comparison allows to exclude
//  *
//  * @param {*} o1 Object or value to compare.
//  * @param {*} o2 Object or value to compare.
//  * @return {boolean} - True if arguments are equal.
//  * @private
//  */
// anychart.pertModule.VisualElements.prototype.deepEqual_ = function(o1, o2) {
//   if (o1 === o2) return true;
//   var t1 = typeof o1, t2 = typeof o2;
//   if (t1 == 'object' && t1 == t2) {
//     for (var key in o1) {
//       if (!this.deepEqual_(o1[key], o2[key])) return false;
//     }
//     return true;
//   }
//   return false;
// };


/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.serialize = function() {
  var json = anychart.pertModule.VisualElements.base(this, 'serialize');
  anychart.core.settings.serialize(this, anychart.pertModule.VisualElements.PROPERTY_DESCRIPTORS, json, 'Pert visual element');

  json['labels'] = this.labels().serialize();
  json['selectLabels'] = this.selectLabels().getChangedSettings();
  json['hoverLabels'] = this.hoverLabels().getChangedSettings();
  if (goog.isNull(json['hoverLabels']['enabled'])) {
    delete json['hoverLabels']['enabled'];
  }
  if (goog.isNull(json['selectLabels']['enabled'])) {
    delete json['selectLabels']['enabled'];
  }

  json['tooltip'] = this.tooltip().serialize();

  return json;
};


/** @inheritDoc */
anychart.pertModule.VisualElements.prototype.setupByJSON = function(config, opt_default) {
  anychart.pertModule.VisualElements.base(this, 'setupByJSON', config, opt_default);

  anychart.core.settings.deserialize(this, anychart.pertModule.VisualElements.PROPERTY_DESCRIPTORS, config);

  this.labels().setupInternal(!!opt_default, config['labels']);
  this.hoverLabels().setupInternal(!!opt_default, config['hoverLabels']);
  this.selectLabels().setupInternal(!!opt_default, config['selectLabels']);

  if ('tooltip' in config)
    this.tooltip().setupInternal(!!opt_default, config['tooltip']);
};
