goog.provide('anychart.core.axes.Ticks');
goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.utils.Bounds');
goog.require('anychart.enums');
goog.require('anychart.utils');



/**
 * Axis ticks class.<br/>
 * You can change position, length and line features.
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.axes.Ticks = function() {
  goog.base(this);

  /**
   * Ticks length.
   * @type {number}
   * @private
   */
  this.length_;

  /**
   * Ticks stroke.
   * @type {acgraph.vector.Stroke|string}
   * @private
   */
  this.stroke_;

  /**
   * Ticks position.
   * @type {anychart.enums.SidePosition}
   * @private
   */
  this.position_;

  /**
   * Ticks enabled.
   * @type {anychart.enums.Orientation}
   * @private
   */
  this.orientation_;

  /**
   * Path with ticks.
   * @type {!acgraph.vector.Path}
   * @private
   */
  this.path_ = acgraph.path();
  this.registerDisposable(this.path_);

  this.restoreDefaults();
};
goog.inherits(anychart.core.axes.Ticks, anychart.core.VisualBase);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Ticks.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.axes.Ticks.prototype.SUPPORTED_CONSISTENCY_STATES = anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES; // ENABLED CONTAINER Z_INDEX


//----------------------------------------------------------------------------------------------------------------------
//
//  Properties.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for current ticks length.
 * @return {number} Length of ticks.
 *//**
 * Setter for ticks length.
 * @illustration <t>simple-h100</t>
 * stage.text(10,0, 'axis');
 * stage.text(10,40, 'tick');
 * stage.path()
 *     .moveTo(0, 15)
 *     .lineTo(stage.width(), 15)
 *     .stroke('5 black');
 * stage.path()
 *     .moveTo(stage.width()/5-stage.width()/10, 15)
 *     .lineTo(stage.width()/5-stage.width()/10, 55)
 *     .moveTo(2*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(2*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(3*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(3*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(4*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(4*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(5*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(5*stage.width()/5-stage.width()/10, 55);
 * stage.path()
 *     .moveTo(stage.width()/5, 15)
 *     .lineTo(stage.width()/5, 55)
 *     .lineTo(stage.width()/5-5, 55)
 *     .lineTo(stage.width()/5+5, 55)
 *     .stroke('1 grey 1');
 * stage.triangleUp(stage.width()/5, 20, 3).stroke('1 grey 1');
 * stage.triangleDown(stage.width()/5, 50, 3).stroke('1 grey 1');
 * stage.text(stage.width()/5, 57, 'length');
 * @param {number=} opt_value Value to set.
 * @return {anychart.core.axes.Ticks} An instance of the {@link anychart.core.axes.Ticks} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {(number|!anychart.core.axes.Ticks)} .
 */
anychart.core.axes.Ticks.prototype.length = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.length_ != opt_value) {
      this.length_ = opt_value;
      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else
    return this.length_;
};


/**
 * Returns a current stroke settings.
 * @return {acgraph.vector.Stroke} Returns the current stroke settings.
 *//**
 * Sets stroke settings via single parameter.<br/>
 * The following options are acceptable:
 * <ul>
 *  <li>String formatted as '[thickness ]color[ opacity]':
 *    <ol>
 *      <li><b>'color'</b> - {@link http://www.w3schools.com/html/html_colors.asp}.</li>
 *      <li><b>'thickness color'</b> - like a css border, e.g. '3 red' or '3px red'</li>
 *      <li><b>'color opacity'</b> - as a fill string, e.g. '#fff 0.5'</li>
 *      <li><b>'thickness color opacity'</b> - as a complex string, e.g. '3px #00ff00 0.5'</li>
 *    </ol>
 *  </li>
 *  <li>{@link acgraph.vector.Stroke} object</li>
 *  <li>Keys array {@link acgraph.vector.GradientKey}</li>
 *  <li><b>null</b> - reset current stroke settings.</li>
 * </ul>
 * <b>Note:</b> String parts order is significant and '3px red' is not the same as 'red 3px'.
 * @shortDescription Sets stroke settings.
 * @illustration <t>simple-h100</t>
 * stage.text(10,0, 'axis');
 * stage.text(10,40, 'tick');
 * stage.path()
 *     .moveTo(0, 15)
 *     .lineTo(stage.width(), 15)
 *     .stroke('5 black');
 * stage.path()
 *     .moveTo(stage.width()/5-stage.width()/10, 15)
 *     .lineTo(stage.width()/5-stage.width()/10, 55)
 *     .moveTo(2*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(2*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(3*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(3*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(4*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(4*stage.width()/5-stage.width()/10, 55)
 *     .moveTo(5*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(5*stage.width()/5-stage.width()/10, 55)
 *     .stroke('2 blue .7');
 * @example <t>listingOnly</t>
 *  ticks.stroke('2 blue .7');
 * @param {(acgraph.vector.Stroke)=} opt_value ['black'] Fill style as '[thickness ]color[ opacity]'.
 * @return {anychart.core.axes.Ticks} {@link anychart.core.axes.Ticks} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke)=} opt_value .
 * @return {(!anychart.core.axes.Ticks|acgraph.vector.Stroke)} .
 */
anychart.core.axes.Ticks.prototype.stroke = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = acgraph.vector.normalizeStroke(opt_value);
    if (this.stroke_ != opt_value) {
      this.stroke_ = opt_value;
      this.dispatchSignal(anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else
    return this.stroke_;
};


/**
 * Getter for the current ticks position.
 * @return {(anychart.enums.SidePosition|string)} Current position.
 *//**
 * Setter for ticks position.<br/>
 * You can set ticks inside of a chart area or outside its position.
 * @illustration <t>simple</t>
 * stage.text(10,40, 'axis');
 * stage.text(10,2, 'tick');
 * stage.path()
 *     .moveTo(0, 55)
 *     .lineTo(stage.width(), 55)
 *     .stroke('5 black');
 * stage.path()
 *     .moveTo(stage.width()/5-stage.width()/10, 15)
 *     .lineTo(stage.width()/5-stage.width()/10, 90)
 *     .moveTo(2*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(2*stage.width()/5-stage.width()/10, 90)
 *     .moveTo(3*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(3*stage.width()/5-stage.width()/10, 90)
 *     .moveTo(4*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(4*stage.width()/5-stage.width()/10, 90)
 *     .moveTo(5*stage.width()/5-stage.width()/10, 15)
 *     .lineTo(5*stage.width()/5-stage.width()/10, 90);
 * stage.text(stage.width()/5, 92, 'inside position');
 * stage.text(stage.width()/5, 2, 'outside position');
 * stage.text(3*stage.width()/5, 92, 'Chart Area');
 * stage.rect(0, 55, stage.width(), 95).fill('orange 0.1').stroke('0 0')
 * @param {(anychart.enums.SidePosition|string)=} opt_value [{@link anychart.enums.SidePosition}.OUTSIDE]
 *  Value to set.
 * @return {anychart.core.axes.Ticks} {@link anychart.core.axes.Ticks} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.enums.SidePosition|string)=} opt_value .
 * @return {(anychart.enums.SidePosition|string|!anychart.core.axes.Ticks)} .
 */
anychart.core.axes.Ticks.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.position_ = anychart.enums.normalizeSidePosition(opt_value);
    this.dispatchSignal(anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    return this;
  } else
    return this.position_;
};


/**
 * Internal use.
 * Change orientation and set drawer to null.
 * @param {(string|anychart.enums.Orientation)=} opt_value Orientation.
 * @return {anychart.core.axes.Ticks|anychart.enums.Orientation} Orientation or self for chaining.
 */
anychart.core.axes.Ticks.prototype.orientation = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeOrientation(opt_value);
    if (this.orientation_ != opt_value) {
      this.orientation_ = opt_value;
      this.drawer_ = null;
      //TODO:blackart do we need to dispatch anything when orientation is changed?
    }
    return this;
  } else {
    return this.orientation_;
  }
};


/**
 * Restore labels default settings.
 */
anychart.core.axes.Ticks.prototype.restoreDefaults = function() {
  this.orientation(anychart.enums.Orientation.TOP);
  this.position(anychart.enums.SidePosition.OUTSIDE);
  this.length(5);
  this.stroke('black');

  this.dispatchSignal(anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
};


/** @inheritDoc */
anychart.core.axes.Ticks.prototype.remove = function() {
  if (this.path_) this.path_.parent(null);
};


/**
 * Renders ticks.
 * @return {!anychart.core.axes.Ticks} {@link anychart.core.axes.Ticks} instance for method chaining.
 */
anychart.core.axes.Ticks.prototype.draw = function() {
  this.path_.clear();
  this.path_.stroke(this.stroke_);

  if (!this.checkDrawingNeeded())
    return this;

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    this.path_.zIndex(/** @type {number} */ (this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.path_.parent(/** @type {acgraph.vector.ILayer} */ (this.container()));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  return this;
};


/**
 * Get drawer depends on orientation
 * @return {Function}
 */
anychart.core.axes.Ticks.prototype.getTicksDrawer = function() {
  if (!this.drawer_) {
    switch (this.orientation_) {
      case anychart.enums.Orientation.TOP:
        this.drawer_ = this.drawTopTick_;
        break;
      case anychart.enums.Orientation.RIGHT:
        this.drawer_ = this.drawRightTick_;
        break;
      case anychart.enums.Orientation.BOTTOM:
        this.drawer_ = this.drawBottomTick_;
        break;
      case anychart.enums.Orientation.LEFT:
        this.drawer_ = this.drawLeftTick_;
        break;
    }
  }
  return this.drawer_;
};


/**
 * Axis ticks drawer for top orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @private
 */
anychart.core.axes.Ticks.prototype.drawTopTick_ = function(ratio, bounds, lineBounds, lineThickness, pixelShift) {
  /** @type {number} */
  var x = Math.round(bounds.left + ratio * bounds.width);
  /** @type {number} */
  var y = lineBounds.top;
  /** @type {number} */
  var dy;

  if (ratio == 1) x += pixelShift;
  else x -= pixelShift;

  if (this.position_ == anychart.enums.SidePosition.OUTSIDE) {
    y -= lineThickness / 2;
    dy = /** @type {number} */(-this.length_);
  } else {
    y += lineThickness / 2;
    dy = /** @type {number} */(this.length_);
  }

  this.path_.moveTo(x, y);
  this.path_.lineTo(x, y + dy);
};


/**
 * Axis ticks drawer for right orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @private
 */
anychart.core.axes.Ticks.prototype.drawRightTick_ = function(ratio, bounds, lineBounds, lineThickness, pixelShift) {
  /** @type {number} */
  var x = lineBounds.left;
  /** @type {number} */
  var y = Math.round(bounds.top + bounds.height - ratio * bounds.height);
  /** @type {number} */
  var dx;

  if (ratio == 1) y -= pixelShift;
  else y += pixelShift;

  if (this.position_ == anychart.enums.SidePosition.OUTSIDE) {
    x += lineThickness / 2;
    dx = /** @type {number} */(this.length_);
  } else {
    x -= lineThickness / 2;
    dx = /** @type {number} */(-this.length_);
  }

  this.path_.moveTo(x, y);
  this.path_.lineTo(x + dx, y);
};


/**
 * Axis ticks drawer for bottom orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @private
 */
anychart.core.axes.Ticks.prototype.drawBottomTick_ = function(ratio, bounds, lineBounds, lineThickness, pixelShift) {
  /** @type {number} */
  var x = Math.round(bounds.left + ratio * (bounds.width));
  /** @type {number} */
  var y = lineBounds.top;
  /** @type {number} */
  var dy;

  if (ratio == 1) x += pixelShift;
  else x -= pixelShift;

  if (this.position_ == anychart.enums.SidePosition.OUTSIDE) {
    y += lineThickness / 2;
    dy = /** @type {number} */(this.length_);
  } else {
    y -= lineThickness / 2;
    dy = /** @type {number} */(-this.length_);
  }

  this.path_.moveTo(x, y);
  this.path_.lineTo(x, y + dy);
};


/**
 * Axis ticks drawer for left orientation.
 * @param {number} ratio Scale ratio.
 * @param {anychart.math.Rect} bounds Axis bounds.
 * @param {anychart.math.Rect} lineBounds Axis line bounds.
 * @param {number} lineThickness Axis line thickness.
 * @param {number} pixelShift Pixel shift for a crisp display.
 * @private
 */
anychart.core.axes.Ticks.prototype.drawLeftTick_ = function(ratio, bounds, lineBounds, lineThickness, pixelShift) {
  /** @type {number} */
  var x = lineBounds.left;
  /** @type {number} */
  var y = Math.round(bounds.top + bounds.height - ratio * (bounds.height));
  /** @type {number} */
  var dx;

  if (ratio == 1) y -= pixelShift;
  else y += pixelShift;

  if (this.position_ == anychart.enums.SidePosition.OUTSIDE) {
    x -= lineThickness / 2;
    dx = /** @type {number} */(-this.length_);
  } else {
    x += lineThickness / 2;
    dx = /** @type {number} */(this.length_);
  }

  this.path_.moveTo(x, y);
  this.path_.lineTo(x + dx, y);
};


/**
 * Ticks serialization.
 * @return {Object} Serialized axis data.
 */
anychart.core.axes.Ticks.prototype.serialize = function() {
  var data = {};
  data['length'] = this.length();
  data['position'] = this.position();
  data['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));

  return data;
};


/** @inheritDoc */
anychart.core.axes.Ticks.prototype.deserialize = function(value) {
  this.suspendSignalsDispatching();

  this.length(value['length']);
  this.position(value['position']);
  this.stroke(value['stroke']);

  this.resumeSignalsDispatching(true);

  return this;
};


//exports
anychart.core.axes.Ticks.prototype['length'] = anychart.core.axes.Ticks.prototype.length;//in docs/
anychart.core.axes.Ticks.prototype['stroke'] = anychart.core.axes.Ticks.prototype.stroke;//in docs/
anychart.core.axes.Ticks.prototype['position'] = anychart.core.axes.Ticks.prototype.position;//in docs/
