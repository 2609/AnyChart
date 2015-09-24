goog.provide('anychart.core.MouseEvent');
goog.provide('anychart.core.VisualBase');
goog.require('acgraph');
goog.require('anychart.core.Base');
goog.require('goog.dom');
goog.require('goog.json.hybrid');


/**
 * @typedef {{
 *   type: acgraph.events.EventType,
 *   target: (anychart.core.VisualBase|acgraph.vector.Element|acgraph.vector.Stage|Node|undefined),
 *   currentTarget: (anychart.core.VisualBase|acgraph.vector.Element|acgraph.vector.Stage|Node|undefined),
 *   relatedTarget: (anychart.core.VisualBase|acgraph.vector.Element|acgraph.vector.Stage|Node|undefined),
 *   domTarget: (acgraph.vector.Element|acgraph.vector.Stage|Node|undefined),
 *   relatedDomTarget: (acgraph.vector.Element|acgraph.vector.Stage|Node|undefined),
 *   offsetX: number,
 *   offsetY: number,
 *   clientX: number,
 *   clientY: number,
 *   screenX: number,
 *   screenY: number,
 *   button: number,
 *   keyCode: number,
 *   charCode: number,
 *   ctrlKey: boolean,
 *   altKey: boolean,
 *   shiftKey: boolean,
 *   metaKey: boolean,
 *   platformModifierKey: boolean
 * }}
 */
anychart.core.MouseEvent;



/**
 * Base class for all elements.
 * @constructor
 * @extends {anychart.core.Base}
 */
anychart.core.VisualBase = function() {
  goog.base(this);

  /**
   * Handler to manage browser event listeners.
   * @type {goog.events.EventHandler}
   */
  this.eventsHandler = new goog.events.EventHandler(this);
  this.registerDisposable(this.eventsHandler);

  this.invalidate(anychart.ConsistencyState.ALL);
};
goog.inherits(anychart.core.VisualBase, anychart.core.Base);


/**
 * Container to which the root element should be added to.
 * @type {acgraph.vector.ILayer}
 * @private
 */
anychart.core.VisualBase.prototype.container_ = null;


/**
 * Parent bounds storage.
 * @type {anychart.math.Rect}
 * @private
 */
anychart.core.VisualBase.prototype.parentBounds_ = null;


/**
 * Z index of the element.
 * @type {number}
 * @private
 */
anychart.core.VisualBase.prototype.zIndex_;


/**
 * Auto z index of the element.
 * @type {number}
 * @private
 */
anychart.core.VisualBase.prototype.autoZIndex_ = 0;


/**
 * Whether element is enabled or not.
 * @type {?boolean}
 * @private
 */
anychart.core.VisualBase.prototype.enabled_ = true;


/**
 * Double signals dispatching for enabled state signals special treatment.
 * @type {boolean}
 * @private
 */
anychart.core.VisualBase.prototype.doubleSuspension_ = false;


/**
 * Supported signals.
 * @type {number}
 */
anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS =
    anychart.Signal.NEEDS_REDRAW |
    anychart.Signal.BOUNDS_CHANGED;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.ConsistencyState.ENABLED |
    anychart.ConsistencyState.CONTAINER |
    anychart.ConsistencyState.BOUNDS |
    anychart.ConsistencyState.Z_INDEX;


/**
 * Applies all handlers to passed element. By default this.defaultBrowserEvent handler is applied. But you can override
 * handlers by corresponding parameters.
 * @param {acgraph.vector.Element|acgraph.vector.Stage} element
 * @param {?function(acgraph.events.BrowserEvent)=} opt_overHandler
 * @param {?function(acgraph.events.BrowserEvent)=} opt_outHandler
 * @param {?function(acgraph.events.BrowserEvent)=} opt_clickHandler
 * @param {?function(acgraph.events.BrowserEvent)=} opt_moveHandler
 * @param {?function(acgraph.events.BrowserEvent)=} opt_downHandler
 * @param {?function(acgraph.events.BrowserEvent)=} opt_upHandler
 * @protected
 */
anychart.core.VisualBase.prototype.bindHandlersToGraphics = function(element, opt_overHandler, opt_outHandler,
    opt_clickHandler, opt_moveHandler, opt_downHandler, opt_upHandler) {
  element.tag = this;
  this.eventsHandler.listen(element, acgraph.events.EventType.CLICK, opt_clickHandler || this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.DBLCLICK, this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.MOUSEOVER, opt_overHandler || this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.MOUSEOUT, opt_outHandler || this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.MOUSEDOWN, opt_downHandler || this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.MOUSEUP, opt_upHandler || this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.TOUCHSTART, this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.TOUCHEND, this.handleBrowserEvent);
  this.eventsHandler.listen(element, acgraph.events.EventType.MOUSEMOVE, opt_moveHandler || this.handleBrowserEvent);
};


