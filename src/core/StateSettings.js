goog.provide('anychart.core.StateSettings');
goog.require('anychart.core.Base');
goog.require('anychart.core.settings');
goog.require('anychart.core.settings.IObjectWithSettings');
goog.require('anychart.core.ui.LabelsFactory');
goog.require('anychart.core.ui.MarkersFactory');



/**
 * Class representing state settings (normal, hovered, selected)
 * @param {anychart.core.settings.IObjectWithSettings} stateHolder State holder.
 * @param {!Object.<string, anychart.core.settings.PropertyDescriptorMeta>} descriptorsMeta Descriptors for state.
 * @param {anychart.PointState} stateType
 * @param {!Array.<Array>=} opt_descriptorsOverride
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.core.StateSettings = function(stateHolder, descriptorsMeta, stateType, opt_descriptorsOverride) {
  anychart.core.StateSettings.base(this, 'constructor');

  /**
   * @type {anychart.core.settings.IObjectWithSettings}
   */
  this.stateHolder = stateHolder;

  /**
   * @type {!Object.<string, anychart.core.settings.PropertyDescriptorMeta>}
   */
  this.descriptorsMeta = descriptorsMeta;

  /**
   * @type {anychart.PointState}
   */
  this.stateType = stateType;

  if (goog.isDef(opt_descriptorsOverride)) {
    var diff = anychart.core.settings.createDescriptors(anychart.core.StateSettings.PROPERTY_DESCRIPTORS, opt_descriptorsOverride);
    anychart.core.settings.populate(anychart.core.StateSettings, diff);
  }
};
goog.inherits(anychart.core.StateSettings, anychart.core.Base);


//region --- Constants and static
/**
 * Option name for labels factory constructor.
 * @type {string}
 */
anychart.core.StateSettings.LABELS_FACTORY_CONSTRUCTOR = 'labelsFactoryConstructor';


/**
 * Option name for labels factory after init callback.
 * @type {string}
 */
anychart.core.StateSettings.LABELS_AFTER_INIT_CALLBACK = 'labelsAfterInitCallback';


/**
 * Option name for headers factory after init callback.
 * @type {string}
 */
anychart.core.StateSettings.HEADERS_AFTER_INIT_CALLBACK = 'headersAfterInitCallback';


/**
 * Option name for markers factory after init callback.
 * @type {string}
 */
anychart.core.StateSettings.MARKERS_AFTER_INIT_CALLBACK = 'markersAfterInitCallback';


/**
 * Option name for outlier markers factory after init callback.
 * @type {string}
 */
anychart.core.StateSettings.OUTLIER_MARKERS_AFTER_INIT_CALLBACK = 'outlierMarkersAfterInitCallback';


/**
 * Default labels factory after init callback.
 * @param {anychart.core.ui.LabelsFactory} factory
 * @this {*}
 */
anychart.core.StateSettings.DEFAULT_LABELS_AFTER_INIT_CALLBACK = function(factory) {
  factory.listenSignals(this.labelsInvalidated_, this);
  factory.setParentEventTarget(/** @type {goog.events.EventTarget} */ (this));
};


/**
 * Default labels factory after init callback.
 * @param {anychart.core.ui.LabelsFactory} factory
 * @this {*}
 */
anychart.core.StateSettings.DEFAULT_HEADERS_AFTER_INIT_CALLBACK = function(factory) {
  factory.listenSignals(this.headersInvalidated_, this);
  factory.setParentEventTarget(/** @type {goog.events.EventTarget} */ (this));
};


/**
 * Default labels factory after init callback.
 * @param {anychart.core.ui.MarkersFactory} factory
 * @this {*}
 */
anychart.core.StateSettings.DEFAULT_MARKERS_AFTER_INIT_CALLBACK = function(factory) {
  factory.listenSignals(this.markersInvalidated_, this);
  factory.setParentEventTarget(/** @type {goog.events.EventTarget} */ (this));
};


/**
 * Default labels factory after init callback.
 * @param {anychart.core.ui.MarkersFactory} factory
 * @this {*}
 */
anychart.core.StateSettings.DEFAULT_OUTLIER_MARKERS_AFTER_INIT_CALLBACK = function(factory) {
  factory.listenSignals(this.outlierMarkersInvalidated_, this);
  factory.setParentEventTarget(/** @type {goog.events.EventTarget} */ (this));
};


