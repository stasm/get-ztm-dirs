export function getStopName(stop) {
  const name = stop.cityCode === '--' ?
    stop.name : stop.name + ', ' + stop.cityName;
  return {
    [stop.id.toString()]: {
      name: name
    }
  };
}

export function getCentroid(stops) {
  // approximate the center of mass of the polygon given by all the stops 
  // in the stop gropu by calculating the centroid of vertices
  const sum = stops.reduce(
    (centroid, stop) => Object.assign(centroid, {
      x: centroid.x + parseFloat(stop.xGPS),
      y: centroid.y + parseFloat(stop.yGPS),
    }), { x: 0, y: 0 });
  return {
    x: sum.x / stops.length,
    y: sum.y / stops.length,
  };
}

export function getDirs(stops) {
  return {
    routes: stops.reduce(groupByDestination, {})
  };
}

function groupByDestination(dests, stop) {
  const dest = nameDestination(stop.destination);
  const prev = dests[dest] || { subs: [], lines: [] };
  return Object.assign(dests, {
    [dest]: {
      subs: prev.subs.concat(pad(stop.busStopId)),
      lines: prev.lines.concat(flattenLines(stop.lines, dest))
    }
  });
}

function flattenLines(lines, dest) {
  const flat = new Set();
  for (let type in lines) {
    lines[type].forEach(
      line => flat.add(nameLine(line)));
  }
  return Array.from(flat);
}

function pad(num) {
  return num < 10 ? '0' + num : num.toString();
}

function nameLine(line) {
  return line.replace('^', '');
}

function nameDestination(dest) {
  return dest.replace('Kier.: ', '');
}
