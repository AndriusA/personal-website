---
title: "Live-blog from SIGCOMM 2014 - day 1"
description: ""
tags: [SIGCOMM]
date: 2014-18-19
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

#### OpenNF: Enabling Innovation in Network Function Control
Aaron Gember-Jacobson (University of Wisconsin-Madison); Raajay Viswanathan (University of Wisconsin-Madison); Chaithan Prakash (University of Wisconsin-Madison); Robert Grandl (University of Wisconsin-Madison); Junaid Khalid (University of Wisconsin-Madison); Sourav Das (University of Wisconsin-Madison); Aditya Akella (University of Wisconsin-Madison)

#### Network stack specialization for performance
Ilias Marinos (University of Cambridge); Robert N.M. Watson (University of Cambridge); Mark Handley (University College London)
A Buffer-Based Approach to Rate Adaptation: Evidence from a Large Video Streaming Service
Te-Yuan Huang (Stanford University); Ramesh Johari (Stanford University); Nick McKeown (Stanford University); Matthew Trunnell (Netflix); Mark Watson (Netflix)