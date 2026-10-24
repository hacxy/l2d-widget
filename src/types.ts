import type { L2D } from 'l2d';

export interface ModelOptions {
  /** 模型文件路径（.model.json 或 .model3.json） */
  path: string
  /** 缩放比例，默认 1 */
  scale?: number
  /** 位置偏移 [x, y]，x 正值右移，y 正值上移，范围通常 -2 ~ 2 */
  offset?: [x: number, y: number]
  /** 动作声音音量 0~1，默认 0（静音） */
  volume?: number
  /** 日志级别，默认 'warn' */
  logLevel?: 'error' | 'warn' | 'info' | 'trace'
  /** 模型专属 tips 配置，传 false 关闭 */
  tips?: TipsOptions | false
}

export interface MenuItem {
  /**
   * Iconify 图标名称，如 "mdi:shuffle-variant"
   * @see https://icon-sets.iconify.design/
   */
  icon?: string
  /** 无障碍标题，图标加载失败时作为按钮文本回退 */
  label: string
  onClick: (widget: Widget) => void
}

export interface MenusOptions {
  /** 完全替换默认菜单项（提供时 extraItems 被忽略） */
  items?: MenuItem[]
  /** 追加到默认菜单末尾 */
  extraItems?: MenuItem[]
  /** 菜单对齐方式，默认 'right' */
  align?: 'left' | 'right'
  /** 自定义菜单容器样式，会合并覆盖默认样式 */
  style?: Partial<CSSStyleDeclaration>
}

export interface TipsOptions {
  /** 欢迎语，模型首次入场后随机取一条显示，默认内置几条 */
  welcomeMessage?: string[]
  /** 循环提示内容 */
  messages?: string[]
  /** 每条 tips 展示时长（ms），默认 3000 */
  duration?: number
  /** tips 循环间隔（ms），默认 5000 */
  interval?: number
  /** 打字动画与嘴型同步配置，配置后 tips 文字以逐字打字效果展示 */
  typing?: {
    /**
     * 嘴型参数名，如 'PARAM_MOUTH_OPEN_Y'
     * @see https://docs.live2d.com/
     */
    /** 嘴型参数名，如 'PARAM_MOUTH_OPEN_Y'；不填则只播放打字动画，不驱动嘴型 */
    param?: string
    /** 打字速度（ms/字），默认 100 */
    speed?: number
    /** 嘴型开合最小随机值（0~1），默认 0.5 */
    minValue?: number
    /** 嘴型开合最大随机值（0~1），默认 1 */
    maxValue?: number
  }
  /**
   * 位置偏移量（px），基于默认位置（模型正上方居中）进行微调
   * @example { x: 20, y: -10 }  // 向右 20px，向上 10px
   */
  offset?: { x?: number, y?: number }
  /** 自定义气泡样式，会合并覆盖默认样式 */
  style?: Partial<CSSStyleDeclaration>
}

export interface WidgetOptions {
  /** 模型配置，传数组时支持多模型切换 */
  model: ModelOptions | ModelOptions[]
  /** 展示位置，默认 'bottom-left' */
  position?: 'bottom-left' | 'bottom-right'
  /** canvas 尺寸（px），默认 300。传对象可分别指定宽高 */
  size?: number | { width: number, height: number }
  /** 主题色，用于菜单、状态条等 UI 元素的背景色，默认浅蓝色 'rgba(96,165,250,0.9)' */
  primaryColor?: string
  /** 滑入/滑出动画时长（ms），默认 1500 */
  transitionDuration?: number
  /** 入场/退场动画类型，默认 'slide' */
  transitionType?: 'slide' | 'fade'
  /**
   * 是否允许用鼠标或手指拖动挂件，默认 false。
   * 传对象并指定 storageKey 时，拖动后的位置会存进 localStorage，刷新页面后恢复
   */
  draggable?: boolean | {
    /** 保存位置用的 localStorage 键名，不填则不保存 */
    storageKey?: string
  }
  /** 菜单配置 */
  menus?: MenusOptions
  /** 状态条配置 */
  statusBar?: {
    /** 自定义状态条样式，会合并覆盖默认样式 */
    style?: Partial<CSSStyleDeclaration>
  }
}

export interface Widget {
  /** 底层 l2d 实例，供高级用途（model 切换后自动更新） */
  readonly l2d: L2D
  /** 切换到指定索引的模型（model 为数组时有效） */
  switchModel: (index: number) => Promise<void>
  /** 隐藏模型，显示休息状态条；点击状态条可恢复 */
  sleep: () => void
  /** 销毁 widget，退场动画完成后释放 WebGL 资源并移除 DOM */
  destroy: () => Promise<void>
}
