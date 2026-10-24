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

Set `draggable` to `true` to let visitors drag the model anywhere on the page — handy when it covers content. A drag only starts after the pointer moves more than 5px, so tapping the model and the hover menu keep working, and the widget is pulled back into view when the window shrinks:

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: true,
});
```

Pass an object with `storageKey` to save the position to localStorage and restore it after a reload:

```ts
createWidget({
  model: { path: '/models/model.json' },
  draggable: { storageKey: 'l2d-widget-position' },
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
