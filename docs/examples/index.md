# 示例

每个示例都可以点"运行"按钮直接在线体验。

## 基础用法

最简配置，模型出现在左下角：

<DemoBlock demo="basic">

```ts
import { createWidget } from 'l2d-widget';

createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
});
```

</DemoBlock>

## 位置与动画

放到右下角，换成淡入效果：

<DemoBlock demo="bottom-right">

```ts
createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
  position: 'bottom-right',
  transitionType: 'fade',
});
```

</DemoBlock>

## 拖动

拖动模型，刷新后还在原来的位置：

<DemoBlock demo="draggable">

```ts
createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
  draggable: { keepPosition: true },
});
```

</DemoBlock>

## 多模型切换

给两个模型，菜单里就多了切换按钮：

<DemoBlock demo="multi-model">

```ts
createWidget({
  transitionType: 'fade',
  position: 'bottom-right',
  model: [
    { path: 'https://model.hacxy.cn/cat-black/model.json' },
    { path: 'https://model.hacxy.cn/cat-white/model.json' },
  ],
});
```

</DemoBlock>

## 自定义菜单

在默认菜单后面追加一个自定义按钮：

<DemoBlock demo="custom-menu">

```ts
createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
  menus: {
    extraItems: [
      {
        icon: 'mdi:emoticon-happy-outline',
        label: '播放动作',
        onClick(widget) {
          const motions = widget.l2d.getMotions();
          const groups = Object.keys(motions);
          if (groups.length > 0) {
            widget.l2d.playMotion(groups[0]!);
          }
        },
      },
    ],
  },
});
```

</DemoBlock>

## 打字动画与嘴型同步

气泡文字逐字打出的同时，模型的嘴也跟着动：

<DemoBlock demo="mouth-param">

```ts
createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
    tips: {
      offset: { y: -28, x: 10 },
      typing: {
        param: 'PARAM_MOUTH_OPEN_Y',
        speed: 200,
        minValue: 0,
        maxValue: 1,
      },
      welcomeMessage: ['你好，我是猫猫！', '今天天气真不错呢～'],
      messages: ['记得多喝水哦！', '休息一下眼睛吧～', '今天也要加油！'],
      duration: 4000,
      interval: 6000,
    },
  },
});
```

</DemoBlock>
