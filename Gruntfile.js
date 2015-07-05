/*
 * @author: jldupont
 * 
 */
'use strict';

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-mocha-test');
    
    // Define the configuration for all the tasks
    grunt.initConfig({

    	pkg: grunt.file.readJSON("package.json"),
    	
    	mochaTest : {
        	test: {
        		options: {
        			//clearRequireCache: true,
        			//reporter: 'spec'
        		},
        		src: ['tests/**/*.js']
        		
        	} //test
    
    	}//mochaTest

    ,watch: {
        js: {
          options: {
            spawn: true,
            interrupt: true,
            debounceDelay: 100,
          },
          files: ['Gruntfile.js', '*.js', 'tests/*.js'],
          tasks: ['mochaTest']
        }
      }
    	
    });//initConfig

    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask("test", ["mochaTest"]);
    grunt.registerTask('default', ['test']);
};
