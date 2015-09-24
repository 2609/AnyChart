goog.provide('anychart.core.radar.series.ContinuousBase');
goog.require('acgraph');
goog.require('anychart.core.radar.series.Base');
goog.require('anychart.core.ui.MarkersFactory');
goog.require('anychart.enums');



/**
 * A base for all continuous series, like lines, splines, areas, etc.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.core.radar.series.Base}
 */
anychart.core.radar.series.ContinuousBase = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);

  /**
   * @type {!acgraph.vector.Path}
   * @protected
   */
  this.path = acgraph.path();
  this.path.zIndex(anychart.core.radar.series.Base.ZINDEX_SERIES);

  /**
   * @type {acgraph.vector.Path}
   * @protected
   */
  this.hatchFillPath = null;

  /**
   * @type {Array.<!acgraph.vector.Path>}
   * @protected
   */
  this.paths = [this.path];

  /**
   * @type {boolean}
   * @protected
   */
  this.connectMissing = false;
};
goog.inherits(anychart.core.radar.series.ContinuousBase, anychart.core.radar.series.Base);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.radar.series.ContinuousBase.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.radar.series.Base.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.SERIES_MARKERS;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.radar.series.ContinuousBase.prototype.markers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.radar.series.ContinuousBase.prototype.hoverMarkers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.radar.series.ContinuousBase.prototype.selectMarkers_ = null;


/**
 * @type {Object.<number>}
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.firstDrawnPoint;


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.hasMarkers = function() {
  return true;
};


/**
 * Getter for series data markers.
 * @example
 * chart = anychart.radar();
 * chart.area([1, 4, 7, 1, 4])
 *  .markers()
 *    .size(10)
 *    .type('star5');
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory} Markers instance.
 *//**
 * Setter for series data markers.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn off markers.
 * @example
 * chart = anychart.radar();
 * chart.area([1, 4, 7, 1, 4]).markers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!anychart.core.radar.series.ContinuousBase} {@link anychart.core.radar.series.ContinuousBase} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.radar.series.ContinuousBase)} Markers instance or itself for chaining call.
 */
anychart.core.radar.series.ContinuousBase.prototype.markers = function(opt_value) {
  if (!this.markers_) {
    this.markers_ = new anychart.core.ui.MarkersFactory();
    this.markers_.setParentEventTarget(this);
    this.registerDisposable(this.markers_);
    this.markers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    this.markers_.setup(opt_value);
    return this;
  }
  return this.markers_;
};


/**
 * Getter for series data markers on hover.
 * @example
 * chart = anychart.radar();
 * chart.area([1, 4, 7, 1, 4]).hoverMarkers().size(20);
 * chart.container(stage).draw();
 * @return {!anychart.core.ui.MarkersFactory} Markers instance.
 *//**
 * Setter for series data markers on hover.<br/>
 * <b>Note:</b> pass <b>'none'</b> or <b>null</b> to turn of markers.
 * @example
 * chart = anychart.radar();
 * chart.area([1, 4, 7, 1, 4]).hoverMarkers(null);
 * chart.container(stage).draw();
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!anychart.core.radar.series.ContinuousBase} {@link anychart.core.radar.series.ContinuousBase} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.radar.series.ContinuousBase)} Markers instance or itself for chaining call.
 */
anychart.core.radar.series.ContinuousBase.prototype.hoverMarkers = function(opt_value) {
  if (!this.hoverMarkers_) {
    this.hoverMarkers_ = new anychart.core.ui.MarkersFactory();
    this.registerDisposable(this.hoverMarkers_);
    // don't listen to it, for it will be reapplied at the next hover
  }

  if (goog.isDef(opt_value)) {
    this.hoverMarkers_.setup(opt_value);
    return this;
  }
  return this.hoverMarkers_;
};


/**
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.radar.series.ContinuousBase)} Markers instance or itself for chaining call.
 */
