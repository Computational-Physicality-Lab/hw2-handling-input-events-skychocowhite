/*
* all the code for homework 2 goes into this file.
You will attach event handlers to the document, workspace, and targets defined in the html file
to handle mouse, touch and possible other events.

You will certainly need a large number of global variables to keep track of the current modes and states
of the interaction.
*/

const workspace = document.getElementById('workspace');
const targetList = document.querySelectorAll('.target');

let isWorkspaceMouseDown = false;
let isWorkspaceMouseMove = false;
let workspaceMouseX, workspaceMouseY;

let isTargetMouseDown = false;
let isTargetMouseMove = false;
let mouseDownTarget;
let clickedTarget;
let targetMouseX, targetMouseY;
let originTargetTop, originTargetLeft;

let targetFollowMode = false;

const workspaceMouseDownEvent = function (event) {
  isWorkspaceMouseDown = true;
  isWorkspaceMouseMove = false;
  workspaceMouseX = event.clientX;
  workspaceMouseY = event.clientY;
};

const workspaceMouseMoveEvent = function (event) {
  if (isWorkspaceMouseDown &&
    (workspaceMouseX !== event.clientX || workspaceMouseY !== event.clientY)) {
    isWorkspaceMouseMove = true;
  }

  if ((isTargetMouseDown || targetFollowMode) &&
    (targetMouseX !== event.clientX || targetMouseY !== event.clientY)) {
    isTargetMouseMove = true;
  }

  if (isTargetMouseDown || targetFollowMode) {
    let topPosition = parseInt(mouseDownTarget.style.top.substring(0, mouseDownTarget.style.top.length - 2));
    let leftPosition = parseInt(mouseDownTarget.style.left.substring(0, mouseDownTarget.style.left.length - 2));

    topPosition = "" + (topPosition + event.clientY - targetMouseY) + "px";
    leftPosition = "" + (leftPosition + event.clientX - targetMouseX) + "px";
    mouseDownTarget.style.top = topPosition;
    mouseDownTarget.style.left = leftPosition;
    targetMouseX = event.clientX;
    targetMouseY = event.clientY;
  }
};

const workspaceMouseUpEvent = function (event) {
  isWorkspaceMouseDown = false;
};

const workspaceMouseClickEvent = function (event) {
  if (isWorkspaceMouseMove) {
    isWorkspaceMouseMove = false;
    return;
  }

  if (targetFollowMode) {
    targetFollowMode = false;
    return;
  }

  if (clickedTarget !== undefined) {
    clickedTarget.style.backgroundColor = 'red';
    clickedTarget = undefined;
  }
};

const workspaceKeyboardEscapeEvent = function (event) {
  if (event.code !== 'Escape') { return; }

  isTargetMouseDown = false;
  isTargetMouseMove = false;
  targetFollowMode = false;

  if (mouseDownTarget !== undefined) {
    mouseDownTarget.style.top = originTargetTop;
    mouseDownTarget.style.left = originTargetLeft;
  }
  mouseDownTarget = undefined;
};

const workspaceTouchStartEvent = function (event) {
  isWorkspaceMouseDown = true;
  isWorkspaceMouseMove = false;
  workspaceMouseX = event.touches[event.touches.length - 1].clientX;
  workspaceMouseY = event.touches[event.touches.length - 1].clientY;
};

const workspaceTouchMoveEvent = function (event) {
  if (isWorkspaceMouseDown &&
    (workspaceMouseX !== event.clientX || workspaceMouseY !== event.clientY)) {
    isWorkspaceMouseMove = true;
  }

  if ((isTargetMouseDown || targetFollowMode) &&
    (targetMouseX !== event.clientX || targetMouseY !== event.clientY)) {
    isTargetMouseMove = true;
  }

  if (isTargetMouseDown || targetFollowMode) {
    let topPosition = parseInt(mouseDownTarget.style.top.substring(0, mouseDownTarget.style.top.length - 2));
    let leftPosition = parseInt(mouseDownTarget.style.left.substring(0, mouseDownTarget.style.left.length - 2));

    topPosition = "" + (topPosition + event.touches[event.touches.length - 1].clientY - targetMouseY) + "px";
    leftPosition = "" + (leftPosition + event.touches[event.touches.length - 1].clientX - targetMouseX) + "px";
    mouseDownTarget.style.top = topPosition;
    mouseDownTarget.style.left = leftPosition;
    targetMouseX = event.touches[event.touches.length - 1].clientX;
    targetMouseY = event.touches[event.touches.length - 1].clientY;
  }
};

const workspaceTouchEndEvent = function (event) {
  isWorkspaceMouseDown = false;
};

const targetMouseDownEvent = function (event) {
  isTargetMouseDown = true;
  isTargetMouseMove = false;
  mouseDownTarget = event.target;
  targetMouseX = event.clientX;
  targetMouseY = event.clientY;
  originTargetTop = event.target.style.top;
  originTargetLeft = event.target.style.left;
};

const targetMouseUpEvent = function (event) {
  isTargetMouseDown = false;
  if (isTargetMouseMove || targetFollowMode) {
    mouseDownTarget = undefined;
  }
};

const targetClickEvent = function (event) {
  if (targetFollowMode) {
    targetFollowMode = false;
    isTargetMouseMove = false;
    event.stopPropagation();
    return;
  }
  if (isTargetMouseMove) {
    isTargetMouseMove = false;
    event.stopPropagation();
    return;
  }

  if (clickedTarget !== event.clickedTarget) {
    clickedTarget.style.backgroundColor = 'red';
  }
  clickedTarget = event.target;
  clickedTarget.style.backgroundColor = '#00f';
  event.stopPropagation();
};

const targetDblClickEvent = function (event) {
  targetFollowMode = true;
  mouseDownTarget = event.target;
};

const targetTouchStartEvent = function (event) {
  isTargetMouseDown = true;
  isTargetMouseMove = false;
  mouseDownTarget = event.target;
  targetMouseX = event.touches[event.touches.length - 1].clientX;
  targetMouseY = event.touches[event.touches.length - 1].clientY;
  originTargetTop = event.target.style.top;
  originTargetLeft = event.target.style.left;
};

const targetTouchEndEvent = function (event) {
  isTargetMouseDown = false;
  if (isTargetMouseMove || targetFollowMode) {
    mouseDownTarget = undefined;
  }
};

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
  target.addEventListener('click', targetClickEvent);
  target.addEventListener('dblclick', targetDblClickEvent);

  target.addEventListener('touchstart', targetTouchStartEvent);
  target.addEventListener('touchend', targetTouchEndEvent);
});
