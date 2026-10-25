import type { WidgetOptions } from '../types.js';

const STORAGE_KEY = 'l2d-widget-position';

export interface DragHandle {
  readonly enabled: boolean
  setEnabled: (enabled: boolean) => void
  destroy: () => void
}

/**
 * 让挂件可以用鼠标或手指拖动。
 * 没开 draggable 时监听也会装上，只是先关着，之后可以用 setEnabled 打开；
 * 开了 keepPosition 时，位置和锁定状态存进 localStorage，下次创建时恢复
 */
export function setupDrag(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  options: WidgetOptions['draggable'],
): DragHandle {
  const { threshold = 5, keepPosition = false } = typeof options === 'object' ? options : {};
  let enabled = Boolean(options);
  let start: { x: number, y: number, left: number, top: number } | null = null;
  let dragging = false;

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

  function save() {
    if (!keepPosition)
      return;
    // 没拖过就只记锁定状态，位置留给默认的角落
    const position = container.style.top ? { left: container.offsetLeft, top: container.offsetTop } : {};
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...position, locked: !enabled }));
    }
    catch {
      // 隐私模式等情况下 localStorage 不可用，只是刷新后回到默认状态
    }
  }

  function applyEnabled(value: boolean) {
    enabled = value;
    start = null;
    dragging = false;
    // 触屏上拖动模型时不让页面跟着滚动
    canvas.style.touchAction = value ? 'none' : '';
    canvas.style.cursor = value ? 'grab' : '';
  }

  if (keepPosition) {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
      if (typeof saved?.left === 'number' && typeof saved?.top === 'number')
        moveTo(saved.left, saved.top);
      if (saved?.locked === true)
        enabled = false;
    }
    catch {
      // 读不到或格式不对就用默认状态
    }
  }
  applyEnabled(enabled);

  const onPointerDown = (e: PointerEvent) => {
    if (!enabled || e.button !== 0)
      return;
    start = { x: e.clientX, y: e.clientY, left: container.offsetLeft, top: container.offsetTop };
    dragging = false;
  };
  const onPointerMove = (e: PointerEvent) => {
    if (!start)
      return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    // 移动超过阈值才算拖动，轻点模型、悬停出菜单都不受影响
    if (!dragging && Math.hypot(dx, dy) < threshold)
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
      save();
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
  return {
    get enabled() { return enabled; },
    setEnabled(value: boolean) {
      applyEnabled(value);
      save();
    },
    destroy() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('resize', onResize);
    },
  };
}
