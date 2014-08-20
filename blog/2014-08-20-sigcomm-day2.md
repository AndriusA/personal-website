---
title: "Live-blog from SIGCOMM 2014 - day 2"
description: "The flagship annual conference of the ACM Special Interest Group on Data Communication (SIGCOMM) on the applications, technologies, architectures, and protocols for computer communication"
tags: [SIGCOMM]
date: 2014-18-20 8:30
categories: [conferences]
published: true
---

Starting nice and early with the second day. Just in case you haven't noticed, papers are available during the conference from the [program webpage](http://conferences.sigcomm.org/sigcomm/2014/program.php). Perhaps unsurprisingly the hall is not very crowded this morning, but the papers look interesting.

*Disclaimer:* I tend to rephrase questions/answers to either make them shorter or change them in a way I understand them, so might end up being wrong - don't take my word for it.

### Session 5: Wireless (1)

#### FastForward: Fast and Constructive Full Duplex Relays
Dinesh Bharadia (Stanford University); Sachin Katti (Stanford University)

WiFi has problematic bandwidth indoors due to shielding from walls, etc. MIMO doesn't help there because of the *pinhole effect*, where a signal propagates through a cavity in a wall. Instead, proposing full fuplex relay. The key is to do simultaneous RX and TX on the same frequency.

Construct and forward filter does constructive amplificationa and rotation to improve signal received (and avoid destrutive interference).

High latency also leads to inter-symbol intererence, so need to minimize the latency of the construct & forward filter... (not enough coffee to catch the details apparently :) ).

Eval compares the prototype against the simple deployment of a single AP and one with a half duplex mesh routers. 95% of locations get at least 60Mbps (only 30% with a simple half duplex relay).

The takeway - forward signals, not packets!

> Q: It appears you have to measure the channel from the sender to a receiver to tune the channel? How does it work if you have multiple receivers?
> 
> A: To learn the source-relay channel, it uses overhearing when source transmits to other destinations using some new ode in 802.11. (second question offline)
> 
> Q: Is the channel stationary enough to do the estimation quickly?
> 
> A: It works as long as beam-forming works, otherwise both break.
> 
> Q: It's very typical to see large numbers of WiFi APs in an apartment block and you're extending the range, do you think this is going to change spectrum management
> 
> A: We haven't looked into it in detail, but I think the approach could help multiple networks simultaneously.
> 
> Q: In the model you described the amplitude and the phase and applied to different frequencies. How does it work with multiple frequencies at a time?
> 
> A: The phase approach only works for one frequency at a time

#### LTE Radio Analytics Made Easy and Accessible
Swarun Kumar (Massachusetts Institute of Technology); Ezzeldin Hamed (Massachusetts Institute of Technology); Dina Katabi (Massachusetts Institute of Technology); Li Erran Li (Alcatel-Lucent)

*Open* platform to monitor LTE (open source?).

Performs analytics of individual users over time and space, but preserves privacy by not accessing their transmitted data and only using annonymised PHY IDs.

- Temporal analytics monitors throughput, link quality and loss rate passively (LTE sniffer). LTE control is performed using downling control packets, which expose a lot of information about every link in the network and are *not encrypted*. Furthermore, such packets give information about both uplink and downlink. Each packet is also tagged with a PHY layer user ID (not trivial - change over time, details in paper)
- Spatial analytics to localize LTE users.

Example of analytics is network utilization... LTE uses equal bands for UL and DL, but UL utilization never even crossed 5% on tested At&t/verizon networks. Also analyze reasons for poor connection quality with "5 connectivity bars" (interference between basestations), and control plane overheads. E.g. 10% of verizon spectrum is wasted for control channel without any useful infromation exchaned - turns out to be an implementation issue.

Built a Synthetic Aperture Radar (SAR) for localization. Find angle of strongest signal and use multiple stations to localize the signal. Multipath is a problem though - signal might be strongest on an indirect path. Direct path is the shortest though, hence the one with least delay (need to find the one with least delay!).