anychart.core.radar.series.ContinuousBase.prototype.selectMarkers = function(opt_value) {
  if (!this.selectMarkers_) {
    this.selectMarkers_ = new anychart.core.ui.MarkersFactory();
    this.registerDisposable(this.selectMarkers_);
    // don't listen to it, for it will be reapplied at the next hover
  }

  if (goog.isDef(opt_value)) {
    this.selectMarkers_.setup(opt_value);
    return this;
  }
  return this.selectMarkers_;
};


/**
 * Listener for markers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.core.radar.series.ContinuousBase.prototype.markersInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.SERIES_MARKERS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEED_UPDATE_LEGEND);
  }
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.drawPoint = function(pointState) {
  if (this.enabled()) {
    var pointDrawn;
    if (this.firstPointDrawn)
      pointDrawn = this.drawSubsequentPoint(pointState);
    else
      pointDrawn = this.drawFirstPoint(pointState);
    if (pointDrawn) {
      this.drawMarker(anychart.PointState.NORMAL);
      this.drawLabel(anychart.PointState.NORMAL);
    }
    // if connectMissing == true, firstPointDrawn will never be false when drawing.
    this.firstPointDrawn = (this.connectMissing && this.firstPointDrawn) || pointDrawn;
  }
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.startDrawing = function() {
  goog.base(this, 'startDrawing');

  this.firstDrawnPoint = null;

  var markers = this.markers();
  var hoverMarkers = this.hoverMarkers();
  var selectMarkers = this.selectMarkers();

  markers.suspendSignalsDispatching();
  hoverMarkers.suspendSignalsDispatching();
  selectMarkers.suspendSignalsDispatching();

  var fillColor = this.getMarkerFill(anychart.PointState.NORMAL);
  markers.setAutoFill(fillColor);

  var strokeColor = /** @type {acgraph.vector.Stroke} */(this.getMarkerStroke());
  markers.setAutoStroke(strokeColor);

  markers.setAutoType(this.autoMarkerType);

  markers.clear();
  markers.container(/** @type {acgraph.vector.ILayer} */(this.container()));
  markers.parentBounds(this.pixelBoundsCache);

  if (this.isConsistent() || !this.enabled()) return;

  var i;
  var len = this.paths.length;
  for (i = 0; i < len; i++) {
    this.makeInteractive(this.paths[i], true);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    /** @type {acgraph.vector.Element} */(this.rootLayer).zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    for (i = 0; i < len; i++)
      this.paths[i].clear();


    var seriesState = this.state.seriesState;
    var state = anychart.PointState.NORMAL;
    if (this.state.hasPointState(anychart.PointState.SELECT))
      state = anychart.PointState.SELECT;
    else if (this.state.hasPointState(anychart.PointState.HOVER))
      state = anychart.PointState.HOVER;

    this.colorizeShape(seriesState | state);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    var container = /** @type {acgraph.vector.ILayer} */(this.container());
    this.rootLayer.parent(container);
    for (i = 0; i < len; i++)
      this.paths[i].parent(this.rootLayer);
    if (this.hatchFillPath)
      this.hatchFillPath.parent(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
    this.markConsistent(anychart.ConsistencyState.CONTAINER);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    if (!this.hatchFillPath) {
      this.hatchFillPath = acgraph.path();
      this.hatchFillPath.parent(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
      this.hatchFillPath.zIndex(anychart.core.radar.series.Base.ZINDEX_HATCH_FILL);
      this.hatchFillPath.disablePointerEvents(true);
    }
  }
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.drawMissing = function() {
  if (!this.connectMissing) {
    goog.base(this, 'drawMissing');
    this.finalizeSegment();
  }
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.finalizeDrawing = function() {
  this.finalizeSegment();
  this.finalizeHatchFill();

  this.markers().draw();

  this.markers().resumeSignalsDispatching(false);
  this.hoverMarkers().resumeSignalsDispatching(false);

  this.markers().markConsistent(anychart.ConsistencyState.ALL);
  this.hoverMarkers().markConsistent(anychart.ConsistencyState.ALL);


  goog.base(this, 'finalizeDrawing');
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.remove = function() {
  this.markers().container(null);

  goog.base(this, 'remove');
};


/** @inheritDoc */
anychart.core.radar.series.ContinuousBase.prototype.createPositionProvider = function(position) {
  var iterator = this.getIterator();
  return {'value': {'x': iterator.meta('x'), 'y': iterator.meta('value')}};
};


/**
 * Finalizes continuous segment drawing.
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.finalizeSegment = goog.nullFunction;


/**
 * Finalizes hatch fill element.
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.finalizeHatchFill = goog.nullFunction;


/**
 * Getter for connect missing points setting.
 * @return {boolean} Current setting.
 *//**
 * Setter for connect missing points setting.
 * @example
 * chart = anychart.radar();
 * var blueLine = chart.line([
 *    ['A1', 1],
 *    ['A2', 1.6],
 *    ['A3', 'missing'],
 *    ['A4', 1.1],
 *    ['A5', 1.9]
 * ]).connectMissingPoints(false);
 * var redLine = chart.line([
 *    ['A1', 2],
 *    ['A2', 2.6],
 *    ['A3', 'missing'],
 *    ['A4', 2.1],
 *    ['A5', 2.9]
 * ]).connectMissingPoints(true);
 * chart.container(stage).draw();
 * @param {boolean=} opt_value [false] If set to <b>true</b>, the series will not be interrupted on missing points.<br/>
 *   Defaults to <b>false</b>. Markers will not be drawn for missing points in both cases.
 * @return {!anychart.core.radar.series.Base} {@link anychart.core.radar.series.Base} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {boolean=} opt_value The value to be set.
 * @return {!anychart.core.radar.series.Base|boolean} The setting, or itself for method chaining.
 */
anychart.core.radar.series.ContinuousBase.prototype.connectMissingPoints = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = !!opt_value;
    if (this.connectMissing != opt_value) {
      this.connectMissing = opt_value;
      this.invalidate(anychart.ConsistencyState.APPEARANCE, anychart.Signal.NEEDS_REDRAW);
    }
    return this;
  }
  return this.connectMissing;
};


/**
 * Colorizes shape in accordance to current point colorization settings.
 * Shape is get from current meta 'shape'.
 * @param {anychart.PointState|number} pointState Point state.
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.colorizeShape = function(pointState) {
  this.path.stroke(this.getFinalStroke(false, pointState), 2);
  this.path.fill(null);
};


/**
 * Apply hatch fill to shape in accordance to current point colorization settings.
 * Shape is get from current meta 'hatchFillShape'.
 * @param {anychart.PointState|number} pointState Point state.
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.applyHatchFill = function(pointState) {
  if (this.hatchFillPath) {
    this.hatchFillPath.stroke(null);
    this.hatchFillPath.fill(this.getFinalHatchFill(false, pointState));
  }
};


/**
 * @inheritDoc
 */
anychart.core.radar.series.ContinuousBase.prototype.getIndexByEvent = function(event) {
  var x = event['clientX'];
  var y = event['clientY'];
  var value, index;

  var stageClientPosition = goog.style.getClientPosition(/** @type {Element} */(this.container().getStage().container()));
  var cx = stageClientPosition.x + this.cx;
  var cy = stageClientPosition.y + this.cy;

  var startAngle = goog.math.toRadians(this.startAngle() - 90);
  var currRadius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
  var angle = Math.acos((x - cx) / currRadius);
  if (y < cy) angle = 2 * Math.PI - startAngle - angle;
  else angle = angle - startAngle;

  angle = goog.math.modulo(angle, Math.PI * 2);

  var ratio = angle / (2 * Math.PI);
  value = this.xScale().inverseTransform(ratio);
  index = this.data().find('x', value);

  return /** @type {number} */(index);
};


/**
 * Gets marker position.
 * @param {anychart.PointState|number} pointState If it is a hovered oe selected marker drawing.
 * @return {string} Position settings.
 */
anychart.core.radar.series.ContinuousBase.prototype.getMarkersPosition = function(pointState) {
  var iterator = this.getIterator();

  var selected = this.state.isStateContains(pointState, anychart.PointState.SELECT);
  var hovered = !selected && this.state.isStateContains(pointState, anychart.PointState.HOVER);

  var pointMarker = iterator.get('marker');
  var hoverPointMarker = iterator.get('hoverMarker');
  var selectPointMarker = iterator.get('selectMarker');

  var markerPosition = pointMarker && pointMarker['position'] ? pointMarker['position'] : null;
  var markerHoverPosition = hoverPointMarker && hoverPointMarker['position'] ? hoverPointMarker['position'] : null;
  var markerSelectPosition = selectPointMarker && selectPointMarker['position'] ? selectPointMarker['position'] : null;

  return (hovered && (markerHoverPosition || this.hoverMarkers().position())) ||
      (selected && (markerSelectPosition || this.selectMarkers().position())) ||
      markerPosition || this.markers().position();
};


/**
 * Draws marker for the point.
 * @param {anychart.PointState|number} pointState If it is a hovered oe selected marker drawing.
 * @protected
 */
anychart.core.radar.series.ContinuousBase.prototype.drawMarker = function(pointState) {
  var iterator = this.getIterator();

  var value = anychart.utils.toNumber(this.getIterator().get('value'));

  var selected = this.state.isStateContains(pointState, anychart.PointState.SELECT);
  var hovered = !selected && this.state.isStateContains(pointState, anychart.PointState.HOVER);

  var pointMarker = iterator.get('marker');
  var hoverPointMarker = iterator.get('hoverMarker');
  var selectPointMarker = iterator.get('selectMarker');

  var index = iterator.getIndex();
  var markersFactory;
  if (selected) {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.selectMarkers());
  } else if (hovered) {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.hoverMarkers());
  } else {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.markers());
  }

  var marker = this.markers().getMarker(index);

  var markerEnabledState = pointMarker && goog.isDef(pointMarker['enabled']) ? pointMarker['enabled'] : null;
  var markerHoverEnabledState = hoverPointMarker && goog.isDef(hoverPointMarker['enabled']) ? hoverPointMarker['enabled'] : null;
  var markerSelectEnabledState = selectPointMarker && goog.isDef(selectPointMarker['enabled']) ? selectPointMarker['enabled'] : null;

  var isDraw = hovered || selected ?
      hovered ?
          goog.isNull(markerHoverEnabledState) ?
              this.hoverMarkers_ && goog.isNull(this.hoverMarkers_.enabled()) ?
                  goog.isNull(markerEnabledState) ?
                      this.markers_.enabled() :
                      markerEnabledState :
                  this.hoverMarkers_.enabled() :
              markerHoverEnabledState :
          goog.isNull(markerSelectEnabledState) ?
              this.selectMarkers_ && goog.isNull(this.selectMarkers_.enabled()) ?
                  goog.isNull(markerEnabledState) ?
                      this.markers_.enabled() :
                      markerEnabledState :
                  this.selectMarkers_.enabled() :
              markerSelectEnabledState :
      goog.isNull(markerEnabledState) ?
          this.markers_.enabled() :
          markerEnabledState;

  if (isDraw && !isNaN(value)) {
    var position = this.getMarkersPosition(pointState);

    var positionProvider = this.createPositionProvider(/** @type {anychart.enums.Position|string} */(position));
    if (marker) {
      marker.positionProvider(positionProvider);
    } else {
      marker = this.markers().add(positionProvider, index);
    }

    marker.resetSettings();
    marker.currentMarkersFactory(markersFactory);
    marker.setSettings(/** @type {Object} */(pointMarker), /** @type {Object} */(hovered ? hoverPointMarker : selectPointMarker));
    marker.draw();
  } else if (marker) {
    marker.clear();
  }
};


