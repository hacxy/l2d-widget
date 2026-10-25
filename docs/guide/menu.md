# 菜单定制

鼠标移到模型上，旁边会弹出一组圆形按钮——这就是菜单。

## 默认菜单

开箱自带三个按钮：

- 切换模型 — 只有传了多个模型时才会出现
- 锁定 / 解锁拖动 — 只有开了 `draggable` 时才会出现
- 休眠 — 把模型藏起来，显示休眠状态栏
- 关于 — 跳转到项目 GitHub 页面

## 追加菜单项

想在默认菜单后面加几个自定义按钮？用 `menus.extraItems`：

```ts
createWidget({
  model: { path: '/models/model.json' },
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

## 完全替换菜单

如果默认按钮不合适，用 `menus.items` 整个换掉（设了 `items` 后 `extraItems` 就不生效了）：

```ts
createWidget({
  model: { path: '/models/model.json' },
  menus: {
    items: [
      {
        icon: 'mdi:bed',
        label: '休眠',
        onClick(widget) {
          widget.sleep();
        },
      },
    ],
  },
});
```

## 菜单对齐

`menus.align` 决定菜单出现在 canvas 的哪一侧，默认 `'right'`：

```ts
createWidget({
  model: { path: '/models/model.json' },
  menus: { align: 'left' },
});
```

## 图标

`icon` 用的是 [Iconify](https://icon-sets.iconify.design/) 图标名，格式 `"prefix:name"`，比如 `"mdi:home"`。图标会通过 Iconify API 远程加载并缓存到本地。

加载失败的话，按钮会退回显示 `label` 文本，不会空着。
