/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pianoRoll__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__streamGraph__ = __webpack_require__(3);



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
    Object(__WEBPACK_IMPORTED_MODULE_0__pianoRoll__["a" /* default */])(data, vis, pianoMargin);
    Object(__WEBPACK_IMPORTED_MODULE_1__streamGraph__["a" /* default */])(data, vis, streamMargin);

  }

  // Draw for the first time to initialize.
  render();

  // Redraw based on the new size whenever the browser window is resized.
  window.addEventListener('resize', render);
});


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__markers__ = __webpack_require__(2);


const svg = d3.select("svg");

const xAxis = d3.axisBottom()
  .ticks(0);

const yAxis = d3.axisLeft()
  .ticks(5)
  .tickPadding(15);

const colorLegendG = svg.append("g");

const tooltip = d3.select("#tooltip");

const formatDate = d3.timeFormat("%e %b %Y");

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

  for(var i in __WEBPACK_IMPORTED_MODULE_0__markers__["a" /* markerInfo */]) {
    var info = __WEBPACK_IMPORTED_MODULE_0__markers__["a" /* markerInfo */][i];

    var bgarea = g.append('rect')
        .attr('x', -s/2 - 10)
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
        .classed('legend-value', true);

    var hoverarea = g.append('rect')
        .attr('x', -s/2 - 10)
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
        svg.selectAll('.highlightable').classed("greyout", true);
        svg.selectAll("." + info.class).classed("greyout", false).classed("highlight", true);
      })
      .on("mouseout", () => {
        bgarea.attr('fill', null).attr('opacity', 0.0);
        svg.selectAll(".highlightable").classed("greyout", false).classed("highlight", false);
      });
}


const sizeLegend = d3.legendSize()
  .shape('circle')
  .shapePadding(10)
  .classPrefix('size')
  .cells([50, 100, 200, 400, 600])
  .labels(['50', '100', '200', '400', '600']);

/* harmony default export */ __webpack_exports__["a"] = (function (data, vis, margin) {


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

  const marksGEnter = gEnter.append('g').attr('class', 'marksg');
  const marksG = marksGEnter.merge(g.select('.marksg'));


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
        .attr('r', d => sizeInfo.scale(sizeInfo.value(d)))
        .on("mouseover", function(d) {
          const mark = d3.select(this);
          const x = xScale(xInfo.value(d)) + margin.left;
          const y = yScale(yInfo.value(d)) + margin.top;
          mark
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .style("opacity", "1.0", "important");
          tooltip
            .style("left", (x - 150) + "px")
            .style("top", (y + 30) + "px")
            .style("opacity", 0.9);
          d3.select("#tooltip-date").html(formatDate(d.date));
          d3.select("#tooltip-dead").html(d.dead);
          d3.select("#tooltip-missing").html(d.missing);
          d3.select("#tooltip-region").html(d.incident_region);
          d3.select("#tooltip-cause").html(d.cause_of_death);
          d3.select("#tooltip-nationality").html(d.nationalities.join(", "));
          d3.select("#tooltip-origin").html(d.region_origin);
          d3.select("#tooltip-source").html(d.source);
          if(d.reliability == "Verified") {
            d3.select("#tooltip-verified").html("Verified").attr("class", "verified");
          } else if(d.reliability == "Partially Verified") {
            d3.select("#tooltip-verified").html("Partially Verified").attr("class", "part-verified");
          } else {
            d3.select("#tooltip-verified").html("Unverified").attr("class", "unverified");
          }
        })
        .on("mouseout", function(d) {
          const mark = d3.select(this);
          mark
            .attr("stroke", null)
            .attr("stroke-width", null)
            .style("opacity", null);
          tooltip
            .style("opacity", 0.0);
        });
  }

  updatePianoRoll();

  vis.updatePianoRoll = updatePianoRoll;

  sizeLegendG.call(sizeLegend)
    .selectAll('.cell text')
      .attr('dy', '0.05em');

});


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export drowning */
/* unused harmony export exposure */
/* unused harmony export vehicular */
/* unused harmony export violence */
/* unused harmony export medical */
/* unused harmony export unknown */

const markerInfo = [
  {
     label: "Drowning",
     marker: drowning,
     class: 'drowning'
  },
  {
     label: "Exposure",
     marker: exposure,
     class: 'exposure'
  },
  {
     label: "Vehicular",
     marker: vehicular,
     class: 'vehicular'
  },
  {
     label: "Violence",
     marker: violence,
     class: 'violence'
  },
  {
     label: "Medical",
     marker: medical,
     class: 'medical'
  },
  {
     label: "Unknown",
     marker: unknown,
     class: 'unknown'
  },

];
/* harmony export (immutable) */ __webpack_exports__["a"] = markerInfo;


function newg(parent, x, y, s) {
  return parent.append('g')
      .attr('transform', `matrix(${s}, 0, 0, ${s}, ${x}, ${y})`);
}

function drowning(parent, cx, cy, s) {
  const myscale = 120;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'drowning');
  g.append("path")
      .attr('d', `
				  M 0 34
				  A 22 22 0 0 0 20 20
          A 22 22 0 0 0 60 20
          A 22 22 0 0 0 100 20
          A 22 22 0 0 0 120 34
					L 120 50
          A 22 22 0 0 1 80 50
          A 22 22 0 0 1 40 50
					A 22 22 0 0 1 0 50
          L 0 34
          M 0 89
				  A 33 33 0 0 0 30 70
          A 33 33 0 0 0 90 70
          A 33 33 0 0 0 120 89
					L 120 120
					L 0 120
          L 0 85
       `);
  return g;
}