/**
 * Applies all handlers to passed element. By default this.defaultBrowserEvent handler is applied. But you can override
 * handlers by corresponding parameters.
 * @param {anychart.core.VisualBase} target
 * @param {?function(anychart.core.MouseEvent)=} opt_overHandler
 * @param {?function(anychart.core.MouseEvent)=} opt_outHandler
 * @param {?function(anychart.core.MouseEvent)=} opt_clickHandler
 * @param {?function(anychart.core.MouseEvent)=} opt_moveHandler
 * @param {?function(anychart.core.MouseEvent)=} opt_allHandler - if set, replaces this.handleMouseEvent default.
 * @param {?function(anychart.core.MouseEvent)=} opt_downHandler
 * @protected
 */
anychart.core.VisualBase.prototype.bindHandlersToComponent = function(target, opt_overHandler, opt_outHandler,
    opt_clickHandler, opt_moveHandler, opt_allHandler, opt_downHandler) {
  this.eventsHandler.listen(target, acgraph.events.EventType.CLICK, opt_clickHandler || opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.DBLCLICK, opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.MOUSEOVER, opt_overHandler || opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.MOUSEOUT, opt_outHandler || opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.MOUSEDOWN, opt_downHandler || opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.MOUSEUP, opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.TOUCHSTART, opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.TOUCHEND, opt_allHandler || this.handleMouseEvent);
  this.eventsHandler.listen(target, acgraph.events.EventType.MOUSEMOVE, opt_moveHandler || opt_allHandler || this.handleMouseEvent);
};


/**
 * Default browser event handler. Redispatches the event over ACDVF event target hierarchy.
 * @param {acgraph.events.BrowserEvent} e
 * @return {boolean} If anyone called preventDefault on the event object (or
 *     if any of the listeners returns false) this will also return false.
 * @protected
 */
anychart.core.VisualBase.prototype.handleBrowserEvent = function(e) {
  // we stop wrapper propagation to prevent parent elements hearing this event from their layer.
  // we stop only wrapper propagation to continue DOM event propagation through DOM elements under the Stage.
  e.stopWrapperPropagation();
  return this.dispatchEvent(this.makeBrowserEvent(e));
};


/**
 * Default event patcher. Does nothing by default.
 * @param {anychart.core.MouseEvent} e
 * @protected
 */
anychart.core.VisualBase.prototype.handleMouseEvent = function(e) {
};


/**
 * Creates anychart.core.MouseEvent from acgraph.events.BrowserEvent. Can be used to patch event before dispatching.
 * @param {acgraph.events.BrowserEvent} e
 * @return {anychart.core.MouseEvent}
 * @protected
 */
anychart.core.VisualBase.prototype.makeBrowserEvent = function(e) {
  return {
    'type': e['type'],
    'target': this,
    'relatedTarget': this.getOwnerElement(e['relatedTarget']) || e['relatedTarget'],
    'domTarget': e['target'],
    'relatedDomTarget': e['relatedTarget'],
    'offsetX': e['offsetX'],
    'offsetY': e['offsetY'],
    'clientX': e['clientX'],
    'clientY': e['clientY'],
    'screenX': e['screenX'],
    'screenY': e['screenY'],
    'button': e['button'],
    'keyCode': e['keyCode'],
    'charCode': e['charCode'],
    'ctrlKey': e['ctrlKey'],
    'altKey': e['altKey'],
    'shiftKey': e['shiftKey'],
    'metaKey': e['metaKey'],
    'platformModifierKey': e['platformModifierKey'],
    'state': e['state']
  };
};


/**
 * Finds owner element for a graphics element. Uses tag of the element.
 * @param {*} target
 * @return {anychart.core.VisualBase}
 * @protected
 */
anychart.core.VisualBase.prototype.getOwnerElement = function(target) {
  while (target instanceof acgraph.vector.Element) {
    if (target.tag instanceof anychart.core.VisualBase) {
      return /** @type {anychart.core.VisualBase} */(target.tag);
    }
    target = (/** @type {acgraph.vector.Element} */(target)).parent();
  }
  return null;
};


