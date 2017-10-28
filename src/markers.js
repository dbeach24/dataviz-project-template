
export const markerInfo = [
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

function newg(parent, x, y, s) {
  return parent.append('g')
      .attr('transform', `matrix(${s}, 0, 0, ${s}, ${x}, ${y})`);
}

export function drowning(parent, cx, cy, s) {
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

export function exposure(parent, cx, cy, s) {
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

export function vehicular(parent, cx, cy, s) {
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

export function violence(parent, cx, cy, s) {
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

export function medical(parent, cx, cy, s) {
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

export function unknown(parent, cx, cy, s) {
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