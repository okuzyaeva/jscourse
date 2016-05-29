Lesson9:
--------
Prerequisites for making game. We've examined the basics of drawing graphics
using `2d context` of canvas. We've created a configurable particle emitter that can
spawn N particles each M seconds. We've also created a resource pool that allows to reuse
existing particles which results in memory usage optimization.

Topics covered:

- how to use `requestAnimationFrame()` to create game-like system
- frame-based animations vs time-based animations
- how to create particle emitter
- basic canvas optimizations
- what is resource pool and how it helps to reduce garbage generation

Homework:
---------
Extend the system by adding ability to listen to arbitrary keyboard events. Let's say
you want to move your emitter around using arrow keys or 'WSAD' or whatever.
Make such system in a way that allows you to easily reconfigure what keys should be used to move emitter.
Work with emitter itself. Try to configure it in a way that makes it look like fire or a flamethrower.
What should be changed to make the emitter spawn particles around the area instead of a single coordinate point?