/**
 * Getter for the element current container.
 * @return {acgraph.vector.ILayer} The current container.
 *//**
 * Setter for the element container.<br/>
 * Each element appends all its content to this container.<br/>
 * The order of adding is not defined, but usually it will be the order in which elements are drawn for the first time.
 * If you need to specify the order use {@link anychart.core.VisualBase#zIndex}.
 * @example <t>listingOnly</t>
 * // string
 *  element.container('containerIdentifier');
 * // DOM-element
 *  var domElement = document.getElementById('containerIdentifier');
 *  element.container(domElement);
 * // Framework-element
 *  var fwElement = anychart.ui.title();
 *  element.container( fwElement.container() );
 * @example <t>lineChart</t>
 * chart.line([4, 2, 8]);
 * @param {(acgraph.vector.ILayer|string|Element)=} opt_value The value to set.
 * @return {!anychart.core.VisualBase} An instance of {@link anychart.core.VisualBase} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.ILayer|string|Element)=} opt_value .
 * @return {(acgraph.vector.ILayer|!anychart.core.VisualBase)} .
 */
anychart.core.VisualBase.prototype.container = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.container_ != opt_value) {
      var containerBounds = this.container_ && this.container_.getStage() && this.container_.getStage().getBounds();
      if (goog.isString(opt_value) || goog.dom.isElement(opt_value)) {
        // Should we use registerDisposable in this case?
        // TODO(Anton Saukh): fix type cast to {Element|string} when this will be fixed in graphics.
        this.container_ = acgraph.create();
        this.registerDisposable(this.container_);
        this.container_.container(/** @type {Element} */(opt_value));

        //if graphics engine can't recognize passed container
        //we should destroy stage to avoid uncontrolled behaviour
        if (!this.container_.container()) {
          this.container_.dispose();
          this.container_ = null;
          return this;
        }
      } else {
        this.container_ = /** @type {acgraph.vector.ILayer} */(opt_value);
      }

      var state = anychart.ConsistencyState.CONTAINER;
      var newContainerBounds = this.container_ && this.container_.getStage() && this.container_.getStage().getBounds();
      if (!goog.math.Rect.equals(containerBounds, newContainerBounds))
        state |= anychart.ConsistencyState.BOUNDS;

      this.invalidate(state, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.container_;
};


/**
 * Getter for the current Z-index of the element.
 * @return {number} The current zIndex.
 *//**
 * Setter for the Z-index of the element.<br/>
 * @illustration <t>stageOnly</t>
 *  var stroke = '1 black 1';
 *  layer.ellipse(75, 105, 55, 35).fill('#cc6622', 1).stroke(stroke)
 *  layer.ellipse(95, 75, 55, 35).fill('#ccaa22', 1).stroke(stroke)
 *  layer.ellipse(115, 45, 55, 35).fill('#ccee22', 1).stroke(stroke);
 *  layer.text(195, 100, 'index = 0');
 *  layer.text(195, 70, 'index = 1');
 *  layer.text(195, 40, 'index = 2');
 * @illustrationDesc
 * The bigger the index - the higher the element position is.
 * @param {number=} opt_value Value to set.
 * @return {!anychart.core.VisualBase} An instance of {@link anychart.core.VisualBase} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {(number|!anychart.core.VisualBase)} .
 */
anychart.core.VisualBase.prototype.zIndex = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var val = +opt_value || 0;
    if (this.zIndex_ != val) {
      this.zIndex_ = val;
      this.invalidate(anychart.ConsistencyState.Z_INDEX, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return goog.isDef(this.zIndex_) ? this.zIndex_ : this.autoZIndex_;
};


/**
 * Auto z-index setter.
 * @param {number} value
 */
anychart.core.VisualBase.prototype.setAutoZIndex = function(value) {
  this.autoZIndex_ = value;
};


/**
 * Getter for the current element state (enabled or disabled).
 * @return {boolean} The current element state.
 *//**
 * Setter for the element enabled state.
 * @example <t>listingOnly</t>
 * if (!element.enabled())
 *    element.enabled(true);
 * @example <t>lineChart</t>
 * var blueLine = chart.line([1, 1.6, 1.2, 2.1]).enabled(true);
 * // there are no second series.
 * var redLine = chart.line([11, 11.6, 11.2, 12.1]).enabled(false);
 * @param {boolean=} opt_value Value to set.
 * @return {!anychart.core.VisualBase} An instance of {@link anychart.core.VisualBase} class for method chaining.
 *//**
 * We should not add possible null value of the param and result to the public doc. It is needed for compiler because
 * of overrides.
 * @ignoreDoc
 * @param {?boolean=} opt_value Value to set.
 * @return {!anychart.core.VisualBase|boolean|null} .
 */
anychart.core.VisualBase.prototype.enabled = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.enabled_ != opt_value) {
      this.enabled_ = opt_value;
      this.invalidate(anychart.ConsistencyState.ENABLED, this.getEnableChangeSignals());
      if (this.enabled_) {
        this.doubleSuspension_ = false;
        this.resumeSignalsDispatching(true);
      } else {
        if (isNaN(this.suspendedDispatching)) {
          this.suspendSignalsDispatching();
        } else {
          this.doubleSuspension_ = true;
        }
      }
    }
    return this;
  } else {
    return this.enabled_;
  }
};


