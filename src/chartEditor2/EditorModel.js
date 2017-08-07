goog.provide('anychart.chartEditor2Module.EditorModel');

goog.require('goog.events.EventTarget');


/**
 *
 * @constructor
 * @extends {goog.events.EventTarget}
 */
anychart.chartEditor2Module.EditorModel = function() {
  goog.base(this);

  this.data_ = {};

  this.preparedData_ = [];

  this.model_ = {
    generateInitialMappingsOnChangeView: true,
    dataSettings: {
      active: null,
      field: null,
      mappings: [
        // [ // plot
        //   {ctl: 'line', mapping: {value: 1}},
        //   {ctl: 'column', mapping: {value: 2}}
        // ]
      ]
    },
    chart: {
      type: null,
      seriesType: null,
      settings: {
        //'getSeriesAt(0).name()': 'my series'
      }
    }
  };

  this.suspendQueue_ = 0;
};
goog.inherits(anychart.chartEditor2Module.EditorModel, goog.events.EventTarget);


/**
 * @typedef {Array.<(Array|String)>}
 */
anychart.chartEditor2Module.EditorModel.Key;


// region Structures
anychart.chartEditor2Module.EditorModel.chartTypes = {
  'line': {
    'value': 'line',
    'name': 'Line Chart',
    'icon': 'line-chart-1.svg', // 'http://www.anychart.com/_design/img/upload/charts/types/'
    'series': ['line', 'spline', 'column', 'area', 'ohlc'], // first value is default
    'dataSetCtor': 'set'
  },
  'column': {
    'value': 'column',
    'name': 'Column Chart',
    'icon': 'column-chart.svg',
    'series': ['column', 'line', 'spline', 'area', 'ohlc'],
    'dataSetCtor': 'set'
  },
  'area': {
    'value': 'area',
    'name': 'Area Chart',
    'icon': 'area-chart.svg',
    'series': ['area', 'line', 'spline', 'column', 'ohlc'],
    'dataSetCtor': 'set'
  },
  'stock': {
    'value': 'stock',
    'name': 'Stock Chart',
    'icon': 'stock-chart.svg',
    'series': ['ohlc', 'line', 'spline', 'column', 'area'],
    'dataSetCtor': 'table'
  }
};


anychart.chartEditor2Module.EditorModel.series = {
  'line': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'spline': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'column': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'area': {
    'fields': [{field: 'value', name: 'Y Value'}]
  },
  'ohlc': {
    'fields': [
      {field: 'open'},
      {field: 'close'},
      {field: 'high'},
      {field: 'low'}]
  }
};


anychart.chartEditor2Module.EditorModel.consistencyObject = {
  'chart': {
    'ctor': ''
  },
  'plot': [{
    'mapping': {'x': ''},

    'series': [{
      'ctor': '',
      'mapping': {}
    }]
  }]
};
// endregion


// region Model initialization
anychart.chartEditor2Module.EditorModel.prototype.chooseDefaultChartType = function() {
  //todo: придумываем тип чарта на основе данных
  this.model_.chart.type = 'line';
};


anychart.chartEditor2Module.EditorModel.prototype.chooseActiveAndField = function(opt_active, opt_field) {
  this.dropChartSettings();

  var preparedData = this.getPreparedData();
  var active = goog.isDefAndNotNull(opt_active) ? opt_active : preparedData[0]['setFullId'];
  var field = goog.isDefAndNotNull(opt_field) ? opt_field : preparedData[0]['fields'][0]['key'];

  this.model_.dataSettings = {
    active: active,
    field: field
  };

  this.chooseDefaultSeriesType();
  this.model_.dataSettings.mappings = [this.createPlotMapping()];
};


anychart.chartEditor2Module.EditorModel.prototype.chooseDefaultSeriesType = function() {
  var seriesType = anychart.chartEditor2Module.EditorModel.chartTypes[this.model_.chart.type]['series'][0];

  var data = this.getPreparedDataActive(this.model_.dataSettings.active);
  var fields = data['fields'];

  // Try to choose series type by data.
  // console.log(fields);

  this.model_.chart.seriesType = seriesType;
};


/**
 * Creates plot mapping. Need active dataset and default series type to be chosen.
 * @return {[*]}
 */
anychart.chartEditor2Module.EditorModel.prototype.createPlotMapping = function() {
  var seriesConfig = this.createSeriesConfig(this.model_.chart.seriesType);
  return [seriesConfig];
};


/**
 * Creates series config.
 * @param {String} type Series type.
 * @param {String=} opt_active Active dataset id.
 * @param {String=} opt_id Series id.
 * @return {{ctor: *, mapping: {}}}
 */
