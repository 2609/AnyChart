goog.provide('anychart.data.View');

goog.require('anychart.core.Base');
goog.require('anychart.data.Iterator');
goog.require('anychart.enums');



/**
 * View is a representation of raw data.<br/>
 * <b>Note:</b> Default View is a view with default mapping.<br/>
 *
 * @param {!anychart.data.IView} parentView The parent view. The last view is a mapping.
 * @constructor
 * @implements {anychart.data.IView}
 * @name anychart.data.View
 * @extends {anychart.core.Base}
 */
anychart.data.View = function(parentView) {
  goog.base(this);

  /**
   * The parent view to ask data from.
   * @type {!anychart.data.IView}
   * @protected
   */
  this.parentView = parentView;

  parentView.listen(anychart.enums.EventType.SIGNAL, this.parentViewChangedHandler, false, this);

  this.invalidate(anychart.ConsistencyState.DATA_MASK);
};
goog.inherits(anychart.data.View, anychart.core.Base);


/**
 * Consistency state mask supported by this object.
 * @type {number}
 */
anychart.data.View.prototype.SUPPORTED_SIGNALS = anychart.Signal.DATA_CHANGED;


/**
 * Consistency state mask supported by this object.
 * @type {number}
 */
anychart.data.View.prototype.SUPPORTED_CONSISTENCY_STATES = anychart.ConsistencyState.DATA_MASK;


/**
 * The redirection mask for a view. Each value in this array is an index of the row in parentView to fetch,
 * when that index is asked from the current view.
 * @type {Array.<number>}
 * @protected
 */
anychart.data.View.prototype.mask = null;


/**
 * Metadata storage.
 * @type {Array.<Object>}
 * @private
 */
anychart.data.View.prototype.metadata_ = null;


/**
 * If the metadata should be passed to the parent view.
 * @type {boolean}
 * @private
 */
anychart.data.View.prototype.transitMeta_ = false;


/**
 * Ensures that the view redirection mask is consistent with the last changes.
 */
anychart.data.View.prototype.ensureConsistent = function() {
  if (this.isConsistent())
    return;
  if (this.metadata_)
    this.metadata_.length = 0;
  this.mask = this.buildMask();
  this.markConsistent(anychart.ConsistencyState.DATA_MASK);
};


/**
 * Creates prepared derived view. Internal method. Should not be published!
 * @param {string} fieldName The name of the field to look at.
 * @param {Array|boolean} categories Categories set to use in case of ordinal scale.
 * @return {!anychart.data.View} The new derived view.
 */
anychart.data.View.prototype.prepare = function(fieldName, categories) {
  var result = goog.isArray(categories) ?
      new anychart.data.OrdinalView(this, fieldName, /** @type {!Array} */(categories)) :
      new anychart.data.ScatterView(this, fieldName, !!categories);
  this.registerDisposable(result);
  return result;
};


/**
 * Creates a pie-ready view.
 * @param {string} fieldName A field name to make filter by.
 * @param {function(*):boolean=} opt_func A filter function that should accept a field value and return true if the row
 *    should be included into the resulting view as a and false otherwise.
 * @param {(function(R, T, number, Array) : R)=} opt_other The function to call for
 *     every value of other. This function
 *     takes 4 arguments (the function's previous result or the initial value,
 *     the value of the current array element, the current array index, and the
 *     array itself)
 *     function(previousValue, currentValue, index, array).
 * @param {(function():R)=} opt_otherInitialConstructor The function that constructs initial value for opt_other func.
 * @template T,S,R
 * @return {!anychart.data.View} The new derived view.
 */
anychart.data.View.prototype.preparePie = function(fieldName, opt_func, opt_other, opt_otherInitialConstructor) {
  var result = new anychart.data.PieView(this, fieldName, opt_func, opt_other, opt_otherInitialConstructor);
  this.registerDisposable(result);
  return result;
};


/**
 * Creates a derived view, containing just the same data set and order as this view does.
 * @example <t>lineChart</t>
 *  var data = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94]
 * ]);
 * var view = data.mapAs();
 * var derivedView = view.derive();
 * chart.line(derivedView)
 * @return {!anychart.data.View} The new derived view.
 */
anychart.data.View.prototype.derive = function() {
  var result = new anychart.data.View(this);
  this.registerDisposable(result);
  return result;
};


