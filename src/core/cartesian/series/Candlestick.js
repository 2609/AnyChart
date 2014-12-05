goog.provide('anychart.core.cartesian.series.Candlestick');
goog.require('acgraph');
goog.require('anychart.core.cartesian.series.OHLC');



/**
 * Define Candlestick series type.<br/>
 * <b>Note:</b> Better for use methods {@link anychart.charts.Cartesian#candlestick}.
 * @param {!(anychart.data.View|anychart.data.Set|Array|string)} data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.core.cartesian.series.OHLC}
 */
anychart.core.cartesian.series.Candlestick = function(data, opt_csvSettings) {
  goog.base(this, data, opt_csvSettings);
};
goog.inherits(anychart.core.cartesian.series.Candlestick, anychart.core.cartesian.series.OHLC);
anychart.core.cartesian.series.Base.SeriesTypesMap[anychart.enums.CartesianSeriesType.CANDLESTICK] = anychart.core.cartesian.series.Candlestick;


/**
 * @type {(acgraph.vector.Fill|Function|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.risingFill_ = (function() {
  return anychart.color.lighten(this['sourceColor']);
});


/**
 * @type {(acgraph.vector.Fill|Function|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverRisingFill_ = (function() {
  return anychart.color.lighten(anychart.color.lighten(this['sourceColor']));
});


/**
 * @type {(acgraph.vector.Fill|Function|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.fallingFill_ = (function() {
  return anychart.color.darken(this['sourceColor']);
});


/**
 * @type {(acgraph.vector.Fill|Function|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverFallingFill_ = (function() {
  return anychart.color.darken(anychart.color.darken(this['sourceColor']));
});


/**
 * @type {(acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.risingHatchFill_ = null;


/**
 * @type {(acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverRisingHatchFill_;


/**
 * @type {(acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.fallingHatchFill_ = null;


/**
 * @type {(acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|null)}
 * @private
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverFallingHatchFill_;


/** @inheritDoc */
anychart.core.cartesian.series.Candlestick.prototype.drawSubsequentPoint = function() {
  var referenceValues = this.getReferenceCoords();
  if (!referenceValues)
    return false;

  var iterator;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {

    var x = referenceValues[0];
    var open = referenceValues[1];
    var high = referenceValues[2];
    var low = referenceValues[3];
    var close = referenceValues[4];

    iterator = this.getIterator();

    var rising = Number(iterator.get('open')) < Number(iterator.get('close'));

    /** @type {!acgraph.vector.Path} */
    var path = /** @type {!acgraph.vector.Path} */(this.rootElement.genNextChild());
    var widthHalf = this.getPointWidth() / 2;

    iterator
        .meta('x', x)
        .meta('open', open)
        .meta('high', high)
        .meta('low', low)
        .meta('close', close)
        .meta('rising', rising)
        .meta('shape', path);

    path.clear()
        .moveTo(x, high)
        .lineTo(x, rising ? close : open)
        .moveTo(x - widthHalf, open)
        .lineTo(x + widthHalf, open)
        .lineTo(x + widthHalf, close)
        .lineTo(x - widthHalf, close)
        .lineTo(x - widthHalf, open)
        .moveTo(x, low)
        .lineTo(x, rising ? open : close);


    this.colorizeShape(false);

    this.makeHoverable(path);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.HATCH_FILL)) {
    iterator = this.getIterator();
    var hatchFillShape = this.hatchFillRootElement ?
        /** @type {!acgraph.vector.Rect} */(this.hatchFillRootElement.genNextChild()) :
        null;
    iterator.meta('hatchFillShape', hatchFillShape);
    var shape = /** @type {acgraph.vector.Shape} */(iterator.meta('shape'));
    if (goog.isDef(shape) && hatchFillShape) {
      hatchFillShape.deserialize(shape.serialize());
    }
    this.applyHatchFill(false);
  }

  return true;
};


/**
 * Colorizes shape in accordance to current point colorization settings.
 * Shape is get from current meta 'shape'.
 * @param {boolean} hover If the point is hovered.
 * @protected
 */
