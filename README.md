<p align="center">
  <img width="240" src="https://hacxy-1259720482.cos.ap-hongkong.myqcloud.com/images/logo.svg"/>
</p>
<h1 align="center">l2d-widget</h1>
<h4 align="center">Drop a Live2D character onto any web page. One function call, zero framework dependencies.</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/l2d-widget"><img src="https://img.shields.io/npm/v/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/l2d-widget"><img src="https://img.shields.io/npm/dm/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=downloads" alt="downloads"></a>
  <a href="https://bundlephobia.com/package/l2d-widget"><img src="https://img.shields.io/bundlephobia/minzip/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=minzip" alt="bundle size"></a>
</p>

[Documentation](https://l2d-widget.hacxy.cn) | [中文](./README.zh.md)

> [!IMPORTANT]
> This project is a full rewrite of [oh-my-live2d](https://github.com/hacxy/oh-my-live2d) based on the [l2d](https://github.com/hacxy/l2d) library. The original `oh-my-live2d` has been renamed to **l2d-widget**. If you are migrating from `oh-my-live2d`, please refer to the [documentation](https://l2d-widget.hacxy.cn) for the updated API.

## Features

- **Single-call integration** — `createWidget()` handles canvas creation, WebGL context initialization, model loading, and interaction bindng in one call
- **Cubism 2 & 6 runtime** — built on [l2d](https://github.com/hacxy/l2d), auto-detects model version and loads the correct Cubism runtime
- **Lip-sync via parameter driving** — character-by-character typing animation drives mouth open/close parameters (`PARAM_MOUTH_OPEN_Y`) in real time with configurable value ranges
- **Full lifecycle control** — `switchModel()` runs exit transition → WebGL teardown → re-init → entrance transition as one atomic async operation; `destroy()` guarantees resource cleanup
- **~500 lines, zero runtime deps** — pure DOM + CSS Animation, no framework. Outputs ESM and IIFE, tree-shakeable

## Installation

```bash
npm install l2d-widget
```

Or use a CDN:

```html
<script src="https://unpkg.com/l2d-widget/dist/index.min.js"></script>
```

## Quick Start

```ts
import { createWidget } from 'l2d-widget';

const widget = createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
});
```

A Live2D model appears in the bottom-left corner of the page with a hover menu and tip bubbles. The returned `widget` object gives you programmatic control (switch models, sleep, destroy).

## Examples

### Multi-Model Switching

```ts
createWidget({
  model: [
    { path: '/models/cat-black/model.json' },
    { path: '/models/cat-white/model.json' },
  ],
});
```

A shuffle button appears automatically in the menu when multiple models are provided.

### Typing Animation with Lip-Sync

```ts
createWidget({
  model: {
    path: '/models/cat-black/model.json',
    tips: {
      typing: {
        param: 'PARAM_MOUTH_OPEN_Y',
        speed: 200,
      },
      welcomeMessage: ['Hello!', 'Nice to meet you!'],
      messages: ['Take a break~', 'Stay hydrated!'],
      duration: 4000,
      interval: 6000,
    },
  },
});
```

## Widget Instance

`createWidget()` returns a `Widget` object:

| Method / Property    | Description                              |
| -------------------- | ---------------------------------------- |
| `l2d`                | Underlying `l2d` instance                |
| `switchModel(index)` | Switch to a model by index               |
| `sleep()`            | Hide model; click the status bar to wake |
| `setDraggable(on)`   | Turn dragging on or off                  |
| `destroy()`          | Tear down widget and release resources   |

For the full options reference (`WidgetOptions`, `ModelOptions`, `MenusOptions`, `TipsOptions`), see the [documentation](https://l2d-widget.hacxy.cn).

## Development

| Command      | Purpose                       |
| ------------ | ----------------------------- |
| `pnpm dev`   | Watch build with sourcemaps   |
| `pnpm demo`  | Demo server at localhost:3000 |
| `pnpm build` | Production build              |
| `pnpm lint`  | Lint                          |

## License

[MIT](LICENSE)

---

> 中文文档请见 [README.zh.md](./README.zh.md)
