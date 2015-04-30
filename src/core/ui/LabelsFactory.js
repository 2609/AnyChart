goog.provide('anychart.core.ui.LabelsFactory');
goog.provide('anychart.core.ui.LabelsFactory.Label');
goog.require('acgraph');
goog.require('anychart.core.Text');
goog.require('anychart.core.ui.Background');
goog.require('anychart.enums');



/**
 * Class for creation of sets of similar labels and management of such sets.
 * Any individual label can be changed after all labels are displayed.
 * @constructor
 * @extends {anychart.core.Text}
 */
anychart.core.ui.LabelsFactory = function() {
  this.suspendSignalsDispatching();
  goog.base(this);

  /**
   * Enabled state.
   * @type {?boolean}
   * @private
   */
  this.enabledState_ = null;

  /**
   * Labels width settings.
   * @type {string|number|null}
   * @private
   */
  this.width_ = null;

  /**
   * Labels height settings.
   * @type {string|number|null}
   * @private
   */
  this.height_ = null;

  /**
   * Rotation angle.
   * @type {number}
   * @private
   */
  this.rotationAngle_;

  /**
   * Labels position settings.
   * @type {string}
   * @private
   */
  this.position_;

  /**
   * Labels anchor settings.
   * @type {anychart.enums.Anchor}
   * @private
   */
  this.anchor_;

  /**
   * Labels padding settings.
   * @type {anychart.core.utils.Padding}
   * @private
   */
  this.padding_ = null;

  /**
   * Offset by X coordinate from labels position.
   * @type {number|string}
   * @private
   */
  this.offsetX_;

  /**
   * Offset by Y coordinate from labels position.
   * @type {number|string}
   * @private
   */
  this.offsetY_;

  /**
   * Label text formatting function, by default we use value field of the format provider.
   * @type {Function}
   * @private
   */
  this.textFormatter_ = anychart.utils.DEFAULT_FORMATTER;

  /**
   * Label position function, by default we use value obtained from context.
   * @type {Function}
   * @private
   */
  this.positionFormatter_ = anychart.utils.DEFAULT_FORMATTER;

  /**
   * Labels background settings.
   * @type {anychart.core.ui.Background}
   * @private
   */
  this.background_ = null;

  /**
   * Labels layer.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.layer_ = null;

  /**
   * Labels Array.
   * @type {Array.<anychart.core.ui.LabelsFactory.Label>}
   * @private
   */
  this.labels_;

  /**
   * Adjust font size by width.
   * @type {boolean}
   * @private
   */
  this.adjustByWidth_ = false;

  /**
   * Adjust font size by height.
   * @type {boolean}
   * @private
   */
  this.adjustByHeight_ = false;

  /**
   * Minimimum font size for adjusting from.
   * @type {number}
   * @private
   */
  this.minFontSize_ = 8;

  /**
   * Maximum font size for adjusting to.
   * @type {number}
   * @private
   */
  this.maxFontSize_ = 72;

  this.background(null);
  this.anchor(anychart.enums.Anchor.CENTER);
  this.padding(2, 4);
  this.rotation(0);
  this.width(null);
  this.height(null);
  this.fontSize('11');
  this.enabled(true);

  /**
   * @type {Object.<boolean>}
   * @protected
   */
  this.changedSettings = {};

  /**
   * @type {Array.<string>}
   * @protected
   */
  this.settingsFieldsForMerge = ['background', 'padding', 'height', 'width', 'offsetY', 'offsetX', 'position', 'anchor', 'rotation',
    'textFormatter', 'positionFormatter', 'minFontSize', 'maxFontSize'];

  this.invalidate(anychart.ConsistencyState.ALL);
  this.resumeSignalsDispatching(false);
};
goog.inherits(anychart.core.ui.LabelsFactory, anychart.core.Text);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.LabelsFactory.prototype.SUPPORTED_SIGNALS = anychart.core.Text.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.LabelsFactory.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Text.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.LABELS_FACTORY_BACKGROUND |
    anychart.ConsistencyState.LABELS_FACTORY_HANDLERS;


/**
 * Enumeration to handle composite event handlers attachment on DOM create.
 * @const {Object.<number>}
 * @private
 */
anychart.core.ui.LabelsFactory.HANDLED_EVENT_TYPES_ = {
  /** Click. */
  'click': 0x01,

  /** Double click. */
  'dblclick': 0x02,

  /** Mouse down */
  'mousedown': 0x04,

  /** Mouse up */
  'mouseup': 0x08,

  /** Mouse over. */
  'mouseover': 0x10,

  /** Mouse out. */
  'mouseout': 0x20,

  /** Mouse move */
  'mousemove': 0x40,

  /** Touch start */
  'touchstart': 0x80,

  /** Touch move */
  'touchmove': 0x100,

  /** Touch end */
  'touchend': 0x200,

  /** Touch cancel.
   * @see http://www.w3.org/TR/2011/WD-touch-events-20110505/#the-touchcancel-event
   */
  'touchcancel': 0x400

  //  /** Tap (fast touchstart-touchend) */
  //  'tap': 0x800
};


/**
 * MAGIC NUMBERS!!! MAGIC NUMBERS!!!111
 * This is a lsh (<< - left shift) second argument to convert simple HANDLED_EVENT_TYPES code to a
 * CAPTURE HANDLED_EVENT_TYPES code! Tada!
 * @type {number}
 * @private
 */
anychart.core.ui.LabelsFactory.HANDLED_EVENT_TYPES_CAPTURE_SHIFT_ = 12;


/**
 * Getter for the current element state.
 *
 * True, false and null states.
 *
 * True and false are self-explanatory. null state means that element is enabled,
 * but if it depends on other entities (like, for example, labels() and hoverLabels() in series),
 * then factory works in auto mode. For example, if series normal labels are enable,
 * and hover labels are in null state, then upon hover hoverLabels become enabled because of normal.
 * But if you disable normal labels – hoverLabels are disabled too.
 * @return {?boolean} The current element state.
 *//**
 * Setter for the element enabled state.
 * @example <t>listingOnly</t>
 * if (!element.enabled())
 *    element.enabled(true);
 * @param {(null|boolean)=} opt_value Value to set.
 * @return {!anychart.LabelsFactory} An instance of {@link anychart.core.VisualBase} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {?boolean=} opt_value Value to set.
 * @return {!anychart.core.ui.LabelsFactory|boolean|null} .
 */
