import scatterPlot from './pianoRoll'
import streamGraph from './streamGraph'

const longitudeInfo = {
  value: d => d.lon,
  scale: d3.scaleLinear().domain([-130, 130]),
  label: ''
};

const timeInfo = {
  value: d => d.date,
  scale: d3.scaleTime(),
  label: '',
  zoom: d3.zoom().scaleExtent([1, 20])
};

const timeFixedInfo = {
  value: d => d.date,
  scale: d3.scaleTime(),
  label: ''
};

const causeColorInfo = {
  value: d => d.causes[0],
  scale: d3.scaleOrdinal()
    .domain(['Drowning/Asphyxiation', 'Exposure', 'Vehicular/Mechanical', 'Violence/Homicide', 'Medical/Illness', 'Unknown'])
    .range(['drowning', 'exposure', 'vehicular', 'violence', 'medical', 'unknown']),
  label: 'Cause'
};

const countSizeInfo = {
  value: d => d.dead + d.missing,
  label: 'Dead/Missing',
  scale: d3.scaleSqrt().range([0, 30])
};

const countSummaryInfo = {
  scale: d3.scaleLinear().domain([0,1500]).range([0, 150]),
  label: ''
};

const vis = {
  longitude: longitudeInfo,
  time: timeInfo,
  timeFixed: timeFixedInfo,
  countSize: countSizeInfo,
  causeColor: causeColorInfo,
  countSummary: countSummaryInfo
};

const pianoMargin = { left: 260, right: 230, top: 20, bottom: 120 };
const streamMargin = { left: 100, top: 20, bottom: 120 };

const visualization = d3.select('#visualization');
const visualizationDiv = visualization.node();
const svg = visualization.select('svg');

function row(d) {
  d.missing = +d.missing;
  d.dead = +d.dead;
  
  d.date = new Date(d.date);
  
  d.lat = +d.lat;
  d.lon = +d.lon;

  // compute region (Americas / EMEA / Asia)
  var regionId, regionName;
  if(d.lon < -50) {
    regionId = 0;
    regionName = 'Americas';
  } else if(d.lon < 75) {
    regionId = 1;
    regionName = 'EMEA';
  } else {
    regionId = 2;
    regionName = 'Asia';
  }
  d.regionId = regionId;
  d.regionName = regionName;
  d.causes = eval(d.causes);
  d.nationalities = eval(d.nationalities);
  
  return d;
}

d3.csv('data/clean/migrants.csv', row, data => {

  // sort all marks by reverse size so that small marks
  // appear "on top of" larger ones.
  const sortValue = vis.countSize.value;
  data.sort((x,y) => d3.descending(sortValue(x), sortValue(y)));

  vis.time.scale.domain(d3.extent(data, vis.time.value));
  vis.timeFixed.scale.domain(d3.extent(data, vis.timeFixed.value));
  vis.countSize.scale.domain(d3.extent(data, vis.countSize.value));

  const render = () => {

    // Extract the width and height that was computed by CSS.
    svg
      .attr('width', visualizationDiv.clientWidth)
      .attr('height', visualizationDiv.clientHeight);

    // Render the scatter plot.
    scatterPlot(data, vis, pianoMargin);
    streamGraph(data, vis, streamMargin);

  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener('resize', render);
});
