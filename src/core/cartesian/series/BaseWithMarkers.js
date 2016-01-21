goog.provide('anychart.core.cartesian.series.BaseWithMarkers');
goog.require('acgraph');
goog.require('anychart.core.cartesian.series.Base');
goog.require('anychart.core.ui.MarkersFactory');
goog.require('anychart.enums');



/**
 * A base for all series except marker series.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 *    here as a hash map.
 * @constructor
 * @extends {anychart.core.cartesian.series.Base}
 */
anychart.core.cartesian.series.BaseWithMarkers = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);

  this.additionalNames.push('marker');

  this.markers().position(anychart.enums.Position.CENTER);
};
goog.inherits(anychart.core.cartesian.series.BaseWithMarkers, anychart.core.cartesian.series.Base);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.cartesian.series.Base.prototype.SUPPORTED_CONSISTENCY_STATES |
        anychart.ConsistencyState.SERIES_MARKERS;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.markers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.hoverMarkers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.selectMarkers_ = null;


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.hasMarkers = function() {
  return true;
};


/**
 * Getter/setter for markers.
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.cartesian.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.markers = function(opt_value) {
  if (!this.markers_) {
    this.markers_ = new anychart.core.ui.MarkersFactory();
    this.markers_.setParentEventTarget(this);
    this.registerDisposable(this.markers_);
    this.markers_.listenSignals(this.markersInvalidated_, this);
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.markers_.setup(opt_value);
    return this;
  }
  return this.markers_;
};


/**
 * Getter/setter for hoverMarkers.
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.cartesian.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.hoverMarkers = function(opt_value) {
  if (!this.hoverMarkers_) {
    this.hoverMarkers_ = new anychart.core.ui.MarkersFactory();
    this.registerDisposable(this.hoverMarkers_);
    // don't listen to it, for it will be reapplied at the next hover
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
    this.hoverMarkers_.setup(opt_value);
    return this;
  }
  return this.hoverMarkers_;
};


/**
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.cartesian.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.selectMarkers = function(opt_value) {
  if (!this.selectMarkers_) {
    this.selectMarkers_ = new anychart.core.ui.MarkersFactory();
    this.registerDisposable(this.selectMarkers_);
    // don't listen to it, for it will be reapplied at the next hover
  }

  if (goog.isDef(opt_value)) {
    if (goog.isObject(opt_value) && !('enabled' in opt_value))
      opt_value['enabled'] = true;
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
anychart.core.cartesian.series.BaseWithMarkers.prototype.markersInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.SERIES_MARKERS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEED_UPDATE_LEGEND);
  }
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.setAutoMarkerType = function(opt_value) {
  this.markers().setAutoType(opt_value);
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.remove = function() {
  this.markers().container(null);

  goog.base(this, 'remove');
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.startDrawing = function() {
  goog.base(this, 'startDrawing');
  var markers = this.markers();
  var hoverMarkers = this.hoverMarkers();

  markers.suspendSignalsDispatching();
  hoverMarkers.suspendSignalsDispatching();

  var fillColor = this.getMarkerFill();
  markers.setAutoFill(fillColor);

  var strokeColor = /** @type {acgraph.vector.Stroke} */(this.getMarkerStroke());
  markers.setAutoStroke(strokeColor);

  markers.clear();
  markers.container(/** @type {acgraph.vector.ILayer} */(this.container()));
  markers.parentBounds(this.pixelBoundsCache);
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.drawPointElements = function(pointState) {
  anychart.core.cartesian.series.BaseWithMarkers.base(this, 'drawPointElements', pointState);
  if (this.shouldDrawMarkers)
    this.drawMarker(pointState);
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.doClip = function() {
  goog.base(this, 'doClip');

  if (this.clip() && !(this.rootLayer.clip() instanceof acgraph.vector.Clip)) {
    var bounds = /** @type {!anychart.math.Rect} */(goog.isBoolean(this.clip()) ? this.pixelBoundsCache : this.clip());
    var markerDOM = this.markers().getDomElement();
    if (markerDOM) markerDOM.clip(/** @type {anychart.math.Rect} */(bounds));
  }
};


/** @inheritDoc */
anychart.core.cartesian.series.BaseWithMarkers.prototype.finalizeDrawing = function() {
  this.markers().draw();

  this.markers().resumeSignalsDispatching(false);
  this.hoverMarkers().resumeSignalsDispatching(false);

  this.markers().markConsistent(anychart.ConsistencyState.ALL);
  this.hoverMarkers().markConsistent(anychart.ConsistencyState.ALL);

  goog.base(this, 'finalizeDrawing');
};


/**
 * Gets marker position.
 * @param {anychart.PointState|number} pointState If it is a hovered oe selected marker drawing.
 * @return {string} Position settings.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.getMarkersPosition = function(pointState) {
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
 * @param {anychart.PointState|number} pointState Point state.
 * @protected
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.drawMarker = function(pointState) {
  var iterator = this.getIterator();
  var index = iterator.getIndex();
  var marker = this.markers().getMarker(index);

  var selected = this.state.isStateContains(pointState, anychart.PointState.SELECT);
  var hovered = !selected && this.state.isStateContains(pointState, anychart.PointState.HOVER);
  var isDraw, markersFactory, pointMarker, stateMarker, markerEnabledState, stateMarkerEnabledState;

  pointMarker = iterator.get('marker');
  markerEnabledState = pointMarker && goog.isDef(pointMarker['enabled']) ? pointMarker['enabled'] : null;
  if (selected) {
    stateMarker = iterator.get('selectMarker');
    stateMarkerEnabledState = stateMarker && goog.isDef(stateMarker['enabled']) ? stateMarker['enabled'] : null;
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.selectMarkers());
  } else if (hovered) {
    stateMarker = iterator.get('hoverMarker');
    stateMarkerEnabledState = stateMarker && goog.isDef(stateMarker['enabled']) ? stateMarker['enabled'] : null;
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.hoverMarkers());
  } else {
    stateMarker = undefined;
    markersFactory = this.markers_;
  }

  if (selected || hovered) {
    isDraw = goog.isNull(stateMarkerEnabledState) ?
        goog.isNull(markersFactory.enabled()) ?
            goog.isNull(markerEnabledState) ?
                this.markers_.enabled() :
                markerEnabledState :
            markersFactory.enabled() :
        stateMarkerEnabledState;
  } else {
    isDraw = goog.isNull(markerEnabledState) ?
        this.markers_.enabled() :
        markerEnabledState;
  }

  if (isDraw) {
    var position = this.getMarkersPosition(pointState);

    var positionProvider = this.createPositionProvider(/** @type {anychart.enums.Position|string} */(position));
    if (marker) {
      marker.positionProvider(positionProvider);
    } else {
      marker = this.markers().add(positionProvider, index);
    }

    marker.resetSettings();
    marker.currentMarkersFactory(markersFactory);
    marker.setSettings(/** @type {Object} */(pointMarker), /** @type {Object} */(stateMarker));
    marker.draw();
  } else if (marker) {
    marker.clear();
  }
};


