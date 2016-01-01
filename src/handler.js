import { extendLines } from './fixtures';
import { getStopName, getCentroid, getDirs } from './stops';
import { getDirectionsForLine, getInfoForLine, getLineType } from './lines';
import { includes } from './util';

export function createHandler() {
  const info = {
    routes: {},
    types: {},
  };

  const stops = {};
  const lines = {};

  return {
    onGetBusStopsGroups: function(res) {
      for (let stop of res) {
        Object.assign(stops, getStopName(stop));
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
        Object.assign(lines, ...(line.routes.map(
          route => getDirectionsForLine(line.id, route))));

        Object.assign(info.routes, ...(line.routes.map(
          route => getInfoForLine(line.id, route))));
        Object.assign(info.types, getLineType(res.lineTypeNames, line));
      }
    },
    get lines() {
      return extendLines(lines);
    },
    get stops() {
      for (let stopid in stops) {
        const routes = stops[stopid].routes;
        for (let dest in routes) {
          const samedest = routes[dest];
          const subs = samedest.subs.map(sub => stopid + sub);
          samedest.dirs = [];
          samedest.types = getTypes(info.types, samedest.lines);
          for (let line of samedest.lines) {
            const dir = getDirForRoute(info.routes, line, subs);
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

function getTypes(types, lines) {
  const uniques = lines.reduce(
    (seq, cur) => seq.add(types[cur]), new Set());
  return Array.from(uniques);
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
