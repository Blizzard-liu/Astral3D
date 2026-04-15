import { TimelineGroupStyle } from '../styles/timelineGroupStyle';
export const defaultRowHeight = 24;
const margin = 4;
export const defaultGroupStyle = {
    height: 'auto',
    marginTop: margin,
    /**
     * Default group fill color.
     */
    fillColor: '#094771',
    /**
     * 组默认文本设置
     */
    text: {
        label: "",
        isStroke:false,
        font: '10px sans-serif',
        textAlign: 'center',
        textBaseline: 'middle',
        direction:"inherit",
        fillColor: '#fff'
    }
} as TimelineGroupStyle;
