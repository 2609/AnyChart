/**
 * @fileoverview anychart namespace file.
 * @suppress {extraRequire}
 */

goog.provide('anychart');
goog.provide('anychart.gauges');
goog.provide('anychart.globalLock');
goog.require('acgraph');
goog.require('anychart.base');
goog.require('anychart.core.reporting');
goog.require('anychart.core.ui.StageCredits');
goog.require('anychart.performance');
goog.require('anychart.themes.merging');
goog.require('anychart.utils');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.animationFrame.polyfill');
goog.require('goog.events.KeyEvent');
goog.require('goog.events.KeyHandler');
goog.require('goog.json.hybrid');

/**
 * Core space for all anychart components.
 * @namespace
 * @name anychart
 */


//----------------------------------------------------------------------------------------------------------------------
//
//  Graphics engine
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Drawing core namespace.
 * @namespace
 * @name anychart.graphics
 */
anychart.graphics = window['acgraph'];


/**
 * If the credits is allowed to be disabled for the stage regardless of the product key.
 * @type {boolean}
 */
acgraph.vector.Stage.prototype.allowCreditsDisabling = false;


/**
 * Stage credits.
 * @param {(Object|boolean|null)=} opt_value .
 * @return {!(acgraph.vector.Stage|anychart.core.ui.StageCredits)}
 */
acgraph.vector.Stage.prototype.credits = function(opt_value) {
  if (!this.credits_) {
    this.credits_ = new anychart.core.ui.StageCredits(this, this.allowCreditsDisabling);
    this.credits_.setup(anychart.getFullTheme()['stageCredits']);
  }
  if (goog.isDef(opt_value)) {
    this.credits_.setup(opt_value);
    return this;
  }
  return this.credits_;
};
acgraph.vector.Stage.prototype['credits'] = acgraph.vector.Stage.prototype.credits;


//region --- goog.events.KeyHandler#handleEvent patch ---
/**
 * TODO(AntonKagakin): remove this code when library and compiler will be updated to latest versions.
 * https://www.chromestatus.com/features/5316065118650368 for more information
 * code for patching was taken from https://github.com/google/closure-library/commit/e5c0972a63c6bb1c5e06d8762da58868d2e60d7c
 * Handles the events on the element.
 * @param {goog.events.BrowserEvent} e  The keyboard event sent from the
 *     browser.
 * @suppress {duplicate}
 */