//endregion
//region --- Overrides
/** @inheritDoc */
anychart.core.StateSettings.prototype.invalidate = function(state, opt_signal) {
  return this.stateHolder.invalidate(state, opt_signal);
};


/** @inheritDoc */
anychart.core.StateSettings.prototype.dispatchSignal = function(signal, opt_force) {
  return this.stateHolder.dispatchSignal(signal, opt_force);
};


//endregion
//region --- Descriptors
/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.core.StateSettings.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};
  /**
   * @type {!Object.<string, Array>}
   */
  var descriptors = anychart.core.settings.descriptors;
  anychart.core.settings.createDescriptors(map, [
    // standart coloring + series coloring
    descriptors.FILL_FUNCTION,
    descriptors.NEGATIVE_FILL,
    descriptors.RISING_FILL,
    descriptors.FALLING_FILL,
    descriptors.STROKE_FUNCTION,
    descriptors.LOW_STROKE,
    descriptors.HIGH_STROKE,
    descriptors.NEGATIVE_STROKE,
    descriptors.RISING_STROKE,
    descriptors.FALLING_STROKE,
    descriptors.MEDIAN_STROKE,
    descriptors.STEM_STROKE,
    descriptors.WHISKER_STROKE,
    descriptors.HATCH_FILL_FUNCTION,
    descriptors.NEGATIVE_HATCH_FILL,
    descriptors.RISING_HATCH_FILL,
    descriptors.FALLING_HATCH_FILL,
    descriptors.WHISKER_WIDTH,
    // marker series
    descriptors.TYPE,
    // marker series + annotations
    descriptors.SIZE,
    // annotations
    descriptors.TREND,
    descriptors.GRID,
    // linear gauge tank pointer
    descriptors.EMPTY_FILL,
    descriptors.EMPTY_HATCH_FILL
  ]);

  return map;
})();
anychart.core.settings.populate(anychart.core.StateSettings, anychart.core.StateSettings.PROPERTY_DESCRIPTORS);


//endregion
//region --- Own API
/**
 * Sets meta for field name.
 * @param {string} fieldName
 * @param {Array|anychart.core.settings.PropertyDescriptorMeta} meta
 */
anychart.core.StateSettings.prototype.setMeta = function(fieldName, meta) {
  if (goog.isArray(meta)) {
    anychart.core.settings.createDescriptorMeta.apply(null, goog.array.concat(this.descriptorsMeta, fieldName, meta));
  } else if (goog.isObject(meta)) {
    this.descriptorsMeta[fieldName] = meta;
  }
};


//endregion
//region --- Complex objects
/**
 * Labels.
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.ui.LabelsFactory|anychart.core.ui.CircularLabelsFactory}
 */
