import log, { isFn } from 'log-tips';
import { findInArray, int } from './shims';
import browserPrefix, { browserPrefixToKey } from './getPrefix';

let matchesSelectorFunc = '';
export function matchesSelector(el, selector) {
  // 如果元素被指定的选择器字符串选择，Element.matches()  方法返回true; 否则返回false。
  if (!matchesSelectorFunc) {
    matchesSelectorFunc = findInArray(
      [
        'matches',
        'webkitMatchesSelector',
        'mozMatchesSelector',
        'msMatchesSelector',
        'oMatchesSelector',
      ],
      method => {
        return isFn(el[method]);
      },
    );
  }

  // Might not be found entirely (not an Element?) - in that case, bail
  // $FlowIgnore: Doesn't think elements are indexable
  if (!isFn(el[matchesSelectorFunc])) return false;

  // $FlowIgnore: Doesn't think elements are indexable
  return el[matchesSelectorFunc](selector);
}

// Works up the tree to the draggable itself attempting to match selector.
// e.target, this.props.handle, thisNode
export function matchesSelectorAndParentsTo(el, selector, baseNode) {
  let node = el;
  do {
    if (matchesSelector(node, selector)) return true;
    if (node === baseNode) return false;
    node = node.parentNode;
  } while (node);

  return false;
}

export function addEvent(el, event, handler) {
  if (!el) {
    return;
  }
  if (el.attachEvent) {
    el.attachEvent(`on${event}`, handler);
  } else if (el.addEventListener) {
    el.addEventListener(event, handler, true);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el[`on${event}`] = handler;
  }
}

export function removeEvent(el, event, handler) {
  if (!el) {
    return;
  }
  if (el.detachEvent) {
    el.detachEvent(`on${event}`, handler);
  } else if (el.removeEventListener) {
    el.removeEventListener(event, handler, true);
  } else {
    // $FlowIgnore: Doesn't think elements are indexable
    el[`on${event}`] = null;
  }
}

export function outerHeight(node) {
  // This is deliberately excluding margin for our calculations, since we are using
  // offsetTop which is including margin. See getBoundPosition
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height += int(computedStyle.borderTopWidth);
  height += int(computedStyle.borderBottomWidth);
  return height;
}

export function outerWidth(node) /*  */ {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width += int(computedStyle.borderLeftWidth);
  width += int(computedStyle.borderRightWidth);
  return width;
}
export function innerHeight(node /*  */) /*  */ {
  let height = node.clientHeight;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  height -= int(computedStyle.paddingTop);
  height -= int(computedStyle.paddingBottom);
  return height;
}

export function innerWidth(node) {
  let width = node.clientWidth;
  const computedStyle = node.ownerDocument.defaultView.getComputedStyle(node);
  width -= int(computedStyle.paddingLeft);
  width -= int(computedStyle.paddingRight);
  return width;
}

// 获取相对于offsetParent的坐标
export function offsetXYFromParent(evt, offsetParent) {
  const isBody = offsetParent === offsetParent.ownerDocument.body;
  const offsetParentRect = isBody ? { left: 0, top: 0 } : offsetParent.getBoundingClientRect();

  const x = evt.clientX + offsetParent.scrollLeft - offsetParentRect.left;
  const y = evt.clientY + offsetParent.scrollTop - offsetParentRect.top;

  return { x, y };
}

export function createCSSTransform(controlPos, positionOffset) {
  const translation = getTranslation(controlPos, positionOffset, 'px');
  return { [browserPrefixToKey('transform', browserPrefix)]: translation };
}

export function getTranslation({ x, y }, positionOffset, unitSuffix) {
  let translation = `translate(${x}${unitSuffix},${y}${unitSuffix})`;
  if (positionOffset) {
    const defaultX = `${
      typeof positionOffset.x === 'string' ? positionOffset.x : positionOffset.x + unitSuffix
    }`;
    const defaultY = `${
      typeof positionOffset.y === 'string' ? positionOffset.y : positionOffset.y + unitSuffix
    }`;
    translation = `translate(${defaultX}, ${defaultY})${translation}`;
  }
  return translation;
}

export function getTouch(e, identifier) {
  return (
    (e.targetTouches && findInArray(e.targetTouches, t => identifier === t.identifier))
    || (e.changedTouches && findInArray(e.changedTouches, t => identifier === t.identifier))
  );
}

// 返回一个可以唯一地识别和触摸平面接触的点的值.
// 这个值在这根手指（或触摸笔等）所引发的所有事件中保持一致, 直到它离开触摸平面.
export function getTouchIdentifier(e) {
  if (e.targetTouches && e.targetTouches[0]) return e.targetTouches[0].identifier;
  if (e.changedTouches && e.changedTouches[0]) return e.changedTouches[0].identifier;
}

// User-select Hacks:
//
// Useful for preventing blue highlights all over everything when dragging.

// Note we're passing `document` b/c we could be iframed
export function addUserSelectStyles(doc) {
  if (!doc) return;
  let styleEl = doc.getElementById('react-draggable-style-el');
  if (!styleEl) {
    styleEl = doc.createElement('style');
    styleEl.type = 'text/css';
    styleEl.id = 'react-draggable-style-el';
    styleEl.innerHTML = `.react-draggable-transparent-selection *::-moz-selection {background: transparent;}
    .react-draggable-transparent-selection *::selection {background: transparent;}`;
    doc.getElementsByTagName('head')[0].appendChild(styleEl);
  }
  if (doc.body) addClassName(doc.body, 'react-draggable-transparent-selection');
}

export function removeUserSelectStyles(doc) {
  try {
    if (doc && doc.body) removeClassName(doc.body, 'react-draggable-transparent-selection');
    if (doc.selection) {
      doc.selection.empty();
    } else {
      window.getSelection().removeAllRanges(); // remove selection caused by scroll
    }
  } catch (e) {
    // probably IE
  }
}

export function styleHacks(childStyle) {
  return {
    touchAction: 'none',
    ...childStyle,
  };
}

export function addClassName(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else if (!el.className.match(new RegExp(`(?:^|\\s)${className}(?!\\S)`))) {
    el.className += ` ${className}`;
  }
}

export function removeClassName(el, className) {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    el.className = el.className.replace(new RegExp(`(?:^|\\s)${className}(?!\\S)`, 'g'), '');
  }
}

export function getBoundNode(node, bounds) {
  let boundNode = null;
  if (typeof bounds === 'string') {
    const { ownerDocument } = node;
    const ownerWindow = ownerDocument.defaultView;
    if (bounds === 'parent') {
      boundNode = node.parentNode;
    } else {
      boundNode = ownerDocument.querySelector(bounds);
    }
    log(
      boundNode instanceof ownerWindow.HTMLElement,
      `Bounds selector "${bounds}" could not find an element.`,
    );

    const boundNodeStyle = ownerWindow.getComputedStyle(boundNode);
    if (boundNodeStyle.position === 'static') {
      boundNode.style.position = 'relative';
    }
  }
  return boundNode;
}