function exposure(parent, cx, cy, s) {
  const myscale = 120;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'exposure');
  g.append('circle')
    .attr('cx', 60)
    .attr('cy', 60)
    .attr('r', 30);
  for(var theta = 0; theta < 360; theta += (360/5)) {
    var t = (theta*Math.PI) / 180;
    g.append('circle')
      .attr('cx', 60+45*Math.cos(t))
      .attr('cy', 60+45*Math.sin(t))
      .attr('r', 10);
  }
  return g;
}

function vehicular(parent, cx, cy, s) {
  const myscale = 120;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'vehicular');
  g.append('rect')
      .attr('x', 0).attr('y', 20).attr('width', 80).attr('height', 50);
	g.append('path').attr('d', `
				M 85 70
        L 120 70
        A 30 30 0 0 0 85 40
        L 85 40
        L 85 70`)
  g.append('circle')
      .attr('cx', 12).attr('cy', 85).attr('r', 12);
  g.append('circle')
      .attr('cx', 68).attr('cy', 85).attr('r', 12);
  g.append('circle')
      .attr('cx', 105).attr('cy', 85).attr('r', 12);
  return g;
}

function violence(parent, cx, cy, s) {
  const myscale = 100;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'violence');
	g.append('path').attr('d', `
			M 10 20
      L 100 20
			A 30 30 0 0 1 100 40
      L 45 40
      A 13 13 0 0 1 30 55
      L 30 80
      L 0 80
      A 150 150 0 0 0 0 20
  `);
  return g;
}

function roundrectpath(x, y, w, h, r) {
  return `
      M ${x} ${y+r}
      A ${r} ${r} 0 0 1 ${x+r} ${y}
      L ${x+w-r} ${y}
      A ${r} ${r} 0 0 1 ${x+w} ${y+r}
      L ${x+w} ${y+h-r}
      A ${r} ${r} 0 0 1 ${x+w-r} ${y+h}
      L ${x+r} ${y+h}
      A ${r} ${r} 0 0 1 ${x} ${y+h-r}
      L ${x} ${y+r}
  `      
}

function medical(parent, cx, cy, s) {
  const myscale = 120;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'medical');
  g.append('path').attr('d', roundrectpath(0, 30, 120, 80, 15));
  g.append('rect').attr('x', 33).attr('y', 60).attr('width', 54).attr('height', 20).attr('fill','white');
  g.append('rect').attr('x', 50).attr('y', 43).attr('width', 20).attr('height', 54).attr('fill','white');
  g.append('path').attr('d', `
      M 35 25
      A 25 25 0 0 1 85 25
      L 75 25
      A 15 15 0 0 0 45 25
`);
  return g;
}

function unknown(parent, cx, cy, s) {
  const myscale = 120;
  var g = newg(parent, cx-s/2, cy-s/2, s/myscale).attr('class', 'unknown');
  g.append('circle').attr('cx', 60).attr('cy', 60).attr('r', 60);
  g.append('path').attr('d', `
    M 25 50
    A 30 25 0 0 1 95 50
    C 90 80 68 61 67 85
    L 53 85
    C 52 55 80 65 80 50
    A 20 15 0 0 0 40 50
		L 25 50
  `).attr('fill', 'white');
  g.append('circle').attr('cx', 60).attr('cy', 100).attr('r', 8).attr('fill', 'white');
  return g;
}

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

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

/* harmony default export */ __webpack_exports__["a"] = (function (data, vis, margin) {

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

  function updateStream() {

    dataG.selectAll('path')
      .data(stack(counts))
      .enter()
        .append('path')
        .attr('d', area)
        .attr('class', (d, i) => colorInfo.scale(layers[i]))
        .classed('highlightable', true)
        .attr('stroke', 'white')
        .attr('opacity', 0.75);

  }

  updateStream();
  vis.updateStream = updateStream;

  brush
    .extent([
      [-widthInfo.scale.range()[1]/2, yInfo.scale.range()[1]],
      [widthInfo.scale.range()[1]/2, yInfo.scale.range()[0]]
    ])
    .on("start brush", brushed);

  brushG.call(brush);

  const zoom = vis.time.zoom;

  zoom
    .extent([[0, 0], [0, innerHeight]])
    .translateExtent([[0, 0], [0, innerHeight]])
    .on("zoom", zoomed);


  function brushed() {

    // ignore brush-by-zoom
    if(d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return;

    const y = vis.time.scale;
    const y2 = vis.timeFixed.scale;
    const s = d3.event.selection || y2.range();

    var [ya, yb] = s.map(y2.invert, y2);

    y.domain([yb, ya]);
    svg.select(".zoom").call(
      zoom.transform,
      d3.zoomIdentity
        .scale(innerHeight / (s[1] - s[0]))
        .translate(0, -s[0])
    );

    vis.updatePianoRoll();
  }

 function zoomed() {
    // ignore zoom-by-brush
    if(d3.event.sourceEvent && d3.event.sourceEvent.type == "brush") return;
    const t = d3.event.transform;
    const zoomYscale = t.rescaleY(yInfo.scale);

    vis.time.scale.domain(t.rescaleY(vis.timeFixed.scale).domain());
    var [ya, yb] = vis.time.scale.range().map(t.invertY, t);
    brushG.call(brush.move, [yb, ya]);
    vis.updatePianoRoll();
  }

});



/***/ })
/******/ ]);