goog.events.KeyHandler.prototype.handleEvent = function(e) {
  var be = e.getBrowserEvent();
  var keyCode, charCode;
  var altKey = be.altKey;

  // IE reports the character code in the keyCode field for keypress events.
  // There are two exceptions however, Enter and Escape.
  if (goog.userAgent.IE && e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = keyCode != goog.events.KeyCodes.ENTER &&
        keyCode != goog.events.KeyCodes.ESC ?
            be.keyCode : 0;

  // Safari reports the character code in the keyCode field for keypress
  // events but also has a charCode field.
  } else if ((goog.userAgent.WEBKIT || goog.userAgent.EDGE) &&
      e.type == goog.events.EventType.KEYPRESS) {
    keyCode = this.keyCode_;
    charCode = be.charCode >= 0 && be.charCode < 63232 &&
        goog.events.KeyCodes.isCharacterKey(keyCode) ?
            be.charCode : 0;

  // Opera reports the keycode or the character code in the keyCode field.
  } else if (goog.userAgent.OPERA && !goog.userAgent.WEBKIT) {
    keyCode = this.keyCode_;
    charCode = goog.events.KeyCodes.isCharacterKey(keyCode) ?
        be.keyCode : 0;

  // Mozilla reports the character code in the charCode field.
  } else {
    keyCode = be.keyCode || this.keyCode_;
    charCode = be.charCode || 0;
    if (goog.events.KeyHandler.SAVE_ALT_FOR_KEYPRESS_) {
      altKey = this.altKey_;
    }
    // On the Mac, shift-/ triggers a question mark char code and no key code
    // (normalized to WIN_KEY), so we synthesize the latter.
    if (goog.userAgent.MAC &&
        charCode == goog.events.KeyCodes.QUESTION_MARK &&
        keyCode == goog.events.KeyCodes.WIN_KEY) {
      keyCode = goog.events.KeyCodes.SLASH;
    }
  }

  keyCode = goog.events.KeyCodes.normalizeKeyCode(keyCode);
  var key = keyCode;

  // Correct the key value for certain browser-specific quirks.
  if (keyCode) {
    if (keyCode >= 63232 && keyCode in goog.events.KeyHandler.safariKey_) {
      // NOTE(nicksantos): Safari 3 has fixed this problem,
      // this is only needed for Safari 2.
      key = goog.events.KeyHandler.safariKey_[keyCode];
    } else {

      // Safari returns 25 for Shift+Tab instead of 9.
      if (keyCode == 25 && e.shiftKey) {
        key = 9;
      }
    }
  } else if (be.keyIdentifier &&
             be.keyIdentifier in goog.events.KeyHandler.keyIdentifier_) {
    // This is needed for Safari Windows because it currently doesn't give a
    // keyCode/which for non printable keys.
    key = goog.events.KeyHandler.keyIdentifier_[be.keyIdentifier];
  }

  // If we get the same keycode as a keydown/keypress without having seen a
  // keyup event, then this event was caused by key repeat.
  var repeat = key == this.lastKey_;
  this.lastKey_ = key;

  var event = new goog.events.KeyEvent(key, charCode, repeat, be);
  event.altKey = altKey;
  this.dispatchEvent(event);
};
//endregion


/**
 Sets and returns an address export server script, which is used to export to an image
 or PDF.
 @see acgraph.vector.Stage#saveAsPdf
 @see acgraph.vector.Stage#saveAsPng
 @see acgraph.vector.Stage#saveAsJpg
 @see acgraph.vector.Stage#saveAsSvg
 @param {string=} opt_address Export server script URL.
 @return {string} Export server script URL.
 */
anychart.server = window['acgraph']['server'];


//----------------------------------------------------------------------------------------------------------------------
//
//  Global lock
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * If the globalLock is locked.
 * @type {number}
 */
anychart.globalLock.locked = 0;


/**
 * An array of subscribers for the globalLock free.
 * @type {!Array.<Function>}
 */
anychart.globalLock.subscribers = [];


/**
 * Locks the globalLock. You should then free the lock. The lock should be freed the same number of times that it
 * was locked.
 */
anychart.globalLock.lock = function() {
  anychart.globalLock.locked++;
};


/**
 * Registers a callback for the globalLock free.
 * @param {!Function} handler Handler function.
 * @param {Object=} opt_context Handler context.
 */
anychart.globalLock.onUnlock = function(handler, opt_context) {
  if (anychart.globalLock.locked) {
    anychart.globalLock.subscribers.push(goog.bind(handler, opt_context));
  } else {
    handler.apply(opt_context);
  }
};


/**
 * Frees the lock and fires unlock callbacks if it was the last free.
 */
anychart.globalLock.unlock = function() {
  anychart.globalLock.locked--;
  if (!anychart.globalLock.locked) {
    var arr = anychart.globalLock.subscribers.slice(0);
    anychart.globalLock.subscribers.length = 0;
    for (var i = 0; i < arr.length; i++) {
      arr[i]();
    }
  }
};


//----------------------------------------------------------------------------------------------------------------------
//
//  JSON
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @type {Object}
 */
anychart.chartTypesMap = {};


/**
 * @type {Object}
 */
anychart.gaugeTypesMap = {};


/**
 * @type {Object}
 */
anychart.mapTypesMap = {};


/**
 * @type {Object}
 */
anychart.ganttTypesMap = {};


/**
 * @param {string} type
 * @return {anychart.core.Chart}
 */
