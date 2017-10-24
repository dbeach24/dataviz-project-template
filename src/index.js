import scatterPlot from './pianoRoll'

const xInfo = {
  value: d => d.lon,
  scale: d3.scaleLinear(),
  label: ''
};

const yInfo = {
  value: d => d.date,
  scale: d3.scaleTime(),
  label: ''
};

const colorInfo = {
  value: d => d.causes[0],
  scale: d3.scaleOrdinal(),
  label: 'Cause'
};

colorInfo.scale
  .domain(['Drowning/Asphyxiation', 'Exposure', 'Vehicular/Mechanical', 'Violence/Homicide', 'Medical/Illness', 'Unknown'])
  .range(['#60B0FF', '#ff8c0a', '#5e5e5e', '#cc0000', '#81c100', '#d8c6ff']);

const sizeInfo = {
  value: d => d.dead + d.missing,
  label: 'Dead/Missing',
  scale: d3.scaleSqrt().range([0, 30])
};

const margin = { left: 120, right: 300, top: 20, bottom: 120 };

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
  
  return d;
}

d3.csv('data/clean/migrants.csv', row, data => {

  xInfo.scale.domain([-150, 150]);
  //xInfo.scale.domain(d3.extent(data, xInfo.value));
  yInfo.scale.domain(d3.extent(data, yInfo.value));
  sizeInfo.scale.domain(d3.extent(data, sizeInfo.value));

  const render = () => {

    // Extract the width and height that was computed by CSS.
    svg
      .attr('width', visualizationDiv.clientWidth)
      .attr('height', visualizationDiv.clientHeight);

    // Render the scatter plot.
    scatterPlot({
      data, xInfo, yInfo, colorInfo, sizeInfo,
      margin
    });
  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener('resize', render);
});
