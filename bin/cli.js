'use strict';

var ztm = require('ztm-parser');

require('babel/register');
var handler = require('../src/handler');

ztm.getDataSourcesURLs().then(function(urls) {
  var url = urls.pop();
  ztm.parseZTMDataSource(url, handler);
}).catch(function(err) {
  console.log(err);
});