/**
 * Return marker color for series.
 * @param {anychart.PointState|number} pointState Point state.
 * @return {!acgraph.vector.Fill} Marker color for series.
 */
anychart.core.radar.series.ContinuousBase.prototype.getMarkerFill = function(pointState) {
  return this.getFinalFill(false, pointState);
};


/**
 * Return marker color for series.
 * @return {(string|acgraph.vector.Fill|acgraph.vector.Stroke)} Marker color for series.
 */
anychart.core.radar.series.ContinuousBase.prototype.getMarkerStroke = function() {
  return anychart.color.darken(this.markers().fill());
};


/**
 * @inheritDoc
 */
anychart.core.radar.series.ContinuousBase.prototype.getLegendItemData = function(itemsTextFormatter) {
  var data = goog.base(this, 'getLegendItemData', itemsTextFormatter);

  var markers = this.markers();
  markers.setAutoFill(this.getMarkerFill(anychart.PointState.NORMAL));
  markers.setAutoStroke(/** @type {acgraph.vector.Stroke} */(this.getMarkerStroke()));
  if (markers.enabled()) {
    data['iconMarkerType'] = data['iconMarkerType'] || markers.getType() || this.autoMarkerType;
    data['iconMarkerFill'] = data['iconMarkerFill'] || markers.fill();
    data['iconMarkerStroke'] = data['iconMarkerStroke'] || markers.stroke();
  } else {
    data['iconMarkerType'] = null;
    data['iconMarkerFill'] = null;
    data['iconMarkerStroke'] = null;
  }
  return data;
};


