goog.provide('anychart.themes.morning');


/**
 * @this {*}
 * @return {*}
 */
var returnDarkenSourceColor = function() {
  return window['anychart']['color']['darken'](this['sourceColor']);
};


/**
 * @this {*}
 * @return {*}
 */
var returnLightenSourceColor = function() {
  return window['anychart']['color']['lighten'](this['sourceColor']);
};


window['anychart'] = window['anychart'] || {};
window['anychart']['themes'] = window['anychart']['themes'] || {};
window['anychart']['themes']['morning'] = {
  'palette': {
    'type': 'distinct',
    'items': ['#0288d1', '#58abd7', '#ffe082', '#f8bbd0', '#f48fb1', '#bbdefb', '#d4e157', '#ff6e40', '#03a9f4', '#e1bee7']
  },
  'ordinalColor': {
    'autoColors': function(rangesCount) {
      return window['anychart']['color']['blendedHueProgression']('#ffe082', '#f06292', rangesCount);
    }
  },
  'defaultFontSettings': {
    'fontFamily': '"Source Sans Pro", sans-serif',
    'fontColor': '#37474f',
    'fontSize': 14
  },
  'defaultBackground': {
    'fill': '#ffffff',
    'stroke': '#ffffff',
    'cornerType': 'round',
    'corners': 0
  },
  'defaultAxis': {
    'labels': {
      'enabled': true
    },
    'ticks': {
      'stroke': '#cfd8dc'
    },
    'minorTicks': {
      'stroke': '#eceff1'
    }
  },
  'defaultGridSettings': {
    'stroke': '#cfd8dc'
  },
  'defaultMinorGridSettings': {
    'stroke': '#eceff1'
  },
  'defaultSeparator': {
    'fill': '#eceff1'
  },
  'defaultLegend': {
    'position': 'right',
    'vAlign': 'middle',
    'align': 'left',
    'fontSize': 14,
    'iconTextSpacing': 8,
    'iconSize': 18,
    'itemsLayout': 'vertical',
    'padding': {'top': 10, 'right': 10, 'bottom': 10, 'left': 10},
    'margin': {'top': 0, 'right': 0, 'bottom': 0, 'left': 15},
    'background': {
      'enabled': true,
      'fill': '#F9FAFB',
      'stroke': '#eceff1',
      'cornerType': 'round',
      'corners': 2
    },
    'paginator': {
      'orientation': 'bottom',
      'fontSize': 14
    },
    'title': {
      'padding': {'bottom': 10},
      'enabled': false,
      'text': 'Legend',
      'hAlign': 'left',
      'fontSize': 16
    }
  },
  'defaultTooltip': {
    'title': {
      'fontColor': '#263238',
      'padding': {'bottom': 8},
      'fontSize': 18
    },
    'content': {
      'fontColor': '#78909c'
    },
    'separator': {
      'enabled': false,
      'padding': {'bottom': 8}
    },
    'background': {
      'fill': '#F9FAFB 0.95',
      'stroke': '#eceff1',
      'corners': 2
    },
    'padding': {'top': 10, 'right': 20, 'bottom': 15, 'left': 20},
    'fontColor': '#78909c'
  },
  'defaultColorRange': {
    'stroke': '#bdc8ce',
    'ticks': {
      'stroke': '#bdc8ce', 'position': 'outside', 'length': 7, 'enabled': true
    },
    'minorTicks': {
      'stroke': '#bdc8ce', 'position': 'outside', 'length': 5, 'enabled': true
    },
    'marker': {
      'padding': {'top': 3, 'right': 3, 'bottom': 3, 'left': 3},
      'fill': '#37474f',
      'hoverFill': '#37474f'
    }
  },
  'defaultScroller': {
    'fill': '#F9FAFB',
    'selectedFill': '#eceff1',
    'thumbs': {
      'fill': '#F9FAFB',
      'stroke': '#bdc8ce',
      'hoverFill': '#bdc8ce',
      'hoverStroke': '#e9e4e4'
    }
  },
  'chart': {
    'title': {
      'fontSize': 20,
      'margin': {'top': 0, 'right': 0, 'bottom': 10, 'left': 10},
      'align': 'left'
    }
  },
  'cartesianBase': {
    'defaultSeriesSettings': {
      'candlestick': {
        'risingFill': '#0288d1',
        'risingStroke': '#0288d1',
        'hoverRisingFill': returnLightenSourceColor,
        'hoverRisingStroke': returnDarkenSourceColor,
        'fallingFill': '#f8bbd0',
        'fallingStroke': '#f8bbd0',
        'hoverFallingFill': returnLightenSourceColor,
        'hoverFallingStroke': returnDarkenSourceColor,
        'selectRisingStroke': '3 #0288d1',
        'selectFallingStroke': '3 #f8bbd0',
        'selectRisingFill': '#333333 0.85',
        'selectFallingFill': '#333333 0.85'
      },
      'ohlc': {
        'risingStroke': '#0288d1',
        'hoverRisingStroke': returnDarkenSourceColor,
        'fallingStroke': '#f8bbd0',
        'hoverFallingStroke': returnDarkenSourceColor,
        'selectRisingStroke': '3 #0288d1',
        'selectFallingStroke': '3 #f8bbd0'
      }
    },
    'defaultXAxisSettings': {
      'orientation': 'bottom',
      'title': {
        'text': 'X-Axis'
      },
      'ticks': {
        'enabled': false
      },
      'scale': 0
    },
    'defaultYAxisSettings': {
      'orientation': 'left',
      'title': {
        'text': 'Y-Axis'
      },
      'ticks': {
        'enabled': false
      },
      'scale': 1
    },
    'xAxes': [{}],
    'grids': [],
    'yAxes': []
  },
  'financial': {
    'yAxes': [{}]
  },
  'map': {
    'unboundRegions': {'enabled': true, 'fill': '#e8ecf1', 'stroke': '#bdc8ce'},
    'linearColor': {'colors': ['#ffe082', '#f06292']},
    'defaultSeriesSettings': {
      'base': {
        'stroke': '#eceff1',
        'labels': {
          'fontColor': '#212121'
        }
      },
      'connector': {
        'stroke': '1.5 #0288d1',
        'hoverStroke': '1.5 #37474f',
        'selectStroke': '1.5 #000',
        'markers': {
          'stroke': '1.5 #F9FAFB',
          'fill': '#f8bbd0'
        },
        'hoverMarkers': {
          'fill': '#f8bbd0'
        }
      }
    }
  },
  'sparkline': {
    'padding': 0,
    'background': {'stroke': '#ffffff'},
    'defaultSeriesSettings': {
      'area': {
        'stroke': '1.5 #0288d1',
        'fill': '#0288d1 0.5'
      },
      'column': {
        'fill': '#0288d1',
        'negativeFill': '#f8bbd0'
      },
      'line': {
        'stroke': '1.5 #0288d1'
      },
      'winLoss': {
        'fill': '#0288d1',
        'negativeFill': '#f8bbd0'
      }
    }
  },
  'bullet': {
    'background': {'stroke': '#ffffff'},
    'defaultMarkerSettings': {
      'fill': '#0288d1',
      'stroke': '2 #0288d1'
    }
  },
  'treeMap': {
    'headers': {
      'background': {
        'enabled': true,
        'fill': '#eceff1',
        'stroke': '#bdc8ce'
      }
    },
    'hoverHeaders': {
      'fontColor': '#757575',
      'background': {
        'fill': '#bdc8ce'
      }
    },
    'labels': {
      'fontColor': '#212121'
    },
    'selectLabels': {
      'fontColor': '#fafafa'
    },
    'stroke': '#bdc8ce',
    'selectStroke': '2 #eceff1'
  }
};