anychart.createChartByType = function(type) {
  var cls = anychart.chartTypesMap[type];
  if (cls) {
    return /** @type {anychart.core.Chart} */(cls());
  } else {
    throw 'Unknown chart type: ' + type + '\nProbably it is in some other module, see module list for details.';
  }
};


/**
 * @param {string} type
 * @return {anychart.core.Chart}
 */
anychart.createGaugeByType = function(type) {
  var cls = anychart.gaugeTypesMap[type];
  if (cls) {
    return /** @type {anychart.core.Chart} */(cls());
  } else {
    throw 'Unknown gauge type: ' + type + '\nProbably it is in some other module, see module list for details.';
  }
};


/**
 * @param {string} type
 * @return {anychart.core.Chart}
 */
anychart.createMapByType = function(type) {
  var cls = anychart.mapTypesMap[type];
  if (cls) {
    return /** @type {anychart.core.Chart} */(cls());
  } else {
    throw 'Unknown map type: ' + type + '\nProbably it is in some other module, see module list for details.';
  }
};


/**
 * @param {string} type
 * @return {anychart.core.Chart}
 */
anychart.createGanttByType = function(type) {
  var cls = anychart.ganttTypesMap[type];
  if (cls) {
    return /** @type {anychart.core.Chart} */(cls());
  } else {
    throw 'Unknown gantt type: ' + type + '\nProbably it is in some other module, see module list for details.';
  }
};


/**
 * Creates an element by JSON config.
 * @example
 *  var json = {
 *    "chart": {
 *      "type": "pie",
 *      "data": [
 *        ["Product A", 1222],
 *        ["Product B", 2431],
 *        ["Product C", 3624]
 *      ]
 *    }
 *  };
 * var chart = anychart.fromJson(json);
 * chart.container('container').draw();
 * @param {(Object|string)} jsonConfig Config.
 * @return {*} Element created by config.
 */
anychart.fromJson = function(jsonConfig) {
  /**
   * Parsed json config.
   * @type {Object}
   */
  var json;
  if (goog.isString(jsonConfig)) {
    json = goog.json.hybrid.parse(jsonConfig);
  } else if (goog.isObject(jsonConfig) && !goog.isFunction(jsonConfig)) {
    json = jsonConfig;
  }

  var instance = null;

  if (json) {
    var chart = json['chart'];
    var gauge = json['gauge'];
    var gantt = json['gantt'];
    var map = json['map'];
    if (chart)
      instance = anychart.createChartByType(chart['type']);
    else if (gauge)
      instance = anychart.createGaugeByType(gauge['type']);
    else if (gantt) {
      if (gantt['type'] == 'project') //legacy
        gantt['type'] = anychart.enums.ChartTypes.GANTT_PROJECT;
      else if (gantt['type'] == 'resource')
        gantt['type'] = anychart.enums.ChartTypes.GANTT_RESOURCE;
      instance = anychart.createGanttByType(gantt['type']);
    } else if (map)
      instance = anychart.createMapByType(map['type']);
  }

  if (instance)
    instance.setupByVal(chart || gauge || gantt || map);
  else
    anychart.core.reporting.error(anychart.enums.ErrorCode.EMPTY_CONFIG);

  return instance;
};


/**
 * Creates an element by XML config.
 * @example
 * var xmlString = '<xml>' +
 *   '<chart type="pie" >' +
 *     '<data>' +
 *       '<point name="Product A" value="1222"/>' +
 *       '<point name="Product B" value="2431"/>' +
 *       '<point name="Product C" value="3624"/>' +
 *       '<point name="Product D" value="5243"/>' +
 *       '<point name="Product E" value="8813"/>' +
 *     '</data>' +
 *   '</chart>' +
 * '</xml>';
 * var chart = anychart.fromXml(xmlString);
 * chart.container('container').draw();
 * @param {string|Node} xmlConfig Config.
 * @return {*} Element created by config.
 */