anychart.core.cartesian.series.Candlestick.prototype.colorizeShape = function(hover) {
  var shape = /** @type {acgraph.vector.Shape} */(this.getIterator().meta('shape'));
  if (goog.isDef(shape)) {
    var stroke, fill;
    if (!!this.getIterator().meta('rising')) {
      fill = this.getFinalRisingFill(hover);
      stroke = this.getFinalRisingStroke(hover);
    } else {
      fill = this.getFinalFallingFill(hover);
      stroke = this.getFinalFallingStroke(hover);
    }

    var lineCap = stroke && stroke['dash'] && !anychart.utils.isNone(stroke['dash']) ?
        acgraph.vector.StrokeLineCap.BUTT :
        acgraph.vector.StrokeLineCap.ROUND;

    shape.stroke(stroke, 2, 'none', acgraph.vector.StrokeLineJoin.MITER, lineCap);
    shape.fill(fill);
  }
};


/**
 * Apply hatch fill to shape in accordance to current point colorization settings.
 * Shape is get from current meta 'hatchFillShape'.
 * @param {boolean} hover If the point is hovered.
 * @protected
 */
anychart.core.cartesian.series.Candlestick.prototype.applyHatchFill = function(hover) {
  var hatchFillShape = /** @type {acgraph.vector.Shape} */(this.getIterator().meta('hatchFillShape'));
  if (goog.isDefAndNotNull(hatchFillShape)) {
    var fill;
    if (!!this.getIterator().meta('rising')) {
      fill = this.getFinalRisingHatchFill(hover);
    } else {
      fill = this.getFinalFallingHatchFill(hover);
    }

    hatchFillShape
        .stroke(null)
        .fill(fill);
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Coloring settings
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingHatchFill('diamiond', 'grey', 5, 5)
 *  .container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.core.cartesian.series.Base|Function|boolean} Hatch fill.
 */
anychart.core.cartesian.series.Candlestick.prototype.risingHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.risingHatchFill_) {
      this.risingHatchFill_ = hatchFill;
      this.invalidate(anychart.ConsistencyState.HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.risingHatchFill_;
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingHatchFill('diamiond', 'grey', 5, 5)
 *  .container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.core.cartesian.series.Base|Function|boolean} Hatch fill.
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverRisingHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (this.hoverRisingHatchFill_ != hatchFill)
      this.hoverRisingHatchFill_ = hatchFill;

    return this;
  }
  return this.hoverRisingHatchFill_;
};


/**
 * Method to get final rising hatch fill, with all fallbacks taken into account.
 * @param {boolean} hover If the hatch fill should be a hover hatch fill.
 * @return {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} Final rising hatch fill for the current row.
 */
anychart.core.cartesian.series.Candlestick.prototype.getFinalRisingHatchFill = function(hover) {
  var iterator = this.getIterator();

  var normalHatchFill;
  if (goog.isDef(iterator.get('risingHatchFill'))) {
    normalHatchFill = iterator.get('risingHatchFill');
  } else {
    normalHatchFill = this.risingHatchFill();
  }

  var hatchFill;
  if (hover) {
    if (goog.isDef(iterator.get('hoverRisingHatchFill'))) {
      hatchFill = iterator.get('hoverRisingHatchFill');
    } else if (goog.isDef(this.hoverRisingHatchFill())) {
      hatchFill = this.hoverRisingHatchFill();
    } else {
      hatchFill = normalHatchFill;
    }
  } else {
    hatchFill = normalHatchFill;
  }
  return /** @type {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} */(
      this.normalizeHatchFill(
          /** @type {acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|string} */(hatchFill)));
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingHatchFill('diamiond', 'grey', 5, 5)
 *  .container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.core.cartesian.series.Base|Function|boolean} Hatch fill.
 */
