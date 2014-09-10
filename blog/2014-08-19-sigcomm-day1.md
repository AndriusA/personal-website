---
title: "Live-blog from SIGCOMM 2014 - day 1"
description: "The flagship annual conference of the ACM Special Interest Group on Data Communication (SIGCOMM) on the applications, technologies, architectures, and protocols for computer communication"
tags: [SIGCOMM]
date: 2014-8-19
categories: [conferences]
published: true
---

Good morning Chicago. On schedule for SIGCOMM today we have a keynote, some SDN, network architecture and middleboxing. As usual, there is also a live-blog at [layer9.org](http://layer9.org).

All the awards first:
- Best paper awards go to "Balacing Accountability and Privacy in the Network" and "CONGA: Distributed Congestion-Aware Load Balancing for Datacenters".
- Test of time awards go to "Internet Congeston Control for Future High Bandwidth-Delay product environments" by Dina Katabi, MArk Handley, and Charlie Rohrs and "Measuring ISP Topologies for Rocketfuel" by Neil Spring, Ratul Mahajan and David Wetherall.
- SIGOMM doctoral dissertation Award goes to Aaron Schulman on "Observing and Improving the Reliability of Internet Last-mile Links".
- the SIGCOMM award goes to George Varghese

### Keynote: Life in the Fast Lane

George Varghese (Microsoft Research)

A short summary wouldn't do justice to a great keynote, but in a nutshell it was a really great talk about finding the really interesting problems to solve, with examples form the past and suggestions for the future. The key is confluence between different ideas in a way that there is an inflection point in a way we start thinking about certain problems afterwards.


### Session 2: Data Plane

#### Duet: Cloud Scale Load Balancing with Hardware and Software
Rohan Gandhi (Purdue University); Hongqiang Harry Liu (Yale University); Y. Charlie Hu (Purdue University); Guohan Lu (Microsoft); Jitu Padhye (Microsoft Research); Lihua Yuan (Microsoft); Ming Zhang (Microsoft Research)

Phrasing load balancing as a translation from virtual IPs (VIP) to direct IPs (DIP). The idea is to use commodity switches as hardware muxes and a small number of software MUX as backstop to address issues with hmux...

Only two functionalities needed:
- split VIP traffic across DIPs (ECMP)
- Forward CIP traffic to DIPs (tunneling)

Key challenges:
- limited memory (workload: 100k+ VIPs and 1+ million DIPs). Single HMux can only support 512 DIPs for tunneling? Solution: partitioning VIPs across HMmux.
- Robustness. Availability when hmux fails - can't replicate enough. Use a small number of smux in addition to hmux, with all storing all VIP... Traffic only routed to software mux when hmux fails, automatically. VIP traffic is highly skewed (10% carry 99% traffic in azure). Duet handles 86 - 99.9% of traffic in HMux
- Assigning VIPs to minimize traffic handled by HMuxes (details in the paper)
- Migrating VIPs. Use SMux as a stepping stone during migration - withdraw VIPs from old location on hwadware mux and advertise again after migration is done.

Eval on azure - looks good :)

> Q: One advantage of SMux is inspection of traffic
>
> A: most of the time you dont need to be aware of the content, that's a benefit of using hmux
> 
> Q: how are VIP and DIP mappings changed in the setup?
>
> A: more details in the paper, but we used caching and modification of DIP functionality provided by the switches
> 
> Q: fairness? passing via hmux via smux.
>
> A: haven't found a requirement for fairness. And 99% of traffic passes via hmux, so there is no unfair scheduling for smux-> routed traffic even though latency is higher..

For other papers check layer9.org :)


### Session 3: Network Architecture (1)

#### Network Neutrality Inference
Zhiyong Zhang (U. of Electronic Science and Technology, China); Ovidiu Mara (EPFL); Katerina Argyraki (EPFL)

Neutrality violation should be transparent (legality is a different question). The questions:
- is it feasible to externally observe neutrality violations (not always - if and only if there exist one distinguishable virtual link in the equivalent neutral network)
- can they be localized?

Rely on multiple observations from different vantage points - inconsistent properties suggest non-neutral networks. Use tomographic sequence of equations about the traffic - a neutral network will have at least one solution. Extend to a formal specification which neutrality cases are externally observable.

