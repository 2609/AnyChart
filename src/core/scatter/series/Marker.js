goog.provide('anychart.core.scatter.series.Marker');
goog.require('acgraph');
goog.require('anychart.core.scatter.series.Base');
goog.require('anychart.core.ui.MarkersFactory');
goog.require('anychart.enums');



/**
 * Define Marker series type.<br/>
 * Get instance by methods {@link anychart.charts.Scatter#marker}.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.core.scatter.series.Base}
 */
anychart.core.scatter.series.Marker = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);
  /**
   * @type {anychart.core.ui.MarkersFactory}
   * @private
   */
  this.marker_ = new anychart.core.ui.MarkersFactory();
  this.marker_.setParentEventTarget(this);
  this.marker_.zIndex(anychart.core.scatter.series.Base.ZINDEX_SERIES);
  this.marker_.enabled(true);
  this.registerDisposable(this.marker_);

  this.hoverMarker_ = new anychart.core.ui.MarkersFactory();
  this.registerDisposable(this.marker_);

  /**
   * @type {(string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)}
   * @private
   */
  this.type_;

  /**
   * @type {number}
   * @private
   */
  this.size_ = 10;

  /**
   * @type {(string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)}
   * @private
   */
  this.hoverType_;

  /**
   * @type {number}
   * @private
   */
  this.hoverSize_ = 12;

  this.hatchFill(false);
};
goog.inherits(anychart.core.scatter.series.Marker, anychart.core.scatter.series.Base);
anychart.core.scatter.series.Base.SeriesTypesMap[anychart.enums.ScatterSeriesTypes.MARKER] = anychart.core.scatter.series.Marker;


/**
 * @type {anychart.enums.MarkerType}
 * @protected
 */
anychart.core.scatter.series.Marker.prototype.autoMarkerType_;


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.setAutoMarkerType = function(opt_value) {
  this.autoMarkerType_ = opt_value;
};


/**
 * Getter for current marker type settings.
 * @return {string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path}
 *  Markers type settings.
 *//**
 * Setter for marker type settings.
 * @example <c>By Enum value.</c>
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ])
 *   .type('star4');
 * chart.container(stage).draw();
 * @example <c>By custom function.</c>
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ]).type(function(path, x, y, size) {
 *      var point1 = {x: x + 1.2 * size, y: y - 0.4 * size};
 *      var point2 = {x: x - 0.5*size, y: y -0.5*size};
 *      path.moveTo(point1.x, point1.y)
 *          .arcToByEndPoint(point2.x, point2.y, size, size, true, true)
 *          .arcToByEndPoint(point1.x, point1.y, size / 3, size / 3, false, false)
 *          .moveTo(point1.x, point1.y)
 *          .close();
 *      return path;
 *    });
 * chart.container(stage).draw();
 * @param {(string|anychart.enums.MarkerType|
 *  function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value
 *  [{@link anychart.enums.MarkerType}.STAR5] Type or custom drawer. Function for a custom
 *  marker should look like this: <code>function(path, x, y, size){
 *    // path - acgraph.vector.Path
 *    // x, y - marker position
 *    // size - marker size
 *    ... //do something
 *    return path;
 *  }</code>.
 * @return {!anychart.core.scatter.series.Marker} {@link anychart.core.scatter.series.Marker} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(string|anychart.enums.MarkerType|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.scatter.series.Marker|anychart.enums.MarkerType|string|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path} .
 */
anychart.core.scatter.series.Marker.prototype.type = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (!goog.isFunction(opt_value)) opt_value = anychart.enums.normalizeMarkerType(opt_value);
    if (this.type_ != opt_value) {
      this.type_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.type_ || this.autoMarkerType_;
  }
};


/**
 * Getter for current hovered marker type settings.
 * @return {string|anychart.enums.MarkerType|function(acgraph.vector.Path, number, number, number):acgraph.vector.Path}
 *  Markers type settings.
 *//**
 * Setter for hovered marker type settings.
 * @example <c>By Enum value.</c>
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ])
 *   .hoverType('star4');
 * chart.container(stage).draw();
 * @example <c>By custom function.</c>
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ]).hoverType(function(path, x, y, size) {
 *      var point1 = {x: x + 1.2 * size, y: y - 0.4 * size};
 *      var point2 = {x: x - 0.5*size, y: y -0.5*size};
 *      path.moveTo(point1.x, point1.y)
 *          .arcToByEndPoint(point2.x, point2.y, size, size, true, true)
 *          .arcToByEndPoint(point1.x, point1.y, size / 3, size / 3, false, false)
 *          .moveTo(point1.x, point1.y)
 *          .close();
 *      return path;
 *    });
 * chart.container(stage).draw();
 * @param {(string|anychart.enums.MarkerType|
 *  function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value
 *  [{@link anychart.enums.MarkerType}.STAR5] Type or custom drawer. Function for a custom
 *  marker should look like this: <code>function(path, x, y, size){
 *    // path - acgraph.vector.Path
 *    // x, y - marker position
 *    // size - marker size
 *    ... //do something
 *    return path;
 *  }</code>.
 * @return {!anychart.core.scatter.series.Marker} {@link anychart.core.scatter.series.Marker} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(string|anychart.enums.MarkerType|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.scatter.series.Marker|anychart.enums.MarkerType|string|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path} .
 */
