---
title: "Live-blog from MobiCom 2014 - day 1"
description: "The Annual International Conference on Mobile Computing and Networking"
tags: [MobiCom]
date: 2014-9-8 8:30
categories: [conferences]
published: true
---

Kicking MobiCom off with an award to Leonard Kleinrock for outstanding contributions.

Next is a keynote *From grad school, to startup to acquisition* by Sanjit Biswas, CEO Meraki, followed by a panel on *Tackling Societal Grand Challenges with Mobile Computing*.

There is also the official MobiCom [blog](https://mobicom2014.wordpress.com/), which covers a different set of events (or with a better quality writing!).

### Keynote

A really great keynote on starting and bootstrapping Meraki. A bit of an unusual research to startup transition, really started after giving a talk to Google and getting an pre-order for 1000 units of a wireless mesh router at $250 each. Hardware manufacturing turned out to be not that difficult once you have a number of units you already need - started off with just a very basic product.

The beta units were priced at a very low $49 instead, together with a dashboard. Shipped over 1000 networks (multiple devices) over the next couple of months, all over the world. And already slightly cash positive without any outside money. That was the end of their PhDs and the real start for Meraki.

Built 20-25 products, changing direction often and easily, but the core team was the most important part. Having the VC money in the bank, started experimenting with business models around 2007:
- connecting the next billion with $1/month access
- New hardware platforms for solar and apartment deployment
- municipal-scale outdoor wifi (e.g. give away devices for free to seed the network in SF)
- ad-supported WiFi with local advertising

Things going great, revenues growing fast... The sales pipeline started becoming very interesting - carriers started approaching them. 2008 hit pretty bad, but 2009 saw changing marked dynamics - started looking at enterprise networks and iPhones were forcing IT to offer guest wireless. Added VLAN support, directory services integration, 802.11n, changed price point to $1000 per access point and things really took off.

Explosive growth, scaling operations becomes difficult - acquisition/merger by cisco

> Q: clearly there were many points were potentially you could have failed. Many people think "what if I fail?", so what is the worst thing that could have happened?
>
> A: Especially for people who have a lot of choices... But everyone appreciates that the success rates are low, and that people doing startups are very flexible, so the safety net is that you are immensely hireable even if things fail.
> 
> Q: How difficult was it to negotiate with all the different parties to transfer all the IP into a business when starting off? How did investors feel about the level of protection?
>
> A: Our situation was great in MIT, the licensing allowed us to just use it and the research was already in public domain. BSD and MIT type licenses allow you to fork off a commercial product, unlike GPL..
> 
> Q: How did you transition from research into actual management?
>
> A: Basically things have to be done and people just do it if you have a good team.
>
> Q: Investment chouce: angels vs VCs?
>
> A: Did a lot of reference checking, talked to people who have made transitions, how easy it is to work with them. Sequoia did not offer the best deal, but they had the best reputation for our type of business. Seed vs Series A has a big gap in funding and angels are very useful for introductions, etc.
>
> Q: Do you think you have actually made big changes in the enterprise network?
>
> A: We grew up in the days of the web, and that was deeply within the way we operated, and within CISCO we could serve many of the clients that were not served by CISCO's sales pipeline
>
> Q: How do you motivate students to stay in grand school when they have an opportunity like this?
>
> A: Many of the people we worked with did not actaully drop out. The stakes are pretty high if you are aiming for an academic career. But you should only do it if you are really compelled by the idea - talk to your supervisor on mitigating the risks.
>
> Q: Technical - is mesh still a viable option or is it now pretty much dead?
>
> A: Mesh in the way we were hooked into in research did not take off, but there are many cases where it might make more sense, such as various sensors - there are certainly other applications, perhaps more embedded. An example is Sonos speakers, who actually run mesh.
>
> Q: You decided not to finish your PhD... Now you have other choices - what are the regrets and what is next?
>
> A: Can't think og anything specific as deep regrets. For example the solar-powered unit had a lot of engineering put into it, ended up selling ~10 units. So could have saved a year or two in the process. But overall no big regrets.


### Paper Session #1: The Newer Frequency Bands 

#### Demystifying 60GHz Outdoor Picocells 
Yibo Zhu (UCSB); Zengbin Zhang (UCSB); Zhinous Marzi (UCSB); Chris Nelson (UCSB); Upamanyu Madhow (UCSB); Ben Y. Zhao (UCSB); Haitao Zheng (UCSB) 

Scaling up the networks with the growing demand is extremely difficult, so exploring other approaches. 60 GHz spectrum is one option.

As far as I can tell a purely theoretical consideration of using 60GHz frequencies. Short range (if compliant with FCC power budget), blockage by people, adaptation to mobility (beam forming + realigning the beams), interference... On the other hand, haven't seen anyone else trying to use this frequency, so great in that sense!

> Q: Can I just go and buy the radio arrays?
>
> A: Yes, widely available
>
> Q: What kind of OS/drivers you used for the experimental platform?
>
> A: The Wilocity (?) testbed has only windows drivers, but the SDR system exposes information to any controlling OS
> 
> Q: Didn't get the stuff about multiple clients? How many clients can you support by one basestation?
>
> A: Using individual arrays to create individual highly directional beams for each user. In the simulation we show that you can support up to 100 users from one such basestation.
>
> (couldn't quite grasp a couple of Q/A...)
>
> Q: (Victor Bahl) Don't know what I've learned here tbh - simulations are well known, the hardware and the deployment is extremely well known, so tell me one insight...
>
> A: Very good question... Motivation is that if we can make it happen, it has great potential. There are so many exciting research directions onwards... Maybe we can talk offline...
>
> Session Chair: please no such questions...


#### A Vehicle-based Measurement Framework for Enhancing Whitespace Spectrum Databases 
Tan Zhang (Wisconsin-Madison); Ning Leng (Wisconsin-Madison); Suman Banerjee (Wisconsin-Madison) 

Need a database of licensed/unlicensed device usage, channel quality, etc.. Build a 'wardriving' platform to piggyback on public transport to capture the data.

An interesting model on predicting leakage of TV broadcast.

To localize TV-ban devices use path loss trend, but it has a lot of environmental variation. So split up the space into sectors to improve the measurements for the cases for sectors with little interference. Seem to be able to achieve 16-27m location error.

> Q: does the TV db extended above the ground level? Have you considered it?
>
> A: the db has considered it, but it does not have any such measurements, could be future work.
>
> Q: we're tv whitespace device manufacturers. Every time we deploy we see the same problem: go to a database, see a lot of inaccuracy and they change over time, so we should probably stop treating it as just busy or free and instead try to build something more dynamic
>
> A: We are trying to build ways of reporting and seeing current channel information as part of our future work
>
> Q: What's your main contribution in this paper?
>
> A: two points: nobody knows the actual performance of the commercial DBs and we use the measurements not only to improve the databases, but we also add aditional functionality such as estimating noise floor and location tracking of devices.

#### The Case for UHF-Band MU-MIMO 
Narendra Anand (Rice); Ryan E. Guerra (Rice); Edward W. Knightly (Rice)

MU-MIMO transmission procedure is sound&transmit. Channel sounding is requires a transmitter to measure the channel between itself and its receivers. 

Various considerations of using UHF: less reflection (e.g. off walls), variability (how much does it change between sounding and transmission for example). UHF MU_MIMO users are much harder to separate than 5GHz, but channels have an order of magnitude less variability.

Building an UHF MU-MIMO turns out to be quite difficult purely because of the physical size.. Designed and built Wideband UHF Radio Card (WURC), compatible with SDR (demoed tomorrow at MobiCom).

Nice performance eval in a few environments - check the [paper](http://dl.acm.org/authorize?N87305).

In an indoor scenario separability turns out to be similar to 2.4GHz indoors, but very different outdoors - more environment than channel dependent. Channel variability is band dependent though.

The channel variability stays low even at 802.11 beacon interval. Sounding has pretty high overheads - e.g. use 500us for sounding and 1300us for transmission, so low variability is really necessary to reduce the overheads.

> Q: The key thing is really the size of antennae, so just feedback: indoors there is an interesting tradeoff with losing some of the gain of large antennae and the size
>
> A: indoors the distances are so much smaller that it could still work even with the gain loss

#### Enhancing Reliability to Boost the Throughput over Screen-Camera Links 
Anran Wang (SKLSDE Lab, Beihang Univ., China); Shuai Ma (SKLSDE Lab, Beihang Univ., China); Chunming Hu (SKLSDE Lab, Beihang Univ., China); Jinpeng Huai (SKLSDE Lab, Beihang Univ., China); Chunyi Peng (OSU); Guobin Shen (MSR China) 

Proposing RDCode - robust dynamic barcode with a packet-frame-block structure, using visual light communication (light -> camera).

Bit error rate really depends on the block within a captured frame, so use reed-solomon codes for adaptive error correction. Overall error correction intra-blocks, inter-blocks and inter-frames.

Eval indoors, compared against COBRA: reduces bit-error rate and increases bandwidth, hence higher throughput and goodput (in the order of 20 KB/s!).

> Q: How do you synchronize transmitter and receiver?
>
> A: We don't, achieve this with error correction

Breaking for *Experience and Wisdom meets Youth and Stamina Luncheon*. Interestingly enough, sessions will continue from 8PM local time (GMT -10)...


### Paper Session #2: Emerging Communication Systems 

#### Enabling Instantaneous Feedback with Full-Duplex Backscatter 
Vincent Liu (UWash); Vamsi Talla (UWash); Shyamnath Gollakota (UWash) 

Great piece of work - already wrote about it at SIGCOMM (well, different aspect of the system, not the instantaneous feedback). Essentially can't hear anything while transmitting, partial solution is to use phase modulation instead of amplitude modulation. Combine with filtering to reduce noise - one end removes interference with low-pass filter and the other - high-pass (not sure about the details).

Reliability is difficult with backscattering, so acknowledge data at bit level. Receiver returns a checksum of each chunk, sender verifies checksum. The scheme has >90% decrease in overhead.

> Q: I wonder how will this work in practice? With multiple tags, a lot of things reflecting signals?
> 
> A: We actually saw some of that... We tested reasonable scenarios, various distances, moving around, etc. The only case when our system did not work was when you were touching the tag...
>
> Q: Have you thought about specific applications with different guarantees?
>
> A: You'd still get a big benefit from this...


#### Strata: Layered Coding for Scalable Visual Communications 
Wenjun Hu (Yale); Jingshu Mao (Peking); Zihui Huang (Peking); Yiqing Xue (Peking); Junfeng She (Peking); Kaigui Bian (Peking); Guobin Shen (MSR)

Can encode information at different *layers* (e.g. resolution of an image) visually, but a big problem for encoding a sufficient amount of information is receiver capabilities. Focusing on smartphones, they have different sensors, hence need to incorporate spacial and temporal component into the design of coding... Also features such as auto-focus, exposure, contrast, etc.

(Wenjun already presented a variation of the work in Cambridge - great work and recommended to read the paper).

One of the key details of the design is that even though the layer structure is interdepedent, the actual information encoded in each layer is not, hence giving greater flexibility. Combines nicely with capturing at different conditions - end up with the different layers. Loads of design choices though: reserved block size, branching factor, etc.

> Q: What's the useful range of the approach? E.g. in some case cases you might be so far away you won't be able to lock onto the code while in others camera resolution limits the fidelity...
>
> A: not specifically, but could use from about 20cm to whatever the size you can print at to be visible...
>
> Q: Considered using colors, RGB?
>
> A: colors don't give you different behavior over distance...

Very short Q&As this session...

### Paper Session #3: Physical Analytics 

#### Wireless Barcodes for Tagging Infrastructure 
Farnoosh Moshir (Portland State University); Suresh Singh (Portland State University) 

Build wireless tags into infrastructure, use time difference of arrival of the signals to encode data. Challenges then are:
- good separation in time between signals
- roughness of the surface affects signal due to reflections
- need to detect symbol boundaries

Simulation based eval... But also built prototype with an eval of different wear and tear. Couldn't see/catch the details on performance.

Q&A basically just about the way they evaluated the resilience of the tag to physical damage/environment...


*On a final note, whoever came up with the idea of having technical sessions at 8AM AND 10PM on the same day should not be allowed to sleep for a week...*


