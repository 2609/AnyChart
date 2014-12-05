goog.provide('anychart.core.grids.Polar');
goog.require('acgraph');
goog.require('anychart.color');
goog.require('anychart.core.VisualBase');
goog.require('anychart.core.utils.TypedLayer');
goog.require('anychart.enums');
goog.require('anychart.utils');



/**
 * Grid.
 * @constructor
 * @extends {anychart.core.VisualBase}
 */
anychart.core.grids.Polar = function() {
  goog.base(this);

  /**
   * @type {anychart.core.utils.TypedLayer}
   * @private
   */
  this.oddFillElement_;

  /**
   * @type {anychart.core.utils.TypedLayer}
   * @private
   */
  this.evenFillElement_;

  /**
   * @type {acgraph.vector.Path}
   * @private
   */
  this.lineElement_;

  /**
   * @type {string|acgraph.vector.Fill}
   * @private
   */
  this.oddFill_ = '#FFFFFF 0.3';

  /**
   * @type {string|acgraph.vector.Fill}
   * @private
   */
  this.evenFill_ = '#F5F5F5 0.3';

  /**
   * @type {string|acgraph.vector.Stroke}
   * @private
   */
  this.stroke_ = '#C1C1C1';

  /**
   * @type {anychart.scales.Base}
   * @private
   */
  this.yScale_;

  /**
   * @type {anychart.scales.Base}
   * @private
   */
  this.xScale_;

  /**
   * @type {boolean}
   * @private
   */
  this.isMinor_ = false;

  /**
   * @type {anychart.enums.RadialGridLayout}
   * @private
   */
  this.layout_ = anychart.enums.RadialGridLayout.CIRCUIT;

  /**
   * @type {number}
   * @private
   */
  this.startAngle_ = 0;

  /**
   * @type {boolean}
   * @private
   */
  this.drawLastLine_ = true;
};
goog.inherits(anychart.core.grids.Polar, anychart.core.VisualBase);


//----------------------------------------------------------------------------------------------------------------------
//  States and signals.
//----------------------------------------------------------------------------------------------------------------------
/**
 * Supported signals.
 * @type {number}
 */
anychart.core.grids.Polar.prototype.SUPPORTED_SIGNALS =
    anychart.core.VisualBase.prototype.SUPPORTED_SIGNALS |
    anychart.Signal.BOUNDS_CHANGED;


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.grids.Polar.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.VisualBase.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.BOUNDS |
    anychart.ConsistencyState.APPEARANCE |
    anychart.ConsistencyState.POSITION;


//----------------------------------------------------------------------------------------------------------------------
//  Layout.
//----------------------------------------------------------------------------------------------------------------------
/**
 * Get/set grid layout.
 * @param {anychart.enums.RadialGridLayout=} opt_value Grid layout.
 * @return {anychart.enums.RadialGridLayout|anychart.core.grids.Polar} Layout or this.
 */
anychart.core.grids.Polar.prototype.layout = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var layout = anychart.enums.normalizePolarLayout(opt_value, anychart.enums.RadialGridLayout.CIRCUIT);
    if (this.layout_ != layout) {
      this.layout_ = layout;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.layout_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//  Scale.
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for axis yScale.
 * @return {anychart.scales.Base} Axis yScale.
 *//**
 * Setter for axis yScale.
 * @param {anychart.scales.Base=} opt_value Value to set.
 * @return {!anychart.core.grids.Polar} {@link anychart.core.grids.Polar} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {anychart.scales.Base=} opt_value Scale.
 * @return {anychart.scales.Base|anychart.core.grids.Polar} Axis yScale or itself for method chaining.
 */
anychart.core.grids.Polar.prototype.yScale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.yScale_ != opt_value) {
      this.yScale_ = opt_value;
      this.yScale_.listenSignals(this.yScaleInvalidated_, this);
      this.invalidate(anychart.ConsistencyState.POSITION | anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.yScale_;
  }
};


/**
 * Internal yScale invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.grids.Polar.prototype.yScaleInvalidated_ = function(event) {
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION))
    signal |= anychart.Signal.NEEDS_RECALCULATION;
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION))
    signal |= anychart.Signal.NEEDS_REDRAW;

  signal |= anychart.Signal.BOUNDS_CHANGED;

  var state = anychart.ConsistencyState.BOUNDS |
      anychart.ConsistencyState.APPEARANCE;

  this.invalidate(state, signal);
};


/**
 * Getter for axis xScale.
 * @return {anychart.scales.Base} Axis xScale.
 *//**
 * Setter for axis xScale.
 * @param {anychart.scales.Base=} opt_value Value to set.
 * @return {!anychart.core.grids.Polar} {@link anychart.core.grids.Polar} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {anychart.scales.Base=} opt_value Scale.
 * @return {anychart.scales.Base|anychart.core.grids.Polar} Axis xScale or itself for method chaining.
 */
