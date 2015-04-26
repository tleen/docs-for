'use strict';

module.exports = function(grunt){


  grunt.initConfig({
    
    jshint : {
      all : {
	files : {
	  src : [
	    './package.json',
	    './Gruntfile.js',
	    './index.js',
	    './bin/docs-for',
	    './examples/*.js',
	    './test/index.js']
	},
	options : {
	  expr : true,
	  mocha : true,
	  node : true
	}
      }
    },

    test: {
      options : {
	reporter : 'spec',
        require : ['should'],
        ui : 'bdd'
      },
      files : ['test/index.js']
    }
  }
);

  grunt.loadNpmTasks('grunt-cafe-mocha');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.renameTask('cafemocha', 'test');

  grunt.registerTask('default', ['jshint', 'test']);


};
