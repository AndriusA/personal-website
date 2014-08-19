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
> A: most of the time you dont need to be aware of the content, that's a benefit of using hmux
> 
> Q: how are VIP and DIP mappings changed in the setup?
> A: more details in the paper, but we used caching and modification of DIP functionality provided by the switches
> 
> Q: fairness? passing via hmux via smux.
> A: haven't found a requirement for fairness. And 99% of traffic passes via hmux, so there is no unfair scheduling for smux-> routed traffic even though latency is higher..


### Session 3: Network Architecture (1)

#### From the Consent of the Routed: Improving the Transparency of the RPKI
Ethan Heilman (Boston University); Danny Cooper (Boston University); Leonid Reyzin (Boston University); Sharon Goldberg (Boston University)

#### Network Neutrality Inference
Zhiyong Zhang (U. of Electronic Science and Technology, China); Ovidiu Mara (EPFL); Katerina Argyraki (EPFL)

#### Balancing Accountability and Privacy in the Network
David Naylor (Carnegie Mellon University); Matthew K. Mukerjee (Carnegie Mellon University); Peter Steenkiste (Carnegie Mellon University)

#### Measuring IPv6 Adoption
Jakub Czyz (University of Michigan); Mark Allman (International Computer Science Institute); Jing Zhang (University of Michigan); Scott Iekel-Johnson (Arbor Networks); Eric Osterweil (Verisign Labs); Michael Bailey (University of Michigan)

#### One Tunnel is (Often) Enough
Simon Peter (University of Washington); Umar Javed (University of Washington); Qiao Zhang (University of Washington); Doug Woos (University of Washington); Arvind Krishnamurthy (University of Washington); Thomas Anderson (University of Washington)

### Session 4: Middleboxes And Network Services

#### A Middlebox-Cooperative TCP for a non End-to-End Internet
Ryan Craven (Naval Postgraduate School); Robert Beverly (Naval Postgraduate School); Mark Allman (International Computer Science Institute)

#### OpenNF: Enabling Innovation in Network Function Control
Aaron Gember-Jacobson (University of Wisconsin-Madison); Raajay Viswanathan (University of Wisconsin-Madison); Chaithan Prakash (University of Wisconsin-Madison); Robert Grandl (University of Wisconsin-Madison); Junaid Khalid (University of Wisconsin-Madison); Sourav Das (University of Wisconsin-Madison); Aditya Akella (University of Wisconsin-Madison)

#### Network stack specialization for performance
Ilias Marinos (University of Cambridge); Robert N.M. Watson (University of Cambridge); Mark Handley (University College London)
A Buffer-Based Approach to Rate Adaptation: Evidence from a Large Video Streaming Service
Te-Yuan Huang (Stanford University); Ramesh Johari (Stanford University); Nick McKeown (Stanford University); Matthew Trunnell (Netflix); Mark Watson (Netflix)