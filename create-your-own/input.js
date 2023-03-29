/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const States = {
  IDLE: 'Idle',
  MOUSE_TOUCH_DOWN_ON_TARGET: 'MouseTouchDownOnTarget',
  MOVE_TARGET: 'MoveTarget',
  TARGET_SELECTED: 'TargetSelected',
  MOUSE_TOUCH_DOWN_ON_BACKGROUND: 'MouseTouchDownOnBackground',
  MOVE_BACKGROUND: 'MoveBackground',
  MOUSE_TOUCH_DOWN_ON_SAME_TARGET: 'MouseTouchDownOnSameTarget',
  FOLLOW_MODE: 'FollowMode',
  FOLLOW_MODE_TOUCH_DOWN: 'FollowModeTouchDown',
  FOLLOW_MODE_TOUCH_MOVE: 'FollowModeTouchMove',
  SCALE_MODE: 'ScaleMode',
  SCALE_MODE_IDLE: 'ScaleModeIdle',
  SCALE_MODE_NO_TARGET: 'ScaleModeNoTarget',
};

const workspace = document.getElementById('workspace');
const targetList = document.querySelectorAll('.target');

let curState = States.IDLE;
let workspacePreEvent;
let targetPreEvent;

// let isWorkspaceMouseDown = false;
// let isWorkspaceMouseMove = false;
let workspaceMouseX, workspaceMouseY;
// let twoFingerMode = false;
// let prevFirstFingerPos = { x: 0, y: 0 }, prevSecondFingerPos = { x: 0, y: 0 };
// let lastWorkspaceTouchTime = 0;

// let targetMinLength = 10;
// let isTargetMouseDown = false;
let mouseDownTarget;
let preClickedTarget;
let clickedTarget;
let targetMouseX, targetMouseY;
let originTargetTop, originTargetLeft;
// let targetFollowMode = false;
let lastTargetClickTime = 0;

function workspaceMouseDownEvent(event) {
  console.log("workspace: " + event.type);
  console.log("state: " + curState);

  workspacePreEvent = event;

  if (curState === States.IDLE ||
    curState === States.TARGET_SELECTED) {

    workspaceMouseX = event.clientX;
    workspaceMouseY = event.clientY;

    switch (curState) {
      case States.IDLE:
        curState = States.MOUSE_TOUCH_DOWN_ON_BACKGROUND;
        break;
      case States.TARGET_SELECTED:
        curState = States.MOUSE_TOUCH_DOWN_ON_BACKGROUND;
        break;
    }
  }
}

function workspaceMouseMoveEvent(event) {
  console.log("workspace: " + event.type);
  console.log("state: " + curState);

  if (workspacePreEvent === 'touchend') { return; }

  workspacePreEvent = event;

  if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
    curState === States.MOVE_TARGET ||
    curState === States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET ||
    curState === States.FOLLOW_MODE) {

    if (targetMouseX === event.clientX && targetMouseY === event.clientY) { return; }

    let topPosition = parseInt(mouseDownTarget.style.top.substring(0, mouseDownTarget.style.top.length - 2));
    let leftPosition = parseInt(mouseDownTarget.style.left.substring(0, mouseDownTarget.style.left.length - 2));

    topPosition = "" + (topPosition + event.clientY - targetMouseY) + "px";
    leftPosition = "" + (leftPosition + event.clientX - targetMouseX) + "px";
    mouseDownTarget.style.top = topPosition;
    mouseDownTarget.style.left = leftPosition;
    targetMouseX = event.clientX;
    targetMouseY = event.clientY;

    switch (curState) {
      case States.MOUSE_TOUCH_DOWN_ON_TARGET:
        curState = States.MOVE_TARGET;
        break;
      case States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET:
        curState = States.MOVE_TARGET;
        break;
    }
  }

  if (curState === States.MOUSE_TOUCH_DOWN_ON_BACKGROUND) {
    if (workspaceMouseX === event.clientX && workspaceMouseY === event.clientY) { return; }

    curState = States.MOVE_BACKGROUND;
  }
}

