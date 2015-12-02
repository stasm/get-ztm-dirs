'use strict';

export default function createHandler() {
  const names = {};
  const coords = {};
  const data = {
    stops: {},
    linedirs: {
      M1A: 'M1 → Kabaty',
      M1B: 'M1 → Młociny',
      M2A: 'M2 → Dworzec Wileński',
      M2B: 'M2 → Rondo Daszyńskiego',
      X0A: '666 → Plac Testerów'
    },
  };

  return {
    onGetBusStopsGroups: function(res) {
      for (let stop of res) {
        const name = stop.cityCode === '--' ?
          stop.name : stop.name + ', ' + stop.cityName;
        Object.assign(data.stops, {
          [stop.id.toString()]: {
            name: name
          }
        });
      }
    },
    onGetBusStops: function(res) {
      for (let id in res) {
        Object.assign(data.stops[id], getCenterOfMass(res[id]));
      }
    },
    onGetSchedules: function(res) {
      data.linedirs = res.schedule.reduce(
        getDirections, data.linedirs);
    },
    get data() {
      return data;
    }
  };
};

function getDirections(seq, cur) {
  return Object.assign(
    seq, ...cur.routes.map(
      route => getDirectionsForLine(cur.id, route)));
}

function getDirectionsForLine(id, route) {
  return {
    [id + route.dir]: id + ' → ' + route.end.name,
  };
}

function getCenterOfMass(stops) {
  return {
    x: 52,
    y: 21
  };
}
