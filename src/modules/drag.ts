import type { WidgetOptions } from '../types.js';

// 移动超过这个距离（px）才算拖动，轻点模型、悬停出菜单都不受影响
const DRAG_THRESHOLD = 5;

/**
 * 让挂件可以用鼠标或手指拖动，返回清理函数。
 * options 为假值时什么都不做；传 { storageKey } 时把位置存进 localStorage，下次创建时恢复
 */
export function setupDrag(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  options: WidgetOptions['draggable'],
): () => void {
  if (!options)
    return () => {};
  const storageKey = typeof options === 'object' ? options.storageKey : null;

  // 改用 left/top 定位，并限制在视口内，不让挂件被拖出屏幕
  function moveTo(left: number, top: number) {
    const maxLeft = Math.max(0, window.innerWidth - container.offsetWidth);
    const maxTop = Math.max(0, window.innerHeight - container.offsetHeight);
    Object.assign(container.style, {
      left: `${Math.min(Math.max(0, left), maxLeft)}px`,
      top: `${Math.min(Math.max(0, top), maxTop)}px`,
      right: 'auto',
      bottom: 'auto',
    });
  }

  function savePosition() {
    if (!storageKey)
      return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ left: container.offsetLeft, top: container.offsetTop }));
    }
    catch {
      // 隐私模式等情况下 localStorage 不可用，只是刷新后回到默认位置
    }
  }

  if (storageKey) {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null');
      if (typeof saved?.left === 'number' && typeof saved?.top === 'number')
        moveTo(saved.left, saved.top);
    }
    catch {
      // 读不到或格式不对就用默认位置
    }
  }

  let start: { x: number, y: number, left: number, top: number } | null = null;
  let dragging = false;
  // 触屏上拖动模型时不让页面跟着滚动
  canvas.style.touchAction = 'none';
  canvas.style.cursor = 'grab';

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0)
      return;
    start = { x: e.clientX, y: e.clientY, left: container.offsetLeft, top: container.offsetTop };
    dragging = false;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!start)
      return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!dragging && Math.hypot(dx, dy) < DRAG_THRESHOLD)
      return;
    if (!dragging) {
      dragging = true;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = 'grabbing';
    }
    moveTo(start.left + dx, start.top + dy);
  };
  const onPointerUp = () => {
    if (dragging) {
      canvas.style.cursor = 'grab';
      savePosition();
    }
    start = null;
    dragging = false;
  };
  // 窗口缩小后把挂件拉回视口内
  const onResize = () => {
    if (container.style.top)
      moveTo(container.offsetLeft, container.offsetTop);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  window.addEventListener('resize', onResize);
  return () => {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    window.removeEventListener('resize', onResize);
  };
}
