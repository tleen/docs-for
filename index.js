'use strict';

var fs = require('fs-extra'),
find = require('fs-find-root'),
path = require('path'),
_ = require('lodash');

module.exports = function(options, callback){

  if(_.isString(options)) options = {name : options};

  var args = _.defaults({}, options, {
    'from' : process.cwd()
  });

  var name = args.name;

  if(_.isEmpty(name)) return callback(new Error('Name of module is required'));
  name = name.toLowerCase();

  // look up from current dir for package.json
  find.file('package.json', args.from, function(err, found){

    if(err) return callback(err);
    if(_.isNull(found)) return callback(new Error('Unable to find "package.json"'));

    fs.readJson(found, function(err, pkg){

      if(err) return callback(err);

      var modules = _.chain({})
	.merge(pkg.dependencies, pkg.devDependencies)
	.keys()
	.map(function(s){ return s.toLowerCase(); })
	.sort()
	.valueOf();

      if(modules.length === 0) return callback(new Error('The package.json file has no dependent modules'));
      
      // search through modules:
      // contains name 
      modules = _.filter(modules, function(m){ return (m.indexOf(name) !== -1); });      
      // then index in results that are:
      var index = (function(){

	var length = modules.length;

	if(length === 0) return undefined;

	var i = 0;
	// 0. only
	if(length === 1) return i;

	// 1. exact match
	for(i = 0; i < length; i++){
	  if(name == modules[i]) return i;
	}
	// 2. tail match
	for(i = 0; i < length; i++){
	  if(_.endsWith(modules[i], name)) return i;
	}
	// 3. head match
	for(i = 0; i < length; i++){
	  if(_.startsWith(modules[i], name)) return i;
	}
	// 4. any match
	var regex = new RegExp(name);
	for(i = 0; i < length; i++){
	  if(regex.test(modules[i])) return i;
	}

	return undefined;
      })();

      if(index === undefined) return callback(new Error('No modules match "' + args.name + '"'));
  
      var moduleName = modules[index];
      var modulePackage = path.resolve(
	path.dirname(found),
	'./node_modules',
	moduleName,
	'package.json');

      fs.readJson(modulePackage, function(err, pkg){
	if(err) return callback(err);

	var options = [];
	options.push(pkg.homepage);
	options.push(_.isObject(pkg.repository) ? pkg.repository.url : pkg.repository);
	var target = _.filter(options).shift();

	if(_.isEmpty(target)) return callback(new Error('No documentish url found for "' + moduleName + '"'));
	return callback(null, target);
      });
    });

  });
};