function workspaceMouseUpEvent(event) {
  console.log('workspace: ' + event.type);
  console.log('state: ' + curState);

  workspacePreEvent = event;

  if (curState === States.MOVE_BACKGROUND) {
    mouseDownTarget = undefined;

    if (clickedTarget === undefined) {
      curState = States.IDLE;
    }
    else {
      curState = States.TARGET_SELECTED;
    }
  }
}

function workspaceMouseClickEvent(event) {
  console.log("workspace: " + event.type);
  console.log("state: " + curState);

  workspacePreEvent = event;

  if (curState === States.MOUSE_TOUCH_DOWN_ON_BACKGROUND) {
    if (clickedTarget !== undefined) {
      clickedTarget.style.backgroundColor = 'red';
    }
    clickedTarget = undefined;
    curState = States.IDLE;
  }
}

function targetMouseDownEvent(event) {
  console.log("target: " + event.type);
  console.log("state: " + curState);

  targetPreEvent = event;

  if (curState === States.IDLE ||
    curState === States.TARGET_SELECTED) {

    mouseDownTarget = event.target;
    targetMouseX = event.clientX;
    targetMouseY = event.clientY;
    originTargetTop = event.target.style.top;
    originTargetLeft = event.target.style.left;

    switch (curState) {
      case States.IDLE:
        curState = States.MOUSE_TOUCH_DOWN_ON_TARGET;
        break;
    }
    if (curState === States.TARGET_SELECTED) {
      if (clickedTarget !== event.target) {
        curState = States.MOUSE_TOUCH_DOWN_ON_TARGET;
      }
      else {
        curState = States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET;
      }
    }
  }
}

function targetMouseUpEvent(event) {
  console.log("target: " + event.type);
  console.log("state: " + curState);

  targetPreEvent = event;

  if (curState === States.MOVE_TARGET ||
    curState === States.FOLLOW_MODE) {

    mouseDownTarget = undefined;

    if (curState === States.MOVE_TARGET) {
      if (clickedTarget === undefined) {
        curState = States.IDLE;
      }
      else {
        curState = States.TARGET_SELECTED;
      }
    }

    if (curState === States.FOLLOW_MODE) {
      curState = States.TARGET_SELECTED;
    }
  }
}

function targetMouseClickEvent(event) {
  console.log("target: " + event.type);
  console.log("state: " + curState);

  targetPreEvent = event;

  if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
    curState === States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET) {

    let currentTime = new Date().getTime();
    let timeOffset = currentTime - lastTargetClickTime;
    lastTargetClickTime = currentTime;

    preClickedTarget = clickedTarget;
    if (clickedTarget !== undefined && clickedTarget !== event.target) {
      clickedTarget.style.backgroundColor = 'red';
    }
    clickedTarget = event.target;
    clickedTarget.style.backgroundColor = '#00f';

    switch (curState) {
      case States.MOUSE_TOUCH_DOWN_ON_TARGET:
        curState = States.TARGET_SELECTED;
        break;
    }

    if (curState === States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET) {
      if (timeOffset <= 300 && preClickedTarget === event.target) {
        curState = States.FOLLOW_MODE;
      }
      else {
        curState = States.TARGET_SELECTED;
      }
    }
  }
}

workspace.setAttribute('tabindex', -1);
workspace.focus();
workspace.addEventListener('mousedown', workspaceMouseDownEvent);
workspace.addEventListener('mousemove', workspaceMouseMoveEvent);
workspace.addEventListener('mouseup', workspaceMouseUpEvent);
workspace.addEventListener('click', workspaceMouseClickEvent);

targetList.forEach((target, idx) => {
  target.addEventListener('mousedown', targetMouseDownEvent);
  target.addEventListener('mouseup', targetMouseUpEvent);
  target.addEventListener('click', targetMouseClickEvent);
});
