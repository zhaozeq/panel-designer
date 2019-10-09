/* eslint-disable */
import { isNum } from 'log-tips';
import ReactDOM from 'react-dom';
import { int } from './shims';
import { innerWidth, innerHeight, offsetXYFromParent, outerWidth, outerHeight } from './domFns';

export function getBoundPosition(draggable, x, y) {
  if (!draggable.props.bounds) return [x, y];

  let { bounds } = draggable.props;
  const { boundNode } = draggable.state;
  bounds = typeof bounds === 'string' ? bounds : cloneBounds(bounds);
  const node = findDOMNode(draggable);
  if (typeof bounds === 'string') {
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    const nodeStyle = ownerWindow.getComputedStyle(node);
    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
    bounds = {
      left: -node.offsetLeft + int(boundNodeStyle.paddingLeft) + int(nodeStyle.marginLeft),
      top: -node.offsetTop + int(boundNodeStyle.paddingTop) + int(nodeStyle.marginTop),
      right:
        innerWidth(boundNode)
        - outerWidth(node)
        - node.offsetLeft
        + int(boundNodeStyle.paddingRight)
        - int(nodeStyle.marginRight),
      bottom:
        innerHeight(boundNode)
        - outerHeight(node)
        - node.offsetTop
        + int(boundNodeStyle.paddingBottom)
        - int(nodeStyle.marginBottom),
    };
  }
  // Keep x and y below right and bottom limits...
  if (isNum(bounds.right)) x = Math.min(x, bounds.right);
  if (isNum(bounds.bottom)) y = Math.min(y, bounds.bottom);

  // But above left and top limits.
  if (isNum(bounds.left)) x = Math.max(x, bounds.left);
  if (isNum(bounds.top)) y = Math.max(y, bounds.top);

  return [x, y];
}

export function snapToGrid(grid, pendingX, pendingY) {
  const x = Math.round(pendingX / grid[0]) * grid[0];
  const y = Math.round(pendingY / grid[1]) * grid[1];
  return [x, y];
}

export function canDragX(draggable) {
  return draggable.props.axis === 'both' || draggable.props.axis === 'x';
}

export function canDragY(draggable) {
  return draggable.props.axis === 'both' || draggable.props.axis === 'y';
}

// Get {x, y} positions from event.
export function getControlPosition(e, draggableCore) {
  const node = findDOMNode(draggableCore);
  const offsetParent = draggableCore.props.offsetParent || node.offsetParent || node.ownerDocument.body;
  return offsetXYFromParent(e, offsetParent);
}

// 创建基础信息
export function createCoreData(draggable, x, y) {
  const state = draggable.state;
  const isStart = !isNum(state.lastX);
  const node = findDOMNode(draggable);

  if (isStart) {
    return {
      node,
      deltaX: 0,
      deltaY: 0,
      lastX: x,
      lastY: y,
      x,
      y,
    };
  }
  // Otherwise calculate proper values.
  return {
    node,
    deltaX: x - state.lastX,
    deltaY: y - state.lastY,
    lastX: state.lastX,
    lastY: state.lastY,
    x,
    y,
  };
}

// Create an data exposed by <Draggable>'s events
export function createDraggableData(draggable, coreData) {
  const scale = draggable.props.scale;
  return {
    node: coreData.node,
    x: draggable.state.x + coreData.deltaX / scale,
    y: draggable.state.y + coreData.deltaY / scale,
    deltaX: coreData.deltaX / scale,
    deltaY: coreData.deltaY / scale,
    lastX: draggable.state.x,
    lastY: draggable.state.y,
  };
}

// A lot faster than stringify/parse
function cloneBounds(bounds) {
  return {
    left: bounds.left,
    top: bounds.top,
    right: bounds.right,
    bottom: bounds.bottom,
  };
}

function findDOMNode(draggable) {
  const node = ReactDOM.findDOMNode(draggable);
  if (!node) {
    throw new Error('<DraggableCore>: Unmounted during event!');
  }
  return node;
}
