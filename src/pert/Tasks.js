goog.provide('anychart.pertModule.Tasks');

goog.require('anychart.core.ui.LabelsFactory');
goog.require('anychart.pertModule.VisualElements');



/**
 * Pert milestones settings collector.
 * @constructor
 * @extends {anychart.pertModule.VisualElements}
 */
anychart.pertModule.Tasks = function() {
  anychart.pertModule.Tasks.base(this, 'constructor');

  /**
   * Lower labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.lowerLabels_;

  /**
   * Hover lower labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.hoverLowerLabels_;

  /**
   * Select labels.
   * @type {anychart.core.ui.LabelsFactory}
   * @private
   */
  this.selectLowerLabels_;


  /**
   * @type {acgraph.vector.Fill|Function}
   * @private
   */
  this.dummyFill_;

  ///**
  // * @type {acgraph.vector.Fill}
  // * @private
  // */
  //this.hoverDummyFill_;
  //
  ///**
  // * @type {acgraph.vector.Fill}
  // * @private
  // */
  //this.selectDummyFill_;

  /**
   * @type {acgraph.vector.Stroke|Function}
   * @private
   */
  this.dummyStroke_;

  ///**
  // * @type {acgraph.vector.Stroke}
  // * @private
  // */
  //this.hoverDummyStroke_;
  //
  ///**
  // * @type {acgraph.vector.Stroke}
  // * @private
  // */
  //this.selectDummyStroke_;

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, [
    ['dummyFill', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE],
    ['dummyStroke', 0, anychart.Signal.NEEDS_REDRAW_APPEARANCE]
  ]);
};
goog.inherits(anychart.pertModule.Tasks, anychart.pertModule.VisualElements);


/**
 * Supported signals mask.
 * @type {number}
 */
anychart.pertModule.Tasks.prototype.SUPPORTED_SIGNALS =
    anychart.pertModule.VisualElements.prototype.SUPPORTED_SIGNALS;


/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.pertModule.Tasks.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};
  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'dummyFill', anychart.core.settings.fillOrFunctionNormalizer],
    [anychart.enums.PropertyHandlerType.MULTI_ARG, 'dummyStroke', anychart.core.settings.strokeOrFunctionNormalizer]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.pertModule.Tasks, anychart.pertModule.Tasks.PROPERTY_DESCRIPTORS);


///**
// * Getter/setter for hoverDummyFill.
// * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
// * @param {number=} opt_opacityOrAngleOrCx .
// * @param {(number|boolean|!anychart.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
// * @param {(number|!anychart.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
// * @param {number=} opt_opacity .
// * @param {number=} opt_fx .
// * @param {number=} opt_fy .
// * @return {acgraph.vector.Fill|anychart.pertModule.Tasks} .
// */
//anychart.pertModule.Tasks.prototype.hoverDummyFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
//  if (goog.isDef(opt_fillOrColorOrKeys)) {
//    var val = acgraph.vector.normalizeFill.apply(null, arguments);
//    if (!anychart.color.equals(/** @type {acgraph.vector.Fill} */ (this.hoverDummyFill_), val)) {
//      this.hoverDummyFill_ = /** @type {acgraph.vector.Fill} */ (val);
//      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
//    }
//    return this;
//  }
//  return this.hoverDummyFill_;
//};
//
//
///**
// * Getter/setter for selectDummyFill.
// * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
// * @param {number=} opt_opacityOrAngleOrCx .
// * @param {(number|boolean|!anychart.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
// * @param {(number|!anychart.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
// * @param {number=} opt_opacity .
// * @param {number=} opt_fx .
// * @param {number=} opt_fy .
// * @return {acgraph.vector.Fill|anychart.pertModule.Tasks} .
// */
//anychart.pertModule.Tasks.prototype.selectDummyFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
//  if (goog.isDef(opt_fillOrColorOrKeys)) {
//    var val = acgraph.vector.normalizeFill.apply(null, arguments);
//    if (!anychart.color.equals(/** @type {acgraph.vector.Fill} */ (this.selectDummyFill_), val)) {
//      this.selectDummyFill_ = /** @type {acgraph.vector.Fill} */ (val);
//      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
//    }
//    return this;
//  }
//  return this.selectDummyFill_;
//};


/**
 * Gets final dummy fill.
 * @param {anychart.format.Context} provider - Context provider.
 * @return {!acgraph.vector.Fill} - Final ummy fill.
 */
