import { TimelineRowStyle } from './styles/timelineRowStyle';
import { TimelineStyle } from './styles/timelineStyle';
import { TimelineRanged } from '../models/timelineRanged';

export interface TimelineOptions extends TimelineRanged {
  /**
   * Id 或时间轴容器的 HTMLElement
   */
  id?: string | HTMLElement | null;
  /**
   * 检查是否启用了捕捉
   */
  snapEnabled?: boolean;
  /**
   *  拖动时将所有选定的关键帧合并为一个包.
   */
  snapAllKeyframesOnMove?: boolean;
  /**
   * 以像素为单位的时间轴的近似步长为1秒
   */
  stepPx?: number;
  /**
   * 一个步骤中应该包含的点的个数。
   */
  stepVal?: number;
  stepSmallPx?: number;
  /**
   * 以单位表示。从0到stepVal
   */
  snapStep?: number;
  /**
   * 以像素为单位增加左页边距，从该值开始计算行距.
   */
  leftMargin?: number;
  /**
   * 组件header背景颜色.
   */
  headerFillColor?: string;
  /**
   * 组件背景颜色.
   */
  fillColor?: string;
  /**
   * 标题标签颜色.
   */
  labelsColor?: string;
  /**
   * 标题刻度条颜色.
   */
  tickColor?: string;
  /**
   * 选择矩形颜色.
   */
  selectionColor?: string;

  /**
   * 标题高度（以像素为单位）。
   */
  headerHeight?: number;
  /**
   * Header ticks font
   */
  font?: string;
  /**
   * Default zoom level = 1. where screen pixels are equals to the corresponding stepVal stepPx.
   */
  zoom?: number;
  /**
   * Default zoom speed.
   */
  zoomSpeed?: number;
  /**
   * Max zoom value.
   */
  zoomMin?: number;
  /**
   * Min zoom value.
   */
  zoomMax?: number;
  /**
   * Set this to true in a MAC OS environment: The Meta key will be used instead of the Ctrl key.
   */
  controlKeyIsMetaKey?: boolean;
  /**
   * Access the scroll container via this class for e.g. scroll bar styling.
   */
  scrollContainerClass?: string;
  /**
   * Default rows style.
   * Can be overridden by setting style individually for each row.
   */
  rowsStyle?: TimelineRowStyle;
  /**
   * Timeline indicator style.
   */
  timelineStyle?: TimelineStyle;

  /**
   * keyframes group is draggable. Default: true
   */
  groupsDraggable?: boolean;
  /**
   * keyframes group is draggable. Default: true
   */
  keyframesDraggable?: boolean;
  /**
   * Timeline can be dragged or position can be changed by user interaction. Default: true
   */
  timelineDraggable?: boolean;

  /**
   * Array of the denominators used to determine 'beautiful' numbers to be rendered for the gauge.
   * Default: [1, 2, 5, 10];
   */
  denominators?: number[];
}