/**
 * Returns enabled state change signals.
 * @return {number}
 * @protected
 */
anychart.core.VisualBase.prototype.getEnableChangeSignals = function() {
  return anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED;
};


/** @inheritDoc */
anychart.core.VisualBase.prototype.resumeSignalsDispatching = function(doDispatch) {
  var doSpecial = this.doubleSuspension_ && this.suspensionLevel == 1;
  var realSignals;
  if (doSpecial) {
    realSignals = this.suspendedDispatching;
    this.suspendedDispatching = this.getEnableChangeSignals();
    this.doubleSuspension_ = false;
  }
  goog.base(this, 'resumeSignalsDispatching', doDispatch);
  if (doSpecial) {
    this.suspendSignalsDispatching();
    if (realSignals)
      this.dispatchSignal(realSignals);
  }

  return this;
};


/**
 * Checks if drawing continuation is needed. Also resolves enabled state.
 * @return {boolean} True - if we should continue drawing, false otherwise.
 */
anychart.core.VisualBase.prototype.checkDrawingNeeded = function() {
  if (this.isConsistent())
    return false;

  if (!this.enabled()) {
    if (this.hasInvalidationState(anychart.ConsistencyState.ENABLED)) {
      this.remove();
      this.markConsistent(anychart.ConsistencyState.ENABLED);
      this.invalidate(anychart.ConsistencyState.CONTAINER);
    }
    return false;
  } else if (!this.container()) {
    this.remove(); // It should be removed if it was drawn.
    this.invalidate(anychart.ConsistencyState.CONTAINER);
    anychart.utils.error(anychart.enums.ErrorCode.CONTAINER_NOT_SET);
    return false;
  }
  this.markConsistent(anychart.ConsistencyState.ENABLED);
  return true;
};


/**
 * Remove all elements content from the container.
 * @protected
 */
anychart.core.VisualBase.prototype.remove = goog.nullFunction;


/**
 * Gets or sets bounds that would be used in case of percent size calculations. Expects pixel values only.
 * As a getter falls back to stage bounds.
 * @param {(anychart.math.Rect|{left:number,top:number,width:number,height:number}|number|null)=} opt_boundsOrLeft
 * @param {number=} opt_top
 * @param {number=} opt_width
 * @param {number=} opt_height
 * @return {anychart.core.VisualBase|anychart.math.Rect}
 */
anychart.core.VisualBase.prototype.parentBounds = function(opt_boundsOrLeft, opt_top, opt_width, opt_height) {
  if (goog.isDef(opt_boundsOrLeft)) {
    var left, top, width, height;
    if (goog.isNull(opt_boundsOrLeft)) {
      if (this.parentBounds_) {
        this.parentBounds_ = null;
        this.invalidateParentBounds();
      }
    } else if (opt_boundsOrLeft instanceof anychart.math.Rect) {
      left = opt_boundsOrLeft.left;
      top = opt_boundsOrLeft.top;
      width = opt_boundsOrLeft.width;
      height = opt_boundsOrLeft.height;
    } else if (goog.isObject(opt_boundsOrLeft)) {
      left = opt_boundsOrLeft['left'];
      top = opt_boundsOrLeft['top'];
      width = opt_boundsOrLeft['width'];
      height = opt_boundsOrLeft['height'];
    } else {
      left = opt_boundsOrLeft;
      top = opt_top;
      width = opt_width;
      height = opt_height;
    }
    left = anychart.utils.toNumber(left);
    top = anychart.utils.toNumber(top);
    width = anychart.utils.toNumber(width);
    height = anychart.utils.toNumber(height);
    if (!isNaN(left) && !isNaN(top) && !isNaN(width) && !isNaN(height) && (
        !this.parentBounds_ ||
        this.parentBounds_.left != left ||
        this.parentBounds_.top != top ||
        this.parentBounds_.width != width ||
        this.parentBounds_.height != height)) {
      if (this.parentBounds_) {
        this.parentBounds_.left = left;
        this.parentBounds_.top = top;
        this.parentBounds_.width = width;
        this.parentBounds_.height = height;
      } else {
        this.parentBounds_ = anychart.math.rect(left, top, width, height);
      }
      this.invalidateParentBounds();
    }
    return this;
  }
  if (this.parentBounds_)
    return this.parentBounds_.clone();
  var stage;
  if (this.container_ && (stage = this.container_.getStage()))
    return stage.getBounds();
  return null;
};


