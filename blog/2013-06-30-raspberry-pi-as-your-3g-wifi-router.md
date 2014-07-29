---
title: "RaspberryPi as your 3G WiFi router"
description: ""
categories: [tinkering]
date: 2013-06-30
tags: [RaspberryPi, 3G, WiFi]
---
Largely as part of another project, but partially for fun I decided to hook up my RaspberryPi to a 3G stick, a WiFi stick and make it share the 3G connectivity to my phones and laptop. Perhaps it isn't likely you will have all 3 of them but not an actual MiFi or any better connectivity option, but hey!

My setup was therefore:
- RaspberryPi with Debian (Raspbian) wheezy
- Huawei E173 3G stick
- TP-Link TL-WN821N WiFi stick

WiFi stick was working out of the box as a client, but there was some hassle with 3G...


## Basic configuration of the RaspberryPi

Before starting, I adjusted some of the default RaspberryPi settings:
- Reduced video RAM split to 16MB
- Expanded fielssytem to take up the whole 4GB card
- Disabled SSH server :)


## Setting up Huawei E173 on RaspberryPi

### usb_modeswitch to turn the modem on

The main problem with the 3G stick is that it starts in storage mode when plugged in by default. It might be a nice feature for Windows machines, but Linux drivers are not there anyway. The general rule is therefore to use *usb_modeswitch* to change the mode, but I still had to spend some time trying to find the right configuration for my device. In the end the solution that worked was based on a [RaspberryPi forum post](http://www.raspberrypi.org/phpBB3/viewtopic.php?f=66&t=35061)

Step-by-step instructions:
1. Find the current device product and vendor ID. My Huawei E173 was reporting 12d1:1c0b - ID of E173S according to other posts.

    lsusb | grep Huawei

2. Copy configuration file from usb_modeswitch configs (*/usr/share/usb_modeswitch/configPack.tar.gz*) for the device to */etc/usb_modeswitch.d/*. For reference, the config that worked for me was:

    <pre><code>
    DefaultVendor= 0x12d1
    DefaultProduct= 0x1c0b
    TargetVendor= 0x12d1
    TargetProduct= "1c05,1c07,1c08,1c10"
    CheckSuccess=20
    MessageContent= "55534243123456780000000000000011062000000100000000000000000000"
    </code></pre>

3. Check that udev rules (/lib/udev/rules.d/40-usb_modeswitch.rules) contain the following line:
    
    <pre><code>ATTRS{idVendor}=="12d1", ATTRS{idProduct}=="1c0b", RUN+="usb_modeswitch '%b/%k'"</code></pre>

4. Run usb_modeswitch:

    <pre><code>sudo usb_modeswitch -I -c /etc/usb_modeswitch.d/12d1\:1c0b -v 12d1 -p 1c0b</code></pre>

5. usb_modeswitch should tell you whether it succeeded in switching modes, but check lsusb just in case.


# wvdial to set up the connection 

Check if device mode has been switched in lsusb. If yes (modem on), configure wvdial to connect to the network:

    sudo wvdialconf

Edit the configuration file with network settings (lines up to Init3 are generated automatically by wvdialconf):

    [Dial Defaults]
    Init1 = ATZ
    Init2 = ATQ0 V1 E1 S0=0 &C1 &D2
    Modem Type = Analog Modem
    Baud = 9600
    New PPPD = yes
    Modem = /dev/ttyUSB0
    ISND = 0
    Init3 = AT+CGDCONT=1, "IP", "APN"
    Phone = *99***1#
    Password = 
    Username = 
    Auto DNS = 1
    Dial Command = ATDT
    Carrier Check = yes

Only 3 fields here are really configuration specific: APN, username and password. However the dial command can also be different for different devices. <pre>ATD*99***1#</pre> is essentially a legacy method, but I will cover the other one in a later post. The exact configuration I used for giffgaff network in UK was:

    [Dial Defaults]
    Init1 = ATZ
    Init2 = ATQ0 V1 E1 S0=0 &C1 &D2
    Modem Type = Analog Modem
    Baud = 9600
    New PPPD = yes
    Modem = /dev/ttyUSB0
    ISND = 0
    Init3 = AT+CGDCONT=1, "IP", "giffgaff.com"
    Phone = *99***1#
    Password = password
    Username = giffgaff
    Auto DNS = 1
    Dial Command = ATDT
    Carrier Check = yes

Almost done, start the connection:

    sudo wvdial

You should now see a *ppp0* network interface configured and have network connectivity.


## Configure WiFi AP

Now, configure the WiFi stick to work in host mode. Very nice and concise instructions are [here](http://www.pi-point.co.uk/documentation/), I just took them here ad adapted for completenes.

Install packages:

    apt-get install rfkill zd1211-firmware hostapd hostap-utils iw dnsmasq

Configure the daemons:

*/etc/network/interfaces*

    iface wlan0 inet static
    address 192.168.1.1
    netmask 255.255.255.0

*/etc/hostapd/hostapd.conf*

    interface=wlan0
    driver=nl80211
    ssid=YOURSSIDNAME
    channel=1

*/etc/dnsmasq.conf*

    # Never forward plain names (without a dot or domain part)
    domain-needed
    # Only listen for DHCP on wlan0
    interface=wlan0
    # create a domain if you want, comment it out otherwise
    # domain=
    # Create a dhcp range on your /24 wlan0 network with 12 hour lease time
    dhcp-range=192.168.1.5,192.168.1.254,255.255.255.0,12h
    # Send an empty WPAD option. This may be REQUIRED to get windows 7 to behave.
    #dhcp-option=252,"\n"

And a sequence of commands to bring the whole thing together:

    ifdown wlan0; ifup wlan0
    service dnsmasq restart
    echo 1 > /proc/sys/net/ipv4/ip_forward
    iptables -t nat -A POSTROUTING -j MASQUERADE
    hostapd -B /etc/hostapd/hostapd.conf

A brief explanation about what the commands do. The first two lines restart the interface and dnsmasq daemon. The 3rd and 4th lines set up forwarding between interfaces (we want a router, not just an AP!). Finally, the hostapd is started and the router is up and running.

