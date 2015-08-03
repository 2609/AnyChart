goog.provide('anychart.core.map.series.BaseWithMarkers');
goog.require('acgraph');
goog.require('anychart.core.map.series.Base');
goog.require('anychart.core.ui.MarkersFactory');
goog.require('anychart.enums');



/**
 * A base for all series except marker series.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 * here as a hash map.
 * @constructor
 * @extends {anychart.core.map.series.Base}
 */
anychart.core.map.series.BaseWithMarkers = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);
};
goog.inherits(anychart.core.map.series.BaseWithMarkers, anychart.core.map.series.Base);


/**
 * Supported consistency states.
 * @type {number}
 */
anychart.core.map.series.BaseWithMarkers.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.map.series.Base.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.SERIES_MARKERS;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.map.series.BaseWithMarkers.prototype.markers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.map.series.BaseWithMarkers.prototype.hoverMarkers_ = null;


/**
 * @type {anychart.core.ui.MarkersFactory}
 * @private
 */
anychart.core.map.series.BaseWithMarkers.prototype.selectMarkers_ = null;


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.hasMarkers = function() {
  return true;
};


/**
 * Checks whether a markersFactory instance already exist.
 * @return {boolean}
 */
anychart.core.map.series.BaseWithMarkers.prototype.isMarkersInit = function() {
  return !!this.markers_;
};


/**
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.map.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.map.series.BaseWithMarkers.prototype.markers = function(opt_value) {
  //If you invoke this method, you create markersFactory instance. If you don't want to create the instance,
  // use isMarkersInit method to check whether a markersFactory instance already exist.
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
 * @param {(Object|boolean|null|string)=} opt_value Series data markers settings.
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.map.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.map.series.BaseWithMarkers.prototype.hoverMarkers = function(opt_value) {
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
 * @return {!(anychart.core.ui.MarkersFactory|anychart.core.map.series.BaseWithMarkers)} Markers instance or itself for chaining call.
 */
anychart.core.map.series.BaseWithMarkers.prototype.selectMarkers = function(opt_value) {
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
anychart.core.map.series.BaseWithMarkers.prototype.markersInvalidated_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    this.invalidate(anychart.ConsistencyState.SERIES_MARKERS, anychart.Signal.NEEDS_REDRAW | anychart.Signal.NEED_UPDATE_LEGEND);
  }
};


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.setAutoMarkerType = function(opt_value) {
  this.autoMarkerType_ = opt_value;
};


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.remove = function() {
  if (this.markers_)
    this.markers_.container(null);

  goog.base(this, 'remove');
};


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.startDrawing = function() {
  goog.base(this, 'startDrawing');

  if (this.markers_ || this.hoverMarkers_ || this.selectMarkers_) {
    this.markers().suspendSignalsDispatching();
    this.hoverMarkers().suspendSignalsDispatching();
    this.selectMarkers().suspendSignalsDispatching();

    var markers = this.markers_;

    markers.setAutoType(this.autoMarkerType_);
    markers.setAutoZIndex(anychart.charts.Map.ZINDEX_CHORPLETH_MARKERS);

    var fillColor = this.getMarkerFill();
    markers.setAutoFill(fillColor);

    var strokeColor = /** @type {acgraph.vector.Stroke} */(this.getMarkerStroke());
    markers.setAutoStroke(strokeColor);

    markers.clear();
    markers.container(/** @type {acgraph.vector.ILayer} */(this.container()));
    markers.parentBounds(this.container().getBounds());
  }
};


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.drawPoint = function(pointState) {
  goog.base(this, 'drawPoint', pointState);
  this.drawMarker(pointState);
};


/** @inheritDoc */
anychart.core.map.series.BaseWithMarkers.prototype.finalizeDrawing = function() {
  if (this.markers_) {
    this.markers_.draw();
    this.markers_.resumeSignalsDispatching(false);
    this.markers_.markConsistent(anychart.ConsistencyState.ALL);
  }

  if (this.hoverMarkers_) {
    this.hoverMarkers_.resumeSignalsDispatching(false);
    this.hoverMarkers_.markConsistent(anychart.ConsistencyState.ALL);
  }

  if (this.selectMarkers_) {
    this.selectMarkers_.resumeSignalsDispatching(false);
    this.selectMarkers_.markConsistent(anychart.ConsistencyState.ALL);
  }

  //if (this.clip()) {
  //  var bounds = /** @type {!anychart.math.Rect} */(goog.isBoolean(this.clip()) ? this.pixelBoundsCache : this.clip());
  //  var markerDOM = this.markers().getDomElement();
  //  if (markerDOM) markerDOM.clip(/** @type {acgraph.math.Rect} */(bounds));
  //}

  goog.base(this, 'finalizeDrawing');
};


