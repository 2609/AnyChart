goog.provide('anychart.themes.defaultTheme');


window['anychart'] = window['anychart'] || {};
window['anychart']['themes'] = window['anychart']['themes'] || {};
window['anychart']['themes']['defaultTheme'] = {
  // default font settings
  'defaultFontSettings': {
    'fontSize': 13,
    'fontFamily': '\'Verdana\', Helvetica, Arial, sans-serif',
    'fontColor': '#7c868e',
    'textDirection': 'ltr',
    'fontOpacity': 1,
    'fontDecoration': 'none',
    'fontStyle': 'normal',
    'fontVariant': 'normal',
    'fontWeight': 'normal',
    'letterSpacing': 'normal',
    'lineHeight': 'normal',
    'textIndent': 0,
    'vAlign': 'top',
    'hAlign': 'start',
    'textWrap': 'byLetter',
    'textOverflow': '',
    'selectable': false,
    'disablePointerEvents': false,
    'useHtml': false
  },

  // global palettes
  'palette': {
    'type': 'distinct',
    'items': ['#64b5f6', '#1976d2', '#ef6c00', '#ffd54f', '#455a64', '#96a6a6', '#dd2c00', '#00838f', '#00bfa5', '#ffa000']
  },
  'hatchFillPalette': {
    'items': ['backwardDiagonal', 'forwardDiagonal', 'horizontal', 'vertical', 'dashedBackwardDiagonal', 'grid', 'dashedForwardDiagonal', 'dashedHorizontal', 'dashedVertical', 'diagonalCross', 'diagonalBrick', 'divot', 'horizontalBrick', 'verticalBrick', 'checkerBoard', 'confetti', 'plaid', 'solidDiamond', 'zigZag', 'weave', 'percent05', 'percent10', 'percent20', 'percent25', 'percent30', 'percent40', 'percent50', 'percent60', 'percent70', 'percent75', 'percent80', 'percent90']
  },
  'markerPalette': {
    'items': ['circle', 'diamond', 'square', 'triangleDown', 'triangleUp', 'diagonalCross', 'pentagon', 'cross', 'line', 'star5', 'star4', 'trapezium', 'star7', 'star6', 'star10']
  },

  // global background settings
  'defaultBackground': {
    'enabled': true,
    'fill': '#fff',
    'stroke': 'none',
    'cornerType': 'round',
    'corners': 0
  },

  'defaultLabelFactory': {
    'minFontSize': 8,
    'maxFontSize': 72,
    'enabled': true,
    'offsetX': 0,
    'offsetY': 0,
    'anchor': 'center',
    'padding': {
      'top': 2,
      'right': 4,
      'bottom': 2,
      'left': 4
    },
    'rotation': 0,
    'background': {
      'enabled': false,
      'stroke': {'keys': ['0 #DDDDDD 1', '1 #D0D0D0 1'], 'angle': '90'},
      'fill': {'keys': ['0 #FFFFFF 1', '0.5 #F3F3F3 1', '1 #FFFFFF 1'], 'angle': '90'}
    },
    /**
     * @this {*}
     * @return {*}
     */
    'textFormatter': function() {
      return this['value'];
    },
    /**
     * @this {*}
     * @return {*}
     */
    'positionFormatter': function() {
      return this['value'];
    }
  },

  'defaultMarkerFactory': {
    'size': 10,
    'anchor': 'center',
    'offsetX': 0,
    'offsetY': 0,
    'rotation': 0,
    /**
     * @this {*}
     * @return {*}
     */
    'positionFormatter': function() {
      return this['value'];
    }
  },

  // global title settings
  'defaultTitle': {
    'enabled': true,

    'fontSize': 16,
    'fontColor': '#7c868e',

    'text': 'Title text',

    'background': {
      'enabled': false
    },

    //'rotation': undefined',
    'width': null,
    'height': null,
    'margin': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'align': 'center',
    'hAlign': 'center'
    //'orientation': undefined
  },

  // global tooltip settings
  'defaultTooltip': {
    'enabled': true,
    'allowLeaveScreen': false,
    'isFloating': true,
    'title': {
      'enabled': false,
      'fontColor': '#ffffff',
      'fontSize': '15px',

      'fontWeight': 'bold',
      'vAlign': 'top',
      'hAlign': 'center',

      'text': 'Tooltip Title',
      'background': {
        'enabled': false
      },
      'rotation': 0,
      'width': null,
      'height': null,
      'margin': 0,
      'padding': {
        'top': 5,
        'right': 10,
        'bottom': 5,
        'left': 10
      },
      'align': 'left',
      'orientation': 'top',
      'zIndex': 1
    },
    'separator': {
      'enabled': false,
      'fill': '#cecece 0.3',
      'width': '100%',
      'height': 1,
      'margin': {
        'top': 0,
        'right': 5,
        'bottom': 0,
        'left': 5
      },
      'orientation': 'top',
      'stroke': 'none',
      'zIndex': 1
    },
    'content': {
      'enabled': true,
      'fontSize': 12,
      'fontColor': '#fff',
      'vAlign': 'top',
      'hAlign': 'left',
      'textWrap': 'byLetter',

      'text': 'Content Title',
      'background': {
        'enabled': false
      },
      'padding': {
        'top': 5,
        'right': 10,
        'bottom': 5,
        'left': 10
      },
      'width': null,
      'height': null,
      'anchor': 'leftTop',
      'offsetX': 0,
      'offsetY': 0,
      'position': 'leftTop',
      'minFontSize': 8,
      'maxFontSize': 72,
      'adjustFontSize': {
        'width': false,
        'height': false
      },
      'rotation': 0,
      'zIndex': 1
    },
    'background': {
      'enabled': true,
      'fill': '#212121 0.7',
      'stroke': null,
      'cornerType': 'round',
      'corners': 3,
      'zIndex': 0
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'offsetX': 10,
    'offsetY': 10,
    'anchor': 'leftTop',
    'hideDelay': 0,
    /**
     * @this {*}
     * @return {*}
     */
    'titleFormatter': function() {
      return this['value'];
    },
    /**
     * @this {*}
     * @return {*}
     */
    'contentFormatter': function() {
      return this['value'];
    }
  },

  // global axis settings
  'defaultAxis': {
    'enabled': true,
    'startAngle': 0,
    'drawLastLabel': true,
    'drawFirstLabel': true,
    'staggerMaxLines': 2,
    'staggerMode': false,
    'staggerLines': null,
    'width': null,
    'overlapMode': 'noOverlap',
    'stroke': '#cecece',
    'title': {
      'enabled': false,
      'fontSize': 13,
      'text': 'Axis title',
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 10,
        'left': 0
      },
      'background': {
        'enabled': false,
        'stroke': {'keys': ['#ddd', '#d0d0d0'], 'angle': '90'},
        'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': '90'}
      },
      'fontColor': '#545f69'
    },
    'labels': {
      'enabled': true,
      'offsetX': 0,
      'offsetY': 0,
      'minFontSize': 8,
      'maxFontSize': 72,
      'rotation': 0,
      'anchor': 'center',
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      }, // this is xAxis default!
      'fontWeight': 'normal',
      'fontSize': 12,
      'fontColor': '#7c868e',
      'textWrap': 'noWrap',
      'background': {
        'enabled': false,
        'stroke': {'keys': ['#ddd', '#d0d0d0'], 'angle': '90'},
        'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': '90'}
      },
      /**
       * @this {*}
       * @return {*}
       */
      'textFormatter': function() {
        return (this['value']);
      },
      /**
       * @this {*}
       * @return {*}
       */
      'positionFormatter': function() {
        return this['value'];
      },
      'zIndex': 35
    },
    'minorLabels': {
      'enabled': false,
      'offsetX': 0,
      'offsetY': 0,
      'minFontSize': 8,
      'maxFontSize': 72,
      'rotation': 0,
      'anchor': 'center',
      'padding': {
        'top': 1,
        'right': 1,
        'bottom': 0,
        'left': 1
      },
      'fontSize': 9,
      'textWrap': 'noWrap',
      'background': {
        'enabled': false,
        'stroke': {'keys': ['#ddd', '#d0d0d0'], 'angle': '90'},
        'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': '90'}
      },
      /**
       * @this {*}
       * @return {*}
       */
      'textFormatter': function() {
        return (this['value']);
      },
      /**
       * @this {*}
       * @return {*}
       */
      'positionFormatter': function() {
        return this['value'];
      },
      'zIndex': 35
    },
    'ticks': {
      'enabled': false,
      'length': 6,
      'position': 'outside',
      'stroke': '#cecece',
      'zIndex': 35
    },
    'minorTicks': {
      'enabled': false,
      'length': 4,
      'position': 'outside',
      'stroke': '#eaeaea',
      'zIndex': 35
    },
    'zIndex': 35
  },

  // base/separated chart
  'chart': {
    'defaultSeriesSettings': {
      'base': {
        'tooltip': {
          'enabled': true,
          'title': {
            'enabled': true,
            'fontSize': 13,
            'fontWeight': 'normal'
          },
          'content': {'fontSize': 11},
          'separator': {'enabled': true},
          /**
           * @this {*}
           * @return {*}
           */
          'titleFormatter': function() {return this['seriesName']},
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {return this['x'] + ': ' + this['value']}
        }
      },
      'marker': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.85, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 0.85;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 1);
        },
        'hatchFill': false,
        'size': 6,
        'hoverSize': 8
      }
    },
    'title': {
      'enabled': 'false',
      'text': 'Chart Title',
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 10,
        'left': 0
      },
      'align': 'center',
      'zIndex': 80
    },
    'background': {
      'enabled': true,
      'fill': '#fff',
      'stroke': 'none',
      'zIndex': 1
    },
    'margin': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    },
    'legend': {
      'enabled': true,
      'vAlign': 'bottom',
      'fontSize': 12,
      'itemsLayout': 'horizontal',
      'itemsSpacing': 15,
      'items': null,
      'itemsFormatter': null, // effectively equals current settings
      'itemsTextFormatter': null,
      'itemsSourceMode': 'default',
      'inverted': false,
      'hoverCursor': 'pointer',
      'iconTextSpacing': 5,
      'width': null,
      'height': null,
      'position': 'top',
      'align': 'center',
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 20,
        'left': 0
      },
      'background': {
        'enabled': false,
        'fill': '#fff',
        'stroke': 'none',
        'corners': 5
      },
      'title': {
        'enabled': false,
        'fontSize': 15,
        'text': 'Legend title',
        'background': {
          'enabled': false,
          'fill': {
            'keys': [
              '#fff',
              '#f3f3f3',
              '#fff'
            ],
            'angle': '90'
          },
          'stroke': {
            'keys': [
              '#ddd',
              '#d0d0d0'
            ],
            'angle': '90'
          }
        },
        'margin': {
          'top': 0,
          'right': 0,
          'bottom': 3,
          'left': 0
        },
        'padding': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'orientation': 'top'
      },
      'titleSeparator': {
        'enabled': false,
        'width': '100%',
        'height': 1,
        'margin': {
          'top': 3,
          'right': 0,
          'bottom': 3,
          'left': 0
        },
        'orientation': 'top',
        'fill': ['#000 0', '#000', '#000 0'],
        'stroke': 'none'
      },
      'paginator': {
        'enabled': true,

        'fontSize': 12,
        'fontColor': '#545f69',

        'background': {
          'enabled': false,
          'fill': {
            'keys': [
              '#fff',
              '#f3f3f3',
              '#fff'
            ],
            'angle': '90'
          },
          'stroke': {
            'keys': [
              '#ddd',
              '#d0d0d0'
            ],
            'angle': '90'
          }
        },
        'padding': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'margin': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'orientation': 'right',
        'layout': 'horizontal',
        'zIndex': 30
      },
      'tooltip': {
        'enabled': false,
        'title': {
          'enabled': false,
          'margin': {
            'top': 3,
            'right': 3,
            'bottom': 0,
            'left': 3
          },
          'padding': {
            'top': 0,
            'right': 0,
            'bottom': 0,
            'left': 0
          }
        }
      },
      'zIndex': 20
    },
    'credits': {
      'enabled': true,
      'text': 'AnyChart',
      'url': 'http://anychart.com',
      'alt': 'AnyChart.com',
      'inChart': false
      // we cannot determine the protocol statically :(
      //'logoSrc': 'http://static.anychart.com/logo.png'
    },
    'defaultLabelSettings': {
      'enabled': true,
      'text': 'Chart label',
      'background': {
        'enabled': false
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'width': null,
      'height': null,
      'anchor': 'leftTop',
      'position': 'leftTop',
      'offsetX': 0,
      'offsetY': 0,
      'minFontSize': 8,
      'maxFontSize': 72,
      'adjustFontSize': {
        'width': false,
        'height': false
      },
      'rotation': 0,
      'zIndex': 50
    },
    'chartLabels': [],
    'animation': {
      'enabled': false,
      'duration': 1000
    },
    'bounds': {
      'top': null,
      'right': null,
      'bottom': null,
      'left': null,
      'width': null,
      'height': null,
      'minWidth': null,
      'minHeight': null,
      'maxWidth': null,
      'maxHeight': null
    }
  },

  // merge with chart
  'cartesian': {
    'defaultSeriesSettings': {
      'base': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        'hatchFill': false,
        //'hoverHatchFill': null,

        'labels': {
          'enabled': false,
          'fontSize': 11,

          'background': {
            'enabled': false
          },
          'padding': {
            'top': 2,
            'right': 4,
            'bottom': 2,
            'left': 4
          },
          'position': 'center',
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          'rotation': 0,
          'width': null,
          'height': null,
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['value'];
          },
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverLabels': {
          'enabled': null
        },
        'markers': {
          'enabled': false,
          'disablePointerEvents': false,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          //'type': null,
          'size': 4,
          //'fill': '', // autoFill
          //'stroke': '', // autoStroke
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverMarkers': {
          'enabled': null,
          'size': 6
        },

        'clip': true,
        'color': null,

        'tooltip': {},
        'xScale': null,
        'yScale': null,
        'error': {
          'mode': 'both',
          'xError': null,
          'xUpperError': null,
          'xLowerError': null,
          'valueError': null,
          'valueUpperError': null,
          'valueLowerError': null,
          'xErrorWidth': 10,
          'valueErrorWidth': 10,
          /**
           * @this {*}
           * @return {*}
           */
          'xErrorStroke': function() {
            return window['anychart']['color']['setThickness'](window['anychart']['color']['darken'](this['sourceColor']));
          },
          /**
           * @this {*}
           * @return {*}
           */
          'valueErrorStroke': function() {
            return window['anychart']['color']['setThickness'](window['anychart']['color']['darken'](this['sourceColor']));
          }
        },
        // series legend item is managed by the legend
        //'legendItem': {
        //'iconTextSpacing': '',
        //'iconEnabled': '',
        //'iconType': '',
        //'iconStroke': '',
        //'iconFill': '',
        //'iconHatchFill': '',
        //'iconMarkerType': '',
        //'iconMarkerFill': '',
        //'iconMarkerStroke': '',
        //'text': '',
        //'disabled': ''
        //},
        // overruled by chart auto distribution setup by
        // cartesian.barsPadding() and cartesian.barGroupsPadding()
        //'pointWidth': '90%',
        //'xPointPosition': 0.5
        'connectMissingPoints': false
      },
      'area': {
        'labels': {
          'anchor': 'bottomleft',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        }
      },
      'bar': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.85, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 0.85;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 1);
        },
        'legendItem': {
          'iconStroke': null
        },
        'markers': {
          'position': 'rightCenter'
        },
        'labels': {
          'position': 'rightCenter'
        }
      },
      'box': {
        'markers': {
          'position': 'centerTop'
        },
        'labels': {
          'position': 'centerTop',
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['x'];
          }
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.85, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 0.85;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 1);
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'medianStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverMedianStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stemStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStemStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'whiskerStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverWhiskerStroke': function() {
          return this['sourceColor'];
        },
        'whiskerWidth': 0,
        'outlierMarkers': {
          'enabled': true,
          'disablePointerEvents': false,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          'type': 'circle',
          'size': 3,
          //'fill': '', // autoFill
          //'stroke': '', // autoStroke
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverOutlierMarkers': {
          'enabled': null,
          'size': 4
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'titleFormatter': function() {
            return this['name'] || this['x'];
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'Lowest: ' + parseFloat(this['lowest']).toFixed(2) + '\n' +
                'Q1: ' + parseFloat(this['q1']).toFixed(2) + '\n' +
                'Median: ' + parseFloat(this['median']).toFixed(2) + '\n' +
                'Q3: ' + parseFloat(this['q3']).toFixed(2) + '\n' +
                'Highest: ' + parseFloat(this['highest']).toFixed(2);
          }
        }
      },
      'bubble': {
        'displayNegative': false,
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.7, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.7, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'negativeFill': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor'])));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverNegativeFill': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor']))));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'negativeStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor']))));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverNegativeStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
                  window['anychart']['color']['darken'](this['sourceColor'])))));
        },
        'negativeHatchFill': null,
        'hoverNegativeHatchFill': null,
        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return parseFloat(this['value']).toFixed(2);
          }
        }
      },
      'candlestick': {
        'markers': {
          'position': 'centerTop'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'risingFill': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverRisingFill': function() {
          return window['anychart']['color']['lighten'](
              window['anychart']['color']['lighten'](this['sourceColor']));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fallingFill': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFallingFill': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor']));
        },
        'risingHatchFill': null,
        'hoverRisingHatchFill': null,
        'fallingHatchFill': null,
        'hoverFallingHatchFill': null,
        /**
         * @this {*}
         * @return {*}
         */
        'risingStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverRisingStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fallingStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor']));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFallingStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor'])));
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'O: ' + parseFloat(this['open']).toFixed(4) + '\n' +
                'H: ' + parseFloat(this['high']).toFixed(4) + '\n' +
                'L: ' + parseFloat(this['low']).toFixed(4) + '\n' +
                'C: ' + parseFloat(this['close']).toFixed(4);
          }
        },
        'labels': {
          'position': 'centerTop',
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['x'];
          },
          'offsetY': -10
        }
      },
      'column': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.85, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 0.85;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 1);
        },
        'legendItem': {
          'iconStroke': null
        },
        'markers': {
          'position': 'centerTop'
        },
        'labels': {
          'position': 'centerTop'
        }
      },
      'line': {
        'labels': {
          'anchor': 'bottomleft',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 2);
          color['opacity'] = 1;
          return color;
        },
        'legendItem': {
          'iconType': 'line'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'marker': {},
      'ohlc': {
        /**
         * @this {*}
         * @return {*}
         */
        'risingStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverRisingStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fallingStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](this['sourceColor']));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFallingStroke': function() {
          return window['anychart']['color']['darken'](
              window['anychart']['color']['darken'](
                  window['anychart']['color']['darken'](this['sourceColor'])));
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'O: ' + parseFloat(this['open']).toFixed(4) + '\n' +
                'H: ' + parseFloat(this['high']).toFixed(4) + '\n' +
                'L: ' + parseFloat(this['low']).toFixed(4) + '\n' +
                'C: ' + parseFloat(this['close']).toFixed(4);
          }
        },
        'labels': {
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['x'];
          },
          'offsetY': -10
        }
      },
      'rangeArea': {
        'labels': {
          'anchor': 'bottom'
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'High: ' + parseFloat(this['high']).toFixed(2) + '\n' +
                'Low: ' + parseFloat(this['low']).toFixed(2);
          }
        }
      },
      'rangeBar': {
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'High: ' + parseFloat(this['high']).toFixed(2) + '\n' +
                'Low: ' + parseFloat(this['low']).toFixed(2);
          }
        }
      },
      'rangeColumn': {
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'High: ' + parseFloat(this['high']).toFixed(2) + '\n' +
                'Low: ' + parseFloat(this['low']).toFixed(2);
          }
        }
      },
      'rangeSplineArea': {
        'labels': {
          'anchor': 'bottom'
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'High: ' + parseFloat(this['high']).toFixed(2) + '\n' +
                'Low: ' + parseFloat(this['low']).toFixed(2);
          }
        }
      },
      'rangeStepArea': {
        'labels': {
          'anchor': 'bottom'
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
          color['opacity'] = 1;
          return color;
        },
        'tooltip': {
          'content': {
            'hAlign': 'left'
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'High: ' + parseFloat(this['high']).toFixed(2) + '\n' +
                'Low: ' + parseFloat(this['low']).toFixed(2);
          }
        }
      },
      'spline': {
        'labels': {
          'anchor': 'bottomleft',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 2);
          color['opacity'] = 1;
          return color;
        },
        'legendItem': {
          'iconType': 'line'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'splineArea': {
        'labels': {
          'anchor': 'bottomleft',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        }
      },
      'stepLine': {
        'labels': {
          'anchor': 'bottom',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 2);
          color['opacity'] = 1;
          return color;
        },
        'legendItem': {
          'iconType': 'line'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'stepArea': {
        'labels': {
          'anchor': 'bottom',
          'padding': {'top': 5, 'right': 5, 'bottom': 5, 'left': 5}
        },
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        }
      }
    },
    'defaultGridSettings': {
      'enabled': false,
      'isMinor': false,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': null,
      'evenFill': null,
      'stroke': '#cecece',
      'scale': 1,
      'zIndex': 11
    },
    'defaultMinorGridSettings': {
      'enabled': false,
      'isMinor': true,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': null,
      'evenFill': null,
      'stroke': '#eaeaea',
      'scale': 1,
      'zIndex': 10
    },
    'defaultXAxisSettings': {
      'enabled': true,
      'orientation': 'bottom',
      'title': {
        'enabled': false,
        'text': 'X-Axis',
        'padding': {
          'top': 5,
          'right': 5,
          'bottom': 5,
          'left': 5
        }
      },
      'width': null,
      'scale': 0,
      'labels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      },
      'minorLabels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      }
    },
    'defaultYAxisSettings': {
      'enabled': true,
      'orientation': 'left',
      'title': {
        'enabled': false,
        'text': 'Y-Axis'
      },
      'staggerMode': false,
      'staggerLines': null,
      'ticks': {
        'enabled': true
      },
      'width': null,
      'labels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      },
      'minorLabels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      },
      'scale': 1
    },
    'defaultLineMarkerSettings': {
      'enabled': true,
      'value': 0,
      'layout': 'horizontal',
      'stroke': {
        'color': '#DC0A0A',
        'thickness': 1,
        'opacity': 1,
        'dash': '',
        'lineJoin': 'miter',
        'lineCap': 'square'
      },
      'zIndex': 25.2,
      'scale': 1
    },
    'defaultTextMarkerSettings': {
      'enabled': true,

      'fontSize': 12,

      'value': 0,
      'anchor': 'center',
      'align': 'center',
      'layout': 'horizontal',
      //'rotation': undefined,
      'offsetX': 0,
      'offsetY': 0,
      'text': 'Text marker',
      'width': null,
      'height': null,
      'zIndex': 25.3,
      'scale': 1
    },
    'defaultRangeMarkerSettings': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'layout': 'horizontal',
      'fill': '#000 0.3',
      'zIndex': 25.1,
      'scale': 1
    },

    'title': {
      'enabled': false
    },
    'background': {
      'enabled': false
    },
    'legend': {
      'enabled': false
    },
    'margin': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },

    'series': [],
    'grids': [],
    'minorGrids': [],
    'xAxes': [],
    'yAxes': [],
    'lineAxesMarkers': [],
    'rangeAxesMarkers': [],
    'textAxesMarkers': [],

    'scales': [
      {
        'type': 'ordinal',
        'inverted': false,
        'names': [],
        'ticks': {
          'interval': 1
        }
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'xScale': 0,
    'yScale': 1,

    'barsPadding': 0.4,
    'barGroupsPadding': 0.8,
    'maxBubbleSize': '20%',
    'minBubbleSize': '5%',
    'barChartMode': false,
    'crosshair': {
      'enabled': false,
      'xStroke': '#cecece',
      'yStroke': '#cecece',
      'xLabel': {
        'x': 0,
        'y': 0,
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 12,
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#212121 0.7',
          'corners': 3
        },
        'padding': {
          'top': 5,
          'right': 10,
          'bottom': 5,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'minFontSize': 8,
        'maxFontSize': 72,
        'adjustFontSize': {
          'width': false,
          'height': false
        },
        'rotation': 0
      },
      'yLabel': {
        'x': 0,
        'y': 0,
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 12,
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#212121 0.7',
          'corners': 3
        },
        'padding': {
          'top': 5,
          'right': 10,
          'bottom': 5,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'minFontSize': 8,
        'maxFontSize': 72,
        'adjustFontSize': {
          'width': false,
          'height': false
        },
        'rotation': 0
      },
      'zIndex': 41
    }
  },

  // merge with cartesian
  'area': {
    'background': {
      'enabled': true
    },
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },
  'bar': {
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'barChartMode': true,
    'defaultGridSettings': {
      'layout': 'vertical'
    },
    'defaultMinorGridSettings': {
      'layout': 'vertical'
    },
    'defaultLineMarkerSettings': {
      'layout': 'vertical'
    },
    'defaultTextMarkerSettings': {
      'layout': 'vertical'
    },
    'defaultRangeMarkerSettings': {
      'layout': 'vertical'
    },
    'defaultXAxisSettings': {
      'orientation': 'left',
      'labels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      },
      'minorLabels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      }
    },
    'defaultYAxisSettings': {
      'orientation': 'bottom',
      'labels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      },
      'minorLabels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      }
    },
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'scales': [
      {
        'type': 'ordinal',
        'inverted': true,
        'names': [],
        'ticks': {
          'interval': 1
        }
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },
  'box': {
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },
  'column': {
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },
  'financial': {
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'xAxes': [
      {
        'labels': {
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            var date = new Date(this['tickValue']);
            var day = date.getUTCDate();
            var month = date.getUTCMonth();
            var year = date.getUTCFullYear();
            var res = [' ', day, ', ', year].join('');
            switch (month) {
              case 0:
                return 'Jan' + res;
              case 1:
                return 'Feb' + res;
              case 2:
                return 'Mar' + res;
              case 3:
                return 'Apr' + res;
              case 4:
                return 'May' + res;
              case 5:
                return 'Jun' + res;
              case 6:
                return 'Jul' + res;
              case 7:
                return 'Aug' + res;
              case 8:
                return 'Sep' + res;
              case 9:
                return 'Oct' + res;
              case 10:
                return 'Nov' + res;
              case 11:
                return 'Dec' + res;
            }
            return 'Invalid date';
          }
        }
      }
    ],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'scales': [
      {
        'type': 'dateTime',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'count': 4
        },
        'minorTicks': {
          'count': 4
        }
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },
  'line': {
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [],
    'minorGrids': [],
    'padding': {
      'top': 30,
      'right': 50,
      'bottom': 20,
      'left': 20
    }
  },

  // merge with chart
  'scatter': {
    'legend': {
      'enabled': false
    },
    'defaultSeriesSettings': {
      'base': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        'hoverStroke': null,
        'hatchFill': false,
        //'hoverHatchFill': undefined,

        'labels': {
          'enabled': false,

          'background': {
            'enabled': false
          },
          'padding': {
            'top': 2,
            'right': 4,
            'bottom': 2,
            'left': 4
          },
          'position': 'center',
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          'rotation': 0,
          'width': null,
          'height': null,
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['value'];
          },
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverLabels': {
          'enabled': null
        },
        'markers': {
          'enabled': false,
          //'disablePointerEvents': undefined,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          //'type': undefined,
          'size': 4,
          //'fill': undefined,
          //'stroke': undefined,
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverMarkers': {
          'enabled': null,
          'size': 6
        },
        'clip': true,
        'color': null,

        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'x: ' + this['x'] + '\ny: ' + this['value'];
          }
        },
        'xScale': null,
        'yScale': null,
        'error': {
          'mode': 'both',
          'xError': null,
          //'xUpperError': undefined,
          //'xLowerError': undefined,
          'valueError': null,
          //'valueUpperError': undefined,
          //'valueLowerError': undefined,
          'xErrorWidth': 10,
          'valueErrorWidth': 10,
          /**
           * @this {*}
           * @return {*}
           */
          'xErrorStroke': function() {
            return window['anychart']['color']['setThickness'](window['anychart']['color']['darken'](this['sourceColor']));
          },
          /**
           * @this {*}
           * @return {*}
           */
          'valueErrorStroke': function() {
            return window['anychart']['color']['setThickness'](window['anychart']['color']['darken'](this['sourceColor']));
          }
        }
      },
      'bubble': {
        'displayNegative': false,
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.7, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.7, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        },
        /**
         * @this {*}
         * @return {*}
         */
        'negativeFill': function() {
          var darken = window['anychart']['color']['darken'];
          return darken(darken(darken(this['sourceColor'])));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverNegativeFill': function() {
          var darken = window['anychart']['color']['darken'];
          return darken(darken(darken(darken(this['sourceColor']))));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'negativeStroke': function() {
          var darken = window['anychart']['color']['darken'];
          return darken(darken(darken(darken(this['sourceColor']))));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverNegativeStroke': function() {
          var darken = window['anychart']['color']['darken'];
          return darken(darken(darken(darken(darken(this['sourceColor'])))));
        },
        'negativeHatchFill': null,
        'hoverNegativeHatchFill': undefined,
        'hatchFill': false,
        'markers': {
          'position': 'center'
        },
        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'X: ' + this['x'] + '\nY: ' + this['value'] + '\nSize: ' + this['size'];
          }
        }
      },
      'line': {
        'connectMissingPoints': false,
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        'labels': {
          'anchor': 'bottom'
        }
      },
      'marker': {}
    },

    'defaultGridSettings': {
      'enabled': false,
      'isMinor': false,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': null,
      'evenFill': null,
      'stroke': '#cecece',
      'scale': 1,
      'zIndex': 11
    },
    'defaultMinorGridSettings': {
      'enabled': false,
      'isMinor': true,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': null,
      'evenFill': null,
      'stroke': '#eaeaea',
      'scale': 1,
      'zIndex': 10
    },
    'defaultXAxisSettings': {
      'enabled': true,
      'orientation': 'bottom',
      'title': {
        'text': 'X-Axis',
        'padding': {
          'top': 5,
          'right': 5,
          'bottom': 5,
          'left': 5
        }
      },
      'width': null,
      'scale': 0,
      'labels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      },
      'minorLabels': {
        'padding': {
          'top': 5,
          'right': 0,
          'bottom': 5,
          'left': 0
        }
      }
    },
    'defaultYAxisSettings': {
      'enabled': true,
      'orientation': 'left',
      'title': {
        'text': 'Y-Axis'
      },
      'width': null,
      'labels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      },
      'minorLabels': {
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        }
      },
      'scale': 1
    },
    'defaultLineMarkerSettings': {
      'enabled': true,
      'value': 0,
      'layout': 'horizontal',
      'stroke': {
        'color': '#DC0A0A',
        'thickness': 1,
        'opacity': 1,
        'dash': '',
        'lineJoin': 'miter',
        'lineCap': 'square'
      },
      'zIndex': 25.2,
      'scale': 1
    },
    'defaultTextMarkerSettings': {
      'enabled': true,

      'fontSize': 12,

      'value': 0,
      'anchor': 'center',
      'align': 'center',
      'layout': 'horizontal',
      //'rotation': undefined,
      'offsetX': 0,
      'offsetY': 0,
      'text': 'Text marker',
      'width': null,
      'height': null,
      'zIndex': 25.3,
      'scale': 1
    },
    'defaultRangeMarkerSettings': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'layout': 'horizontal',
      'fill': '#000 0.3',
      'zIndex': 25.1,
      'scale': 1
    },

    'series': [],
    'grids': [],
    'minorGrids': [],
    'xAxes': [{}],
    'yAxes': [{}],
    'lineAxesMarkers': [],
    'rangeAxesMarkers': [],
    'textAxesMarkers': [],

    'scales': [
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'xScale': 0,
    'yScale': 1,

    'maxBubbleSize': '20%',
    'minBubbleSize': '5%',
    'crosshair': {
      'enabled': false,

      'xStroke': '#cecece',
      'yStroke': '#cecece',
      'xLabel': {
        'x': 0,
        'y': 0,
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 12,
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#212121 0.7',
          'corners': 3
        },
        'padding': {
          'top': 5,
          'right': 10,
          'bottom': 5,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'minFontSize': 8,
        'maxFontSize': 72,
        'adjustFontSize': {
          'width': false,
          'height': false
        },
        'rotation': 0
      },
      'yLabel': {
        'x': 0,
        'y': 0,
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 12,
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#212121 0.7',
          'corners': 3
        },
        'padding': {
          'top': 5,
          'right': 10,
          'bottom': 5,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'minFontSize': 8,
        'maxFontSize': 72,
        'adjustFontSize': {
          'width': false,
          'height': false
        },
        'rotation': 0
      },
      'zIndex': 41
    }
  },

  // merge with scatter
  'marker': {},
  'bubble': {},

  // merge with chart
  'bullet': {
    'background': {
      'enabled': false
    },
    'defaultRangeMarkerSettings': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'zIndex': 2
      //'layout': 'horizontal'
      //'fill': '#000 0.3'
    },
    'defaultMarkerSettings': {
      'fill': '#000',
      'stroke': 'none',
      'zIndex': 2
    },
    'layout': 'horizontal',
    'rangePalette': {
      'type': 'distinct',
      'items': ['#828282', '#a8a8a8', '#c2c2c2', '#d4d4d4', '#e1e1e1']
    },
    'markerPalette': {
      'items': ['bar', 'line', 'x', 'ellipse']
    },
    'scale': {
      'type': 'linear',
      'ticks': {
        'mode': 'linear',
        'base': 0,
        'explicit': null,
        'minCount': 3,
        'maxCount': 5,
        'interval': NaN
      },
      'minorTicks': {
        'mode': 'linear',
        'base': 0,
        'explicit': null,
        'count': 5,
        'interval': NaN
      },
      'stackMode': 'none',
      'stickToZero': true,
      'minimumGap': 0,
      'maximumGap': 0,
      'softMinimum': null,
      'softMaximum': null,
      'minimum': null,
      'maximum': null,
      'inverted': false
    },
    'axis': {
      'title': {
        'enabled': false
      },
      'labels': {
        'fontSize': 9,
        'zIndex': 3
      },
      'minorLabels': {
        'padding': {
          'top': 1,
          'right': 1,
          'bottom': 0,
          'left': 1
        },
        'zIndex': 3
      },
      'ticks': {
        'stroke': '#ccc',
        'zIndex': 3
      },
      'minorTicks': {
        'stroke': '#ccc',
        'zIndex': 3
      },
      'stroke': '#ccc',
      'orientation': 'bottom',
      'zIndex': 3
    },
    'ranges': [],
    'margin': {
      'top': 10,
      'right': 10,
      'bottom': 10,
      'left': 10
    },
    'title': {
      'enabled': true,
      'text': 'Chart title',
      'rotation': 0
    }
  },

  // merge with chart
  'pie': {
    'title': {
      'text': 'Pie Chart',
      'margin': {
        'bottom': 0
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 20,
        'left': 0
      }
    },
    'group': false,
    'sort': 'none',
    'radius': '45%',
    'innerRadius': 0,
    'startAngle': 0,
    'explode': 15,
    'outsideLabelsSpace': 30,
    'insideLabelsOffset': '50%',
    'overlapMode': 'noOverlap',
    'connectorLength': 20,
    'outsideLabelsCriticalAngle': 60,
    'connectorStroke': '#000 0.3',
    /**
     * @this {*}
     * @return {*}
     */
    'fill': function() {
      return this['sourceColor'];
    },
    /**
     * @this {*}
     * @return {*}
     */
    'hoverFill': function() {
      return window['anychart']['color']['lighten'](this['sourceColor']);
    },
    'stroke': 'none',
    'hoverStroke': 'none',
    'hatchFill': null,
    //'hoverHatchFill': undefined,
    'forceHoverLabels': false,
    'labels': {
      'enabled': true,
      'fontSize': 13,
      'fontFamily': 'Arial',
      'fontColor': null,
      'background': {
        'enabled': false
      },
      'padding': {
        'top': 1,
        'right': 1,
        'bottom': 1,
        'left': 1
      },
      //'position': undefined,
      'anchor': 'center',
      //'offsetX': undefined,
      //'offsetY': undefined,
      'rotation': 0,
      'width': null,
      'height': null,
      'autoRotate': false,
      /**
       * @this {*}
       * @return {*}
       */
      'textFormatter': function() {
        return (this['value'] * 100 / this['getStat']('sum')).toFixed(1) + '%';
      },
      /**
       * @this {*}
       * @return {*}
       */
      'positionFormatter': function() {
        return this['value'];
      },
      'zIndex': 32
    },
    'outsideLabels': {'autoColor': '#545f69'},
    'insideLabels': {'autoColor': '#fff'},
    'hoverLabels': {
      'enabled': null
    },
    'tooltip': {
      'enabled': true,
      'title': {
        'enabled': true,
        'fontSize': 13,
        'fontWeight': 'normal'
      },
      'content': {'fontSize': 11},
      'separator': {'enabled': true},
      /**
       * @this {*}
       * @return {*}
       */
      'titleFormatter': function() {
        return this['name'] || this['x'];
      },
      /**
       * @this {*}
       * @return {*}
       */
      'contentFormatter': function() {
        return 'Value: ' + this['value'] + '\nPercent Value: ' + (this['value'] * 100 / this['getStat']('sum')).toFixed(1) + '%';
      }
    },
    'legend': {
      'enabled': true,
      'position': 'bottom',
      'align': 'center',
      'itemsLayout': 'horizontal',
      'title': {
        'enabled': false
      },
      'titleSeparator': {
        'enabled': false,
        'margin': {
          'top': 3,
          'right': 0,
          'bottom': 3,
          'left': 0
        }
      }
    }
  },

  // merge with pie
  'pie3d': {
    'explode': '5%',
    'connectorLength': '15%'
  },

  // merge with chart
  'pyramidFunnel': {
    'baseWidth': '90%',
    'connectorLength': 20,
    'connectorStroke': '#7c868e',
    'overlapMode': 'noOverlap',
    'pointsPadding': 5,
    /**
     * @this {*}
     * @return {*}
     */
    'fill': function() {
      return this['sourceColor'];
    },
    /**
     * @this {*}
     * @return {*}
     */
    'hoverFill': function() {
      return window['anychart']['color']['lighten'](this['sourceColor']);
    },
    /**
     * @this {*}
     * @return {*}
     */
    'stroke': function() {
      return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
    },
    /**
     * @this {*}
     * @return {*}
     */
    'hoverStroke': function() {
      return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
    },
    'hatchFill': null,
    //'hoverHatchFill': undefined,
    'labels': {
      'enabled': true,

      'fontSize': 13,
      'fontFamily': 'Arial',
      'fontColor': null,
      'disablePointerEvents': false,

      'background': {
        'enabled': false
      },
      'padding': {
        'top': 1,
        'right': 1,
        'bottom': 1,
        'left': 1
      },
      'position': 'outsideLeftInColumn',
      'anchor': 'center',
      //'offsetX': undefined,
      //'offsetY': undefined,
      'rotation': 0,
      'width': null,
      'height': null,
      /**
       * @this {*}
       * @return {*}
       */
      'textFormatter': function() {
        return this['name'] ? this['name'] : this['x'];
      },
      /**
       * @this {*}
       * @return {*}
       */
      'positionFormatter': function() {
        return this['value'];
      },
      'zIndex': 34
    },
    'outsideLabels': {'autoColor': '#545f69'},
    'insideLabels': {'autoColor': '#fff'},
    'hoverLabels': {
      'enabled': null,

      'padding': {
        'top': 1,
        'right': 1,
        'bottom': 1,
        'left': 1
      }
    },
    'markers': {
      'enabled': false,
      //'disablePointerEvents': undefined,
      //'position': undefined,
      'rotation': 0,
      'anchor': 'center',
      'offsetX': 0,
      'offsetY': 0,
      //'type': undefined,
      'size': 8,
      //'fill': undefined,
      //'stroke': undefined,
      /**
       * @this {*}
       * @return {*}
       */
      'positionFormatter': function() {
        return this['value'];
      },
      'zIndex': 33
    },
    'hoverMarkers': {
      'enabled': null,
      'size': 12
    },
    'tooltip': {
      'enabled': true,
      'title': {
        'enabled': true,
        'fontSize': 13,
        'fontWeight': 'normal'
      },
      'content': {'fontSize': 11},
      'separator': {'enabled': true},
      /**
       * @this {*}
       * @return {*}
       */
      'titleFormatter': function() {
        return this['name'] || this['x'];
      },
      /**
       * @this {*}
       * @return {*}
       */
      'contentFormatter': function() {
        return 'Value: ' + this['value'] + '\nPercent Value: ' + (this['value'] * 100 / this['getStat']('sum')).toFixed(1) + '%';
      }
    },
    'legend': {
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'tooltip': {
        /**
         * @this {*}
         * @return {*}
         */
        'contentFormatter': function() {
          return (this['value']) + '\n' + this['meta']['pointValue'];
        }
      },
      'zIndex': 35,
      'position': 'right',
      'hAlign': 'left',
      'vAlign': 'middle',
      'itemsLayout': 'vertical',
      'enabled': false
    }
  },

  // merge with pyramidFunnel
  'funnel': {
    'title': {
      'text': 'Funnel Chart'
    },
    'neckWidth': '30%',
    'neckHeight': '25%'
  },
  'pyramid': {
    'title': {
      'text': 'Pyramid Chart'
    },
    'reversed': false,
    'legend': {
      'inverted': true
    }
  },

  // merge with chart
  'radar': {
    'title': {
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 20,
        'left': 0
      }
    },
    'defaultSeriesSettings': {
      'base': {
        'enabled': true,
        'hatchFill': null,
        'labels': {'enabled': false, 'position': 'center'},
        'hoverLabels': {'enabled': null, 'position': 'center'},
        'markers': {
          'enabled': false,
          'disablePointerEvents': false,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          //'type': null,
          'size': 4,
          //'fill': '', // autoFill
          //'stroke': '', // autoStroke
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverMarkers': {'enabled': null, 'size': 6}
      },
      'area': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        },
        'markers': {
          'enabled': false,
          'position': 'center'
        }
      },
      'line': {
        'markers': {'enabled': false, 'position': 'center'},
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 2);
          color['opacity'] = 1;
          return color;
        },
        'legendItem': {
          'iconType': 'line'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'marker': {}
    },
    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      'layout': 'radial',
      'drawLastLine': true,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#DDDDDD',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'defaultMinorGridSettings': {
      'enabled': true,
      'isMinor': true,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#333333',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'xAxis': {
      'stroke': '#eaeaea',
      'ticks': {
        'enabled': false,
        'stroke': '#cecece',
        'length': 6
      },
      'labels': {
        'hAlign': 'center',
        'padding': {
          'top': 2,
          'right': 5,
          'bottom': 2,
          'left': 5
        },
        'fontSize': 12
      },
      'scale': 0
    },
    'yAxis': {
      'stroke': '#b9b9b9',
      'drawLastLabel': false,
      'labels': {
        'hAlign': 'center',
        'padding': {
          'top': 0,
          'right': 2,
          'bottom': 0,
          'left': 0
        },
        'fontSize': 11
      },
      'minorLabels': {
        'padding': {'top': 1, 'right': 1, 'bottom': 0, 'left': 1}
      },
      'ticks': {
        'enabled': true,
        'stroke': '#b9b9b9',
        'length': 6
      },
      'minorTicks': {
        'stroke': '#eaeaea',
        'length': 4
      },
      'scale': 1
    },
    'startAngle': 0,
    'grids': [{}],
    'minorGrids': [],
    'scales': [
      {
        'type': 'ordinal',
        'inverted': false,
        'names': [],
        'ticks': {
          'interval': 1
        }
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'xScale': 0,
    'yScale': 1
  },

  // merge with chart
  'polar': {
    'title': {
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 20,
        'left': 0
      }
    },
    'defaultSeriesSettings': {
      'base': {
        'enabled': true,
        'hatchFill': null,
        'labels': {'enabled': false, 'position': 'center'},
        'hoverLabels': {'enabled': null, 'position': 'center'},
        'markers': {
          'enabled': false,
          'disablePointerEvents': false,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          //'type': null,
          'size': 4,
          //'fill': '', // autoFill
          //'stroke': '', // autoStroke
          /**
           * @this {*}
           * @return {*}
           */
          'positionFormatter': function() {
            return this['value'];
          }
        },
        'hoverMarkers': {'enabled': null, 'size': 6}
      },
      'area': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['setOpacity'](this['sourceColor'], 0.6, true);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['setThickness'](this['sourceColor'], 1.5);
        },
        'legendItem': {
          'iconStroke': null
        }
      },
      'line': {
        'markers': {'enabled': false},
        /**
         * @this {*}
         * @return {*}
         */
        'stroke': function() {
          var color = window['anychart']['color']['setThickness'](this['sourceColor'], 2);
          color['opacity'] = 1;
          return color;
        },
        'legendItem': {
          'iconType': 'line'
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'marker': {}
    },
    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      'layout': 'radial',
      'drawLastLine': true,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#DDDDDD',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'defaultMinorGridSettings': {
      'enabled': true,
      'isMinor': true,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#333333',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'xAxis': {
      'stroke': '#eaeaea',
      'ticks': {
        'enabled': false,
        'stroke': '#cecece',
        'length': 6
      },
      'labels': {
        'hAlign': 'center',
        'padding': {
          'top': 2,
          'right': 5,
          'bottom': 2,
          'left': 5
        },
        'fontSize': 12
      },
      'scale': 0
    },
    'yAxis': {
      'stroke': '#b9b9b9',
      'drawLastLabel': false,
      'labels': {
        'hAlign': 'center',
        'padding': {
          'top': 0,
          'right': 2,
          'bottom': 0,
          'left': 0
        },
        'fontSize': 11
      },
      'minorLabels': {
        'padding': {'top': 1, 'right': 1, 'bottom': 0, 'left': 1}
      },
      'ticks': {
        'enabled': true,
        'stroke': '#b9b9b9',
        'length': 6
      },
      'minorTicks': {
        'stroke': '#eaeaea',
        'length': 4
      },
      'scale': 1
    },
    'startAngle': 0,
    'grids': [{}],
    'minorGrids': [],
    'scales': [
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'xScale': 0,
    'yScale': 1
  },

  // merge with chart
  'sparkline': {
    'title': {
      'enabled': false,
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'orientation': 'right',
      'rotation': 0
    },
    'background': {
      'enabled': false
    },
    'margin': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'defaultSeriesSettings': {
      'base': {
        'markers': {
          'enabled': false,
          'position': 'center',
          'anchor': 'center',
          'type': 'circle',
          'size': 1.8,
          'stroke': 'none'
        },
        'labels': {
          'enabled': false,
          'fontSize': 8,
          'background': {
            enabled: false
          },
          'position': 'center',
          'anchor': 'centerBottom'
        },
        'minLabels': {
          'position': 'bottom',
          'anchor': 'bottomCenter'
        },
        'maxLabels': {
          'position': 'top',
          'anchor': 'topCenter'
        },
        'color': '#64b5f6'
      },
      'area': {
        'stroke': '#64b5f6',
        'fill': '#64b5f6 0.5'
      },
      'column': {
        'markers': {
          'position': 'centerTop'
        },
        'labels': {
          'position': 'centerTop',
          'anchor': 'centerBottom'
        },
        'negativeMarkers': {
          'position': 'centerBottom'
        },
        'negativeLabels': {
          'position': 'centerBottom',
          'anchor': 'centerTop'
        },
        'fill': '#64b5f6',
        'negativeFill': '#ef6c00'
      },
      'line': {
        'stroke': '#64b5f6'
      },
      'winLoss': {
        'markers': {
          'position': 'centerTop',
          'anchor': 'centerTop'
        },
        'labels': {
          'position': 'centerTop',
          'anchor': 'centerTop'
        },
        'negativeMarkers': {
          'position': 'centerBottom',
          'anchor': 'centerBottom'
        },
        'negativeLabels': {
          'position': 'centerBottom',
          'anchor': 'centerBottom'
        },
        'fill': '#64b5f6',
        'negativeFill': '#ef6c00'
      }
    },
    'defaultLineMarkerSettings': {
      'enabled': true,
      'value': 0,
      'layout': 'horizontal',
      'stroke': {
        'color': '#DC0A0A',
        'thickness': 1,
        'opacity': 1,
        'dash': '',
        'lineJoin': 'miter',
        'lineCap': 'square'
      },
      'zIndex': 25.2,
      'scale': 1
    },
    'defaultTextMarkerSettings': {
      'enabled': true,

      'value': 0,
      'anchor': 'center',
      'align': 'center',
      'layout': 'horizontal',
      //'rotation': undefined,
      'offsetX': 0,
      'offsetY': 0,
      'text': 'Text marker',
      'width': null,
      'height': null,
      'zIndex': 25.3,
      'scale': 1
    },
    'defaultRangeMarkerSettings': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'layout': 'horizontal',
      'fill': '#000 0.3',
      'zIndex': 25.1,
      'scale': 1
    },

    //'stroke': undefined,
    //'fill': undefined,
    //'firstFill': undefined,
    //'lastFill': undefined,
    //'negativeFill': undefined,
    //'minFill': undefined,
    //'maxFill': undefined,
    'hatchFill': null,
    //'firstHatchFill': undefined,
    //'lastHatchFill': undefined,
    //'negativeHatchFill': undefined,
    //'minHatchFill': undefined,
    //'maxHatchFill': undefined,

    'markers': {
    },
    'firstMarkers': {
      'fill': '#64b5f6'
    },
    'lastMarkers': {
      'fill': '#64b5f6'
    },
    'negativeMarkers': {
      'fill': '#ef6c00'
    },
    'minMarkers': {
      'fill': '#455a64'
    },
    'maxMarkers': {
      'fill': '#dd2c00'
    },

    'labels': {},
    'firstLabels': {},
    'lastLabels': {},
    'negativeLabels': {},
    'minLabels': {
      'fontSize': 9,
      'padding': {
        'top': 3,
        'right': 0,
        'bottom': 3,
        'left': 0
      },
      'fontColor': '#303f46'
    },
    'maxLabels': {
      'fontSize': 9,
      'padding': {
        'top': 3,
        'right': 0,
        'bottom': 3,
        'left': 0
      },
      'fontColor': '#9b1f00'
    },

    'lineAxesMarkers': [],
    'rangeAxesMarkers': [],
    'textAxesMarkers': [],
    'scales': [
      {
        'type': 'ordinal',
        'inverted': false,
        'names': [],
        'ticks': {
          'interval': 1
        }
      },
      {
        'type': 'linear',
        'inverted': false,
        'maximum': null,
        'minimum': null,
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'softMinimum': null,
        'softMaximum': null,
        'ticks': {
          'mode': 'linear',
          'base': 0,
          'minCount': 4,
          'maxCount': 6
        },
        'minorTicks': {
          'mode': 'linear',
          'base': 0,
          'count': 5
        },
        'stackMode': 'none',
        'stickToZero': true
      }
    ],
    'xScale': 0,
    'yScale': 1,
    'clip': true,
    'seriesType': 'line',
    'connectMissingPoints': false,
    'pointWidth': '95%'
  },

  // merge with chart
  'circularGauge': {
    'title': {
      'enabled': false
    },
    'defaultAxisSettings': {
      'startAngle': null,
      'labels': {'position': 'inside', 'adjustFontSize': true},
      'minorLabels': {'position': 'inside', 'adjustFontSize': true},
      'fill': 'black .3',
      'ticks': {
        'hatchFill': false,
        'type': 'line',
        'position': 'center',
        'length': null,
        'fill': 'red',
        'stroke': 'none'
      },
      'minorTicks': {
        'hatchFill': false,
        'type': 'line',
        'position': 'center',
        'length': null,
        'fill': 'red',
        'stroke': 'none'
      },
      'zIndex': 10
    },
    'defaultPointerSettings': {
      'base': {
        'enabled': true,
        'fill': '#f22922',
        'stroke': '#f22922',
        'hatchFill': false,
        'axisIndex': 0
        //'dataIndex': undefined
      },
      'bar': {
        'position': 'center'
        //'width': undefined,
        //'radius': undefined
      },
      'marker': {
        'size': 4,
        'hoverSize': 6,
        'position': 'inside',
        'type': 'triangleUp'
      },
      'needle': {
        //'startRadius': undefined,
        //'middleRadius': undefined,
        //'endRadius': undefined,
        //'startWidth': undefined,
        //'middleWidth': undefined,
        //'endWidth': undefined
      },
      'knob': {
        'fill': {
          'keys': ['rgb(255, 255, 255)', 'rgb(220, 220, 220)'],
          'angle': 135
        },
        'stroke': '2 #ccc',
        'verticesCount': 6,
        'verticesCurvature': .5,
        'topRatio': .5,
        'bottomRatio': .5
        //'topRadius': undefined,
        //'bottomRadius': undefined
      }
    },
    'defaultRangeSettings': {
      'enabled': true,
      'axisIndex': 0,
      //'from': undefined,
      //'to': undefined,
      'fill': '#008000 .5',
      'position': 'center',
      'startSize': 0,
      'endSize': '10%'
      //'radius': undefined
    },
    'fill': {
      'keys': ['#fff', '#dcdcdc'],
      'angle': 315
    },
    //'stroke': undefined,
    'startAngle': 0,
    'sweepAngle': 360,
    'cap': {
      'enabled': false,
      'fill': {
        'keys': ['#D3D3D3', '#6F6F6F'],
        'angle': -45
      },
      'stroke': 'none',
      'hatchFill': false,
      'radius': '15%',
      'zIndex': 50
    },
    'circularPadding': '10%',
    'encloseWithStraightLine': false,
    'axes': [],
    'bars': [],
    'markers': [],
    'needles': [],
    'knobs': [],
    'ranges': []
  },

  // merge with chart
  'map': {
    'defaultSeriesSettings': {
      'base': {
        /**
         * @this {*}
         * @return {*}
         */
        'fill': function() {
          var color;
          if (this['colorScale']) {
            var refVale = this['referenceValueNames'][1];
            var value = this['iterator']['get'](refVale);
            color = this['colorScale']['valueToColor'](value);
          } else {
            color = this['sourceColor'];
          }
          return color;
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverFill': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        },
        'selectFill': {'color': '#64b5f6'},
        'stroke': {'thickness': 0.5, 'color': '#545f69'},
        'hoverStroke': {'thickness': 0.5, 'color': '#545f69'},
        'selectStroke': {'thickness': 0.5, 'color': '#545f69'},
        'hatchFill': false,
        //'hoverHatchFill': null,
        //'selectHatchFill': null,

        'labels': {
          'enabled': true,
          'fontSize': 12,
          'adjustFontSize': {
            'width': true,
            'height': true
          },
          /**
           * @this {*}
           * @return {*}
           */
          'textFormatter': function() {
            return this['name'];
          }
        },
        'hoverLabels': {
          'enabled': null
        },
        'selectLabels': {
          'enabled': null
        },
        'markers': {
          'enabled': false,
          'disablePointerEvents': false,
          'size': 4
        },
        'hoverMarkers': {'enabled': null, 'size': 6},
        'selectMarkers': {
          'enabled': null,
          'size': 6
        },

        'color': null,
        'allowPointsSelect': null,

        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'titleFormatter': function() {
            return this['name'];
          },
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return 'Id: ' + this['id'] + '\nValue: ' + this['value'];
          }
        },
        'xScale': null,
        'yScale': null
      },
      'choropleth': {}
    },
    'colorRange': {
      'enabled': false,
      'stroke': null,
      'orientation': 'bottom',
      'title': {'enabled': false},
      'colorLineSize': 20,
      'padding': {'top': 10, 'right': 0, 'bottom': 20, 'left': 0},
      'align': 'center',
      'length': '70%',
      'marker': {
        'padding': {'top': 3, 'right': 3, 'bottom': 3, 'left': 3},
        'fill': '#545f69',
        'hoverFill': '#545f69',
        'stroke': '#545f69',
        'hoverStroke': '#545f69',
        /**
         * @this {*}
         * @return {*}
         */
        'positionFormatter': function() {
          return this['value'];
        },
        'legendItem': {
          'iconStroke': null
        },
        'enabled': true,
        'disablePointerEvents': false,
        'position': 'center',
        'rotation': 0,
        'anchor': 'center',
        'offsetX': 0,
        'offsetY': 0,
        'type': 'triangleDown',
        'size': 15
      },
      'labels': {'offsetX': 0},
      'ticks': {
        'stroke': {'thickness': 3, 'color': '#fff', 'position': 'center', 'length': 20}
      }
    },
    'unboundRegions': {'enabled': true, 'fill': '#F7F7F7', 'stroke': '#B9B9B9'},
    'linearColor': {'colors': ['#fff', '#ffd54f', '#ef6c00']},
    'ordinalColor': {
      'autoColors': function(rangesCount) {
        return window['anychart']['color']['blendedHueProgression']('#ffd54f', '#ef6c00', rangesCount);
      }
    },
    'legend': {'enabled': false},
    'allowPointsSelect': true
  },

  'defaultDataGrid': {
    'isStandalone': true,
    'titleHeight': 25,
    'backgroundFill': '#fff',
    'columnStroke': '#ccd7e1',
    'rowStroke': '#ccd7e1',
    'rowOddFill': '#fff',
    'rowEvenFill': '#fafafa',
    'rowFill': '#fff',
    'hoverFill': '#edf8ff',
    'rowSelectedFill': '#d2eafa',
    'zIndex': 5,
    'titleFill': {
      'keys': ['#f8f8f8', '#fff'],
      'angle': 90
    },
    'tooltip': {
      'anchor': 'leftTop',
      'content': {
        'hAlign': 'left'
      },
      'contentFormatter': function(data) {
        var name = data['get']('name');
        return (name !== void 0) ? name + '' : '';
      }
    },
    'defaultColumnSettings': {
      'width': 90,
      //'defaultWidth': undefined,
      'cellTextSettings': {
        'anchor': 'leftTop',
        'vAlign': 'middle',
        'padding': {
          'top': 0,
          'right': 5,
          'bottom': 0,
          'left': 5
        },
        'textWrap': 'noWrap',
        'background': null,
        'rotation': 0,
        'width': null,
        'height': null,
        'fontSize': 11,
        'minFontSize': 8,
        'maxFontSize': 72
      },
      'depthPaddingMultiplier': 0,
      'collapseExpandButtons': false,
      'title': {
        'margin': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'textWrap': 'noWrap',
        'hAlign': 'center',
        'vAlign': 'middle',
        'background': {
          'enabled': false
        }
      },
      'textFormatter': function(item) {
        return '';
      }
    },
    'columns': [
      {
        'width': 50,
        'textFormatter': function(item) {
          var val = item['meta']('index');
          return (val != null) ? (val + 1) + '' : '';
        },
        'title': {
          'text': '#'
        }
      },
      {
        'width': 170,
        'collapseExpandButtons': true,
        'depthPaddingMultiplier': 15,
        'textFormatter': function(item) {
          var val = item['get']('name');
          return (val != null) ? (val + '') : '';
        },
        'title': {
          'text': 'Name'
        }
      }
    ]
  },

  // merge with chart
  'gantt': {
    'base': {
      'splitterPosition': '30%',
      'headerHeight': 70,
      'hoverFill': '#edf8ff',
      'rowSelectedFill': '#d2eafa',
      'columnStroke': '#ccd7e1',
      'rowStroke': '#ccd7e1',
      'title': {
        'enabled': false
      },
      'credits': {
        'inChart': true
      },
      'background': {
        'fill': '#fff'
      },
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'dataGrid': {
        'isStandalone': false,
        'backgroundFill': 'none'
      },
      'timeline': {
        'columnStroke': '#ccd7e1',
        'rowStroke': '#ccd7e1',
        'backgroundFill': 'none',
        'rowOddFill': '#fff',
        'rowEvenFill': '#fafafa',
        'rowFill': '#fff',
        'hoverFill': '#edf8ff',
        'rowSelectedFill': '#d2eafa',
        'zIndex': 5,
        'baseFill': {
          'keys': ['#3CA0DE', '#3085BC'],
          'angle': -90
        },
        'baseStroke': '#0C3F5F',
        'baselineFill': {
          'keys': ['#E1E1E1', '#A1A1A1'],
          'angle': -90
        },
        'baselineStroke': '#0C3F5F',
        'progressFill': {
          'keys': ['#63FF78', '#3DC351', '#188E2D'],
          'angle': -90
        },
        'progressStroke': '#006616',
        'milestoneFill': {
          'keys': ['#FAE096', '#EB8344'],
          'angle': -90
        },
        'milestoneStroke': '#000',
        'parentFill': {
          'keys': ['#646464', '#282828'],
          'angle': -90
        },
        'parentStroke': '#000',
        'selectedElementFill': {
          'keys': ['#f1b8b9', '#f07578'],
          'angle': -90
        },
        'connectorFill': '#000090',
        'connectorStroke': '#000090',
        'minimumGap': 0.1,
        'maximumGap': 0.1,
        'baselineAbove': false,
        'tooltip': {
          'anchor': 'leftTop',
          'content': {
            'hAlign': 'left'
          }
        },
        'labelsFactory': {
          'anchor': 'leftCenter',
          'position': 'rightCenter',
          'padding': {
            'top': 3,
            'right': 5,
            'bottom': 3,
            'left': 5
          },
          'vAlign': 'middle',
          'textWrap': 'noWrap',
          'background': null,
          'rotation': 0,
          'width': null,
          'height': null,
          'fontSize': 11,
          'minFontSize': 8,
          'maxFontSize': 72,
          'zIndex': 40
        },
        'markersFactory': {
          'anchor': 'centerTop',
          'zIndex': 50,
          'enabled': true,
          'type': 'star4'
        },
        'header': {
          'labelsFactory': {
            'anchor': 'leftTop',
            'padding': {
              'top': 0,
              'right': 2,
              'bottom': 0,
              'left': 2
            },
            'vAlign': 'middle',
            'textWrap': 'noWrap',
            'textOverflow': '...'
          }

        }
      }
    },
    'ganttResource': {
      'dataGrid': {
        'tooltip': {
          'contentFormatter': function(data) {
            var item = data['item'];
            if (!item) return '';
            var name = item['get']('name');
            var startDate = item['meta']('minPeriodDate');
            var endDate = item['meta']('maxPeriodDate');
            return (name ? name : '') +
                (startDate ? '\nStart Date: ' + window['anychart']['utils']['defaultDateFormatter'](startDate) : '') +
                (endDate ? '\nEnd Date: ' + window['anychart']['utils']['defaultDateFormatter'](endDate) : '');
          }
        }
      },
      'timeline': {
        'selectedElementStroke': 'none',
        'tooltip': {
          'contentFormatter': function(data) {
            var item = data['item'];
            var period = data['period'];
            var name = item['get']('name');
            var startDate = period ? period['start'] : (item['get']('actualStart') || item['meta']('autoStart'));
            var endDate = period ? period['end'] : (item['get']('actualEnd') || item['meta']('autoEnd'));

            return (name ? name : '') +
                (startDate ? '\nStart Date: ' + window['anychart']['utils']['defaultDateFormatter'](startDate) : '') +
                (endDate ? '\nEnd Date: ' + window['anychart']['utils']['defaultDateFormatter'](endDate) : '');
          }
        }
      }
    },
    'ganttProject': {
      'dataGrid': {
        'tooltip': {
          'contentFormatter': function(data) {
            var item = data['item'];
            if (!item) return '';
            var name = item['get']('name');
            var startDate = item['get']('actualStart') || item['meta']('autoStart');
            var endDate = item['get']('actualEnd') || item['meta']('autoEnd');
            var progress = item['get']('progressValue');

            if (progress === void 0) {
              var auto = item['meta']('autoProgress') * 100;
              progress = (Math.round(auto * 100) / 100 || 0) + '%';
            }

            return (name ? name : '') +
                (startDate ? '\nStart Date: ' + window['anychart']['utils']['defaultDateFormatter'](startDate) : '') +
                (endDate ? '\nEnd Date: ' + window['anychart']['utils']['defaultDateFormatter'](endDate) : '') +
                (progress ? '\nComplete: ' + progress : '');
          }
        }
      },
      'timeline': {
        'selectedElementStroke': '#000',
        'tooltip': {
          'contentFormatter': function(data) {
            var item = data['item'];
            var name = item['get']('name');
            var startDate = item['get']('actualStart') || item['meta']('autoStart');
            var endDate = item['get']('actualEnd') || item['meta']('autoEnd');
            var progress = item['get']('progressValue');

            if (progress === void 0) {
              var auto = item['meta']('autoProgress') * 100;
              progress = (Math.round(auto * 100) / 100 || 0) + '%';
            }

            return (name ? name : '') +
                (startDate ? '\nStart Date: ' + window['anychart']['utils']['defaultDateFormatter'](startDate) : '') +
                (endDate ? '\nEnd Date: ' + window['anychart']['utils']['defaultDateFormatter'](endDate) : '') +
                (progress ? '\nComplete: ' + progress : '');

          }
        }
      }
    }
  },

  // standalone components
  'standalones': {
    'background': {
      'zIndex': 0
    }, // default
    'label': {
      'enabled': true,
      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontWeight': 'bold',
      'textWrap': 'byLetter',
      'text': 'Label text',
      'background': {
        'enabled': false
      },
      'padding': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 0
      },
      'width': null,
      'height': null,
      'anchor': 'leftTop',
      'position': 'leftTop',
      'offsetX': 0,
      'offsetY': 0,
      'minFontSize': 8,
      'maxFontSize': 72,
      'adjustFontSize': {
        'width': false,
        'height': false
      },
      'rotation': 0,
      'zIndex': 0
    },
    'labelsFactory': {
      'zIndex': 0
    },
    'legend': {
      'position': 'bottom',
      'align': 'center',
      'itemsSpacing': 15,
      'iconTextSpacing': 5,
      'width': null,
      'height': null,
      'itemsLayout': 'horizontal',
      'inverted': false,
      'items': null,
      'itemsSourceMode': 'default',
      'itemsFormatter': function(items) {
        return items;
      },
      'fontColor': '#232323',
      'fontSize': 12,
      'background': {
        'enabled': true,
        'fill': {
          'keys': [
            '0 #fff 1',
            '0.5 #f3f3f3 1',
            '1 #fff 1'],
          'angle': '90'
        },
        'stroke': {
          'keys': [
            '0 #ddd 1',
            '1 #d0d0d0 1'
          ],
          'angle': '90'
        },
        'cornerType': 'round',
        'corners': 5
      },
      'title': {
        'enabled': true,
        'fontFamily': 'Verdana',
        'fontSize': 10,
        'fontColor': '#232323',
        'text': 'Legend Title',
        'background': {
          'enabled': false,
          'stroke': {
            'keys': [
              '0 #DDDDDD 1',
              '1 #D0D0D0 1'
            ],
            'angle': '90'
          },
          'fill': {
            'keys': [
              '0 #FFFFFF 1',
              '0.5 #F3F3F3 1',
              '1 #FFFFFF 1'
            ],
            'angle': '90'
          }
        },
        'padding': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'margin': {
          'top': 0,
          'right': 0,
          'bottom': 3,
          'left': 0
        }
      },
      'paginator': {
        'enabled': true,
        'fontColor': '#232323',
        'orientation': 'right',
        'margin': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'padding': {
          'top': 0,
          'right': 0,
          'bottom': 0,
          'left': 0
        },
        'background': {
          'enabled': false,
          'stroke': {
            'keys': [
              '0 #DDDDDD 1',
              '1 #D0D0D0 1'
            ],
            'angle': '90'
          },
          'fill': {
            'keys': [
              '0 #FFFFFF 1',
              '0.5 #F3F3F3 1',
              '1 #FFFFFF 1'
            ],
            'angle': '90'
          }
        },
        'zIndex': 30
      },
      'titleSeparator': {
        'enabled': true,
        'width': '100%',
        'height': 1,
        'margin': {
          'top': 3,
          'right': 0,
          'bottom': 3,
          'left': 0
        },
        'orientation': 'top',
        'fill': {
          'keys': [
            '0 #333333 0',
            '0.5 #333333 1',
            '1 #333333 0'
          ]
        },
        'stroke': 'none'
      },
      'padding': {
        'top': 7,
        'right': 7,
        'bottom': 7,
        'left': 7
      },
      'margin': {
        'top': 4,
        'right': 4,
        'bottom': 4,
        'left': 4
      },
      'zIndex': 0
    },
    'markersFactory': {
      'zIndex': 0
    },
    'title': {
      'zIndex': 0
    },
    // defaultAxis merges into all these axes
    'linearAxis': {
      'zIndex': 0,
      'ticks': {'enabled': true},
      'minorTicks': {'enabled': true}
    },
    'polarAxis': {
      'startAngle': 0,
      'zIndex': 0,
      'ticks': {'enabled': true},
      'minorTicks': {'enabled': true}
    },
    'radarAxis': {
      'startAngle': 0,
      'zIndex': 0,
      'ticks': {'enabled': true},
      'minorTicks': {'enabled': true}
    },
    'radialAxis': {
      'startAngle': 0,
      'zIndex': 0,
      'ticks': {'enabled': true},
      'minorTicks': {'enabled': true},
      'minorLabels': {
        'padding': {
          'top': 1,
          'right': 1,
          'bottom': 0,
          'left': 1
        }
      }
    },
    'linearGrid': {
      'enabled': true,
      'isMinor': false,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': '#fff',
      'evenFill': '#f5f5f5',
      'stroke': '#c1c1c1',
      'scale': null,
      'zIndex': 0
    },
    'polarGrid': {
      'enabled': true,
      'isMinor': false,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': '#fff 0.3',
      'evenFill': '#f5f5f5 0.3',
      'stroke': '#c1c1c1',
      'zIndex': 0
    },
    'radarGrid': {
      'enabled': true,
      'isMinor': false,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': '#fff 0.3',
      'evenFill': '#f5f5f5 0.3',
      'stroke': '#c1c1c1',
      'zIndex': 0
    },
    'lineAxisMarker': {
      'enabled': true,
      'value': 0,
      'layout': 'horizontal',
      'stroke': {
        'color': '#DC0A0A',
        'thickness': 1,
        'opacity': 1,
        'dash': '',
        'lineJoin': 'miter',
        'lineCap': 'square'
      },
      'zIndex': 0
    },
    'textAxisMarker': {
      'enabled': true,
      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontWeight': 'bold',
      'value': 0,
      'anchor': 'center',
      'align': 'center',
      'layout': 'horizontal',
      //'rotation': undefined,
      'offsetX': 0,
      'offsetY': 0,
      'text': 'Text marker',
      'width': null,
      'height': null,
      'zIndex': 0
    },
    'rangeAxisMarker': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'layout': 'horizontal',
      'fill': '#000 0.3',
      'zIndex': 0
    },
    'dataGrid': {
      'zIndex': 0
    }
  }
};
