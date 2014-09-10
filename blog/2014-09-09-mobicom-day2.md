---
title: "Live-blog from MobiCom 2014 - day 2"
description: "The Annual International Conference on Mobile Computing and Networking"
tags: [MobiCom]
date: 2014-09-09 12:00
categories: [conferences]
published: true
---

After yesterday's 10:30PM finish starting late today with a brunch and a keynote from Leonard Kleinrock (most well known for his early work on queueing theory)!


### Paper Session #4: Rethinking WLANs 

#### Enfold: Downclocking OFDM in WiFi 
Feng Lu (UCSD), Patrick Ling (UCSD); Geoffrey M. Voelker (UCSD); Alex C. Snoeren (UCSD) 

WiFi transmissions are power-hungry and can't always stay in sleep mode. Downclock OFDM to save energy.

Downclocked OFDM signalling (25%) is not decodable in general, unless yhere is a finite set of values for the unknowns.

Effectively trading off SNR for energy savings using lower data rates while remain downclocked.

Eval based on packet traces, using 12 popular apps. 25%-30% for low-rate apps.

> Q: OFDM systems tend to be quite sensitive. If I got it correctly you don't do the downclocking for all symbols (piling, training...), is that correct? How does it work for channel estimation? Frequency signalization has to be done at basically every frame, how do you downclock that?
>
> A: We do for all. Accuracy of frequency signalization would be affected, but we show in a paper it is not a lot
>
> Q: You released the channel capacity by a factor of 10, that's a huge loss.
>
> A: For many of the apps they spent very little time in actual transmission, so capacity is not that important. Time penalty is <15% of extra airtime..
>
> Q: Let me share some insights from the microarchitecture community: it all depends on how much there is static power consumption vs dynamic power consumption. Typically the static part is large, so you want to run as fast as you can, finish and shutdown, while you are saying the opposite. There is also a lot of work about being more aggressive with going to sleep...
>
> A: (referring back to a slide wiht energy eval) depends on app scenario and hardware...
>

#### Combating Inter-cell Interference in 802.11ac-based Multi-user MIMO Networks 
Hang Yu (Rice); Oscar Bejarano (Rice); Lin Zhong (Rice) 

The key question is how to achieve coordinated interference cancellation with low overheads.
- coordination can be expensive
- optimizing beamforming weights requires full channel knowledge

Relaxes both constraints partially by interleaving channel sounding in 802.11ac... (I really lack the necessary knowledge on 802.11ac to grasp the detail quickly).

> Q: (rephrasing) why beamforming is appropriate for mimo?
>
> A: confusion probably from single-user mimo vs multi-user, ours is multi-user to improve the overall capacity
>
> Q: with all the work happening in 3gpp and the industry, why do you only focus on WiFi? Perhaps some of the work is applicable?
>
> A: In WiFi the case we are focusing on we don't have any backbone channel for coordination...
>
> (got lost in the followup discussion of questions and answrs from the same pair)
>


#### Enabling Phased Array Signal Processing on Commodity WiFi Access Points 
Jon Gjengset (University College, London); Jie Xiong (University College, London); Graeme McPhillips (University College, London); Kyle Jamieson (University College, London) 

Boils down to the applications you want to build, e.g. loalization systems. Can't do them on today's APs really. Phaser addresses that

- A single 802.11 NIC is not enough to scale up the number of antennas, but array processing increases in fidelity with the number of them
- NICs measure the channel at different times, so can't directly compare phase of same sample index
- Oscillators are not frequency locked between NICs
- sampling rate varies between NICs


Two observations:
- time-domain shift is subcarrier dependent rotation
- time-domain rotation is equal to frequency domain rotation

Need to find a set of rotations to apply to one NIC to sync with another one.

Shared information is key 0 share an antenna using a splitter. Can simply measure the rotation for each sample

The second thing is oscillator alignment - frequency-locked, but have phase offsets... Third - multipath throws off AoA (angle of arrival) estimate... Some quick details on solving it.

Eval in a controlled environment (anechoic chamber, 5 antennas) is quite convincing!

Next, autocallibration of four APs indoors. AoA estimate error 2.5 deg. median, 6.5 95th percentile.

> Q: how much accuracy do you get from extra anennae? what is the bound of how many them do you need? Also, can you do MIMO uplink with this?
>
> A: there is a lot of analysis in the original array count paper ont these numbers, but from our results with 3 antennas the accuracy is quite bad, while with 5 - a lot better and the more you add. Sync is not enough to do MIMO, the goal is purely to have a biger antenna array.
 


### Paper Session #5: The Wide-Area Experience 

#### Discovering Fine-grained RRC State Dynamics and Performance Impacts in Cellular Networks 
Sanae Rosen (UMich); Haokun Luo (UMich); Qi Alfred Chen (UMich); Z. Morley Mao (UMich); Jie Hui (T-Mobile); Aaron Drake (T-Mobile); Kevin La (T-Mobile) 

> Q: your goal is to characterise the typical RRC state dynamics, but you are causing the transitions, so to what extend do your perturbations affect the transitions?
>
> A: we don't necessarily always get the complete set of inter-packet intervals, but the network does not start behaving any differently because of that
>


#### A Practical Traffic Management System for Integrated LTE-WiFi Networks 
Rajesh Mahindra (NEC Labs America); Hari Viswanathan (Rutgers); Karthik Sundaresan (NEC Labs America); Mustafa Y. Arslan (NEC Labs America); Sampath Rangarajan (NEC Labs America) 

Essentially what is known as WiFi offloading (and a veyr long intro/motivation, with some more related work and commercial solutions).

Overlay solution over current networks - standards compliant
- network interface assignment (NIA) algorithm to dynamically map user traffic flows to appropriate LTE basestation/AP
- interface switching service (ISS) to switch current user flows between the interfaces

Aissgn basestation/AP to each flow to maximize sum of user flows' QoE (utility). Pricing function based on data usage or price/byte. Problem is NP-hard, so do a greedy algo - consider each AP-basestation in isolation and fix assignment for AP that maximized incremental utility.

ISS controller sits in the network, interacts with clients using HTTP, through an HTTP proxy... The proxy switches the interface to send the data on.

(running out of time...)


#### Modeling Web Quality-of-Experience on Cellular Networks 
Athula Balachandran (CMU); Jeffrey Pang (ATT Labs - Research); Vaneet Aggarwal (ATT Labs - Research); Emir Halepovic (ATT Labs - Research); Srinivasan Seshan (CMU); Shobha Venkataraman (ATT Labs - Research); He Yan (ATT Labs - Research)

Network providers don't have access to either endpoint, so need to estimate QoE purely from network traces. One example is click detection algorithm...

Cellular network factors include signal strength, throughput, cell load, failures....

Collected dataset over 1 month over a major metropolitan area  (network traces) - radio network logs and network traces for QoE.

Interstingly, cell load and signal strength are dependent (*ahem* - correlated?) and a bunch of other complex inter-dependencies.

Modelling
- patial download ratio
- session length
- user will abandon or not
- there will be partiall downloaded objects or not?

Need to incorporate external factors for an accurate model to predict precise QoE... Updates accuracy for the latter two is 74% and 84% respectively.

Q: From the click detection algorithm, how do you detect the ground truth?

A: for part of the traces we manually labelled them

Q: The predictors are they general across all users?

A: yes

Missing the last session of the day on location to setup the demo. Just one minute madness demo pitching and the demo session. I will be presenting our [phonelets](http://phonelets.smart-e.org/) work!.