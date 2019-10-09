/* eslint-disable */
import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { createCSSTransform, getBoundNode } from './utils/domFns';
import { canDragX, canDragY, createDraggableData, getBoundPosition } from './utils/positionFns';
import DraggableCore from './DraggableCore';

/**
 *
 * @export
 * @class Draggable
 * @extends {React.Component}
 */
export default class Draggable extends React.Component {
  static displayName = 'Draggable';

  static defaultProps = {
    ...DraggableCore.defaultProps,
    axis: 'both',
    bounds: false,
    defaultClassName: 'react-draggable',
    defaultClassNameDragging: 'react-draggable-dragging',
    defaultClassNameDragged: 'react-draggable-dragged',
    defaultPosition: { x: 0, y: 0 },
    position: null,
    scale: 1,
  };

  constructor(props) {
    super(props);

    this.state = {
      // 是否拖拽中.
      dragging: false,

      // 是否拖拽过.
      dragged: false,

      // 当前位置.
      x: props.position ? props.position.x : props.defaultPosition.x,
      y: props.position ? props.position.y : props.defaultPosition.y,

      // 用于补偿越界拖动
      slackX: 0,
      slackY: 0,
      // 区域限制
      boundNode: null,
    };
  }

  componentDidMount() {
    const { bounds } = this.props;
    const node = ReactDOM.findDOMNode(this);
    const boundNode = getBoundNode(node, bounds);
    this.setState({ boundNode });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // 位置改变时
    const { position } = nextProps;
    if (
      position
      && (!this.props.position
        || position.x !== this.props.position.x
        || position.y !== this.props.position.y)
    ) {
      this.setState({ x: position.x, y: position.y });
    }
  }

  componentWillUnmount() {
    this.setState({ dragging: false });
  }

  onDragStart = (e, coreData) => {
    const shouldStart = this.props.onStart(e, createDraggableData(this, coreData));
    if (shouldStart === false) return false;
    this.setState({ dragging: true, dragged: true });
  };

  onDrag = (e, coreData) => {
    if (!this.state.dragging) return false;

    const uiData = createDraggableData(this, coreData);

    const newState = {
      x: uiData.x,
      y: uiData.y,
    };
    // 区域限制.
    if (this.props.bounds) {
      // 保留原始位置
      const { x, y } = newState;

      // 区域限制情况下计算x,y.
      const [newStateX, newStateY] = getBoundPosition(this, x, y);
      newState.x = newStateX;
      newState.y = newStateY;

      // Update the event we fire to reflect what really happened after bounds took effect.
      uiData.x = newState.x;
      uiData.y = newState.y;
      uiData.deltaX = newState.x - this.state.x;
      uiData.deltaY = newState.y - this.state.y;
    }

    this.props.onDrag(e, uiData);

    this.setState(newState);
  };

  onDragStop = (e, coreData) => {
    if (!this.state.dragging) return false;

    this.props.onStop(e, createDraggableData(this, coreData));

    const newState = {
      dragging: false,
    };

    // If this is a controlled component, the result of this operation will be to
    // revert back to the old position. We expect a handler on `onDragStop`, at the least.
    const controlled = Boolean(this.props.position);
    if (controlled) {
      const { x, y } = this.props.position;
      newState.x = x;
      newState.y = y;
    }
    this.setState(newState);
  };

  render() {
    // 受控时看是否正在移动否则不做移动.
    const controlled = Boolean(this.props.position);
    const draggable = !controlled || this.state.dragging;

    const position = this.props.position || this.props.defaultPosition;
    const transformOpts = {
      x: canDragX(this) && draggable ? this.state.x : position.x,
      y: canDragY(this) && draggable ? this.state.y : position.y,
    };

    const style = createCSSTransform(transformOpts, this.props.positionOffset);

    const { defaultClassName, defaultClassNameDragging, defaultClassNameDragged } = this.props;

    const children = React.Children.only(this.props.children);

    // Mark with class while dragging
    const className = classNames(children.props.className || '', defaultClassName, {
      [defaultClassNameDragging]: this.state.dragging,
      [defaultClassNameDragged]: this.state.dragged,
    });

    // Reuse the child provided
    // This makes it flexible to use whatever element is wanted (div, ul, etc)
    return (
      <DraggableCore
        {...this.props}
        onStart={this.onDragStart}
        onDrag={this.onDrag}
        onStop={this.onDragStop}
      >
        {React.cloneElement(children, {
          className,
          style: { ...children.props.style, ...style },
        })}
      </DraggableCore>
    );
  }
}
