
const svg = d3.select("svg");

const xAxis = d3.axisBottom()
  .ticks(0);

const yAxis = d3.axisLeft()
  .ticks(5)
  .tickPadding(15);

const colorLegend = d3.legendColor()
  .classPrefix('color')
  .shape('circle');

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
  colorLegend.scale(colorInfo.scale);
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

  const colorLegendGEnter = gEnter.append('g').attr('class', 'color-legend');
  const colorLegendG = colorLegendGEnter
    .merge(g.select('.color-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 50)`);

  const sizeLegendGEnter = gEnter.append('g').attr('class', 'size-legend');
  const sizeLegendG = sizeLegendGEnter
    .merge(g.select('.size-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 250)`);

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

  colorLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(colorLegendG.select('legend-label'))
      .text(vis.causeColor.label);

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

  function updateView() {

    const xScale = xInfo.scale;
    const yScale = yInfo.scale;

    yAxisG.call(yAxis);

    const circles = marksG.selectAll('.mark').data(data);
    circles
      .enter().append('circle')
        .attr('class', 'mark')
        .attr('fill-opacity', 0.5)
      .merge(circles)
        .attr('cx', d => xScale(xInfo.value(d)))
        .attr('cy', d => yScale(yInfo.value(d)))
        .attr('fill', d => colorInfo.scale(colorInfo.value(d)))
        .attr('r', d => sizeInfo.scale(sizeInfo.value(d)));
  }

  updateView();

  vis.updatePiano = updateView;

  colorLegendG.call(colorLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');
  sizeLegendG.call(sizeLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');

}
