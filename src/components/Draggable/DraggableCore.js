/* eslint-disable react/no-find-dom-node */
import React from 'react';
import ReactDOM from 'react-dom';
import log from 'log-tips';
import {
  matchesSelectorAndParentsTo,
  addEvent,
  removeEvent,
  addUserSelectStyles,
  removeUserSelectStyles,
} from './utils/domFns';
import { createCoreData, getControlPosition, snapToGrid } from './utils/positionFns';

const noop = () => {};
const dragEventFor = {
  start: 'mousedown',
  move: 'mousemove',
  stop: 'mouseup',
};

export default class DraggableCore extends React.Component {
  static displayName = 'DraggableCore';

  static defaultProps = {
    allowAnyClick: false, // by default only accept left click
    disabled: false,
    cancel: null,
    offsetParent: null,
    handle: null,
    grid: null,
    transform: null,
    onStart: noop,
    onDrag: noop,
    onStop: noop,
    onMouseDown: noop,
  };

  state = {
    dragging: false,
    lastX: NaN,
    lastY: NaN,
  };

  componentWillUnmount() {
    // Remove any leftover event handlers. Remove both touch and mouse handlers in case
    // some browser quirk caused a touch event to fire during a mouse move, or vice versa.
    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      const { enableUserSelectHack } = this.props;
      const { ownerDocument } = thisNode;
      removeEvent(ownerDocument, dragEventFor.move, this.handleDrag);
      removeEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
      if (enableUserSelectHack) removeUserSelectStyles(ownerDocument);
    }
  }

  handleDragStart = e => {
    const { allowAnyClick, onMouseDown, disabled, handle, cancel } = this.props;
    e.stopPropagation();
    onMouseDown(e);

    if (!allowAnyClick && typeof e.button === 'number' && e.button !== 0) return false;

    // 阻止文字内容在拖拽过程被选中
    const thisNode = ReactDOM.findDOMNode(this);
    thisNode.style['-webkit-user-select'] = 'none';
    thisNode.style['-moz-user-select'] = 'none';
    thisNode.style['user-select'] = 'none';
    log(
      thisNode && thisNode.ownerDocument && thisNode.ownerDocument.body,
      '<DraggableCore> not mounted on DragStart!',
    );

    const { ownerDocument } = thisNode;

    if (
      disabled
      || !(e.target instanceof ownerDocument.defaultView.Node)
      // matchesSelectorAndParentsTo 是否支持选择器选择
      || (handle && !matchesSelectorAndParentsTo(e.target, handle, thisNode))
      || (cancel && matchesSelectorAndParentsTo(e.target, cancel, thisNode))
    ) {
      return;
    }

    // 获取相对于offsetParent的坐标
    const position = getControlPosition(e, this);
    if (!position) return; // not possible but satisfies flow
    const { x, y } = position;
    // 创建元素基础信息
    const coreEvent = createCoreData(this, x, y);
    const { onStart, enableUserSelectHack } = this.props;

    // 开始移动
    onStart(e, coreEvent);

    // 默认去除拖动时默认的选择样式
    if (enableUserSelectHack) addUserSelectStyles(ownerDocument);
    this.setState({
      dragging: true,
      lastX: x,
      lastY: y,
    });

    // 添加监听
    addEvent(ownerDocument, dragEventFor.move, this.handleDrag);
    addEvent(ownerDocument, dragEventFor.stop, this.handleDragStop);
  };

  handleDrag = e => {
    // 相对于定位父级的坐标.
    const position = getControlPosition(e, this);
    if (position == null) return;
    const { grid, onDrag } = this.props;
    let { x, y } = position;
    // Snap to grid if prop has been provided
    if (Array.isArray(grid)) {
      const { lastX, lastY } = this.state;
      let deltaX = x - lastX;
      let deltaY = y - lastY;
      [deltaX, deltaY] = snapToGrid(grid, deltaX, deltaY);
      if (!deltaX && !deltaY) return; // skip useless drag
      x = lastX + deltaX;
      y = lastY + deltaY;
    }
    const coreEvent = createCoreData(this, x, y);
    onDrag(e, coreEvent);
    this.setState({
      lastX: x,
      lastY: y,
    });
  };

  handleDragStop = e => {
    const { enableUserSelectHack, onStop } = this.props;
    const { dragging } = this.state;
    if (!dragging) return;

    const position = getControlPosition(e, this);
    if (position == null) return;
    const { x, y } = position;
    const coreEvent = createCoreData(this, x, y);

    const thisNode = ReactDOM.findDOMNode(this);
    if (thisNode) {
      // Remove user-select hack
      if (enableUserSelectHack) removeUserSelectStyles(thisNode.ownerDocument);
    }

    // Reset the el.
    this.setState({
      dragging: false,
      lastX: NaN,
      lastY: NaN,
    });

    // Call event handler
    onStop(e, coreEvent);

    if (thisNode) {
      removeEvent(thisNode.ownerDocument, dragEventFor.move, this.handleDrag);
      removeEvent(thisNode.ownerDocument, dragEventFor.stop, this.handleDragStop);
    }
  };

  render() {
    const { children } = this.props;
    return React.cloneElement(React.Children.only(children), {
      onMouseDown: this.handleDragStart,
      onMouseUp: this.handleDragStop,
    });
  }
}
