Lesson5:
--------
In this lesson we learned how to write very basic websocket server.
We've created our own protocol for client-server communication that
can be implemented by other clients that would like to work with our server.

Topics covered:
- WebSockets
- How to use "ws" node module
- How to send messages to clients based on their IP address

NOTE:
To work with this lesson issue the `npm install` command while being in
the `server/` directory. That will install "ws" node module.


Homework:
---------
Based on techniques learned in the lesson make the chat
created in previous classes to actually work. You will have to
write broadcast function that sends messages to all attendees.
Perhaps you'll also have to came up with the way to store users.