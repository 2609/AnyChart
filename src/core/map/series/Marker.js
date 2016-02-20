goog.provide('anychart.core.map.series.Marker');
goog.require('acgraph');
goog.require('anychart.core.map.series.Base');
goog.require('anychart.core.ui.MarkersFactory');
goog.require('anychart.enums');



/**
 * Marker series.
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Data for the series.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings
 * here as a hash map.
 * @constructor
 * @extends {anychart.core.map.series.Base}
 */
anychart.core.map.series.Marker = function(opt_data, opt_csvSettings) {
  goog.base(this, opt_data, opt_csvSettings);

  // Define reference fields for a series
  this.referenceValueNames = ['id', 'long', 'lat'];
  this.referenceValueMeanings = ['id', 'x', 'y'];

  /**
   * @type {anychart.core.ui.MarkersFactory}
   * @private
   */
  this.marker_ = new anychart.core.ui.MarkersFactory();
  // defaults that was deleted form MarkersFactory
  this.marker_.positionFormatter(anychart.utils.DEFAULT_FORMATTER);
  this.marker_.size(10);
  this.marker_.anchor(anychart.enums.Anchor.CENTER);
  this.marker_.offsetX(0);
  this.marker_.offsetY(0);
  this.marker_.rotation(0);
  this.marker_.setParentEventTarget(this);
  this.marker_.zIndex(anychart.core.map.series.Base.ZINDEX_SERIES);
  this.marker_.enabled(true);
  this.registerDisposable(this.marker_);

  this.hoverMarker_ = new anychart.core.ui.MarkersFactory();
  this.registerDisposable(this.hoverMarker_);

  this.selectMarker_ = new anychart.core.ui.MarkersFactory();
  this.registerDisposable(this.selectMarker_);

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
};
goog.inherits(anychart.core.map.series.Marker, anychart.core.map.series.Base);
anychart.core.map.series.Base.SeriesTypesMap[anychart.enums.MapSeriesType.MARKER] = anychart.core.map.series.Marker;


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.getType = function() {
  return anychart.enums.MapSeriesType.MARKER;
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.isDiscreteBased = function() {
  return true;
};


/**
 * Getter/setter for type.
 * @param {(string|anychart.enums.MarkerType|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.map.series.Marker|anychart.enums.MarkerType|string|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path} .
 */
anychart.core.map.series.Marker.prototype.type = function(opt_value) {
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


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.setAutoMarkerType = function(opt_value) {
  this.autoMarkerType_ = opt_value;
};


/**
 * Getter/setter for hoverType.
 * @param {(string|anychart.enums.MarkerType|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.map.series.Marker|anychart.enums.MarkerType|string|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path} .
 */
anychart.core.map.series.Marker.prototype.hoverType = function(opt_value) {
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
 * Getter/setter for current selected marker type settings.
 * @param {(string|anychart.enums.MarkerType|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path)=} opt_value .
 * @return {!anychart.core.map.series.Marker|anychart.enums.MarkerType|string|
 *          function(acgraph.vector.Path, number, number, number):acgraph.vector.Path} .
 */
anychart.core.map.series.Marker.prototype.selectType = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (!goog.isFunction(opt_value))
      opt_value = anychart.enums.normalizeMarkerType(opt_value);
    if (this.selectType_ != opt_value) {
      this.selectType_ = opt_value;
    }
    return this;
  } else {
    return this.selectType_;
  }
};


/**
 * Getter/setter for size.
 * @param {number=} opt_value .
 * @return {anychart.core.map.series.Marker|number} .
 */
anychart.core.map.series.Marker.prototype.size = function(opt_value) {
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
 * Getter/setter for hoverSize.
 * @param {number=} opt_value .
 * @return {anychart.core.map.series.Marker|number} .
 */
anychart.core.map.series.Marker.prototype.hoverSize = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.hoverSize_ != opt_value) {
      this.hoverSize_ = opt_value;
    }
    return this;
  } else {
    return this.hoverSize_;
  }
};


/**
 * Getter/setter for selected marker size
 * @ignoreDoc
 * @param {number=} opt_value .
 * @return {anychart.core.map.series.Marker|number} .
 */