anychart.chartEditor2Module.EditorModel.prototype.createSeriesConfig = function(type, opt_active, opt_id) {
  var active = goog.isDef(opt_active) ? opt_active : this.model_.dataSettings.active;
  var data = this.getPreparedDataActive(active);
  var config = {'ctor': type, 'mapping': {}};
  if (goog.isDef(opt_id))
    config['id'] = opt_id;

  var fields = anychart.chartEditor2Module.EditorModel.series[type]['fields'];
  for (var i = 0; i < fields.length; i++) {
    config['mapping'][fields[i]['field']] = data['fields'][1]['key'];
  }
  return config;
};


anychart.chartEditor2Module.EditorModel.prototype.dropChartSettings = function(opt_pattern) {
  if (goog.isDef(opt_pattern)) {
    for (var key in this.model_.chart.settings) {
      if (key.indexOf(opt_pattern) >= 0) {
        delete this.model_.chart.settings[key];
      }
    }
  } else
    this.model_.chart.settings = {};
};


// anychart.chartEditor2Module.EditorModel.prototype.onChangeDatasetsComposition = function() {
//   this.model_.mapping = [];
//   this.model_.chart.settings = {};
//   this.model_.generateInitialMappingsOnChangeView = true;
// };
// endregion


// region Controls callback functions
anychart.chartEditor2Module.EditorModel.prototype.setActiveField = function(input) {
  var field = input.getValue();
  var active = input.getValue2();

  this.suspendDispatch();

  if (active != this.model_.dataSettings.active) {
    this.chooseActiveAndField(active, field);

    this.dropChartSettings('getSeries');
    this.dispatchUpdate();

  } else if (field != this.model_.dataSettings.field) {
    this.model_.dataSettings.field = field;
    this.dispatchUpdate();
  }

  this.resumeDispatch();
};


