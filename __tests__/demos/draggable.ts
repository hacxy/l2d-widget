import type { Widget } from 'l2d-widget';
import { createWidget } from 'l2d-widget';

export default {
  name: 'Draggable',
  description: '可以拖动模型，刷新后保留位置',
  run(): Widget {
    return createWidget({
      model: {
        path: 'https://model.hacxy.cn/cat-black/model.json',
      },
      draggable: { storageKey: 'l2d-widget-demo-position' },
    });
  },
};
