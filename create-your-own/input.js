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

let workspaceMouseX, workspaceMouseY;
// let twoFingerMode = false;
let prevFirstFingerPos = { x: 0, y: 0 }, prevSecondFingerPos = { x: 0, y: 0 };
let lastWorkspaceTouchTime = 0;

let targetMinLength = 10;
let mouseDownTarget;
let preClickedTarget;
let clickedTarget;
let targetMouseX, targetMouseY;
let originTargetTop, originTargetLeft;
let originTargetWidth, originTargetHeight;
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

  if (targetPreEvent.type === 'touchend' || workspacePreEvent.type === 'touchend') {
    console.log("skip mousemove due to click event");
    return;
  }

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
  else if (curState === States.FOLLOW_MODE_TOUCH_DOWN) {
    curState = States.TARGET_SELECTED;
  }
}

function workspaceKeyboardEscapeEvent(event) {
  console.log("workspace: " + event.type);
  console.log("state: " + curState);

  if (event.key !== 'Escape') { return; }

  if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
    curState === States.MOVE_TARGET ||
    curState === States.FOLLOW_MODE ||
    curState === States.FOLLOW_MODE_TOUCH_DOWN ||
    curState === States.FOLLOW_MODE_TOUCH_MOVE) {

    if (mouseDownTarget !== undefined) {
      mouseDownTarget.style.top = originTargetTop;
      mouseDownTarget.style.left = originTargetLeft;
    }

    if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
      curState === States.MOVE_TARGET) {

      mouseDownTarget = undefined;
      if (clickedTarget !== undefined) {
        curState = States.TARGET_SELECTED;
      }
      else {
        curState = States.IDLE;
      }
    }
    else if (curState === States.FOLLOW_MODE ||
      curState === States.FOLLOW_MODE_TOUCH_DOWN ||
      curState === States.FOLLOW_MODE_TOUCH_MOVE) {

      curState = States.TARGET_SELECTED;
    }
  }
}

function workspaceTouchStartEvent(event) {
  console.log('workspace: ' + event.type + "(" + event.touches.length + ")");
  console.log('state: ' + curState);

  workspacePreEvent = event;
  let currentTime = new Date().getTime();
  let timeOffset = currentTime - lastWorkspaceTouchTime;
  lastWorkspaceTouchTime = currentTime;

  if (event.touches.length === 1) {
    if (curState === States.IDLE ||
      curState === States.TARGET_SELECTED ||
      curState === States.FOLLOW_MODE) {

      workspaceMouseX = event.touches[0].clientX;
      workspaceMouseY = event.touches[0].clientY;

      if (curState === States.IDLE ||
        curState === States.TARGET_SELECTED) {

        curState = States.MOUSE_TOUCH_DOWN_ON_BACKGROUND;
      }
      else if (curState === States.FOLLOW_MODE) {
        curState = States.FOLLOW_MODE_TOUCH_DOWN;
      }
    }
  }
  else if (event.touches.length === 2) {
    if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
      curState === States.MOVE_TARGET ||
      curState === States.FOLLOW_MODE_TOUCH_DOWN ||
      curState === States.FOLLOW_MODE_TOUCH_MOVE) {

      if (mouseDownTarget !== undefined) {
        mouseDownTarget.style.top = originTargetTop;
        mouseDownTarget.style.left = originTargetLeft;
      }
      mouseDownTarget = undefined;

      if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
        curState === States.MOVE_TARGET) {

        curState = States.IDLE;
      }
      else if (curState === States.FOLLOW_MODE_TOUCH_DOWN ||
        curState === States.FOLLOW_MODE_TOUCH_MOVE) {

        curState = States.TARGET_SELECTED;
      }
    }
    else if (curState === States.MOUSE_TOUCH_DOWN_ON_BACKGROUND) {
      if (clickedTarget !== undefined && timeOffset < 50) {
        curState = States.SCALE_MODE;
        originTargetWidth = clickedTarget.style.width;
        originTargetHeight = clickedTarget.style.height;
        prevFirstFingerPos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        prevSecondFingerPos = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      }
    }
  }
}