anychart.pertModule.Tasks.prototype.getFinalDummyFill = function(provider) {
  var result;
  var fill = this.getOption('dummyFill');
  result = fill;

  if (goog.isFunction(fill)) {
    provider['sourceColor'] = this.getOption('color');
    result = fill.call(provider);
  }

  return /** @type {!acgraph.vector.Fill} */ (result);
};


///**
// * Getter/setter for hover dummy stroke settings.
// * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
// *    or stroke settings.
// * @param {number=} opt_thickness [1] Line thickness.
// * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
// * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
// * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
// * @return {anychart.pertModule.Tasks|acgraph.vector.Stroke} .
// */
//anychart.pertModule.Tasks.prototype.hoverDummyStroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
//  if (goog.isDef(opt_strokeOrFill)) {
//    var val = acgraph.vector.normalizeStroke.apply(null, arguments);
//    if (!anychart.color.equals(/** @type {acgraph.vector.Stroke} */ (this.hoverDummyStroke_), val)) {
//      this.hoverDummyStroke_ = /** @type {acgraph.vector.Stroke} */ (val);
//      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
//    }
//    return this;
//  }
//  return this.hoverDummyStroke_;
//};
//
//
///**
// * Getter/setter for select dummy stroke settings.
// * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
// *    or stroke settings.
// * @param {number=} opt_thickness - Line thickness.
// * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
// * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
// * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
// * @return {anychart.pertModule.Tasks|acgraph.vector.Stroke} .
// */
//anychart.pertModule.Tasks.prototype.selectDummyStroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
//  if (goog.isDef(opt_strokeOrFill)) {
//    var val = acgraph.vector.normalizeStroke.apply(null, arguments);
//    if (!anychart.color.equals(/** @type {acgraph.vector.Stroke} */ (this.selectDummyStroke_), val)) {
//      this.selectDummyStroke_ = /** @type {acgraph.vector.Stroke} */ (val);
//      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW_APPEARANCE);
//    }
//    return this;
//  }
//  return this.selectDummyStroke_;
//};


/**
 * Gets final dummy stroke.
 * @param {anychart.format.Context} provider - Context provider.
 * @return {!acgraph.vector.Stroke} - Final dummy stroke.
 */
anychart.pertModule.Tasks.prototype.getFinalDummyStroke = function(provider) {
  var result;
  var stroke = this.getOption('dummyStroke');
  result = stroke;

  if (goog.isFunction(stroke)) {
    provider['sourceColor'] = this.getOption('color');
    result = stroke.call(provider);
  }

  return /** @type {!acgraph.vector.Stroke} */ (result);
};


/**
 * Gets or sets lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.lowerLabels = function(opt_value) {
  if (!this.lowerLabels_) {
    this.lowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.lowerLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.lowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.lowerLabels_.setup(opt_value);
    return this;
  }
  return this.lowerLabels_;
};


/**
 * Gets or sets select lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.selectLowerLabels = function(opt_value) {
  if (!this.selectLowerLabels_) {
    this.selectLowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.selectLowerLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.selectLowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.selectLowerLabels_.setup(opt_value);
    return this;
  }
  return this.selectLowerLabels_;
};


/**
 * Gets or sets hover lower labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.hoverLowerLabels = function(opt_value) {
  if (!this.hoverLowerLabels_) {
    this.hoverLowerLabels_ = new anychart.core.ui.LabelsFactory();
    this.hoverLowerLabels_.listenSignals(this.labelsInvalidated, this);
    this.registerDisposable(this.hoverLowerLabels_);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.hoverLowerLabels_.setup(opt_value);
    return this;
  }
  return this.hoverLowerLabels_;
};


/**
 * Gets or sets upper labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.upperLabels = function(opt_value) {
  return /** @type {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} */ (this.labels(opt_value));
};


/**
 * Gets or sets select upper labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.selectUpperLabels = function(opt_value) {
  return /** @type {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} */ (this.selectLabels(opt_value));
};


/**
 * Gets or sets hover labels settings.
 * @param {(Object|boolean|null)=} opt_value - Labels settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} - Labels instance or itself for chaining call.
 */
anychart.pertModule.Tasks.prototype.hoverUpperLabels = function(opt_value) {
  return /** @type {anychart.core.ui.LabelsFactory|anychart.pertModule.Tasks} */ (this.hoverLabels(opt_value));
};


/**
 * @inheritDoc
 */
anychart.pertModule.Tasks.prototype.labelsContainer = function(opt_value) {
  //this sets container for upper labels.
  anychart.pertModule.Tasks.base(this, 'labelsContainer', opt_value);
  var container = anychart.pertModule.Tasks.base(this, 'labelsContainer');
  if (container) this.lowerLabels().container(/** @type {acgraph.vector.ILayer} */ (container));
  return container;
};