/**
 * Creates a derived view, containing only the rows that pass the filter.
 * @example <t>listingOnly</t>
 *  // Filter out values lesser or equal to 3:
 *  view.filter('fieldName', function(fieldValue){
 *    return fieldValue > 3;
 *  });
 * @example <t>lineChart</t>
 *  var data = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94],
 *     ['Point E', 194],
 *     ['Point F', 45],
 *     ['Point G', 201]
 * ]);
 * var view = data.mapAs();
 * var filteredView = view.filter('value', function(value){ return value > 100;});
 * chart.line(filteredView);
 * @param {string} fieldName A field which value will be passed to a filter function.
 * @param {function(*):boolean} func A filter function that should accept a field value and return true if the row
 *  should be included into the resulting view.
 * @return {!anychart.data.View} The new derived view.
 */
anychart.data.View.prototype.filter = function(fieldName, func) {
  var result = new anychart.data.FilterView(this, fieldName, func);
  this.registerDisposable(result);
  return result;
};


/**
 * Creates a derived view that ensures sorting by a passed field.
 * @example <t>listingOnly</t>
 *  // Sorting by string length:
 *  view.sort('name', function(value1, value2){
 *    return value1 > value2;
 *  });
 * @example <t>lineChart</t>
 *  var data = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94],
 *     ['Point E', 194],
 *     ['Point F', 45],
 *     ['Point G', 201]
 * ]);
 * var view = data.mapAs();
 * var sortedView = view.sort('value', function(value1, value2){ return value1 > value2;});
 * chart.line(sortedView);
 * @param {string} fieldName A field name to make sort by.
 * @param {(anychart.enums.Sort|function(*, *):number)=} opt_comparatorOrOrder A sorting function that should accept two
 *    field values and return numeric result of the comparison or string value of anychart.enums.Sort enumeration
 *    except NONE. Defaults to anychart.enums.Sort.ASC.
 * @return {!anychart.data.View} The new derived view.
 */
anychart.data.View.prototype.sort = function(fieldName, opt_comparatorOrOrder) {
  var result = new anychart.data.SortView(this, fieldName, opt_comparatorOrOrder);
  this.registerDisposable(result);
  return result;
};


/**
 * Concatenates two views to make a derived view that contains rows from both views.
 * @example <c>Concatenation of two Views</c><t>listingOnly</t>
 * // mainView                      additionalView
 *  [                               [
 *    [1, 3, 5],                        {x: 2, y: 5},
 *    [5, 3, 1]                         {x: 3, y: 7},
 *  ]                                   function(){ return {x: 4, y: 7}}
 *                                  ]
 * mainView.concat(additionalView);
 * // Result mainView
 *  [
 *    [1, 3, 5],
 *    [5, 3, 1],
 *    {x: 2, y: 5},
 *    {x: 3, y: 7},
 *    function(){ return {x: 4, y: 7}}
 *  ]
 * @example <c>Concatenation of a View and a data Set</c><t>listingOnly</t>
 * // mainView
 *  [
 *    [1, 3, 5],
 *    [5, 3, 1]
 *  ]
 * mainView.concat(anychart.data.set([
 *     {x: 2, y: 5},
 *     {x: 3, y: 7},
 *     function(){ return {x: 4, y: 7}}
 *  ]));
 * // Result mainView
 *  [
 *    [1, 3, 5],
 *    [5, 3, 1],
 *    {x: 2, y: 5},
 *    {x: 3, y: 7},
 *    function(){ return {x: 4, y: 7}}
 *  ]
 * @example <c>Concatenation of a View and and Array</c><t>listingOnly</t>
 * // mainView
 *  [
 *    [1, 3, 5],
 *    [5, 3, 1]
 *  ]
 * mainView.concat([2, 2, 2]);
 * // Result mainView
 *  [
 *    [1, 3, 5],
 *    [5, 3, 1],
 *    2,
 *    2,
 *    2
 *  ]
 * @example <t>lineChart</t>
 *  var dataSet1 = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94]
 *  ]);
 *  var dataSet2 = anychart.data.set([
 *     ['Point E', 194],
 *     ['Point F', 45],
 *     ['Point G', 201],
 *     ['Point H', 104]
 * ]);
 * var view1 = dataSet1.mapAs();
 * var view2 = dataSet2.mapAs();
 * var concatinatedView = view1.concat(view2);
 * chart.line(concatinatedView);
 * @param {!(anychart.data.IView|Array)} otherView A view, data set or even an array to concat with.
 * @return {!anychart.data.IView} The new derived view.
 */
