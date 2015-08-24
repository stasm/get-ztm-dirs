'use strict';

var argv = require('minimist')(process.argv.slice(2));

if (argv.h || argv.help) {
  console.log();
  console.log('  Usage: get-ztm-dirs [DATE]');
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
  console.log();
  process.exit();
}

var date = argv._.length ?
  new Date(argv._.join(' ')) :
  new Date();

var ztm = require('ztm-parser');

require('babel/register');
var handler = require('../src/handler');
var picker = require('../src/picker');


ztm.getDataSourcesURLs().then(function(urls) {
  var url = picker.getLatestRelevant(urls, date);
  ztm.parseZTMDataSource(url, handler);
}).catch(function(err) {
  console.log(err);
});
