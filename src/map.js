
const svg = d3.select("svg");

const mapClipRect = d3.select("#mapClipRect");

const mapG = svg.append("g").attr("clip-path", "url(#mapClip)");

const projection = d3.geoEquirectangular();

const path = d3.geoPath()
	.projection(projection);

mapG.append("path")
    .attr("class", "graticule")
    .attr("d", path);

export default function (data, vis, margin) {

	var width = svg.attr('width') - margin.left - margin.right;
	var height = margin.height;

	mapG.attr('transform', `translate(${margin.left}, ${margin.top})`);

	mapClipRect
	    .attr("x", 0)
	    .attr("y", 0)
	    .attr("width", width)
	    .attr("height", height);

	var [lmin, lmax] = vis.longitude.scale.domain();

	projection
	    //.scale(height / Math.PI)
	    .scale((width / (2*Math.PI)) / ((lmax-lmin)/360))
	    .translate([width / 2, height / 2 + 75]);

	d3.json("world-50m.json", function(error, world) {
	  if (error) throw error;

	  mapG.insert("path", ".graticule")
	      .datum(topojson.feature(world, world.objects.land))
	      .attr("class", "land")
	      .attr("d", path);

	  mapG.insert("path", ".graticule")
	      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
	      .attr("class", "boundary")
	      .attr("d", path);
	});

	vis.mapG = mapG;
	vis.mapProjection = projection;

}
