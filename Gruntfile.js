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
        expand: false,
        flatten: true,
        partials: ['./template/partials/*.html'],
        helpers: ['helper-moment'],
      },
      site: {
        options: {
          data: ['./template/data/*.json'],
        },
        files: {
          './static/research.html': ['template/research.html'],
          './static/index.html': ['template/index.html'],
          './static/resume.html': ['template/resume.html'],
          './static/projects.html': ['template/projects.html'],
        }
      },
      blog: {
        options: {
          layout: './template/blogPostLayout.html',
          // plugins: ['assemble-middleware-rss'],
          // rss: {
          //   logging: true,
          //   author: "Andrius Aucinas",
          //   dest: "./static/feed.xml",
          //   siteurl: "http://smart-e.org/",
          //   title: 'Occasional ramblings',
          //   description: 'Occasional tinkering with hardware/software as well as conference reports',
          // }
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