anychart.data.View.prototype.concat = function(otherView) {
  if (goog.isArray(otherView))
    otherView = new anychart.data.Set(/** @type {!Array} */(otherView));
  if (otherView instanceof anychart.data.Set)
    otherView = (/** @type {!anychart.data.Set} */(otherView)).mapAs();
  var result = new anychart.data.ConcatView(this, /** @type {!anychart.data.IView} */(otherView));
  this.registerDisposable(result);
  return result;
};


/**
 * Gets a full row of the set by an index.<br/>
 * <b>Note:</b> If there is no row with the given index, methods returns <b>undefined</b>.<br/>
 * See sample at {@link anychart.data.Set#row}
 * @example <t>listingOnly</t>
 * // Data
 *  [
 *    [1, 2, 4, 7],
 *    [11, 12, 14, 17],
 *    [21, 22, 24, 27]
 *  ]
 *  view.row(2); // returns [21, 22, 24, 27]
 *  view.row(3); // returns undefined
 * @see anychart.data.Set#row
 * @param {number} rowIndex An index of the row to fetch.
 * @return {*} The row.
 *//**
 * Sets a row of the set by an index.<br/>
 * <b>Note:</b> Previous value of a row is returned but it is lost completely after that!.<br/>
 * @example <t>listingOnly</t>
 * // Data
 *  [
 *    [1, 2, 4, 7],
 *    [11, 12, 14, 17],
 *    [21, 22, 24, 27]
 *  ]
 *  view.row(2, [2, 2, 2, 2]); // returns [21, 22, 24, 27]
 *  view.row(3, {'low': 4, 'high': 11}); // returns undefined
 * @example <t>lineChart</t>
 * var dataSet = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94]
 * ]);
 * var view = dataSet.mapAs();
 * view.row(2, ['Point E', 10]);
 * chart.line(view);
 * @see anychart.data.Set#row
 * @param {number} rowIndex An index of the row to fetch.
 * @param {*=} opt_value A value to set.
 * @return {*} Previous value of the row.
 *//**
 * @ignoreDoc
 * @param {number} rowIndex .
 * @param {*=} opt_value .
 * @return {*} .
 */
anychart.data.View.prototype.row = function(rowIndex, opt_value) {
  this.ensureConsistent();
  rowIndex = this.mask ? this.mask[rowIndex] : rowIndex;
  if (goog.isDef(rowIndex)) {
    return this.parentView.row.apply(this.parentView, arguments);
  }
  return rowIndex; // undefined
};


/**
 * Returns the number of the rows in the current view.
 * @example <t>lineChart</t>
 *  var data = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94]
 * ]);
 * var view = data.mapAs();
 * chart.title().text("rows count: " + view.getRowsCount());
 * chart.line(data)
 * @see anychart.data.Iterator#getRowsCount
 * @return {number} The number of the rows in the set.
 */
anychart.data.View.prototype.getRowsCount = function() {
  this.ensureConsistent();
  return this.mask ? this.mask.length : this.parentView.getRowsCount();
};


/**
* Returns the mapping for the row.
* @param {number} rowIndex The index of the row.
* @return {!anychart.data.Mapping} The mapping for the row.
*/
anychart.data.View.prototype.getRowMapping = function(rowIndex) {
  this.ensureConsistent();
  return this.parentView.getRowMapping(this.mask ? this.mask[rowIndex] : rowIndex);
};


/**
 * Searches fieldName by fieldValue and returns it index (or the first match).
 * @example
 * var chart = anychart.column();
 * var data = anychart.data.set([
 *     {x: 'A1', value: 8},
 *     {x: 'A2', value: 11, fill: 'orange'},
 *     {x: 'A3', value: 12},
 *     {x: 'A4', value: 9}
 * ]);
 * chart.column(data);
 * chart.container(stage).draw();
 * var view = data.mapAs();
 * var index = view.find('x', 'A2');
 * view.set(index, 'x', 'changed');
 * view.set(index, 'fill', 'grey');
 * @param {string} fieldName Name of the field.
 * @param {*} fieldValue Value of the field.
 * @return {number} Index in view.
 */
