
# docs-for

[![Build Status](https://travis-ci.org/tleen/docs-for.png?branch=master)](https://travis-ci.org/tleen/docs-for)

This node module is a response to a common need I found when developing node projects: needing to see the documentation of the other modules I was using. This was usually a multi-step process: open a browser, search for the module and find its homepage. **docs-for** tries to make it go faster.

**docs-for** accepts a string input and will search upwards in the directory structure for a [package.json](https://docs.npmjs.com/files/package.json) file. It will then look for the best module name match for the name given, find that module's package, use it to locate the most likely url for documentation and try to open it in a web browser.

Because of the naming conventions of modules the *best module name match* is (in order): exact match, tail match, head match, body match.

## Usage

## Command Line

This module loads two executables *docs-for* and the same but shorter named *docs4*. Load the docs for a package in your current node project if you are anywhere in the project hierarchy.

## example

```sh
docs4 lodash
# opens a browser window for https://lodash.com/

docs4 comm
# opens a browser window (tab) for https://github.com/tj/commander.js
```


# Module

Find the closest thing to a documentation url for a module in a local node project.

```javascript
var docs4 = require('docs-for');

docs4('grunt', function(err, url){
  console.log('The documentation url for grunt is:', url);
});


docs4({
  name : 'foo',
  from : '~/myprojects/foo-bar' // look in an alternative project 
}, function(err, url){
  if(err) console.error(err);
  else console.log('The documentation url for foo is:', url);
});
```
