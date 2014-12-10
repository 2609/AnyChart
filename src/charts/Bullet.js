goog.provide('anychart.charts.Bullet');

goog.require('anychart.core.Chart');
goog.require('anychart.core.axes.Linear');
goog.require('anychart.core.axisMarkers.Range');
goog.require('anychart.core.bullet.Marker');
goog.require('anychart.enums');
goog.require('anychart.palettes.DistinctColors');
goog.require('anychart.palettes.Markers');
goog.require('anychart.palettes.RangeColors');
goog.require('anychart.scales');
goog.require('anychart.utils');



/**
 * Bullet chart c§lass.<br/>
 * <b>Note:</b> Use these methods to get an instance of this class:
 *  <ul>
 *      <li>{@link anychart.bullet}</li>
 *      <li>{@link anychart.bullet}</li>
 *  </ul>
 * @constructor
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_data Bullet Chart data.
 * @extends {anychart.core.Chart}
 */
anychart.charts.Bullet = function(opt_data) {
  goog.base(this);

  /**
   * @type {Array.<anychart.core.axisMarkers.Range>}
   * @private
   */
  this.ranges_ = [];

  /**
   * @type {Array.<anychart.core.bullet.Marker>}
   * @private
   */
  this.markers_ = [];

  /**
   * Layout of bullet chart.
   * @type {anychart.enums.Layout}
   * @private
   */
  this.layout_ = anychart.enums.Layout.HORIZONTAL;

  this.data(opt_data || null);


  //default settings
  this.axis().stroke('0 black');
  this.background().enabled(false);
  this.legend().enabled(false);
  this.margin(10);
  var title = /** @type {anychart.core.ui.Title} */(this.title());
  title.text('Chart title');
  title.enabled(true);
  title.setDefaultRotation(0);
};
goog.inherits(anychart.charts.Bullet, anychart.core.Chart);


/**
 * Supported consistency states. Adds AXES, AXES_MARKERS, GRIDS to anychart.core.Chart states.
 * @type {number}
 */
anychart.charts.Bullet.prototype.SUPPORTED_CONSISTENCY_STATES =
    anychart.core.Chart.prototype.SUPPORTED_CONSISTENCY_STATES |
    anychart.ConsistencyState.SCALES |        // scale calculation
    anychart.ConsistencyState.AXES |          // axis
    anychart.ConsistencyState.AXES_MARKERS |  // ranges
    anychart.ConsistencyState.MARKERS |        // value markers
    anychart.ConsistencyState.DATA;           //chart data


/**
 * Markers z-index.
 * @type {number}
 */
anychart.charts.Bullet.ZINDEX_MARKER = 2;


/**
 * Ranges z-index.
 * @type {number}
 */
anychart.charts.Bullet.ZINDEX_RANGES = 2;


/**
 * Axis z-index.
 * @type {number}
 */
anychart.charts.Bullet.ZINDEX_AXIS = 3;


/**
 * Getter for chart data.
 * @return {!anychart.data.View} {@link anychart.data.View} instance for method chaining.
 *//**
 * Setter for chart data.<br/>
 * <b>Note:</b> All data is markers values.
 * @example <c>Simple markers</c><t>simple-h100</t>
 * var bulletChart = anychart.bullet([10, 7, 11]);
 * bulletChart.range().from(0).to(6);
 * bulletChart.range(1).from(6).to(12);
 * bulletChart.container(stage).draw();
 * @example <c>Advanced markers</c><t>simple-h100</t>
 * var bulletChart = anychart.bullet([
 *    {value: 9, type: 'bar', fill: 'blue 0.5', gap: 0.3},
 *    {value: 10, type: 'X', stroke: 'blue 4'},
 * ]);
 * bulletChart.range().from(0).to(6);
 * bulletChart.range(1).from(6).to(12);
 * bulletChart.container(stage).draw();
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.data.View|anychart.data.Set|Array|string)=} opt_value Value to set.
 * @param {Object.<string, (string|boolean)>=} opt_csvSettings If CSV string is passed, you can pass CSV parser settings here as a hash map.
 * @return {!(anychart.charts.Bullet|anychart.data.View)} Returns itself if used as a setter or the mapping if used as a getter.
 */
