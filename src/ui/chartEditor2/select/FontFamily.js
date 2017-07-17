goog.provide('anychart.ui.chartEditor2.select.FontFamily');
goog.require('anychart.ui.chartEditor2.select.Base');



/**
 * @constructor
 * @extends {anychart.ui.chartEditor2.select.Base}
 */
anychart.ui.chartEditor2.select.FontFamily = function() {
  anychart.ui.chartEditor2.select.FontFamily.base(this, 'constructor');

  this.setOptions([
    'Arial, Helvetica, sans-serif',
    'Arial Black, Gadget, sans-serif',
    'Comic Sans MS, cursive, sans-serif',
    'Impact, Charcoal, sans-serif',
    'Lucida Sans Unicode, Lucida Grande, sans-serif',
    'Tahoma, Geneva, sans-serif',
    'Trebuchet MS, Helvetica, sans-serif',
    'Verdana, Helvetica, Arial, sans-serif',
    '"Lucida Console", Monaco, monospace',
    '"Source Sans Pro", sans-serif'
  ]);
  this.setCaptions([
    'Arial',
    'Arial Black',
    'Comic Sans MS',
    'Impact',
    'Lucida Sans Unicode',
    'Tahoma',
    'Trebuchet MS',
    'Verdana',
    'Lucida Console',
    'Source Sans Pro'
  ]);
};
goog.inherits(anychart.ui.chartEditor2.select.FontFamily, anychart.ui.chartEditor2.select.Base);
