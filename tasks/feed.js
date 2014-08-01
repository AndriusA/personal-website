/*
 * grunt-feed
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2014 Andrius Aucinas
 */

module.exports = function(grunt) {
  'use strict';
  var noop = function(){};

  var path = require('path');
  var feedBuilder = require('feed');
  var moment = require('moment');
  var marked = require('marked');

  var config = {
  };

  grunt.registerTask('feed', "Generate RSS feed", function(){
    var pkg = grunt.file.readJSON('package.json');

    config = {
      title:       'Mobile, full-stack and research',
      description: 'Occasional writings about tinkering with mobile devices and gadgets, all the way to the hardware and conference live-blogs',
      link:        pkg.url,
      copyright:   'Copyright ' + moment().format("YYYY") + ' ' + pkg.author.name,
      updated:     moment().format("dddd, MMMM Do YYYY"),
      author: {
          name:    pkg.author.name,
          email:   pkg.author.email,
          link:    pkg.author.url
      }
    };

    var bPosts = grunt.file.readJSON('./blog/posts.json');
    var blogPosts = [];
    for (var post in bPosts) {
      blogPosts.push(bPosts[post]);
    }
    blogPosts.sort(function(a, b) {
      return moment(a.date) < moment(b.date);
    })
    grunt.verbose.write("Extracted blog posts:", blogPosts);

    var feed = new feedBuilder(config);
    
    for (var post in blogPosts) {
      var feedPost = blogPosts[post];
      feedPost.link = pkg.url + "/blogPosts/" + feedPost.basename + ".html";
      feedPost.date = moment(feedPost.date).toDate();
      feedPost.description = marked(feedPost.preview);
      feedPost.author = [feed.author];
      delete feedPost.content;
      feed.addItem(feedPost);

      for (var cat in feedPost.categories) {
        feed.addCategory(feedPost.categories[cat]);
      }
    }

    var rendered = feed.render("rss-2.0");
    var dest = './static/feed.xml';
    grunt.file.write(dest, rendered);
    grunt.log.ok("Feed generated to " + dest);
    grunt.log.ok("Feed with " + blogPosts.length + " items");
  });

};
