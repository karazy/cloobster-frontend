'use strict';	

module.exports = function(grunt) {

	//automatically load grunt tasks
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		settings: {
			directory: {
				src: '.'
			}
		},
		connect: {
	      options: {
	        port: 9000,
	        // Change this to '0.0.0.0' to access the server from outside.
	        hostname: '0.0.0.0',
	        livereload: 35729
	      },
	      livereload: {
	        options: {
	        	open: false,
	        	base: [
	        	'<%= settings.directory.src %>'
	        	]
	        }
	      }
	      // test: {
	      //   options: {
	      //     port: 9001,
	      //     base: [
	      //       '.tmp',
	      //       'test',
	      //       '<%= yeoman.app %>'
	      //     ]
	      //   }
	      // },
	      // dist: {
	      //   options: {
	      //     base: '<%= yeoman.dist %>'
	      //   }
	      // }
	    },

	    // Watches files for changes and runs tasks based on the changed files

    	watch: {
		    js: {
		        files: ['<%= settings.directory.src %>'],
		        tasks: [
		        	// 'debug',
		        	// 'copy:dev', 
		        	// 'bgShell:getVersion', 
		        	// 'replace:development',
		        	// 'copy:resources',
		        	// 'copy:whitelabelSrc'
		        ],
		        options: {
		          livereload: true,
		          //spawn no child processes, needed to access options
		          spawn: false
		        }
		      },
		    // compass: {
		    //     files: ['<%= settings.directory.src %>/res/<%= grunt.option("whitelabel") %>/*.{scss,sass}'],
		    //     tasks: ['compass:compile', 'copy:resources']
		    // },
		    gruntfile: {
		        files: ['Gruntfile.js']
		    },
		      livereload: {
		        options: {
		          livereload: '<%= connect.options.livereload %>'
		        },
		        files: [
		          '<%= settings.directory.src %>/{,*/}*.html'
		          // '.tmp/styles/{,*/}*.css',
		          // '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
		        ]
		      }
		},

	});


	/**
	* Used for dev. Starts a webserver and watches changes.
	*/
	grunt.registerTask('serve', function(server, whitelabel) {

		// initParams(server, whitelabel);

		//set destination for copy task
		// grunt.option('copyDestination', '<%= settings.directory.server %>');

		grunt.task.run([
			'connect:livereload',
			'watch'
		]);
	});
}