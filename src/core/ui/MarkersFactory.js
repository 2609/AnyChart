goog.provide('anychart.core.ui.MarkersFactory');
goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.enums');
goog.require('anychart.utils');
goog.require('goog.events.BrowserEvent');
goog.provide('anychart.core.ui.MarkersFactory.BrowserEvent');
goog.provide('anychart.core.ui.MarkersFactory.Marker');



/**
 * Multiple markers class.<br/>
 * Multiple markers are the set of markers with a common settings, such as type (predefined or
 * custom), size, fill and position:
 * <ul>
 *   <li>{@link anychart.core.ui.MarkersFactory#anchor}</li>
 *   <li>{@link anychart.core.ui.MarkersFactory#position}</li>
 *   <li>{@link anychart.core.ui.MarkersFactory#offsetX} and {@link anychart.core.ui.MarkersFactory#offsetY}</li>
 * </ul>
 * Also you can access any marker from the set and change it:
 * @example <t>simple-h100</t>
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star5')
 *     .size(27)
 *     .fill('blue')
 *     .anchor('leftTop')
 *     .stroke('1px #000')
 *     .container(stage);
 *  MMarker.draw({x: 100, y: 30});
 *  MMarker.draw({x: 200, y: 50});
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.ui.MarkersFactory = function() {
  this.suspendSignalsDispatching();
  goog.base(this);

  /**
   * Elements pool.
   * @type {Array.<anychart.core.ui.MarkersFactory.Marker>}
   * @private
   */
  this.freeToUseMarkersPool_;

  /**
   * Element for measurement.
   * @type {acgraph.vector.Path}
   * @private
   */
  this.measureMarkerElement_;

  /**
   * Markers layer.
   * @type {acgraph.vector.Layer}
   * @private
   */
  this.layer_ = null;

  /**
   * Type of marker.
   * @type {(string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)}
   * @private
   */
  this.type_;

  /**
   * Marker size.
   * @type {number}
   * @private
   */
  this.size_;

  /**
   * Marker fill settings.
   * @type {string|acgraph.vector.Fill}
   * @private
   */
  this.fill_;

  /**
   * Marker stroke settings.
   * @type {string|acgraph.vector.Stroke}
   * @private
   */
  this.stroke_;

  /**
   * Marker anchor settings.
   * @type {anychart.enums.Anchor|string}
   * @private
   */
  this.anchor_;

  /**
   * Marker position settings.
   * @type {anychart.enums.Position|string}
   * @private
   */
  this.position_;

  /**
   * Offset by X coordinate from Marker position.
   * @type {number|string}
   * @private
   */
  this.offsetX_;

  /**
   * Offset by Y coordinate from Marker position.
   * @type {number|string}
   * @private
   */
  this.offsetY_;

  /**
   * Enabled state.
   * @type {?boolean}
   * @private
   */
  this.enabledState_ = null;

  /**
   * Marker position formatter function.
   * @type {Function}
   * @private
   */
  this.positionFormatter_ = null;

  /**
   * Handlers to attach on next end().
   * @type {number}
   * @private
   */
  this.attachedEvents_ = 0;

  /**
   * One-off handlers to attach on next end().
   * @type {number}
   * @private
   */
  this.attachedOnceEvents_ = 0;

  /**
   * Markers array.
   * @type {Array.<anychart.core.ui.MarkersFactory.Marker>}
   * @private
   */
  this.markers_;

  /**
   * Changed settings.
   * @type {Object}
   */
  this.changedSettings = {};

  this.positionFormatter_ = anychart.utils.DEFAULT_FORMATTER;

  this.size(10);
  this.anchor(anychart.enums.Anchor.CENTER);
  this.offsetX(0);
  this.offsetY(0);

  this.changedSettings = {};

  this.invalidate(anychart.ConsistencyState.ALL);
  this.resumeSignalsDispatching(true);
};
goog.inherits(anychart.core.ui.MarkersFactory, anychart.core.VisualBase);


/**
 * Supported signals.
 * @type {number}
 */
anychart.core.ui.MarkersFactory.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.MarkersFactory.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.MARKERS_FACTORY_HANDLERS;


/**
 * Enumeration to handle composite event handlers attachment on DOM create.
 * @const {Object.<number>}
 * @private
 */
anychart.core.ui.MarkersFactory.HANDLED_EVENT_TYPES_ = {
  /** Click */
  'click': 0x01,

  /** Double click */
  'dblclick': 0x02,

  /** Mouse down */
  'mousedown': 0x04,

  /** Mouse up */
  'mouseup': 0x08,

  /** Mouse over */
  'mouseover': 0x10,

  /** Moise out */
  'mouseout': 0x20,

  /** Mouse move */
  'mousemove': 0x40,

  /** Fires on touch start */
  'touchstart': 0x80,

  /** Fires on touch move */
  'touchmove': 0x100,

  /** Fires on touch end */
  'touchend': 0x200,

  /** Fires on touch cancel.
   * @see http://www.w3.org/TR/2011/WD-touch-events-20110505/#the-touchcancel-event
   */
  'touchcancel': 0x400

  //  /** Fires on tap (fast touchstart-touchend) */
  //  'tap': 0x800
};


/**
 * MAGIC NUMBERS!!! MAGIC NUMBERS!!!111
 * This is a lsh (<< - left shift) second argument to convert simple HANDLED_EVENT_TYPES code to a
 * CAPTURE HANDLED_EVENT_TYPES code! Tada!
 * @type {number}
 * @private
 */
anychart.core.ui.MarkersFactory.HANDLED_EVENT_TYPES_CAPTURE_SHIFT_ = 12;


/**
 * Getter for the current element state.
 *
  * True, false and null states.
 *
 * True and false are self-explanatory. null state means that element is enabled,
 * but if it depends on other entities (like, for example, markers() and hoverMarkers() in series),
 * then factory works in auto mode. For example, if series normal markers are enabled,
 * and hover markers are in null state, then upon hover hoverMarkers become enabled because of normal.
 * But if you disable normal markers – hoverMarkers are disabled too.
 * @return {?boolean} The current element state.
 *//**
 * Setter for the element enabled state.
 * @example <t>listingOnly</t>
 * if (!element.enabled())
 *    element.enabled(true);
 * @param {(null|boolean)=} opt_value Value to set.
 * @return {!anychart.MarkersFactory} {@link anychart.core.VisualBase} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {(null|boolean)=} opt_value Value to set.
 * @return {!anychart.core.ui.MarkersFactory|boolean|null} .
 */
