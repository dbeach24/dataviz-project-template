import {markerInfo} from './markers'

const svg = d3.select("svg");

const xAxis = d3.axisBottom()
  .ticks(0);

const yAxis = d3.axisLeft()
  .ticks(5)
  .tickPadding(15);

// const colorLegend = d3.legendColor()
//   .classPrefix('color')
//   .shape('circle');

const colorLegendG = svg.append("g");

function drawColorLegend() {
  const g = colorLegendG;

  const s = 50;
  const x = 0;
  const tx = s/2 + 10;
  var y0 = s/2 + 25;
  const ypad = 5;
  const y = i => (y0 + i*(s+ypad));

  g.append('text')  
    .attr('x', -s/2)
    .attr('y', 20)
    .text("Cause")
    .attr('class', 'legend-label');

  for(var i in markerInfo) {
    var info = markerInfo[i];

    var bgarea = g.append('rect')
        .attr('x', -s/2)
        .attr('y', y(i) - s/2 - 5)
        .attr('width', 150)
        .attr('height', s + 10)
        .attr('opacity', 0.0);

    var marker = info.marker(g, x, y(i), s)
        .classed('legend-icon', true)
        .classed('highlightable', true);
    g.append('text')
        .attr('x', tx)
        .attr('y', y(i) + 10)
        .text(info.label)
        .classed('legend-value', true)
        .classed(info.class, true);

    var hoverarea = g.append('rect')
        .attr('x', -s/2)
        .attr('y', y(i) - s/2 - 5)
        .attr('width', 150)
        .attr('height', s + 10)
        .attr('opacity', 0.0);

    addMarkerBehavior(hoverarea, info, bgarea);

  }

}

function addMarkerBehavior(marker, info, bgarea) {
  marker
      .on("mouseover", () => {
        bgarea.attr('fill', '#E0E0E0').attr('opacity', 1.0);
        svg.selectAll("." + info.class).classed("highlight", true)
        svg.selectAll(`.highlightable:not(.${info.class})`).classed("greyout", true)
      })
      .on("mouseout", () => {
        bgarea.attr('fill', null).attr('opacity', 0.0);
        svg.selectAll("." + info.class).classed("highlight", false)
        svg.selectAll(`.highlightable:not(.${info.class})`).classed("greyout", false)
      })
      ;
}


const sizeLegend = d3.legendSize()
  .shape('circle')
  .shapePadding(10)
  .classPrefix('size')
  .cells([50, 100, 200, 400, 600])
  .labels(['50', '100', '200', '400', '600']);

export default function (data, vis, margin) {


  const xInfo = vis.longitude;
  const yInfo = vis.time;
  const colorInfo = vis.causeColor;
  const sizeInfo = vis.countSize;
  const zoom = yInfo.zoom;

  xAxis.scale(xInfo.scale);
  yAxis.scale(yInfo.scale);
  sizeLegend.scale(sizeInfo.scale);

  const width = svg.attr('width');
  const height = svg.attr('height');
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  xAxis.tickSize(-innerHeight);
  yAxis.tickSize(-innerWidth);

  let g = svg.selectAll('.container').data([null]);

  const gEnter = g.enter().append('g').attr('class', 'container');
  g = gEnter
    .merge(g)
      .attr('transform', `translate(${margin.left},${margin.top})`);

  const xAxisGEnter = gEnter.append('g').attr('class', 'x-axis');
  const xAxisG = xAxisGEnter
    .merge(g.select('.x-axis'))
      .attr('transform', `translate(0, ${innerHeight})`);

  const yAxisGEnter = gEnter.append('g').attr('class', 'y-axis');
  const yAxisG = yAxisGEnter.merge(g.select('.y-axis'));

  const marksGEnter = gEnter.append('g').attr('class', 'marksg');
  const marksG = marksGEnter.merge(g.select('.marksg'));

  // const colorLegendGEnter = gEnter.append('g').attr('class', 'color-legend');
  // const colorLegendG = colorLegendGEnter
  //   .merge(g.select('.color-legend'))
  //     .attr('transform', `translate(${innerWidth + 60}, 50)`);

  colorLegendG.attr('transform', `translate(${margin.left + innerWidth + 60}, 50)`);
  drawColorLegend();

  const sizeLegendGEnter = gEnter.append('g').attr('class', 'size-legend');
  const sizeLegendG = sizeLegendGEnter
    .merge(g.select('.size-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 450)`);

  const zoomCatcherGEnter = gEnter.append('rect').attr('class', 'zoom-catcher');
  const zoomCatcher = zoomCatcherGEnter
    .merge(g.select('.zoom-catcher'))
      .attr('width', innerWidth)
      .attr('height', innerHeight)
      .call(vis.time.zoom);

  xAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', 100)
    .merge(xAxisG.select('.axis-label'))
      .attr('x', innerWidth / 2)
      .text(xInfo.label);

  yAxisGEnter
    .append('text')
      .attr('class', 'axis-label')
      .attr('y', -60)
      .style('text-anchor', 'middle')
    .merge(yAxisG.select('.axis-label'))
      .attr('x', -innerHeight / 2)
      .attr('transform', `rotate(-90)`)
      .text(vis.time.label);

  // colorLegendGEnter
  //   .append('text')
  //     .attr('class', 'legend-label')
  //     .attr('x', -30)
  //     .attr('y', -20)
  //   .merge(colorLegendG.select('legend-label'))
  //     .text(vis.causeColor.label);

  sizeLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(sizeLegendG.select('legend-label'))
      .text(vis.countSize.label);

  xInfo.scale
    .range([0, innerWidth]);

  yInfo.scale
    .range([innerHeight, 0])
    .nice();

  function updatePianoRoll() {

    const xScale = xInfo.scale;
    const yScale = yInfo.scale;

    yAxisG.call(yAxis);

    const circles = marksG.selectAll('.mark').data(data);
    circles
      .enter().append('circle')
        .classed('mark', true)
        .classed('highlightable', true)
      .merge(circles)
        .attr('cx', d => xScale(xInfo.value(d)))
        .attr('cy', d => yScale(yInfo.value(d)))
        .attr('class', d => `mark highlightable ${colorInfo.scale(colorInfo.value(d))}`)
        .attr('r', d => sizeInfo.scale(sizeInfo.value(d)));
  }

  updatePianoRoll();

  vis.updatePianoRoll = updatePianoRoll;

  // colorLegendG.call(colorLegend)
  //   .selectAll('.cell text')
  //     .attr('dy', '0.05em');
  sizeLegendG.call(sizeLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');

}