LTE uses OFDM, so transmits at many frequencies. Different frequencies exhibt different phases at the receiver - propagation time can then be computed from phase difference and known used frequencies.

Example testcase - location within median 43 cm error in a campus building (60mx30m).

> Q: You can put this on a car and get all the information... Suppose cellular networks may not be happy about it, is there a way to stop it, e.g. legally?
> 
> A: LTE is the way it is, so they can only stop sending LTE signal and what we do seems perfectly lega.
> 
> Q: We already have some nice LTE measurement device, so what is the better information LTEEye can get that individual devices can't?
> 
> A: One thing is that you can't trust values reported by the phone, GPS doesn't work indoors for location and phone doesn't expose any PHY layer data

#### Control-Plane Protocol Interactions in Cellular Networks
Guan-Hua Tu (UCLA); Yuanjie Li (UCLA); Chunyi Peng (OSU); Chi-Yu Li (UCLA); Hongyi Wang (UCLA); Songwu Lu (UCLA)

Control plane in ceuular performs many functions  - radio resource control, mobility management, connectivity management, etc. Domain is separated for voice and data and gets more complex with hybrid 3g/4g deployments. Interaction is hence acros three dimensions: cross-domain, cross-system and cross-layer... How do they interact?

Designed a model checker - protocol stacks + usage settings + desirable properties -> model checked -> violated property counterexamples. Identify two types of problems: necessary but problematic cooperation and independent but coupled operations.
- Running data services when switching from 4G to 3G and back to 4G. Client maintains connection context (IP, etc), so the context should be migrated to 3G, but there are problems when the context gets deleted before the new one is created. Especially bad because data connectivity is mandatory in packet-only 4G.
- Occurs on 3.1% of users in the study, causing "out of service" case for up to 25 seconds when switching back to 4G.
- 4G users make calls via 3G circuit-switched fallback, so includes switching to 3G for a call. Background data causes user to get stuck in 3G because RRC state transition in some cases is incosistent with cross-system switching.
- 62.1% 4G users stuck in 3G after a call!
- A whole set of other examples, including unnecessary coupling, etc.

(Really more interested in how they do the analysis rather than the example outcomes! The main challenge with any such work is being able to access the control level information at all...)

Conclusions:
- The layering rule should be fully honored (optimistic assumptions, coupled actions)
- Inter-domain difference should be well recognized (coupling independent services)
- Hybrid systems are not properly coordinated (context sharing, fault isolation)

