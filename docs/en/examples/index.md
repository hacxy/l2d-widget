# Examples

Hit "Run" to try each one live.

## Basic Usage

Bare minimum — model at bottom-left:

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

## Position & Transition

Bottom-right placement with a fade-in:

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

## Dragging

Drag the model around; it stays where you left it after a reload:

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

## Multi-Model Switching

Two models — the switch button shows up on its own:

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

## Custom Menu

Extra buttons appended after the defaults:

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
        label: 'Play motion',
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

## Typing Animation with Lip-Sync

Character-by-character typing with mouth movement:

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
      welcomeMessage: ['Hello, I am a cat!', 'Nice weather today~'],
      messages: ['Stay hydrated!', 'Rest your eyes~', 'Keep going!'],
      duration: 4000,
      interval: 6000,
    },
  },
});
```

</DemoBlock>