anychart.core.ui.LabelsFactory.prototype.enabled = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.enabledState_ = opt_value;
    if (!goog.isNull(opt_value)) {
      goog.base(this, 'enabled', /** @type {boolean} */(opt_value));
    } else {
      goog.base(this, 'enabled', true);
    }
    return this;
  }
  return this.enabledState_;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Background.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets or sets the labels background settings.
 * @param {(string|Object|null|boolean)=} opt_value Background object to set.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.ui.Background)} Returns the background or itself for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.background = function(opt_value) {
  if (!this.background_) {
    this.background_ = new anychart.core.ui.Background();
    this.registerDisposable(this.background_);
    this.background_.markConsistent(anychart.ConsistencyState.ALL);
    this.background_.listenSignals(this.backgroundInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    this.background_.setup(opt_value);
    this.changedSettings['background'] = true;
    return this;
  }
  return this.background_;
};


/**
 * Internal background invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.ui.LabelsFactory.prototype.backgroundInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.changedSettings['background'] = true;
    this.background_.markConsistent(anychart.ConsistencyState.ALL);
    this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
  }
};


/**
 * Labels padding.
 * @param {(string|number|Array.<number|string>|{top:(number|string),left:(number|string),bottom:(number|string),right:(number|string)})=} opt_spaceOrTopOrTopAndBottom Space object or top or top and bottom
 *    space.
 * @param {(string|number)=} opt_rightOrRightAndLeft Right or right and left space.
 * @param {(string|number)=} opt_bottom Bottom space.
 * @param {(string|number)=} opt_left Left space.
 * @return {!(anychart.core.ui.LabelsFactory|anychart.core.utils.Padding)} Padding or LabelsFactory for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.padding = function(opt_spaceOrTopOrTopAndBottom, opt_rightOrRightAndLeft, opt_bottom, opt_left) {
  if (!this.padding_) {
    this.padding_ = new anychart.core.utils.Padding();
    this.registerDisposable(this.padding_);
    this.padding_.listenSignals(this.paddingInvalidated_, this);
  }
  if (goog.isDef(opt_spaceOrTopOrTopAndBottom)) {
    this.padding_.setup.apply(this.padding_, arguments);
    this.changedSettings['padding'] = true;
    return this;
  }
  return this.padding_;
};


/**
 * Listener for bounds invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.core.ui.LabelsFactory.prototype.paddingInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.changedSettings['padding'] = true;
    this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Text formatter.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets or sets labels text formatter function.
 * @param {Function=} opt_value Labels text formatter function.
 * @return {Function|anychart.core.ui.LabelsFactory} Labels text formatter function or Labels instance for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.textFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.textFormatter_ = opt_value;
    this.changedSettings['textFormatter'] = true;
    this.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
  } else {
    return this.textFormatter_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Position.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Gets or sets labels position formatter function.
 * @param {Function=} opt_value Labels position formatter function.
 * @return {Function|anychart.core.ui.LabelsFactory} Labels position formatter function or Labels instance for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.positionFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.positionFormatter_ = opt_value;
    this.changedSettings['positionFormatter'] = true;
    this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
  } else {
    return this.positionFormatter_;
  }
};


/**
 * Gets or sets labels position settings. These settings are processed by the factory handler (for example a series,
 * or an axis) and can have different meanings from handler to handler. Try using anychart.enums.Position values.
 * @param {string=} opt_value Labels position settings.
 * @return {anychart.core.ui.LabelsFactory|string} Labels position settings or itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = String(opt_value);
    if (this.position_ != opt_value) {
      this.position_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['position'] = true;
    return this;
  } else {
    return this.position_;
  }
};


/**
 * Gets or sets labels anchor settings.
 * @param {(anychart.enums.Anchor|string)=} opt_value Labels anchor settings.
 * @return {anychart.core.ui.LabelsFactory|anychart.enums.Anchor} Labels anchor settings or itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.anchor = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeAnchor(opt_value);
    if (this.anchor_ != opt_value) {
      this.anchor_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['anchor'] = true;
    return this;
  } else {
    return this.anchor_;
  }
};


/**
 * Gets or sets labels offsetX settings.
 * @param {(number|string)=} opt_value Labels offsetX settings to set.
 * @return {number|string|anychart.core.ui.LabelsFactory} Labels offsetX value or itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.offsetX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.offsetX_ != opt_value) {
      this.offsetX_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['offsetX'] = true;
    return this;
  } else {
    return this.offsetX_;
  }
};


/**
 * Gets or sets labels offsetY settings.
 * @param {(number|string)=} opt_value Labels offsetY settings to set.
 * @return {number|string|anychart.core.ui.LabelsFactory} Labels offsetY value or itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.offsetY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.offsetY_ != opt_value) {
      this.offsetY_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['offsetY'] = true;
    return this;
  } else {
    return this.offsetY_;
  }
};


/**
 * Sets rotation angle around an anchor.
 * ({@link acgraph.vector.Element}).
 * @param {number=} opt_value Rotation angle in degrees.
 * @return {number|anychart.core.ui.LabelsFactory} Rotation angle in degrees or Itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.rotation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = +opt_value;
    if (this.rotationAngle_ != opt_value) {
      this.rotationAngle_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['rotation'] = true;
    return this;
  } else {
    return this.rotationAngle_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Width/Height.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * LabelsFactory width settings.
 * @param {(number|string|null)=} opt_value Width value to set.
 * @return {!anychart.core.ui.LabelsFactory|number|string|null} LabelsFactory width or itself for chaining call.
 */
anychart.core.ui.LabelsFactory.prototype.width = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.width_ != opt_value) {
      this.width_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['width'] = true;
    return this;
  }
  return this.width_;
};


/**
 * LabelsFactory height settings.
 * @param {(number|string|null)=} opt_value Height value to set.
 * @return {!anychart.core.ui.LabelsFactory|number|string|null} LabelsFactory height or itself for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.height = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.height_ != opt_value) {
      this.height_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['height'] = true;
    return this;
  }
  return this.height_;
};


/**
 * Helper method.
 * @private
 * @return {boolean} is adjustment enabled.
 */
anychart.core.ui.LabelsFactory.prototype.adjustEnabled_ = function() {
  return (this.adjustByWidth_ || this.adjustByHeight_);
};


/**
 * Sets font size setting for adjust text from.
 * @param {(number|string)=} opt_value
 * @return {number|anychart.core.ui.LabelsFactory}
 */