anychart.data.View.prototype.find = function(fieldName, fieldValue) {
  this.ensureConsistent();
  if (!goog.isDef(fieldName) || !goog.isDef(fieldValue))
    return -1;

  if (!this.cachedValues) this.cachedValues = {};
  if (!this.cachedValues[fieldName]) this.cachedValues[fieldName] = {};

  if (this.cachedValues[fieldName][fieldValue])
    return this.cachedValues[fieldName][fieldValue];

  var iterator = this.getIterator();
  var index = -1;
  var value;

  while (iterator.advance()) {
    index = iterator.getIndex();
    value = iterator.get(fieldName);

    this.cachedValues[fieldName][value] = index;

    if (value == fieldValue) {
      return index;
    }
  }
  return -1;
};


/**
 * Search on unsorted data by field name - 'x'. Returns array of indexes of found points.
 * @param {number} fieldValue Value to find.
 * @return {Array.<number>} Point indexes.
 */
anychart.data.View.prototype.findInUnsortedDataByX = function(fieldValue) {
  this.ensureConsistent();

  if (!this.cachedScatterValues) this.cachedScatterValues = {};
  if (this.cachedScatterValues[fieldValue])
    return /** @type {Array.<number>}*/(this.cachedScatterValues[fieldValue]);

  var indexes = [];

  if (goog.isDef(fieldValue)) {
    var iterator = this.getIterator();
    var index = -1;
    var length = Infinity;
    var x, value, minValue, length_;

    var lastNotNaNValueIndex = -1;
    var lastNotNaNValueX = -Infinity;

    iterator.reset();
    while (iterator.advance()) {
      index = iterator.getIndex();

      x = /** @type {number}*/(iterator.get('x'));
      value = iterator.get('value');

      if (!goog.isDef(this.cachedScatterValues.lastNotNaNValueIndex) && !isNaN(value) && x > lastNotNaNValueX)
        lastNotNaNValueIndex = index;

      length_ = Math.abs(x - fieldValue);
      if (length_ < length && !isNaN(value)) {
        length = length_;
        minValue = x;
        indexes.length = 0;
      }
      if (x == minValue) {
        indexes.push(index);
      }
    }
    if (!goog.isDef(this.cachedScatterValues.lastNotNaNValueIndex))
      this.cachedScatterValues.lastNotNaNValueIndex = lastNotNaNValueIndex;

    this.cachedScatterValues[minValue] = indexes;
  }

  return /** @type {Array.<number>}*/(indexes);
};


/**
 * Search in range of values by field name - 'x'. Returns array of indexes of found points.
 * @param {number} minValue Minimum range limit.
 * @param {number} maxValue Maximum range limit.
 * @param {boolean=} opt_isOrdinal .
 * @return {Array.<number>} indexes.
 */
anychart.data.View.prototype.findInRangeByX = function(minValue, maxValue, opt_isOrdinal) {
  this.ensureConsistent();
  if (!goog.isDef(minValue) || !goog.isDef(maxValue))
    return null;

  if (!this.cachedRanges) this.cachedRanges = {};

  var name = minValue + '|' + maxValue;
  if (this.cachedRanges[name]) {
    return this.cachedRanges[name].slice();
  }

  if (minValue > maxValue) {
    var tempValue = minValue;
    minValue = maxValue;
    maxValue = tempValue;
  }

  var iterator = this.getIterator();
  var value, index;

  var indexes = [];
  iterator.reset();
  while (iterator.advance()) {
    index = iterator.getIndex();
    value = /** @type {number} */(opt_isOrdinal ? index : iterator.get('x'));
    if (value >= minValue && value <= maxValue) {
      indexes.push(index);
    }
  }
  this.cachedRanges[name] = indexes;

  return indexes;
};


/**
 * Gets the value from the row by row index and field name.
 * @example
 * var data = anychart.data.set([
 *     {x: 'A1', value: 8, fill: 'yellow'},
 *     {x: 'A2', value: 11, fill: 'orange'},
 *     {x: 'A3', value: 12, fill: 'red'},
 *     {x: 'A4', value: 9, fill: 'grey'}
 * ]);
 * chart = anychart.column(data);
 * chart.container(stage).draw();
 * var view = data.mapAs();
 * var pointX = view.get(2, 'x');
 * var pointFill = view.get(2, 'fill');
 * chart.title().text('point \''+ pointX +'\' has \'' + pointFill + '\' fill.');
 * @param {number} rowIndex Index of the row to get field value from.
 * @param {string} fieldName The name of the field to be fetched from the current row.
 * @return {*} The field value or undefined, if not found.
 */
