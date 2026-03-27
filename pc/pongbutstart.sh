#!/usr/bin/bash

# Hide the mouse cursor
unclutter -idle 1 -root &

sleep 15

# Start serialserver
nohup /usr/bin/node /home/pongbut/node_modules/p5.serialserver/startserver.js &

# Change resolution to 640x480 w/ pillarboxes (assumes 1920x1080 monitor)
#xrandr --output HDMI-1 --mode 640x480 --panning 640x480 --filter nearest --transform 1.33333333,0,-106,0,1,0,0,0,1
xrandr --output HDMI-2 --mode 640x480 --panning 640x480 --filter nearest --transform 1.33333333,0,-106,0,1,0,0,0,1

# Start Firefox
sleep 3
/usr/bin/firefox --kiosk 'http://pongbut.local' &
#/usr/bin/firefox 'http://pongbut.local' &

# click inside Firefox every 1/2 second for 15 seconds to focus (or game won't start)
/usr/bin/xdotool mousemove 639 479 &
/usr/bin/xdotool click --delay 500 --repeat 30 1 &