anychart.core.map.series.Marker.prototype.selectSize = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (this.selectSize_ != opt_value) {
      this.selectSize_ = opt_value;
    }
    return this;
  } else {
    return this.selectSize_;
  }
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.remove = function() {
  if (this.markers_)
    this.markers_.container(null);

  goog.base(this, 'remove');
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.startDrawing = function() {
  goog.base(this, 'startDrawing');
  if (this.isConsistent() || !this.enabled()) return;

  this.marker_.suspendSignalsDispatching();
  this.marker_.clear();

  if (this.hasInvalidationState(anychart.ConsistencyState.Z_INDEX)) {
    /** @type {acgraph.vector.Element} */(this.rootLayer).zIndex(/** @type {number} */(this.zIndex()));
    this.markConsistent(anychart.ConsistencyState.Z_INDEX);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.marker_.fill(this.getFinalFill(false, anychart.PointState.NORMAL));
    this.marker_.stroke(this.getFinalStroke(false, anychart.PointState.NORMAL));
    this.marker_.type(/** @type {anychart.enums.MarkerType} */(this.type()));
    this.marker_.size(this.size_);

    this.hoverMarker_.fill(this.getFinalFill(false, anychart.PointState.HOVER));
    this.hoverMarker_.stroke(this.getFinalStroke(false, anychart.PointState.HOVER));
    this.hoverMarker_.type(/** @type {anychart.enums.MarkerType} */(this.hoverType_));
    this.hoverMarker_.size(this.hoverSize_);

    this.selectMarker_.fill(this.getFinalFill(false, anychart.PointState.SELECT));
    this.selectMarker_.stroke(this.getFinalStroke(false, anychart.PointState.SELECT));
    this.selectMarker_.type(/** @type {anychart.enums.MarkerType} */(this.selectType_));
    this.selectMarker_.size(this.selectSize_);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.CONTAINER)) {
    this.rootLayer.parent(/** @type {acgraph.vector.ILayer} */(this.container()));
    this.marker_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
    if (this.hatchFillElement_)
      this.hatchFillElement_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    var hatchFill = this.getFinalHatchFill(false, anychart.PointState.NORMAL);
    var hoverHatchFill = this.getFinalHatchFill(false, anychart.PointState.HOVER);
    var selectHatchFill = this.getFinalHatchFill(false, anychart.PointState.SELECT);

    this.createHatchFill_(!(anychart.utils.isNone(hatchFill) && anychart.utils.isNone(hoverHatchFill) && anychart.utils.isNone(selectHatchFill)));
  }
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.applyZoomMoveTransform = function(positionProvider) {
  var domElement, prevPos, newPos, trX, trY, selfTx;
  var iterator = this.getIterator();
  var index = iterator.getIndex();

  var marker = this.marker_.getMarker(index);
  if (marker && marker.getDomElement() && marker.positionProvider()) {
    prevPos = marker.positionProvider()['value'];
    newPos = positionProvider['value'];

    domElement = marker.getDomElement();
    selfTx = domElement.getSelfTransformation();

    trX = -selfTx.getTranslateX() + newPos['x'] - prevPos['x'];
    trY = -selfTx.getTranslateY() + newPos['y'] - prevPos['y'];

    domElement.translate(trX, trY);
  }


  var hatchFill = this.hatchFillElement_ && this.hatchFillElement_.getMarker(index);
  if (hatchFill && hatchFill.getDomElement() && hatchFill.positionProvider()) {
    prevPos = hatchFill.positionProvider()['value'];
    newPos = positionProvider['value'];

    domElement = hatchFill.getDomElement();
    selfTx = domElement.getSelfTransformation();

    trX = -selfTx.getTranslateX() + newPos['x'] - prevPos['x'];
    trY = -selfTx.getTranslateY() + newPos['y'] - prevPos['y'];

    domElement.translate(trX, trY);
  }

  anychart.core.map.series.Marker.base(this, 'applyZoomMoveTransform', positionProvider);
};


/**
 * Creates hatch fill.
 * @param {boolean} value Whether create hatch fill.
 * @private
 */
anychart.core.map.series.Marker.prototype.createHatchFill_ = function(value) {
  if (!this.hatchFillElement_ && value) {
    this.hatchFillElement_ = new anychart.core.ui.MarkersFactory();
    this.hatchFillElement_.container(/** @type {acgraph.vector.ILayer} */(this.rootLayer));
    this.hatchFillElement_.zIndex(anychart.core.map.series.Base.ZINDEX_HATCH_FILL);
    this.hatchFillElement_.disablePointerEvents(true);
  }
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.drawPoint = function(pointState) {
  pointState = this.state.getSeriesState() | pointState;
  if (this.hasInvalidationState(anychart.ConsistencyState.APPEARANCE)) {
    this.drawMarker_(pointState);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SERIES_HATCH_FILL)) {
    this.applyHatchFill(pointState);
  }

  goog.base(this, 'drawPoint', pointState);
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.finalizeDrawing = function() {
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
anychart.core.map.series.Marker.prototype.createPositionProvider = function(position) {
  var scale = this.map.scale();
  var iterator = this.getIterator();
  var fail = false;

  var id = iterator.get(this.referenceValueNames[0]);
  var x = iterator.get(this.referenceValueNames[1]);
  var y = iterator.get(this.referenceValueNames[2]);

  var arrayMappingWithRegion = anychart.utils.isNaN(x) && x == id;

  x = anychart.utils.toNumber(x);
  y = anychart.utils.toNumber(y);

  var txCoords = scale.transform(x, y);
  if (!isNaN(x))
    x = txCoords[0];
  if (!isNaN(y) && !arrayMappingWithRegion)
    y = txCoords[1];

  if (isNaN(x) || isNaN(y)) {
    var prop = iterator.meta('regionProperties');
    if (prop) {
      iterator.meta('regionId', id);
      var pos = this.getPositionByRegion()['value'];
      if (isNaN(x))
        x = pos['x'];
      if (isNaN(y) || arrayMappingWithRegion)
        y = pos['y'];
    } else {
      fail = true;
    }
  }

  return fail ? null : {'value': {'x': x, 'y': y}};
};


/**
 * Draws marker for the point.
 * @param {anychart.PointState|number} pointState Point state.
 * @param {boolean=} opt_updateMarker Redraw marker.
 * @private
 */
anychart.core.map.series.Marker.prototype.drawMarker_ = function(pointState, opt_updateMarker) {
  var pointType = this.getIterator().get('type');
  var pointSize = this.getIterator().get('markerSize');
  var pointFill = this.getFinalFill(true, anychart.PointState.NORMAL);
  var pointStroke = this.getFinalStroke(true, anychart.PointState.NORMAL);

  var pointHoverType = this.getIterator().get('hoverType');
  var pointHoverSize = this.getIterator().get('hoverMarkerSize');
  var pointHoverFill = this.getFinalFill(true, anychart.PointState.HOVER);
  var pointHoverStroke = this.getFinalStroke(true, anychart.PointState.HOVER);

  var pointSelectType = this.getIterator().get('selectType');
  var pointSelectSize = this.getIterator().get('selectMarkerSize');
  var pointSelectFill = this.getFinalFill(true, anychart.PointState.SELECT);
  var pointSelectStroke = this.getFinalStroke(true, anychart.PointState.SELECT);

  var selected = this.state.isStateContains(pointState, anychart.PointState.SELECT);
  var hovered = !selected && this.state.isStateContains(pointState, anychart.PointState.HOVER);

  var markersFactory;
  if (selected) {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.selectMarker_);
  } else if (hovered) {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.hoverMarker_);
  } else {
    markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.marker_);
  }

  var settings = {
    'type': pointType,
    'size': pointSize,
    'fill': pointFill,
    'stroke': pointStroke
  };
  var settingsHover = {
    'type': pointHoverType,
    'size': pointHoverSize,
    'fill': pointHoverFill,
    'stroke': pointHoverStroke
  };
  var settingsSelect = {
    'type': pointSelectType,
    'size': pointSelectSize,
    'fill': pointSelectFill,
    'stroke': pointSelectStroke
  };

  var index = this.getIterator().getIndex();
  var positionProvider = this.createPositionProvider(anychart.enums.Position.CENTER);
  var marker = this.marker_.getMarker(index) || this.marker_.add(positionProvider, index);
  marker.resetSettings();
  marker.currentMarkersFactory(markersFactory);

  marker.setSettings(settings, /** @type {Object} */(hovered ? settingsHover : settingsSelect));
  marker.positionProvider(positionProvider);

  if (opt_updateMarker) marker.draw();
};