anychart.core.StateSettings.prototype.labels = function(opt_value) {
  if (!this.labels_) {
    var labelsFactoryConstructor = /** @type {Function} */ (this.getOption(anychart.core.StateSettings.LABELS_FACTORY_CONSTRUCTOR)) || anychart.core.ui.LabelsFactory;
    var afterInitCallback = /** @type {Function} */ (this.getOption(anychart.core.StateSettings.LABELS_AFTER_INIT_CALLBACK)) || goog.nullFunction;
    this.labels_ = new labelsFactoryConstructor();
    afterInitCallback.call(this.stateHolder, this.labels_);
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
 * Header labels (TreeMap).
 * @param {(Object|boolean|null)=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.ui.LabelsFactory}
 */
anychart.core.StateSettings.prototype.headers = function(opt_value) {
  if (!this.headers_) {
    var afterInitCallback = /** @type {Function} */ (this.getOption(anychart.core.StateSettings.HEADERS_AFTER_INIT_CALLBACK)) || anychart.core.StateSettings.DEFAULT_HEADERS_AFTER_INIT_CALLBACK;
    this.headers_ = new anychart.core.ui.LabelsFactory();
    afterInitCallback.call(this.stateHolder, this.headers_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.headers_.setup(opt_value);
    return this;
  }
  return this.headers_;
};


/**
 * Markers.
 * @param {(Object|boolean|null|string)=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.ui.MarkersFactory}
 */
anychart.core.StateSettings.prototype.markers = function(opt_value) {
  if (!this.markers_) {
    var afterInitCallback = /** @type {Function} */ (this.getOption(anychart.core.StateSettings.MARKERS_AFTER_INIT_CALLBACK)) || goog.nullFunction;
    this.markers_ = new anychart.core.ui.MarkersFactory();
    afterInitCallback.call(this.stateHolder, this.markers_);
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
 * Outlier markers.
 * @param {(Object|boolean|null|string)=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.ui.MarkersFactory}
 */
anychart.core.StateSettings.prototype.outlierMarkers = function(opt_value) {
  if (!this.outlierMarkers_) {
    var afterInitCallback = /** @type {Function} */ (this.getOption(anychart.core.StateSettings.OUTLIER_MARKERS_AFTER_INIT_CALLBACK)) || goog.nullFunction;
    this.outlierMarkers_ = new anychart.core.ui.MarkersFactory();
    afterInitCallback.call(this.stateHolder, this.outlierMarkers_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.outlierMarkers_.setup(opt_value);
    return this;
  }
  return this.outlierMarkers_;
};


//endregion
//region --- State Fallbacks
/**
 * Normal fallback.
 * @param {!Object=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.settings.IObjectWithSettings}
 */
anychart.core.StateSettings.prototype.normal = function(opt_value) {
  return this.stateHolder.normal(opt_value);
};


/**
 * Hovered fallback.
 * @param {!Object=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.settings.IObjectWithSettings}
 */
anychart.core.StateSettings.prototype.hovered = function(opt_value) {
  return this.stateHolder.hovered(opt_value);
};


/**
 * Selected fallback.
 * @param {!Object=} opt_value
 * @return {anychart.core.StateSettings|anychart.core.settings.IObjectWithSettings}
 */
anychart.core.StateSettings.prototype.selected = function(opt_value) {
  if (this.stateHolder.selected)
    return this.stateHolder.selected(opt_value);
  else
    return null;
};


//endregion
//region --- Setup / Serialize / Dispose
/** @inheritDoc */
anychart.core.StateSettings.prototype.serialize = function() {
  var json = anychart.core.StateSettings.base(this, 'serialize');
  anychart.core.settings.serialize(this, anychart.core.StateSettings.PROPERTY_DESCRIPTORS, json, 'State settings', this.descriptorsMeta);
  if (this.descriptorsMeta['labels'])
    json['labels'] = this.labels().serialize();
  if (this.descriptorsMeta['headers'])
    json['headers'] = this.headers().serialize();
  if (this.descriptorsMeta['markers'])
    json['markers'] = this.markers().serialize();
  if (this.descriptorsMeta['outlierMarkers'])
    json['outlierMarkers'] = this.markers().serialize();
  return json;
};


/** @inheritDoc */
anychart.core.StateSettings.prototype.setupByJSON = function(config, opt_default) {
  anychart.core.StateSettings.base(this, 'setupByJSON', config, opt_default);
  anychart.core.settings.deserialize(this, anychart.core.StateSettings.PROPERTY_DESCRIPTORS, config);
  if (goog.isDef(this.descriptorsMeta['labels']))
    this.labels().setupInternal(!!opt_default, config['labels']);
  if (goog.isDef(this.descriptorsMeta['headers']))
    this.headers().setupInternal(!!opt_default, config['headers']);
  if (goog.isDef(this.descriptorsMeta['markers']))
    this.markers().setupInternal(!!opt_default, config['markers']);
  if (goog.isDef(this.descriptorsMeta['outlierMarkers']))
    this.outlierMarkers().setupInternal(!!opt_default, config['outlierMarkers']);
};


/** @inheritDoc */
anychart.core.StateSettings.prototype.disposeInternal = function() {
  goog.disposeAll(this.labels_, this.headers_, this.markers_, this.outlierMarkers_);
  anychart.core.StateSettings.base(this, 'disposeInternal');
};


//endregion
//region --- Exports
(function() {
  var proto = anychart.core.StateSettings.prototype;
  proto['labels'] = proto.labels;
  proto['headers'] = proto.headers;
  proto['markers'] = proto.markers;
  proto['outlierMarkers'] = proto.outlierMarkers;
  proto['normal'] = proto.normal;
  proto['hovered'] = proto.hovered;
  proto['selected'] = proto.selected;
})();
//endregion