/** @inheritDoc */
anychart.pertModule.Tasks.prototype.drawLabels = function() {
  this.lowerLabels().draw();

  //This will draw upper labels.
  return anychart.pertModule.Tasks.base(this, 'drawLabels');
};


/** @inheritDoc */
anychart.pertModule.Tasks.prototype.setLabelsParentEventTarget = function(parentEventTarget) {
  this.lowerLabels().setParentEventTarget(parentEventTarget);

  //This will draw upper labels.
  return anychart.pertModule.Tasks.base(this, 'setLabelsParentEventTarget', parentEventTarget);
};


/**
 * @inheritDoc
 */
anychart.pertModule.Tasks.prototype.clearLabels = function() {
  this.lowerLabels().clear();
  return anychart.pertModule.Tasks.base(this, 'clearLabels');
};


/** @inheritDoc */
anychart.pertModule.Tasks.prototype.serialize = function() {
  var json = anychart.pertModule.Tasks.base(this, 'serialize');

  json['upperLabels'] = goog.object.clone(json['labels']);
  delete json['labels'];

  json['selectUpperLabels'] = goog.object.clone(json['selectLabels']);
  delete json['selectLabels'];

  json['hoverUpperLabels'] = goog.object.clone(json['hoverLabels']);
  delete json['hoverLabels'];

  anychart.core.settings.serialize(this, anychart.pertModule.Tasks.PROPERTY_DESCRIPTORS, json, 'Pert tasks');

  //if (this.dummyFill_) json['dummyFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */ (this.dummyFill_));
  //json['hoverDummyFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hoverDummyFill()));
  //json['selectDummyFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.selectDummyFill()));
  //if (this.dummyStroke_) json['dummyStroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */ (this.dummyStroke_));
  //json['hoverDummyStroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke}*/(this.hoverDummyStroke()));
  //json['selectDummyStroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke}*/(this.selectDummyStroke()));


  json['lowerLabels'] = this.lowerLabels().serialize();
  json['hoverLowerLabels'] = this.hoverLowerLabels().serialize();
  json['selectLowerLabels'] = this.selectLowerLabels().serialize();

  return json;
};


/** @inheritDoc */
anychart.pertModule.Tasks.prototype.setupByJSON = function(config, opt_default) {
  anychart.pertModule.Tasks.base(this, 'setupByJSON', config, opt_default);
  this.upperLabels(config['upperLabels']);
  this.selectUpperLabels(config['selectUpperLabels']);
  this.hoverUpperLabels(config['hoverUpperLabels']);
  this.lowerLabels(config['lowerLabels']);
  this.hoverLowerLabels(config['hoverLowerLabels']);
  this.selectLowerLabels(config['selectLowerLabels']);

  anychart.core.settings.deserialize(this, anychart.pertModule.Tasks.PROPERTY_DESCRIPTORS, config);

  //this.dummyFill(config['dummyFill']);
  //this.hoverDummyFill(config['hoverDummyFill']);
  //this.selectDummyFill(config['selectDummyFill']);
  //this.dummyStroke(config['dummyStroke']);
  //this.hoverDummyStroke(config['hoverDummyStroke']);
  //this.selectDummyStroke(config['selectDummyStroke']);
};


//exports
(function() {
  var proto = anychart.pertModule.Tasks.prototype;
  //proto['color'] = proto.color;

  //proto['fill'] = proto.fill;
  //proto['hoverFill'] = proto.hoverFill;
  //proto['selectFill'] = proto.selectFill;
  //proto['stroke'] = proto.stroke;
  //proto['hoverStroke'] = proto.hoverStroke;
  //proto['selectStroke'] = proto.selectStroke;

  //proto['dummyFill'] = proto.dummyFill;
  //proto['hoverDummyFill'] = proto.hoverDummyFill;
  //proto['selectDummyFill'] = proto.selectDummyFill;
  //proto['dummyStroke'] = proto.dummyStroke;
  //proto['hoverDummyStroke'] = proto.hoverDummyStroke;
  //proto['selectDummyStroke'] = proto.selectDummyStroke;

  proto['upperLabels'] = proto.upperLabels;
  proto['selectUpperLabels'] = proto.selectUpperLabels;
  proto['hoverUpperLabels'] = proto.hoverUpperLabels;
  proto['tooltip'] = proto.tooltip;
  proto['lowerLabels'] = proto.lowerLabels;
  proto['hoverLowerLabels'] = proto.hoverLowerLabels;
  proto['selectLowerLabels'] = proto.selectLowerLabels;
})();
