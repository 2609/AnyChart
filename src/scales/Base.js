goog.provide('anychart.scales.Base');
goog.require('anychart.Base');
goog.require('anychart.enums');



/**
 * Basic methods for scales.
 * @constructor
 * @extends {anychart.Base}
 */
anychart.scales.Base = function() {
  goog.base(this);

  /**
   * The number of current calculation sessions. Each chart starts a calculation session in its calculate() method and
   * finishes it in its draw() method beginning.
   * @type {number}
   * @private
   */
  this.autoCalcs_ = 0;

  /**
   * If the scale is inverted (rtl or ttb).
   * @type {boolean}
   * @protected
   */
  this.isInverted = false;

  this.applyStacking = anychart.scales.Base.prototype.applyModeNone_;
};
goog.inherits(anychart.scales.Base, anychart.Base);


/**
 * Supported signals mask.
 * @type {number}
 */
anychart.scales.Base.prototype.SUPPORTED_SIGNALS =
    anychart.Signal.NEEDS_REAPPLICATION |
    anychart.Signal.NEEDS_RECALCULATION;


/**
 * @param {*} value Value to transform in input scope.
 * @param {number=} opt_subRangeRatio Sub range ratio.
 * @return {number} Value transformed to [0, 1] scope.
 */
anychart.scales.Base.prototype.transform = goog.abstractMethod;


/**
 * @param {number} ratio Value to transform in input scope.
 * @return {*} Value transformed to output scope.
 */
anychart.scales.Base.prototype.inverseTransform = goog.abstractMethod;


/**
 * Checks if passed value will be treated as missing by this scale.
 * @param {*} value
 * @return {boolean}
 */
anychart.scales.Base.prototype.isMissing = function(value) {
  return anychart.utils.isNaN(value);
};


/**
 * Getter for scale inversion.
 * @return {boolean} Current inversion state.
 *//**
 * Setter for scale inversion. If the scale is <b>inverted</b>, axes and series go upside-down or right-to-left
 * instead of bottom-to-top and left-to-right.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.4, 1.2, 1.6]);
 * chart.yScale().inverted(true);
 * @param {boolean=} opt_value [false] Value to set.
 * @return {!anychart.scales.Base} An instance of {@link anychart.scales.Base} class for method chaining.
 *//**
 * @ignoreDoc
 * Getter and setter for scale inversion.
 * @param {boolean=} opt_value Inverted state to set.
 * @return {(!anychart.scales.Base|boolean)} Inverted state or itself for method chaining.
 */
anychart.scales.Base.prototype.inverted = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = !!opt_value;
    if (this.isInverted != opt_value) {
      this.isInverted = opt_value;
      this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  return this.isInverted;
};


/**
 * Informs scale that an auto range calculation started for the chart, so it should reset its data range on the first
 * call of this method if needed.
 * @return {!anychart.scales.Base} Chaining.
 */
anychart.scales.Base.prototype.startAutoCalc = function() {
  if (!this.autoCalcs_)
    this.resetDataRange();
  this.autoCalcs_++;
  return this;
};


/**
 * Informs the scale that an auto range calculation started for the chart in past was ended.
 * @param {boolean=} opt_silently If this flag is set, do not dispatch an event if reapplication needed.
 * @return {boolean} If the calculation changed the scale and it needs to be reapplied.
 */
anychart.scales.Base.prototype.finishAutoCalc = function(opt_silently) {
  this.autoCalcs_ = Math.max(this.autoCalcs_ - 1, 0);
  if (this.autoCalcs_ == 0) {
    return this.checkScaleChanged(!!opt_silently);
  } else
    return true; // todo: additional stuff when calculating shared scales!
};


/**
 * Checks if previous data range differs from the current, dispatches a REAPPLICATION signal and returns the result.
 * @param {boolean} silently If set, the signal is not dispatched.
 * @return {boolean} If the scale was changed and it needs to be reapplied.
 * @protected
 */
anychart.scales.Base.prototype.checkScaleChanged = goog.abstractMethod;


//region --- Section Internal methods ---
//----------------------------------------------------------------------------------------------------------------------
//
//  Internal methods
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @return {boolean} Returns true if the scale needs input domain calculations.
 */