/**
 * Apply hatch fill to shape in accordance to current point colorization settings.
 * Shape is get from current meta 'hatchFillShape'.
 * @param {anychart.PointState|number} pointState Point state.
 * @protected
 */
anychart.core.map.series.Marker.prototype.applyHatchFill = function(pointState) {
  if (!this.hatchFillElement_) {
    var pointHatchFill = this.getFinalHatchFill(true, pointState);
    this.createHatchFill_(!anychart.utils.isNone(pointHatchFill));
  }

  if (this.hatchFillElement_) {
    var iterator = this.getIterator();
    var index = iterator.getIndex();

    var pointType = iterator.get('type');
    var pointSize = iterator.get('markerSize');

    var pointHoverType = iterator.get('hoverType');
    var pointHoverSize = iterator.get('hoverMarkerSize');

    var pointSelectType = this.getIterator().get('selectType');
    var pointSelectSize = this.getIterator().get('selectMarkerSize');

    var selected = this.state.isStateContains(pointState, anychart.PointState.SELECT);
    var hovered = !selected && this.state.isStateContains(pointState, anychart.PointState.HOVER);

    var markersFactory;
    if (selected) {
      markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.selectMarker_);
    } else if (hovered) {
      markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.hoverMarker_);
    } else {
      markersFactory = /** @type {anychart.core.ui.MarkersFactory} */(this.marker_);
    }

    var hatchFill = this.hatchFillElement_.add(this.createPositionProvider(anychart.enums.Position.CENTER), index);

    var settings = {
      'type': pointType,
      'size': pointSize,
      'fill': this.getFinalHatchFill(true, pointState),
      'stroke': null
    };
    var settingsHover = {
      'type': pointHoverType,
      'size': pointHoverSize,
      'fill': this.getFinalHatchFill(true, pointState),
      'stroke': null
    };
    var settingsSelect = {
      'type': pointSelectType,
      'size': pointSelectSize,
      'fill': this.getFinalHatchFill(true, pointState),
      'stroke': null
    };


    hatchFill.resetSettings();

    hatchFill.parentMarkersFactory(this.marker_);
    hatchFill.currentMarkersFactory(markersFactory);
    hatchFill.setSettings(settings, /** @type {Object} */(hovered ? settingsHover : settingsSelect));

    hatchFill.draw();
  }
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.applyAppearanceToPoint = function(pointState) {
  this.drawMarker_(pointState, true);
  this.applyHatchFill(pointState);
  this.drawLabel(pointState);
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.applyAppearanceToSeries = function(pointState) {
  this.drawMarker_(pointState, true);
  this.applyHatchFill(pointState);
};


/** @inheritDoc */
anychart.core.map.series.Marker.prototype.getLegendIconType = function() {
  var markerDrawer = anychart.enums.getMarkerDrawer(this.type());
  return function(path, size) {
    return markerDrawer(path, size / 2, size / 2, size / 2);
  };
};


/**
 * @inheritDoc
 */
anychart.core.map.series.Marker.prototype.serialize = function() {
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

  if (goog.isFunction(this.selectType())) {
    anychart.utils.warning(
        anychart.enums.WarningCode.CANT_SERIALIZE_FUNCTION,
        null,
        ['Marker selectType']
    );
  } else if (goog.isDef(this.selectType())) {
    json['selectType'] = this.selectType();
  }

  json['size'] = this.size();
  json['hoverSize'] = this.hoverSize();
  json['selectSize'] = this.selectSize();
  return json;
};


/**
 * @inheritDoc
 */
anychart.core.map.series.Marker.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.size(config['size']);
  this.hoverSize(config['hoverSize']);
  this.selectSize(config['selectSize']);
  this.type(config['type']);
  this.hoverType(config['hoverType']);
  this.selectType(config['hoverType']);
};


