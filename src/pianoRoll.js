
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
  .shapePadding(15)
  .classPrefix('size')
  .cells([50, 100, 200, 400, 800])
  .labels(['50', '100', '200', '400', '800']);

export default function (svg, props) {
  const {
    data,
    xInfo,
    yInfo,
    colorInfo,
    sizeInfo,
    margin
  } = props;

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

  const colorLegendGEnter = gEnter.append('g').attr('class', 'color-legend');
  const colorLegendG = colorLegendGEnter
    .merge(g.select('.color-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 50)`);

  const sizeLegendGEnter = gEnter.append('g').attr('class', 'size-legend');
  const sizeLegendG = sizeLegendGEnter
    .merge(g.select('.size-legend'))
      .attr('transform', `translate(${innerWidth + 60}, 250)`);

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
      .text(yInfo.label);

  colorLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(colorLegendG.select('legend-label'))
      .text(colorInfo.label);

  sizeLegendGEnter
    .append('text')
      .attr('class', 'legend-label')
      .attr('x', -30)
      .attr('y', -20)
    .merge(sizeLegendG.select('legend-label'))
      .text(sizeInfo.label);

  xInfo.scale
    .range([0, innerWidth]);

  yInfo.scale
    .range([innerHeight, 0])
    .nice();

  const circles = g.selectAll('.mark').data(data);
  circles
    .enter().append('circle')
      .attr('class', 'mark')
      .attr('fill-opacity', 0.5)
    .merge(circles)
      .attr('cx', d => xInfo.scale(xInfo.value(d)))
      .attr('cy', d => yInfo.scale(yInfo.value(d)))
      .attr('fill', d => colorInfo.scale(colorInfo.value(d)))
      .attr('r', d => sizeInfo.scale(sizeInfo.value(d)));

  xAxisG.call(xAxis);
  yAxisG.call(yAxis);
  colorLegendG.call(colorLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');
  sizeLegendG.call(sizeLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');
}
