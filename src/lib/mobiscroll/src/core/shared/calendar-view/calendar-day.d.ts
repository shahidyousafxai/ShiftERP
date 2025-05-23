import { BaseComponent, IBaseProps } from '../../base';
import { ITimezonePlugin } from '../../util/datetime';
import { ICalendarLabelData, MbscCalendarMarked } from './calendar-view.types';
import { ILabelDragData, ILabelDragDataSet, MbscCalendarEvent, MbscCalendarEventData, MbscResource } from './calendar-view.types';
/** @hidden */
export interface ICalendarDayProps extends IBaseProps {
  active?: boolean;
  amText?: string;
  colors?: any;
  clickToCreate?: boolean | 'double' | 'single';
  date: number;
  day?: string;
  disabled?: boolean;
  display?: boolean;
  dataTimezone?: string;
  displayTimezone?: string;
  dragData?: ILabelDragData;
  dragToCreate?: boolean;
  dragToMove?: boolean;
  dragToResize?: boolean;
  exclusiveEndDates?: boolean;
  firstDay?: number;
  hasMarks?: boolean;
  hoverEnd?: number;
  hoverStart?: number;
  isActiveMonth?: boolean;
  isPicker?: boolean;
  labels?: ICalendarLabelData;
  pmText?: string;
  marks?: MbscCalendarMarked[];
  month?: string;
  monthShort?: string;
  outer?: boolean;
  rangeEnd?: number;
  rangeStart?: number;
  resourcesMap?: {
    [key: number]: MbscResource;
  };
  rtl?: boolean;
  selected?: boolean;
  selectedEventsMap?: {
    [key: number]: MbscCalendarEvent;
  };
  showEventTooltip?: boolean;
  text?: string | number;
  theme?: string;
  timeFormat?: string;
  timezonePlugin?: ITimezonePlugin;
  type?: 'day' | 'month' | 'year';
  year?: number;
  eventText?: string;
  eventsText?: string;
  todayText?: string;
  dayTemplate?(args: MbscCalendarDayData): any;
  dayContentTemplate?(args: MbscCalendarDayData): any;
  onDayClick?(args: any, inst: any): void;
  onDayDoubleClick?(args: any, inst: any): void;
  onDayRightClick?(args: any, inst: any): void;
  onHoverIn?(args: any, inst: any): void;
  onHoverOut?(args: any, inst: any): void;
  onLabelClick?(args: any, inst: any): void;
  onLabelDoubleClick?(args: any, inst: any): void;
  onLabelHoverIn?(args: any, inst: any): void;
  onLabelHoverOut?(args: any, inst: any): void;
  onLabelRightClick?(args: any, inst: any): void;
  onLabelDelete?(args: any, inst: any): void;
  onLabelUpdateStart?(args: any): void;
  onLabelUpdateMove?(args: any): void;
  onLabelUpdateEnd?(args: any): void;
  onLabelUpdateModeOn?(args: any): void;
  onLabelUpdateModeOff?(args: any): void;
  renderDay?(args: MbscCalendarDayData): any;
  renderDayContent?(args: MbscCalendarDayData): any;
  renderLabel?(event: MbscCalendarEventData): any;
  renderLabelContent?(event: MbscCalendarEventData): any;
}
/** @hidden */
export interface ICalendarDayState {
  hasFocus?: boolean;
  hasHover?: boolean;
  dragShadow?: any;
}
export interface MbscCalendarDayData {
  date: Date;
  events?: MbscCalendarEvent[];
  selected?: boolean;
  resource?: number | string;
}
/** @hidden */
export declare class CalendarDayBase extends BaseComponent<ICalendarDayProps, ICalendarDayState> {
  _ariaLabel: string;
  _cssClass: string;
  _data: MbscCalendarDayData;
  _cellStyles: any;
  _circleStyles: any;
  _todayClass: string;
  _draggedLabel: ILabelDragDataSet | undefined;
  _draggedLabelOrig: ILabelDragDataSet | undefined;
  private _unlisten;
  _onClick: (ev: any) => void;
  _onRightClick: (ev: any) => void;
  _onLabelClick: (args: any) => void;
  _onLabelDoubleClick: (args: any) => void;
  _onLabelRightClick: (args: any) => void;
  _onLabelHoverIn: (args: any) => void;
  _onLabelHoverOut: (args: any) => void;
  protected _mounted(): void;
  protected _render(s: ICalendarDayProps, state: ICalendarDayState): void;
  protected _destroy(): void;
  private _cellClick;
  private _labelClick;
}
