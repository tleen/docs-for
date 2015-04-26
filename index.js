'use strict';

/*
* docs-for - find (and open in a browser) the docs for a module in your node project
* @exports docs-for
* @version v0.0.2
* @author Tom Leen <tl@thomasleen.com>
* @link https://github.com/tleen/docs-for
* @license MIT
*/


var fs = require('fs-extra'),
find = require('fs-find-root'),
path = require('path'),
_ = require('lodash');

/**
* The modules function should seek the documentation url in an upwards package.json file.
* @param options {Object || string} 
*   {name : module to search for, from : directory location to start searching from} 
*   if only string, will use as {name}, empty from assumes cwd.
*   name may be partial match
*/ 
module.exports = function(options, callback){


  // setup defaults, if options is a string use as name in options object
  if(_.isString(options)) options = {name : options};

  var args = _.defaults({}, options, {
    'from' : process.cwd()
  });

  var name = args.name;

  if(_.isEmpty(name)) return callback(new Error('Name of module is required'));

  // normalize everything to lower case
  name = name.toLowerCase();

  // look up from current dir for package.json
  find.file('package.json', args.from, function(err, found){

    if(err) return callback(err);
    if(_.isNull(found)) return callback(new Error('Unable to find "package.json"'));

    // if we found the package file, look for module match within it
    fs.readJson(found, function(err, pkg){

      if(err) return callback(err);

      // merge dev and regular dependencies, get their keys and normalize all to lowercase
      var modules = _.chain({})
	.merge(pkg.dependencies, pkg.devDependencies)
	.keys()
	.map(function(s){ return s.toLowerCase(); })
	.sort()
	.valueOf();

      if(modules.length === 0) return callback(new Error('The package.json file has no dependent modules'));
      
      // Get rid of any module that does not at least contain the search term
      modules = _.filter(modules, function(m){ return (m.indexOf(name) !== -1); });      

      // Search through the modules that match name to find the best match, 
      // return the array index of the match or undefined if no match
      var index = (function(){

	var length = modules.length;

	// 0. There were no matches
	if(length === 0) return undefined;

	var i = 0;
	// 1. There was only one match
	if(length === 1) return i;

	// for all the rest matches first in alphabetical order that meets criteria
	// 2. Look for an exact match
	for(i = 0; i < length; i++){
	  if(name == modules[i]) return i;
	}
	// 3. Look for a match to the *end* of the module name
	for(i = 0; i < length; i++){
	  if(_.endsWith(modules[i], name)) return i;
	}
	// 4. Look for a match with the start of the module name
	for(i = 0; i < length; i++){
	  if(_.startsWith(modules[i], name)) return i;
	}
	// 5. Look for any match inside of module name
	var regex = new RegExp(name);
	for(i = 0; i < length; i++){
	  if(regex.test(modules[i])) return i;
	}

	return undefined;
      })();

      if(index === undefined) return callback(new Error('No modules match "' + args.name + '"'));
  
      var moduleName = modules[index];

      // Now look for the module's own package.json to find the documentation url
      // get location relative to this projects own package.json (found)
      var modulePackage = path.resolve(
	path.dirname(found),
	'./node_modules',
	moduleName,
	'package.json');

      // read in module's package.json
      fs.readJson(modulePackage, function(err, pkg){
	if(err) return callback(err);

	// look in three places in package.json in order:
	// pkg.homepage, repository object .url, or just repository as string
	var options = [];
	options.push(pkg.homepage);
	options.push(_.isObject(pkg.repository) ? pkg.repository.url : pkg.repository);
	// remove all empty (falsy) values and get the first one that is not
	var target = _.filter(options).shift();

	// if we have a url return it, else error out
	if(_.isEmpty(target)) return callback(new Error('No documentish url found for "' + moduleName + '"'));
	return callback(null, target);
      });
    });

  });
};