anychart.core.ui.MarkersFactory.prototype.enabled = function(opt_value) {
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
//  Position.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for current position formatter function of all markers.
 * @return {Function} Marker position formatter function.
 *//**
 * Setter for position formatter function of all markers.<br/>
 * <b>Note:</b> you can pass anything to positionProvider using
 * {@link anychart.core.ui.MarkersFactory#draw}, this extends positioning options
 * @param {function(*,number):anychart.math.CoordinateObject=} opt_value [function(positionProvider, index) {
 *  return {x: 80 * index, y: 0};
 * }] Function to position marker depending on index and context, it should look like this:
 * <code>function(positionProvider, index) {
 *    ... //do something
 *    return {x: smth, y: smth};
 * }</code>
 * Parameters:<br/>
 * <b>positionProvider</b> - object with information about current (by index) marker position,
 *  this object must contain <b>x</b> and <b>y</b> field (with no offsets taken in account).<br/>
 * <b>index</b> - current marker index.
 * @example
 * var marker = anychart.ui.markersFactory()
 *     .container(stage)
 *     .size(25)
 *     .positionFormatter(function(positionProvider, index) {
 *       return {x: 60 * (1 + index), y: 100 * Math.random() + 60};
 *     })
 *     .anchor('center');
 * for (var i = 0; i < 5; i++)
 *   marker.draw();
 * @return {anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {Function=} opt_value .
 * @return {Function|anychart.core.ui.MarkersFactory} .
 */
anychart.core.ui.MarkersFactory.prototype.positionFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.positionFormatter_ = opt_value;
    this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    this.changedSettings['positionFormatter'] = true;
    return this;
  } else {
    return this.positionFormatter_;
  }
};


/**
 * Getter for current position settings of all markers.
 * @return {string} Markers position settings.
 *//**
 * Setter for position settings of all markers.
 * @param {string=} opt_value [{@link anychart.enums.Position}.CENTER] Value to set.
 * @return {anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {string=} opt_value Markers position settings.
 * @return {anychart.core.ui.MarkersFactory|string} Markers position settings or itself for method chaining.
 */
anychart.core.ui.MarkersFactory.prototype.position = function(opt_value) {
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
 * Getter for anchor settings of all markers.
 * @return {anychart.enums.Anchor} Current marker anchor settings.
 *//**
 * Setter for anchor settings of all markers.
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .fill('blue')
 *     .anchor(anychart.enums.Anchor.RIGHT_BOTTOM)
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left,
 *     y: barBounds.top
 *   };
 *   // mark label position with red
 *   stage.circle(positionProvider.x, positionProvider.y, 2).stroke('3 red');
 *   MMarker.draw(positionProvider);
 * }
 * @param {(anychart.enums.Anchor|string)=} opt_value [{@link anychart.enums.Anchor}.CENTER] Value to set.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.enums.Anchor|string)=} opt_value .
 * @return {!(anychart.core.ui.MarkersFactory|anychart.enums.Anchor|string)} .
 */
anychart.core.ui.MarkersFactory.prototype.anchor = function(opt_value) {
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
 * Getter for current type settings of all markers.
 * @return {anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path}
 *  Markers type settings.
 *//**
 * Setter for type settings of all markers.
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left,
 *     y: barBounds.top
 *   };
 *   MMarker.draw(positionProvider);
 * }
 * @param {(anychart.enums.MarkerType|
 *  function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value
 *  [{@link anychart.enums.MarkerType}.DIAGONAL_CROSS] Type or custom drawer. Function for a custom marker
 *  must look like this: <code>function(path, x, y, size){
 *    // path - acgraph.vector.Path
 *    // x, y - current marker position
 *    // size - marker size
 *    ... //do something
 *    return path;
 *  }</code>.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.ui.MarkersFactory|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path|string} .
 */
anychart.core.ui.MarkersFactory.prototype.type = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (!goog.isFunction(opt_value))
      opt_value = anychart.enums.normalizeMarkerType(opt_value);
    if (this.type_ != opt_value) {
      this.type_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['type'] = true;
    return this;
  } else {
    return this.type_ || this.autoType_ || anychart.enums.MarkerType.DIAGONAL_CROSS;
  }
};


/**
 * Sets markers type that parent series have set for it.
 * @param {anychart.enums.MarkerType} value Auto marker type distributed by the series.
 */
anychart.core.ui.MarkersFactory.prototype.setAutoType = function(value) {
  this.autoType_ = value;
};


/**
 * Getter for current size settings of all markers.
 * @return {number} Markeres size settings.
 *//**
 * Setter for size settings of all markers.
 * @example
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .size(15)
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left,
 *     y: barBounds.top
 *   };
 *   MMarker.draw(positionProvider);
 * }
 * @param {number=} opt_value [10] Value to set.
 * @return {anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} for method chaining.
 *//**
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {anychart.core.ui.MarkersFactory|number} .
 */
anychart.core.ui.MarkersFactory.prototype.size = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.size_ != opt_value) {
      this.size_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    this.changedSettings['size'] = true;
    return this;
  } else {
    return this.size_;
  }
};


/**
 * Getter for current offsetX settings of all markers.
 * @return {number|string} Marker offsetX settings.
 *//**
 * Setter for offsetX settings of all markers.
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .fill('blue')
 *     .offsetX(15)
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left+barBounds.width/2,
 *     y: barBounds.top
 *   };
 *   // mark marker position with red
 *   stage.circle(positionProvider.x, positionProvider.y, 2).stroke('3 red');
 *   MMarker.draw(positionProvider);
 * }
 * @param {(number|string)=} opt_value [0] Value to set.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.MarkersFactory} .
 */
anychart.core.ui.MarkersFactory.prototype.offsetX = function(opt_value) {
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
 * Getter for current offsetY settings of all markers.
 * @return {number|string} Markers offsetY settings.
 *//**
 * Setter for offsetY settings of all markers.
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .fill('blue')
 *     .offsetY(15)
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left+barBounds.width/2,
 *     y: barBounds.top
 *   };
 *   // mark position point with red
 *   stage.circle(positionProvider.x, positionProvider.y, 2).stroke('3 red');
 *   MMarker.draw(positionProvider);
 * }
 * @param {(number|string)=} opt_value [0] Value to set.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} for method chaining.
 *//**
 * @ignoreDoc
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.MarkersFactory} .
 */
