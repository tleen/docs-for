'use strict';

var docs4 = require('..');

docs4('grunt', function(err, url){
  console.log('The documentation url for grunt is:', url);
});


docs4({
  name : 'cha',
  from : __dirname // start looking from this examples dir
}, function(err, url){
  console.log('The documentation url for grunt-cafe-mocha is:', url);
});
