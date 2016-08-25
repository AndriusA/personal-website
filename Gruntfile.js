'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    m2j: {
      posts: {
        options: {
          width: 800
        },
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
          './static/CNAME': ['CNAME']
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

    rsync: {
      options: {
          args: ["-v"],
          exclude: [".git*","*.scss","node_modules"],
          recursive: true
      },
      prod: {
        options: {
            src: "static/",
            dest: "/var/www/smart-e.org",
            host: "playground",
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'static'
      },
      src: ['**']
    },

    clean: ['./static/*.html', './static/blogPosts/*', './blog/posts.json']
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-markdown-to-json');
  grunt.loadNpmTasks('grunt-rsync');
  grunt.loadNpmTasks('grunt-gh-pages');

  grunt.registerTask('default', ['clean', 'm2j', 'assemble', 'feed']);
  grunt.registerTask('deploy', ['gh-pages']);
};