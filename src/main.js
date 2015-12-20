'use strict';

import ztm from 'ztm-parser';
import { createHandler } from './handler';
import { getLatestRelevant } from './picker';

const handler = createHandler();

const noop = {
  log: () => ({})
};

export function print() {
  console.log('ztm = {');
  console.log('  lines: ' + JSON.stringify(handler.lines, null, 2) + ',');
  console.log('  stops: ' + JSON.stringify(handler.stops, null, 2));
  console.log('};');
}

export function getLocal(path) {
  return ztm.parseZTMDataFile(path, handler);
}

export function getRemote(data) {
  return ztm.getDataSourcesURLs()
    .then(urls => picker.getLatestRelevant(urls, date))
    .then(url => ztm.parseZTMDataSource(url, handler));
}
