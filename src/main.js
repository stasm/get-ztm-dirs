'use strict';

import ztm from 'ztm-parser';
import { createHandler } from './handler';
import { getLatestRelevant } from './picker';

const handler = createHandler();

const noop = {
  log: () => ({})
};

export function print() {
  console.log(
    'ztm = ' + JSON.stringify(handler.data, null, 2) + ';');
}

export function getLocal(path) {
  return ztm.parseZTMDataFile(path, handler);
}

export function getRemote(data) {
  return ztm.getDataSourcesURLs()
    .then(urls => picker.getLatestRelevant(urls, date))
    .then(url => ztm.parseZTMDataSource(url, handler));
}
