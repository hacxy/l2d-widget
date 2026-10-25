import type { DragHandle } from './modules/drag.js';
import type { MenuHandle } from './modules/menu.js';
import type { TipsHandle } from './modules/tips.js';
import type { MenusOptions, ModelOptions, TipsOptions, Widget, WidgetOptions } from './types.js';
import { init } from 'l2d';
import { getDefaultItems } from './defaults.js';
import { setupDrag } from './modules/drag.js';
import { createMenu } from './modules/menu.js';
import { createStatusBar } from './modules/status-bar.js';
import { createTips } from './modules/tips.js';

function resolveSize(size: number | { width: number, height: number }) {
  return typeof size === 'number' ? { width: size, height: size } : size;
}

function buildAnimationStyle(useSlide: boolean, duration: number) {
  return useSlide
    ? { transform: 'translateY(130%)', transition: `transform ${duration}ms cubic-bezier(0.19, 1, 0.22, 1)`, willChange: 'transform' }
    : { opacity: '0', transition: `opacity ${duration}ms ease-in-out`, willChange: 'opacity' };
}

// 默认贴在底部，往下滑自身高度的 130% 就出了视口；拖动过的挂件可能停在屏幕中间，要滑一整个视口高度才藏得住
function hiddenTransform(container: HTMLDivElement) {
  return container.style.top ? 'translateY(100vh)' : 'translateY(130%)';
}

function applyStyle(container: HTMLDivElement, useSlide: boolean, visible: boolean) {
  if (useSlide) {
    container.style.transform = visible ? 'translateY(0)' : hiddenTransform(container);
  }
  else {
    container.style.opacity = visible ? '1' : '0';
  }
}

function resolveMenuItems(models: ModelOptions[], opts: MenusOptions | undefined, drag: DragHandle | null) {
  if (opts?.items)
    return opts.items;
  return [...getDefaultItems(models, drag), ...(opts?.extraItems ?? [])];
}

function resolveTipsOptions(opts: TipsOptions | false | undefined) {
  if (opts === false)
    return null;
  return {
    welcomeMessages: opts?.welcomeMessage ?? ['欢迎来访！', '好久不见，欢迎回来！', '你来啦～'],
    messages: opts?.messages ?? ['记得多休息哦～', '有什么可以帮你的吗？', '今天也要开心哦！'],
    duration: opts?.duration ?? 3000,
    interval: opts?.interval ?? 5000,
  };
}

function setupMenuHover(canvas: HTMLCanvasElement, menu: MenuHandle): () => void {
  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  const show = () => {
    clearTimeout(hideTimer);
    menu.show();
  };

  const hide = () => {
    hideTimer = setTimeout(() => {
      menu.hide();
    }, 150);
  };

  canvas.addEventListener('mouseenter', show);
  canvas.addEventListener('mouseleave', hide);
  menu.el.addEventListener('mouseenter', show);
  menu.el.addEventListener('mouseleave', hide);

  return () => {
    clearTimeout(hideTimer);
  };
}

