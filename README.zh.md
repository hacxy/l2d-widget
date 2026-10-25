<p align="center">
  <img width="240" src="https://hacxy-1259720482.cos.ap-hongkong.myqcloud.com/images/logo.svg"/>
</p>
<h1 align="center">l2d-widget</h1>
<h4 align="center">仅一个函数调用，把 Live2D 模型放进任何网页</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/l2d-widget"><img src="https://img.shields.io/npm/v/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=npm" alt="npm version"></a>
  <a href="https://www.npmjs.com/package/l2d-widget"><img src="https://img.shields.io/npm/dm/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=downloads" alt="downloads"></a>
  <a href="https://bundlephobia.com/package/l2d-widget"><img src="https://img.shields.io/bundlephobia/minzip/l2d-widget?color=FFB6C1&labelColor=1b1b1f&label=minzip" alt="bundle size"></a>
</p>

[文档](https://l2d-widget.hacxy.cn) | [English](./README.md)

> [!IMPORTANT]
> 本项目是基于 [l2d](https://github.com/hacxy/l2d) 库对 [oh-my-live2d](https://github.com/hacxy/oh-my-live2d) 的完全重构版本，原 `oh-my-live2d` 已更名为 **l2d-widget**。如果你正在从 `oh-my-live2d` 迁移，请查阅[文档站](https://l2d-widget.hacxy.cn)了解更新后的 API。

## 特性

- **单次调用集成** — `createWidget()` 一个函数完成 canvas 创建、WebGL 上下文初始化、模型加载与交互绑定
- **Cubism 2 & 6 运行时** — 基于 [l2d](https://github.com/hacxy/l2d)，自动识别模型版本并加载对应 Cubism 运行时
- **嘴型参数驱动** — 逐字打字动画实时驱动模型口型参数（`PARAM_MOUTH_OPEN_Y`），支持配置开合值域
- **完整生命周期管控** — `switchModel()` 退场过渡 → WebGL 销毁 → 重建 → 入场过渡，原子化异步操作；`destroy()` 确保资源释放
- **~500 行，零运行时依赖** — 纯 DOM + CSS Animation，无框架。同时输出 ESM 和 IIFE，支持 tree-shaking

## 安装

```bash
npm install l2d-widget
```

或通过 CDN 引入：

```html
<script src="https://unpkg.com/l2d-widget/dist/index.min.js"></script>
```

## 快速开始

```ts
import { createWidget } from 'l2d-widget';

const widget = createWidget({
  model: {
    path: 'https://model.hacxy.cn/cat-black/model.json',
  },
});
```

跑完之后页面左下角会出现一个 Live2D 角色，带悬浮菜单和提示气泡，可以交互。

## 示例

### 多模型切换

```ts
createWidget({
  model: [
    { path: '/models/cat-black/model.json' },
    { path: '/models/cat-white/model.json' },
  ],
});
```

传入数组时，菜单会自动出现切换按钮。

### 打字动画与嘴型同步

```ts
createWidget({
  model: {
    path: '/models/cat-black/model.json',
    tips: {
      typing: {
        param: 'PARAM_MOUTH_OPEN_Y',
        speed: 200,
      },
      welcomeMessage: ['你好！', '很高兴见到你！'],
      messages: ['休息一下吧～', '记得多喝水！'],
      duration: 4000,
      interval: 6000,
    },
  },
});
```

提示气泡会逐字显示文字，同时驱动模型的嘴型参数做开合动画。

## Widget 实例

`createWidget()` 返回一个 `Widget` 对象：

| 方法 / 属性          | 说明                                 |
| -------------------- | ------------------------------------ |
| `l2d`                | 底层 l2d 实例，用于高级控制          |
| `switchModel(index)` | 异步切换到指定索引的模型             |
| `sleep()`            | 隐藏模型并显示休眠状态栏，点击可唤醒 |
| `setDraggable(on)`   | 打开或关闭拖动                       |
| `destroy()`          | 销毁挂件，释放 WebGL 资源并移除 DOM  |

完整配置项见[文档站](https://l2d-widget.hacxy.cn)。

## 开发

| 命令         | 说明                               |
| ------------ | ---------------------------------- |
| `pnpm dev`   | 监听构建（含 sourcemap）           |
| `pnpm demo`  | 启动 demo 服务器（localhost:3000） |
| `pnpm build` | 生产构建                           |
| `pnpm lint`  | 代码检查                           |

## 许可证

[MIT](LICENSE)

---

> English documentation: [README.md](./README.md)
