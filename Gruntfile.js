'use strict';

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        dir: {
            // Configurable paths
            dev: 'dev/',
            dist: 'dist/',
            src: 'src/'
        },

        watch: {
            js: {
                files: ['<%= dir.src %>js/*.js'],
                tasks: ['jshint', 'copy:dev']
            },
            concat: {
                files: ['<%= dir.src %>js/plugins/*.js'],
                tasks: ['concat']
            },
            compass: {
                files: ['<%= dir.src %>sass/{,*/}*.scss'],
                tasks: ['compass']
            },
            assemble: {
                files: ['<%= dir.src %>templates/**/*.hbs'],
                tasks: ['assemble']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= dir.dev %>**/*.html',
                    '<%= dir.dev %>**/*.js',
                    '<%= dir.dev %>**/*.css'
                ]
            }
        },

        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    base: '<%= dir.dev %>',
                    open: true
                }
            }
        },

        compass: {
            dist: {
                options: {
                    sassDir: '<%= dir.src %>sass',
                    cssDir: '<%= dir.dev %>css',
                    imagesDir: '<%= dir.dev %>images/sprite',
                    generatedImagesDir: '<%= dir.dev %>images',
                    httpGeneratedImagesPath: '/images',
                    javascriptsDir: '<%= dir.dev %>js',
                    fontsDir: '<%= dir.dev %>fonts',
                    outputStyle: 'compact',
                    noLineComments: true,
                    relativeAssets: false,
                    assetCacheBuster: false
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= dir.src %>js/*.js'
            ]
        },

        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= dir.dev %>js',
                    src: '*.js',
                    dest: '<%= dir.dist %>js'
                }]
            }
        },

        cssmin: {
            files: {
                expand: true,
                cwd: '<%= dir.dev %>css/',
                dest: '<%= dir.dist %>css/',
                src: ['*.css']
            }
        },

        concat: {
            files: {
                src: '<%= dir.src %>js/plugins/**.js',
                dest: '<%= dir.dev %>js/lib/plugins.js'
            }
        },

        copy: {
            dev: {
                expand: true,
                cwd: '<%= dir.src %>js/',
                dest: '<%= dir.dev %>js/',
                src: '*.js'
            },
            dist: {
                expand: true,
                cwd: '<%= dir.dev %>',
                dest: '<%= dir.dist %>',
                src: '**'
            }
        },

        clean: {
            dist: ['<%= dir.dist %>']
        },

        assemble: {
            build: {
                options: {
                    data: ['config.yml'],
                    layout: '<%= dir.src %>templates/layout/default.hbs',
                    partials: '<%= dir.src %>templates/partials/*.hbs',
                    assets: '<%= dir.dev %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= dir.src %>templates/pages/',
                    src: '**/*.hbs',
                    dest: '<%= dir.dev %>'
                }]
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.task.loadNpmTasks('assemble');

    grunt.registerTask('default', [
        'concat',
        'assemble',
        'compass',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'concat',
        'assemble',
        'compass',
        'copy',
        'uglify',
        'cssmin'
    ]);
};