'use strict';

export function createHandler() {
  const routes = {};
  const stops = {};
  const lines = {
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
        Object.assign(stops, {
          [stop.id.toString()]: {
            name: name
          }
        });
      }
    },
    onGetBusStops: function(res) {
      for (let id in res) {
        Object.assign(
          stops[id], getCentroid(res[id]), getDirs(res[id]));
      }
    },
    onGetSchedules: function(res) {
      for (let line of res.schedule) {
        // console.log(lines[line.routes[0].stops[0].id.slice(0,4)]);
        Object.assign(lines, ...(line.routes.map(
          route => getDirectionsForLine(line.id, route))));
        Object.assign(routes, ...(line.routes.map(
          route => getRoutesForLine(line.id, route))));
      }
    },
    get lines() {
      return lines;
    },
    get stops() {
      for (let stopid in stops) {
        const stoproutes = stops[stopid].routes;
        for (let dest in stoproutes) {
          const samedest = stoproutes[dest];
          const subs = samedest.subs.map(sub => stopid + sub);
          samedest.dirs = [];
          for (let line of samedest.lines) {
            const dir = getDirForRoute(routes, line, subs);
            if (dir) {
              samedest.dirs.push(dir);
            }
          }
          delete samedest.subs;
          delete samedest.lines;
        }
      }
      return stops;
    }
  };
};

function includes(arr, elem) {
  return arr.indexOf(elem) > -1;
}

function getDirForRoute(routes, line, subs) {
  const a = routes[line + 'A'];
  if (a && subs.some(sub => includes(a, sub))) {
    return line + 'A';
  }

  const b = routes[line + 'B'];
  if (b && subs.some(sub => includes(b, sub))) {
    return line + 'B';
  }

  return null;
}

function getRoutesForLine(name, route) {
  return {
    [name + route.dir]: route.stops.map(
      stop => stop.id)
  };
}

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

function pad(num) {
  return num < 10 ? '0' + num : num.toString();
}

function getDirs(stops) {
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

function nameLine(line) {
  return line.replace('^', '');
}

function nameDestination(dest) {
  return dest.replace('Kier.: ', '');
}
