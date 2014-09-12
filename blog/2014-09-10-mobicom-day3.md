---
title: "Live-blog from MobiCom 2014 - day 3"
description: "The Annual International Conference on Mobile Computing and Networking"
tags: [MobiCom]
date: 2014-09-10 9:00
categories: [conferences]
published: true
---

The last day of MobiCom '14 started off with the student research competition, followed by the second session on positioning and navigating and people slowly trickling in.

### Paper Session #7: Positioning and Navigating behind the Doors 

#### Luxapose: Indoor Positioning with Mobile Phones and Visible Light 
Ye-Sheng Kuo (UMich); Pat Pannuto (UMich); Ko-Jen Hsiao (UMich); Prabal Dutta (UMich)

> Q: how does location accuracy deterioriate outside the immediate area covered by the lights (directly below)
>
> A: haven't tested it, but it will decrease of course
>
> Q: how dense should the LED lights be in the ceiling? How does that compare to current deployments?
>
> A: Our paper discusses the problem and I don't have the number on the top of my head, but possibly too high for many commercial deployments. But localization with this approach is very efficient so may be worth it
>
> Q: Given that you rely on different frequencies of light flickering, how many different combinations can you possibly have?
>
> A: Could do alternating frequencies to increase the number of combinations, but a single static video would not be sufficient - need to do processing over an image


#### Experiencing and Handling The Nonuniform Data Density and Environment Diversities in Indoor Positioning Service 
Liqun Li (MSR); Guobin Shen (MSR); Chunshui Zhao (MSR); Thomas Moscibroda (MSR); Jyh-Han Lin (Microsoft); Feng Zhao (MSR) 

Trying to evaluate different localization techniques given a certain database of measurements and environments.

For microbenchmarking, compare EZPerfect and RADAR
- Data density matter: fingerprint- and model-based approaches are more suitable for different densities - EZPerfect better for sparse databases and vice versa
- local area exhibits similar fitness errors for environmental locality

The opportunities are:
- automatically adapt to training data density, maybe be altered over time
- automatically explore the enviormental locality

Eval of the proposed algorithm (Modellet) tweaks in 13 large malls
- Virtual fingerprint density can eliminate the robustness of fingerprint matching, in a particular case 5m density performs the best
- Modellet outperforms EZPerfect and Radar in all tests
- Location error tends to be between about 10 and 30 meters

> Couldn't really hear the question/answer
>


#### Travi-Navi: Self-deployable Indoor Navigation System 
Yuanqing Zheng (NTU, MSR); Guobin Shen (MSR); Liqun Li (MSR); Chunshui Zhao (MSR); Mo Li (NTU); Feng Zhao (MSR) 

Localization systems are difficult to deploy, collect data and lack the incentives and/or compelling applications...

Focusing on self-motivated users - shop owners and early customers.

Vision based approach - capture images along a path and guide the user by showing him pictures of the directions.

Very clever sensor fusion to improve image quality while walking - accelerometer, gyro, etc.

There are still many redundant images, e.g. would want to send fewer images on straight pathways to the backend for storage and processing.

Correct and timely direction still difficult - need to quickly track the user - step detection and heading direction (again sensor fusion of gyro, accel and compass). Do a particle filter on those. Errors accumulate, so also use WiFi signals for recalibrating.

To increase coverage identify overlaps and crossovers of the paths - sounds neat!

> Q: What are the incentives for the guides in this system?
>
> A: We mainly rely on shop owners to do this
>
> Q: You talk on how to identify a cross point and only rely on WiFi signal - would that also depend on AP deployment, e.g. the V-shaped signal strength curve may not always be available..
>
> A: From the experiments we have always seen this shape
>


#### Accurate Indoor Localization With Zero Start-up Cost 
Swarun Kumar (MIT); Stephanie Gil (MIT); Dina Katabi (MIT); Daniela Rus (MIT) 

Ubicarse - tens of cm localization accuracy on commercial tablet. Instead of using an antennae array for localization (not available), move the device around and use the circular trajectory measurements as an array.

