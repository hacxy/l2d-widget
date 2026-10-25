# 位置与动画

## 位置

`position` 决定挂件固定在页面的哪个角落——`'bottom-left'`（默认）或 `'bottom-right'`：

```ts
createWidget({
  model: { path: '/models/model.json' },
  position: 'bottom-right',
});
```

## 拖动

`draggable` 设为 `true` 后可以用鼠标或手指把模型拖到页面任意位置，模型挡住内容时访客可以自己挪开。按下后移动超过 5px 才算拖动，轻点模型、悬停出菜单都不受影响；窗口缩小时会自动拉回视口内。默认菜单里会多一个锁定按钮，锁定后就拖不动了，再点一下解锁：

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: true,
});
```

传对象可以调整拖动阈值（`threshold`，默认 `5`px），或者开启 `keepPosition`，把拖动后的位置和锁定状态存进 localStorage，刷新页面后保留：

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: { threshold: 10, keepPosition: true },
});
```

自己用 `menus.items` 换掉了默认菜单的话，可以用 `widget.setDraggable()` 和 `widget.draggable` 做开关：

```ts
const widget = createWidget({
  model: { path: '/models/model.json' },
  draggable: true,
  menus: {
    items: [
      { icon: 'mdi:lock-outline', label: '锁定 / 解锁', onClick: w => w.setDraggable(!w.draggable) },
    ],
  },
});
```

## 尺寸

`size` 设置 canvas 大小，默认 `300`。传数字就是正方形，传对象可以分别指定宽高：

```ts
// 正方形 400x400
createWidget({
  model: { path: '/models/model.json' },
  size: 400,
});

// 宽高分别指定
createWidget({
  model: { path: '/models/model.json' },
  size: { width: 350, height: 500 },
});
```

## 动画类型

`transitionType` 设置入场和退场的过渡效果。`'slide'`（默认）是滑入滑出，`'fade'` 是淡入淡出：

```ts
createWidget({
  model: { path: '/models/model.json' },
  transitionType: 'fade',
  transitionDuration: 1000, // 动画时长 1000ms（默认 1500）
});
```

## 主题色

`primaryColor` 统一控制菜单、状态栏、提示气泡这些 UI 元素的颜色，一处配置全局生效：

```ts
createWidget({
  model: { path: '/models/model.json' },
  primaryColor: 'rgba(255, 130, 130, 0.9)', // 粉红色主题
});
```