anychart.core.cartesian.series.Candlestick.prototype.fallingHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill != this.fallingHatchFill_) {
      this.fallingHatchFill_ = hatchFill;
      this.invalidate(anychart.ConsistencyState.HATCH_FILL, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.fallingHatchFill_;
};


/**
 * Getter for current hatch fill settings.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function} Current hatch fill.
 *//**
 * Setter for hatch fill settings.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_HatchFill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingHatchFill('diamiond', 'grey', 5, 5)
 *  .container(stage).draw();
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string)=} opt_patternFillOrType PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.PatternFill|acgraph.vector.HatchFill|Function|acgraph.vector.HatchFill.HatchFillType|
 * string|boolean)=} opt_patternFillOrTypeOrState PatternFill or HatchFill instance or type of hatch fill.
 * @param {string=} opt_color Color.
 * @param {number=} opt_thickness Thickness.
 * @param {number=} opt_size Pattern size.
 * @return {acgraph.vector.PatternFill|acgraph.vector.HatchFill|anychart.core.cartesian.series.Base|Function|boolean} Hatch fill.
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverFallingHatchFill = function(opt_patternFillOrTypeOrState, opt_color, opt_thickness, opt_size) {
  if (goog.isDef(opt_patternFillOrTypeOrState)) {
    var hatchFill = goog.isFunction(opt_patternFillOrTypeOrState) || goog.isBoolean(opt_patternFillOrTypeOrState) ?
        opt_patternFillOrTypeOrState :
        acgraph.vector.normalizeHatchFill.apply(null, arguments);

    if (hatchFill !== this.hoverFallingHatchFill_)
      this.hoverFallingHatchFill_ = hatchFill;

    return this;
  }
  return this.hoverFallingHatchFill_;
};


/**
 * Method to get final falling hatch fill, with all fallbacks taken into account.
 * @param {boolean} hover If the hatch fill should be a hover hatch fill.
 * @return {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} Final falling hatch fill for the current row.
 */
anychart.core.cartesian.series.Candlestick.prototype.getFinalFallingHatchFill = function(hover) {
  var iterator = this.getIterator();

  var normalHatchFill;
  if (goog.isDef(iterator.get('fallingHatchFill'))) {
    normalHatchFill = iterator.get('fallingHatchFill');
  } else {
    normalHatchFill = this.fallingHatchFill();
  }

  var hatchFill;
  if (hover) {
    if (goog.isDef(iterator.get('hoverFallingHatchFill'))) {
      hatchFill = iterator.get('hoverFallingHatchFill');
    } else if (goog.isDef(this.hoverFallingHatchFill())) {
      hatchFill = this.hoverFallingHatchFill();
    } else {
      hatchFill = normalHatchFill;
    }
  } else {
    hatchFill = normalHatchFill;
  }
  return /** @type {!(acgraph.vector.HatchFill|acgraph.vector.PatternFill)} */(
      this.normalizeHatchFill(
          /** @type {acgraph.vector.HatchFill|acgraph.vector.PatternFill|Function|boolean|string} */(hatchFill)));
};


/**
 * Getter for current series fill color.
 * @return {!acgraph.vector.Fill} Current fill color.
 *//**
 * Sets fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingFill(['green', 'yellow'])
 *  .container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingFill('green', 0.4)
 *  .container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingFill(['black', 'yellow'], 45, true, 0.5)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .risingFill({
 *      src: 'http://static.anychart.com/underwater.jpg',
 *      mode: acgraph.vector.ImageFillMode.STRETCH
 *    })
 *  .container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.core.cartesian.series.Base|Function} .
 */
anychart.core.cartesian.series.Candlestick.prototype.risingFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy,
    opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.risingFill_) {
      this.risingFill_ = fill;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.risingFill_;
};


/**
 * Getter for current series fill color.
 * @return {!acgraph.vector.Fill} Current fill color.
 *//**
 * Sets fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingFill(['green', 'yellow'])
 *  .container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingFill('green', 0.4)
 *  .container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingFill(['black', 'yellow'], 45, true, 0.5)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverRisingFill({
 *      src: 'http://static.anychart.com/underwater.jpg',
 *      mode: acgraph.vector.ImageFillMode.STRETCH
 *    })
 *  .container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.core.cartesian.series.Base|Function} .
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverRisingFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy, opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    this.hoverRisingFill_ = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    // TODO: We don't set anything cause everything is fine?
    return this;
  }
  return this.hoverRisingFill_;
};


/**
 * Method to get final stroke, with all fallbacks taken into account.
 * @param {boolean} hover If the stroke should be a hover stroke.
 * @return {!acgraph.vector.Fill} Final hover stroke for the current row.
 * @protected
 */
anychart.core.cartesian.series.Candlestick.prototype.getFinalRisingFill = function(hover) {
  var iterator = this.getIterator();
  var normalColor = /** @type {acgraph.vector.Fill|Function} */(
      iterator.get('risingFill') ||
      this.risingFill());
  return /** @type {!acgraph.vector.Fill} */(hover ?
      this.normalizeColor(
          /** @type {acgraph.vector.Fill|Function} */(
              iterator.get('hoverRisingFill') ||
              this.hoverRisingFill() ||
              normalColor),
          normalColor) :
      this.normalizeColor(normalColor));
};


