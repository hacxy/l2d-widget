import type { DragHandle } from './modules/drag.js';
import type { MenuItem, ModelOptions, Widget } from './types.js';

export function getDefaultItems(models: ModelOptions[], drag: DragHandle | null): MenuItem[] {
  const items: MenuItem[] = [];

  if (models.length > 1) {
    let idx = 0;
    items.push({
      icon: 'mdi:shuffle-variant',
      label: 'Switch model',
      onClick(widget: Widget) {
        idx = (idx + 1) % models.length;
        void widget.switchModel(idx);
      },
    });
  }

  if (drag) {
    // 图标表示当前状态，label 是点了之后会做的事
    items.push({
      get icon() { return drag.enabled ? 'mdi:cursor-move' : 'mdi:lock-outline'; },
      get label() { return drag.enabled ? '锁定位置' : '允许拖动'; },
      onClick(widget: Widget) {
        widget.setDraggable(!widget.draggable);
      },
    });
  }

  items.push({
    icon: 'mdi:bed',
    label: '休眠',
    onClick(widget: Widget) {
      widget.sleep();
    },
  });

  items.push({
    icon: 'mdi:information-outline',
    label: 'About',
    onClick() {
      window.open('https://github.com/hacxy/l2d-widget', '_blank', 'noopener');
    },
  });

  return items;
}
