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
        Object.assign(data[id], getCenterOfMass(res[id]));
      }
    },
    onGetSchedules: function(res) {
      for (let line of res.schedule) {
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

function getCenterOfMass(stops) {
  return {
    x: 52,
    y: 21
  };
}
