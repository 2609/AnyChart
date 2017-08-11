goog.provide('anychart.cartesian3dModule.defaultTheme');


goog.mixin(goog.global['anychart']['themes']['defaultTheme'], {
  // merges with nothing
  'cartesian3dBase': {
    'defaultSeriesType': 'column',
    'zAngle': 45,
    'zAspect': '50%',
    'zDistribution': false,
    'zPadding': 10,
    'defaultSeriesSettings': {
      'base': {
        'normal': {
          'stroke': 'none',
          'fill': anychart.core.defaultTheme.returnSourceColor
        },
        'hovered': {
          'stroke': anychart.core.defaultTheme.returnSourceColor,
          'fill': anychart.core.defaultTheme.returnLightenSourceColor
        },
        'selected': {
          'stroke': anychart.core.defaultTheme.returnSourceColor,
          'fill': anychart.core.defaultTheme.defaultSelectSolidColor
        },
        'tooltip': {
          'anchor': 'left-top',
          'position': 'left-top'
        }
      }
    }
  },
  // merge with area
  'bar3d': {
    'grids': [
      {},
      {
        'enabled': true,
        'layout': 'horizontal',
        'scale': 0
      }
    ]
  },
  // merge with column
  'column3d': {
    'grids': [
      {},
      {
        'enabled': true,
        'layout': 'vertical',
        'scale': 0
      }
    ]
  },
  // merge with area
  'area3d': {
    'zDistribution': true,
    'zPadding': 5,
    'grids': [
      {},
      {
        'enabled': true,
        'layout': 'vertical',
        'scale': 0
      }
    ]
  },
  // merge with cartesian
  'cartesian3d': {}
});
