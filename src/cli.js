#!/usr/bin/env node
'use strict';

import minimist from 'minimist';
import { getRemote, getLocal, print } from './main';

const argv = minimist(process.argv.slice(2), {
  string: ['local'],
  alias: {
    date: 'd',
    help: 'h',
    local: 'l',
  },
  default: {
    date: new Date(),
  }
});

if (argv.help) {
  console.log();
  console.log('  Usage: get-ztm-dirs [OPTIONS]');
  console.log();
  console.log('  Parse the ZTM schedules into an object of line directions.');
  console.log('  DATE can be an RFC2822 or ISO 8601-formatted date, e.g.:');
  console.log();
  console.log('        2015-08-24');
  console.log('        Aug 24, 2015');
  console.log();
  console.log('  Options:');
  console.log();
  console.log('        -h, --help           output usage information');
  console.log('        -d, --date DATE      fetch schedules from this date');
  console.log('        -l, --local FILE     use a local db file');
  console.log();
  process.exit();
}

const data = argv.local ?
  getLocal(argv.local) :
  getRemote(argv.date);

  data
  .then(print)
  .catch(e => console.error(e.stack));