anychart.charts.Bullet.prototype.data = function(opt_value, opt_csvSettings) {
  if (goog.isDef(opt_value)) {
    if (opt_value instanceof anychart.data.View) {
      this.data_ = opt_value.derive(); // deriving a view to avoid interference with other view users
    } else if (opt_value instanceof anychart.data.Set) {
      this.data_ = opt_value.mapAs();
    } else {
      opt_value = goog.isArray(opt_value) || goog.isString(opt_value) ? opt_value : null;
      this.data_ = new anychart.data.Set(opt_value, opt_csvSettings).mapAs();
    }
    this.data_.listenSignals(this.dataInvalidated_, this);
    this.invalidate(
        anychart.ConsistencyState.DATA |
            anychart.ConsistencyState.SCALES |
            anychart.ConsistencyState.AXES |
            anychart.ConsistencyState.MARKERS |
            anychart.ConsistencyState.AXES_MARKERS,
        anychart.Signal.NEEDS_REDRAW
    );
    return this;
  }
  return this.data_;
};


/**
 * Listens to data invalidation.
 * @param {anychart.SignalEvent} e
 * @private
 */
anychart.charts.Bullet.prototype.dataInvalidated_ = function(e) {
  if (e.hasSignal(anychart.Signal.DATA_CHANGED)) {
    this.invalidate(
        anychart.ConsistencyState.DATA |
            anychart.ConsistencyState.SCALES |
            anychart.ConsistencyState.AXES |
            anychart.ConsistencyState.MARKERS |
            anychart.ConsistencyState.AXES_MARKERS,
        anychart.Signal.NEEDS_REDRAW
    );
  }
};


/**
 * Getter for bullet chart layout.
 * @return {anychart.enums.Layout} Current chart layout.
 *//**
 * Setter for bullet chart layout.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.layout('horizontal');
 * bulletChart.range().from(0).to(10);
 * bulletChart.range(1).from(10).to(20);
 * bulletChart.container(stage).draw();
 * @param {(string|anychart.enums.Layout)=} opt_value [{@link anychart.enums.Layout}.HORIZONTAL] Value to set.
 * @return {anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * Getter/setter for bullet chart layout.
 * @param {(string|anychart.enums.Layout)=} opt_value [{@link anychart.enums.Layout}.HORIZONTAL] Layout for bullet chart.
 * @return {anychart.enums.Layout|anychart.charts.Bullet} Layout of bullet chart of self for method chaining.
 */
anychart.charts.Bullet.prototype.layout = function(opt_value) {
  if (goog.isDef(opt_value)) {
    opt_value = anychart.enums.normalizeLayout(opt_value, anychart.enums.Layout.HORIZONTAL);
    if (this.layout_ != opt_value) {
      this.layout_ = opt_value;
      this.invalidate(
          anychart.ConsistencyState.AXES |
              anychart.ConsistencyState.TITLE |
              anychart.ConsistencyState.MARKERS |
              anychart.ConsistencyState.AXES_MARKERS |
              anychart.ConsistencyState.BOUNDS,
          anychart.Signal.NEEDS_REDRAW |
              anychart.Signal.BOUNDS_CHANGED
      );
    }
    return this;
  }
  return this.layout_;
};


/**
 * Update Bullet Chart internal elements default layout settings depend on Bullet Chart layout.
 */
anychart.charts.Bullet.prototype.updateLayoutDefaults = function() {
  var i, count, rangeLayout;
  var isHorizontal = this.isHorizontal();
  var markersLayout = /** @type {anychart.enums.Layout} */(this.layout());
  var title = this.title();
  title.setDefaultRotation(0);
  var axis = this.axis();

  if (isHorizontal) {
    rangeLayout = anychart.enums.Layout.VERTICAL;
    axis.setDefaultOrientation(anychart.enums.Orientation.BOTTOM);
    title.setDefaultOrientation(anychart.enums.Orientation.LEFT);
  } else {
    axis.setDefaultOrientation(anychart.enums.Orientation.LEFT);
    title.setDefaultOrientation(anychart.enums.Orientation.BOTTOM);
    rangeLayout = anychart.enums.Layout.HORIZONTAL;
  }

  for (i = 0, count = this.ranges_.length; i < count; i++) {
    var range = this.ranges_[i];
    if (range) {
      range.setDefaultLayout(rangeLayout);
    }
  }

  for (i = 0, count = this.markers_.length; i < count; i++) {
    var marker = this.markers_[i];
    marker.setDefaultLayout(markersLayout);
  }
};