For SAR based systems trajectories need to be perfectly circular - not the case when a user is moving a device in her hand, need to transform the recorded trajectory into a perfect circle. Solution - use the relative trajectories between two antennas and look at trajectory of one antenna from the frame of reference of the other one.

Also prove that SAR on relative trajectories of 2 antennas is equivalent to a circular SAR array!

Experimental results in a large MIT library with 5 APs
- median accuracy 25cm
- two-antenna array ~7m


> Q: you still do need location of access points? You developed the system for a tablet, how does it work on smartphones?
>
> A: no (didn't get why). We are porting implementation to smartphones, but you need access to the WiFi chipset so it is somewhat difficult
>
> Q: Moving further, how to make it work more naturally, e.g. 
>
> A: currently in future work!
>
> Q: In array antennas you get the signal received at the same time while here you have the time difference as well
>
> A: yes, that's where all the maths comes in
>
> Q: yes but what if the wireless signal fluctuates over that interval of time?
>
> A: we're gathering multiple snapshots so we can filter it out
>
> Q: There is spinbo* (some other approach), can you compare?
>
> A: The principle of rotating was there, but they relied on signal power because only that was available

### Paper Session #8: Smart Devices 

#### Magnetic MIMO: How To Charge Your Phone in Your Pocket 
Jouya Jadidian (MIT); Dina Katabi (MIT) 

Impressive demonstration of wireless charging over a distance, any orientation etc.

Sorcery!

Borrowing from MIMO and beamforming for magnetic field. Impressively the mathematical model is the same as for wireless transmission. Hence channels are magnetic coupling and symbols are currents, using the same framework.

In beamforming Rx measures channels and reports to Tx. Cannot do it here - Rx is out of power. But magnetic field goes both ways - induced current at Rx affects Tx...

> Q: how much heat does it generate?
> 
> A: one order of magnitude smaller than current chargers
> 
> Q: what if there are other objects nearby that absorb the magnetic field
> 
> A: particular to some class of charging system (resident charging) with a particular resonance frequency. Highly unlikely and we have a method for detecting it
>
>Q: what happens to a credit card?
>
>A: nothing happened in our tests!
>
>Q: Programmable conductors are difficult
>
>A: a very simple digital program, e.g. using Arduino, you only adjust the current.


#### Rethink Energy Accounting with Multi-Player Game Theory 
Mian Dong (Samsung); Tian Lan (George Washington University); Lin Zhong (Rice) 

Attributing energy accurately to software is extremely difficult and there is basically no ground truth. Some of the problems are fundamental: how do you attribute the base energy when there are different numbers of software components running?

Energy consumption is a cooperative game...

A bunch of details about measuring energy consumption of a software component. More interesting is the estimate of missing samples (software components):
- problem reduced to a set of linear equations
- solving an approximate version of the game
- most of the estimates are ~90% accurate, but most E(s) observed

For eval using battery with high-speed measurement chip.

Doesn't work when software activities cannot be timed (e.g. async i/o), but neither existing approaches. Also may not be accurate for a short time period. No insight into what (hardware) resources consume the energy.

(very nice work overall!)

> Q: You assume that players are cooperative, how well does the assumption work?
>
> A: Cooperative here only means that they do not play in isolation
>
> Q: What frameworks do you need and how well does it generalize?
>
> A: We only need to know the overall consumption and software running
>
> Q: It is easy to know which process is running, but how do you evaluate network?
>
> A: network is async io, so that is definitely an inaccuracy. Would be fixed if the network stack gave you a notification that a packet has been sent.
>


### Paper Session #9: Advanced Techniques 

#### Robust Network Compressive Sensing 
Yi-Chao Chen (UTAustin); Lili Qiu (UTAustin); Yin Zhang (UTAustin); Zhenxian Hu (Huawei); Guangtao Xue (SJTU) 

Main motivation is for traffic engineering, spectrum sensing and channel estimation. The goal is to fill in missing values from incomplete, erroneous and/or indirect measurements.

Not all traffic measurement matrices are low-rank, making it difficult. Also certain types of networks (#G, Cister RSSI) have poor temporal stability. Adding anomalies can further increase the rank.

Need a new matrix decomposition robust against error/anomalies.

Decompose matrix to a low rank matrix, a sparse anomaly matrix and a small noise matrix... An efficient optimization algorithm on the matrix (the details went too fast for me). 

> Q: have you looked at probabilistic matrix factorisation?
>
> A: no, not really
>
> Q: related, anomalies must occur in some structure
>
> A: yes, if there is  no structure at all, there is not much you can do

#### EkhoNet: High Speed Ultra Low-power Wireless for Next Generation Sensors 
Pengyu Zhang (UMass); Pan Hu (UMass); Vijay Kumar P (UMass); Deepak Ganesan (UMass) 

In theory backscatter systems can be extremely low power, in practice not quite true. The problem is supposedly many layers of indirection between a sensor and communication. In backscatter communication more expensive than computation (?).

Eval with WISP5.0 (MSP430 FR5969) for the short-stack. Consumes 37uW @ 44kHz.

Achieve less than 100uW for high rate sensors (1MBps)!

How to coordinate? Intelligence should be at the reader. Balances TX energy efficiency, channel quality and data quality.

> Q: Some of your devices are battery powered and some are not. How low does your power consumption need to be?
>
> A: depends on how much energy you need to harvest. If only WiFi signals are available for example, you would still need to duty-cycle your system


### Paper Session #10: WiFi: Beyond the Traditional 

#### We Can Hear You with Wi-Fi! 
Guanhua Wang (HKUST); Yongpan Zou (HKUST); Zimu Zhou (HKUST); Kaishun Wu (HKUST); Lionel M. Ni (HKUST) 

Use mouth movement to detect speech:
- detect mouth
- infer mouse movements (crucial to remove multipath signal propagation)
- noise removal
- run wavelet transform and learning-based lip reading

MIMO beamforming towards a body. Lip reading mainly uses existing speech recognition techniques - MCFS features.

Show how it performs with multiple targets and dynamic environments, but without an explanatio why - hoping to see those in the paper.

> Q: how did you choose the threshold of 500ns for multipath signal propagation threshold?
>
> A: (shortened answer) a lot of experimentation and related works
>
> Q: you mentioned that acoustic techniques do not work as well, can you explain more why?
>
> A: as you mention, this could be another way to do it. Maybe privacy concerns are addressed better as well - you only need to move your mouth rather than speak out aloud for example.



#### E-eyes: In-home Device-free Activity Identification Using Fine-grained WiFi Signatures 
Yan Wang (Stevens); Jian Liu (Stevens); Yingying Chen (Stevens); Marco Gruteser (Rutgers); Jie Yang (Oakland University); Hongbo Liu (Indiana University-Purdue University Indianapolis)

Basic idea is to use CSI measurements to infer activities such as being in place and walking - walking causes higher variance in the measurements. The patterns however are different depending on a trajectory and in fact are dominated by the movement path.

Different rounds of same in-place activities result in similar distributions of CSI.

Activity profiles need to be constructed and stored though - may change in the future. Do non-profiling clustering for semi-supervised approach to cluster daily activities and update CSI profiles.

- How robust is it? In two different apartments (small/large). Achieve more than 90% true positive and less than 5% false positive with just one WiFi AP for stationary activity. >90% average accuracy for walking activity
- Cand ifferent activities in the same location be distinguished? (quick slide showing yes, also above 90%)
- How does it change with different packet rate? 5 pkts/s to 20 pkts/s. With at least 10 packets over 90% true positive and <2% false positive.

> Q: How does the algorithm change with multiple people in a room?
>
> A: Need to construct different profiles
>
> Q: Why did you just use RSS if you already had access to CSI? Why don't you use the phase?
>
> A: We found the phase of the CSI information is hard to predict compared to the amplitude
>
> Q: Do you use any doppler processing in combination to RSS? RSS gives you the distance, seems like why you have a pretty good accuracy, but if you added phase you'd probably get a lot more interesting results
>
> A: We haven't done it, but I guess it would be an interesting direction
>
> Q: What are the impacting factors indoors?
>
> A: The environments can change a lot by moving furniture and such. In that case our system would try to adaptively update its profiles...
>

Done with the last session of MobiCom 2014! Time for awards and closing of the conference!
