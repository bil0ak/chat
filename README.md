# chat-example

This is the source code for a very simple chat example used for
the [Getting Started](http://socket.io/get-started/chat/) guide
of the Socket.IO website.


I also added a video call function using PeerJS. That was fun (I hate safari, so this website might (99%) have bugs in it).
The design is garbage, but everything needed works 😍.

# How It Works.

In the main page, there are two options 1. create new room 2. join a room.
When creating choosing a new room, you'll be redirected to a chat room with a randomly generated room ID, using UUID library.
Whenever a new user opens this url, they will be automatically joining that room and everyone in this room will be notified that a new person joind, after that you'll be able to send messages to everyone. (all using Socket IO)

There's also a button for opening a Video Call. (It kinda works the same as the chat, you open the url, join the room, when a new person joins their video will be streamed to you, and yours to them "VeRy SiMpLe 😶")... now I wasn't able to test this function very well, cuz I have some useless assginment (That has only 5% of programming 😡) to do for college 🤮.
After some research (15 min on Stackoverflow) I think you can have a lot of connections. (Some got 600, some 9k, and I found one was able to get up to 1 mil concurrent connection). I can't really test it because (college) and I don't really want to, It works with 2 connections, that's what I need.


*I wrote this update at 3AM, sooooo DON"TJUDGE <3*