/**
 * Whether an bullet chart is horizontal.
 * @return {boolean} If the bullet chart is horizontal.
 */
anychart.charts.Bullet.prototype.isHorizontal = function() {
  return (this.layout_ == anychart.enums.Layout.HORIZONTAL);
};


/**
 * Getter for default bullet chart scale settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range().from(0).to(10);
 * bulletChart.range(1).from(10).to(20);
 * bulletChart.scale().minimum(10).maximum(15);
 * bulletChart.container(stage).draw();
 * @return {!anychart.scales.Base} {@link anychart.scales.Base} instance for method chaining.
 *//**
 * Setter for default bullet chart scale settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range().from(0).to(10);
 * bulletChart.range(1).from(10).to(20);
 * bulletChart.scale('linear');
 * bulletChart.container(stage).draw();
 * @param {(anychart.scales.Base|anychart.enums.ScaleTypes)=} opt_value Scale to set or Sclae type.<br/>
 *  Also accepts 'log', 'linear', 'dateTime' and 'ordinal' strings.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.scales.Base|anychart.enums.ScaleTypes)=} opt_value Scale to set.
 * @return {!(anychart.scales.Base|anychart.charts.Bullet)} Default chart scale value or itself for method chaining.
 */
anychart.charts.Bullet.prototype.scale = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (goog.isString(opt_value)) {
      opt_value = anychart.scales.Base.fromString(opt_value, false);
    }
    if (this.scale_ != opt_value) {
      this.scale_ = opt_value;
      this.invalidate(
          anychart.ConsistencyState.SCALES |
              anychart.ConsistencyState.AXES |
              anychart.ConsistencyState.MARKERS |
              anychart.ConsistencyState.AXES_MARKERS,
          anychart.Signal.NEEDS_REDRAW
      );
    }
    return this;
  } else {
    if (!this.scale_) {
      this.scale_ = new anychart.scales.Linear();
      this.scale_.minimumGap(0);
      this.scale_.maximumGap(0);
      this.scale_.ticks().count(3, 5);
    }
    return this.scale_;
  }
};


/**
 * Getter for default bullet chart axis settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range().from(0).to(10);
 * bulletChart.range(1).from(10).to(20);
 * bulletChart.axis()
 *    .orientation('top')
 *    .stroke('red')
 *    .title(null);
 * bulletChart.container(stage).draw();
 * @return {!anychart.core.axes.Linear} {@link anychart.core.axes.Linear} instance for method chaining.
 *//**
 * Setter for default bullet chart axis settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range().from(0).to(10);
 * bulletChart.range(1).from(10).to(20);
 * bulletChart.axis(null);
 * bulletChart.container(stage).draw();
 * @param {(Object|boolean|null)=} opt_value Scale to set.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * Getter/setter for bullet chart axis.
 * @param {(Object|boolean|null)=} opt_value
 * @return {!(anychart.core.axes.Linear|anychart.charts.Bullet)}
 */
anychart.charts.Bullet.prototype.axis = function(opt_value) {
  if (!this.axis_) {
    this.axis_ = new anychart.core.axes.Linear();
    this.axis_.zIndex(anychart.charts.Bullet.ZINDEX_AXIS);
    this.axis_.title().enabled(false);
    this.registerDisposable(this.axis_);
    this.axis_.listenSignals(this.onAxisSignal_, this);
    this.invalidate(
        anychart.ConsistencyState.AXES |
            anychart.ConsistencyState.MARKERS |
            anychart.ConsistencyState.AXES_MARKERS |
            anychart.ConsistencyState.BOUNDS,
        anychart.Signal.NEEDS_REDRAW |
            anychart.Signal.BOUNDS_CHANGED
    );
  }

  if (goog.isDef(opt_value)) {
    this.axis_.setup(opt_value);
    return this;
  } else {
    return this.axis_;
  }
};


