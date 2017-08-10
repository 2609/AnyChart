goog.provide('anychart.pertModule.Milestones');

goog.require('anychart.pertModule.VisualElements');
goog.require('anychart.utils');



/**
 * Pert milestones settings collector.
 * @constructor
 * @extends {anychart.pertModule.VisualElements}
 */
anychart.pertModule.Milestones = function() {
  anychart.pertModule.Milestones.base(this, 'constructor');

  anychart.core.settings.createDescriptorsMeta(this.descriptorsMeta, [
    ['size', 0, anychart.Signal.NEEDS_REDRAW],
    ['shape', 0, anychart.Signal.NEEDS_REDRAW]
  ]);
};
goog.inherits(anychart.pertModule.Milestones, anychart.pertModule.VisualElements);


/**
 * Supported signals mask.
 * @type {number}
 */
anychart.pertModule.Milestones.prototype.SUPPORTED_SIGNALS =
    anychart.pertModule.VisualElements.prototype.SUPPORTED_SIGNALS |
    anychart.Signal.NEEDS_REDRAW;


/**
 * @type {!Object.<string, anychart.core.settings.PropertyDescriptor>}
 */
anychart.pertModule.Milestones.PROPERTY_DESCRIPTORS = (function() {
  /** @type {!Object.<string, anychart.core.settings.PropertyDescriptor>} */
  var map = {};
  function sizeNormalizer(opt_value) {
    return /** @type {number|string} */ (anychart.utils.normalizeNumberOrPercent(opt_value, 80));
  }
  anychart.core.settings.createDescriptors(map, [
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'size', sizeNormalizer],
    [anychart.enums.PropertyHandlerType.SINGLE_ARG, 'shape', anychart.enums.normalizeMilestoneShape]
  ]);
  return map;
})();
anychart.core.settings.populate(anychart.pertModule.Milestones, anychart.pertModule.Milestones.PROPERTY_DESCRIPTORS);


/** @inheritDoc */
anychart.pertModule.Milestones.prototype.serialize = function() {
  var json = anychart.pertModule.Milestones.base(this, 'serialize');
  anychart.core.settings.serialize(this, anychart.pertModule.Milestones.PROPERTY_DESCRIPTORS, json);
  return json;
};


/** @inheritDoc */
anychart.pertModule.Milestones.prototype.setupByJSON = function(config, opt_default) {
  anychart.pertModule.Milestones.base(this, 'setupByJSON', config, opt_default);
  anychart.core.settings.deserialize(this, anychart.pertModule.Milestones.PROPERTY_DESCRIPTORS, config);
};


//exports
(function() {
  var proto = anychart.pertModule.Milestones.prototype;
  //proto['color'] = proto.color;

  //proto['fill'] = proto.fill;
  //proto['hoverFill'] = proto.hoverFill;
  //proto['selectFill'] = proto.selectFill;

  //proto['stroke'] = proto.stroke;
  //proto['hoverStroke'] = proto.hoverStroke;
  //proto['selectStroke'] = proto.selectStroke;

  proto['labels'] = proto.labels;
  proto['selectLabels'] = proto.selectLabels;
  proto['hoverLabels'] = proto.hoverLabels;
  proto['tooltip'] = proto.tooltip;
  //proto['shape'] = proto.shape;
  //proto['size'] = proto.size;
})();