Localization algorithm is based on time-sequences of measurements and inferring congestion probability based on the type of traffic (high vs low priority). Congestion probability is different for the types of traffic on a non-neutral path. For each link sequence it computes the "gap" (wasn't sure how it determines the threshold gap...) Such localization granularity on an emulator with a specific topology was 1.8 (links).

> Q: How does the algorithm work when you have route flapping?
> 
> A: We observe over time to make this work, so route flaps would have to not occur within minutes
> 
> Q: do you consider fair-queueing, which is non-neutral? If the flow rates are different, loss rates will be different
> 
> A: we did not have this problem, because we were looking at the levels of congestion and congestion frequencies rather than > instantaneous congestion> 
> 
> Q: in your simulations in additional to drop-tail did you try different queueing algorithms?
> 
> A: non in the paper, but now we are (e.g. RED), and it seems to work, but need more evaluation
> 
> Q: where do you get the topology information from?
> 
> A: standard tomography tricks, e.g. traceroute
> 
> Q: is it possible to distinguish between problems due to congestion vs wireless links being bad based on time of day/weather > which might correlate with the type of traffic?> 
> 
> A: I think yes, but we haven't done the testing on such behavior, but we might have to do something extra
> 
> Q: is it possible to actualy deploy it on the internet, using tools like traceroute
>
> A: I hope so, the plan is to now run on planetlab/emulab.
>
> Q: did you consider what happens when you have incomplete topology information
>
> A: as you loose granularity of topology, localization accuracy decreases...

#### Balancing Accountability and Privacy in the Network *Best Paper Award*
David Naylor (Carnegie Mellon University); Matthew K. Mukerjee (Carnegie Mellon University); Peter Steenkiste (Carnegie Mellon University)

Operators want accountability - who sends each packet so they cans topmalicious senders. Users want to hide who sends certain packets, so they can do stuff without the whole world knowing.

AIP [SIGCOMM 2008] has no privacy, requires a smart NIC, and shutoff is a stop-gap fix... Tor on the other hand has no accountability but is really heavyweight. There is nothing really in between because the source address is really overloaded - return address, accountability, id, error reporting, etc. So separate accountability and return addresses!

*Separate accountability and return addresses + delegated accountability + hidden return address = APIP.*

The network operators don't mind hiding the return address because they still have accountability.

- Sender registers with a delegate
- sends a brief about a packe to a delegate (brief(P)) "I just sent this packet". Brief sends a hash, possibly batching fingerprints in a bloom filter.
- router checks with the delegate whether it vouches for the packet (verify(P)). Packet in fingerprint cache and the flow has not been shutoff by the destination
- receiver can send shutoff to the delegate (shutoff(P)). Delegate marks the flow as blocked and tells the router to block the flow when the router asks to vouch for it. Two differences from IP shutoff : filtering happens at router not NIC and the delegate can contact client out-of-band.

What sort of overheads are we looking at? 
- brief
	- storage overhead for brief (fingerprints) just under 1GB
	- sending fingerprints 0.5%
- verify
	- computational - 78k verifies per sec in their traceroute
	- storage overhead 94MB which will easily fit within memory of a router

one trace in one network only, but looks promising..	

Hiding Return Addresses - no particular mechanism required or built-in, so two very simple examples: encryption end-to-end (no protetion from the receiver or source domain as it knows who sent the packet) and address translation at the boundary of the source network (but no protection from local observer; basically NAT).

In terms of deployment can either have third-party entities acting as delegates (e.g. symantec) or local networks acting as delegates for their clients. Potentially many different variations and combinations of these as well...

> Q: it seems like there is an easy way to get the best of both worlds. We already have protocols where you are using address translators to learn the transalted source address (e.g. STUN), so can reuse those techniques> 
> 
> A: I'm missing where the accountability comes in, so we could probably take this offline? I think this is a broader framework...
> 
> Q: you started off with TOR, so I got a bit confused. I can still tell you the source and destination with traffic analysis
> 
> A: we certainly don't give you the same guarantees as TOR, but the point is that you don't need such strong guaranteers for all traffic
> 
> Q: is it necessary for every router on the path to verify a packet with the delegate and if not is it possible for the routers to put incorrect/malicious accountability addresses
> 
> A: no, routers in the core probably wouldn't touch this (most effective when routers close to the source do). You could imagine that networks close to the edge do a good job on verification, so would end up with sampling to reduce the load. 
> 
> Q: how does shutoff work with transport protocols? it works in a 3-way handshake, but what about udp traffic?
> 
> A: doesn't solve the ddos problem, more about accountability and being able to log and address problems afterwards, because you don't want to kill connection setup latency completely.
> 
> Q: the way delegates are setup it seems like it introduces a single point of failure (the delegate) - is there any way to mitigate it?
>
> A: replicated servers, can rely on the same mecahnism with shutoffs, etc. (turtles all the way down). Discuss in the paper what is an eligible delegate


#### One Tunnel is (Often) Enough
Simon Peter (University of Washington); Umar Javed (University of Washington); Qiao Zhang (University of Washington); Doug Woos (University of Washington); Arvind Krishnamurthy (University of Washington); Thomas Anderson (University of Washington)

5 minutes in, still don't see what problem they're trying to solve...

Local problems cause global outages, so can we turn local reliability into global one?
Assuming:
- shorter paths are more reliable than longer ones
- simple packet processing is feasible at high speed border routers
- AS graph is relatively small and stable

ISPs offer a guaranteed QoS path across their network, a paid service akin to aws, etc. Constructing tunnels via such ISPs to an output target address. (users - enterprises/business-facing ISPs or cellular telcos).

Mechanisms:
- how do you know what tunnels are available? atlas published by ISPs, user/app-specific path selection
- how are packets encapsulated? Additional header before the encapsulated IP header

Packet authentication provided by ISP at setup, can be hashed with checksum of packet? Failover more lightweight than typical BGP supposedly. Have a mechanism for failure isolation...

Run the system on a small ISP. Impelmentation based on BGP-max.

Don't quite see how it builds up all the way to solving the stated problem.


### Session 4: Middleboxes And Network Services

#### A Middlebox-Cooperative TCP for a non End-to-End Internet
Ryan Craven (Naval Postgraduate School); Robert Beverly (Naval Postgraduate School); Mark Allman (International Computer Science Institute)

*Across all network sizes, the number of middleboxes is on par with the number of routers* [SIGCOMM 11]

Want to be able to detect those.

Overload 3 header fields: ISN, IPID and receive window with a function (sort of checksum) of packet headers. If any one of them gets changed, can recover from the other two.

Assumptions on the hash:
- only three sets of 12-bits
- assume o shared secret
- preimage and hash sent together
- primary goal is to reduce collisions
- need to reduce predictability of ISN

vs. checksum - if checksum is invalid packet is discarded but in this case want to accept packet and hopefully infer modifications.

Kernel implementation, increases mean processing time by about 10 microseconds (~8.5% of the total SYN/ACK processing time). Can mitigate with SYN cookies automatically when load gets too high.

Middlebox is simulated for early eval.
Over 26k port/path pairs across 197 ASes and 48 countries, on planetlab only. Different ports: 22, 80, 443, 34343 as well as a range of parameters in the option fields.

*Almost half of the nodes saw at least one in-path header modification and saw asymettric cases*.

"Demonstrated ease of deployment through mass Internet measurements" (Kernel modifications -> easily deployable?..)

> Q: Can you locate the middlebox/the path changing?
> 
> A: Related to an idea of building a catalogue of internet paths, but the point of HICCUPS is that you can use it on any path
> 
> Q: Do any middleboxes modify the winow itself?
> 
> A: That did happen in very very small instances. 
> 
> Q: How do you know where the change happened?
> 
> A: HICCUPS doesn't give you location on the path.
> 
> Q: No, which part of the header?
> 
> A: Details in the paper. You can choose to test (config) different sets of modifications

#### OpenNF: Enabling Innovation in Network Function Control
Aaron Gember-Jacobson (University of Wisconsin-Madison); Raajay Viswanathan (University of Wisconsin-Madison); Chaithan Prakash (University of Wisconsin-Madison); Robert Grandl (University of Wisconsin-Madison); Junaid Khalid (University of Wisconsin-Madison); Sourav Das (University of Wisconsin-Madison); Aditya Akella (University of Wisconsin-Madison)

Challenges in moving/copying/sharing internal network function state:
- diverse set of functionality in enterprise networks
- dealing with race conditions when updating routing while packets are in flight
- bounding overhead, since buffering of packets is needed in the network to address race conditions

API limited to move/copy/share state for simpicity, translated to export/import operations.

State created or updates by an NF applies to either a single flow or a collction of flows. Use e.g. to move http connection and state from one instance of Bro IDS to another. 

Pausing traffic + buffering packets doesn't really work to provide loss-free capabilities to OpenNF. One extra API is to observe/prevent updates using events - only need to change NF's receive packet function... A packet incoming during state transition triggers an event but not full processing - events are then processed at the second instance.

In some cases (e.g. Bro weird script checking handshake sequence) also need to make sure that packets arrive in the correct order. Introduce lock-step forwarding updates...

Eval - modified Bro IDS, iptables, squid cache and PRADS (3-8% of extra code for each to work with openNF).

Move times depend on state complexity and required guarantees but quite impressively handles hundreds of connections in a few hundred milliseconds.

> Q: have you looked context transfer protocol? Would allow P2P transfers, saving some resources
> 
> A: that one in particular doesn't ring a bell
> 
> Q: how would you contrast opennf with split/merge?
> 
> A: their focus is also elastic nf scaling, but their use-case does not necessarily generalise to all cases. Loss-free > guarantees is a big differences> 
> 
> Q: how many man-hours (vs LOC) were needed? How hard is it to develop it?
> 
> A: too many man-hours :) we've looked at some tain-tracking to capture the state, but needs more work. In terms of how we > should develop network functions in the future, there is potentially ways of decoupling network state and there are maybe > ways > of using shared memory or some other mechanisms to do it transparently> 
> 
> Q: can you give me a sense of whether your eval packet rates are reasonable? if not, what's the failure mode?
> 
> A: when you increase the packet rate, there is some increase in the transition time and potentially some packet delay