> Q: How much of any of this is due to philosophical protocol design in cellnets where everything is controlled from the network and all state transitions at a device are basically slave transitions? How much is that bugs and how much design philosophy?
> 
> A: Switching 3G/4G for example is a design decision, context is not well protected by design. Discuss in the paper which ones are bugs and which are design flaws.
> 
> Q: Broader question - what's the long-term solution you envision? Some vision for 5G?
>
> A: For each of the problems we proposed an initial solution on a prototype, and the most important results are the finding in our conclusions - what should be done.
> 
> Q: How much data, how many users, how many days, etc.? 
>
> A: for the experimental part we developed some tools and used phone debugging mode... We had 20 volunteers in a 2 week user study
>
> Q: How general is the problem you are describing and how much it depends on a specific implementation on a specific network
>
> A: (didn't get the answer) 
>
> Q: I wonder what you are thinking of doing next? Would be very important input to 3gpp...
>
> A: we try to cooperate with the standards unit already

#### RF-IDraw: Virtual Touch Screen in the Air Using RF Signals
Jue Wang (MIT); Deepak Vasisht (MIT); Dina Katabi (MIT)

The key - use RF-localization to track RFID tags attached to a pair of gloves. Accuracy of the simple case is not enough though.

RF-IDraw accurate within 3.7 cm and works with off-the-shelf hardware. 

Use ambiguity-resolution tradeoff with antennae array resolution - high resoltuion has high ambiguity and vice versa. Hence use multi-resolution antennae array. All about placing antennae smartly; most RFID readers these days support a sufficient number of antennae. Accuracy is not bad, but using it for shape recognition is still hard because the errors are random and don't preserve the shape of the trajectory.

Want the errors to be systematic. Simple solution is to "stick with your choices" - stic with a beam even if it is not the precise location.

Using two ThingMagic RFID readers with 4 antennae and Alien squiggle RFID tags as well as VICON motion capture system for ground-truth. Looks like recognizable characters at the size of centimeters, but there is some absolute positioning error  median error in the tests was ~19cm. Trajectory error is an order of magnitude smaller with RF-IDraw than antennae arrays (~3.7cm). But the error is systematic rather than random, allowing to reconstruct symbols smaller than the erorr itself.

> Q: what about the temporal accuracy?
> 
> A: we take a measurement every 20ms, but could go lower in the settings
> 
> Q: How do you compute the ground truth
> 
> A: (how the VICON works)
> 
> Q: How is it different for a tap rather than a draw, where location accuracy is more important?
> 
> A: Need a third dimension and the accuracy might be good enough far away from the screen
> 
> Q: The structure of the antennae array, is it appropriate to compare RF-IDraw to the simple antennae array case? Rather than any general super-resolution array.
> 
> A: I think it is fair... Don't really get the question, let's take offline
> 
> Q: When you were doing antennae seperation, did you use cables? Do you have an idea of how to do it without have all the cabling all over the place?
> 
> A: you definitely need to implement it at least in terms of pairs to correct for the phase, you will need to have some cables going into some central place
> 
> Q: A little over 10-12 years Jon Smith did some work with RFID tags, where you use 2 tags, have you looked at combining them? Tracking them together might be better...
> 
> A: Not aware of the work, but it should be fairly easy to extend to multiple tags
> 
> Q: There is other tech not using RF - what are the advantages of using e.g. accelerometers or RF
> 
> A: Absolute capabilities seem better with RF IDraw than any other example, mobility is a second advantage...
> 
> (starting a discussion on accelerometer accuracy... Also fusing the different sensors...)


### Session 7: Novel Datacenter Network Designs

#### Quartz: A New Design Element for Low-Latency DCNs
Yunpeng James Liu (University of Waterloo); Peter Xiang Gao (University of California, Berkeley); Bernard Wong (University of Waterloo); S. Keshav (University of Waterloo)

Only covering the Q&A:

> Q: If you talk to the falks in flexi about your design about some of the similarities and differences, maybe worth doing a comparison?
> 
> A: I am not aware of this work, but I'm very happy to do so.
> 
> Q: From the point of view of practical deployment: you assume each fiber carries up to 160 wavelengths and fixed transciever. If you have a transiever failure, each running at a certain frequency, you need to have a bag of transcievers each running at a specific frequency.
> 
> A: Yes, but I'm not sure how high the cost would be, but it is a reasonable thing to have a bag of spare parts... Tuanble lasers is one alternative but they are also more expensive.
>
> Q: have you considered augenting your work onto existing interconnects, probably at a close to zero cost?
>
> A: we haven't looked at such augmentation, but reusing existing equipment would be beneficial
> 
> Q: What is the failover time if one link goes down?
>
> A: Haven't measured, but it depends on technology as well as one you are comparing against. But everything is static, so the same properties as normal failover with hardware failure.


#### Using RDMA Efficiently for Key-Value Services
Anuj Kalia (Carnegie Mellon University); Michael Kaminsky (Intel Labs); David Andersen (Carnegie Mellon University)

Remote Direct Memory Access - accessing and manipulating memory of a remote machine without involving the remote CPU. Considering InfiniBand and RoCE RDMA providers in their work on key-value services.

Key-value reads need at least 2 RDMA reads: to get the pointer and to get the reader. Not true if you have the values in the index, but can only do so with small and fixed-size values. We want to reduce the reads in a more general case.

Approach:
- Avoid using RDMA reads by involving the CPU in request-reply (RDMA writes are much faster than reads (?))
- Increse throughput by low-level optimizations, e.g. with payload inlining.
- Improve scalability using datagram transport - less state to store than TCP. (use connected transport for write from client to server and datagram for reply)

Client write's its request to the server, which performs DRAM access and replies to the client with another RDMA write. Only one round-trip in total. So lower latency.

Code is [online](http://github.com/efficient/HERD/)

> Q: The assumption here is that index and values are on the same node? (Yes) Do you replicate the writes? (No)
> I remember something about something that sounds like JMachine that sounds related to RDMA?..
>
> Q: it seems like taking CPU out of the loop gives great benefits, but you loose a lot of visibility?
>
> A: we do involve the CPU, the other systems don't
>
> Q: do you have to pin the pages to a remote memory before you start?
>
> A: our system requires a small (16KB) memory to be pinned initially, but nothing else
>
> Q: It would not work for large pages, because the NIC can't cache the mappings?
>
> A: it works well with huge pages in our experienes
>
> Q: could you tell us about how server cpu utilizatio changes... With plaf (?) they only require one core though?
>
> A: in our tests we used 6 out of 8 cores and could go lower. But in our experiene you need at least 5 cores to handle 20M fops


#### FastPass: A Zero-Queue Datacenter Network Architecture
Jonathan Perry (MIT); Amy Ousterhout (MIT); Hari Balakrishnan (MIT); Devavrat Shah (MIT); Hans Fugal (Facebook)

In an idealized network want:
- Burst Control
- Low tail latency
- Multiple Objectives based on application

With fastpass use a centralized arbiter schedules and assigns paths to all packets. concerns:
- Too much latency on a data path
- Scaling
- Single point of failure

Arbiter chooses a path for a packet so that no queueing occurs... So introduce latency for each packet to negotiate a path, but then there is no queueing...

Timeslot allocation is a maximal matching problem between (source, destination) and timeslot. Fast and easy, but how do you support different objectives (e.g. minimum flow completion time)?...

*were able to arbiter over 5Tb/s of traffic on 4 cores*

Fault tolerance ahieved by using multiple arbiters but only the primary one responding. If the primary doesn't respond for a few times, switch to another arbiter. If both fail, fall back to a lower-priority TCP?

Experiments on Facebook - fastpass is able to reduce queue occupancy from over 4 MB to 18 KB. Also allocates more equal shares of the bandwidth to different connections than TCP.

Code available.

> Q: You choose maximal as opposed to maximum to facilitate pipelining
>
> A: having a more optimal algorithm would be more expensive
>
> Q: How do you schedule packets to the arbiter?
>
> A: these are tiny packets, so you have to provision the arbiter to handle sufficient load, so arbiter would have to have a link to the network for every ~300 clients it is serving... We over-provision the arbiter slightly, but because the packets are so small you can set very aggressive timeouts.
>
> Q: (followup comment, Keshav) you need to use ATM :)
> 
> Q: when you compare against DCTCP? (didn't hear the second part of the question)
>
> A: DCTCP doesn't solve all the problems with large queues or different objectives for different flows, etc. Also from conversations with devs, they prefer paying with mean latency for reduced tail latency...
>
> Q: can you undo scheduling decisions if things change?
>
> A: we haven't observed objectives that need breaking of the scheduling pipeline. 


... skipped taking notes for one paper...


#### A "Hitchhiker's" Guide to Fast and Efficient Data Reconstruction in Erasure-coded Data Centers
K. V. Rashmi (UC Berkeley); Nihar B. Shah (UC Berkeley); Dikang Gu (Facebook Inc.); Hairong Kuang (Facebook Inc.); Dhruba Borthakur (Facebook Inc.); Kannan Ramchandran (UC Berkeley)

(I will use the opportunity to advertise related work from Cambridge in HotNets '13 that is worth reading - [Trevi](http://anil.recoil.org/papers/2013-hotnets-trevi.pdf) )

Using errasure codes with HDFS (HDFS-RAID). (10, 4) Reed-Solomon code to replace simple replication.

The good and the bad with Reed-Solomon:
- they are optimal for a given storage overhead
- support any number of data and parity blocks
- they were designed for point-to-point applications, hence result in large amount of data transfers (on the order of x10)

The goal is hence to use the benefits and reduce the drawbacks - Hitchiker reduces network transfers by 25%-40%.

Algorithm details are a bit complicated to take notes on, but definitely worth checking out in the paper.

Contrasting R-S and hitchiker from network perspective, in an example case need 6.5 blocks from 11 machines, vs 11 blocks from 13 machines with R-S. Also offers 36% reduction in decoding time on a real production network. Read and transfer time was 30% lower (depending on block size). Encoding cost was 75% higher with hitchiker though, so appropriate for read-heavy workloads.

Apparently already used in Facebook warehouse cluster in production.

> Q: wondering why you decided to use Reed-Solomon instead of something like fountain codes?
>
> A: (didn't hear the answer)
>
> Q: impact on load balancing? All requests would be directed to a single machine?
>
> A: connecting to more machines and fetching smaller amount of data than R-S, so load-balances better.
>
> Q: you were trying to do erasure coding without considering the failures in the cluster, so why not optimize errasure code for the statistics of failures?
>
> A: with respect to fault tolerance you need to ensure data is not lost and reconstruction is a slightly different scenario
>
> Q: but you could have non-uniform erasure coding depending on a scenario?
>
> A: if you want to have optimal usage of storage space you can't do better than R-S codes. In terms of time you could do better?
>
> Q: the code that you are using is not very well suited on being run on processors, but rather shift-registers, and there are definitely other codes that offer 1/10th of encoding/decoding time for other cases.
>
> A: (missed again)
>
> Q: is there a theoretical bound on the number of transfers you have?
>
> A: there is a lot of theoretical work, but in terms of the practical constructions require practical bounds, e.g. 1.4x overheads rather than 2x

### Session 8: Network Architecture (2)

#### A Global Name Service for a Highly Mobile Internet
Abhigyan Sharma (University of Massachusetts Amherst); Xiaozheng Tie (University of Massachusetts Amherst); Hardeep Uppal (University of Massachusetts Amherst); Arun Venkataramani (University of Massachusetts Amherst); David Westbrook (University of Massachusetts Amherst); Aditya Yadav (University of Massachusetts Amherst)

Mobile arrived, but Internet unmoved :)
- unidirectional communication initiation
- redundant mobility support
- ungraceful disruptions

The problem is architectural - conflation of location and identity... DNS is supposedly too slow.

A bunch of DNS limitations (caching, static placement, structured names) that you may or may not agree with (my opinion).

Sorry, disagree with too many details and the many problems with mobility are not really addressed (unidirectional communication, still using socket APIs tied to IP which break when nodes migrate, etc.). Waiting for Q&A now.

IMO a fair bit of related work on proactive DNS caching, zero-TTL records, etc. Of course, this is a different approach of doing things, but could make the usual argument of redesigning vs improving.

> Q: Have you thought at all whether it is susceptible to DoS/dDoS attacks?
> 
> A: It is geo-distributed, massively scalable infrastucture so I'd like to think that there is no single point of failure and you can always do replication... Similar to what a CDN would do


#### Towards a Quantitative Comparison of the Cost-Benefit Trade-offs of Location-Independent Network Architectures
Zhaoyu Gao (University of Massachusetts Amherst); Arun Venkataramani (University of Massachusetts Amherst); Jim Kurose (University of Massachusetts Amherst); Simon Heimlicher (University of Massachusetts Amherst)

Various location-independent network architectures have been proposed... Most approaches for handling mobility boils down to: if A suddenly moves, how does B move the first message to A? three main approaches:
- indirection routing, where A has a home agent and informs it via a foreign agent whenever it moves (gsm, mobile IP, etc). But indirection entails data path stretch.
- Name-to-address resolution. Lookup/update overhead
- Name-based routing - difficult to implement well in practice. Whatt's the update cost, FIB size, path stretch? *Focus of the talk.*

Content mobility update cost is based on changing the best-port on a router (Whether or not it changes). The same works for IP-based or content-based routing. Changes with multi-homed content (multi-port updates, whether or not the set changes).

Empirical eval to quantify these metrics: mobility workload and topology and routing policy.
- Device mobility (couldn't find any public trace of network mobility, not physical) - developed an app to collect it from volunteers, 372+ users over 14+ months. Monitors changing network address and shows on the map just because it seems interesting to people. The goal is timestamps with IP.
- Content mobility - alexa top-1M domains, from a bunch of nodes, combining over time for a list of all IP addresses and them changing over time
- For routing running the mobility workload through RIPE route information bases to obtain forwarding table

High device mobility turns out to be the norm, not exception - number of transitions per day is up to >=10 IP addresses per day for 20% of users. What fraction of mobility events will be affected then? Up to 14% of events may affect certain routers, although depends on location. Works out to 2B mobile devices, 7 updates/day -> 4.8K updates/sec at some routers (doesn't look too bad actually).

For content mobility it is a lot better, but still high, mostly because the top pages delegate content delivery to CDNs.. If you go further down the long tail, the cost tends towards zero.

Takeway: mobility is the norm. Update cost of name-based routing is high for devices (might want to use something like GNS, the previous talk), but update cost of name-based routing small for content.

> Q: Are you assuming 1-to-1 correspondence of a name to a node?
>
> A: In name-based routing yes
>
> Q: So I'm asking because some of the proptotypes you've mentioned don't assume it.
>
> A: Multi-port forwarding both for content and for device considers that
>
> Q: I'm a little bit concerned about the result with the number of changes during the day - you get a new address whenever you connect to a new WiFi AP but it is not necessarily working. Does not necessarily mean you had to change the route.
>
> A: Whether or not it was necessary to change route was calculated in our tests

#### Lightweight Source Authentication and Path Validation
Tiffany Hyun-Jin Kim (Carnegie Mellon University); Cristina Basescu (ETH Zurich); Limin Jia (Carnegie Mellon University); Soo Bum Lee (Qualcomm); Yih-Chun Hu (UIUC); Adrian Perrig (ETH Zurich)

Limited control of paths means potentially diverted traffic, leaking data, fictitious premium path usage, etc. Current Internet does not provide path validation or source authentication.

Trying to detect *coward routers* (behave when they know they are being monitored) - Retroactive-OPT.
- No key setup before packet forwarding
- only when suspected misbehaviour
- routers commit some value during forwarding
- reveal keys use for the commitment later
- wrong key or incorrect commitment -> misbehavior

Source selects a set of parameters that other routers use for key setup, puts them in packet header + local secret in memory to derive the key. Each OPT downstream node derives a key using parameters in the header and local secret in memory, committing a path verification field (PVF) with 1 MAC operation. The intermediary router then forwards the MAC with PVG to the next router along with the parameter. The key can then be dynamically recreated for previous packets (but routers don't store any keys, only a single global secret value) when path needs to be validated.

Paper discusses all three OPT variations (main difference setting up keys in advance):
- retroactive
- OPT
- extended

Went through a formal analysis to prove that OPT can defend against a number of attacks - packet alteration, path deviation, coward attacks and state-exhaustion DoS attacks.

OPT seems to provide fairly good performance comapred to ICING (I was a little slow to catch the details). OVerall minimal storage and computational overheads on routers regardless of path length.

> Q: Can you clarify your attacker model? What happens if intermediate routers drop particular packets that do the validation?
>
> A: All we consider if the packet followed the intended path, so the attacker model is different.
>
> Q: But if attacker drops the packets for valdiation/key setup part is dropped, what happens?
>
> A: routers can only derive keys based on the parameters, but that's a very good question. One thing to notice is that we don't necessarily have to consider each individual router, so can select a set of stable routers on a stable path...
>
> Q: Does it somehow scale to an AS-level granularity?
>
> A: can be considered for any entities that are interested in performing the OPT model?
>
> Q: how would the keys be distributed
>
> A: can rely on RPKI


Done for today! Announcements, community feedback session and will be back tomorrow!






