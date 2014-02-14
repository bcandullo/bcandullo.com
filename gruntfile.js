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
                        'app/js/browser.js',
                        'app/js/destroyer.js'
                    ]
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
                tasks: [ 'less:dev' ]
            },
            html: {
                files: '**/*.html'
            }
        },

        // minify all images - only jpg is used
        imagemin: {
            jpg: {
                options: {
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        cwd: 'app/img/',
                        src: ['**/*.jpg'],
                        dest: 'build/img/',
                        ext: '.jpg'
                    }
                ]
            }
        },

        // build js includes - https://github.com/vanetix/grunt-includes
        includes: {
            files: {
                src: ['app/js/browser.js'],
                dest: 'build/js',
                flatten: true,
                cwd: '.',
                options: {
                    includeRegexp: /^(\s*)\$include\s+"(\S+)"\s*$/,
                    duplicates: false
                }
            }
        }

    });

    // load tasks
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-includes');
    
    // register tasks for envs
    grunt.registerTask('dev', [ 'includes' , 'less:dev', 'watch' ]);
    grunt.registerTask('prod', [ 'includes', 'less:prod', 'htmlmin', 'uglify' ]);

};