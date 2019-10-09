(function(doc, win) {
  const docEl = doc.documentElement;
  const recalc = function() {
    const clientWidth = 320; // PC端设计器设计宽度为320
    if (!clientWidth) return;
    docEl.style.fontSize = `${10 * (clientWidth / 320)}px`; // iphone 5 标准来 1rem=10px
  };
  if (!doc.addEventListener) return;
  win.addEventListener('resize', recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
}(document, window));