/**
 * Draws marker for the point.
 * @param {anychart.enums.AnyMapPointState} pointState If it is a hovered oe selected marker drawing.
 * @protected
 */
anychart.core.map.series.BaseWithMarkers.prototype.drawMarker = function(pointState) {
  if (!this.markers_) return;
  var iterator = this.getIterator();

  var selected = pointState == anychart.enums.AnyMapPointState.SELECT;
  var hovered = pointState == anychart.enums.AnyMapPointState.HOVER;

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

  var marker = this.markers_.getMarker(index);

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

  if (isDraw) {
    var positionProvider = this.createPositionProvider();
    if (marker) {
      marker.positionProvider(positionProvider);
    } else {
      marker = this.markers_.add(positionProvider, index);
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
 * @inheritDoc
 */
anychart.core.map.series.BaseWithMarkers.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  if (this.markers_)
    json['markers'] = this.markers_.serialize();
  if (this.hoverMarkers_)
    json['hoverMarkers'] = this.hoverMarkers_.serialize();
  if (this.selectMarkers_)
    json['selectMarkers'] = this.selectMarkers_.serialize();
  return json;
};


/**
 * @inheritDoc
 */
anychart.core.map.series.BaseWithMarkers.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  if (config['markers'])
    this.markers(config['markers']);
  if (config['hoverMarkers'])
    this.hoverMarkers(config['hoverMarkers']);
  if (config['selectMarkers'])
    this.hoverMarkers(config['selectMarkers']);
};


/**
 * Return marker color for series.
 * @return {!acgraph.vector.Fill} Marker color for series.
 */
anychart.core.map.series.BaseWithMarkers.prototype.getMarkerFill = function() {
  return this.getFinalFill(false, anychart.enums.AnyMapPointState.NORMAL);
};


/**
 * Return marker color for series.
 * @return {(null|acgraph.vector.Fill|acgraph.vector.Stroke)} Marker color for series.
 */
anychart.core.map.series.BaseWithMarkers.prototype.getMarkerStroke = function() {
  return this.markers_ ? anychart.color.darken(/** @type {acgraph.vector.Fill} */(this.markers_.fill())) : null;
};


/**
 * @inheritDoc
 */
anychart.core.map.series.BaseWithMarkers.prototype.getLegendItemData = function(itemsTextFormatter) {
  var data = goog.base(this, 'getLegendItemData', itemsTextFormatter);
  var markers = this.markers();
  markers.setAutoFill(this.getMarkerFill());
  markers.setAutoStroke(/** @type {acgraph.vector.Stroke} */(this.getMarkerStroke()));
  if (markers.enabled()) {
    data['iconMarkerType'] = data['iconMarkerType'] || markers.type();
    data['iconMarkerFill'] = data['iconMarkerFill'] || markers.fill();
    data['iconMarkerStroke'] = data['iconMarkerStroke'] || markers.stroke();
  }
  return data;
};



//anychart.core.map.series.BaseWithMarkers.prototype['startDrawing'] = anychart.core.map.series.BaseWithMarkers.prototype.startDrawing;//inherited
//anychart.core.map.series.BaseWithMarkers.prototype['drawPoint'] = anychart.core.map.series.BaseWithMarkers.prototype.drawPoint;//inherited
//anychart.core.map.series.BaseWithMarkers.prototype['finalizeDrawing'] = anychart.core.map.series.BaseWithMarkers.prototype.finalizeDrawing;//inherited
//exports
anychart.core.map.series.BaseWithMarkers.prototype['markers'] = anychart.core.map.series.BaseWithMarkers.prototype.markers;//doc|ex
anychart.core.map.series.BaseWithMarkers.prototype['hoverMarkers'] = anychart.core.map.series.BaseWithMarkers.prototype.hoverMarkers;//doc|ex
anychart.core.map.series.BaseWithMarkers.prototype['selectMarkers'] = anychart.core.map.series.BaseWithMarkers.prototype.selectMarkers;//doc|ex
