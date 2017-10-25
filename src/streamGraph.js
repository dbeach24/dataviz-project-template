
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

export default function (props) {
  const {
    data,
    yInfo,
    colorInfo,
    widthInfo,
    margin
  } = props;

  var layers = colorInfo.scale.domain();
  console.info(layers);

  var counts = getCounts(data, layers);

  var stack = d3.stack()
    .keys(layers)
    .offset(d3.stackOffsetWiggle);

  var layers0 = stack(counts);

  var area = d3.area()
    .y(d => yInfo.scale(d.data.date))
    .x0(d => widthInfo.scale(d[0]))
    .x1(d => widthInfo.scale(d[1]))
    .curve(d3.curveBasis);

  streamG.attr('transform', `translate(${margin.left}, ${margin.top})`);

  streamG.selectAll('path')
    .data(layers0)
    .enter()
      .append('path')
      .attr('d', area)
      .attr('fill', (d, i) => colorInfo.scale(layers[i]))
      .attr('stroke', 'white')
      .attr('opacity', 0.75);



}