/**
 * Apply appearance to point.
 * @param {anychart.PointState|number} pointState
 */
anychart.core.radar.series.ContinuousBase.prototype.applyAppearanceToPoint = function(pointState) {
  this.drawMarker(pointState);
  this.drawLabel(pointState);
};


/**
 * Apply appearance to series.
 * @param {anychart.PointState|number} pointState .
 */
anychart.core.radar.series.ContinuousBase.prototype.applyAppearanceToSeries = function(pointState) {
  this.colorizeShape(pointState);
  this.applyHatchFill(pointState);
};


/**
 * @inheritDoc
 */
anychart.core.radar.series.ContinuousBase.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['markers'] = this.markers().serialize();
  json['hoverMarkers'] = this.hoverMarkers().serialize();
  json['connectMissingPoints'] = this.connectMissingPoints();
  return json;
};


/**
 * @inheritDoc
 */
anychart.core.radar.series.ContinuousBase.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.markers(config['markers']);
  this.hoverMarkers(config['hoverMarkers']);
  this.connectMissingPoints(config['connectMissingPoints']);
};


//anychart.core.radar.series.ContinuousBase.prototype['startDrawing'] = anychart.core.radar.series.ContinuousBase.prototype.startDrawing;
//anychart.core.radar.series.ContinuousBase.prototype['drawPoint'] = anychart.core.radar.series.ContinuousBase.prototype.drawPoint;
//anychart.core.radar.series.ContinuousBase.prototype['finalizeDrawing'] = anychart.core.radar.series.ContinuousBase.prototype.finalizeDrawing;
//anychart.core.radar.series.ContinuousBase.prototype['drawMissing'] = anychart.core.radar.series.ContinuousBase.prototype.drawMissing;
//exports
anychart.core.radar.series.ContinuousBase.prototype['markers'] = anychart.core.radar.series.ContinuousBase.prototype.markers;//doc|ex
anychart.core.radar.series.ContinuousBase.prototype['hoverMarkers'] = anychart.core.radar.series.ContinuousBase.prototype.hoverMarkers;//doc|ex
anychart.core.radar.series.ContinuousBase.prototype['selectMarkers'] = anychart.core.radar.series.ContinuousBase.prototype.selectMarkers;
anychart.core.radar.series.ContinuousBase.prototype['connectMissingPoints'] = anychart.core.radar.series.ContinuousBase.prototype.connectMissingPoints;//doc|ex