export function createWidget(options: WidgetOptions): Widget {
  const {
    position = 'bottom-left',
    size = 300,
    transitionDuration = 1500,
    transitionType,
    primaryColor = 'rgba(96,165,250,0.9)',
    menus: menusOptions,
    statusBar: statusBarOptions,
  } = options;

  const models = Array.isArray(options.model) ? options.model : [options.model];
  const { width, height } = resolveSize(size);
  const useSlide = transitionType !== 'fade';

  const container = document.createElement('div');
  Object.assign(container.style, {
    position: 'fixed',
    bottom: '0',
    [position === 'bottom-right' ? 'right' : 'left']: '0',
    zIndex: '9999',
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: 'none',
    ...buildAnimationStyle(useSlide, transitionDuration),
  });

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  Object.assign(canvas.style, { width: '100%', height: '100%', pointerEvents: 'auto' });
  container.appendChild(canvas);
  document.body.appendChild(container);

  const drag = setupDrag(container, canvas, options.draggable);
  // 恢复了上次拖动的位置时，入场前的隐藏位置也要跟着换
  applyStyle(container, useSlide, false);

  const statusBar = createStatusBar(position, transitionDuration, height, primaryColor, statusBarOptions?.style);
  document.body.appendChild(statusBar.el);

  let l2dInstance = init(canvas);

  let menu: MenuHandle;
  let tips: TipsHandle | undefined;
  let cancelHover: () => void;
  let welcomeTimer: ReturnType<typeof setTimeout> | undefined;
  let showTipHideTimer: ReturnType<typeof setTimeout> | undefined;
  let tipsTimer: ReturnType<typeof setInterval> | undefined;
  let msgIndex = 0;
  let currentModelTipsData = resolveTipsOptions(models[0]?.tips);

  function showTip(msg: string) {
    if (!currentModelTipsData)
      return;
    tips?.show(msg, l2dInstance);
    showTipHideTimer = setTimeout(() => {
      tips?.hide();
    }, currentModelTipsData.duration);
  }

  function stopTipsLoop() {
    clearTimeout(welcomeTimer);
    clearTimeout(showTipHideTimer);
    clearInterval(tipsTimer);
  }

  function startTipsLoop() {
    if (!currentModelTipsData || currentModelTipsData.messages.length === 0)
      return;
    stopTipsLoop();
    tipsTimer = setInterval(() => {
      showTip(currentModelTipsData!.messages[msgIndex % currentModelTipsData!.messages.length]!);
      msgIndex++;
    }, currentModelTipsData.interval);
  }

  function launchTips() {
    if (!currentModelTipsData || currentModelTipsData.welcomeMessages.length === 0)
      return;
    const msgs = currentModelTipsData.welcomeMessages;
    welcomeTimer = setTimeout(() => {
      showTip(msgs[Math.floor(Math.random() * msgs.length)]!);
      startTipsLoop();
    }, transitionDuration);
  }

  function loadModel(index: number) {
    const m = models[index]!;
    return l2dInstance.load({ path: m.path, scale: m.scale, position: m.offset, volume: m.volume, logLevel: m.logLevel });
  }

  function startLoading(index: number) {
    const model = models[index]!;
    currentModelTipsData = resolveTipsOptions(model.tips);
    msgIndex = 0;

    if (tips) {
      tips.destroy();
      tips = null as unknown as TipsHandle | undefined;
    }
    if (currentModelTipsData) {
      const tipsOpts = model.tips as TipsOptions | undefined;
      tips = createTips(primaryColor, {
        offset: tipsOpts?.offset,
        typing: tipsOpts?.typing,
        style: tipsOpts?.style,
      });
      container.appendChild(tips.el);
    }

    statusBar.showLoading();
    l2dInstance.on('loaded', () => {
      statusBar.hide();
      applyStyle(container, useSlide, true);
      launchTips();
    });
  }

  startLoading(0);
  void loadModel(0);

  function waitExit(): Promise<void> {
    return useSlide
      ? new Promise<void>(resolve => {
        container.addEventListener('transitionend', () => {
          resolve();
        }, { once: true });
      })
      : new Promise<void>(resolve => {
        setTimeout(resolve, transitionDuration);
      });
  }

  const widget: Widget = {
    get l2d() { return l2dInstance; },

    get draggable() { return drag.enabled; },

    setDraggable(enabled: boolean) {
      drag.setEnabled(enabled);
      menu.refresh();
    },

    sleep() {
      stopTipsLoop();
      tips?.hide();
      applyStyle(container, useSlide, false);
      canvas.style.pointerEvents = 'none';
      menu.hide();
      statusBar.showRest(() => {
        canvas.style.pointerEvents = 'auto';
        statusBar.hide();
        applyStyle(container, useSlide, true);
        launchTips();
      });
    },

    async switchModel(index: number) {
      stopTipsLoop();
      tips?.hide();
      statusBar.showLoading('切换中');
      applyStyle(container, useSlide, false);
      await waitExit();
      const waitDestroy = new Promise<void>(r => {
        l2dInstance.on('destroy', r);
      });
      l2dInstance.destroy();
      await waitDestroy;
      l2dInstance = init(canvas);
      startLoading(index);
      await loadModel(index);
    },

    async destroy() {
      stopTipsLoop();
      cancelHover();
      drag.destroy();
      tips?.destroy();
      menu.destroy();
      statusBar.destroy();
      applyStyle(container, useSlide, false);
      await waitExit();
      l2dInstance.destroy();
      document.body.removeChild(container);
    },
  };

  // 开了 draggable 才在默认菜单里放拖动开关
  menu = createMenu(resolveMenuItems(models, menusOptions, options.draggable ? drag : null), widget, {
    align: menusOptions?.align,
    primaryColor,
    style: menusOptions?.style,
  });
  container.appendChild(menu.el);
  cancelHover = setupMenuHover(canvas, menu);

  return widget;
}