anychart.scales.Base.prototype.needsAutoCalc = goog.abstractMethod;


/**
 * Extends the scale range.
 * @param {...*} var_args Values that are supposed to extend the input domain.
 * @return {!anychart.scales.Base} Itself for method chaining.
 */
anychart.scales.Base.prototype.extendDataRange = goog.abstractMethod;


/**
 * Resets scale data range if it needs auto calculation.
 * @return {!anychart.scales.Base} Itself for method chaining.
 * @protected
 */
anychart.scales.Base.prototype.resetDataRange = goog.abstractMethod;


/**
 * @return {!Array.<*>|boolean} Returns categories array if the scale requires series to categorise their data.
 *    Returns null otherwise.
 */
anychart.scales.Base.prototype.getCategorisation = function() {
  return false;
};


/**
 * @return {number} Returns category width in ratio to the total space of the scale.
 */
anychart.scales.Base.prototype.getPointWidthRatio = function() {
  // TODO(Anton Saukh): non-Ordinal scales must have min distance between points calculation algorithm.
  return 0;
};
//endregion


//region --- Section Stacking ---
//----------------------------------------------------------------------------------------------------------------------
//
//  Stacking
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Positive stack maximum for percent stacking.
 * @type {number}
 * @private
 */
anychart.scales.Base.prototype.stackMax_ = NaN;


/**
 * Negative stack minimum for percent stacking.
 * @type {number}
 * @private
 */
anychart.scales.Base.prototype.stackMin_ = NaN;


/**
 * Positive stack value.
 * @type {number}
 * @private
 */
anychart.scales.Base.prototype.stackPositive_ = 0;


/**
 * Negative stack value.
 * @type {number}
 * @private
 */
anychart.scales.Base.prototype.stackNegative_ = 0;


/**
 * @type {boolean}
 * @private
 */
anychart.scales.Base.prototype.stackMissing_ = false;


/**
 * Stacking mode.
 * @type {anychart.enums.ScaleStackMode}
 * @private
 */
anychart.scales.Base.prototype.stackMode_ = anychart.enums.ScaleStackMode.NONE;


/**
 * Setting, whether the scale can be stacked. Should be set in the constructor.
 * @type {boolean}
 * @protected
 */
anychart.scales.Base.prototype.canBeStacked = false;


/**
 * Getter for stacked mode.
 * @return {anychart.enums.ScaleStackMode} Current Stack Mode.
 *//**
 * Setter for stacked mode.
 * @example
 * var chart = anychart.columnChart();
 * chart.column([10, 11, 10, 12]);
 * chart.column([7, 3, 4, 1]);
 * chart.column([6, 4, 8, 16]);
 * chart.yScale().stackMode('percent');
 * chart.container(stage).draw();
 * @param {anychart.enums.ScaleStackMode=} opt_value ['none'] Value to set.
 * @return {anychart.scales.Base} An instance of {@link anychart.scales.Base} class for method chaining.
 *//**
 * @ignoreDoc
 * Accepts 'none', 'value', 'percent'.
 * @param {anychart.enums.ScaleStackMode=} opt_value Stack mode if used as a setter.
 * @return {anychart.scales.Base|anychart.enums.ScaleStackMode} StackMode or itself for method chaining.
 */
anychart.scales.Base.prototype.stackMode = function(opt_value) {
  if (goog.isDef(opt_value)) {
    var str = anychart.enums.normalizeScaleStackMode(opt_value);
    var res, fn;
    if (this.canBeStacked && str == anychart.enums.ScaleStackMode.PERCENT) {
      res = anychart.enums.ScaleStackMode.PERCENT;
      fn = this.applyModePercent_;
    } else if (this.canBeStacked && str == anychart.enums.ScaleStackMode.VALUE) {
      res = anychart.enums.ScaleStackMode.VALUE;
      fn = this.applyModeValue_;
    } else {
      res = anychart.enums.ScaleStackMode.NONE;
      fn = this.applyModeNone_;
    }
    if (this.stackMode_ != res) {
      this.stackMode_ = res;
      this.applyStacking = fn;
      this.dispatchSignal(anychart.Signal.NEEDS_REAPPLICATION);
    }
    return this;
  }
  return this.stackMode_;
};


