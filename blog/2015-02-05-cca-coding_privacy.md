---
title: "Coding as a window to the modern world and our privacy"
description: "How learning to code causes to realise the issues we have with privacy online and teaches us responsibility"
tags: [CCA]
date: 2015-02-05 11:00
categories: [teaching]
published: true
---

This item is cross-posted from the Cambridge Coding Academy (organisation I have co-founder and greatly enjoy working with) [blog](http://blog.cambridgecoding.com/post/110152231395/coding-as-a-window-to-the-modern-world-and-our).

Even if it's true that not everyone will be able or willing to take on programming as a career, coding is a very powerful tool and often serves as the most effective means to an end. At Cambridge Coding Academy we have found that it also reveals much about the modern digital world... Because seeing is believing!

Last Friday at our Data Retrieval and Visualisation workshop we had a lively discussion with our attendees about **privacy**. Privacy is one of the biggest concerns online, only made worse by the fact that a handful of corporations watch and record every step we take. Once you cross out Google, Facebook, Twitter, Apple and Amazon, you've pretty much exhausted the list. 

So what did we do at the workshop to stimulate this discussion? As part of our Data Retrieval programme we got our attendees to play around with data from a real system, **Twitter**. Let's see how difficult it is to continuously monitor location of a set of individuals across the country:

	var Twit = require('twit');
	var fs = require('fs');
	var twit = new Twit({
		// Your authentication keys
	});

	// Geographic "rectangle" encompassing UK
	var uk = [ '-9.23', '49.84', '2.69', '60.85' ];
	var stream = twit.stream('statuses/filter', { locations: uk })

	// Continuously monitor and record name and location of every tweeting user
	stream.on('tweet', processTweet);
	function processTweet(tweet) {
		console.log(tweet.user.name, tweet.geo);
	};

How powerful are these 13 lines of code? With them, you can find individuals' names and their accurate locations, giving you a great starting point for collecting extremely detailed information about them. Although you only get to see locations of a small proportion of the whole population, our attendees already began to express their concerns and raised a host of questions:

- Is it legal to do this? (yes, we are using Twitter's streaming API with authentication and according to its Terms &amp; Conditions)
- Is the location reported for everyone? (no, only for the ones who have opted-in to have it recorded with their tweets)
- How is it recorded: GPS, based on your IP address, or something else? (usually GPS, but you wouldn't be surprised to know that most companies record less accurate location of their users based on their IP addresses, would you?)
- How do you actually opt-in or opt-out? (so we got to play around with their settings on Twitter. Everyone made sure to opt-out!)

Bearing in mind that all attendees of this particular workshop were PhD students and young researchers comfortable with technology in their everyday life and work, what does this tell us? We don't stop to think about some issues until we encounter them face-on and see first-hand how bad they are.

Of course, it's not all bad! After the initial shock everyone started buzzing with how they could use this newly discovered source of information for their own projects. To sum up, today's technology is really great if used responsibly. And coding is the one of the most vivid ways through which to understand the world of technology around us.