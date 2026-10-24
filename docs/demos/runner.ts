const demos: Record<string, () => Promise<{ default: { run: () => void } }>> = {
  'basic': () => import('./basic'),
  'bottom-right': () => import('./bottom-right'),
  'draggable': () => import('./draggable'),
  'custom-menu': () => import('./custom-menu'),
  'multi-model': () => import('./multi-model'),
  'transition': () => import('./transition'),
  'mouth-param': () => import('./mouth-param'),
};

const name = new URLSearchParams(location.search).get('demo');
if (name && demos[name]) {
  demos[name]().then(mod => mod.default.run());
}