/**
 * Overridable invalidator for visual bounds.
 * @protected
 */
anychart.core.VisualBase.prototype.invalidateParentBounds = function() {
  this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.BOUNDS_CHANGED | anychart.Signal.NEEDS_REDRAW);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Export.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Saves the current visual state into PNG file.
 * @example <t>lineChart</t>
 * chart.line([4, 2, 12]);
 * chart.label()
 *   .background(true)
 *   .text('Save image')
 *   .fontColor('#fff')
 *   .padding(5)
 *   .offsetX(5)
 *   .listen('click', function(){
 *      chart.saveAsPng();
 *   });
 * @param {number=} opt_width Image width.
 * @param {number=} opt_height Image height.
 * @param {number=} opt_quality Image quality in ratio 0-1.
 */
anychart.core.VisualBase.prototype.saveAsPng = function(opt_width, opt_height, opt_quality) {
  var stage = this.container() ? this.container().getStage() : null;
  if (stage) stage.saveAsPng(opt_width, opt_height, opt_quality);
};


/**
 * Saves the current visual state into JPEG file.
 * @example <t>lineChart</t>
 * chart.line([4, 2, 12]);
 * chart.label()
 *   .background(true)
 *   .text('Save image')
 *   .fontColor('#fff')
 *   .padding(5)
 *   .offsetX(5)
 *   .listen('click', function(){
 *      chart.saveAsJpg();
 *   });
 * @param {number=} opt_width Image width.
 * @param {number=} opt_height Image height.
 * @param {number=} opt_quality Image quality in ratio 0-1.
 * @param {boolean=} opt_forceTransparentWhite Define, should we force transparent to white background.
 */
anychart.core.VisualBase.prototype.saveAsJpg = function(opt_width, opt_height, opt_quality, opt_forceTransparentWhite) {
  var stage = this.container() ? this.container().getStage() : null;
  if (stage) stage.saveAsJpg(opt_width, opt_height, opt_quality, opt_forceTransparentWhite);
};


/**
 * Saves the current visual state into PDF file.
 * @example <t>lineChart</t>
 * chart.line([4, 2, 12]);
 * chart.label()
 *   .background(true)
 *   .text('Save image')
 *   .fontColor('#fff')
 *   .padding(5)
 *   .offsetX(5)
 *   .listen('click', function(){
 *      chart.saveAsPdf();
 *   });
 * @param {string=} opt_paperSize Any paper format like 'a0', 'tabloid', 'b4', etc.
 * @param {boolean=} opt_landscape Define, is landscape.
 * @param {number=} opt_x Offset X.
 * @param {number=} opt_y Offset Y.
 */
anychart.core.VisualBase.prototype.saveAsPdf = function(opt_paperSize, opt_landscape, opt_x, opt_y) {
  var stage = this.container() ? this.container().getStage() : null;
  if (stage) stage.saveAsPdf(opt_paperSize, opt_landscape, opt_x, opt_y);
};


/**
 * Saves the current visual state into SVG file.
 * @example <t>lineChart</t>
 * chart.line([4, 2, 12]);
 * chart.label()
 *   .background(true)
 *   .text('Save image')
 *   .fontColor('#fff')
 *   .padding(5)
 *   .offsetX(5)
 *   .listen('click', function(){
 *      chart.saveAsSvg();
 *   });
 * @param {(string|number)=} opt_paperSizeOrWidth Paper Size or width.
 * @param {(boolean|string)=} opt_landscapeOrHeight Landscape or height.
 */
anychart.core.VisualBase.prototype.saveAsSvg = function(opt_paperSizeOrWidth, opt_landscapeOrHeight) {
  var stage = this.container() ? this.container().getStage() : null;
  if (stage) stage.saveAsSvg(opt_paperSizeOrWidth, opt_landscapeOrHeight);
};


