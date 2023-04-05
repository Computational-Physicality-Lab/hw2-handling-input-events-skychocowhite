[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-8d59dc4de5201274e310e4c54b9627a8934c3b88527886e3b421487c677d23eb.svg)](https://classroom.github.com/a/vtMjwcap)
# Homework 2 - Handling Input Events
Name: 王堃宇<br>
ID: R11922102

## Deploy Website
Use Netlify for website deployment [[Link](https://ssui-hw2-skychocowhite.netlify.app)]

## Design of the WebSite
I use the state diagram for design of the website, the design is showed below:
![](https://i.imgur.com/hthIY80.png)

For handling multiple input events, I use the state to handle specific input events. For example, if there is a **mousedown** on other target but not the current clicked one. The state will changed from **A target is selected** to **Mouse/Touch down on target**. To change the state more precisely, I use the curly brackets to specify the constraints of each state transitions, and a vertical line (`|`) to denote multiple events on same transition. Finally, in my design of the state diagram, each tranisition should only be triggered once by only one input event.

## Bonus - Scale Mode with Different Direction
For **two-finger touch** event, I implemented the scale mode with both horizontal and vertical events. The direction of the scale is determined by the longer distance of two directions of two fingers' positions. Hence, if the vertical distance is longer than the horizontal one, the target will be scaled in vertical directions, and vice versa.