anychart.core.ui.MarkersFactory.prototype.offsetY = function(opt_value) {
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
 * Getter for current fill settings of all markers.
 * @return {acgraph.vector.Fill|string} Markeres fill settings.
 *//**
 * Setter for fill settings of all markers.<br/>
 * <b>Note:</b> fill is described at
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .fill('green')
 *     .size('14')
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left+barBounds.width/2,
 *     y: barBounds.top
 *   };
 *   MMarker.draw(positionProvider);
 * }
 * @param {(acgraph.vector.Fill|string)=} opt_value ['black'] Value to set.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|string|anychart.core.ui.MarkersFactory} .
 */
anychart.core.ui.MarkersFactory.prototype.fill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var color = acgraph.vector.normalizeFill.apply(null, arguments);
    if (this.fill_ != color) {
      this.fill_ = color;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    this.changedSettings['fill'] = true;
    return this;
  } else {
    return this.fill_ || this.autoFill_ || 'black';
  }
};


/**
 * Sets markers fill that parent series have set for it.
 * @param {acgraph.vector.Fill} value Auto fill distributed by the series.
 */
anychart.core.ui.MarkersFactory.prototype.setAutoFill = function(value) {
  this.autoFill_ = value;
};


/**
 * Getter for current stroke settings of all markers.
 * @return {acgraph.vector.Stroke|string} Markers fill settings.
 *//**
 * Setter for stroke settings of all markers.<br/>
 * <b>Note:</b> stroke is described at
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}
 * @example <t>simple-h100</t>
 * // create objects for markers factory
 * var bars = [];
 * bars.push(
 *     stage.rect(10, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(110, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(210, 30, 75, 125).stroke('1 #aaa').fill('#eee'),
 *     stage.rect(310, 30, 75, 125).stroke('1 #aaa').fill('#eee')
 * );
 * // sets global settings
 * var MMarker = anychart.ui.markersFactory()
 *     .type('star4')
 *     .fill('none')
 *     .stroke('4px green .5')
 *     .size('14')
 *     .container(stage);
 * // connecting markers and objects
 * for (i in bars) {
 *   var barBounds = bars[i].getBounds();
 *   var positionProvider = {
 *     x: barBounds.left+barBounds.width/2,
 *     y: barBounds.top
 *   };
 *   MMarker.draw(positionProvider);
 * }
 * @param {(acgraph.vector.Stroke|string)=} opt_value ['black'] Value to set.
 * @return {!anychart.core.ui.MarkersFactory} {@link anychart.core.ui.MarkersFactory} for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Stroke settings,
 *    if used as a setter.
 * @param {number=} opt_thickness Line thickness. If empty - set to 1.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 *    Dash array contains a list of comma and/or white space separated lengths and percentages that specify the
 *    lengths of alternating dashes and gaps. If an odd number of values is provided, then the list of values is
 *    repeated to yield an even number of values. Thus, stroke dashpattern: 5,3,2 is equivalent to dashpattern: 5,3,2,5,3,2.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Style of line cap.
 * @return {acgraph.vector.Stroke|string|anychart.core.ui.MarkersFactory} .
 */
anychart.core.ui.MarkersFactory.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var color = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.stroke_ != color) {
      this.stroke_ = color;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    this.changedSettings['stroke'] = true;
    return this;
  } else {
    return this.stroke_ || this.autoStroke_ || 'none';
  }
};


/**
 * Sets markers stroke that parent series have set for it.
 * @param {acgraph.vector.Stroke} value Auto stroke distributed by the series.
 */
anychart.core.ui.MarkersFactory.prototype.setAutoStroke = function(value) {
  this.autoStroke_ = value;
};


/**
 * Specifies under what circumstances a given graphics element can be the target element for a pointer event.
 * @param {boolean=} opt_value Pointer events property value.
 * @return {anychart.core.ui.MarkersFactory|boolean} If opt_value defined then returns Element object for chaining else
 * pointer events property value.
 */