anychart.fromXml = function(xmlConfig) {
  return anychart.fromJson(anychart.utils.xml2json(xmlConfig));
};
//----------------------------------------------------------------------------------------------------------------------
//
//  Default font settings
//
//----------------------------------------------------------------------------------------------------------------------
goog.global['anychart'] = goog.global['anychart'] || {};


/**
 * Default value for the font size.
 * @type {string|number}
 *
 */
//goog.global['anychart']['fontSize'] = '12px';
goog.global['anychart']['fontSize'] = '13px';


/**
 * Default value for the font color.
 * @type {string}
 *
 */
//goog.global['anychart']['fontColor'] = '#000';
goog.global['anychart']['fontColor'] = '#7c868e'; //colorAxisFont


/**
 * Default value for the font style.
 * @type {string}
 *
 */
//goog.global['anychart']['fontFamily'] = 'Arial';
goog.global['anychart']['fontFamily'] = "'Verdana', Helvetica, Arial, sans-serif";


/**
 * Default value for the text direction. Text direction may be left-to-right or right-to-left.
 * @type {string}
 *
 */
goog.global['anychart']['textDirection'] = acgraph.vector.Text.Direction.LTR;
//endregion


//----------------------------------------------------------------------------------------------------------------------
//
//  Document load event.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * @type {Array.<Array>}
 * @private
 */
anychart.documentLoadCallbacks_;


/**
 * Add callback for the document load event.<br/>
 * It is fired when the entire page loads, including its content (images, css, scripts, etc.).
 * @param {Function} func Function which will be called on document load event.
 * @param {*=} opt_scope Function call context.
 */
anychart.onDocumentLoad = function(func, opt_scope) {
  if (!anychart.documentLoadCallbacks_) {
    anychart.documentLoadCallbacks_ = [];
  }
  anychart.documentLoadCallbacks_.push([func, opt_scope]);

  goog.events.listen(goog.dom.getWindow(), goog.events.EventType.LOAD, function() {
    for (var i = 0, count = anychart.documentLoadCallbacks_.length; i < count; i++) {
      var item = anychart.documentLoadCallbacks_[i];
      item[0].apply(item[1]);
    }
    anychart.documentLoadCallbacks_.length = 0;
  });
};


/**
 * Attaching DOM load events.
 * @private
 */
anychart.attachDomEvents_ = function() {
  var window = goog.dom.getWindow();
  var document = window['document'];

  // goog.events.EventType.DOMCONTENTLOADED - for browsers that support DOMContentLoaded event. IE9+
  // goog.events.EventType.READYSTATECHANGE - for IE9-
  acgraph.events.listen(document, [goog.events.EventType.DOMCONTENTLOADED, goog.events.EventType.READYSTATECHANGE], anychart.completed_, false);

  // A fallback to window.onload that will always work
  acgraph.events.listen(/** @type {EventTarget}*/ (window), goog.events.EventType.LOAD, anychart.completed_, false);
};


/**
 * Detaching DOM load events.
 * @private
 */
anychart.detachDomEvents_ = function() {
  var window = goog.dom.getWindow();
  var document = window['document'];

  acgraph.events.unlisten(document, [goog.events.EventType.DOMCONTENTLOADED, goog.events.EventType.READYSTATECHANGE], anychart.completed_, false);
  acgraph.events.unlisten(/** @type {EventTarget}*/ (window), goog.events.EventType.LOAD, anychart.completed_, false);
};


/**
 * Function called when one of [ DOMContentLoad , onreadystatechanged ] events fired on document or onload on window.
 * @param {goog.events.Event} event Event object.
 * @private
 */
anychart.completed_ = function(event) {
  var document = goog.dom.getWindow()['document'];
  // readyState === "complete" is good enough for us to call the dom ready in oldIE
  if (document.addEventListener || window['event']['type'] === 'load' || document['readyState'] === 'complete') {
    anychart.detachDomEvents_();
    anychart.ready_(event);
  }
};