anychart.core.scatter.series.Marker.prototype.hoverType = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (!goog.isFunction(opt_value))
      opt_value = anychart.enums.normalizeMarkerType(opt_value);
    if (this.hoverType_ != opt_value) {
      this.hoverType_ = opt_value;
    }
    return this;
  } else {
    return this.hoverType_;
  }
};


/**
 * Getter for marker size
 * @return {number} Current marker size.
 *//**
 * Setter for marker size.
 * @example
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ]).size(14)
 * chart.container(stage).draw();
 * @param {number=} opt_value [10] Value to set.
 * @return {anychart.core.scatter.series.Marker} {@link anychart.core.scatter.series.Marker} class for method chaining.
 *//**
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {anychart.core.scatter.series.Marker|number} .
 */
anychart.core.scatter.series.Marker.prototype.size = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.size_ != opt_value) {
      this.size_ = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  } else {
    return this.size_;
  }
};


/**
 * Getter for hovered marker size
 * @return {number} Current hovered marker size.
 *//**
 * Setter for hovered marker size.
 * @example
 * chart = anychart.scatter();
 * chart.marker([
 *   [4.1, 12],
 *   [2.3, 6],
 *   [3.4, 19],
 *   [1.2, 22]
 * ])
 *   .size(10)
 *   .hoverSize(20);
 * chart.container(stage).draw();
 * @param {number=} opt_value [12] Value to set.
 * @return {anychart.core.scatter.series.Marker} {@link anychart.core.scatter.series.Marker} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {anychart.core.scatter.series.Marker|number} .
 */