anychart.data.View.prototype.get = function(rowIndex, fieldName) {
  if (rowIndex >= this.getRowsCount()) return undefined;
  return this.getRowMapping(rowIndex).getInternal(this.row(rowIndex), rowIndex, fieldName);
};


/**
 * Sets the value to the row field by row index and field name.
 * @example
 * var chart = anychart.columnChart();
 * var data = anychart.data.set([
 *     ['A1', 8],
 *     ['A2', 11],
 *     ['A3', 12],
 *     ['A4', 9]
 * ]);
 * chart.column(data);
 * chart.container(stage).draw();
 * var view = data.mapAs();
 * view.set(2, 'x', 'B1');
 * @param {number} rowIndex
 * @param {string} fieldName
 * @param {*} value
 * @return {!anychart.data.View} Itself for chaining.
 */
anychart.data.View.prototype.set = function(rowIndex, fieldName, value) {
  this.row(rowIndex, this.getRowMapping(rowIndex).setInternal(this.row(rowIndex), fieldName, value));
  return this;
};


/**
 * Returns a new iterator for the current view.
 * @example <t>lineChart</t>
 * var data = anychart.data.set([
 *     ['Point A', 231],
 *     ['Point B', 131],
 *     ['Point C', 212],
 *     ['Point D', 94]
 * ]);
 * var view = data.mapAs();
 * var iterator = view.getIterator();
 * // move cursor
 * iterator.select(2);
 * chart.title().text(iterator.get('x') + ' - ' + iterator.get('value'))
 * chart.line(data);
 * @return {!anychart.data.Iterator} New iterator.
 */
anychart.data.View.prototype.getIterator = function() {
  this.ensureConsistent();
  return new anychart.data.Iterator(this);
};


/**
 * Builds redirection mask. The default mask is an equality mask.
 * @return {Array.<number>} The mask.
 * @protected
 */
anychart.data.View.prototype.buildMask = function() {
  return null;
};


/**
 * Handles changes in the parent view.
 * @param {anychart.SignalEvent} event The event object.
 * @protected
 */
anychart.data.View.prototype.parentViewChangedHandler = function(event) {
  this.cachedValues = null;
  this.cachedScatterValues = null;
  this.cachedRanges = null;
  if (event.hasSignal(anychart.Signal.DATA_CHANGED))
    this.invalidate(anychart.ConsistencyState.DATA_MASK, anychart.Signal.DATA_CHANGED);
};


/**
 * Getter for a metadata value.<br/>
 * Learn how it works at {@link anychart.data.Iterator#meta}.
 * @example <t>listingOnly</t>
 * // Select 'name' field in the fourth row:
 * view.meta(4, 'name');
 * @param {number} index Row index.
 * @param {string} name Name of the metadata field.
 * @return {*} Current value.
 * @see anychart.data.Iterator#meta
 *//**
 * Setter for a metadata value.
 * Learn how it works at {@link anychart.data.Iterator#meta}.
 * @example <t>listingOnly</t>
 * // Set value to the 'name' field in the fourth row:
 * view.meta(4, 'name', 'Jules Winnfield');
 * @param {number} index Row index.
 * @param {string} name Name of the metadata field.
 * @param {*=} opt_value Value to set.
 * @return {anychart.data.View} The instance of {@link anychart.data.View} class for method chaining.
 * @see anychart.data.Iterator#meta
 *//**
 * @ignoreDoc
 * @param {number} index .
 * @param {string} name .
 * @param {*=} opt_value .
 * @return {anychart.data.View|*|undefined} .
 */
anychart.data.View.prototype.meta = function(index, name, opt_value) {
  if (this.transitMeta_) {
    return this.parentMeta.apply(this, arguments);
  }
  if (!this.metadata_) this.metadata_ = [];
  var obj = this.metadata_[index];
  if (!obj)
    this.metadata_[index] = obj = {};
  if (arguments.length > 2) {
    obj[name] = opt_value;
    return this;
  }
  return obj[name];
};


