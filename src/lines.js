export function getDirectionsForLine(name, route) {
  return {
    [name + route.dir]: {
      name: name + ' → ' + route.end.name
    }
  };
}

export function getInfoForLine(name, route) {
  return {
    [name + route.dir]: route.stops.map(
      stop => stop.id)
  };
}

const retram = /TRAMWAJOWA/;
const reskm = /KOLEI MIEJSKIEJ/;
const rewkd = /KOLEI DOJAZDOWEJ/;
const rekm = /KOLEI MAZOWIECKICH/;

export function getLineType(types, line) {
  const type = types[line.type];
  const shorttype = retram.test(type) ?
    'tram' : reskm.test(type) ?
    'skm' : rewkd.test(type) ?
    'wkd' : rekm.test(type) ?
    'km' : 'bus';

  return {
    [line.id]: shorttype
  };
}