#### Network stack specialization for performance
Ilias Marinos (University of Cambridge); Robert N.M. Watson (University of Cambridge); Mark Handley (University College London)

Key motivation - scaling out -> 1 machine running N functions to N machines running 1 function.

Short flows cause high CPU load but low utilization (vs large flows the other way round). From previous work, 90% of HTTP objects are below 25 KB.

Design goals:
- transparent flow of memory from NIC to the application and vice versa
- reduce system costs (batching, cache-lcoality, etc)
- explotiing application-specific knowledge to reduce repetetive processing

Prototyped on top of FreeBSD's netmap: libnmio abstracting netmap-repated I/O, libeth for ethernet and libtcp for tcp/ip.

The results are very interesting (check the paper), but I've seen them presented during practice sessions, so just waiting for Q&A now :)

Q: You specialised but still kept the layering - isn't the logical conclusion to get rid of that as well?

A: We used layering to imrpove reusability, e.g. between web and DNS...

Q: Do your throughput gains come at the cost of latency?

A: I have a slide (laptop has been replaced by the next speaker...) - no, latency decreases as well when you have more than 4 concurrent connections.

Q: I was curious if you had data on how it scales to really small requests (e.g. serving SYN cookies) or just the minimal size packets in general

A: No, we haven't tested that