/**
 * Return marker color for series.
 * @return {!acgraph.vector.Fill} Marker color for series.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.getMarkerFill = function() {
  if (anychart.DEFAULT_THEME != 'v6')
    return anychart.color.setOpacity(this.getFinalFill(false, anychart.PointState.NORMAL), 1, false);
  else
    return this.getFinalFill(false, anychart.PointState.NORMAL);
};


/**
 * Return marker color for series.
 * @return {(string|acgraph.vector.Fill|acgraph.vector.Stroke)} Marker color for series.
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.getMarkerStroke = function() {
  return anychart.color.darken(this.markers().fill());
};


/**
 * @inheritDoc
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.getLegendItemData = function(itemsTextFormatter) {
  var data = goog.base(this, 'getLegendItemData', itemsTextFormatter);
  var markers = this.markers();
  markers.setAutoFill(this.getMarkerFill());
  markers.setAutoStroke(/** @type {acgraph.vector.Stroke} */(this.getMarkerStroke()));
  if (markers.enabled()) {
    data['iconMarkerType'] = data['iconMarkerType'] || markers.type();
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
 * @inheritDoc
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['markers'] = this.markers().serialize();
  json['hoverMarkers'] = this.hoverMarkers().serialize();
  json['selectMarkers'] = this.selectMarkers().serialize();
  return json;
};


/**
 * @inheritDoc
 */
anychart.core.cartesian.series.BaseWithMarkers.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.markers().setup(config['markers']);
  this.hoverMarkers().setup(config['hoverMarkers']);
  this.selectMarkers().setup(config['selectMarkers']);
};


//anychart.core.cartesian.series.BaseWithMarkers.prototype['startDrawing'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.startDrawing;//inherited
//anychart.core.cartesian.series.BaseWithMarkers.prototype['drawPoint'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.drawPoint;//inherited
//anychart.core.cartesian.series.BaseWithMarkers.prototype['finalizeDrawing'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.finalizeDrawing;//inherited
//exports
anychart.core.cartesian.series.BaseWithMarkers.prototype['markers'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.markers;//doc|ex
anychart.core.cartesian.series.BaseWithMarkers.prototype['hoverMarkers'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.hoverMarkers;//doc|ex
anychart.core.cartesian.series.BaseWithMarkers.prototype['selectMarkers'] = anychart.core.cartesian.series.BaseWithMarkers.prototype.selectMarkers;
