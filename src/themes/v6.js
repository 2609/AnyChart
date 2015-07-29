goog.provide('anychart.themes.v6');


window['anychart'] = window['anychart'] || {};
window['anychart']['themes'] = window['anychart']['themes'] || {};
window['anychart']['themes']['v6'] = {
  // default font settings
  'defaultFontSettings': {
    'fontSize': 10,
    'fontFamily': 'Verdana',
    'fontColor': '#222',
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
    'items': ['#1D8BD1', '#F1683C', '#2AD62A', '#DBDC25', '#8FBC8B', '#D2B48C', '#FAF0E6', '#20B2AA', '#B0C4DE', '#DDA0DD', '#9C9AFF', '#9C3063', '#FFFFCE', '#CEFFFF', '#630063', '#FF8284', '#0065CE', '#CECFFF', '#000084', '#FF00FF', '#FFFF00', '#00FFFF', '#840084', '#840000', '#008284', '#0000FF', '#00CFFF', '#CEFFFF', '#CEFFCE', '#FFFF9C', '#9CCFFF', '#FF9ACE', '#CE9AFF', '#FFCF9C', '#3165FF', '#31CFCE', '#9CCF00', '#FFCF00', '#FF9A00', '#FF6500']
  },
  'hatchFillPalette': {
    'items': ['backwardDiagonal', 'forwardDiagonal', 'horizontal', 'vertical', 'dashedBackwardDiagonal', 'grid', 'dashedForwardDiagonal', 'dashedHorizontal', 'dashedVertical', 'diagonalCross', 'diagonalBrick', 'divot', 'horizontalBrick', 'verticalBrick', 'checkerBoard', 'confetti', 'plaid', 'solidDiamond', 'zigZag', 'weave', 'percent05', 'percent10', 'percent20', 'percent25', 'percent30', 'percent40', 'percent50', 'percent60', 'percent70', 'percent75', 'percent80', 'percent90']
  },
  'markerPalette': {
    'items': ['circle', 'square', 'triangleUp', 'diamond', 'triangleDown', 'cross', 'diagonalCross', 'star4', 'star5', 'star6', 'star7', 'star10', 'pentagon', 'trapezium', 'line']
  },

  // global background settings
  'defaultBackground': {
    'enabled': true,
    'fill': '#000 0.5',
    'stroke': '#000',
    'cornerType': 'round',
    'corners': 0
  },

  // global title settings
  'defaultTitle': {
    'enabled': true,

    'fontSize': 11,
    'fontFamily': 'Tahoma',
    'fontColor': '#222',
    'fontWeight': 'bold',

    'text': 'Title text',

    'background': {
      'enabled': false
    },

    //'rotation': undefined',
    'width': null,
    'height': null,
    'margin': {
      'top': 5,
      'right': 5,
      'bottom': 5,
      'left': 5
    },
    'padding': {
      'top': 5,
      'right': 5,
      'bottom': 5,
      'left': 5
    },
    'align': 'center'
    //'orientation': undefined
  },

  'defaultLabelFactory': {
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
    'fontFamily': 'Arial',
    'fontSize': 11,
    'fontColor': '#000',
    'rotation': 0,
    'minFontSize': 8,
    'maxFontSize': 72,
    'adjustFontSize': {
      'width': false,
      'height': false
    },
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
    'position': 'center',
    'anchor': 'center',
    'offsetX': 0,
    'offsetY': 0,
    'rotation': 0,
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

  // global tooltip settings
  'defaultTooltip': {
    'enabled': true,
    'allowLeaveScreen': false,
    'isFloating': true,
    'title': {
      'enabled': false,

      'fontSize': 10,
      'fontFamily': 'Verdana',
      'fontColor': '#232323',
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
      'align': 'center',
      'orientation': 'top',
      'zIndex': 1
    },
    'separator': {
      'enabled': false,
      'width': '100%',
      'height': 1,
      'margin': {
        'top': 0,
        'right': 5,
        'bottom': 0,
        'left': 5
      },
      'orientation': 'top',
      'fill': [
        '0 #333333 0',
        '0.5 #333333 1',
        '1 #333333 0'
      ],
      'stroke': 'none',
      'zIndex': 1
    },
    'content': {
      'enabled': true,
      'fontSize': 10,
      'fontFamily': 'Verdana',
      'fontColor': '#232323',
      'fontWeight': 'bold',
      'vAlign': 'top',
      'hAlign': 'center',
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
      'fill': [
        '0 #fff 1',
        '0.5 #f3f3f3 1',
        '1 #fff 1'
      ],
      'stroke': [
        '0 #ddd 1',
        '1 #d0d0d0 1'
      ],
      'cornerType': 'none',
      'corners': 10,
      'zIndex': 0
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
    },
    'offsetX': 5,
    'offsetY': 5,
    'anchor': 'centerBottom',
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
    'stroke': {'color': '#474747', 'lineJoin': 'round', 'lineCap': 'square'},
    'title': {
      'text': 'Axis title',
      'margin': {'top': 10, 'right': 5, 'bottom': 10, 'left': 5},
      'background': {
        'enabled': false,
        'stroke': {'keys': ['#ddd', '#d0d0d0'], 'angle': '90'},
        'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': '90'}
      },
      'zIndex': 35
    },
    'labels': {
      'enabled': true,
      'rotation': 0,
      'offsetX': 0,
      'offsetY': 0,
      'minFontSize': 8,
      'maxFontSize': 72,
      'anchor': 'center',
      'padding': {'top': 1, 'right': 2, 'bottom': 1, 'left': 2},
      'fontFamily': 'Tahoma',
      'fontSize': 11,
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
      'minFontSize': 8,
      'maxFontSize': 72,
      'enabled': false,
      'rotation': 0,
      'offsetX': 0,
      'offsetY': 0,
      'anchor': 'center',
      'padding': {
        'top': 1,
        'right': 1,
        'bottom': 0,
        'left': 1
      },
      'fontFamily': 'Tahoma',
      'fontSize': 11,
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
      'enabled': true,
      'length': 5,
      'position': 'outside',
      'stroke': {'color': '#313131', 'lineJoin': 'round', 'lineCap': 'butt'},
      'zIndex': 35
    },
    'minorTicks': {
      'enabled': false,
      'length': 2,
      'position': 'outside',
      'stroke': {'color': '#313131', 'lineJoin': 'round', 'lineCap': 'butt'},
      'zIndex': 35
    },
    'zIndex': 35
  },

  // base/separated chart
  'chart': {
    'enabled': true,
    'title': {
      'text': 'Chart Title',
      'margin': {
        'bottom': 15
      },
      'zIndex': 80
    },
    'background': {
      'enabled': true,
      'fill': ['#fff', '#f3f3f3', '#fff'],
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
      'top': 10,
      'right': 20,
      'bottom': 10,
      'left': 20
    },
    'legend': {
      'enabled': false,
      'fontSize': '11',
      'fontFamily': 'Tahoma',
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
      'position': 'bottom',
      'align': 'center',
      'margin': {
        'top': 0,
        'right': 0,
        'bottom': 0,
        'left': 10
      },
      'padding': {
        'top': 7,
        'right': 7,
        'bottom': 7,
        'left': 7
      },
      'background': {
        'enabled': true,
        'fill': ['#fff', '#f3f3f3', '#fff'],
        'stroke': '#ddd',
        'corners': 5
      },
      'title': {
        'enabled': false,
        'fontSize': '10',
        'fontFamily': 'Verdana',
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
      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontWeight': 'bold',
      'textWrap': 'byLetter',

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
          'fontFamily': 'Arial',
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
          'position': 'centerTop',
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
          'position': 'centerTop',
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
            return this['x'] + ': ' + this['value'];
          }
        },
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
          'xErrorStroke': '#1D8BD1',
          'valueErrorStroke': '#1D8BD1'
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
          'anchor': 'bottom'
        }
      },
      'bar': {
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
          return window['anychart']['color']['lighten'](
              window['anychart']['color']['lighten'](
              this['sourceColor']));
        },
        /**
         * @this {*}
         * @return {*}
         */
        'medianStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverMedianStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'stemStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStemStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'whiskerStroke': function() {
          return this['sourceColor'];
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverWhiskerStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        'whiskerWidth': '20%',
        'hoverWhiskerWidth': '20%',
        'outlierMarkers': {
          'enabled': true,
          'disablePointerEvents': false,
          'position': 'center',
          'rotation': 0,
          'anchor': 'center',
          'offsetX': 0,
          'offsetY': 0,
          //'type': null, // there is a super default in code, DIAGONAL_CROSS
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
        'hoverOutlierMarkers': {
          'enabled': null,
          'size': 6
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
            return 'lowest: ' + parseFloat(this['lowest']).toFixed(2) + '\n' +
                'q1: ' + parseFloat(this['q1']).toFixed(2) + '\n' +
                'median: ' + parseFloat(this['median']).toFixed(2) + '\n' +
                'q3: ' + parseFloat(this['q3']).toFixed(2) + '\n' +
                'highest: ' + parseFloat(this['highest']).toFixed(2);
          }
        }
      },
      'bubble': {
        'markers': {
          'position': 'center'
        },
        'labels': {
          'position': 'center',
          'anchor': 'center'
        },
        'displayNegative': false,
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
        'markers': {
          'position': 'centerTop'
        },
        'labels': {
          'position': 'centerTop'
        }
      },
      'line': {
        'markers': {
          'enabled': true
        },
        'labels': {
          'anchor': 'bottom'
        },
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
        }
      },
      'marker': {
        'size': 10,
        'hoverSize': 12,
        'hatchFill': false,
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
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
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
        'markers': {
          'position': 'rightCenter'
        },
        'labels': {
          'position': 'rightCenter'
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
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
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
        /**
         * @this {*}
         * @return {*}
         */
        'highStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverHighStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'lowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
        },
        /**
         * @this {*}
         * @return {*}
         */
        'hoverLowStroke': function() {
          return window['anychart']['color']['darken'](this['sourceColor']);
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
        'legendItem': {
          'iconType': 'spline'
        },
        'markers': {
          'enabled': true
        },
        'labels': {
          'anchor': 'bottom'
        },
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
        }
      },
      'splineArea': {
        'labels': {
          'anchor': 'bottom'
        }
      },
      'stepLine': {
        'legendItem': {
          'iconType': 'stepline'
        },
        'markers': {
          'enabled': true
        },
        'labels': {
          'anchor': 'bottom'
        },
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
        }
      },
      'stepArea': {
        'labels': {
          'anchor': 'bottom'
        }
      }
    },
    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      //'layout': null, //depends on barChartMode
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': '#fff',
      'evenFill': '#f5f5f5',
      'stroke': '#c1c1c1',
      'scale': 1,
      'zIndex': 10
    },
    'defaultMinorGridSettings': {
      'enabled': true,
      'isMinor': true,
      //'layout': null, //depends on barChartMode
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': '#fff',
      'evenFill': '#f5f5f5',
      'stroke': '#c1c1c1',
      'scale': 1,
      'zIndex': 10
    },
    'defaultXAxisSettings': {
      'enabled': true,
      'orientation': 'bottom',
      'title': {
        'enabled': true,
        'text': 'X-Axis'
      },
      'width': null,
      'scale': 0
    },
    'defaultYAxisSettings': {
      'enabled': true,
      'orientation': 'left',
      'title': {
        'enabled': true,
        'text': 'Y-Axis'
      },
      'minorTicks': {
        'enabled': true
      },
      'width': null,
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

      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontColor': '#222222',
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

    'barsPadding': 0.1,
    'barGroupsPadding': 0.5,
    'maxBubbleSize': '20%',
    'minBubbleSize': '5%',
    'barChartMode': false,
    'crosshair': {
      'enabled': false,

      'xStroke': '#000',
      'yStroke': '#000',
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
        'fontSize': 11,
        'fontFamily': 'Tahoma',
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#000 .85'
        },
        'padding': {
          'top': 6,
          'right': 10,
          'bottom': 6,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'position': null,
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
        'fontSize': 11,
        'fontFamily': 'Tahoma',
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#000 .85'
        },
        'padding': {
          'top': 6,
          'right': 10,
          'bottom': 6,
          'left': 10
        },
        'width': null,
        'height': null,
        'anchor': null,
        'offsetX': 0,
        'offsetY': 0,
        'position': null,
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
    'title': {
      'enabled': true
    },
    'background': {
      'enabled': true
    },
    'xAxes': [{'scale': 0}],
    'yAxes': [{'scale': 1}],
    'grids': [
      {
        'layout': 'horizontal'
      },
      {
        'layout': 'vertical',
        'evenFill': 'none',
        'oddFill': 'none',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'horizontal'
      }
    ],
    'padding': {
      'top': 10,
      'right': 20,
      'bottom': 10,
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
    'defaultXAxisSettings': {
      'orientation': 'left'
    },
    'defaultYAxisSettings': {
      'orientation': 'bottom'
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
    'xAxes': [{}],
    'yAxes': [{}],
    'grids': [
      {
        'layout': 'vertical'
      },
      {
        'layout': 'horizontal',
        'evenFill': 'none',
        'oddFill': 'none',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'vertical'
      }
    ],
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
      'top': 10,
      'right': 20,
      'bottom': 10,
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
    'grids': [
      {
        'layout': 'horizontal',
        'evenFill': '#fff',
        'oddFill': '#fff'
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'horizontal'
      }
    ],
    'padding': {
      'top': 10,
      'right': 20,
      'bottom': 10,
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
    'grids': [
      {
        'layout': 'horizontal'
      },
      {
        'layout': 'vertical',
        'evenFill': 'none',
        'oddFill': 'none',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'horizontal'
      }
    ],
    'padding': {
      'top': 10,
      'right': 20,
      'bottom': 10,
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
    'defaultXAxisSettings': {
      'minorTicks': {
        'enabled': true
      }
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
    'grids': [
      {
        'layout': 'horizontal'
      },
      {
        'layout': 'vertical',
        'evenFill': 'none',
        'oddFill': 'none',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'horizontal'
      }
    ],
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
      'top': 10,
      'right': 20,
      'bottom': 10,
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
    'grids': [
      {
        'layout': 'horizontal'
      },
      {
        'layout': 'vertical',
        'evenFill': 'none',
        'oddFill': 'none',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'evenFill': 'none',
        'oddFill': 'none',
        'stroke': '#000 0.075',
        'layout': 'horizontal'
      }
    ],
    'padding': {
      'top': 10,
      'right': 20,
      'bottom': 10,
      'left': 20
    }
  },

  // merge with chart
  'scatter': {
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
        /**
         * @this {*}
         * @return {*}
         */
        'hatchFill': function() {
          return this['sourceHatchFill'];
        },
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
          'enabled': true,
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
          //'enabled': undefined,
          'size': 6
        },

        'clip': true,
        'color': null,

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
            return this['x'] + ': ' + this['value'];
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
          'xErrorStroke': '#1d8bd1',
          'valueErrorStroke': '#1d8bd1'
        },
        'legendItem': {
          //'iconTextSpacing': undefined,
          //'iconEnabled': undefined,
          //'iconType': undefined,
          //'iconStroke': undefined,
          //'iconFill': undefined,
          //'iconHatchFill': undefined,
          //'iconMarkerType': undefined,
          //'iconMarkerFill': undefined,
          //'iconMarkerStroke': undefined,
          //'text': undefined,
          //'disabled': undefined
        }
      },
      'bubble': {
        'displayNegative': false,
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
        //'hoverNegativeHatchFill': undefined,
        'hatchFill': false,
        'markers': {
          'enabled': false,
          'position': 'center'
        },
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
      'marker': {
        'size': 10,
        'hoverSize': 12,
        'hatchFill': false,
        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return parseFloat(this['value']).toFixed(2);
          }
        }
      }
    },

    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': '#ffffff',
      'evenFill': '#f5f5f5',
      'stroke': '#c1c1c1',
      'zIndex': 10,
      'scale': 1
    },
    'defaultMinorGridSettings': {
      'enabled': true,
      'isMinor': true,
      'layout': 'horizontal',
      'drawFirstLine': true,
      'drawLastLine': true,
      'oddFill': '#ffffff',
      'evenFill': '#f5f5f5',
      'stroke': '#c1c1c1',
      'zIndex': 10,
      'scale': 1
    },
    'defaultXAxisSettings': {
      'enabled': true,
      'orientation': 'bottom',
      'title': {
        'enabled': true,
        'text': 'X-Axis'
      },
      'minorTicks': {
        'enabled': true
      },
      'scale': 0
    },
    'defaultYAxisSettings': {
      'enabled': true,
      'orientation': 'left',
      'title': {
        'enabled': true,
        'text': 'Y-Axis'
      },
      'minorTicks': {
        'enabled': true
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

      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontColor': '#222222',
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
    'grids': [
      {
        'oddFill': '#f9f9f9',
        'evenFill': '#ffffff',
        'layout': 'horizontal'
      },
      {
        'oddFill': 'none',
        'evenFill': 'none',
        'layout': 'vertical',
        'scale': 0
      }
    ],
    'minorGrids': [
      {
        'oddFill': 'none',
        'evenFill': 'none',
        'stroke': '#000 0.1',
        'layout': 'horizontal'
      },
      {
        'oddFill': 'none',
        'evenFill': 'none',
        'stroke': '#000 0.1',
        'layout': 'vertical',
        'scale': 0
      }
    ],
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

      'xStroke': '#000',
      'yStroke': '#000',
      'xLabel': {
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 11,
        'fontFamily': 'Tahoma',
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#000 .85'
        },
        'padding': {
          'top': 6,
          'right': 10,
          'bottom': 6,
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
        'rotation': 0
      },
      'yLabel': {
        'axisIndex': 0,
        /**
         * @this {*}
         * @return {*}
         */
        'textFormatter': function() {
          return this['value'];
        },
        'enabled': true,
        'fontSize': 11,
        'fontFamily': 'Tahoma',
        'fontColor': '#fff',
        'fontWeight': 400,
        'textWrap': 'byLetter',
        'disablePointerEvents': true,

        'text': 'Label text',
        'background': {
          'enabled': true,
          'fill': '#000 .85'
        },
        'padding': {
          'top': 6,
          'right': 10,
          'bottom': 6,
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
        'rotation': 0
      }
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
      'stroke': 'none',
      'title': {
        'enabled': false,
        'zIndex': 3
      },
      'labels': {
        'zIndex': 3
      },
      'minorLabels': {
        'fontSize': 11,
        'padding': {
          'top': 1,
          'right': 1,
          'bottom': 0,
          'left': 1
        },
        'zIndex': 3
      },
      'ticks': {
        'zIndex': 3
      },
      'minorTicks': {
        'enabled': true,
        'zIndex': 3
      },
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
    /**
     * @this {*}
     * @return {*}
     */
    'stroke': function() {
      return window['anychart']['color']['darken'](this['sourceColor'], .2);
    },
    /**
     * @this {*}
     * @return {*}
     */
    'hoverStroke': function() {
      return window['anychart']['color']['darken'](this['sourceColor']);
    },
    'hatchFill': null,
    //'hoverHatchFill': undefined,
    'forceHoverLabels': false,
    'labels': {
      'enabled': true,
      'fontSize': 13,
      'fontColor': null,
      'fontFamily': 'Arial',
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
    'outsideLabels': {'autoColor': '#000'},
    'insideLabels': {'autoColor': '#fff'},
    'hoverLabels': {
      'enabled': null
    },
    'tooltip': {
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
        return (this['name'] || this['x']) + '\n' + this['value'];
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
      },
      'tooltip': {
        /**
         * @this {*}
         * @return {*}
         */
        'contentFormatter': function() {
          return (this['value']) + '\n' + this['meta']['pointValue'];
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
    'connectorStroke': '#000',
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
      return window['anychart']['color']['darken'](this['sourceColor'], .2);
    },
    /**
     * @this {*}
     * @return {*}
     */
    'hoverStroke': function() {
      return window['anychart']['color']['darken'](this['sourceColor']);
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
    'outsideLabels': {'autoColor': '#000'},
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
      'position': null,
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
        return (this['name'] || this['x']) + '\n' + this['value'];
      }
    },
    'legend': {
      'margin': {
        'top': 10,
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
      'zIndex': 35
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
    'defaultSeriesSettings': {
      'base': {
        'enabled': true,
        'hatchFill': null,
        'labels': {
          'enabled': false,
          'position': 'center',
          'anchor': 'bottom'
        },
        'hoverLabels': {'enabled': null},
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
        'hoverMarkers': {'size': 6},
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
            return this['x'] + ': ' + this['value'];
          }
        }
      },
      'area': {'markers': {'enabled': false, 'position': 'center'}},
      'line': {
        'markers': {'enabled': true, 'position': 'center'},
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'marker': {
        'size': 10,
        'hoverSize': 12,
        'hatchFill': false,
        'labels': {
          'anchor': 'center'
        },
        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return parseFloat(this['value']).toFixed(2);
          }
        }
      }
    },
    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      'layout': 'radial',
      'drawFirstLine': false,
      'drawLastLine': false,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#DDDDDD',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'defaultMinorGridSettings': {
      'enabled': false,
      'isMinor': true,
      'layout': 'circuit',
      'drawFirstLine': false,
      'drawLastLine': false,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#333333',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'xAxis': {
      'stroke': '#C0C0C0',
      'ticks': {
        'stroke': '#333333'
      },
      'scale': 0
    },
    'yAxis': {
      'stroke': '#333333',
      'minorLabels': {
        'padding': {'top': 1, 'right': 1, 'bottom': 0, 'left': 1}
      },
      'minorTicks': {'enabled': true},
      'scale': 1
    },
    'startAngle': 0,
    'grids': [
      {'enabled': true, 'stroke': '#C0C0C0', 'layout': 'circuit', 'oddFill': 'white', 'evenFill': '#fafafa'},
      {'enabled': true} //grid with default settings
    ],
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
    'yScale': 1,
    'background': {'enabled': true, 'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': 90}, 'stroke': null}
  },

  // merge with chart
  'polar': {
    'defaultSeriesSettings': {
      'base': {
        'enabled': true,
        'hatchFill': null,
        'labels': {'enabled': false, 'position': 'center', 'anchor': 'bottom'},
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
        'hoverMarkers': {'size': 6},
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
            return this['x'] + ': ' + this['value'];
          }
        }
      },
      'area': {},
      'line': {
        'markers': {'enabled': true},
        /**
         * @this {*}
         * @return {*}
         */
        'hoverStroke': function() {
          return window['anychart']['color']['lighten'](this['sourceColor']);
        }
      },
      'marker': {
        'size': 10,
        'hoverSize': 12,
        'labels': {
          'anchor': 'bottom'
        },
        'hatchFill': false,
        'tooltip': {
          /**
           * @this {*}
           * @return {*}
           */
          'contentFormatter': function() {
            return parseFloat(this['value']).toFixed(2);
          }
        }
      }
    },
    'defaultGridSettings': {
      'enabled': true,
      'isMinor': false,
      'layout': 'radial',
      'drawFirstLine': false,
      'drawLastLine': false,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#DDDDDD',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'defaultMinorGridSettings': {
      'enabled': false,
      'isMinor': true,
      'layout': 'circuit',
      'drawFirstLine': false,
      'drawLastLine': false,
      'oddFill': 'none',
      'evenFill': 'none',
      'stroke': '#333333',
      'zIndex': 10,
      'xScale': 0,
      'yScale': 1
    },
    'xAxis': {
      'stroke': '#C0C0C0',
      'ticks': {
        'stroke': '#333333'
      },
      'scale': 0
    },
    'yAxis': {
      'stroke': '#333333',
      'minorLabels': {
        'padding': {'top': 1, 'right': 1, 'bottom': 0, 'left': 1}
      },
      'minorTicks': {'enabled': true},
      'scale': 1
    },
    'startAngle': 0,
    'grids': [
      {'enabled': true, 'stroke': '#C0C0C0', 'layout': 'circuit', 'oddFill': 'white', 'evenFill': '#fafafa'},
      {'enabled': true} //grid with default settings
    ],
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
    'yScale': 1,
    'background': {'enabled': true, 'fill': {'keys': ['#fff', '#f3f3f3', '#fff'], 'angle': 90}, 'stroke': null}
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
          'type': 'circle',
          'size': 1.5,
          'position': 'center'
        },
        'labels': {
          'enabled': false,
          'background': {
            enabled: false
          },
          'position': 'center',
          'anchor': 'centerBottom'
        },
        'color': '#4682B4'
      },
      'area': {
        'stroke': '#1e90ff',
        'fill': '#d2e9ff'
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
        'fill': '#87ceeb',
        'negativeFill': '#ffc0cb'
      },
      'line': {
        'stroke': '#4682b4'
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
        'fill': '#305374',
        'negativeFill': '#cb6762'
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

      'fontSize': 11,
      'fontFamily': 'Tahoma',
      'fontColor': '#222222',
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

    'markers': {},
    'firstMarkers': {},
    'lastMarkers': {},
    'negativeMarkers': {},
    'minMarkers': {
      'fill': '#00f',
      'stroke': '#000 0.5'
    },
    'maxMarkers': {
      'fill': '#f00',
      'stroke': '#000 0.5'
    },

    'labels': {},
    'firstLabels': {},
    'lastLabels': {},
    'negativeLabels': {},
    'minLabels': {},
    'maxLabels': {},

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
      'enabled': false,
      'margin': {
        'bottom': 5
      }
    },
    'background': {
      'enabled': false
    },
    'padding': {
      'top': 0,
      'right': 0,
      'bottom': 0,
      'left': 0
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
        //'size': undefined,
        'position': 'inside',
        'type': 'triangleUp'
        //'radius': undefined
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
        'selectFill': {
          'color': '#64b5f6'
        },
        'stroke': {
          'thickness': 0.5,
          'color': '#545f69'
        },
        'hoverStroke': {
          'thickness': 0.5,
          'color': '#545f69'
        },
        'selectStroke': {
          'thickness': 0.5,
          'color': '#545f69'
        },
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
        'hoverMarkers': {
          'enabled': null,
          'size': 6
        },
        'selectMarkers': {
          'enabled': null,
          'size': 6
        },

        'color': null,
        'allowPointsSelect': null,

        'tooltip': {
          'enabled': true,
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
            return this['x'] + ': ' + this['value'];
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
      },
      'minorTicks': {'enabled': false}
    },
    'unboundRegions': {'enabled': true, 'fill': '#F7F7F7', 'stroke': '#B9B9B9'},
    'linearColor': {'colors': ['#fff', '#ffd54f', '#ef6c00']},
    'ordinalColor': {
      'autoColors': function(rangesCount) {
        return window['anychart']['color']['blendedHueProgression']('#ffd54f', '#ef6c00', rangesCount);
      }
    },
    'allowPointsSelect': true
  },

  'defaultDataGrid': {
    'isStandalone': false,
    'titleHeight': 25,
    'backgroundFill': 'none',
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
      'background': {
        'enabled': false,
        'stroke': '#000'
      },
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
        'top': 5,
        'right': 5,
        'bottom': 5,
        'left': 5
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
      'minorTicks': {
        'enabled': true
      }
    },
    'polarAxis': {
      'stroke': {'color': 'black', 'opacity': .1, 'lineJoin': 'round', 'lineCap': 'square'},
      'zIndex': 0
    },
    'radarAxis': {
      'stroke': {'color': 'black', 'opacity': .1, 'lineJoin': 'round', 'lineCap': 'square'},
      'zIndex': 0
    },
    'radialAxis': {
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
      'scale': null
    },
    'polarGrid': {
      'enabled': true,
      'isMinor': false,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': '#fff 0.3',
      'evenFill': '#f5f5f5 0.3',
      'stroke': '#c1c1c1'
    },
    'radarGrid': {
      'enabled': true,
      'isMinor': false,
      'layout': 'circuit',
      'drawLastLine': true,
      'oddFill': '#fff 0.3',
      'evenFill': '#f5f5f5 0.3',
      'stroke': '#c1c1c1'
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
      }
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
      'height': null
    },
    'rangeAxisMarker': {
      'enabled': true,
      'from': 0,
      'to': 0,
      'layout': 'horizontal',
      'fill': '#000 0.3'
    },
    'dataGrid': {
      'isStandalone': true,
      'backgroundFill': '#fff',
      'zIndex': 0
    }
  }
};