function workspaceTouchMoveEvent(event) {
  console.log("workspace: " + event.type + "(" + event.touches.length + ")");
  console.log("state: " + curState);

  workspacePreEvent = event;

  if (event.touches.length === 1) {
    console.log("here1");
    if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET ||
      curState === States.MOVE_TARGET ||
      curState === States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET ||
      curState === States.FOLLOW_MODE_TOUCH_DOWN ||
      curState === States.FOLLOW_MODE_TOUCH_MOVE) {

      if (targetMouseX === event.touches[0].clientX && targetMouseY === event.touches[0].clientY) { return; }

      let topPosition = parseInt(mouseDownTarget.style.top.substring(0, mouseDownTarget.style.top.length - 2));
      let leftPosition = parseInt(mouseDownTarget.style.left.substring(0, mouseDownTarget.style.left.length - 2));

      topPosition = "" + (topPosition + event.touches[0].clientY - targetMouseY) + "px";
      leftPosition = "" + (leftPosition + event.touches[0].clientX - targetMouseX) + "px";
      mouseDownTarget.style.top = topPosition;
      mouseDownTarget.style.left = leftPosition;
      targetMouseX = event.touches[0].clientX;
      targetMouseY = event.touches[0].clientY;

      switch (curState) {
        case States.MOUSE_TOUCH_DOWN_ON_TARGET:
          curState = States.MOVE_TARGET;
          break;
        case States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET:
          curState = States.MOVE_TARGET;
          break;
        case States.FOLLOW_MODE_TOUCH_DOWN:
          curState = States.FOLLOW_MODE_TOUCH_MOVE;
          break;
      }
    }
    else if (curState === States.MOUSE_TOUCH_DOWN_ON_BACKGROUND) {
      if (workspaceMouseX === event.touches[0].clientX && workspaceMouseY === event.touches[0].clientY) { return; }

      workspaceMouseX = event.touches[0].clientX;
      workspaceMouseY = event.touches[0].clientY;
      curState = States.MOVE_BACKGROUND;
    }
  }
  else if (event.touches.length === 2) {
    console.log("here");
    if (curState === States.SCALE_MODE) {
      let firstFingerPos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      let secondFingerPos = { x: event.touches[1].clientX, y: event.touches[1].clientY };
      let width = parseInt(clickedTarget.style.width.substring(0, clickedTarget.style.width.length - 2));
      let height = parseInt(clickedTarget.style.height.substring(0, clickedTarget.style.height.length - 2));

      let widthOffset = abs(firstFingerPos.x - secondFingerPos.x) - abs(prevFirstFingerPos.x - prevSecondFingerPos.x);
      let heightOffset = abs(firstFingerPos.y - secondFingerPos.y) - abs(prevFirstFingerPos.y - prevSecondFingerPos.y);

      width = "" + (width + widthOffset) + "px";
      console.log("width: " + width);
      clickedTarget.style.width = width;
    }
  }
}

function workspaceTouchEndEvent(event) {
  console.log("workspace: " + event.type);
  console.log("state: " + curState);

  workspacePreEvent = event;

  if (curState === States.MOVE_BACKGROUND) {
    if (clickedTarget === undefined) {
      curState = States.IDLE;
    }
    else {
      curState = States.TARGET_SELECTED;
    }
  }
  else if (curState === States.FOLLOW_MODE_TOUCH_MOVE) {
    curState = States.FOLLOW_MODE;
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

    if (curState === States.MOUSE_TOUCH_DOWN_ON_TARGET) {
      curState = States.TARGET_SELECTED;
    }
    else if (curState === States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET) {
      console.log("double click time offset: " + timeOffset);
      if (timeOffset <= 350 && preClickedTarget === event.target) {
        curState = States.FOLLOW_MODE;
      }
      else {
        curState = States.TARGET_SELECTED;
      }
    }
  }
  else if (curState === States.FOLLOW_MODE_TOUCH_DOWN) {
    mouseDownTarget = undefined;
    curState = States.TARGET_SELECTED;
  }
}

function targetTouchStartEvent(event) {
  console.log("target: " + event.type);
  console.log("state: " + curState);

  targetPreEvent = event;

  if (event.touches.length === 1) {
    if (curState === States.IDLE ||
      curState === States.TARGET_SELECTED) {

      mouseDownTarget = event.target;
      targetMouseX = event.touches[0].clientX;
      targetMouseY = event.touches[0].clientY;
      originTargetTop = event.target.style.top;
      originTargetLeft = event.target.style.left;

      if (curState === States.IDLE) {
        curState = States.MOUSE_TOUCH_DOWN_ON_TARGET;
      }
      else if (curState === States.TARGET_SELECTED) {
        if (clickedTarget === event.target) {
          curState = States.MOUSE_TOUCH_DOWN_ON_SAME_TARGET;
        }
        else {
          curState = States.MOUSE_TOUCH_DOWN_ON_TARGET;
        }
      }
    }
    else if (curState === States.FOLLOW_MODE) {
      curState = States.FOLLOW_MODE_TOUCH_DOWN;
    }
  }
}

function targetTouchEndEvent(event) {
  console.log("target: " + event.type);
  console.log("state: " + curState);

  targetPreEvent = event;

  if (event.touches.length === 0) {
    if (curState === States.MOVE_TARGET) {
      mouseDownTarget = undefined;
      if (clickedTarget === undefined) {
        curState = States.IDLE;
      }
      else {
        curState = States.TARGET_SELECTED;
      }
    }
    else if (curState === States.FOLLOW_MODE_TOUCH_MOVE) {
      curState = States.FOLLOW_MODE;
    }
  }
}

workspace.setAttribute('tabindex', -1);
workspace.focus();
workspace.addEventListener('keydown', workspaceKeyboardEscapeEvent);
workspace.addEventListener('mousedown', workspaceMouseDownEvent);
workspace.addEventListener('mousemove', workspaceMouseMoveEvent);
workspace.addEventListener('mouseup', workspaceMouseUpEvent);
workspace.addEventListener('click', workspaceMouseClickEvent);

workspace.addEventListener('touchstart', workspaceTouchStartEvent);
workspace.addEventListener('touchmove', workspaceTouchMoveEvent);
workspace.addEventListener('touchend', workspaceTouchEndEvent);

targetList.forEach((target, idx) => {
  target.addEventListener('mousedown', targetMouseDownEvent);
  target.addEventListener('mouseup', targetMouseUpEvent);
  target.addEventListener('click', targetMouseClickEvent);

  target.addEventListener('touchstart', targetTouchStartEvent);
  target.addEventListener('touchend', targetTouchEndEvent);
});
