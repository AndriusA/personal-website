---
title: "Live-blog from SIGCOMM 2014 - day 3"
description: "The flagship annual conference of the ACM Special Interest Group on Data Communication (SIGCOMM) on the applications, technologies, architectures, and protocols for computer communication"
tags: [SIGCOMM]
date: 2014-8-21 10:30
categories: [conferences]
published: true
---

Today I'm only starting to take notes for the wireless session. Somewhat amusingly the room is empty compared to the datacenter scheduling session in the morning, but there really is some good stuff!

### Session 10: Wireless (2)

#### Vidyut: Exploiting Power Line Infrastructure for Enterprise Wireless Networks
Vivek Yenamandra (The Ohio State University); Kannan Srinivasan (The Ohio State University)

The point is to (de-)sychronize WiFi APs for MIMO by using power line frequency phase differences to avoid interference. A whole lot of considerations to get the reference frequency right, use three-phase power supply, etc. etc.

> Q: since every access point would be connected to ethernet, have you considered using IEEE something something synchronization protocol?
> 
> A: that is something that can be looked into... muble muble
> 
> Q: In terms of range, did you have a chance to compare it between yours and existing systems'?
> 
> A: the paper has measurements how far you can synchronize (up to 200 feet there is no problem)
> 
> Q: You mentioned network MIMO in WiFi, but another major use of network MIMO is cellular. Wondering if you could use similar approach for this type of network outdoors over a long range? Or does it work only indoors?
> 
> A: If you have micro femtocells indoors connected over power lines, I'd say for sure it would work. Outdoors though the types of transformers are different, so it might be a lot more difficult.


#### Wi-Fi Backscatter: Internet Connectivity for RF-Powered Devices
Bryce Kellogg (University of Washington); Aaron N. Parks (University of Washington); Shyamnath Gollakota (University of Washington); Joshua R. Smith (University of Washington); David Wetherall (University of Washington)

Can we get Wi-Fi connectivity for 15 microW?

Key idea is piggybacking on Wi-Fi packets - transmitting 1 by reflecting packets and 0 by not reflecting, which changes RSSI. Changing reflection turns out to take 0.65 microWatts.

Cannot decode packet headers, so can't know which device will be receiving it, so per-packet backscatter won't work. Instead bin backscatter into time slots (reflect/not reflect each packet in a timeslot), use WiFi timestamp to reconstruct bits. 

- How does it work in a network of wifi devices then? WiFi device sends CTS to precent other devices sending and messing up the data.
- How does a wifi device send data to the tag? WiFi uses OFDM, which has high peak-to-avg power ratio, so can detect packets on the tag by finding peaks.
- How do we design a network with multiple tags in it? Use request-response with each tag. None of the tags transmit concurrently, since they are only slaves to a WiFi device

Rate and range depends on distance, but can have 100 bps uplink from a tag over a 2.2m radius (order of magnitude more downlink).

Does AP location affect backscatter decoding? In the experiments probability of correct reception ranges from 94% to 99%, so it works reasonably well even when you have devices in a different room, not just different positions.

Does backscatter affect WiFi decoding? In most cases not much (somewhat depends on AP location again), since WiFi is designed to work with multipath signal propagation.

How does it work on a busy network? 8-15 people, University WiFi as an AP? Over a working day? More traffic -> faster rates. 

> Q: when you have multiple APs on the same channel, you could be reflecting a combination of the signals, so your signal may be very unpredictable.
>
> A: We can handle that by looking at the source of wifi packets at receiver by looking at the mac address, which gives consistency
>
> Q: Don't you have the same problem with RFID transmitting with the CTS-to-self? Wouldn't the device have to send a CTS as well?
>
> A: The device doesn't do full WiFi, so it wouldn't care. Potentially if there are lots of other packets in the network then it could interfere with the signal
>
> Q: Seemed like communication detection to backscatter and peak detection was a little clumsy, wouldn't there be a simpler way of doing detection apart from peak detection?
>
> A: We are looking at different options, so yes, sure
>
> Q: Good work on modulating micro reflectors? Pointer to previous work
>
> Q: Essentially you do polling to support multiple tags, wouldn't it reduce rates a lot?
>
> A: Basically how RFID works and choosing between who's talking
>
> Q: When you have the CTS example, have you experimented with different APs using same frequencies?
>
> A: Tested in a very control environment as well as university WiFi which has like 8 other networks in the area
>

#### Turbocharging Ambient Backscatter Communication
Aaron N. Parks (University of Washington); Angli Liu (University of Washington); Shyamnath Gollakota (University of Washington); Joshua R. Smith (University of Washington)

Existing devices do expensive digital computation, which can't be done with battery-less devices with the amount of power available. Need to go analogue:
- inroduce mult-antenna cancellation design  (10 kbps - 1 mbps) - got a little lost in how it works...
- first analog coding technique for long-range backscatter comms (2 feet -> 20 meters) - each bit is expanded into a sequence of symbols to add redundancy... But cross-correlation is too expensive. Use a periodic code to remove the need for sync.

Pretty cool hw prototype (size of credit card), using 422uW for multi-antenna and 8.9uW for coding cirtuit!

Multiple antennae provide 100x gain (cf their last year's paper at sigcomm). How? Completely cancel TV signal with multi-antennae rather than average to cancel it.

Does it work in non-line-of-sight? Turns out to work even across 3 walls with enough incident power.

> Q: can you get linear gains on top of that with more than 2 antennae?
>
> A: probably not with the same sort of gains, but there is a lot more work tobe done for further gains and bette techniques
>
> Q: If there are multiple signals available, it is not going to be able to work?
>
> A: The receiver is frequency-selective enough to only receive one signal, but even if it did, it would not affect much because it should only add to the coefficient in our analogue processing equation
>
> Q: have you considered CMOS analogue implementation for your design?
>
> A: definitely interested in more advanced analogue designs, the prototype was really simple using commercial off-the shelf hw for now
>

And the last two sessions are only of general interest to me, so I'm not really taking notes.

Overall a great SIGCOMM!