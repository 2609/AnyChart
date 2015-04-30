goog.provide('anychart.core.ui.table.Border');
goog.require('acgraph');



/**
 * Border settings proxy. Doesn't store anything - just passes settings to and from the parent object.
 * @param {anychart.core.ui.table.IProxyUser} parent Object to pass settings to.
 * @param {boolean} useCellSettings If this border should use 'cell*' properties rather than .
 * @constructor
 */
anychart.core.ui.table.Border = function(parent, useCellSettings) {
  /**
   * @type {anychart.core.ui.table.IProxyUser}
   * @private
   */
  this.parent_ = parent;
  /**
   * @type {!Array.<string>}
   * @private
   */
  this.names_ = useCellSettings ? anychart.core.ui.table.Border.cellPropNames : anychart.core.ui.table.Border.propNames;
};


/**
 * Property names for border settings.
 * @type {!Array.<string>}
 */
anychart.core.ui.table.Border.propNames = ['topBorder', 'rightBorder', 'bottomBorder', 'leftBorder'];


/**
 * Property names for cell border settings.
 * @type {!Array.<string>}
 */
anychart.core.ui.table.Border.cellPropNames = ['cellTopBorder', 'cellRightBorder', 'cellBottomBorder', 'cellLeftBorder'];


/**
 * Getter for current top border settings.
 * @return {!acgraph.vector.Stroke} Current stroke settings.
 *//**
 * Setter for top border settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}<br/>
 * <b>Note:</b> Pass <b>null</b> to reset to default settings.<br/>
 * <b>Note:</b> <u>lineJoin</u> settings do not work here.
 * @shortDescription Setter for cell top border settings.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.core.ui.table.Border} {@link anychart.core.ui.table.Border} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} .
 */
anychart.core.ui.table.Border.prototype.top = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDefAndNotNull(opt_strokeOrFill)) // we want to keep null first param as null, not as 'none'
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
  return /** @type {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} */(this.parent_.settings(
      this.names_[0], opt_strokeOrFill, anychart.ConsistencyState.TABLE_BORDERS));
};


/**
 * Getter for current right border settings.
 * @return {!acgraph.vector.Stroke} Current stroke settings.
 *//**
 * Setter for right border settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}<br/>
 * <b>Note:</b> Pass <b>null</b> to reset to default settings.<br/>
 * <b>Note:</b> <u>lineJoin</u> settings do not work here.
 * @shortDescription Setter for cell right border settings.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.core.ui.table.Border} {@link anychart.core.ui.table.Border} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} .
 */
anychart.core.ui.table.Border.prototype.right = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDefAndNotNull(opt_strokeOrFill)) // we want to keep null first param as null, not as 'none'
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
  return /** @type {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} */(this.parent_.settings(
      this.names_[1], opt_strokeOrFill, anychart.ConsistencyState.TABLE_BORDERS));
};


/**
 * Getter for current bottom border settings.
 * @return {!acgraph.vector.Stroke} Current stroke settings.
 *//**
 * Setter for bottom border settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}<br/>
 * <b>Note:</b> Pass <b>null</b> to reset to default settings.<br/>
 * <b>Note:</b> <u>lineJoin</u> settings do not work here.
 * @shortDescription Setter for cell bottom border settings.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.core.ui.table.Border} {@link anychart.core.ui.table.Border} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} .
 */
anychart.core.ui.table.Border.prototype.bottom = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDefAndNotNull(opt_strokeOrFill)) // we want to keep null first param as null, not as 'none'
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
  return /** @type {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} */(this.parent_.settings(
      this.names_[2], opt_strokeOrFill, anychart.ConsistencyState.TABLE_BORDERS));
};


/**
 * Getter for current left border settings.
 * @return {!acgraph.vector.Stroke} Current stroke settings.
 *//**
 * Setter for left border settings.<br/>
 * Learn more about stroke settings:
 * {@link http://docs.anychart.com/__VERSION__/General_settings/Elements_Stroke}<br/>
 * <b>Note:</b> Pass <b>null</b> to reset to default settings.<br/>
 * <b>Note:</b> <u>lineJoin</u> settings do not work here.
 * @shortDescription Setter for cell left border settings.
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {!anychart.core.ui.table.Border} {@link anychart.core.ui.table.Border} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(acgraph.vector.Stroke|acgraph.vector.ColoredFill|string|null)=} opt_strokeOrFill Fill settings
 *    or stroke settings.
 * @param {number=} opt_thickness [1] Line thickness.
 * @param {string=} opt_dashpattern Controls the pattern of dashes and gaps used to stroke paths.
 * @param {acgraph.vector.StrokeLineJoin=} opt_lineJoin Line join style.
 * @param {acgraph.vector.StrokeLineCap=} opt_lineCap Line cap style.
 * @return {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} .
 */
anychart.core.ui.table.Border.prototype.left = function(opt_strokeOrFill, opt_thickness, opt_dashpattern, opt_lineJoin, opt_lineCap) {
  if (goog.isDefAndNotNull(opt_strokeOrFill)) // we want to keep null first param as null, not as 'none'
    opt_strokeOrFill = acgraph.vector.normalizeStroke.apply(null, arguments);
  return /** @type {anychart.core.ui.table.Border|acgraph.vector.Stroke|undefined} */(this.parent_.settings(
      this.names_[3], opt_strokeOrFill, anychart.ConsistencyState.TABLE_BORDERS));
};


//exports
anychart.core.ui.table.Border.prototype['top'] = anychart.core.ui.table.Border.prototype.top;
anychart.core.ui.table.Border.prototype['right'] = anychart.core.ui.table.Border.prototype.right;
anychart.core.ui.table.Border.prototype['bottom'] = anychart.core.ui.table.Border.prototype.bottom;
anychart.core.ui.table.Border.prototype['left'] = anychart.core.ui.table.Border.prototype.left;