/**
 * Getter for current series fill color.
 * @return {!acgraph.vector.Fill} Current fill color.
 *//**
 * Sets fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingFill(['green', 'yellow'])
 *  .container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingFill('green', 0.4)
 *  .container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingFill(['black', 'yellow'], 45, true, 0.5)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .fallingFill({
 *      src: 'http://static.anychart.com/underwater.jpg',
 *      mode: acgraph.vector.ImageFillMode.STRETCH
 *    })
 *  .container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.core.cartesian.series.Base|Function} .
 */
anychart.core.cartesian.series.Candlestick.prototype.fallingFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy,
    opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    var fill = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    if (fill != this.fallingFill_) {
      this.fallingFill_ = fill;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.fallingFill_;
};


/**
 * Getter for current series fill color.
 * @return {!acgraph.vector.Fill} Current fill color.
 *//**
 * Sets fill settings using an object or a string.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingFill(['green', 'yellow'])
 *  .container(stage).draw();
 * @param {acgraph.vector.Fill} value [null] Color as an object or a string.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Fill color with opacity.<br/>
 * <b>Note:</b> If color is set as a string (e.g. 'red .5') it has a priority over opt_opacity, which
 * means: <b>color</b> set like this <b>rect.fill('red 0.3', 0.7)</b> will have 0.3 opacity.
 * @shortDescription Fill as a string or an object.
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingFill('green', 0.4)
 *  .container(stage).draw();
 * @param {string} color Color as a string.
 * @param {number=} opt_opacity Color opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Linear gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingFill(['black', 'yellow'], 45, true, 0.5)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Gradient keys.
 * @param {number=} opt_angle Gradient angle.
 * @param {(boolean|!acgraph.vector.Rect|!{left:number,top:number,width:number,height:number})=} opt_mode Gradient mode.
 * @param {number=} opt_opacity Gradient opacity.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Radial gradient fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingFill(['black', 'yellow'], .5, .5, null, .9, 0.3, 0.81)
 *  .container(stage).draw();
 * @param {!Array.<(acgraph.vector.GradientKey|string)>} keys Color-stop gradient keys.
 * @param {number} cx X ratio of center radial gradient.
 * @param {number} cy Y ratio of center radial gradient.
 * @param {acgraph.math.Rect=} opt_mode If defined then userSpaceOnUse mode, else objectBoundingBox.
 * @param {number=} opt_opacity Opacity of the gradient.
 * @param {number=} opt_fx X ratio of focal point.
 * @param {number=} opt_fy Y ratio of focal point.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * Image fill.<br/>
 * Learn more about coloring at:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Fill}
 * @example
 * anychart.core.cartesian.series.candlestick([
 *   [0, 2, 4, 1, 3],
 *   [1, 3, 5, 1, 2],
 *   [2, 2, 5, 1, 4]
 *  ])
 *  .hoverFallingFill({
 *      src: 'http://static.anychart.com/underwater.jpg',
 *      mode: acgraph.vector.ImageFillMode.STRETCH
 *    })
 *  .container(stage).draw();
 * @param {!acgraph.vector.Fill} imageSettings Object with settings.
 * @return {!anychart.core.cartesian.series.Base} {@link anychart.core.cartesian.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(!acgraph.vector.Fill|!Array.<(acgraph.vector.GradientKey|string)>|Function|null)=} opt_fillOrColorOrKeys .
 * @param {number=} opt_opacityOrAngleOrCx .
 * @param {(number|boolean|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number})=} opt_modeOrCy .
 * @param {(number|!acgraph.math.Rect|!{left:number,top:number,width:number,height:number}|null)=} opt_opacityOrMode .
 * @param {number=} opt_opacity .
 * @param {number=} opt_fx .
 * @param {number=} opt_fy .
 * @return {acgraph.vector.Fill|anychart.core.cartesian.series.Base|Function} .
 */
anychart.core.cartesian.series.Candlestick.prototype.hoverFallingFill = function(opt_fillOrColorOrKeys, opt_opacityOrAngleOrCx, opt_modeOrCy,
    opt_opacityOrMode, opt_opacity, opt_fx, opt_fy) {
  if (goog.isDef(opt_fillOrColorOrKeys)) {
    this.hoverFallingFill_ = goog.isFunction(opt_fillOrColorOrKeys) ?
        opt_fillOrColorOrKeys :
        acgraph.vector.normalizeFill.apply(null, arguments);
    // TODO: We don't set anything cause everything is fine?
    return this;
  }
  return this.hoverFallingFill_;
};