anychart.core.scatter.series.Marker.prototype.hoverSize = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.hoverSize_ != opt_value) {
      this.hoverSize_ = opt_value;
    }
    return this;
  } else {
    return this.hoverSize_;
  }
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.getLegendIconType = function() {
  var markerDrawer = anychart.enums.getMarkerDrawer(this.type());
  return function(path, size) {
    return markerDrawer(path, size / 2, size / 2, size / 2);
  };
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.startDrawing = function() {
  goog.base(this, 'startDrawing');
  if (this.isConsistent() || !this.enabled()) return;

  this.marker_.suspendSignalsDispatching();

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_DATA)) {
    this.marker_.clear();
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    /** @type {acgraph.vector.Element} */(this.rootLayer).zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  var clip, bounds, axesLinesSpace;
  if (this.hasInvalidationState(anychart.ConsistencyState.BOUNDS)) {
    if (this.clip()) {
      if (goog.isBoolean(this.clip())) {
        bounds = this.pixelBoundsCache;
        axesLinesSpace = this.axesLinesSpace();
        clip = axesLinesSpace.tightenBounds(/** @type {!anychart.math.Rect} */(bounds));
      } else {
        clip = /** @type {!anychart.math.Rect} */(this.clip());
      }
      this.rootLayer.clip(clip);
    }
    this.markConsistent(anychart.ConsistencyState.BOUNDS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.marker_.fill(this.getFinalFill(false, false));
    this.marker_.stroke(this.getFinalStroke(false, false));
    this.marker_.type(/** @type {anychart.enums.MarkerType} */(this.type()));
    this.marker_.size(this.size_);

    this.hoverMarker_.fill(this.getFinalFill(false, true));
    this.hoverMarker_.stroke(this.getFinalStroke(false, true));
    this.hoverMarker_.type(/** @type {anychart.enums.MarkerType} */(this.hoverType_));
    this.hoverMarker_.size(this.hoverSize_);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.rootLayer.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    this.marker_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
    if (this.hatchFillElement_)
      this.hatchFillElement_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
  }


  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    var fill = this.getFinalHatchFill(false, false);
    if (!this.hatchFillElement_ && !anychart.utils.isNone(fill)) {
      this.hatchFillElement_ = new anychart.core.ui.MarkersFactory();
      this.hatchFillElement_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
      this.hatchFillElement_.zIndex(anychart.core.scatter.series.Base.ZINDEX_HATCH_FILL);
      this.hatchFillElement_.disablePointerEvents(true);
    }
  }
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.drawSeriesPoint = function() {
  var referenceValues = this.getReferenceCoords();
  if (!referenceValues)
    return false;

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    var x = referenceValues[0];
    var y = referenceValues[1];

    this.getIterator().meta('x', x).meta('y', y);

    this.drawMarker_(this.hoverStatus == this.getIterator().getIndex() || this.hoverStatus < 0);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    this.applyHatchFill(false);
  }
  return true;
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.finalizeDrawing = function() {
  if (!this.isConsistent() && this.enabled()) {
    this.marker_.draw();
    this.marker_.resumeSignalsDispatching(false);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    if (this.hatchFillElement_) {
      this.hatchFillElement_.draw();
      this.hatchFillElement_.resumeSignalsDispatching(false);
    }
  }

  if (this.enabled()) {
    this.markConsistent(
        anychart.ConsistencyState.CONTAINER |
        anychart.ConsistencyState.Z_INDEX
    );
  }

  goog.base(this, 'finalizeDrawing');
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.createPositionProvider = function() {
  var iterator = this.getIterator();
  return {'value': {'x': iterator.meta('x'), 'y': iterator.meta('y')}};
};


/**
 * Draws marker for the point.
 * @param {boolean} hovered If it is a hovered marker drawing.
 * @param {boolean=} opt_updateMarker Redraw marker.
 * @private
 */
anychart.core.scatter.series.Marker.prototype.drawMarker_ = function(hovered, opt_updateMarker) {
  var iterator = this.getIterator();
  var pointType = iterator.get('type');
  var pointSize = iterator.get('markerSize');
  var pointFill = iterator.get('fill');
  var pointStroke = iterator.get('stroke');
  var pointHoverType = iterator.get('hoverType');
  var pointHoverSize = iterator.get('hoverMarkerSize');
  var pointHoverFill = iterator.get('hoverFill');
  var pointHoverStroke = iterator.get('hoverStroke');
  var markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(hovered ? this.hoverMarker_ : this.marker_);

  var settings = {'type': pointType, 'size': pointSize, 'fill': pointFill, 'stroke': pointStroke};
  var settingsHover = {'type': pointHoverType, 'size': pointHoverSize, 'fill': pointHoverFill, 'stroke': pointHoverStroke};

  var index = iterator.getIndex();

  var positionProvider = this.createPositionProvider();

  var marker = this.marker_.getMarker(index) || this.marker_.add(positionProvider, index);
  marker.resetSettings();
  marker.currentMarkersFactory(markersFactory);
  marker.setSettings(settings, settingsHover);
  marker.positionProvider(positionProvider);

  if (opt_updateMarker) marker.draw();
};


/**
 * Apply hatch fill to shape in accordance to current point colorization settings.
 * Shape is get from current meta 'hatchFillShape'.
 * @param {boolean} hovered If the point is hovered.
 * @protected
 */
anychart.core.scatter.series.Marker.prototype.applyHatchFill = function(hovered) {
  if (this.hatchFillElement_) {
    var iterator = this.getIterator();
    var index = iterator.getIndex();

    var pointType = iterator.get('type');
    var pointSize = iterator.get('markerSize');
    var pointHoverType = iterator.get('hoverType');
    var pointHoverSize = iterator.get('hoverMarkerSize');

    var markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(hovered ? this.hoverMarker_ : this.marker_);
    var hatchFill = this.hatchFillElement_.add(this.createPositionProvider(), index);

    var settings = {'type': pointType, 'size': pointSize, 'fill': this.getFinalHatchFill(true, hovered), 'stroke': null};
    var settingsHover = {'type': pointHoverType, 'size': pointHoverSize, 'fill': this.getFinalHatchFill(true, hovered), 'stroke': null};

    hatchFill.resetSettings();

    hatchFill.parentMarkersFactory(this.marker_);
    hatchFill.currentMarkersFactory(markersFactory);
    hatchFill.setSettings(settings, settingsHover);

    hatchFill.draw();
  }
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.hoverSeries = function() {
  if (this.hoverStatus == -1) return this;

  //hide tooltip in any case
  this.hideTooltip();

  //unhover current point if any
  if (this.hoverStatus >= 0 && this.getResetIterator().select(this.hoverStatus)) {
    this.drawMarker_(false, true);
    this.applyHatchFill(false);
    this.drawLabel(false);
  }

  //hover all points
  var iterator = this.getResetIterator();
  while (iterator.advance()) {
    this.drawMarker_(true, true);
    this.applyHatchFill(true);
  }

  this.hoverStatus = -1;
  return this;
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.hoverPoint = function(index, opt_event) {
  if (this.hoverStatus == index) {
    if (this.getIterator().select(index))
      if (opt_event) this.showTooltip(opt_event);
      return this;
  }
  this.unhover();
  if (this.getIterator().select(index)) {
    this.drawMarker_(true, true);
    this.applyHatchFill(true);
    this.drawLabel(true);
    if (opt_event) this.showTooltip(opt_event);
  }
  this.hoverStatus = index;
  return this;
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.unhover = function() {
  if (isNaN(this.hoverStatus)) return this;

  //hide tooltip in any case
  this.hideTooltip();

  if (this.hoverStatus >= 0) {
    if (this.getIterator().select(this.hoverStatus)) {
      this.drawMarker_(false, true);
      this.applyHatchFill(false);
      this.drawLabel(false);
    }
  } else {
    var iterator = this.getResetIterator();
    while (iterator.advance()) {
      this.drawMarker_(false, true);
      this.applyHatchFill(false);
    }
  }
  this.hoverStatus = NaN;
  return this;
};


/**
 * @inheritDoc
 */
anychart.core.scatter.series.Marker.prototype.getType = function() {
  return anychart.enums.ScatterSeriesTypes.MARKER;
};


/**
 * @inheritDoc
 */
anychart.core.scatter.series.Marker.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');

  if (goog.isFunction(this.type())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Marker type']
    );
  } else {
    json['type'] = this.type();
  }

  if (goog.isFunction(this.hoverType())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Marker hoverType']
    );
  } else if (goog.isDef(this.hoverType())) {
    json['hoverType'] = this.hoverType();
  }

  json['size'] = this.size();
  json['hoverSize'] = this.hoverSize();
  return json;
};


/** @inheritDoc */
anychart.core.scatter.series.Marker.prototype.restoreDefaults = function() {
  var res = goog.base(this, 'restoreDefaults');

  var tooltip = /** @type {anychart.core.ui.Tooltip} */(this.tooltip());
  tooltip.contentFormatter(function() {
    return parseFloat(this['value']).toFixed(2);
  });

  return res;
};


/**
 * @inheritDoc
 */
anychart.core.scatter.series.Marker.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.size(config['size']);
  this.hoverSize(config['hoverSize']);
  this.type(config['type']);
  this.hoverType(config['hoverType']);
};


//anychart.core.scatter.series.Marker.prototype['startDrawing'] = anychart.core.scatter.series.Marker.prototype.startDrawing;//inherited
//anychart.core.scatter.series.Marker.prototype['finalizeDrawing'] = anychart.core.scatter.series.Marker.prototype.finalizeDrawing;//inherited
//exports
anychart.core.scatter.series.Marker.prototype['stroke'] = anychart.core.scatter.series.Marker.prototype.stroke;//inherited
anychart.core.scatter.series.Marker.prototype['hoverStroke'] = anychart.core.scatter.series.Marker.prototype.hoverStroke;//inherited
anychart.core.scatter.series.Marker.prototype['fill'] = anychart.core.scatter.series.Marker.prototype.fill;//inherited
anychart.core.scatter.series.Marker.prototype['hoverFill'] = anychart.core.scatter.series.Marker.prototype.hoverFill;//inherited
anychart.core.scatter.series.Marker.prototype['size'] = anychart.core.scatter.series.Marker.prototype.size;//doc|ex
anychart.core.scatter.series.Marker.prototype['hoverSize'] = anychart.core.scatter.series.Marker.prototype.hoverSize;//doc|ex
anychart.core.scatter.series.Marker.prototype['type'] = anychart.core.scatter.series.Marker.prototype.type;//doc|ex
anychart.core.scatter.series.Marker.prototype['hoverType'] = anychart.core.scatter.series.Marker.prototype.hoverType;//doc|ex
anychart.core.scatter.series.Marker.prototype['hatchFill'] = anychart.core.scatter.series.Marker.prototype.hatchFill;//inherited
anychart.core.scatter.series.Marker.prototype['hoverHatchFill'] = anychart.core.scatter.series.Marker.prototype.hoverHatchFill;//inherited
anychart.core.scatter.series.Marker.prototype['unhover'] = anychart.core.scatter.series.Marker.prototype.unhover;
