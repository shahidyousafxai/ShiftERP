import { MbscResource } from '../eventcalendar';
import { MbscSlotData } from '../eventcalendar.types';
import { STBase } from '../shared/schedule-timeline-base';
import { ISTOptions, ISTState } from '../shared/schedule-timeline-base.types';
export interface ITimelineOptions extends ISTOptions {
  type: 'week' | 'day' | 'month' | 'year';
  renderSlot?(args: MbscSlotData): any;
}
export interface ITimelineState extends ISTState {
  scrollDay?: Date;
}
interface IConnectionData {
  color?: string;
  cssClass?: string;
  fill?: string;
  id: string;
  pathD: string;
  startDate: Date;
  endDate: Date;
}
/** @hidden */
export declare class TimelineBase extends STBase<ITimelineOptions, ITimelineState> {
  _isTimeline: boolean;
  _connections: IConnectionData[] | undefined;
  protected _stickyHeader: HTMLElement | null;
  protected _stickyDate: HTMLElement | null;
  protected _stickyMonth: HTMLElement | null;
  protected _stickyWeek: HTMLElement | null;
  _onScroll: () => void;
  _onParentClick(resource: MbscResource): void;
  protected _render(s: ITimelineOptions, state: ITimelineState): void;
}
export {};
