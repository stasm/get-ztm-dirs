'use strict';

const dirs = {
  M1A: 'M1 → Kabaty',
  M1B: 'M1 → Młociny',
  M2A: 'M2 → Dworzec Wileński',
  M2B: 'M2 → Rondo Daszyńskiego',
};


export default {
  onGetSchedules: function(res) {
    print(
      res.schedule.reduce(
        getDirections, dirs));
  },
};

function print(dirs) {
  console.log(
    'dirs = ' + JSON.stringify(dirs, null, 2));
}

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