/**
 * Listener for axes invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.charts.Bullet.prototype.onAxisSignal_ = function(event) {
  var state = 0;
  var signal = 0;
  if (event.hasSignal(anychart.Signal.NEEDS_REDRAW)) {
    state |= anychart.ConsistencyState.AXES;
    signal |= anychart.Signal.NEEDS_REDRAW;
  }
  if (event.hasSignal(anychart.Signal.BOUNDS_CHANGED)) {
    state |= anychart.ConsistencyState.BOUNDS;
  }
  // if there are no signals, state == 0 and nothing happens.
  this.invalidate(state, signal);
};


/**
 * Getter for bullet chart ranges settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range(0)
 *    .from(0).to(10)
 *    .fill('red 0.2')
 *    .layout('vertical');
 * bulletChart.range(1)
 *    .from(10).to(20)
 *    .fill('yellow 0.2')
 *    .layout('vertical');
 * bulletChart.container(stage).draw();
 * @param {number=} opt_index [0] Chart range index.
 * @return {!anychart.core.axisMarkers.Range} {@link anychart.core.axisMarkers.Range} instance for method chaining.
 *//**
 * Setter for bullet chart first range settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range({
 *    from: 0,
 *    to: 15,
 *    fill: 'green 0.2',
 *    layout: 'vertical'
 * });
 * bulletChart.container(stage).draw();
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * Setter for bullet chart ranges settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range(0, {
 *    from: 0,
 *    to: 15,
 *    fill: 'green 0.2',
 *    layout: 'vertical'
 * });
 * bulletChart.range(1, {
 *    from: 15,
 *    to: 25,
 *    fill: 'blue 0.2',
 *    layout: 'vertical'
 * });
 * bulletChart.container(stage).draw();
 * @param {number=} opt_index [0] Index of range.
 * @param {(Object|boolean|null)=} opt_value Value to set.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * Getter/setter for bullet chart ranges.
 * @param {(Object|boolean|null|number)=} opt_indexOrValue Chart range settings to set.
 * @param {(Object|boolean|null)=} opt_value Chart range settings to set.
 * @return {!(anychart.core.axisMarkers.Range|anychart.charts.Bullet)} Range instance by index or itself for method chaining.
 */
