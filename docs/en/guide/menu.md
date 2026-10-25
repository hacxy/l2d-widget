# Menu Customization

Circular action buttons appear when you hover over the model.

## Default Menu

Out of the box you get:

- Switch Model — only shown when multiple models are configured
- Lock / unlock dragging — only shown when `draggable` is on
- Sleep — hides the model and shows a sleep status bar
- About — opens the project's GitHub page

## Appending Menu Items

Add your own buttons after the defaults with `menus.extraItems`:

```ts
createWidget({
  model: { path: '/models/model.json' },
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

## Fully Replacing the Menu

To throw out the defaults entirely, use `menus.items` instead (`extraItems` is ignored when `items` is set):

```ts
createWidget({
  model: { path: '/models/model.json' },
  menus: {
    items: [
      {
        icon: 'mdi:bed',
        label: 'Sleep',
        onClick(widget) {
          widget.sleep();
        },
      },
    ],
  },
});
```

## Menu Alignment

`menus.align` sets which side of the canvas the menu sits on — defaults to `'right'`:

```ts
createWidget({
  model: { path: '/models/model.json' },
  menus: { align: 'left' },
});
```

## Icons

Icons use [Iconify](https://icon-sets.iconify.design/) names in `"prefix:name"` format, e.g. `"mdi:home"`. They're fetched from the Iconify API and cached.

If an icon fails to load, the button falls back to showing the `label` text.