anychart.chartEditor2Module.EditorModel.prototype.onChangeView = function() {
  if (this.model_.generateInitialMappingsOnChangeView) {
    this.model_.generateInitialMappingsOnChangeView = false;
    this.chooseDefaultChartType();
    this.chooseActiveAndField();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.addPlot = function() {
  var mapping = this.createPlotMapping();
  this.model_.dataSettings.mappings.push(mapping);
  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.dropPlot = function(index) {
  if (index > 0 && this.model_.dataSettings.mappings.length > index) {
    this.dropChartSettings('plot(');
    goog.array.splice(this.model_.dataSettings.mappings, index, 1);
    this.dispatchUpdate();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.addSeries = function(plotIndex) {
  var mapping = this.createSeriesConfig(this.model_.chart.seriesType);
  this.model_.dataSettings.mappings[plotIndex].push(mapping);
  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.dropSeries = function(plotIndex, seriesIndex) {
  if (this.model_.dataSettings.mappings.length > plotIndex && this.model_.dataSettings.mappings[plotIndex].length > seriesIndex) {
    var removedSeries = goog.array.splice(this.model_.dataSettings.mappings[plotIndex], seriesIndex, 1);
    this.dropChartSettings('getSeries(' + removedSeries[0]['id'] + ')');
    this.dispatchUpdate();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.setChartType = function(input) {
  var type = input.getValue();
  var prevChartType = this.model_.chart.type;
  var prevDefaultSeriesType = this.model_.chart.seriesType;

  this.model_.chart.type = type;
  this.chooseDefaultSeriesType();

  if (prevChartType == 'stock' || this.model_.chart.type == 'stock') {
    this.dropChartSettings();
    this.model_.dataSettings.mappings = [this.createPlotMapping()];
  }
  // this.updateSeriesConstructors();

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.setSeriesType = function(input) {
  var key = input.getKey();
  var type = input.getValue();
  var plotIndex = key[1][1]; // see SeriesPanel.getKey()
  var seriesIndex = key[2][0];

  if (this.model_.dataSettings.mappings[plotIndex][seriesIndex].ctor != type) {
    var oldConfig = this.model_.dataSettings.mappings[plotIndex][seriesIndex];
    this.model_.dataSettings.mappings[plotIndex][seriesIndex] = this.createSeriesConfig(type, void 0, oldConfig['id']);
    this.dispatchUpdate();
  }
};


anychart.chartEditor2Module.EditorModel.prototype.setTheme = function(input) {
  this.model_.chart.settings['palette()'] = null;
  this.model_.anychart['theme()'] = input.getValue();
  this.dispatchUpdate();
};
// endregion


// region Editor Model API function
/**
 * Setter for model's field state
 * @param {Array.<*>} key
 * @param {*} value
 * @param {boolean=} opt_noDispatch
 * @param {boolean=} opt_noRebuild
 */
anychart.chartEditor2Module.EditorModel.prototype.setValue = function(key, value, opt_noDispatch, opt_noRebuild) {
  var target = this.model_;
  for (var i = 0; i < key.length; i++) {
    var level = key[i];
    if (goog.isArray(level)) {
      if (!goog.isDef(target[level[0]])) {
        if (level.length > 1)
          target[level[0]] = [];
        else
          target[level[0]] = {};
      }

      if (goog.isArray(target[level[0]]) && target[level[0]].length == level[1])
        target[level[0]].push({});

      target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
    } else if (goog.isString(level) && target[String(level)] != value) {
      target[String(level)] = value;

      if (!opt_noDispatch)
        this.dispatchUpdate(opt_noRebuild);
    }
  }
};


/**
 * Getter for input's value
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @return {*} Input's value
 */
anychart.chartEditor2Module.EditorModel.prototype.getValue = function(key) {
  var target = this.model_;
  var level;

  for (var i = 0; i < key.length; i++) {
    level = key[i];
    if (i == key.length - 1) {
      // result
      if (goog.isArray(level))
        return target[level[0]][level[1]];
      else if (goog.isString(level))
        return target[level];

    } else {
      // drill down
      if (goog.isArray(level))
        target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
      else if (goog.isString(level))
        target = target[level];

      if (!target)
        return void 0;
    }
  }
};


/**
 * @param {Array} key
 */
anychart.chartEditor2Module.EditorModel.prototype.removeByKey = function(key) {
  var target = this.model_;
  var level;
  for (var i = 0; i < key.length; i++) {
    level = key[i];
    if (i == key.length - 1) {
      // remove
      if (goog.isArray(level)) {
        goog.array.splice(target[level[0]], level[1], 1);
      }
      else if (goog.isString(level)) {
        delete target[level];
      }

    } else {
      // drill down
      if (goog.isArray(level))
        target = goog.isArray(target[level[0]]) ? target[level[0]][level[1]] : target[level[0]];
      else if (goog.isString(level))
        target = target[level];

      if (!target)
        break;
    }
  }
  this.dispatchUpdate();
};


/**
 * Checks if available data is enough to build chart
 * @return {boolean} true if available data is enough
 */
anychart.chartEditor2Module.EditorModel.prototype.checkConsistency_ = function() {
  // console.log(this.inputs_);

  // Check by consistencyObject
  if (!this.checkConsistencyByObject_(this.model_, anychart.chartEditor2Module.EditorModel.consistencyObject))
    return false;

  // Check series fields
  /*for (var i = this.inputs_['plot'].length; i--;) {
    for (var j = this.inputs_['plot'][i]['series'].length; j--;) {
      var series = this.inputs_['plot'][i]['series'][j];
      var mapping = series['mapping'];
      var fields = /!** @type {Array.<String>} *!/(goog.object.getKeys(mapping));
      var seriesFields = goog.array.map(anychart.chartEditor2Module.EditorModel.series[series['ctor']]['fields'],
          function(item) {
            return item['field']
          });

      if (goog.array.compare3(fields, seriesFields) != 0)
        return false;
    }
  }*/

  return true;
};


anychart.chartEditor2Module.EditorModel.prototype.checkConsistencyByObject_ = function(opt_target, opt_object) {
  if (goog.typeOf(opt_target) != goog.typeOf(opt_object))
    return false;

  if (goog.isObject(opt_object)) {
    for (var i in opt_object) {
      if (opt_object.hasOwnProperty(i)) {
        if (!opt_target.hasOwnProperty(i) || !this.checkConsistencyByObject_(opt_target[i], opt_object[i]))
          return false;
      }
    }
  }

  return true;
};


/**
 *
 * @param {Boolean=} opt_noRebuild
 */
anychart.chartEditor2Module.EditorModel.prototype.dispatchUpdate = function(opt_noRebuild) {
  if (this.suspendQueue_ > 0) {
    this.needDispatch_ = true;
    return;
  }

  console.log(this.model_);

  this.dispatchEvent({
    type: anychart.chartEditor2Module.events.EventType.EDITOR_MODEL_UPDATE,
    rebuild: !opt_noRebuild
  });

  this.needDispatch_ = false;
};


anychart.chartEditor2Module.EditorModel.prototype.suspendDispatch = function() {
  this.suspendQueue_++;
};


anychart.chartEditor2Module.EditorModel.prototype.resumeDispatch = function() {
  this.suspendQueue_--;
  if (this.suspendQueue_ == 0 && this.needDispatch_)
    this.dispatchUpdate();
};


/**
 * Converts string to valid model key.
 * @param {anychart.chartEditor2Module.EditorModel.Key} key
 * @return {String} key as a string
 */
anychart.chartEditor2Module.EditorModel.getStringKey = function(key) {
  // var stringKey = '';

  // for (var i = 0; i < key.length; i++) {
  //   var level = key[i];
  //   if (i == 0 && goog.isArray(level) && (level[0] == 'anychart' || level[0] == 'chart')) continue;
  //
  //   if (goog.isArray(level))
  //     stringKey += level[0] + '(' + level[1] + ')';
  //   else if (goog.isString(level))
  //     stringKey += level;
  //
  //   if (i < key.length - 1)
  //     stringKey += '.';
  // }

  return key[key.length - 1];
};


anychart.chartEditor2Module.EditorModel.prototype.getModel = function() {
  return this.model_;
};
// endregion


// region Data Model
/**
 * @enum {string}
 */
anychart.chartEditor2Module.EditorModel.dataType = {
  UPLOADED: 'u',
  PREDEFINED: 'p',
  GEO: 'g'
};


anychart.chartEditor2Module.EditorModel.prototype.getFullId = function(dataType, setId) {
  return dataType + setId;
};


anychart.chartEditor2Module.EditorModel.prototype.addData = function(dataType, setId, data) {
  var id = this.getFullId(dataType, setId);
  if (!this.data_[id]) {
    this.data_[id] = {'type': dataType, 'setId': setId, 'setFullId': id, 'data': data};
  }
  this.preparedData_.length = 0;

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.removeData = function(setFullId) {
  delete this.data_[setFullId];
  this.preparedData_.length = 0;

  if (setFullId == this.model_.dataSettings.active) {
    this.chooseActiveAndField();
  }

  this.dispatchUpdate();
};


anychart.chartEditor2Module.EditorModel.prototype.getDataKeys = function() {
  return goog.object.getKeys(this.data_);
};


/**
 * @param {String} active
 * @return {?Object} Prepared active dataset.
 */
anychart.chartEditor2Module.EditorModel.prototype.getPreparedDataActive = function(active) {
  var data = this.getPreparedData();
  data = goog.array.filter(data, function(item) {
    return item['setFullId'] == active;
  });

  return data.length ? data[0] : null
};


/**
 * @return {!Array.<*>}
 */
anychart.chartEditor2Module.EditorModel.prototype.getPreparedData = function() {
  return this.isDirty() ? this.prepareData_() : this.preparedData_;
};


/**
 * @return {?String}
 */
anychart.chartEditor2Module.EditorModel.prototype.getActive = function() {
  return this.model_.dataSettings.active;
};


anychart.chartEditor2Module.EditorModel.prototype.getRawData = function() {
  var dataSet = this.data_[this.getActive()];
  return dataSet ? dataSet['data'] : null;
};


anychart.chartEditor2Module.EditorModel.prototype.isDirty = function() {
  return !this.preparedData_.length;
};


anychart.chartEditor2Module.EditorModel.prototype.prepareData_ = function() {
  var joinedSets = [];
  var singleSets = [];
  var geoSets = [];
  var dataSet;

  for (var i in this.data_) {
    if (this.data_.hasOwnProperty(i)) {
      dataSet = this.prepareDataSet_(this.data_[i]);

      var joined = false;
      if (dataSet['join']) {
        /*
         * todo: process join
         */
        joined = true;
      }

      if (joined) {
        dataSet['name'] = 'Joined set ' + (joinedSets.length + 1);
        joinedSets.push(dataSet);
      } else if (dataSet.type == anychart.chartEditor2Module.EditorModel.dataType.GEO) {
        dataSet['name'] = 'Geo data ' + (geoSets.length + 1);
        geoSets.push(dataSet);
      } else {
        dataSet['name'] = 'Data set ' + (singleSets.length + 1);
        singleSets.push(dataSet);
      }
    }
  }

  this.preparedData_ = goog.array.concat(joinedSets, singleSets, geoSets);

  return this.preparedData_;
};


anychart.chartEditor2Module.EditorModel.prototype.prepareDataSet_ = function(dataSet) {
  var result = {type: dataSet['type'], setId: dataSet['setId'], setFullId: dataSet['setFullId']};

  var row = dataSet['type'] == anychart.chartEditor2Module.EditorModel.dataType.GEO ?
      dataSet['data']['features'][0]['properties'] :
      dataSet['data'][0];

  var settings = new goog.format.JsonPrettyPrinter.SafeHtmlDelimiters();
  settings.lineBreak = '';
  settings.objectStart = '\n{';
  settings.arrayStart = '\n[';
  settings.space = '';
  settings.propertySeparator = ', ';
  settings.nameValueSeparator = ': ';

  var f = new goog.format.JsonPrettyPrinter(settings);
  result['sample'] = f.format(row);

  var fields = [];
  var i;
  var field;

  for (i in row) {
    field = {
      'name': goog.isArray(row) ? 'Field ' + i : i,
      'type': typeof(row[i]),
      'key': i
    };
    fields.push(field);
  }
  result['fields'] = fields;

  return result;
};
// endregion