#### A Buffer-Based Approach to Rate Adaptation: Evidence from a Large Video Streaming Service
Te-Yuan Huang (Stanford University); Ramesh Johari (Stanford University); Nick McKeown (Stanford University); Matthew Trunnell (Netflix); Mark Watson (Netflix)

20-30% rebuffers are unnecessary and video rates are too low, i.e. could support something higher with existing infrastructure.

- video rate is chosen too aggressively
- lower rate saves rebuffering
- and video rate is chosen too slowly
- higher rate improves too slowly with changing environment

How is video rate picked? CDN simply serves a requested file and the rate selection logic is at the client:
- client estimates capacity
- but estimating future capacity from the past is difficult
- because throughput is often highly variable (34 times difference in an example case; 10% of netflix sessions experiences such variation, but the source of variation is not clear)

Can we do better?
- simple estimation over the first few minutes when you don't have an idea about the network could be useful
- but avoid capacity estimation in steady-state - information is encoded in the buffer occupancy

So how is network state encoded in the buffer occupancy? Video buffer is measured in video seconds rather than data, with different chunks of potentially different rate. Quite simply when the buffer is filling up, the rate is lower than the capacity.

Verification of algorithm on netflix - 500k users over a weekend, split into three groups: default algorithm, lower-bound (lowest video rate) and the adaptive algorithm.

Looking at rebuffer rates (time-series), lower-bound shows that up to 20-30% of rebuffers can be eliminated. The BBA is in betweent he old algorithm and the lower rate. Performance though is often better than the standard control algorithm.

> Q: you are basically doing closed-loop control, why did you not do something like a PID controller?
> 
> A: various other groups have tried it, even using buffer occupancy as a secondary signal, but what we found when the capacity varies wildly it doesn't work nicely?
> 
> Q: but my point is that you don't need capacity estimation with a PID estimation
> 
> A: it is a more involved discussion, maybe we can take offline..
> 
> Q: If you want to smooth the video rate (minimise the number of video rate changes), do you also need to consider capacity in addition to buffer
> 
> A: in the paper, but the trick is fixing the shape of the decision function
> 
> Q: if you look into pacing using techniques like congestion control
> 
> A: focus on client-side techniques
> 
> Q: variability in capacity only matters if you want to hit those peaks and you should be able to just work with a reasonable estimate. Couldn't better prediction or better control allow for a simpler scheme?
> 
> A: I would argue that you don't know what rate can be sustained and that's what the buffer tells you. If you can build up some knowledge about the client's environment than you can definitely improve the algorithm
> 
> Q: do you know how close do you get to the fair-share if bandwidth
> 
> A: we operate on top of HTTP, so we rely on TCP's fair-share properties
> 
> Q: For some users who might be willing to put up with some rebuffering in exchange to better quality, can you adapt the algorithm to allow some rebuffers to get better quality?
> 
> A: I don't have a definite answer to that
> 
> Q: do you have a sense of how far from optimal you are? since you can find out the optimal afterwards
> 
> A: we are working on it :)

Done for today, will be back tomorrow!