/**
 * Identifies that document is loaded.
 * @type {boolean}
 * @private
 */
anychart.isReady_ = false;


/**
 * Function called when document content loaded.
 * @private
 * @param {goog.events.Event} event Event object.
 * @return {*} Nothing if document already loaded or timeoutID.
 */
anychart.ready_ = function(event) {
  if (anychart.isReady_) {
    return;
  }

  var document = goog.dom.getWindow()['document'];

  // Make sure the document body at least exists in case IE gets a little overzealous (ticket #5443).
  if (!document['body']) {
    return setTimeout(function() {
      anychart.ready_(event);
    }, 1);
  }

  anychart.isReady_ = true;

  for (var i = 0, count = anychart.documentReadyCallbacks_.length; i < count; i++) {
    var item = anychart.documentReadyCallbacks_[i];
    item[0].apply(item[1], [event]);
  }
};


/**
 * Add callback for document ready event.<br/>
 * It is called when the DOM is ready, this can happen prior to images and other external content is loaded.
 * @example <t>lineChart</t>
 * chart.spline([1.1, 1.4, 1.2, 1.9]);
 * @param {Function} func Function which will called on document load event.
 * @param {*=} opt_scope Function call context.
 */
anychart.onDocumentReady = function(func, opt_scope) {
  if (anychart.isReady_) {
    func.call(opt_scope);
  }

  if (!anychart.documentReadyCallbacks_) {
    anychart.documentReadyCallbacks_ = [];
  }
  anychart.documentReadyCallbacks_.push([func, opt_scope]);

  var document = goog.dom.getWindow()['document'];

  if (document['readyState'] === 'complete') {
    setTimeout(anychart.ready_, 1);
  } else {
    anychart.attachDomEvents_();
  }
};


/**
 * License key.
 * @type {?string}
 * @private
 */
anychart.licenseKey_ = null;


/**
 * Setter for AnyChart license key.<br/>
 * To purchase a license proceed to <a href="http://www.anychart.com/buy/">Buy AnyChart</a> page.
 * @example
 * anychart.licenseKey('YOUR-LICENSE-KEY');
 * var chart = anychart.pie([1, 2, 3]);
 * chart.container(stage).draw();
 * @param {string=} opt_value Your licence key.
 * @return {?string} Current licence key.
 */
anychart.licenseKey = function(opt_value) {
  if (goog.isDef(opt_value)) {
    anychart.licenseKey_ = opt_value;
  }
  return anychart.licenseKey_;
};


/**
 * Method to get hash from string.
 * @return {boolean} Is key valid.
 */
anychart.isValidKey = function() {
  if (!goog.isDefAndNotNull(anychart.licenseKey_) || !goog.isString(anychart.licenseKey_)) return false;
  var lio = anychart.licenseKey_.lastIndexOf('-');
  var value = anychart.licenseKey_.substr(0, lio);
  var hashToCheck = anychart.licenseKey_.substr(lio + 1);
  return (hashToCheck == anychart.utils.crc32(value + anychart.utils.getSalt()));
};


//----------------------------------------------------------------------------------------------------------------------
//
//  Themes.
//
//----------------------------------------------------------------------------------------------------------------------
/**
 * Array of themes that will be applied for anychart globally.
 * @type {Array<string|Object>}
 * @private
 */
anychart.themes_ = [];


/**
 * Sets the theme/themes for anychart globally or gets current theme/themes.
 * @param {?(string|Object|Array<string|Object>)=} opt_value Object/name of a theme or array of objects/names of the themes.
 * @return {string|Object|Array<string|Object>}
 */
anychart.theme = function(opt_value) {
  if (goog.isDef(opt_value)) {
    if (!goog.isArray(opt_value)) {
      opt_value = [opt_value];
    }
    anychart.themes_ = opt_value || [];
    delete anychart.compiledTheme_;
  }
  return anychart.themes_;
};