anychart.core.ui.MarkersFactory.prototype.disablePointerEvents = function(opt_value) {
  if (goog.isDef(opt_value)) {
    this.disablePointerEvents_ = opt_value;
    this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    return this;
  }
  return this.disablePointerEvents_;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Measure.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Calculates bounds for the current marker, they can be used, for example, to check overlap.
 * @param {*} positionProvider Object with information about marker with current index,
 *  it must contain <b>x</b> and <b>y</b> fields (with no offsets taken in account).
 *  You can add any custom information of needed.
 * @return {anychart.math.Rect} Markers bounds.
 */
anychart.core.ui.MarkersFactory.prototype.measure = function(positionProvider) {
  var parentWidth, parentHeight, drawer;

  if (!this.measureMarkerElement_) this.measureMarkerElement_ = acgraph.path();

  //define parent bounds
  var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());
  if (parentBounds) {
    parentWidth = parentBounds.width;
    parentHeight = parentBounds.height;
  }

  var type = this.type();
  var size = /** @type {number} */(this.size());
  var anchor = /** @type {anychart.enums.Anchor} */(this.anchor());
  var offsetX = /** @type {number} */(this.offsetX());
  var offsetY = /** @type {number} */(this.offsetY());

  drawer = goog.isString(type) ?
      anychart.enums.getMarkerDrawer(type) :
      type;

  this.measureMarkerElement_.clear();
  drawer.call(this, this.measureMarkerElement_, 0, 0, size);

  var markerBounds = /** @type {anychart.math.Rect} */(this.measureMarkerElement_.getBounds());
  var formattedPosition = goog.object.clone(this.positionFormatter_.call(positionProvider, positionProvider));
  var position = new acgraph.math.Coordinate(formattedPosition['x'], formattedPosition['y']);
  var anchorCoordinate = anychart.utils.getCoordinateByAnchor(
      new acgraph.math.Rect(0, 0, markerBounds.width, markerBounds.height),
      anchor);

  position.x -= anchorCoordinate.x;
  position.y -= anchorCoordinate.y;

  var offsetXNorm = goog.isDef(this.offsetX_) ? anychart.utils.normalizeSize(offsetX, parentWidth) : 0;
  var offsetYNorm = goog.isDef(this.offsetY_) ? anychart.utils.normalizeSize(offsetY, parentHeight) : 0;

  anychart.utils.applyOffsetByAnchor(position, anchor, offsetXNorm, offsetYNorm);

  markerBounds.left = position.x;
  markerBounds.top = position.y;

  return markerBounds;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Clears an array of markers.
 * @param {number=} opt_index If set, removes only the marker that is in passed index.
 * @return {anychart.core.ui.MarkersFactory} Returns self for chaining.
 */
anychart.core.ui.MarkersFactory.prototype.clear = function(opt_index) {
  if (!this.freeToUseMarkersPool_)
    this.freeToUseMarkersPool_ = [];

  if (this.markers_) {
    opt_index = +opt_index;
    if (!isNaN(opt_index) && opt_index in this.markers_) {
      this.markers_[opt_index].clear();
      this.freeToUseMarkersPool_.push(this.markers_[opt_index]);
      delete this.markers_[opt_index];
    } else {
      goog.array.forEach(this.markers_, function(marker) {
        marker.clear();
        this.freeToUseMarkersPool_.push(marker);
      }, this);
      this.markers_.length = 0;
    }
    this.invalidate(anychart.ConsistencyState.MARKERS_FACTORY_HANDLERS, anychart.Signal.NEEDS_REDRAW);
  } else
    this.markers_ = [];
  return this;
};


/**
 * Returns a marker by index, if there is a marker with such index.
 * @param {number} index Marker index.
 * @return {anychart.core.ui.MarkersFactory.Marker|undefined} Already existing label.
 */
anychart.core.ui.MarkersFactory.prototype.getMarker = function(index) {
  index = +index;
  return this.markers_ && this.markers_[index] ? this.markers_[index] : null;
};


/**
 * Returns object with changed states.
 * @return {Object}
 */
anychart.core.ui.MarkersFactory.prototype.getSettingsChangedStatesObj = function() {
  return this.changedSettings;
};


/**
 * Returns DOM element.
 * @return {acgraph.vector.Layer}
 */
anychart.core.ui.MarkersFactory.prototype.getDomElement = function() {
  return this.layer_;
};


/**
 * Adds new marker and adds it to a set taking positionProvider into account.<br/>
 * @param {*} positionProvider Object with position settings,
 *  it must contain <b>x</b> and <b>y</b> without offsets.
 *  Can contain any additional info, if needed.
 * @param {number=} opt_index Marker index.
 * @return {!anychart.core.ui.MarkersFactory.Marker} Returns a new marker.
 */
anychart.core.ui.MarkersFactory.prototype.add = function(positionProvider, opt_index) {
  var marker, index;
  if (!goog.isDef(this.markers_)) this.markers_ = [];

  if (goog.isDef(opt_index)) {
    index = +opt_index;
    marker = this.markers_[index];
  }

  if (marker) {
    marker.clear();
  } else {
    marker = this.freeToUseMarkersPool_ && this.freeToUseMarkersPool_.length > 0 ?
        this.freeToUseMarkersPool_.pop() :
        this.createMarker();

    if (goog.isDef(index)) {
      this.markers_[index] = marker;
      marker.setIndex(index);
    } else {
      this.markers_.push(marker);
      marker.setIndex(this.markers_.length - 1);
    }
  }

  marker.positionProvider(positionProvider);
  marker.parentMarkersFactory(this);

  return marker;
};


/**
 * @return {anychart.core.ui.MarkersFactory.Marker}
 * @protected
 */
anychart.core.ui.MarkersFactory.prototype.createMarker = function() {
  return new anychart.core.ui.MarkersFactory.Marker();
};


/**
 * Markers drawing.
 * @return {anychart.core.ui.MarkersFactory} Returns self for method chaining.
 */
anychart.core.ui.MarkersFactory.prototype.draw = function() {
  if (!this.layer_) {
    this.layer_ = acgraph.layer();
    this.registerDisposable(this.layer_);
  }
  this.layer_.disablePointerEvents(/** @type {boolean} */(this.disablePointerEvents()));

  var stage = this.layer_.getStage();
  var manualSuspend = stage && !stage.isSuspended();
  if (manualSuspend) stage.suspend();

  if (this.markers_) {
    goog.array.forEach(this.markers_, function(marker, index) {
      if (marker) {
        marker.container(this.layer_);
        marker.draw();

        if (this.hasInvalidationState(anychart.ConsistencyState.MARKERS_FACTORY_HANDLERS)) {
          for (var type in anychart.core.ui.MarkersFactory.HANDLED_EVENT_TYPES_) {

            var element = marker.getDomElement();
            if (element) {
              element['__tagIndex'] = index;
              var code = anychart.core.ui.MarkersFactory.HANDLED_EVENT_TYPES_[type];
              if (!!(this.attachedEvents_ & code))
                element.listen(type, this.handleBrowserEvent_, false, this);
              else if (!!(this.attachedOnceEvents_ & code))
                element.listenOnce(type, this.handleBrowserEvent_, false, this);
              else
                element.unlisten(type, this.handleBrowserEvent_, false, this);

              code = code << acgraph.vector.Element.HANDLED_EVENT_TYPES_CAPTURE_SHIFT;
              if (!!(this.attachedEvents_ & code))
                element.listen(type, this.handleBrowserEvent_, true, this);
              else if (!!(this.attachedOnceEvents_ & code))
                element.listenOnce(type, this.handleBrowserEvent_, true, this);
              else
                element.unlisten(type, this.handleBrowserEvent_, true, this);
            }
          }
          this.attachedOnceEvents_ = 0x00;
        }
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


/** @inheritDoc */
anychart.core.ui.MarkersFactory.prototype.remove = function() {
  this.layer_.remove();
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  if (goog.isNull(json['enabled'])) delete json['enabled'];
  if (goog.isDef(this.disablePointerEvents())) json['disablePointerEvents'] = this.disablePointerEvents();
  if (this.changedSettings['position']) json['position'] = this.position();
  if (this.changedSettings['anchor']) json['anchor'] = this.anchor();
  if (this.changedSettings['offsetX']) json['offsetX'] = this.offsetX();
  if (this.changedSettings['offsetY']) json['offsetY'] = this.offsetY();
  if (this.changedSettings['type']) json['type'] = this.type();
  if (goog.isDef(this.size())) json['size'] = this.size();
  if (this.changedSettings['fill'] && goog.isDef(this.fill_))
    json['fill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.fill_));
  if (this.changedSettings['stroke'] && goog.isDef(this.stroke_))
    json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke_));
  return json;
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.prototype.setupSpecial = function() {
  var arg0 = arguments[0];
  if (goog.isString(arg0)) {
    this.type(arg0);
    this.enabled(true);
    return true;
  }
  return anychart.core.VisualBase.prototype.setupSpecial.apply(this, arguments);
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.disablePointerEvents(config['disablePointerEvents']);
  this.position(config['position']);
  this.anchor(config['anchor']);
  this.offsetX(config['offsetX']);
  this.offsetY(config['offsetY']);
  this.type(config['type']);
  this.size(config['size']);
  this.fill(config['fill']);
  this.stroke(config['stroke']);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Events
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Adds an event listener. A listener can only be added once to an
 * object and if it is added again the key for the listener is
 * returned. Note that if the existing listener is a one-off listener
 * (registered via listenOnce), it will no longer be a one-off
 * listener after a call to listen().
 *
 * @param {!goog.events.EventId.<EVENTOBJ>|string} type The event type id.
 * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
 *     method.
 * @param {boolean=} opt_useCapture Whether to fire in capture phase
 *     (defaults to false).
 * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
 *     listener.
 * @return {goog.events.ListenableKey} Unique key for the listener.
 * @template SCOPE,EVENTOBJ
 */
anychart.core.ui.MarkersFactory.prototype.listen = function(type, listener, opt_useCapture, opt_listenerScope) {
  var res = goog.base(this, 'listen', type, listener, opt_useCapture, opt_listenerScope);
  this.ensureHandler_('' + type, !!opt_useCapture, true, false);
  return res;
};


/**
 * Adds an event listener that is removed automatically after the
 * listener fired once.
 *
 * If an existing listener already exists, listenOnce will do
 * nothing. In particular, if the listener was previously registered
 * via listen(), listenOnce() will not turn the listener into a
 * one-off listener. Similarly, if there is already an existing
 * one-off listener, listenOnce does not modify the listeners (it is
 * still a once listener).
 *
 * @param {!goog.events.EventId.<EVENTOBJ>|string} type The event type id.
 * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
 *     method.
 * @param {boolean=} opt_useCapture Whether to fire in capture phase
 *     (defaults to false).
 * @param {SCOPE=} opt_listenerScope Object in whose scope to call the
 *     listener.
 * @return {goog.events.ListenableKey} Unique key for the listener.
 * @template SCOPE,EVENTOBJ
 */
anychart.core.ui.MarkersFactory.prototype.listenOnce = function(type, listener, opt_useCapture, opt_listenerScope) {
  var res = goog.base(this, 'listenOnce', type, listener, opt_useCapture, opt_listenerScope);
  this.ensureHandler_('' + type, !!opt_useCapture, true, true);
  return res;
};


/**
 * Removes an event listener which was added with listen() or listenOnce().
 *
 * @param {!goog.events.EventId.<EVENTOBJ>|string} type The event type id.
 * @param {function(this:SCOPE, EVENTOBJ):(boolean|undefined)} listener Callback
 *     method.
 * @param {boolean=} opt_useCapture Whether to fire in capture phase
 *     (defaults to false).
 * @param {SCOPE=} opt_listenerScope Object in whose scope to call
 *     the listener.
 * @return {boolean} Whether any listener was removed.
 * @template SCOPE,EVENTOBJ
 */
anychart.core.ui.MarkersFactory.prototype.unlisten = function(type, listener, opt_useCapture, opt_listenerScope) {
  var res = goog.base(this, 'unlisten', type, listener, opt_useCapture, opt_listenerScope);
  this.ensureHandler_('' + type, !!opt_useCapture, false, false);
  return res;
};


/**
 * Removes an event listener which was added with listen() by the key
 * returned by listen().
 *
 * @param {goog.events.ListenableKey} key The key returned by
 *     listen() or listenOnce().
 * @return {boolean} Whether any listener was removed.
 */
anychart.core.ui.MarkersFactory.prototype.unlistenByKey = function(key) {
  var res = goog.base(this, 'unlistenByKey', key);
  if (res)
    this.ensureHandler_(key.type, key.capture, false, false);
  return res;
};


/**
 * Removes all listeners from this listenable. If type is specified,
 * it will only remove listeners of the particular type. otherwise all
 * registered listeners will be removed.
 *
 * @param {string=} opt_type Type of event to remove, default is to
 *     remove all types.
 * @return {number} Number of listeners removed.
 */
anychart.core.ui.MarkersFactory.prototype.removeAllListeners = function(opt_type) {
  var res = goog.base(this, 'removeAllListeners', opt_type);
  if (res) {
    if (opt_type) {
      this.ensureHandler_(/** @type {string} */(opt_type), false, false, false);
      this.ensureHandler_(/** @type {string} */(opt_type), true, false, false);
    } else {
      this.removeAllHandlers_();
    }
  }
  return res;
};


/**
 * Synchronizes Element and DOM handlers. Should be called after all handler operations on the Element are finished.
 * @param {string} type Event type string.
 * @param {boolean} capture If event should be listened on capture.
 * @param {boolean} armed If this handler should be armed or not.
 * @param {boolean=} opt_once Use listenOnce.
 * @private
 */
anychart.core.ui.MarkersFactory.prototype.ensureHandler_ = function(type, capture, armed, opt_once) {
  if (type == 'signal') return;
  opt_once = !!opt_once && armed;
  /** @type {number} */
  var eventTypeCode = acgraph.vector.Element.HANDLED_EVENT_TYPES[type] || 0;
  if (capture)
    eventTypeCode = eventTypeCode << acgraph.vector.Element.HANDLED_EVENT_TYPES_CAPTURE_SHIFT;
  if (eventTypeCode) {
    var changed = false;
    /** @type {boolean} */
    var eventAttached = !!(this.attachedEvents_ & eventTypeCode);
    if (opt_once) {
      eventAttached = !!(this.attachedOnceEvents_ & eventTypeCode);
      if (armed && !eventAttached) {
        this.attachedOnceEvents_ |= eventTypeCode;
        changed = true;
      }
    } else {
      if (armed && !eventAttached) {
        this.attachedEvents_ |= eventTypeCode;
        changed = true;
      } else if (!armed && eventAttached) {
        this.attachedEvents_ &= ~eventTypeCode;
        this.attachedOnceEvents_ &= ~eventTypeCode;
        changed = true;
      }
    }
    if (changed)
      this.invalidate(anychart.ConsistencyState.MARKERS_FACTORY_HANDLERS, anychart.Signal.NEEDS_REDRAW);
  }
};


/**
 * Synchronizes Element and DOM handlers. Should be called after all handler operations on the Element are finished.
 * @private
 */
anychart.core.ui.MarkersFactory.prototype.removeAllHandlers_ = function() {
  var changed = !!(this.attachedEvents_ | this.attachedOnceEvents_);
  this.attachedEvents_ = 0;
  this.attachedOnceEvents_ = 0;
  if (changed)
    this.invalidate(anychart.ConsistencyState.MARKERS_FACTORY_HANDLERS, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Handles most of browser events happened with underlying DOM element redirecting them to
 * Element event listeners. Event.target property value is replaced by this method.
 * @param {goog.events.BrowserEvent} e Mouse event to handle.
 * @private
 */
anychart.core.ui.MarkersFactory.prototype.handleBrowserEvent_ = function(e) {
  if (e instanceof goog.events.BrowserEvent) {
    e.stopPropagation();
    var target = this.getMarker(e.target && e.target['__tagIndex']);
    if (target)
      this.dispatchEvent(new anychart.core.ui.MarkersFactory.BrowserEvent(e, target));
  }
};



/**
 * Encapsulates browser event for acgraph.
 * @param {goog.events.BrowserEvent=} opt_e Normalized browser event to initialize this event.
 * @param {goog.events.EventTarget=} opt_target EventTarget to be set as a target of the event.
 * @constructor
 * @extends {goog.events.BrowserEvent}
 */
anychart.core.ui.MarkersFactory.BrowserEvent = function(opt_e, opt_target) {
  goog.base(this);
  if (opt_e)
    this.copyFrom(opt_e, opt_target);
};
goog.inherits(anychart.core.ui.MarkersFactory.BrowserEvent, goog.events.BrowserEvent);


/**
 * An override of BrowserEvent.event_ field to allow compiler to treat it properly.
 * @private
 * @type {goog.events.BrowserEvent}
 */
anychart.core.ui.MarkersFactory.BrowserEvent.prototype.event_;


/**
 * Copies all info from a BrowserEvent to represent a new one, rearmed event, that can be redispatched.
 * @param {goog.events.BrowserEvent} e Normalized browser event to copy the event from.
 * @param {goog.events.EventTarget=} opt_target EventTarget to be set as a target of the event.
 */
anychart.core.ui.MarkersFactory.BrowserEvent.prototype.copyFrom = function(e, opt_target) {
  this.type = e.type;
  // TODO (Anton Saukh): this awful typecast must be removed when it is no longer needed.
  // In the BrowserEvent.init() method there is a TODO from Santos, asking to change typification
  // from Node to EventTarget, which would make more sense.
  /** @type {Node} */
  var target = /** @type {Node} */(/** @type {Object} */(opt_target));
  this.target = target || e.target;
  this.currentTarget = e.currentTarget || this.target;
  this.relatedTarget = e.relatedTarget || this.target;

  this['markerIndex'] = e.target && e.target['__tagIndex'];
  if (isNaN(this['markerIndex']))
    this['markerIndex'] = -1;

  this.offsetX = e.offsetX;
  this.offsetY = e.offsetY;

  this.clientX = e.clientX;
  this.clientY = e.clientY;

  this.screenX = e.screenX;
  this.screenY = e.screenY;

  this.button = e.button;

  this.keyCode = e.keyCode;
  this.charCode = e.charCode;
  this.ctrlKey = e.ctrlKey;
  this.altKey = e.altKey;
  this.shiftKey = e.shiftKey;
  this.metaKey = e.metaKey;
  this.platformModifierKey = e.platformModifierKey;
  this.state = e.state;

  this.event_ = e;
  delete this.propagationStopped_;
};



/**
 *
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.ui.MarkersFactory.Marker = function() {
  goog.base(this);

  /**
   * Label index.
   * @type {number}
   * @private
   */
  this.index_;

  /**
   * @type {acgraph.vector.Element}
   * @private
   */
  this.markerElement_;

  /**
   *
   * @type {Object.<string, boolean>}
   */
  this.settingsObj = {};

  this.resetSettings();
};
goog.inherits(anychart.core.ui.MarkersFactory.Marker, anychart.core.VisualBase);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.SUPPORTED_SIGNALS = anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.APPEARANCE;


/**
 * Returns marker DOM element.
 * @return {acgraph.vector.Element}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.getDomElement = function() {
  return this.markerElement_;
};


/**
 * Gets/sets parent MarkersFactory.
 * @param {!anychart.core.ui.MarkersFactory=} opt_value Markers factory.
 * @return {anychart.core.ui.MarkersFactory|anychart.core.ui.MarkersFactory.Marker} Returns MarkersFactory
 * or self for method chaining.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.parentMarkersFactory = function(opt_value) {
  if (goog.isDefAndNotNull(opt_value)) {
    if (this.parentMarkersFactory_ != opt_value) {
      this.parentMarkersFactory_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.parentMarkersFactory_;
  }
};


/**
 * Gets/sets current MarkersFactory to get settings from.
 * @param {anychart.core.ui.MarkersFactory=} opt_value Markes factory.
 * @return {anychart.core.ui.MarkersFactory|anychart.core.ui.MarkersFactory.Marker} Returns MarkersFactory
 * or self for method chaining.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.currentMarkersFactory = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.currentMarkersFactory_ != opt_value) {
      this.currentMarkersFactory_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.currentMarkersFactory_;
  }
};


/**
 * Returns markers index.
 * @return {number}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.getIndex = function() {
  return this.index_;
};


/**
 * Sets markers index.
 * @param {number} index Index to set.
 * @return {anychart.core.ui.MarkersFactory.Marker}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.setIndex = function(index) {
  this.index_ = +index;
  return this;
};


/**
 * Gets/Sets position formatter.
 * @param {*=} opt_value Position formatter.
 * @return {*} Position formatter or self for chaining.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.positionFormatter = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.positionFormatter_ != opt_value) {
      this.settingsObj.positionFormatter_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.settingsObj.positionFormatter_;
  }
};


/**
 * Gets/Sets position provider.
 * @param {*=} opt_value Position provider.
 * @return {*} Position provider or self for chaining.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.positionProvider = function(opt_value) {
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
 * Getter for current position settings of all markers.
 * @param {(anychart.enums.Position|string)=} opt_value Markers position settings.
 * @return {anychart.core.ui.MarkersFactory.Marker|anychart.enums.Position|string} Markers position
 * settings or self for chaining call.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.position = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = String(opt_value);
    if (this.settingsObj.position_ != opt_value) {
      this.settingsObj.position_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.position_;
  }
};


/**
 * Getter for anchor settings of all markers.
 * @param {(anychart.enums.Anchor|string)=} opt_value .
 * @return {!(anychart.core.ui.MarkersFactory.Marker|anychart.enums.Anchor|string)} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.anchor = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeAnchor(opt_value);
    if (this.settingsObj.anchor_ != opt_value) {
      this.settingsObj.anchor_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.anchor_;
  }
};


/**
 * Getter for current type settings of all markers.
 * @param {(anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.ui.MarkersFactory.Marker|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path|string} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.type = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.type_ != opt_value) {
      this.settingsObj.type_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.type_;
  }
};


/**
 * Getter for current size settings of all markers.
 * @param {number=} opt_value .
 * @return {anychart.core.ui.MarkersFactory.Marker|number} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.size = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.size_ != opt_value) {
      this.settingsObj.size_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.size_;
  }
};


/**
 * Getter for current offsetX settings of all markers.
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.MarkersFactory.Marker} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.offsetX = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.offsetX_ != opt_value) {
      this.settingsObj.offsetX_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.offsetX_;
  }
};


/**
 * Getter for current offsetY settings of all markers.
 * @param {(number|string)=} opt_value .
 * @return {number|string|anychart.core.ui.MarkersFactory.Marker} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.offsetY = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.offsetY_ != opt_value) {
      this.settingsObj.offsetY_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.offsetY_;
  }
};


/**
 * Getter for current fill settings of all markers.
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|string|anychart.core.ui.MarkersFactory.Marker} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.fill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var color = acgraph.vector.normalizeFill.apply(null, arguments);
    if (this.settingsObj.fill_ != color) {
      this.settingsObj.fill_ = color;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.fill_;
  }
};


/**
 * Getter for current stroke settings of all markers.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Stroke settings,
 *    if used as a setter.
 * @param {number=} opt_thickness Line thickness. Defaults to 1.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 *    Dash array contains a list of comma and/or white space separated lengths and percentages that specify the
 *    lengths of alternating dashes and gaps. If an odd number of values is provided, then the list of values is
 *    repeated to yield an even number of values. Thus, stroke dashpattern: 5,3,2 is equivalent to dashpattern: 5,3,2,5,3,2.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {acgraph.vector.Stroke|string|anychart.core.ui.MarkersFactory.Marker} .
 */
anychart.core.ui.MarkersFactory.Marker.prototype.stroke = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDef(opt_strokeOrFill)) {
    var color = acgraph.vector.normalizeStroke.apply(null, arguments);
    if (this.settingsObj.stroke_ != color) {
      this.settingsObj.stroke_ = color;
      this.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.ENABLED, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.stroke_ || (this.fill() && anychart.color.darken(/** @type {acgraph.vector.Fill} */(this.fill())));
  }
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.Marker.prototype.enabled = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.settingsObj.enabledLabel_ != opt_value) {
      this.settingsObj.enabledLabel_ = opt_value;
      this.invalidate(anychart.ConsistencyState.ENABLED, anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.settingsObj.enabledLabel_;
  }
};


/**
 * Resets marker to the initial state, but leaves DOM elements intact, but without the parent.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.clear = function() {
  this.resetSettings();
  if (this.markerElement_) {
    this.markerElement_.parent(null);
    this.markerElement_.removeAllListeners();
  }
  this.invalidate(anychart.ConsistencyState.CONTAINER);
};


/**
 * Reset settings.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.resetSettings = function() {
  this.settingsObj = {};
  this.superSettingsObj = {};
};


/**
 * Sets settings.
 * @param {Object=} opt_settings1 Settings1.
 * @param {Object=} opt_settings2 Settings2.
 * @return {!anychart.core.ui.MarkersFactory.Marker} Returns self for chaining.
 */
anychart.core.ui.MarkersFactory.Marker.prototype.setSettings = function(opt_settings1, opt_settings2) {
  if (goog.isDef(opt_settings1)) {
    this.setup(opt_settings1);
  }
  if (goog.isDef(opt_settings2)) this.superSettingsObj = opt_settings2;

  this.invalidate(anychart.ConsistencyState.APPEARANCE | anychart.ConsistencyState.ENABLED,
      anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW);
  return this;
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
anychart.core.ui.MarkersFactory.Marker.prototype.getFinalSettings_ = function(pointSettings, pointSuperSettings,
    factorySettings,    
    factorySuperSettings,    
    isFactorySettingsChanged) {
  var notSelfSettings = this.currentMarkersFactory() && this.parentMarkersFactory() != this.currentMarkersFactory();

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
 * Marker drawing.
 * @return {anychart.core.ui.MarkersFactory.Marker}
 */
anychart.core.ui.MarkersFactory.Marker.prototype.draw = function() {
  var parentMarkersFactory = this.parentMarkersFactory();
  var currentMarkersFactory = this.currentMarkersFactory() ? this.currentMarkersFactory() : parentMarkersFactory;
  var settingsChangedStates;
  var notSelfSettings = currentMarkersFactory != parentMarkersFactory;
  if (notSelfSettings)
    settingsChangedStates = currentMarkersFactory.getSettingsChangedStatesObj();
  if (!this.markerElement_) this.markerElement_ = acgraph.path();

  var enabled = this.getFinalSettings_(
      this.enabled(),
      this.superSettingsObj['enabled'],
      parentMarkersFactory.enabled(),
      currentMarkersFactory.enabled(),
      !goog.isNull(currentMarkersFactory.enabled()));
  if (goog.isNull(enabled)) enabled = true;

  if (this.hasInvalidationState(anychart.ConsistencyState.ENABLED) ||
      currentMarkersFactory.hasInvalidationState(anychart.ConsistencyState.ENABLED)) {
    if (!enabled) {
      this.markerElement_.parent(null);
      this.markConsistent(anychart.ConsistencyState.ALL);
      return this;
    } else {
      if (this.container())
        this.markerElement_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
      this.markConsistent(anychart.ConsistencyState.ENABLED);
    }
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER) ||
      currentMarkersFactory.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    if (enabled) {
      if (parentMarkersFactory.getDomElement()) {
        if (!this.container()) this.container(/** @type {acgraph.vector.ILayer} */(parentMarkersFactory.getDomElement()));
        if (!this.container().parent()) {
          this.container().parent(/** @type {acgraph.vector.ILayer} */(parentMarkersFactory.container()));
        }
      }
      if (this.container())
        this.markerElement_.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    }
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX) ||
      currentMarkersFactory.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    if (this.container()) this.container().zIndex(/** @type {number} */(parentMarkersFactory.zIndex()));
    this.markerElement_.zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE) ||
      currentMarkersFactory.hasInvalidationState(anychart.ConsistencyState.APPEARANCE) ||
      currentMarkersFactory.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {

    var anchor = this.getFinalSettings_(
        this.anchor(),
        this.superSettingsObj['anchor'],
        parentMarkersFactory.anchor(),
        currentMarkersFactory.anchor(),
        !!(settingsChangedStates && settingsChangedStates['anchor']));

    var type = this.getFinalSettings_(
        this.type(),
        this.superSettingsObj['type'],
        parentMarkersFactory.type(),
        currentMarkersFactory.type(),
        !!(settingsChangedStates && settingsChangedStates['type']));

    var size = this.getFinalSettings_(
        this.size(),
        this.superSettingsObj['size'],
        parentMarkersFactory.size(),
        currentMarkersFactory.size(),
        !!(settingsChangedStates && settingsChangedStates['size']));

    var offsetY = this.getFinalSettings_(
        this.offsetY(),
        this.superSettingsObj['offsetY'],
        parentMarkersFactory.offsetY(),
        currentMarkersFactory.offsetY(),
        !!(settingsChangedStates && settingsChangedStates['offsetY']));

    var offsetX = this.getFinalSettings_(
        this.offsetX(),
        this.superSettingsObj['offsetX'],
        parentMarkersFactory.offsetX(),
        currentMarkersFactory.offsetX(),
        !!(settingsChangedStates && settingsChangedStates['offsetX']));

    var fill = this.getFinalSettings_(
        this.fill(),
        this.superSettingsObj['fill'],
        parentMarkersFactory.fill(),
        currentMarkersFactory.fill(),
        !!(settingsChangedStates && settingsChangedStates['fill']));

    var stroke = this.getFinalSettings_(
        this.stroke(),
        this.superSettingsObj['stroke'],
        parentMarkersFactory.stroke(),
        currentMarkersFactory.stroke(),
        !!(settingsChangedStates && settingsChangedStates['stroke']));

    var positionFormatter = this.getFinalSettings_(
        this.positionFormatter(),
        this.superSettingsObj['positionFormatter'],
        parentMarkersFactory.positionFormatter(),
        currentMarkersFactory.positionFormatter(),
        !!(settingsChangedStates && settingsChangedStates['positionFormatter']));

    var drawer = goog.isString(type) ?
        anychart.enums.getMarkerDrawer(type) :
        type;

    //define parent bounds
    var parentWidth, parentHeight;
    var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());
    if (parentBounds) {
      parentWidth = parentBounds.width;
      parentHeight = parentBounds.height;
    }

    this.markerElement_.clear();
    this.markerElement_.setTransformationMatrix(1, 0, 0, 1, 0, 0);

    drawer.call(this, this.markerElement_, 0, 0, size);
    var markerBounds = this.markerElement_.getBounds();

    var positionProvider = this.positionProvider();
    var formattedPosition = goog.object.clone(positionFormatter.call(positionProvider, positionProvider));
    var position = new acgraph.math.Coordinate(formattedPosition['x'], formattedPosition['y']);
    var anchorCoordinate = anychart.utils.getCoordinateByAnchor(
        new acgraph.math.Rect(0, 0, markerBounds.width, markerBounds.height),
        /** @type {anychart.enums.Anchor} */(anchor));

    position.x -= anchorCoordinate.x;
    position.y -= anchorCoordinate.y;

    var offsetXNorm = goog.isDef(offsetX) ? anychart.utils.normalizeSize(/** @type {string|number} */(offsetX), parentWidth) : 0;
    var offsetYNorm = goog.isDef(offsetY) ? anychart.utils.normalizeSize(/** @type {string|number} */(offsetY), parentHeight) : 0;

    anychart.utils.applyOffsetByAnchor(position, /** @type {anychart.enums.Anchor} */(anchor), offsetXNorm, offsetYNorm);

    markerBounds.left = position.x + markerBounds.width / 2;
    markerBounds.top = position.y + markerBounds.height / 2;

    this.markerElement_.clear();
    drawer.call(this, this.markerElement_, markerBounds.left, markerBounds.top, size);

    this.markerElement_.fill(fill);
    this.markerElement_.stroke(stroke);

    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  return this;
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.Marker.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  if (goog.isDef(this.position())) json['position'] = this.position();
  if (goog.isDef(this.anchor())) json['anchor'] = this.anchor();
  if (goog.isDef(this.offsetX())) json['offsetX'] = this.offsetX();
  if (goog.isDef(this.offsetY())) json['offsetY'] = this.offsetY();
  if (goog.isDef(this.type())) json['type'] = this.type();
  if (goog.isDef(this.size())) json['size'] = this.size();
  if (goog.isDef(this.fill())) json['fill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.fill()));
  if (goog.isDef(this.stroke())) json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  if (!goog.isDef(this.enabled())) delete json['enabled'];
  return json;
};


/** @inheritDoc */
anychart.core.ui.MarkersFactory.Marker.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.position(config['position']);
  this.anchor(config['anchor']);
  this.offsetX(config['offsetX']);
  this.offsetY(config['offsetY']);
  this.type(config['type']);
  this.size(config['size']);
  this.fill(config['fill']);
  this.stroke(config['stroke']);
  if (!goog.isDef(config['enabled'])) delete this.settingsObj.enabledLabel_;
};


//exports
anychart.core.ui.MarkersFactory.prototype['positionFormatter'] = anychart.core.ui.MarkersFactory.prototype.positionFormatter;
anychart.core.ui.MarkersFactory.prototype['position'] = anychart.core.ui.MarkersFactory.prototype.position;
anychart.core.ui.MarkersFactory.prototype['anchor'] = anychart.core.ui.MarkersFactory.prototype.anchor;
anychart.core.ui.MarkersFactory.prototype['offsetX'] = anychart.core.ui.MarkersFactory.prototype.offsetX;
anychart.core.ui.MarkersFactory.prototype['offsetY'] = anychart.core.ui.MarkersFactory.prototype.offsetY;
anychart.core.ui.MarkersFactory.prototype['type'] = anychart.core.ui.MarkersFactory.prototype.type;
anychart.core.ui.MarkersFactory.prototype['size'] = anychart.core.ui.MarkersFactory.prototype.size;
anychart.core.ui.MarkersFactory.prototype['fill'] = anychart.core.ui.MarkersFactory.prototype.fill;
anychart.core.ui.MarkersFactory.prototype['stroke'] = anychart.core.ui.MarkersFactory.prototype.stroke;
anychart.core.ui.MarkersFactory.prototype['disablePointerEvents'] = anychart.core.ui.MarkersFactory.prototype.disablePointerEvents;
anychart.core.ui.MarkersFactory.prototype['enabled'] = anychart.core.ui.MarkersFactory.prototype.enabled;