/**
 * Getter and setter for the parent metadata value. Can be overridden in the descendants.
 *
 * ATTENTION: THE CHECK IF IT IS A SETTER IS BASED ON THE NUMBER OF PARAMETERS,
 * e.g. ds.meta(1, 'qqq', undefined); is still a SETTER.
 * @param {number} index A row index.
 * @param {string} name The name of the metadata field.
 * @param {*=} opt_value Value to set.
 * @return {anychart.data.View|*|undefined} Self for chaining or value.
 * @protected
 */
anychart.data.View.prototype.parentMeta = function(index, name, opt_value) {
  index = this.mask ? this.mask[index] : index;
  //TODO(Anton Saukh): fix it to proper error reporting.
  if (!goog.isDef(index))
    throw Error('Index can not be masked by this View');
  if (arguments.length > 2) {
    this.parentView.meta(index, name, opt_value);
    return this;
  } else {
    return this.parentView.meta(index, name);
  }
};


/**
 * Sets metadata transitioning state.
 * @param {boolean} on If the meta should be transitioned.
 */
anychart.data.View.prototype.transitionMeta = function(on) {
  this.transitMeta_ = !!on;
};


/**
 * @inheritDoc
 */
anychart.data.View.prototype.serialize = function() {
  var arr = [];
  var iterator = this.getIterator();
  var index;
  var row;
  var mapping, map;
  var key;
  var rowObject;
  var i;
  var val;
  while (iterator.advance()) {
    index = iterator.getIndex();
    row = this.row(index);
    // if row represented by array - convert it to object with help of array mapping.
    if (goog.isArray(row)) {
      // get array mapping for the row
      mapping = this.getRowMapping(index).getArrayMapping();
      rowObject = {};
      for (key in mapping) {
        map = mapping[key];
        for (i = 0; i < map.length; i++) {
          if (map[i] in row) {
            val = row[map[i]];
            if (val instanceof Date)
              val = val.getTime();
            if (!goog.isDef(val) || (goog.isNumber(val) && isNaN(val)))
              val = null;
            rowObject[key] = val;
            break;
          }
        }
      }
    } else if (goog.isObject(row)) {
      // if row is presented by object - normalize it to default mapping, because we cannot provide
      // mapping info to the resulting JSON now
      mapping = this.getRowMapping(index).getObjectMapping();
      rowObject = {};
      for (key in mapping) {
        map = mapping[key];
        for (i = 0; i < map.length; i++) {
          if (map[i] in row) {
            val = row[map[i]];
            if (val instanceof Date)
              val = val.getTime();
            if (!goog.isDef(val) || (goog.isNumber(val) && isNaN(val)))
              val = null;
            rowObject[key] = val;
            break;
          }
        }
      }
      for (key in row) {
        if (row.hasOwnProperty(key) && !(key in mapping)) {
          val = row[key];
          if (val instanceof Date)
            val = val.getTime();
          if (!goog.isDef(val) || (goog.isNumber(val) && isNaN(val)))
            val = null;
          rowObject[key] = val;
        }
      }
    } else {
      if (!goog.isDef(row) || (goog.isNumber(row) && isNaN(row)))
        row = null;
      rowObject = row;
    }
    arr.push(rowObject);
  }

  return arr;
};


//exports
anychart.data.View.prototype['derive'] = anychart.data.View.prototype.derive;//doc|ex
anychart.data.View.prototype['filter'] = anychart.data.View.prototype.filter;//doc|ex
anychart.data.View.prototype['sort'] = anychart.data.View.prototype.sort;//doc|ex
anychart.data.View.prototype['concat'] = anychart.data.View.prototype.concat;//doc|ex
anychart.data.View.prototype['row'] = anychart.data.View.prototype.row;//doc|ex
anychart.data.View.prototype['getRowsCount'] = anychart.data.View.prototype.getRowsCount;//doc|ex
anychart.data.View.prototype['getIterator'] = anychart.data.View.prototype.getIterator;//doc|ex
anychart.data.View.prototype['meta'] = anychart.data.View.prototype.meta;//doc|need-ex
anychart.data.View.prototype['get'] = anychart.data.View.prototype.get;//doc|ex
anychart.data.View.prototype['set'] = anychart.data.View.prototype.set;//doc|ex
anychart.data.View.prototype['find'] = anychart.data.View.prototype.find;//doc|ex