/**
 * Append theme for anychart globally.
 * @param {string|Object} value
 */
anychart.appendTheme = function(value) {
  if (goog.isString(value)) {
    value = goog.global['anychart']['themes'][value];
  }
  anychart.themes_.push(value);
  if (anychart.compiledTheme_) {
    anychart.compiledTheme_ = anychart.themes.merging.merge(
        anychart.themes.merging.compileTheme(value),
        anychart.compiledTheme_);
  }
};


/**
 * Returns final compiled and merged theme.
 * @return {*}
 */
anychart.getFullTheme = function() {
  if (!anychart.compiledTheme_) {
    anychart.performance.start('Theme compilation');
    if (!anychart.defaultThemeCompiled_) {
      anychart.defaultThemeCompiled_ = anychart.themes.merging.compileTheme(
          goog.global['anychart']['themes'][anychart.DEFAULT_THEME]);
    }
    if (anychart.themes_.length) {
      anychart.compiledTheme_ = goog.array.reduce(anychart.themes_, function(mergedThemes, themeToMerge) {
        return anychart.themes.merging.merge(
            anychart.themes.merging.compileTheme(
                goog.isString(themeToMerge) ? goog.global['anychart']['themes'][themeToMerge] : themeToMerge),
            mergedThemes);
      }, anychart.defaultThemeCompiled_);
    } else {
      anychart.compiledTheme_ = anychart.defaultThemeCompiled_;
    }
    anychart.performance.end('Theme compilation');
  }
  return anychart.compiledTheme_;
};


// we execute it here to move load from first chart drawing to library initialization phase.
anychart.getFullTheme();


/**
 * @ignoreDoc
 */
anychart.area = anychart.area || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Area chart']);
};


/**
 * @ignoreDoc
 */
anychart.area3d = anychart.area3d || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['3D Area chart']);
};


/**
 * @ignoreDoc
 */
anychart.bar = anychart.bar || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Bar chart']);
};


/**
 * @ignoreDoc
 */
anychart.bar3d = anychart.bar3d || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['3D Bar chart']);
};


/**
 * @ignoreDoc
 */
anychart.bubble = anychart.bubble || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Bubble chart']);
};


/**
 * @ignoreDoc
 */
anychart.bullet = anychart.bullet || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Bullet chart']);
};


/**
 * @ignoreDoc
 */
anychart.cartesian = anychart.cartesian || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Cartesian chart']);
};


/**
 * @ignoreDoc
 */
anychart.cartesian3d = anychart.cartesian3d || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['3D Cartesian chart']);
};


/**
 * @ignoreDoc
 */
anychart.scatter = anychart.scatter || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Scatter chart']);
};


/**
 * @ignoreDoc
 */
anychart.column = anychart.column || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Column chart']);
};


/**
 * @ignoreDoc
 */
anychart.column3d = anychart.column3d || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['3D Column chart']);
};


/**
 * @ignoreDoc
 */
anychart.box = anychart.box || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Box chart']);
};


/**
 * @ignoreDoc
 */
anychart.financial = anychart.financial || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Financial chart']);
};


/**
 * @ignoreDoc
 */
anychart.funnel = anychart.funnel || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Funnel chart']);
};


/**
 * @ignoreDoc
 */
anychart.line = anychart.line || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Line chart']);
};


/**
 * @ignoreDoc
 */
anychart.marker = anychart.marker || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Marker chart']);
};


/**
 * @ignoreDoc
 */
anychart.pie = anychart.pie || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Pie chart']);
};


/**
 * @ignoreDoc
 */
anychart.pie3d = anychart.pie3d || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['3D Pie chart']);
};


/**
 * @ignoreDoc
 */
anychart.pyramid = anychart.pyramid || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Pyramid chart']);
};


/**
 * @ignoreDoc
 */
anychart.radar = anychart.radar || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Radar chart']);
};


