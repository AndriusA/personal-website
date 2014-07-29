---
title: "RaspberryPI, 3G and Ofono"
description: ""
tags: [RaspberryPi, 3G, Ofono]
date: 2013-06-30
categories: [tinkering]
---

I ended up using ofono with a 3G stick and since that turned out to be more tricky than it should be, decided to write it up here in hope that it might help someone.

## Using Ofono with 3G stick:

Use usb_modeswitch as above, and build ofono from source (1.9.2 as of writing) - there was only 1.6 available for debian wheezy on raspberry Pi. After a bit of fiddling with autotools (because I'm not good at using them), including aclocal, autoheader, libtoolize, automake --add-missing and autoconf, the configuration file is built and you can ./configure && make && make install

Some pre-requisites for Ofono:

    mobile-broadband-provider-info
    libudev-dev
    libdbus-1-dev
    libglib2.0-dev

To also build tools of ofono (in tools/ dir):

    libusb-dev
    libusb-1.0

To use python test scripts (in test/ dir):

    python-dbus
    python-gobject

Also load appropriate kernel modules:
usb serial:

    modprobe usbserial vendor=0x12d1 product=0x1c05 

tuntap:

    modprobe tun

With no extra work I could get the modem to register to the network, but when trying to activate GPRS context (APN settings) ofono crashed. It is a known problem - some modems don't use the correct commands for enabling GPRS context, so I had to modify ofono to work with my 3G stick (Huawei E173, but from usb ids it looks like E173s). The problem is that the Huawei E173-s 3G dongle only supports ATD*99** to dial (legacy), not support the method ‘AT+CGDATA=PPP’. The patch to apply is:

    diff --git a/drivers/atmodem/gprs-context.c b/drivers/atmodem/gprs-context.c
    index 3694c27..a9918c9 100644
    -- a/drivers/atmodem/gprs-context.c
    ++ b/drivers/atmodem/gprs-context.c
    @@ -208,7 +208,8 @@ static void at_cgdcont_cb(gboolean ok, GAtResult *result, gpointer user_data)
                    return;
            }
     
    -       sprintf(buf, "AT+CGDATA=\"PPP\",%u", gcd->active_context);
    +    sprintf(buf, "ATD*99***%u#", gcd->active_context);
            if (g_at_chat_send(gcd->chat, buf, none_prefix,
                                    at_cgdata_cb, gc, NULL) > 0)
                    return;


Given that the rest is OK, the following sequence should work to set up a GPRS link:

    # Start ofono daemon in debug mode
    ofonod -nd
    # For AT debugging: OFONO_AT_DEBUG=1 ofonod -nd
    cd <ofono>/test/
    ./enable-modem
    ./online-modem
    # A bit fiddly to get the device to register to its network
    ./scan-for-operators
    ./get-operators
    ./list-modems
    ./scan-for-operators
    # Set up APN settings
    ./create-internet-context APN username password
    # for giffgaff: ./create-internet context giffgaff.com giffgaff password
    # Activating context sets up the gprs link and creates ppp0 interface
    ./activate-context
    # Use the (successfully) retrieved connection settings on the ppp0 interface - set ip, etc
    ./process-context-settings


Usually HUAWEI 3G modems, send their status to the "HUAWEI Mobile Connect - 3G PC UI". The DSFLOWRPT message informs us about connection status every two seconds. The received text on the serial port looks something like this:

    ^DSFLOWRPT:0000240E,00000000,00000000,00000000000AD023,00000000002FA192,0003E800,0003E800 

This is an explanation for what the numbers represent:

    ^DSFLOWRPT: N1, N2, N3, N4, N5, N6, N7 
        N1: Connection duration in seconds 
        N2: measured upload speed 
        N3: measured download speed 
        N4: number of sent data 
        N5: number of received data  
        N6: connection, supported by the maximum upload speed
        N7: connection, supported by a maximum download speed 