/**
 * Returns SVG string if type of content SVG otherwise returns empty string.
 * @param {(string|number)=} opt_paperSizeOrWidth Paper Size or width.
 * @param {(boolean|string)=} opt_landscapeOrHeight Landscape or height.
 * @return {string}
 */
anychart.core.VisualBase.prototype.toSvg = function(opt_paperSizeOrWidth, opt_landscapeOrHeight) {
  var stage = this.container() ? this.container().getStage() : null;
  return stage ? stage.toSvg(opt_paperSizeOrWidth, opt_landscapeOrHeight) : '';
};


/**
 * Print all element on related stage.
 * @param {acgraph.vector.PaperSize=} opt_paperSize
 * @param {boolean=} opt_landscape
 */
anychart.core.VisualBase.prototype.print = function(opt_paperSize, opt_landscape) {
  var stage = this.container() && this.container().getStage();
  if (stage) stage.print(opt_paperSize, opt_landscape);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Deprecated Export.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Saves the current visual state into PNG file.
 */
anychart.core.VisualBase.prototype.saveAsPNG = function() {
  anychart.utils.warning(anychart.enums.WarningCode.DEPRECATED, null, ['saveAsPNG()', 'saveAsPng()'], true);
  this.saveAsPng();
};


/**
 * Saves the current visual state into JPEG file.
 */
anychart.core.VisualBase.prototype.saveAsJPG = function() {
  anychart.utils.warning(anychart.enums.WarningCode.DEPRECATED, null, ['saveAsJPG()', 'saveAsJpg()'], true);
  this.saveAsJpg();
};


/**
 * Saves the current visual state into PDF file.
 */
anychart.core.VisualBase.prototype.saveAsPDF = function() {
  anychart.utils.warning(anychart.enums.WarningCode.DEPRECATED, null, ['saveAsPDF()', 'saveAsPdf()'], true);
  this.saveAsPdf();
};


/**
 * Saves the current visual state into SVG file.
 */
anychart.core.VisualBase.prototype.saveAsSVG = function() {
  anychart.utils.warning(anychart.enums.WarningCode.DEPRECATED, null, ['saveAsSVG()', 'saveAsSvg()'], true);
  this.saveAsSvg();
};


/**
 * Returns SVG string if type of content SVG otherwise returns empty string.
 * @return {string}
 */
anychart.core.VisualBase.prototype.toSVG = function() {
  anychart.utils.warning(anychart.enums.WarningCode.DEPRECATED, null, ['toSVG()', 'toSvg()'], true);
  return this.toSvg();
};


//----------------------------------------------------------------------------------------------------------------------
//
//  JSON.
//
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.VisualBase.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['enabled'] = this.enabled();
  if (goog.isDef(this.zIndex_))
    json['zIndex'] = this.zIndex();
  return json;
};


/** @inheritDoc */
anychart.core.VisualBase.prototype.setupSpecial = function(var_args) {
  var arg0 = arguments[0];
  if (goog.isBoolean(arg0) || goog.isNull(arg0)) {
    this.enabled(!!arg0);
    return true;
  }
  return anychart.core.Base.prototype.setupSpecial.apply(this, arguments);
};


/** @inheritDoc */
anychart.core.VisualBase.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.enabled('enabled' in config ? config['enabled'] : true);
  this.zIndex(config['zIndex']);
};


/** @inheritDoc */
anychart.core.VisualBase.prototype.disposeInternal = function() {
  goog.dispose(this.eventsHandler);
  this.eventsHandler = null;

  goog.base(this, 'disposeInternal');
};


//exports
anychart.core.VisualBase.prototype['saveAsPNG'] = anychart.core.VisualBase.prototype.saveAsPNG;//deprecated
anychart.core.VisualBase.prototype['saveAsJPG'] = anychart.core.VisualBase.prototype.saveAsJPG;//deprecated
anychart.core.VisualBase.prototype['saveAsSVG'] = anychart.core.VisualBase.prototype.saveAsSVG;//deprecated
anychart.core.VisualBase.prototype['saveAsPDF'] = anychart.core.VisualBase.prototype.saveAsPDF;//deprecated
anychart.core.VisualBase.prototype['toSVG'] = anychart.core.VisualBase.prototype.toSVG;//deprecated

anychart.core.VisualBase.prototype['zIndex'] = anychart.core.VisualBase.prototype.zIndex;//in docs/final
anychart.core.VisualBase.prototype['enabled'] = anychart.core.VisualBase.prototype.enabled;//doc|ex
anychart.core.VisualBase.prototype['print'] = anychart.core.VisualBase.prototype.print;
