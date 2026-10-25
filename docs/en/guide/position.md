# Position & Transition

## Position

Place the widget at `'bottom-left'` (default) or `'bottom-right'`:

```ts
createWidget({
  model: { path: '/models/model.json' },
  position: 'bottom-right',
});
```

## Dragging

Set `draggable` to `true` to let visitors drag the model anywhere on the page — handy when it covers content. A drag only starts after the pointer moves more than 5px, so tapping the model and the hover menu keep working, and the widget is pulled back into view when the window shrinks. The default menu gets a lock button: once locked the model stays put until you click it again:

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: true,
});
```

Pass an object to change the drag threshold (`threshold`, default `5`px), or turn on `keepPosition` to save the position and the locked state to localStorage and restore them after a reload:

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: { threshold: 10, keepPosition: true },
});
```

If you replace the default menu with `menus.items`, use `widget.setDraggable()` and `widget.draggable` to build your own toggle:

```ts
const widget = createWidget({
  model: { path: '/models/model.json' },
  draggable: true,
  menus: {
    items: [
      { icon: 'mdi:lock-outline', label: 'Lock / unlock', onClick: w => w.setDraggable(!w.draggable) },
    ],
  },
});
```

## Size

Canvas defaults to `300`px. Pass a number for a square, or an object for separate width/height:

```ts
// Square 400x400
createWidget({
  model: { path: '/models/model.json' },
  size: 400,
});

// Separate width and height
createWidget({
  model: { path: '/models/model.json' },
  size: { width: 350, height: 500 },
});
```

## Transition Type

The entrance/exit animation can be `'slide'` (default) or `'fade'`:

```ts
createWidget({
  model: { path: '/models/model.json' },
  transitionType: 'fade',
  transitionDuration: 1000, // animation duration 1000ms (default 1500)
});
```

## Theme Color

`primaryColor` tints the menu, status bar, tip bubbles, and other UI elements:

```ts
createWidget({
  model: { path: '/models/model.json' },
  primaryColor: 'rgba(255, 130, 130, 0.9)', // pink theme
});
```