/**
 * Method to get final rising point stroke, with all fallbacks taken into account.
 * @param {boolean} hover If the stroke should be a hover stroke.
 * @return {!acgraph.vector.Fill} Final hover stroke for the current row.
 * @protected
 */
anychart.core.cartesian.series.Candlestick.prototype.getFinalFallingFill = function(hover) {
  var iterator = this.getIterator();
  var normalColor = /** @type {acgraph.vector.Fill|Function} */(
      iterator.get('fallingFill') ||
      this.fallingFill());
  return /** @type {!acgraph.vector.Fill} */(hover ?
      this.normalizeColor(
          /** @type {acgraph.vector.Fill|Function} */(
              iterator.get('hoverFallingFill') ||
              this.hoverFallingFill() ||
              normalColor),
          normalColor) :
      this.normalizeColor(normalColor));
};


/**
 * @inheritDoc
 */
anychart.core.cartesian.series.Candlestick.prototype.getType = function() {
  return anychart.enums.CartesianSeriesType.CANDLESTICK;
};


/**
 * @inheritDoc
 */
anychart.core.cartesian.series.Candlestick.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  if (goog.isFunction(this.risingFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series risingFill']
    );
  } else {
    json['risingFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.risingFill()));
  }

  if (goog.isFunction(this.hoverRisingFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series hoverRisingFill']
    );
  } else {
    json['hoverRisingFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hoverRisingFill()));
  }


  if (goog.isFunction(this.fallingFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series fallingFill']
    );
  } else {
    json['fallingFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.fallingFill()));
  }

  if (goog.isFunction(this.hoverFallingFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series hoverFallingFill']
    );
  } else {
    json['hoverFallingFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hoverFallingFill()));
  }


  if (goog.isFunction(this.fallingHatchFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series fallingHatchFill']
    );
  } else {
    json['fallingHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.fallingHatchFill()));
  }

  if (goog.isFunction(this.hoverFallingHatchFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series hoverFallingHatchFill']
    );
  } else {
    json['hoverFallingHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hoverFallingHatchFill()));
  }


  if (goog.isFunction(this.risingHatchFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series risingHatchFill']
    );
  } else {
    json['risingHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.risingHatchFill()));
  }

  if (goog.isFunction(this.hoverRisingHatchFill())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Candlestick Series hoverRisingHatchFill']
    );
  } else {
    json['hoverRisingHatchFill'] = anychart.color.serialize(/** @type {acgraph.vector.Fill}*/(this.hoverRisingHatchFill()));
  }

  return json;
};


/**
 * @inheritDoc
 */
anychart.core.cartesian.series.Candlestick.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.risingFill(config['risingFill']);
  this.hoverRisingFill(config['hoverRisingFill']);
  this.fallingFill(config['fallingFill']);
  this.hoverFallingFill(config['hoverFallingFill']);
  this.risingHatchFill(config['risingHatchFill']);
  this.hoverRisingHatchFill(config['hoverRisingHatchFill']);
  this.fallingHatchFill(config['fallingHatchFill']);
  this.hoverFallingHatchFill(config['hoverFallingHatchFill']);
};


//exports
anychart.core.cartesian.series.Candlestick.prototype['risingFill'] = anychart.core.cartesian.series.Candlestick.prototype.risingFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['hoverRisingFill'] = anychart.core.cartesian.series.Candlestick.prototype.hoverRisingFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['fallingFill'] = anychart.core.cartesian.series.Candlestick.prototype.fallingFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['hoverFallingFill'] = anychart.core.cartesian.series.Candlestick.prototype.hoverFallingFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['risingHatchFill'] = anychart.core.cartesian.series.Candlestick.prototype.risingHatchFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['hoverRisingHatchFill'] = anychart.core.cartesian.series.Candlestick.prototype.hoverRisingHatchFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['fallingHatchFill'] = anychart.core.cartesian.series.Candlestick.prototype.fallingHatchFill;//doc|ex
anychart.core.cartesian.series.Candlestick.prototype['hoverFallingHatchFill'] = anychart.core.cartesian.series.Candlestick.prototype.hoverFallingHatchFill;//doc|ex