anychart.charts.Bullet.prototype.range = function(opt_indexOrValue, opt_value) {
  var index, value;
  index = anychart.utils.toNumber(opt_indexOrValue);
  if (isNaN(index)) {
    index = 0;
    value = opt_indexOrValue;
  } else {
    index = opt_indexOrValue;
    value = opt_value;
  }
  var range = this.ranges_[index];
  if (!range) {
    range = new anychart.core.axisMarkers.Range();
    range.zIndex(anychart.charts.Bullet.ZINDEX_RANGES);
    this.ranges_[index] = range;
    this.registerDisposable(range);
    range.listenSignals(this.onRangeSignal_, this);
    this.invalidate(anychart.ConsistencyState.AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }

  if (goog.isDef(value)) {
    range.setup(value);
    return this;
  } else {
    return range;
  }
};


/**
 * Listener for markers invalidation.
 * @param {anychart.SignalEvent} event Invalidation event.
 * @private
 */
anychart.charts.Bullet.prototype.onRangeSignal_ = function(event) {
  this.invalidate(anychart.ConsistencyState.AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
};


/**
 * Getter for range palette settings.
 * @return {!anychart.palettes.DistinctColors} Current palette.
 *//**
 * Setter for range palette settings.
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([17]);
 * bulletChart.range().from(0).to(5);
 * bulletChart.range(1).from(5).to(10);
 * bulletChart.range(2).from(10).to(15);
 * bulletChart.range(3).from(15).to(20);
 * bulletChart.rangePalette(['#333', '#777', '#aaa', '#eee']);
 * bulletChart.container(stage).draw();
 * @param {(anychart.palettes.DistinctColors|Object|Array.<string>)=} opt_value Value to set.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.palettes.DistinctColors|Object|Array.<string>)=} opt_value .
 * @return {!(anychart.palettes.DistinctColors|anychart.charts.Bullet)} .
 */
anychart.charts.Bullet.prototype.rangePalette = function(opt_value) {
  if (!this.rangePalette_) {
    this.rangePalette_ = new anychart.palettes.DistinctColors();
    this.rangePalette_.colors(['#828282', '#a8a8a8', '#c2c2c2', '#d4d4d4', '#e1e1e1']);
    this.rangePalette_.listenSignals(this.onRangePaletteSignal_, this);
    this.registerDisposable(this.rangePalette_);
  }

  if (goog.isDef(opt_value)) {
    this.rangePalette_.setup(opt_value);
    return this;
  } else {
    return this.rangePalette_;
  }
};


/**
 * Internal marker palette invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.charts.Bullet.prototype.onRangePaletteSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.invalidate(anychart.ConsistencyState.AXES_MARKERS, anychart.Signal.NEEDS_REDRAW);
  }
};


/**
 * Getter for markers palette settings.
 * @return {!anychart.palettes.Markers} Current palette.
 *//**
 * Setter for markers palette settings.<br/>
 * <b>Note:</b> Markers sets in data().
 * @example <t>simple-h100</t>
 * var bulletChart = anychart.bullet([7,10,11,13]);
 * bulletChart.range().from(0).to(5);
 * bulletChart.range(1).from(5).to(10);
 * bulletChart.range(2).from(10).to(15);
 * bulletChart.markerPalette(['line', 'line', 'x', 'bar']);
 * bulletChart.container(stage).draw();
 * @param {(Array.<anychart.enums.MarkerType>|Object|anychart.palettes.Markers)=} opt_value Value to set.
 * @return {!anychart.charts.Bullet} {@link anychart.charts.Bullet} instance for method chaining.
 *//**
 * @ignoreDoc
 * @param {(anychart.palettes.Markers|Object|Array.<anychart.enums.MarkerType>)=} opt_value .
 * @return {!(anychart.palettes.Markers|anychart.charts.Bullet)} .
 */
anychart.charts.Bullet.prototype.markerPalette = function(opt_value) {
  if (!this.markerPalette_) {
    this.markerPalette_ = new anychart.palettes.Markers();
    this.markerPalette_.markers(['bar', 'line', 'x', 'ellipse']);
    this.markerPalette_.listenSignals(this.onPaletteSignal_, this);
    this.registerDisposable(this.markerPalette_);
  }

  if (goog.isDef(opt_value)) {
    this.markerPalette_.setup(opt_value);
    return this;
  } else {
    return this.markerPalette_;
  }
};


/**
 * Internal marker palette invalidation handler.
 * @param {anychart.SignalEvent} event Event object.
 * @private
 */
anychart.charts.Bullet.prototype.onPaletteSignal_ = function(event) {
  if (event.hasSignal(anychart.Signal.NEEDS_REAPPLICATION)) {
    this.invalidate(anychart.ConsistencyState.MARKERS, anychart.Signal.NEEDS_REDRAW);
  }
};


/** @inheritDoc */
anychart.charts.Bullet.prototype.createLegendItemsProvider = function() {
  var data = [];
  var iterator = this.data_.getIterator().reset();


  while (iterator.advance()) {
    var index = iterator.getIndex();
    var x = iterator.get('x');

    data.push({
      'index': index,
      'text': String(goog.isDef(iterator.get('name')) ? iterator.get('name') : iterator.get('x')),
      'iconType': anychart.enums.LegendItemIconType.SQUARE,
      'iconStroke': 'none',
      'iconFill': iterator.get('fill'),
      'iconHatchFill': 'none',
      'iconMarker': null
    });
  }
  return data;
};


/**
 * Calculate chart scale.
 */
anychart.charts.Bullet.prototype.calculate = function() {
  var i, count;
  /** @type {anychart.core.bullet.Marker} */
  var marker;
  /** @type {anychart.core.axisMarkers.Range} */
  var range;
  var scale = /** @type {anychart.scales.Base} */(this.scale());

  if (scale.needsAutoCalc()) {
    scale.startAutoCalc();
  }

  for (i = 0, count = this.markers_.length; i < count; i++) {
    marker = this.markers_[i];
    if (goog.isDefAndNotNull(marker)) {
      if (!marker.scale()) {
        marker.scale(scale);
      }
      if (marker.type() == anychart.enums.BulletMarkerType.BAR) {
        scale.extendDataRange(0);
      }
      scale.extendDataRange(marker.value());
    }
  }

  for (i = 0, count = this.ranges_.length; i < count; i++) {
    range = this.ranges_[i];
    if (goog.isDefAndNotNull(range)) {
      if (!range.scale()) {
        range.scale(scale);
      }
      scale.extendDataRange(range.from());
      scale.extendDataRange(range.to());
    }

    if (scale.needsAutoCalc()) {
      scale.finishAutoCalc();
    }
  }

  var axis = this.axis();
  if (!axis.scale()) {
    axis.scale(/** @type {anychart.scales.Base} */(this.scale()));
  }
};


/** @inheritDoc */
anychart.charts.Bullet.prototype.draw = function() {
  //we must update layout before draw
  var isHorizontal = this.isHorizontal();
  var title = this.title();
  var axis = this.axis();

  if (isHorizontal) {
    axis.setDefaultOrientation(anychart.enums.Orientation.BOTTOM);
    title.setDefaultOrientation(anychart.enums.Orientation.LEFT);
  } else {
    axis.setDefaultOrientation(anychart.enums.Orientation.LEFT);
    title.setDefaultOrientation(anychart.enums.Orientation.BOTTOM);
  }
  return goog.base(this, 'draw');
};


/**
 * Draw bullet chart c items.
 * @param {anychart.math.Rect} bounds Bounds of bullet chart content area.
 */
anychart.charts.Bullet.prototype.drawContent = function(bounds) {
  if (!this.checkDrawingNeeded())
    return;

  var i, count;

  if (this.hasInvalidationState(anychart.ConsistencyState.DATA)) {
    this.createMarkers_();
    this.markConsistent(anychart.ConsistencyState.DATA);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.SCALES)) {
    this.calculate();
    this.markConsistent(anychart.ConsistencyState.SCALES);
  }

  var axis = this.axis();
  if (this.hasInvalidationState(anychart.ConsistencyState.AXES | anychart.ConsistencyState.BOUNDS)) {
    axis.suspendSignalsDispatching();
    if (!axis.container() && axis.enabled()) {
      axis.container(this.rootElement);
    }
    axis.parentBounds(bounds);
    axis.padding(0); //todo: hack to drop axis length cache, need consultation with Sergey Medvedev to drop it.
    axis.resumeSignalsDispatching(false);
    axis.draw();
    this.markConsistent(anychart.ConsistencyState.AXES);
  }

  var boundsWithoutAxis = axis.enabled() ? axis.getRemainingBounds() : bounds;
  if (this.hasInvalidationState(anychart.ConsistencyState.AXES_MARKERS | anychart.ConsistencyState.BOUNDS)) {
    for (i = 0, count = this.ranges_.length; i < count; i++) {
      var range = this.ranges_[i];
      if (range) {
        range.suspendSignalsDispatching();
        range.setDefaultLayout(
            this.isHorizontal() ?
                anychart.enums.Layout.VERTICAL :
                anychart.enums.Layout.HORIZONTAL
        );
        range.setDefaultFill(/** @type {acgraph.vector.Fill} */(this.rangePalette().colorAt(i)));
        range.parentBounds(boundsWithoutAxis);
        range.container(this.rootElement);
        range.axesLinesSpace(0);
        range.draw();
        range.resumeSignalsDispatching(false);
      }
    }
    if (count > 5) {
      anychart.utils.info(anychart.enums.InfoCode.BULLET_TOO_MUCH_RANGES, [count]);
    }
    this.markConsistent(anychart.ConsistencyState.AXES_MARKERS);
  }

  if (this.hasInvalidationState(anychart.ConsistencyState.MARKERS | anychart.ConsistencyState.BOUNDS)) {
    for (i = 0, count = this.markers_.length; i < count; i++) {
      var marker = this.markers_[i];
      marker.suspendSignalsDispatching();
      marker.parentBounds(boundsWithoutAxis);
      marker.setDefaultType(/** @type {anychart.enums.BulletMarkerType} */(this.markerPalette().markerAt(i)));
      marker.setDefaultLayout(/** @type {anychart.enums.Layout} */(this.layout()));
      marker.draw();
      marker.resumeSignalsDispatching(false);
    }
    this.markConsistent(anychart.ConsistencyState.MARKERS);
  }
};


/**
 * Create makers.
 * @private
 */
anychart.charts.Bullet.prototype.createMarkers_ = function() {
  goog.array.forEach(this.markers_, function(marker) {
    goog.dispose(marker);
  });

  var iterator = this.data_.getIterator().reset();

  var rowsCount = iterator.getRowsCount();
  if (rowsCount > 2) {
    anychart.utils.info(anychart.enums.InfoCode.BULLET_TOO_MUCH_MEASURES, [rowsCount]);
  }

  while (iterator.advance()) {
    this.createMarker_(iterator);
  }
};


/**
 * @param {anychart.data.Iterator} iterator Iterator.
 * @return {anychart.core.bullet.Marker} Bullet marker.
 * @private
 */
anychart.charts.Bullet.prototype.createMarker_ = function(iterator) {
  var index = iterator.getIndex();
  var marker = new anychart.core.bullet.Marker();
  this.markers_[index] = marker;
  this.registerDisposable(marker);

  //common
  marker.scale(/** @type {anychart.scales.Base} */(this.scale()));
  marker.container(this.rootElement);

  //defaults
  marker.zIndex(anychart.charts.Bullet.ZINDEX_MARKER);
  marker.setDefaultFill('black');
  marker.setDefaultStroke('none');

  //settings from data
  marker.value(/** @type {string|number} */(iterator.get('value')));
  marker.type(/** @type {string} */(iterator.get('type')));
  marker.gap(/** @type {string|number} */(iterator.get('gap')));
  marker.fill(/** @type {acgraph.vector.Fill} */(iterator.get('fill')));
  marker.stroke(/** @type {acgraph.vector.Stroke} */(iterator.get('stroke')));

  return marker;
};


/** @inheritDoc */
anychart.charts.Bullet.prototype.serialize = function() {
  var json = goog.base(this, 'serialize');
  json['type'] = anychart.enums.ChartTypes.BULLET;
  json['layout'] = this.layout();
  json['data'] = this.data().serialize();
  json['rangePalette'] = this.rangePalette().serialize();
  json['markerPalette'] = this.markerPalette().serialize();
  json['scale'] = this.scale().serialize();
  json['axis'] = this.axis().serialize();
  var res = [];
  for (var i = 0; i < this.ranges_.length; i++)
    res.push(this.ranges_[i].serialize());
  return {'chart': json};
};


/** @inheritDoc */
anychart.charts.Bullet.prototype.setupByJSON = function(config) {
  goog.base(this, 'setupByJSON', config);
  this.data(config['data']);
  this.layout(config['layout']);
  this.rangePalette(config['rangePalette']);
  this.markerPalette(config['markerPalette']);
  this.scale(config['scale']);
  this.axis(config['axis']);
  var ranges = config['ranges'];
  if (goog.isArray(ranges))
    for (var i = 0; i < ranges.length; i++)
      this.range(i, ranges[i]);
};


//exports
anychart.charts.Bullet.prototype['data'] = anychart.charts.Bullet.prototype.data;//doc|ex
anychart.charts.Bullet.prototype['layout'] = anychart.charts.Bullet.prototype.layout;//doc|ex
anychart.charts.Bullet.prototype['rangePalette'] = anychart.charts.Bullet.prototype.rangePalette;//doc|ex
anychart.charts.Bullet.prototype['markerPalette'] = anychart.charts.Bullet.prototype.markerPalette;//doc|ex
anychart.charts.Bullet.prototype['scale'] = anychart.charts.Bullet.prototype.scale;//doc|ex
anychart.charts.Bullet.prototype['axis'] = anychart.charts.Bullet.prototype.axis;//doc|ex
anychart.charts.Bullet.prototype['range'] = anychart.charts.Bullet.prototype.range;//doc|ex
anychart.charts.Bullet.prototype['draw'] = anychart.charts.Bullet.prototype.draw;//inherited
anychart.charts.Bullet.prototype['isHorizontal'] = anychart.charts.Bullet.prototype.isHorizontal;//doc
