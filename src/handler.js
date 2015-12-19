'use strict';

export function createHandler() {
  const data = {
    M1A: 'M1 → Kabaty',
    M1B: 'M1 → Młociny',
    M2A: 'M2 → Dworzec Wileński',
    M2B: 'M2 → Rondo Daszyńskiego',
    X0A: '666 → Plac Testerów'
  };

  return {
    onGetBusStopsGroups: function(res) {
      for (let stop of res) {
        const name = stop.cityCode === '--' ?
          stop.name : stop.name + ', ' + stop.cityName;
        Object.assign(data, {
          [stop.id.toString()]: {
            name: name
          }
        });
      }
    },
    onGetBusStops: function(res) {
      for (let id in res) {
        Object.assign(data[id], getCentroid(res[id]), getLines(res[id]));
        // console.log(data[id]);
      }
    },
    onGetSchedules: function(res) {
      for (let line of res.schedule) {
        // console.log(data[line.routes[0].stops[0].id.slice(0,4)]);
        Object.assign(data, ...(line.routes.map(
          route => getDirectionsForLine(line.id, route))));
      }
    },
    get data() {
      return data;
    }
  };
};

function getDirectionsForLine(name, route) {
  return {
    [name + route.dir]: {
      name: name + ' → ' + route.end.name
    }
  };
}

function getCentroid(stops) {
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

function getLines(stops) {
  return {
    lines: stops.reduce(
      (seq, cur) => seq.concat(
        flattenLines(cur.lines, cur.destination)), [])
  };
}

function flattenLines(lines, dest) {
  const flat = new Set();
  for (let type in lines) {
    lines[type].forEach(
      line => flat.add(makeName(line, dest)));
  }
  return Array.from(flat);
}

function makeName(line, dest) {
  return line.replace('^', '') + ' → ' + dest.replace('Kier.: ', '');
}
