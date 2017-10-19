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
    Object(__WEBPACK_IMPORTED_MODULE_0__pianoRoll__["a" /* default */])(svg, {
      data, xInfo, yInfo, colorInfo, sizeInfo,
      margin
    });
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

/* harmony default export */ __webpack_exports__["a"] = (function (svg, props) {
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
});


/***/ })
/******/ ]);