anychart.core.grids.Polar.prototype.xScale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.xScale_ != opt_value) {
      this.xScale_ = opt_value;
      this.xScale_.listenSignals(this.xScaleInvalidated_, this);
      this.invalidate(anychart.ConsistencyState.POSITION | anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.xScale_;
  }
};


/**
 * Internal xScale invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.core.grids.Polar.prototype.xScaleInvalidated_ = function(event) {
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_RECALCULATION))
    signal |= anychart.Signal.NEEDS_RECALCULATION;
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION))
    signal |= anychart.Signal.NEEDS_REDRAW;

  signal |= anychart.Signal.BOUNDS_CHANGED;

  var state = anychart.ConsistencyState.BOUNDS |
      anychart.ConsistencyState.APPEARANCE;

  this.invalidate(state, signal);
};


//----------------------------------------------------------------------------------------------------------------------
//  Settings.
//----------------------------------------------------------------------------------------------------------------------
/**
 * Get/set grid odd fill settings.
 * @param {string|acgraph.vector.Fill=} opt_value Grid odd fill settings.
 * @return {string|acgraph.vector.Fill|anychart.core.grids.Polar} Grid odd fill settings or Grid instance for method chaining.
 */
anychart.core.grids.Polar.prototype.oddFill = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.oddFill_ != opt_value) {
      this.oddFill_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.oddFill_;
  }
};


/**
 * Get/set grid even fill settings.
 * @param {string|acgraph.vector.Fill=} opt_value Grid even fill settings.
 * @return {string|acgraph.vector.Fill|anychart.core.grids.Polar} Grid even fill settings or Grid instance for method chaining.
 */
anychart.core.grids.Polar.prototype.evenFill = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.evenFill_ != opt_value) {
      this.evenFill_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.evenFill_;
  }
};


/**
 * @param {(string|number)=} opt_value .
 * @return {(string|number|anychart.core.grids.Polar)} .
 */
anychart.core.grids.Polar.prototype.startAngle = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = goog.math.standardAngle((goog.isNull(opt_value) || isNaN(+opt_value)) ? 0 : +opt_value);
    if (this.startAngle_ != opt_value) {
      this.startAngle_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.startAngle_;
  }
};


/**
 * Get/set grid stroke line.
 * @param {string|acgraph.vector.Stroke=} opt_value Grid stroke line settings.
 * @return {string|acgraph.vector.Stroke|anychart.core.grids.Polar} Grid stroke line settings or Grid instance for method chaining.
 */
anychart.core.grids.Polar.prototype.stroke = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.stroke_ != opt_value) {
      this.stroke_ = opt_value;
      this.invalidate(anychart.ConsistencyState.BOUNDS, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.stroke_;
  }
};


/**
 * Whether to draw the last line.
 * @param {boolean=} opt_value Whether grid should draw last line.
 * @return {boolean|anychart.core.grids.Polar} Whether grid should draw first line or Grid instance for method chaining.
 */
anychart.core.grids.Polar.prototype.drawLastLine = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.drawLastLine_ != opt_value) {
      this.drawLastLine_ = opt_value;
      this.invalidate(anychart.ConsistencyState.POSITION,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.drawLastLine_;
  }
};


/**
 * Whether it is a minor grid or not.
 * @param {boolean=} opt_value Minor or not.
 * @return {boolean|anychart.core.grids.Polar} Is minor grid or Grid instance for method chaining.
 */
