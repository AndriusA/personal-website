---
title: "Live-blog from SIGCOMM 2014 - day 2"
description: "The flagship annual conference of the ACM Special Interest Group on Data Communication (SIGCOMM) on the applications, technologies, architectures, and protocols for computer communication"
tags: [SIGCOMM]
date: 2014-18-20 8:30
categories: [conferences]
published: true
---

Starting nice and early with the second day. Just in case you haven't noticed, papers are available during the conference from the [program webpage](http://conferences.sigcomm.org/sigcomm/2014/program.php). Perhaps unsurprisingly the hall is not very crowded this morning, but the papers look interesting.

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

#### Using RDMA Efficiently for Key-Value Services
Anuj Kalia (Carnegie Mellon University); Michael Kaminsky (Intel Labs); David Andersen (Carnegie Mellon University)

#### FastPass: A Zero-Queue Datacenter Network Architecture
Jonathan Perry (MIT); Amy Ousterhout (MIT); Hari Balakrishnan (MIT); Devavrat Shah (MIT); Hans Fugal (Facebook)

#### FireFly: A Reconfigurable Wireless Datacenter Fabric using Free-Space Optics
Navid Hamedazimi (Stony Brook University); Zafar Ayyub Qazi (Stony Brook University); Himanshu Gupta (Stony Brook University); Samir R Das (Stony Brook University); Vyas Sekar (Carnegie Mellon); Jon P Longtin (Stony Brook University); Himanshu Shah (SBU); Ashish Tanwer (SBU);

#### A "Hitchhiker's" Guide to Fast and Efficient Data Reconstruction in Erasure-coded Data Centers
K. V. Rashmi (UC Berkeley); Nihar B. Shah (UC Berkeley); Dikang Gu (Facebook Inc.); Hairong Kuang (Facebook Inc.); Dhruba Borthakur (Facebook Inc.); Kannan Ramchandran (UC Berkeley)


### Session 8: Network Architecture (2)

#### *Best of CCR*: Bridging the Gap between Internet Standardization and Networking Research
Aaron Yi Ding (University of Cambridge), Jouni Korhonen (Broadcom), Teemu Savolainen (Nokia), Markku Kojo (Helsinki Institute for Information Technology), Joerg Ott (Aalto University), Sasu Tarkoma (University of Helsinki), Jon Crowcroft (University of Cambridge)

#### A Global Name Service for a Highly Mobile Internet
Abhigyan Sharma (University of Massachusetts Amherst); Xiaozheng Tie (University of Massachusetts Amherst); Hardeep Uppal (University of Massachusetts Amherst); Arun Venkataramani (University of Massachusetts Amherst); David Westbrook (University of Massachusetts Amherst); Aditya Yadav (University of Massachusetts Amherst)

#### Towards a Quantitative Comparison of the Cost-Benefit Trade-offs of Location-Independent Network Architectures
Zhaoyu Gao (University of Massachusetts Amherst); Arun Venkataramani (University of Massachusetts Amherst); Jim Kurose (University of Massachusetts Amherst); Simon Heimlicher (University of Massachusetts Amherst)

#### Lightweight Source Authentication and Path Validation
Tiffany Hyun-Jin Kim (Carnegie Mellon University); Cristina Basescu (ETH Zurich); Limin Jia (Carnegie Mellon University); Soo Bum Lee (Qualcomm); Yih-Chun Hu (UIUC); Adrian Perrig (ETH Zurich)