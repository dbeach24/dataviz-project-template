
const startDate = new Date(2014, 0, 1);
const endDate = new Date(2017, 6, 1);

function dateidx(date) {
  return date.getYear() * 12 + date.getMonth();
}

function getDates() {
  var date = new Date(startDate);
  date.setDate(15);
  var result = [];
  var i = 0;
  while(date < endDate) {
    result[i++] = new Date(date);
    date.setMonth(date.getMonth() + 1);
  }
  return result;
}

function getCounts(data, layers) {
  var items = getDates().map(d => {
    var item = {date: d};
    layers.forEach(l => {item[l] = 0});
    return item;
  });
  var itemMap = {};
  items.forEach(item => {itemMap[dateidx(item.date)] = item});
  data
    .filter(d => d.date != null)
    .forEach(d => {
      var item = itemMap[dateidx(d.date)];
      if(!item) { return; }
      const ncauses = d.causes.length;
    const value = (d.dead + d.missing) / ncauses;
    d.causes.forEach(c => (item[c] += value));
  });
  return items;
}

const svg = d3.select("svg");

const streamG = svg.append("g");
const dataG = streamG.append("g");
const brushG = streamG.append("g");

const brush = d3.brushY();

export default function (data, vis, margin) {

  const innerHeight = svg.attr('height') - margin.top - margin.bottom;

  const yInfo = vis.timeFixed;
  const colorInfo = vis.causeColor;
  const widthInfo = vis.countSummary;

  yInfo.scale.range([innerHeight, 0]).nice();

  var layers = colorInfo.scale.domain();

  var counts = getCounts(data, layers);

  var stack = d3.stack()
    .keys(layers)
    .offset(d3.stackOffsetWiggle);

  var area = d3.area()
    .y(d => yInfo.scale(d.data.date))
    .x0(d => widthInfo.scale(d[0]))
    .x1(d => widthInfo.scale(d[1]))
    .curve(d3.curveBasis);

  streamG.attr('transform', `translate(${margin.left}, ${margin.top})`);

  dataG.selectAll('path')
    .data(stack(counts))
    .enter()
      .append('path')
      .attr('d', area)
      .attr('fill', (d, i) => colorInfo.scale(layers[i]))
      .attr('stroke', 'white')
      .attr('opacity', 0.75);

  brush
    .extent([
      [-widthInfo.scale.range()[1]/2, yInfo.scale.range()[1]],
      [widthInfo.scale.range()[1]/2, yInfo.scale.range()[0]]
    ])
    .on("start brush", brushed);

  brushG.call(brush);

  function brushed() {

    // ignore brush-by-zoom
    if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

    const y = vis.time.scale;
    const y2 = vis.timeFixed.scale;
    const s = d3.event.selection || y2.range();

    const zoom = vis.time.zoom;

    var [ya, yb] = s.map(y2.invert, y2);

    y.domain([yb, ya]);
    svg.select(".zoom").call(
      zoom.transform,
      d3.zoomIdentity
        .scale(innerHeight / (s[1] - s[0]))
        .translate(0, -s[0])
    );
  }

  // function zoomed() {

  //   // ignore zoom-by-brush
  //   if(d3.event.sourceEvent && d3.event.sourceEvent.type == "brush") return;

  //   const t = d3.event.transform;
  //   y.domain(t.rescaleY(y2).domain());
  //   brushG.call(brush.move, y.range().map(t.invertY, t));
  // }


}