/**
 * @ignoreDoc
 */
anychart.polar = anychart.polar || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Polar chart']);
};


/**
 * @ignoreDoc
 */
anychart.sparkline = anychart.sparkline || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Sparkline chart']);
};


/**
 * @ignoreDoc
 */
anychart.heatMap = anychart.heatMap || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['HeatMap chart']);
};


/**
 * @ignoreDoc
 */
anychart.circularGauge = anychart.circularGauge || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Circular gauge']);
};


/**
 * @ignoreDoc
 */
anychart.gauges.circular = anychart.gauges.circular || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Circular gauge']);
};


/**
 * @ignoreDoc
 */
anychart.gauges.linear = anychart.gauges.linear || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Linear gauge']);
};


/**
 * @ignoreDoc
 */
anychart.gauges.tank = anychart.gauges.tank || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Tank gauge']);
};


/**
 * @ignoreDoc
 */
anychart.gauges.thermometer = anychart.gauges.thermometer || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Thermometer gauge']);
};


/**
 * @ignoreDoc
 */
anychart.gauges.led = anychart.gauges.led || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['LED gauge']);
};


/**
 * @ignoreDoc
 */
anychart.map = anychart.map || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Map']);
};


/**
 * @ignoreDoc
 */
anychart.choropleth = anychart.choropleth || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Choropleth map']);
};


/**
 * @ignoreDoc
 */
anychart.bubbleMap = anychart.bubbleMap || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Bubble map']);
};


/**
 * @ignoreDoc
 */
anychart.connector = anychart.connector || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Connector map']);
};


/**
 * @ignoreDoc
 */
anychart.markerMap = anychart.markerMap || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Marker map']);
};


/**
 * @ignoreDoc
 */
anychart.seatMap = anychart.seatMap || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Seat map']);
};


/**
 * @ignoreDoc
 */
anychart.ganttProject = anychart.ganttProject || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Gantt Project chart']);
};


/**
 * @ignoreDoc
 */
anychart.ganttResource = anychart.ganttResource || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Gantt Resource chart']);
};


/**
 * @ignoreDoc
 */
anychart.stock = anychart.stock || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Stock chart']);
};


/**
 * @ignoreDoc
 */
anychart.toolbar = anychart.toolbar || /** @type {function():null} */ (function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Toolbar']);
  return null;
});


/**
 * @ignoreDoc
 */
anychart.ganttToolbar = anychart.ganttToolbar || /** @type {function():null} */ (function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['Gantt toolbar']);
  return null;
});


/**
 * @ignoreDoc
 */
anychart.treeMap = anychart.treeMap || function() {
  anychart.core.reporting.error(anychart.enums.ErrorCode.NO_FEATURE_IN_MODULE, null, ['TreeMap chart']);
};


if (COMPILED) {
  goog.dom.animationFrame.polyfill.install();
} else {
  anychart.onDocumentReady(function() {
    goog.dom.animationFrame.polyfill.install();
  });
}


