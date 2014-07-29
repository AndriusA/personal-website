'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    m2j: {
      posts: {
        files: {
          './blog/posts.json': './blog/*.md'
        }
      }
    },
    assemble: {
      options: {
        flatten: true,
        prettify: {
          indent: 2,
          condense: true,
          newlines: true
        },
        partials: ['./template/partials/*.html'],
        helpers: ['helper-moment'],
      },
      site: {
        files: {
          './static/research.html': ['template/research.html'],
          './static/index.html': ['template/index.html'],
          './static/resume.html': ['template/resume.html'],
          './static/projects.html': ['template/projects.html'],
        },
        options: {
          data: ['./template/data/*.json'],
        }
      },
      blog: {
        options: {
          layout: './template/blogPostLayout.html',
        },
        files: {
          './static/blog.html': ['./template/blog.html'],
          './static/blogPosts/': ['./blog/*.md'],
        }
      }
    },

    clean: ['./static/*.html', './static/blogPosts/*', './blog/posts.json']
  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-markdown-to-json');

  grunt.registerTask('default', ['clean', 'm2j', 'assemble']);
};