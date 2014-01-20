module.exports = function (grunt) {

    grunt.initConfig({

        // concat and minify js
        uglify: {
            target: {
                options: {
                    expand: true,
                    flatten: true,
                    report: 'gzip',
                    preserveComments: false
                },
                files: {
                    'build/js/build.js': [
                        'app/js/app.js',
                        'app/js/utils.js',
                        'app/js/contact.js',
                        'app/js/browser.js'
                    ],
                    'build/js/canvas.js': ['app/js/browser.js']
                }
            }
        },

        // minify html - https://github.com/gruntjs/grunt-contrib-htmlmin#htmlmin-task
        htmlmin: {
            prod: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true
                },
                files: {
                    'build/index.html': 'app/index.html'
                }
            }
        },
    
        // build less files
        less: {
            dev: {
                options: {
                    ieCompat: false,
                },
                files: {
                    'app/css/main.css': 'app/css/main.less'
                }
            },
            prod: {
                options: {
                    compress: true,
                    cleancss: true,
                    ieCompat: false,
                    report: 'gzip'
                },
                files: {
                    'build/css/build.css': 'app/css/main.less'
                }
            }
        },

        // watch for dev only
        watch: {
            options: {
                //nospawn: true,
                livereload: true
            },
            css: {
                files: '**/*.less',
                tasks: [ 'less:dev' ],
            },
            html: {
                files: '**/*.html'
                // dev html tasks
            }
        }

    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    // https://npmjs.org/package/grunt-smushit
    
    // register tasks for envs
    grunt.registerTask('dev', [ 'less:dev', 'watch' ]);
    grunt.registerTask('prod', [ 'less:prod', 'htmlmin', 'uglify' ]);

};