//exports
anychart.core.map.series.Marker.prototype['stroke'] = anychart.core.map.series.Marker.prototype.stroke;//inherited
anychart.core.map.series.Marker.prototype['hoverStroke'] = anychart.core.map.series.Marker.prototype.hoverStroke;//inherited
anychart.core.map.series.Marker.prototype['selectStroke'] = anychart.core.map.series.Marker.prototype.selectStroke;//inherited

anychart.core.map.series.Marker.prototype['fill'] = anychart.core.map.series.Marker.prototype.fill;//inherited
anychart.core.map.series.Marker.prototype['hoverFill'] = anychart.core.map.series.Marker.prototype.hoverFill;//inherited
anychart.core.map.series.Marker.prototype['selectFill'] = anychart.core.map.series.Marker.prototype.selectFill;//inherited

anychart.core.map.series.Marker.prototype['size'] = anychart.core.map.series.Marker.prototype.size;//doc|ex
anychart.core.map.series.Marker.prototype['hoverSize'] = anychart.core.map.series.Marker.prototype.hoverSize;//doc|ex
anychart.core.map.series.Marker.prototype['selectSize'] = anychart.core.map.series.Marker.prototype.selectSize;

anychart.core.map.series.Marker.prototype['type'] = anychart.core.map.series.Marker.prototype.type;//doc|ex
anychart.core.map.series.Marker.prototype['hoverType'] = anychart.core.map.series.Marker.prototype.hoverType;//doc|ex
anychart.core.map.series.Marker.prototype['selectType'] = anychart.core.map.series.Marker.prototype.selectType;

anychart.core.map.series.Marker.prototype['hatchFill'] = anychart.core.map.series.Marker.prototype.hatchFill;//inherited
anychart.core.map.series.Marker.prototype['hoverHatchFill'] = anychart.core.map.series.Marker.prototype.hoverHatchFill;//inherited
anychart.core.map.series.Marker.prototype['selectHatchFill'] = anychart.core.map.series.Marker.prototype.selectHatchFill;//inherited