//exports
goog.exportSymbol('anychart.graphics', anychart.graphics);//import
goog.exportSymbol('anychart.server', anychart.server);
goog.exportSymbol('anychart.fromJson', anychart.fromJson);//doc|ex
goog.exportSymbol('anychart.fromXml', anychart.fromXml);//doc|ex
goog.exportSymbol('anychart.onDocumentLoad', anychart.onDocumentLoad);//doc|need-ex
goog.exportSymbol('anychart.onDocumentReady', anychart.onDocumentReady);//doc|ex
goog.exportSymbol('anychart.licenseKey', anychart.licenseKey);//doc|ex
goog.exportSymbol('anychart.area', anychart.area);//linkedFromModule
goog.exportSymbol('anychart.area3d', anychart.area3d);
goog.exportSymbol('anychart.bar', anychart.bar);//linkedFromModule
goog.exportSymbol('anychart.bar3d', anychart.bar3d);
goog.exportSymbol('anychart.box', anychart.box);
goog.exportSymbol('anychart.bubble', anychart.bubble);//linkedFromModule
goog.exportSymbol('anychart.bullet', anychart.bullet);//linkedFromModule
goog.exportSymbol('anychart.cartesian', anychart.cartesian);//linkedFromModule
goog.exportSymbol('anychart.cartesian3d', anychart.cartesian3d);
goog.exportSymbol('anychart.column', anychart.column);//linkedFromModule
goog.exportSymbol('anychart.column3d', anychart.column3d);
goog.exportSymbol('anychart.financial', anychart.financial);//linkedFromModule
goog.exportSymbol('anychart.funnel', anychart.funnel);//linkedFromModule
goog.exportSymbol('anychart.line', anychart.line);//linkedFromModule
goog.exportSymbol('anychart.marker', anychart.marker);//linkedFromModule
goog.exportSymbol('anychart.pie', anychart.pie);//linkedFromModule
goog.exportSymbol('anychart.pie3d', anychart.pie3d);//linkedFromModule
goog.exportSymbol('anychart.pyramid', anychart.pyramid);//linkedFromModule
goog.exportSymbol('anychart.radar', anychart.radar);
goog.exportSymbol('anychart.polar', anychart.polar);
goog.exportSymbol('anychart.sparkline', anychart.sparkline);
goog.exportSymbol('anychart.heatMap', anychart.heatMap);
goog.exportSymbol('anychart.scatter', anychart.scatter);
goog.exportSymbol('anychart.map', anychart.map);
goog.exportSymbol('anychart.choropleth', anychart.choropleth);
goog.exportSymbol('anychart.bubbleMap', anychart.bubbleMap);
goog.exportSymbol('anychart.markerMap', anychart.markerMap);
goog.exportSymbol('anychart.seatMap', anychart.seatMap);
goog.exportSymbol('anychart.connector', anychart.connector);
goog.exportSymbol('anychart.areaChart', anychart.area);
goog.exportSymbol('anychart.barChart', anychart.bar);
goog.exportSymbol('anychart.bubbleChart', anychart.bubble);
goog.exportSymbol('anychart.bulletChart', anychart.bullet);
goog.exportSymbol('anychart.cartesianChart', anychart.cartesian);
goog.exportSymbol('anychart.columnChart', anychart.column);
goog.exportSymbol('anychart.financialChart', anychart.financial);
goog.exportSymbol('anychart.lineChart', anychart.line);
goog.exportSymbol('anychart.markerChart', anychart.marker);
goog.exportSymbol('anychart.pieChart', anychart.pie);
goog.exportSymbol('anychart.radarChart', anychart.radar);
goog.exportSymbol('anychart.polarChart', anychart.polar);
goog.exportSymbol('anychart.scatterChart', anychart.scatter);
goog.exportSymbol('anychart.circularGauge', anychart.circularGauge);
goog.exportSymbol('anychart.gauges.circular', anychart.gauges.circular);
goog.exportSymbol('anychart.gauges.linear', anychart.gauges.linear);
goog.exportSymbol('anychart.gauges.thermometer', anychart.gauges.thermometer);
goog.exportSymbol('anychart.gauges.tank', anychart.gauges.tank);
goog.exportSymbol('anychart.gauges.led', anychart.gauges.led);
goog.exportSymbol('anychart.ganttProject', anychart.ganttProject);
goog.exportSymbol('anychart.ganttResource', anychart.ganttResource);
goog.exportSymbol('anychart.stock', anychart.stock);
goog.exportSymbol('anychart.theme', anychart.theme);
goog.exportSymbol('anychart.appendTheme', anychart.appendTheme);
goog.exportSymbol('anychart.toolbar', anychart.toolbar);
goog.exportSymbol('anychart.ganttToolbar', anychart.ganttToolbar);
goog.exportSymbol('anychart.treeMap', anychart.treeMap);
