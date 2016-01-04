const extraLines = {
  M1A: {
    name: 'M1 → KABATY'
  },
  M1B: {
    name: 'M1 → MŁOCINY'
  },
  M2A: {
    name: 'M2 → DWORZEC WILEŃSKI'
  },
  M2B: {
    name: 'M2 → RONDO DASZYŃSKIEGO'
  },
  X0A: {
    name: '666 → PLAC TESTERÓW'
  },
};

export function extendLines(lines) {
  return Object.assign(lines, extraLines);
};

const extraRoutes = {
  m1: [
    'METRO MŁOCINY',
    'METRO WAWRZYSZEW',
    'METRO STARE BIELANY',
    'METRO SŁODOWIEC',
    'METRO MARYMONT',
    'PL.WILSONA',
    'DW.GDAŃSKI',
    'METRO RATUSZ ARSENAŁ',
    'METRO ŚWIĘTOKRZYSKA',
    'CENTRUM',
    'METRO POLITECHNIKA',
    'METRO POLE MOKOTOWSKIE',
    'METRO RACŁAWICKA',
    'METRO WIERZBNO',
    'METRO WILANOWSKA',
    'METRO SŁUŻEW',
    'METRO URSYNÓW',
    'METRO STOKŁOSY',
    'METRO IMIELIN',
    'METRO NATOLIN',
    'METRO KABATY',
  ],
  m2: [
    'RONDO DASZYŃSKIEGO',
    'RONDO ONZ',
    'METRO ŚWIĘTOKRZYSKA',
    'NOWY ŚWIAT',
    'METRO CENTRUM NAUKI KOPERNIK',
    'METRO STADION NARODOWY',
    'DW.WILEŃSKI',
  ],
};

const extraStops = {
  '0001': {
    name: 'METRO SŁODOWIEC',
    x: null,
    y: null,
    routes: {}
  }
};

function findByName(stops, name) {
  for (const id in stops) {
    const stop = stops[id];
    if (stop.name === name) {
      return stop;
    }
  }
}

export function extendStops(stops) {
  stops = Object.assign(stops, extraStops);

  for (const m in extraRoutes) {
    const dirs = [
      [(m + 'a').toUpperCase(), 1],
      [(m + 'b').toUpperCase(), -1]
    ];
    const stations = extraRoutes[m];

    for (const [index, name] of stations.entries()) {
      const stop = findByName(stops, name);
      if (!stop) {
        console.error('Missing stop: ', name);
        continue;
      }

      const routes = stop.routes;
      for (const [dir, offset] of dirs) {
        const next = stations[index + offset];
        if (!routes[next]) {
          routes[next] = {
            dirs: [],
            types: []
          };
        }
        routes[next].dirs.push(dir);
        routes[next].types.push('metro');
      }
    }
  }
  return stops;
}
