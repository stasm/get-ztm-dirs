'use strict';

require('date-utils');

export function getLatestRelevant(urls, date) {
  const pos = urls.indexOf(formatURL(date));
  return pos > 0 ?
    urls[pos] :
    getLatestRelevant(urls, date.remove({days: 1}));
}

function formatURL(date) {
  return `ftp://rozklady.ztm.waw.pl/RA${date.toFormat('YYMMDD')}.7z`;
}
