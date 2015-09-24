var parser, map, series;

var randomExt = function(a, b) {
  return Math.round(Math.random() * (b - a + 1) + a);
};

var min = 0, max = 350;

anychart.onDocumentReady(function() {
  var dataSet = anychart.data.set([
    ["AU.CT", 15, "Australian Capital Territory"],
    ["AU.VI", 23, "Victoria"],
    ["AU.WA", 86, "Western Australia"],
    ["AU.QL", 90, "Queensland"],
    ["AU.NS", 32, "New South Wales"],
    ["AU.NT", 64, "Northern Territory"],
    ["AU.TS", 30, "Tasmania"],
    ["AU.SA", 45, "South Australian"]
  ]);

  //anychart.maps.australia['ac-geoFieldId'] = 'code_hasc';

  var choroplethData = dataSet.mapAs({id: [0], value: [1], title: [2]});
  var bubbleData = dataSet.mapAs({id: [0], size: [1], title: [2]});

  map = anychart.map();
  //map = anychart.choropleth(choroplethData);
  //map = anychart.bubbleMap(bubbleData);
  map.geoData(anychart.maps.australia);
  map.geoIdField('code_hasc');

  map.choropleth(choroplethData);

  var colorScale = anychart.scales.ordinalColor();
  colorScale.ranges([
    {from: -100, to: 30},
    {from: 30, to: 65},
    {from: 65, to: 90}
  ]);
  map.getSeries(0).colorScale(colorScale);

  map.maxBubbleSize('10%');
  map.minBubbleSize('1%');

  series = map.bubble(bubbleData);
  series.labels().fontColor('black');
  series.labels(true);

  series
      .hatchFill('diagonal')
      .hoverHatchFill('confetti')
      .selectHatchFill('percent60');

  map.container('container').draw();
});