/**
 * Applies positive stack top as a stack max for current iteration.
 * @param {number} min Negative stack limit.
 * @param {number} max Positive stack limit.
 * @return {anychart.scales.Base} Returns itself for method chaining.
 */
anychart.scales.Base.prototype.setStackRange = function(min, max) {
  this.stackMin_ = Math.min(min, max, 0);
  this.stackMax_ = Math.max(max, min, 0);
  return this;
};


/**
 * Resets current stack to the initial value.
 * @return {anychart.scales.Base} .
 */
anychart.scales.Base.prototype.resetStack = function() {
  this.stackPositive_ = 0;
  this.stackNegative_ = 0;
  this.stackMissing_ = false;
  return this;
};


/**
 * Applies stacking to passed value.
 * @param {*} value Data value.
 * @return {*} Stacked data value.
 */
anychart.scales.Base.prototype.applyStacking;


/**
 * Returns previously stacked value.
 * @param {*} value Data value.
 * @return {number} Previously stacked data value. Returns 0, if previous value was NaN.
 */
anychart.scales.Base.prototype.getPrevVal = function(value) {
  value = anychart.utils.toNumber(value);
  if (this.stackMode_ == anychart.enums.ScaleStackMode.NONE || isNaN(value)) {
    return 0;
  } else {
    if (value >= 0)
      return this.stackPositive_;
    else
      return this.stackNegative_;
  }
};


/**
 * @return {boolean} .
 */
anychart.scales.Base.prototype.isStackValMissing = function() {
  return this.stackMissing_;
};


/**
 * Apply stack function for NONE mode of Stacker.
 * @param {*} value Data value.
 * @return {*} Stacked data value.
 * @private
 */
anychart.scales.Base.prototype.applyModeNone_ = function(value) {
  return value;
};


/**
 * Apply stack function for VALUE mode of Stacker.
 * @param {*} value Data value.
 * @return {*} Stacked data value.
 * @private
 */
anychart.scales.Base.prototype.applyModeValue_ = function(value) {
  value = anychart.utils.toNumber(value);
  var isNotMissing = !isNaN(value);
  if (isNotMissing) {
    if (/** @type {number} */(value) >= 0) {
      value = this.stackPositive_ += /** @type {number} */(value); // both value and stackVal become a sum of them.
    } else {
      value = this.stackNegative_ += /** @type {number} */(value); // both value and stackVal become a sum of them.
    }
  }
  this.stackMissing_ = !isNotMissing;
  return value;
};


/**
 * Apply stack function for PERCENT mode of Stacker.
 * @param {*} value Data value.
 * @return {*} Stacked data value.
 * @private
 */
anychart.scales.Base.prototype.applyModePercent_ = function(value) {
  value = anychart.utils.toNumber(value);
  var max = /** @type {number} */(value) < 0 ? -this.stackMin_ : this.stackMax_;
  return this.applyModeValue_(goog.math.clamp(/** @type {number} */(value) * 100 / max, -100, 100));
};
//endregion


//----------------------------------------------------------------------------------------------------------------------
//  Serialize & Deserialize
//----------------------------------------------------------------------------------------------------------------------
/** @inheritDoc */
anychart.scales.Base.prototype.serialize = function() {
  var data = goog.base(this, 'serialize');
  data['inverted'] = this.inverted();
  data['stackMode'] = this.stackMode();

  return data;
};


/** @inheritDoc */
anychart.scales.Base.prototype.deserialize = function(value) {
  this.suspendSignalsDispatching();

  goog.base(this, 'deserialize', value);

  this.inverted(value['inverted']);
  this.stackMode(value['stackMode']);

  this.resumeSignalsDispatching(true);

  return this;
};


//exports
anychart.scales.Base.prototype['inverted'] = anychart.scales.Base.prototype.inverted;//doc|ex
anychart.scales.Base.prototype['startAutoCalc'] = anychart.scales.Base.prototype.startAutoCalc;//doc|need-ex
anychart.scales.Base.prototype['finishAutoCalc'] = anychart.scales.Base.prototype.finishAutoCalc;//doc|need-ex