anychart.core.ui.LabelsFactory.prototype.minFontSize = function(opt_value) {
  if (goog.isDef(opt_value) && !isNaN(+opt_value)) {
    if (this.minFontSize_ != +opt_value) {
      this.minFontSize_ = +opt_value;
      // we don't need to invalidate bounds if adjusting is not enabled
      if (this.adjustEnabled_())
        this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['minFontSize'] = true;
    return this;
  }
  return this.minFontSize_;
};


/**
 * Sets font size setting for adjust text to.
 * @param {(number|string)=} opt_value
 * @return {number|anychart.core.ui.LabelsFactory}
 */
anychart.core.ui.LabelsFactory.prototype.maxFontSize = function(opt_value) {
  if (goog.isDef(opt_value) && !isNaN(+opt_value)) {
    if (this.maxFontSize_ != +opt_value) {
      this.maxFontSize_ = +opt_value;
      // we don't need to invalidate bounds if adjusting is not enabled
      if (this.adjustEnabled_())
        this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['maxFontSize'] = true;
    return this;
  }
  return this.maxFontSize_;
};


/**
 * Adjust font size.
 * @param {(boolean|Array.<boolean, boolean>|{width:boolean,height:boolean})=} opt_adjustOrAdjustByWidth Is font needs to be adjusted in case of 1 argument and adjusted by width in case of 2 arguments.
 * @param {boolean=} opt_adjustByHeight Is font needs to be adjusted by height.
 * @return {({width:boolean,height:boolean}|anychart.core.ui.LabelsFactory)} adjustFontSite setting or self for method chaining.
 */
anychart.core.ui.LabelsFactory.prototype.adjustFontSize = function(opt_adjustOrAdjustByWidth, opt_adjustByHeight) {
  // if values are set as an array ( [true, true] [true, false] [false, true] [false, false] ) rather than a set of two arguments, simply expand their
  if (goog.isArray(opt_adjustOrAdjustByWidth)) {
    return this.adjustFontSize.apply(this, opt_adjustOrAdjustByWidth);
  } else if (goog.isObject(opt_adjustOrAdjustByWidth)) {
    this.adjustFontSize(opt_adjustOrAdjustByWidth['width'], opt_adjustOrAdjustByWidth['height']);
    return this;
  }
  var stateToInvalidate = 0;
  // if 2 params are set
  if (goog.isDef(opt_adjustByHeight)) {
    if (this.adjustByWidth_ != !!opt_adjustOrAdjustByWidth) {
      this.adjustByWidth_ = !!opt_adjustOrAdjustByWidth;
      stateToInvalidate |= anychart.ConsistencyState.BOUNDS;
    }
    if (this.adjustByHeight_ != !!opt_adjustByHeight) {
      this.adjustByHeight_ = !!opt_adjustByHeight;
      stateToInvalidate |= anychart.ConsistencyState.BOUNDS;
    }
    this.invalidate(stateToInvalidate, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    this.changedSettings['adjustByHeight'] = true;
    this.changedSettings['adjustByWidth'] = true;
    return this;
    // if only one param is set -  adjusting for the both
  } else if (goog.isDef(opt_adjustOrAdjustByWidth)) {
    if (!(this.adjustByWidth_ == this.adjustByHeight_ && this.adjustByWidth_ == opt_adjustOrAdjustByWidth)) {
      this.adjustByWidth_ = this.adjustByHeight_ = /** @type {boolean} */ (opt_adjustOrAdjustByWidth);
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['adjustByHeight'] = true;
    this.changedSettings['adjustByWidth'] = true;
    return this;
  }
  return {'width': this.adjustByWidth_, 'height': this.adjustByHeight_};
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.prototype.fontColor = function(opt_value) {
  if (opt_value) {
    return goog.base(this, 'fontColor', opt_value);
  } else {
    return goog.isDef(this.changedSettings['fontColor']) ?
        goog.base(this, 'fontColor') : this.autoColor_ || goog.base(this, 'fontColor');
  }
};


/**
 * Sets labels color that parent series have set for it.
 * @param {string} value Auto color distributed by the series.
 */
anychart.core.ui.LabelsFactory.prototype.setAutoColor = function(value) {
  this.autoColor_ = value;
};


/**
 * Whether default setting with passed name.
 * @param {string} value Name of settings field.
 * @return {boolean}
 */
anychart.core.ui.LabelsFactory.prototype.isDefault = function(value) {
  return !this.changedSettings[value];
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  if (goog.isNull(json['enabled'])) delete json['enabled'];
  if (this.background_) json['background'] = this.background_.serialize();
  if (this.padding_) json['padding'] = this.padding_.serialize();
  if (this.changedSettings['position']) json['position'] = this.position();
  if (this.changedSettings['anchor']) json['anchor'] = this.anchor();
  if (this.changedSettings['offsetX']) json['offsetX'] = this.offsetX();
  if (this.changedSettings['offsetY']) json['offsetY'] = this.offsetY();
  if (this.changedSettings['rotation']) json['rotation'] = this.rotation();
  if (this.changedSettings['width']) json['width'] = this.width();
  if (this.changedSettings['height']) json['height'] = this.height();
  return json;
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.background(config['background']);
  this.padding(config['padding']);
  this.position(config['position']);
  this.anchor(config['anchor']);
  this.offsetX(config['offsetX']);
  this.offsetY(config['offsetY']);
  this.rotation(config['rotation']);
  this.width(config['width']);
  this.height(config['height']);
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.prototype.remove = function() {
  this.container(null);
  if (this.layer_) this.layer_.parent(null);
};


/**
 * Clears an array of labels.
 * @param {number=} opt_index If set, removes only the label that is in passed index.
 * @return {anychart.core.ui.LabelsFactory} Returns itself for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.clear = function(opt_index) {
  if (!this.freeToUseLabelsPool_)
    this.freeToUseLabelsPool_ = [];

  if (this.labels_) {
    opt_index = +opt_index;
    if (!isNaN(opt_index) && opt_index in this.labels_) {
      this.labels_[opt_index].clear();
      this.freeToUseLabelsPool_.push(this.labels_[opt_index]);
      this.dropCallsCache(opt_index);
      delete this.labels_[opt_index];
    } else {
      this.dropCallsCache();
      goog.array.forEach(this.labels_, function(label) {
        label.clear();
        this.freeToUseLabelsPool_.push(label);
      }, this);
      this.labels_.length = 0;
    }
    this.invalidate(anychart.ConsistencyState.LABELS_FACTORY_HANDLERS, anychart.Signal.NEEDS_REDRAW);
  } else
    this.labels_ = [];

  return this;
};


/**
 * Returns label by index (if there is such label).
 * @param {number} index Label index.
 * @return {anychart.core.ui.LabelsFactory.Label} Already existing label.
 */
anychart.core.ui.LabelsFactory.prototype.getLabel = function(index) {
  index = +index;
  return this.labels_ && this.labels_[index] ? this.labels_[index] : null;
};


/**
 * Labels count
 * @return {number}
 */
anychart.core.ui.LabelsFactory.prototype.labelsCount = function() {
  return this.labels_ ? this.labels_.length : 0;
};


/**
 * Returns object with changed states.
 * @return {Object.<boolean>}
 */
anychart.core.ui.LabelsFactory.prototype.getSettingsChangedStatesObj = function() {
  return this.changedSettings;
};


/**
 * Returns DOM element.
 * @return {acgraph.vector.Layer}
 */
anychart.core.ui.LabelsFactory.prototype.getDomElement = function() {
  return this.layer_;
};


/**
 * Creates new instance of anychart.core.ui.LabelsFactory.Label, saves it in the factory
 * and returns it.
 * @param {*} formatProvider Object that provides info for textFormatter function.
 * @param {*} positionProvider Object that provides info for positionFormatter function.
 * @param {number=} opt_index Label index.
 * @return {!anychart.core.ui.LabelsFactory.Label} Returns new label instance.
 */
anychart.core.ui.LabelsFactory.prototype.add = function(formatProvider, positionProvider, opt_index) {
  var label, index;
  if (!goog.isDef(this.labels_)) this.labels_ = [];

  if (goog.isDef(opt_index)) {
    index = +opt_index;
    label = this.labels_[index];
  }

  if (label) {
    label.suspendSignalsDispatching();
    label.clear();
  } else {
    label = this.freeToUseLabelsPool_ && this.freeToUseLabelsPool_.length > 0 ?
        this.freeToUseLabelsPool_.pop() :
        this.createLabel();
    label.suspendSignalsDispatching();

    if (goog.isDef(index)) {
      this.labels_[index] = label;
      label.setIndex(index);
    } else {
      this.labels_.push(label);
      label.setIndex(this.labels_.length - 1);
    }
  }

  label.formatProvider(formatProvider);
  label.positionProvider(positionProvider);
  label.parentLabelsFactory(this);
  label.resumeSignalsDispatching(false);

  return label;
};


/**
 * @protected
 * @return {anychart.core.ui.LabelsFactory.Label}
 */
anychart.core.ui.LabelsFactory.prototype.createLabel = function() {
  return new anychart.core.ui.LabelsFactory.Label();
};


/**
 * Labels drawing.
 * @return {anychart.core.ui.LabelsFactory} Returns itself for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.draw = function() {
  if (!this.layer_) {
    this.layer_ = acgraph.layer();
    this.bindHandlersToGraphics(this.layer_);
    this.registerDisposable(this.layer_);
  }

  var stage = this.container() ? this.container().getStage() : null;
  var manualSuspend = stage && !stage.isSuspended();
  if (manualSuspend) stage.suspend();

  if (this.labels_) {
    goog.array.forEach(this.labels_, function(label, index) {
      if (label) {
        label.container(this.layer_);
        label.draw();
      }
    }, this);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    this.layer_.zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.layer_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  this.markConsistent(anychart.ConsistencyState.ALL);

  if (manualSuspend) stage.resume();
  return this;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Measurement.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Returns label size.
 * @param {*|anychart.core.ui.LabelsFactory.Label} formatProviderOrLabel Object that provides info for textFormatter function.
 * @param {*=} opt_positionProvider Object that provides info for positionFormatter function.
 * @param {Object=} opt_settings .
 * @param {number=} opt_cacheIndex .
 * @return {anychart.math.Rect} Label bounds.
 */
anychart.core.ui.LabelsFactory.prototype.getDimension = function(formatProviderOrLabel, opt_positionProvider, opt_settings, opt_cacheIndex) {
  var text;
  var textElementBounds;
  var textWidth;
  var textHeight;
  /** @type {anychart.math.Rect} */
  var outerBounds = new anychart.math.Rect(0, 0, 0, 0);
  var isWidthSet;
  var isHeightSet;
  var parentWidth;
  var parentHeight;
  var formatProvider;
  var positionProvider;

  if (!this.measureCustomLabel_) this.measureCustomLabel_ = new anychart.core.ui.LabelsFactory.Label();
  else this.measureCustomLabel_.clear();

  if (formatProviderOrLabel instanceof anychart.core.ui.LabelsFactory.Label) {
    var label = (/** @type {anychart.core.ui.LabelsFactory.Label} */(formatProviderOrLabel));
    this.measureCustomLabel_.setup(label.serialize());
    formatProvider = label.formatProvider();
    positionProvider = opt_positionProvider || label.positionProvider() || {'value' : {'x': 0, 'y': 0}};
  } else {
    formatProvider = formatProviderOrLabel;
    positionProvider = opt_positionProvider || {'value' : {'x': 0, 'y': 0}};
  }
  this.measureCustomLabel_.setSettings(opt_settings);

  var isHtml = goog.isDef(this.measureCustomLabel_.useHtml()) ? this.measureCustomLabel_.useHtml() : this.useHtml();

  //we should ask text element about bounds only after text format and text settings are applied

  //define parent bounds
  var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());
  if (parentBounds) {
    parentWidth = parentBounds.width;
    parentHeight = parentBounds.height;
  }

  var padding = opt_settings && opt_settings['padding'] ? this.measureCustomLabel_.padding() : this.padding();
  var widthSettings = this.measureCustomLabel_.width() || this.width();
  var heightSettings = this.measureCustomLabel_.height() || this.height();
  var offsetY = /** @type {number|string} */(this.measureCustomLabel_.offsetY() || this.offsetY());
  var offsetX = /** @type {number|string} */(this.measureCustomLabel_.offsetX() || this.offsetX());
  var anchor = /** @type {string} */(this.measureCustomLabel_.anchor() || this.anchor());


  if (!this.measureTextElement_) this.measureTextElement_ = acgraph.text();
  text = this.callTextFormatter(this.textFormatter_, formatProvider, opt_cacheIndex);
  this.measureTextElement_.width(null);
  this.measureTextElement_.height(null);
  if (isHtml) {
    this.measureTextElement_.htmlText(goog.isDefAndNotNull(text) ? String(text) : null);
  } else {
    this.measureTextElement_.text(goog.isDefAndNotNull(text) ? String(text) : null);
  }

  this.applyTextSettings(this.measureTextElement_, true);
  this.measureCustomLabel_.applyTextSettings(this.measureTextElement_, false);

  //define is width and height set from settings
  isWidthSet = !goog.isNull(widthSettings);
  isHeightSet = !goog.isNull(heightSettings);

  textElementBounds = this.measureTextElement_.getBounds();

  //calculate text width and outer width
  var width;
  if (isWidthSet) {
    width = Math.ceil(anychart.utils.normalizeSize(/** @type {number|string} */(widthSettings), parentWidth));
    textWidth = padding.tightenWidth(width);
    outerBounds.width = width;
  } else {
    width = textElementBounds.width;
    outerBounds.width = padding.widenWidth(width);
  }

  if (goog.isDef(textWidth)) this.measureTextElement_.width(textWidth);

  textElementBounds = this.measureTextElement_.getBounds();

  //calculate text height and outer height
  var height;
  if (isHeightSet) {
    height = Math.ceil(anychart.utils.normalizeSize(/** @type {number|string} */(heightSettings), parentHeight));
    textHeight = padding.tightenHeight(height);
    outerBounds.height = height;
  } else {
    height = textElementBounds.height;
    outerBounds.height = padding.widenHeight(height);
  }

  if (goog.isDef(textHeight)) this.measureTextElement_.height(textHeight);

  var formattedPosition = goog.object.clone(this.positionFormatter_.call(positionProvider, positionProvider));
  var position = new acgraph.math.Coordinate(formattedPosition['x'], formattedPosition['y']);
  var anchorCoordinate = anychart.utils.getCoordinateByAnchor(
      new anychart.math.Rect(0, 0, outerBounds.width, outerBounds.height),
      /** @type {string} */(anchor));

  position.x -= anchorCoordinate.x;
  position.y -= anchorCoordinate.y;

  offsetX = goog.isDef(offsetX) ? anychart.utils.normalizeSize(offsetX, parentWidth) : 0;
  offsetY = goog.isDef(offsetY) ? anychart.utils.normalizeSize(offsetY, parentHeight) : 0;

  anychart.utils.applyOffsetByAnchor(position, /** @type {anychart.enums.Anchor} */(anchor), offsetX, offsetY);

  outerBounds.left = position.x;
  outerBounds.top = position.y;

  return /**@type {anychart.math.Rect} */(outerBounds);
};


/**
 * Measure labels using formatProvider, positionProvider and returns labels bounds.
 * @param {*|anychart.core.ui.LabelsFactory.Label} formatProviderOrLabel Object that provides info for textFormatter function.
 * @param {*=} opt_positionProvider Object that provides info for positionFormatter function.
 * @param {Object=} opt_settings .
 * @param {number=} opt_cacheIndex .
 * @return {anychart.math.Rect} Labels bounds.
 */
anychart.core.ui.LabelsFactory.prototype.measure = function(formatProviderOrLabel, opt_positionProvider, opt_settings, opt_cacheIndex) {
  var arr = this.measureWithTransform(formatProviderOrLabel, opt_positionProvider, opt_settings, opt_cacheIndex);
  return anychart.math.Rect.fromCoordinateBox(arr);
};


/**
 * Measures label in its coordinate system and returns bounds as an array of points in parent coordinate system.
 * @param {*|anychart.core.ui.LabelsFactory.Label} formatProviderOrLabel Object that provides info for textFormatter function.
 * @param {*=} opt_positionProvider Object that provides info for positionFormatter function.
 * @param {Object=} opt_settings .
 * @param {number=} opt_cacheIndex .
 * @return {Array.<number>} Label bounds.
 */
anychart.core.ui.LabelsFactory.prototype.measureWithTransform = function(formatProviderOrLabel, opt_positionProvider, opt_settings, opt_cacheIndex) {
  var rotation, anchor;
  if (formatProviderOrLabel instanceof anychart.core.ui.LabelsFactory.Label) {
    rotation = goog.isDef(formatProviderOrLabel.rotation()) ? formatProviderOrLabel.rotation() : this.rotation();
    anchor = formatProviderOrLabel.anchor() || this.anchor();
    opt_cacheIndex = opt_cacheIndex || formatProviderOrLabel.getIndex();
  } else {
    rotation = goog.isDef(opt_settings) && goog.isDef(opt_settings['rotation']) ? opt_settings['rotation'] : this.rotation();
    anchor = goog.isDef(opt_settings) && opt_settings['anchor'] || this.anchor();
  }

  var bounds = this.getDimension(formatProviderOrLabel, opt_positionProvider, opt_settings, opt_cacheIndex);

  var rotationAngle = /** @type {number} */(rotation);
  var point = anychart.utils.getCoordinateByAnchor(bounds, /** @type {anychart.enums.Anchor} */(anchor));
  var tx = goog.graphics.AffineTransform.getRotateInstance(goog.math.toRadians(rotationAngle), point.x, point.y);

  var arr = bounds.toCoordinateBox() || [];
  tx.transform(arr, 0, arr, 0, 4);

  return arr;
};


/**
 * Calls text formatter in scope of provider, or returns value from cache.
 * @param {Function} formatter Text formatter function.
 * @param {*} provider Provider for text formatter.
 * @param {number=} opt_cacheIndex Label index.
 * @return {*}
 */
anychart.core.ui.LabelsFactory.prototype.callTextFormatter = function(formatter, provider, opt_cacheIndex) {
  if (!this.textFormatterCallsCache_)
    this.textFormatterCallsCache_ = {};
  if (goog.isDefAndNotNull(opt_cacheIndex)) {
    if (!goog.isDef(this.textFormatterCallsCache_[opt_cacheIndex]))
      this.textFormatterCallsCache_[opt_cacheIndex] = formatter.call(provider, provider);

    return this.textFormatterCallsCache_[opt_cacheIndex];
  }
  return formatter.call(provider, provider);
};


/**
 * Drops tet formatter calls cache.
 * @param {number=} opt_index
 * @return {anychart.core.ui.LabelsFactory} Self for chaining.
 */
anychart.core.ui.LabelsFactory.prototype.dropCallsCache = function(opt_index) {
  if (!goog.isDef(opt_index))
    this.textFormatterCallsCache_ = {};
  else
    this.textFormatterCallsCache_[opt_index] = null;
  return this;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Events
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.ui.LabelsFactory.prototype.makeBrowserEvent = function(e) {
  var res = goog.base(this, 'makeBrowserEvent', e);
  var target = res['domTarget'];
  var tag;
  while (target instanceof acgraph.vector.Element) {
    tag = target.tag;
    if (tag instanceof anychart.core.VisualBase || !anychart.utils.isNaN(tag))
      break;
    target = target.parent();
  }
  res['labelIndex'] = anychart.utils.toNumber(tag);
  return res;
};



//----------------------------------------------------------------------------------------------------------------------
//
//  LabelsFactory label class.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Class for creation of sets of similar labels and management of such sets.
 * Any individual label can be changed after all labels are displayed.
 * @constructor
 * @extends {anychart.core.Text}
 */
anychart.core.ui.LabelsFactory.Label = function() {
  goog.base(this);

  /**
   * Label index.
   * @type {number}
   * @private
   */
  this.index_;

  /**
   * Label layer
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.layer_;

  /**
   * @type {acgraph.vector.Text}
   * @protected
   */
  this.textElement;

  /**
   * @type {anychart.core.ui.Background}
   * @private
   */
  this.backgroundElement_;

  /**
   * @type {Object}
   * @protected
   */
  this.mergedSettings;

  this.resetSettings();
};
goog.inherits(anychart.core.ui.LabelsFactory.Label, anychart.core.Text);


/**
 * Supported signals.
 * @type {number}
 */
anychart.core.ui.LabelsFactory.Label.prototype.SUPPORTED_SIGNALS = anychart.core.Text.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.LabelsFactory.Label.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Text.prototype.SUPPORTED_CONSISTENCY_STATES;


/**
 * Returns DOM element.
 * @return {acgraph.vector.Layer}
 */
anychart.core.ui.LabelsFactory.Label.prototype.getDomElement = function() {
  return this.layer_;
};


/**
 * Gets/sets parent LabelsFactory.
 * @param {!anychart.core.ui.LabelsFactory=} opt_value labels factory.
 * @return {anychart.core.ui.LabelsFactory|anychart.core.ui.LabelsFactory.Label} Returns LabelsFactory or self
 * for method chainging.
 */
anychart.core.ui.LabelsFactory.Label.prototype.parentLabelsFactory = function(opt_value) {
  if (goog.isDefAndNotNull(opt_value)) {
    if (this.parentLabelsFactory_ != opt_value) {
      this.parentLabelsFactory_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.parentLabelsFactory_;
  }
};


/**
 * Returns label index.
 * @return {number}
 */
anychart.core.ui.LabelsFactory.Label.prototype.getIndex = function() {
  return this.index_;
};


/**
 * Sets labels index.
 * @param {number} index Index to set.
 * @return {anychart.core.ui.LabelsFactory.Label}
 */
anychart.core.ui.LabelsFactory.Label.prototype.setIndex = function(index) {
  this.index_ = +index;
  return this;
};


/**
 * Gets/sets LabelsFactory to a label.
 * @param {anychart.core.ui.LabelsFactory=} opt_value labels factory.
 * @return {anychart.core.ui.LabelsFactory|anychart.core.ui.LabelsFactory.Label} Returns LabelsFactory or self
 * for method chainging.
 */
anychart.core.ui.LabelsFactory.Label.prototype.currentLabelsFactory = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.currentLabelsFactory_ != opt_value) {
      this.currentLabelsFactory_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.currentLabelsFactory_;
  }
};


/**
 * Gets or sets the Label background settings.
 * @param {(string|Object|null|boolean)=} opt_value Background object to set.
 * @return {!(anychart.core.ui.LabelsFactory.Label|anychart.core.ui.Background)} Returns background or itself for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.background = function(opt_value) {
  var makeDefault = goog.isNull(opt_value);
  if (!makeDefault && !this.settingsObj['background']) {
    this.settingsObj['background'] = new anychart.core.ui.Background();
    this.registerDisposable(this.settingsObj['background']);
    this.settingsObj['background'].listenSignals(this.backgroundInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (makeDefault)
      goog.dispose(this.settingsObj['background']);
    else
      this.settingsObj['background'].setup(opt_value);
    return this;
  }
  return this.settingsObj['background'];
};


/**
 * Internal background invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.ui.LabelsFactory.Label.prototype.backgroundInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
  }
};


/**
 * Getter for current label padding.<br/>
 * @param {(null|string|number|Array.<number|string>|{top:(number|string),left:(number|string),bottom:(number|string),right:(number|string)})=} opt_spaceOrTopOrTopAndBottom .
 * @param {(string|number)=} opt_rightOrRightAndLeft .
 * @param {(string|number)=} opt_bottom .
 * @param {(string|number)=} opt_left .
 * @return {anychart.core.ui.LabelsFactory.Label|anychart.core.utils.Padding} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.padding = function(opt_spaceOrTopOrTopAndBottom, opt_rightOrRightAndLeft, opt_bottom, opt_left) {
  var makeDefault = goog.isNull(opt_spaceOrTopOrTopAndBottom);
  if (!makeDefault && !this.settingsObj['padding']) {
    this.settingsObj['padding'] = new anychart.core.utils.Padding();
    this.registerDisposable(this.settingsObj['padding']);
    this.settingsObj['padding'].listenSignals(this.boundsInvalidated_, this);
  }
  if (goog.isDef(opt_spaceOrTopOrTopAndBottom)) {
    if (makeDefault)
      goog.dispose(this.settingsObj['padding']);
    else
      this.settingsObj['padding'].setup.apply(this.settingsObj['padding'], arguments);
    return this;
  }
  return this.settingsObj['padding'];
};


/**
 * Listener for bounds invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.core.ui.LabelsFactory.Label.prototype.boundsInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
  }
};


/**
 * Getter for label width.
 * @param {(number|string|null)=} opt_value .
 * @return {!anychart.core.ui.LabelsFactory.Label|number|string|null} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.width = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.width !== opt_value) {
      this.settingsObj.width = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.settingsObj.width;
};


/**
 * Getter for label height.
 * @param {(number|string|null)=} opt_value .
 * @return {!anychart.core.ui.LabelsFactory.Label|number|string|null} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.height = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.height !== opt_value) {
      this.settingsObj.height = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.settingsObj.height;
};


/**
 * Rotates a label around an anchor.
 * ({@link acgraph.vector.Element}). Method resets transformation and applies a new one.
 * @param {number=} opt_value Rotation angle in degrees.
 * @return {number|anychart.core.ui.LabelsFactory.Label} Rotation angle in degrees or self for chaining call.
 */
anychart.core.ui.LabelsFactory.Label.prototype.rotation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = +opt_value;
    if (this.settingsObj.rotation !== opt_value) {
      this.settingsObj.rotation = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.rotation;
  }
};


/**
 * Getter for label anchor settings.
 * @param {(anychart.enums.Anchor|string)=} opt_value .
 * @return {!anychart.core.ui.LabelsFactory.Label|anychart.enums.Anchor} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.anchor = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeAnchor(opt_value);
    if (this.settingsObj.anchor !== opt_value) {
      this.settingsObj.anchor = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.anchor;
  }
};


/**
 * Getter for current label offsetX settings.
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.LabelsFactory.Label} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.offsetX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.offsetX != opt_value) {
      this.settingsObj.offsetX = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.offsetX;
  }
};


/**
 * Getter for current label offsetY settings.
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.LabelsFactory.Label} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.offsetY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.offsetY != opt_value) {
      this.settingsObj.offsetY = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.offsetY;
  }
};


/**
 * Helper method.
 * @private
 * @return {boolean} is adjustment enabled.
 */
anychart.core.ui.LabelsFactory.Label.prototype.adjustEnabled_ = function() {
  return (this.settingsObj.adjustByWidth || this.settingsObj.adjustByHeight);
};


/**
 * Sets font size setting for adjust text from.
 * @param {(number|string)=} opt_value
 * @return {number|anychart.core.ui.LabelsFactory.Label}
 */
anychart.core.ui.LabelsFactory.Label.prototype.minFontSize = function(opt_value) {
  if (goog.isDef(opt_value) && !isNaN(+opt_value)) {
    if (this.settingsObj.minFontSize != +opt_value) {
      this.settingsObj.minFontSize = +opt_value;
      // we don't need to invalidate bounds if adjusting is not enabled
      if (this.adjustEnabled_())
        this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.settingsObj.minFontSize;
};


/**
 * Sets font size setting for adjust text to.
 * @param {(number|string)=} opt_value
 * @return {number|anychart.core.ui.LabelsFactory.Label}
 */
anychart.core.ui.LabelsFactory.Label.prototype.maxFontSize = function(opt_value) {
  if (goog.isDef(opt_value) && !isNaN(+opt_value)) {
    if (this.settingsObj.maxFontSize != +opt_value) {
      this.settingsObj.maxFontSize = +opt_value;
      // we don't need to invalidate bounds if adjusting is not enabled
      if (this.adjustEnabled_())
        this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return this.settingsObj.maxFontSize;
};


/**
 * Adjust font size.
 * @param {(boolean|Array.<boolean, boolean>|{width:boolean,height:boolean})=} opt_adjustOrAdjustByWidth Is font needs to be adjusted in case of 1 argument and adjusted by width in case of 2 arguments.
 * @param {boolean=} opt_adjustByHeight Is font needs to be adjusted by height.
 * @return {({width:boolean,height:boolean}|anychart.core.ui.LabelsFactory.Label)} adjustFontSite setting or self for method chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.adjustFontSize = function(opt_adjustOrAdjustByWidth, opt_adjustByHeight) {
  // if values are set as an array ( [true, true] [true, false] [false, true] [false, false] ) rather than a set of two arguments, simply expand their
  if (goog.isArray(opt_adjustOrAdjustByWidth)) {
    return this.adjustFontSize.apply(this, opt_adjustOrAdjustByWidth);
  } else if (goog.isObject(opt_adjustOrAdjustByWidth)) {
    this.adjustFontSize(opt_adjustOrAdjustByWidth['width'], opt_adjustOrAdjustByWidth['height']);
    return this;
  }
  var stateToInvalidate = 0;
  // if 2 params are set
  if (goog.isDef(opt_adjustByHeight)) {
    if (this.settingsObj.adjustByWidth != !!opt_adjustOrAdjustByWidth) {
      this.settingsObj.adjustByWidth = !!opt_adjustOrAdjustByWidth;
      stateToInvalidate |= anychart.ConsistencyState.BOUNDS;
    }
    if (this.settingsObj.adjustByHeight != !!opt_adjustByHeight) {
      this.settingsObj.adjustByHeight = !!opt_adjustByHeight;
      stateToInvalidate |= anychart.ConsistencyState.BOUNDS;
    }
    this.invalidate(stateToInvalidate, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
    // if only one param is set -  adjusting for the both
  } else if (goog.isDef(opt_adjustOrAdjustByWidth)) {
    if (!(this.settingsObj.adjustByWidth == this.settingsObj.adjustByHeight && this.settingsObj.adjustByWidth == opt_adjustOrAdjustByWidth)) {
      this.settingsObj.adjustByWidth = this.settingsObj.adjustByHeight = /** @type {boolean} */ (opt_adjustOrAdjustByWidth);
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  }
  return {'width': this.settingsObj.adjustByWidth, 'height': this.settingsObj.adjustByHeight};
};


/**
 * Check
 * @param {number} width
 * @param {number} height
 * @param {number} originWidth
 * @param {number} originHeight
 * @param {boolean} adjustByWidth
 * @param {boolean} adjustByHeight
 * @private
 * @return {number}
 */
anychart.core.ui.LabelsFactory.Label.prototype.check_ = function(width, height, originWidth, originHeight, adjustByWidth, adjustByHeight) {
  if (adjustByWidth && adjustByHeight) {
    if (width > originWidth || height > originHeight) {
      return 1;
    } else if (width < originWidth || height < originHeight) {
      return -1;
    }
  } else if (adjustByWidth) {
    if (width < originWidth) {
      return -1;
    } else if (width > originWidth) {
      return 1;
    }
  } else if (adjustByHeight) {
    if (height < originHeight) {
      return -1;
    } else if (height > originHeight) {
      return 1;
    }
  }

  return 0;
};


/**
 * Getter for current label position settings.
 * @param {string=} opt_value .
 * @return {!anychart.core.ui.LabelsFactory.Label|string} .
 */
anychart.core.ui.LabelsFactory.Label.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = String(opt_value);
    if (this.settingsObj.position != opt_value) {
      this.settingsObj.position = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return /** @type {anychart.enums.Position} */(this.settingsObj.position);
  }
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.Label.prototype.enabled = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.enabledLabel != opt_value) {
      this.settingsObj.enabledLabel = opt_value;
      this.invalidate(anychart.ConsistencyState.ENABLED, anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.enabledLabel;
  }
};


/**
 * Gets/Sets text formatter.
 * @param {*=} opt_value Text formatter.
 * @return {*} Text formatter or itself for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.textFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.textFormatter != opt_value) {
      this.settingsObj.textFormatter = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.textFormatter;
  }
};


/**
 * Gets/Sets position formatter.
 * @param {*=} opt_value Position formatter.
 * @return {*} Position formatter or self for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.positionFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.positionFormatter != opt_value) {
      this.settingsObj.positionFormatter = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.positionFormatter;
  }
};


/**
 * Gets/Sets format provider.
 * @param {*=} opt_value Format provider.
 * @return {*} Format provider or self for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.formatProvider = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.formatProvider_ != opt_value) {
      this.formatProvider_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.formatProvider_;
  }
};


/**
 * Gets/Sets position provider.
 * @param {*=} opt_value Position provider.
 * @return {*} Position provider or self for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.positionProvider = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.positionProvider_ != opt_value) {
      this.positionProvider_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.positionProvider_;
  }
};


/**
 * Resets label to the initial state, but leaves DOM elements intact, but without the parent.
 */
anychart.core.ui.LabelsFactory.Label.prototype.clear = function() {
  this.resetSettings();
  if (this.layer_) {
    this.layer_.parent(null);
    this.layer_.removeAllListeners();
  }
  this.invalidate(anychart.ConsistencyState.CONTAINER);
};


/**
 * Reset settings.
 */
anychart.core.ui.LabelsFactory.Label.prototype.resetSettings = function() {
  this.settingsObj = {};
  this.changedSettings = {};
  this.superSettingsObj = {};
};


/**
 * Sets settings.
 * @param {Object=} opt_settings1 Settings1.
 * @param {Object=} opt_settings2 Settings2.
 * @return {anychart.core.ui.LabelsFactory.Label} Returns self for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.setSettings = function(opt_settings1, opt_settings2) {
  if (goog.isDef(opt_settings1)) {
    this.setup(opt_settings1);
  }
  if (goog.isDefAndNotNull(opt_settings2)) this.superSettingsObj = opt_settings2;

  if (goog.isDef(opt_settings1) || goog.isDef(opt_settings2))
    this.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.ENABLED,
        anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW);
  return this;
};


/**
 * Adjust font size by width/height.
 * @param {number} originWidth
 * @param {number} originHeight
 * @param {!acgraph.vector.Text} text
 * @param {number} minFontSize
 * @param {number} maxFontSize
 * @param {boolean} adjustByWidth
 * @param {boolean} adjustByHeight
 * @return {number}
 * @private
 */
anychart.core.ui.LabelsFactory.Label.prototype.calculateFontSize_ = function(originWidth, originHeight, text, minFontSize, maxFontSize, adjustByWidth, adjustByHeight) {
  /** @type {number} */
  var fontSize = Math.round((maxFontSize + minFontSize) / 2);

  /** @type {number} */
  var from = minFontSize;

  /** @type {number} */
  var to = maxFontSize;

  /** @type {number} */
  var checked;

  // check if the maximal value is ok
  text.fontSize(maxFontSize);
  if (this.check_(text.getBounds().width, text.getBounds().height, originWidth, originHeight, adjustByWidth, adjustByHeight) <= 0) {
    return maxFontSize;
  }
  // set initial fontSize - that's half way between min and max
  text.fontSize(fontSize);
  // check sign
  var sign = checked = this.check_(text.getBounds().width, text.getBounds().height, originWidth, originHeight, adjustByWidth, adjustByHeight);

  // divide in half and iterate waiting for the sign to change
  while (from != to) {
    if (checked < 0) {
      from = Math.min(fontSize + 1, to);
      fontSize += Math.floor((to - fontSize) / 2);
    } else if (checked > 0) {
      to = Math.max(fontSize - 1, from);
      fontSize -= Math.ceil((fontSize - from) / 2);
    } else {
      break;
    }
    text.fontSize(fontSize);
    checked = this.check_(text.getBounds().width, text.getBounds().height, originWidth, originHeight, adjustByWidth, adjustByHeight);
    // sign chaneged if product is negative, 0 is an exit too
    if (sign * checked <= 0) {
      break;
    }
  }

  if (checked == 0) {
    // size is exactly ok for the bounds set
    return fontSize;
  }

  // iterate increase/decrease font size until sign changes again
  do {
    fontSize += sign;
    text.fontSize(fontSize);
    checked = this.check_(text.getBounds().width, text.getBounds().height, originWidth, originHeight, adjustByWidth, adjustByHeight);
  } while (sign * checked < 0);

  // decrease font size only if we've been increasing it - we are looking for size to fit in bounds
  if (sign > 0) fontSize -= sign;
  return fontSize;
};


/**
 * Merge settings.
 * @param {*} pointSettings Custom settings from a point.
 * @param {*} pointSuperSettings Custom settings from a point (hover usually).
 * @param {*} factorySettings Settings from the parent factory.
 * @param {*} factorySuperSettings Settings from the current factory.
 * @param {boolean} isFactorySettingsChanged
 * @return {*} Final settings.
 * @private
 */
anychart.core.ui.LabelsFactory.Label.prototype.getFinalSettings_ = function(
    pointSettings,
    pointSuperSettings,
    factorySettings,
    factorySuperSettings,
    isFactorySettingsChanged) {

  var notSelfSettings = this.currentLabelsFactory() && this.parentLabelsFactory() != this.currentLabelsFactory();

  return notSelfSettings ?
      goog.isDef(pointSuperSettings) ?
          pointSuperSettings :
          isFactorySettingsChanged ?
              factorySuperSettings :
              goog.isDef(pointSettings) ?
                  pointSettings :
                  factorySettings :
      goog.isDef(pointSettings) ?
          pointSettings :
          factorySettings;
};


/**
 * Label drawing.
 * @param {anychart.math.Rect} bounds Outter label bounds.
 * @param {anychart.math.Rect} parentBounds Parent bounds.
 */
anychart.core.ui.LabelsFactory.Label.prototype.drawLabel = function(bounds, parentBounds) {
  var positionFormatter = this.mergedSettings['positionFormatter'];
  var anchor = this.mergedSettings['anchor'];
  var offsetX = this.mergedSettings['offsetX'];
  var offsetY = this.mergedSettings['offsetY'];

  var parentWidth = 0, parentHeight = 0;
  if (parentBounds) {
    parentWidth = parentBounds.width;
    parentHeight = parentBounds.height;
  }

  var positionProvider = this.positionProvider();
  var formattedPosition = goog.object.clone(positionFormatter.call(positionProvider, positionProvider));
  var position = new acgraph.math.Coordinate(formattedPosition['x'], formattedPosition['y']);

  var anchorCoordinate = anychart.utils.getCoordinateByAnchor(
      new anychart.math.Rect(0, 0, bounds.width, bounds.height), anchor);

  position.x -= anchorCoordinate.x;
  position.y -= anchorCoordinate.y;

  var offsetXNormalized = goog.isDef(offsetX) ? anychart.utils.normalizeSize(/** @type {number|string} */(offsetX), parentWidth) : 0;
  var offsetYNormalized = goog.isDef(offsetY) ? anychart.utils.normalizeSize(/** @type {number|string} */(offsetY), parentHeight) : 0;

  anychart.utils.applyOffsetByAnchor(position, anchor, offsetXNormalized, offsetYNormalized);

  this.textX += position.x;
  this.textY += position.y;
  bounds.left = position.x;
  bounds.top = position.y;

  this.textElement.x(/** @type {number} */(this.textX)).y(/** @type {number} */(this.textY));
};


/**
 * Label drawing.
 * @return {anychart.core.ui.LabelsFactory.Label} Returns self for chaining.
 */
anychart.core.ui.LabelsFactory.Label.prototype.draw = function() {
  var parentLabelsFactory = this.parentLabelsFactory();
  var currentLabelsFactory = this.currentLabelsFactory() ? this.currentLabelsFactory() : parentLabelsFactory;
  var labelsFactory = currentLabelsFactory ? currentLabelsFactory : parentLabelsFactory;
  var settingsChangedStates;
  var notSelfSettings = labelsFactory != parentLabelsFactory;
  if (notSelfSettings)
    settingsChangedStates = labelsFactory.getSettingsChangedStatesObj();
  if (!this.layer_) this.layer_ = acgraph.layer();
  this.layer_.tag = this.index_;

  var enabled = notSelfSettings ?
      goog.isDef(this.superSettingsObj['enabled']) ?
          this.superSettingsObj['enabled'] :
          labelsFactory.enabled() ?
              labelsFactory.enabled() :
              goog.isDef(this.enabled()) ?
                  this.enabled() :
                  parentLabelsFactory.enabled() :
      goog.isDef(this.enabled()) ?
          this.enabled() :
          parentLabelsFactory.enabled();

  if (this.hasInvalidationState(anychart.ConsistencyState.ENABLED) ||
      labelsFactory.hasInvalidationState(anychart.ConsistencyState.ENABLED)) {
    if (!enabled) {
      if (this.layer_) this.layer_.parent(null);
      this.markConsistent(anychart.ConsistencyState.ALL);
      return this;
    } else {
      if (this.container() && !this.layer_.parent())
        this.layer_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
      this.markConsistent(anychart.ConsistencyState.ENABLED);
    }
  }
  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER) ||
      labelsFactory.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    if (enabled) {
      if ((!parentLabelsFactory.enabled() || (goog.isDef(this.enabled()) && !this.enabled())) && parentLabelsFactory.getDomElement()) {
        if (!this.container()) this.container(parentLabelsFactory.getDomElement());
        if (!this.container().parent()) {
          this.container().parent(/** @type {acgraph.vector.ILayer} */(parentLabelsFactory.container()));
        }
      }
      if (this.container())
        this.layer_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    }
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    if (this.container()) this.container().zIndex(/** @type {number} */(parentLabelsFactory.zIndex()));
    this.layer_.zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE) ||
      labelsFactory.hasInvalidationState(anychart.ConsistencyState.BOUNDS) ||
      labelsFactory.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {

    this.mergedSettings = {};
    for (var i = 0, len = labelsFactory.settingsFieldsForMerge.length; i < len; i++) {
      var field = labelsFactory.settingsFieldsForMerge[i];
      this.mergedSettings[field] = this.getFinalSettings_(
          field == 'background' || 'padding' ? this.settingsObj[field] : this[field](),
          this.superSettingsObj[field],
          parentLabelsFactory[field](),
          currentLabelsFactory[field](),
          !!(settingsChangedStates && settingsChangedStates[field]));
    }
    if (!(this.mergedSettings['padding'] instanceof anychart.core.utils.Padding)) {
      this.mergedSettings['padding'] = currentLabelsFactory['padding']().setup(this.superSettingsObj['padding']);
    }

    var adjFontSizePointSupSet = this.superSettingsObj['adjustFontSize'];
    var adjustByWidthPointSupSet, adjustByHeightPointSupSet;
    if (goog.isDef(adjFontSizePointSupSet)) {
      if (goog.isArray(adjFontSizePointSupSet)) {
        adjustByWidthPointSupSet = adjFontSizePointSupSet[0];
        adjustByHeightPointSupSet = adjFontSizePointSupSet[1];
      } else if (goog.isObject(adjFontSizePointSupSet)) {
        adjustByWidthPointSupSet = adjFontSizePointSupSet['width'];
        adjustByHeightPointSupSet = adjFontSizePointSupSet['height'];
      } else {
        adjustByWidthPointSupSet = !!adjFontSizePointSupSet;
        adjustByHeightPointSupSet = !!adjFontSizePointSupSet;
      }
    }
    var adjFontSizeFactorySet = parentLabelsFactory.adjustFontSize();
    var adjFontSizeFactorySupSet = currentLabelsFactory.adjustFontSize();

    this.mergedSettings['adjustByWidth'] = this.getFinalSettings_(
        this.settingsObj.adjustByWidth,
        adjustByWidthPointSupSet,
        adjFontSizeFactorySet.width,
        adjFontSizeFactorySupSet.width,
        !!(settingsChangedStates && settingsChangedStates['adjustByWidth']));

    this.mergedSettings['adjustByHeight'] = this.getFinalSettings_(
        this.settingsObj.adjustByHeight,
        adjustByHeightPointSupSet,
        adjFontSizeFactorySet.height,
        adjFontSizeFactorySupSet.height,
        !!(settingsChangedStates && settingsChangedStates['adjustByHeight']));

    var formatProvider = this.formatProvider();
    var text = parentLabelsFactory.callTextFormatter(this.mergedSettings['textFormatter'], formatProvider, this.getIndex());

    this.layer_.setTransformationMatrix(1, 0, 0, 1, 0, 0);

    if (!this.backgroundElement_) {
      this.backgroundElement_ = new anychart.core.ui.Background();
      this.backgroundElement_.zIndex(0);
      this.backgroundElement_.container(this.layer_);
    }
    if (this.mergedSettings['background'] instanceof anychart.core.ui.Background)
      this.backgroundElement_.setup(this.mergedSettings['background'].serialize());
    else
      this.backgroundElement_.setup(this.mergedSettings['background']);
    this.backgroundElement_.draw();


    if (!this.textElement) {
      this.textElement = acgraph.text();
      this.textElement.zIndex(1);
      this.textElement.parent(this.layer_);
      this.textElement.disablePointerEvents(true);
    }
    //define parent bounds
    var parentWidth, parentHeight;
    var parentBounds;
    if (labelsFactory.parentBounds()) {
      parentBounds = /** @type {anychart.math.Rect} */(labelsFactory.parentBounds());
    } else if (notSelfSettings && parentLabelsFactory.parentBounds()) {
      parentBounds = /** @type {anychart.math.Rect} */(parentLabelsFactory.parentBounds());
    } else if (parentLabelsFactory.container()) {
      parentBounds = parentLabelsFactory.container().getBounds();
    } else {
      parentBounds = anychart.math.rect(0, 0, 0, 0);
    }
    if (parentBounds) {
      parentWidth = parentBounds.width;
      parentHeight = parentBounds.height;
    }

    var isHtml = parentLabelsFactory.useHtml() || labelsFactory.useHtml() || this.useHtml();

    this.textElement.width(null);
    this.textElement.height(null);

    if (isHtml) this.textElement.htmlText(goog.isDef(text) ? String(text) : '');
    else this.textElement.text(goog.isDef(text) ? String(text) : '');

    parentLabelsFactory.applyTextSettings(this.textElement, true);
    if (notSelfSettings) labelsFactory.applyTextSettings(this.textElement, false);
    this.applyTextSettings(this.textElement, false);
    if (notSelfSettings) {
      this.textSettings(this.superSettingsObj);
      this.applyTextSettings(this.textElement, false);
    }

    //define is width and height set from settings
    var isWidthSet = !goog.isNull(this.mergedSettings['width']);
    var isHeightSet = !goog.isNull(this.mergedSettings['height']);

    /** @type  {anychart.math.Rect} */
    var outerBounds = new anychart.math.Rect(0, 0, 0, 0);
    //calculate text width and outer width

    var autoWidth;
    var autoHeight;
    var textElementBounds;

    var width, textWidth;
    if (isWidthSet) {
      width = Math.ceil(anychart.utils.normalizeSize(/** @type {number|string} */(this.mergedSettings['width']), parentWidth));
      if (this.mergedSettings['padding']) {
        textWidth = this.mergedSettings['padding'].tightenWidth(width);
        this.textX = anychart.utils.normalizeSize(this.mergedSettings['padding'].left(), width);
      } else {
        this.textX = 0;
        textWidth = width;
      }
      outerBounds.width = width;
      autoWidth = false;
    } else {
      //we should ask text element about bounds only after text format and text settings are applied
      textElementBounds = this.textElement.getBounds();
      width = textElementBounds.width;
      if (this.mergedSettings['padding']) {
        outerBounds.width = this.mergedSettings['padding'].widenWidth(width);
        this.textX = anychart.utils.normalizeSize(this.mergedSettings['padding'].left(), outerBounds.width);
      } else {
        this.textX = 0;
        outerBounds.width = width;
      }
      autoWidth = true;
    }
    if (goog.isDef(textWidth)) this.textElement.width(textWidth);

    //calculate text height and outer height
    var height, textHeight;
    if (isHeightSet) {
      height = Math.ceil(anychart.utils.normalizeSize(/** @type {number|string} */(this.mergedSettings['height']), parentHeight));
      if (this.mergedSettings['padding']) {
        textHeight = this.mergedSettings['padding'].tightenHeight(height);
        this.textY = anychart.utils.normalizeSize(this.mergedSettings['padding'].top(), height);
      } else {
        this.textY = 0;
        textHeight = height;
      }
      outerBounds.height = height;
      autoHeight = false;
    } else {
      //we should ask text element about bounds only after text format and text settings are applied
      textElementBounds = this.textElement.getBounds();
      height = textElementBounds.height;
      if (this.mergedSettings['padding']) {
        outerBounds.height = this.mergedSettings['padding'].widenHeight(height);
        this.textY = anychart.utils.normalizeSize(this.mergedSettings['padding'].top(), outerBounds.height);
      } else {
        this.textY = 0;
        outerBounds.height = height;
      }
      autoHeight = true;
    }

    if (goog.isDef(textHeight)) this.textElement.height(textHeight);

    var canAdjustByWidth = !autoWidth;
    var canAdjustByHeight = !autoHeight;
    var needAdjust = ((canAdjustByWidth && this.mergedSettings['adjustByHeight']) || (canAdjustByHeight && this.mergedSettings['adjustByHeight']));

    if (needAdjust) {
      if (!this.fontSizeMeasureElement_)
        this.fontSizeMeasureElement_ = acgraph.text();

      if (isHtml) this.fontSizeMeasureElement_.htmlText(goog.isDef(text) ? String(text) : '');
      else this.fontSizeMeasureElement_.text(goog.isDef(text) ? String(text) : '');

      parentLabelsFactory.applyTextSettings(this.fontSizeMeasureElement_, true);
      if (notSelfSettings) labelsFactory.applyTextSettings(this.fontSizeMeasureElement_, false);
      this.applyTextSettings(this.fontSizeMeasureElement_, false);
      if (notSelfSettings) {
        this.textSettings(this.superSettingsObj);
        this.applyTextSettings(this.fontSizeMeasureElement_, false);
      }

      var calculatedFontSize = this.calculateFontSize_(
          textWidth,
          textHeight,
          this.fontSizeMeasureElement_,
          this.mergedSettings['minFontSize'],
          this.mergedSettings['maxFontSize'],
          this.mergedSettings['adjustByWidth'],
          this.mergedSettings['adjustByHeight']);

      this.suspendSignalsDispatching();
      this.fontSize(calculatedFontSize);
      this.textElement.fontSize(calculatedFontSize);
      this.resumeSignalsDispatching(false);
    }

    this.drawLabel(outerBounds, parentBounds);

    this.backgroundElement_.parentBounds(outerBounds);
    this.backgroundElement_.draw();

    this.layer_.setRotationByAnchor(/** @type {number} */(this.mergedSettings['rotation']), this.mergedSettings['anchor']);

    this.markConsistent(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.BOUNDS);
  }
  return this;
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.Label.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  if (goog.isDef(this.settingsObj['background'])) json['background'] = this.background().serialize();
  if (goog.isDef(this.settingsObj['padding'])) json['padding'] = this.padding().serialize();
  if (goog.isDef(this.position())) json['position'] = this.position();
  if (goog.isDef(this.anchor())) json['anchor'] = this.anchor();
  if (goog.isDef(this.offsetX())) json['offsetX'] = this.offsetX();
  if (goog.isDef(this.offsetY())) json['offsetY'] = this.offsetY();
  if (goog.isDef(this.width())) json['width'] = this.width();
  if (goog.isDef(this.height())) json['height'] = this.height();
  if (goog.isDef(this.rotation())) json['rotation'] = this.rotation();
  if (!goog.isDef(this.enabled())) delete json['enabled'];
  if (goog.isDef(this.settingsObj.adjustByHeight) || goog.isDef(this.settingsObj.adjustByHeight))
    json['adjustFontSize'] = this.adjustFontSize();
  if (goog.isDef(this.minFontSize())) json['minFontSize'] = this.minFontSize();
  if (goog.isDef(this.maxFontSize())) json['maxFontSize'] = this.maxFontSize();

  return json;
};


/** @inheritDoc */
anychart.core.ui.LabelsFactory.Label.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  if (goog.isDef(config['background'])) this.background(config['background']);
  if (goog.isDef(config['padding'])) this.padding(config['padding']);
  this.position(config['position']);
  this.anchor(config['anchor']);
  this.offsetX(config['offsetX']);
  this.offsetY(config['offsetY']);
  this.rotation(config['rotation']);
  this.width(config['width']);
  this.height(config['height']);
  this.adjustFontSize(config['adjustFontSize']);
  this.minFontSize(config['minFontSize']);
  this.minFontSize(config['minFontSize']);
  if (!goog.isDef(config['enabled'])) delete this.settingsObj.enabledLabel;
};


//exports
anychart.core.ui.LabelsFactory.prototype['background'] = anychart.core.ui.LabelsFactory.prototype.background;
anychart.core.ui.LabelsFactory.prototype['padding'] = anychart.core.ui.LabelsFactory.prototype.padding;
anychart.core.ui.LabelsFactory.prototype['textFormatter'] = anychart.core.ui.LabelsFactory.prototype.textFormatter;
anychart.core.ui.LabelsFactory.prototype['positionFormatter'] = anychart.core.ui.LabelsFactory.prototype.positionFormatter;
anychart.core.ui.LabelsFactory.prototype['position'] = anychart.core.ui.LabelsFactory.prototype.position;
anychart.core.ui.LabelsFactory.prototype['anchor'] = anychart.core.ui.LabelsFactory.prototype.anchor;
anychart.core.ui.LabelsFactory.prototype['offsetX'] = anychart.core.ui.LabelsFactory.prototype.offsetX;
anychart.core.ui.LabelsFactory.prototype['offsetY'] = anychart.core.ui.LabelsFactory.prototype.offsetY;
anychart.core.ui.LabelsFactory.prototype['rotation'] = anychart.core.ui.LabelsFactory.prototype.rotation;
anychart.core.ui.LabelsFactory.prototype['width'] = anychart.core.ui.LabelsFactory.prototype.width;
anychart.core.ui.LabelsFactory.prototype['height'] = anychart.core.ui.LabelsFactory.prototype.height;
anychart.core.ui.LabelsFactory.prototype['enabled'] = anychart.core.ui.LabelsFactory.prototype.enabled;
anychart.core.ui.LabelsFactory.prototype['adjustFontSize'] = anychart.core.ui.LabelsFactory.prototype.adjustFontSize;
anychart.core.ui.LabelsFactory.prototype['minFontSize'] = anychart.core.ui.LabelsFactory.prototype.minFontSize;
anychart.core.ui.LabelsFactory.prototype['maxFontSize'] = anychart.core.ui.LabelsFactory.prototype.maxFontSize;

anychart.core.ui.LabelsFactory.Label.prototype['padding'] = anychart.core.ui.LabelsFactory.Label.prototype.padding;
anychart.core.ui.LabelsFactory.Label.prototype['rotation'] = anychart.core.ui.LabelsFactory.Label.prototype.rotation;
anychart.core.ui.LabelsFactory.Label.prototype['getIndex'] = anychart.core.ui.LabelsFactory.Label.prototype.getIndex;
anychart.core.ui.LabelsFactory.Label.prototype['textFormatter'] = anychart.core.ui.LabelsFactory.Label.prototype.textFormatter;
anychart.core.ui.LabelsFactory.Label.prototype['positionFormatter'] = anychart.core.ui.LabelsFactory.Label.prototype.positionFormatter;
anychart.core.ui.LabelsFactory.Label.prototype['position'] = anychart.core.ui.LabelsFactory.Label.prototype.position;
anychart.core.ui.LabelsFactory.Label.prototype['anchor'] = anychart.core.ui.LabelsFactory.Label.prototype.anchor;
anychart.core.ui.LabelsFactory.Label.prototype['draw'] = anychart.core.ui.LabelsFactory.Label.prototype.draw;
anychart.core.ui.LabelsFactory.Label.prototype['clear'] = anychart.core.ui.LabelsFactory.Label.prototype.clear;
anychart.core.ui.LabelsFactory.Label.prototype['background'] = anychart.core.ui.LabelsFactory.Label.prototype.background;
anychart.core.ui.LabelsFactory.Label.prototype['offsetX'] = anychart.core.ui.LabelsFactory.Label.prototype.offsetX;
anychart.core.ui.LabelsFactory.Label.prototype['offsetY'] = anychart.core.ui.LabelsFactory.Label.prototype.offsetY;
anychart.core.ui.LabelsFactory.Label.prototype['width'] = anychart.core.ui.LabelsFactory.Label.prototype.width;
anychart.core.ui.LabelsFactory.Label.prototype['height'] = anychart.core.ui.LabelsFactory.Label.prototype.height;
anychart.core.ui.LabelsFactory.Label.prototype['enabled'] = anychart.core.ui.LabelsFactory.Label.prototype.enabled;
anychart.core.ui.LabelsFactory.Label.prototype['adjustFontSize'] = anychart.core.ui.LabelsFactory.Label.prototype.adjustFontSize;
anychart.core.ui.LabelsFactory.Label.prototype['minFontSize'] = anychart.core.ui.LabelsFactory.Label.prototype.minFontSize;
anychart.core.ui.LabelsFactory.Label.prototype['maxFontSize'] = anychart.core.ui.LabelsFactory.Label.prototype.maxFontSize;