anychart.core.grids.Polar.prototype.isMinor = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.isMinor_ != opt_value) {
      this.isMinor_ = opt_value;
      this.invalidate(anychart.ConsistencyState.POSITION | anychart.ConsistencyState.APPEARANCE,
          anychart.Signal.NEEDS_REDRAW | anychart.Signal.BOUNDS_CHANGED);
    }
    return this;
  } else {
    return this.isMinor_;
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Line drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Draw horizontal line.
 * @param {number} ratio Scale ratio to draw grid line.
 * @protected
 */
anychart.core.grids.Polar.prototype.drawLineCircuit = function(ratio) {
  var radius = this.radius_ * ratio;
  this.lineElement_.circularArc(this.cx_, this.cy_, radius, radius, 0, 360);
};


/**
 * Draw vertical line.
 * @param {number} x .
 * @param {number} y .
 * @param {number} xPixelShift .
 * @param {number} yPixelShift .
 * @protected
 */
anychart.core.grids.Polar.prototype.drawLineRadial = function(x, y, xPixelShift, yPixelShift) {
  this.lineElement_.moveTo(x + xPixelShift, y + yPixelShift);
  this.lineElement_.lineTo(this.cx_ + xPixelShift, this.cy_ + yPixelShift);
};


/**
 * Whether marker is radial
 * @return {boolean} If the marker is horizontal.
 */
anychart.core.grids.Polar.prototype.isRadial = function() {
  return this.layout_ == anychart.enums.RadialGridLayout.RADIAL;
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Interlaced drawing.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Draw radial line.
 * @param {number} ratio Scale ratio to draw grid interlace.
 * @param {number} prevRatio Previous yScale ratio to draw grid interlace.
 * @param {anychart.core.utils.TypedLayer} layer Layer to draw interlace.
 * @protected
 */
anychart.core.grids.Polar.prototype.drawInterlaceCircuit = function(ratio, prevRatio, layer) {
  if (!isNaN(prevRatio)) {
    var x, y, angleRad, radius;
    var element = layer.genNextChild();

    radius = this.radius_ * ratio;
    angleRad = goog.math.toRadians(0);
    x = Math.round(this.cx_ + radius * Math.cos(angleRad));
    y = Math.round(this.cy_ + radius * Math.sin(angleRad));
    element.moveTo(x, y);

    element.circularArc(this.cx_, this.cy_, radius, radius, 0, 360);

    radius = this.radius_ * prevRatio;
    angleRad = goog.math.toRadians(360);
    x = Math.round(this.cx_ + radius * Math.cos(angleRad));
    y = Math.round(this.cy_ + radius * Math.sin(angleRad));
    element.lineTo(x, y);

    element.circularArc(this.cx_, this.cy_, radius, radius, 360, -360);

    element.close();
  }
};


/**
 * Draw angle line.
 * @param {number} angle .
 * @param {number} sweep .
 * @param {number} x .
 * @param {number} y .
 * @param {number} prevX .
 * @param {number} prevY .
 * @param {anychart.core.utils.TypedLayer} layer Layer to draw interlace.
 * @protected
 */
anychart.core.grids.Polar.prototype.drawInterlaceRadial = function(angle, sweep, x, y, prevX, prevY, layer) {
  if (!(isNaN(prevX) && isNaN(prevY))) {

    var element = layer.genNextChild();

    element.circularArc(this.cx_, this.cy_, this.radius_, this.radius_, angle, -sweep);
    element.lineTo(this.cx_, this.cy_);
    element.close();
  }
};


//----------------------------------------------------------------------------------------------------------------------
//  Drawing.
//----------------------------------------------------------------------------------------------------------------------
/**
 * Drawing.
 * @return {anychart.core.grids.Polar} An instance of {@link anychart.core.grids.Polar} class for method chaining.
 */
anychart.core.grids.Polar.prototype.draw = function() {
  var xScale = /** @type {anychart.scales.ScatterBase} */(this.xScale());
  var yScale = /** @type {anychart.scales.ScatterBase|anychart.scales.Ordinal} */(this.yScale());

  if (!xScale) {
    anychart.utils.error(anychart.enums.ErrorCode.SCALE_NOT_SET);
    return this;
  }

  if (!this.isRadial() && !yScale) {
    anychart.utils.error(anychart.enums.ErrorCode.SCALE_NOT_SET);
    return this;
  }

  if (!this.checkDrawingNeeded())
    return this;

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    var zIndex = /** @type {number} */(this.zIndex());
    this.evenFillElement().zIndex(zIndex);
    this.oddFillElement().zIndex(zIndex);
    this.lineElement().zIndex(zIndex);
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.evenFillElement().parent(container);
    this.oddFillElement().parent(container);
    this.lineElement().parent(container);
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.POSITION) ||
      this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {

    var layout;
    if (this.isRadial()) {
      layout = [this.drawLineRadial, this.drawInterlaceRadial];
    } else {
      layout = [this.drawLineCircuit, this.drawInterlaceCircuit];
    }

    this.evenFillElement().clear();
    this.oddFillElement().clear();
    this.lineElement().clear();

    var fill, isOrdinal, ticks, ticksArray, ticksArrLen;
    /** @type {anychart.core.utils.TypedLayer} */
    var layer;

    var parentBounds = /** @type {anychart.math.Rect} */(this.parentBounds());
    this.radius_ = Math.min(parentBounds.width, parentBounds.height) / 2;
    this.cx_ = Math.round(parentBounds.left + parentBounds.width / 2);
    this.cy_ = Math.round(parentBounds.top + parentBounds.height / 2);

    var angle = goog.math.standardAngle(this.startAngle() - 90);
    this.evenFillElement().clip(parentBounds);
    this.oddFillElement().clip(parentBounds);
    this.lineElement().clip(parentBounds);

    var drawLine = layout[0];
    var drawInterlace = layout[1];
    var i;

    if (this.isRadial()) {
      ticks = this.isMinor() ? xScale.minorTicks() : xScale.ticks();
      ticksArray = ticks.get();
      ticksArrLen = ticksArray.length - 1;

      var sweep = 360 / ticksArrLen;
      var angleRad, x, y, prevX = NaN, prevY = NaN;

      var lineThickness = this.stroke()['thickness'] ? this.stroke()['thickness'] : 1;
      var xPixelShift, yPixelShift;
      for (i = 0; i < ticksArrLen; i++) {
        angleRad = angle * Math.PI / 180;

        xPixelShift = 0;
        yPixelShift = 0;
        if (angle == 0) {
          yPixelShift = lineThickness % 2 == 0 ? 0 : -.5;
        } else if (angle == 90) {
          xPixelShift = lineThickness % 2 == 0 ? 0 : -.5;
        } else if (angle == 180) {
          yPixelShift = lineThickness % 2 == 0 ? 0 : .5;
        } else if (angle == 270) {
          xPixelShift = lineThickness % 2 == 0 ? 0 : .5;
        }

        x = Math.round(this.cx_ + this.radius_ * Math.cos(angleRad));
        y = Math.round(this.cy_ + this.radius_ * Math.sin(angleRad));
        layer = i % 2 == 0 ? this.evenFillElement_ : this.oddFillElement_;

        drawInterlace.call(this, angle, sweep, x, y, prevX, prevY, layer);
        if (i == 0) {
          if (this.drawLastLine_) drawLine.call(this, x, y, xPixelShift, yPixelShift);
        } else
          drawLine.call(this, x, y, xPixelShift, yPixelShift);

        prevX = x;
        prevY = y;
        angle = goog.math.standardAngle(angle + sweep);
      }

      //draw last line on ordinal
      layer = i % 2 == 0 ? this.evenFillElement_ : this.oddFillElement_;
      angleRad = angle * Math.PI / 180;
      x = Math.round(this.cx_ + this.radius_ * Math.cos(angleRad));
      y = Math.round(this.cy_ + this.radius_ * Math.sin(angleRad));
      drawInterlace.call(this, angle, sweep, x, y, prevX, prevY, layer);
    } else {
      isOrdinal = yScale instanceof anychart.scales.Ordinal;
      ticks = isOrdinal ? yScale.ticks() : this.isMinor() ? yScale.minorTicks() : yScale.ticks();
      ticksArray = ticks.get();
      ticksArrLen = ticksArray.length;

      var prevRatio = NaN;
      for (i = 0; i < ticksArrLen; i++) {
        var tickVal = ticksArray[i];
        var leftTick, rightTick;
        if (goog.isArray(tickVal)) {
          leftTick = tickVal[0];
          rightTick = tickVal[1];
        } else
          leftTick = rightTick = tickVal;


        var ratio = yScale.transform(leftTick);
        layer = i % 2 == 0 ? this.evenFillElement_ : this.oddFillElement_;

        drawInterlace.call(this, ratio, prevRatio, layer);

        if (i == ticksArrLen - 1) {
          if (isOrdinal) {
            drawLine.call(this, ratio);
            if (this.drawLastLine_) drawLine.call(this, yScale.transform(rightTick, 1));
          } else {
            if (this.drawLastLine_) drawLine.call(this, ratio);
          }
        } else if (i != 0) {
          drawLine.call(this, ratio);
        }
        prevRatio = ratio;
      }
    }

    this.markConsistent(anychart.ConsistencyState.POSITION);
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.lineElement().stroke(/** @type {acgraph.vector.Stroke} */(this.stroke()));
    this.oddFillElement().forEachChild(function(child) {
      child.fill(this.oddFill());
    }, this);

    this.evenFillElement().forEachChild(function(child) {
      child.fill(this.evenFill());
    }, this);
    this.markConsistent(anychart.ConsistencyState.APPEARANCE);
  }

  return this;
};


//----------------------------------------------------------------------------------------------------------------------
//  Disabling & enabling.
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.grids.Polar.prototype.remove = function() {
  this.evenFillElement().parent(null);
  this.oddFillElement().parent(null);
  this.lineElement().parent(null);
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Elements creation.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @return {!acgraph.vector.Path} Grid line element.
 */
anychart.core.grids.Polar.prototype.lineElement = function() {
  this.lineElement_ = this.lineElement_ ? this.lineElement_ : acgraph.path();
  this.registerDisposable(this.lineElement_);
  return this.lineElement_;
};


/**
 * @return {!anychart.core.utils.TypedLayer} Grid odd fill element.
 * @protected
 */
anychart.core.grids.Polar.prototype.oddFillElement = function() {
  this.oddFillElement_ = this.oddFillElement_ ?
      this.oddFillElement_ :
      new anychart.core.utils.TypedLayer(function() {
        var path = acgraph.path();
        path.stroke('none');
        path.zIndex(this.zIndex_);
        return path;
      }, function(child) {
        child.clear();
      }, undefined, this);
  this.registerDisposable(this.oddFillElement_);

  return this.oddFillElement_;
};


/**
 * @return {!anychart.core.utils.TypedLayer} Grid event fill element.
 * @protected
 */
anychart.core.grids.Polar.prototype.evenFillElement = function() {
  this.evenFillElement_ = this.evenFillElement_ ?
      this.evenFillElement_ :
      new anychart.core.utils.TypedLayer(function() {
        var path = acgraph.path();
        path.stroke('none');
        path.zIndex(this.zIndex_);
        return path;
      }, function(child) {
        child.clear();
      }, undefined, this);
  this.registerDisposable(this.evenFillElement_);

  return this.evenFillElement_;
};


//----------------------------------------------------------------------------------------------------------------------
//  Serialize & Deserialize
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.grids.Polar.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['isMinor'] = this.isMinor();
  json['layout'] = this.layout();
  json['drawLastLine'] = this.drawLastLine();
  //json['startAngle'] = this.startAngle();
  json['oddFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.oddFill()));
  json['evenFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill} */(this.evenFill()));
  json['stroke'] = anychart.color.serialize(/** @type {acgraph.vector.Stroke} */(this.stroke()));
  return json;
};


/** @inheritDoc */
anychart.core.grids.Polar.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.isMinor(config['isMinor']);
  this.layout(config['layout']);
  this.drawLastLine(config['drawLastLine']);
  //this.startAngle(config['startAngle']);
  this.oddFill(config['oddFill']);
  this.evenFill(config['evenFill']);
  this.stroke(config['stroke']);
};


//----------------------------------------------------------------------------------------------------------------------
//  Disposing.
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.core.grids.Polar.prototype.disposeInternal = function() {
  delete this.stroke_;
  goog.base(this, 'disposeInternal');
};


//anychart.core.grids.Polar.prototype['startAngle'] = anychart.core.grids.Polar.prototype.startAngle;
//exports
anychart.core.grids.Polar.prototype['isMinor'] = anychart.core.grids.Polar.prototype.isMinor;
anychart.core.grids.Polar.prototype['oddFill'] = anychart.core.grids.Polar.prototype.oddFill;
anychart.core.grids.Polar.prototype['evenFill'] = anychart.core.grids.Polar.prototype.evenFill;
anychart.core.grids.Polar.prototype['layout'] = anychart.core.grids.Polar.prototype.layout;
anychart.core.grids.Polar.prototype['isRadial'] = anychart.core.grids.Polar.prototype.isRadial;
anychart.core.grids.Polar.prototype['yScale'] = anychart.core.grids.Polar.prototype.yScale;
anychart.core.grids.Polar.prototype['xScale'] = anychart.core.grids.Polar.prototype.xScale;
anychart.core.grids.Polar.prototype['stroke'] = anychart.core.grids.Polar.prototype.stroke;
anychart.core.grids.Polar.prototype['drawLastLine'] = anychart.core.grids.Polar.prototype.drawLastLine;
