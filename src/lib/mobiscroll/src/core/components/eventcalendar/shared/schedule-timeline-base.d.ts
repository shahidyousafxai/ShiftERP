import { BaseComponent } from '../../../base';
import { MbscCalendarEvent, MbscCalendarEventData, MbscResource } from '../eventcalendar';
import { MbscSlot } from '../eventcalendar.types';
import {
  IDailyColors,
  IDailyEvents,
  IDailyInvalids,
  IDayData,
  IEventPosData,
  ISTOptions,
  ISTState,
  IVirtualPage
} from './schedule-timeline-base.types';
/** @hidden */
export declare class STBase<PropType extends ISTOptions, StateType extends ISTState> extends BaseComponent<PropType, StateType> {
  _batchEnd: Date;
  _batchStart: Date;
  _batchRowNr: number;
  _colors: {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyColors;
      };
    };
  };
  /** Map containing the day index for each day; timestamp ->  dayIndex */
  _dayIndexMap: {
    [key: string]: number;
  };
  _dayNames: string[];
  /** Array containing the days to display */
  _days: IDayData[];
  _daysBatch: IDayData[];
  _daysBatchNr: number;
  /** Number of displayed days */
  _daysNr: number;
  _dayWidth: number;
  _displayTime: boolean;
  _endCellStyle:
    | {
        height?: string;
        width?: string;
      }
    | undefined;
  /** Displayed end time as milliseconds since midnight */
  _endTime: number;
  _eventHeight: number;
  _eventMap: {
    [key: string]: MbscCalendarEventData;
  };
  /** Number of event rows for a resource, used for row height calculation */
  _eventRows: {
    [key: number]: number;
  };
  _events: {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyEvents;
      };
    };
  };
  _firstDay: Date;
  _firstDayTz: Date;
  _gridWidth: number;
  _groupByResource: boolean;
  _gridHeight: number;
  _hasHierarchy: boolean;
  _hasSlots: boolean;
  _hasSideSticky: boolean;
  _hasSticky: boolean;
  _headerClass: string;
  _headerDays: IDayData[];
  _invalids: {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyInvalids;
      };
    };
  };
  _isMulti: boolean;
  _isSingleResource: boolean;
  _isTimeline: boolean;
  _lastDay: Date;
  _lastDayTz: Date;
  _placeholderSizeX: number;
  _placeholderSizeY: number;
  /** Contains the resources flatten out into one level */
  _resources: MbscResource[];
  _resourcesBatch: MbscResource[];
  _selectedDay: number;
  _setRowHeight: boolean;
  _showTimeIndicator: boolean;
  _showCursorTime: boolean;
  _slots: MbscSlot[];
  _startCellStyle:
    | {
        height?: string;
        width?: string;
      }
    | undefined;
  /** Displayed start time as milliseconds since midnight */
  _startTime: number;
  _stepCell: number;
  _stepLabel: number;
  /** Displayed time as milliseconds */
  _time: number;
  /** Array containing the hours to display */
  _timeLabels: {
    [key: number]: string;
  };
  _times: number[];
  _timesBetween: number[];
  protected _calcConnections: boolean;
  protected _cursorTimeCont: HTMLElement | null;
  protected _gridCont: HTMLElement | null;
  protected _headerCont: HTMLElement | null;
  protected _isParentClick: boolean;
  protected _resCont: HTMLElement | null;
  protected _resourceTops: {
    [key: string]: number;
  };
  protected _scrollCont: HTMLElement | null;
  protected _shouldAnimateScroll: boolean | undefined;
  protected _shouldCheckSize: boolean;
  protected _shouldScroll: boolean;
  protected _visibleResources: MbscResource[];
  protected _virtualPagesY: IVirtualPage[];
  private _allDayTop;
  private _cursorX;
  private _cursorY;
  private _colHeight;
  private _colWidth;
  private _gridContBottom;
  private _gridContLeft;
  private _gridContRight;
  private _gridContTop;
  private _gridLeft;
  private _gridRight;
  private _gridTop;
  private _isCursorTimeVisible;
  private _isTouch;
  private _onCalendar;
  private _resWidth;
  private _scrollTimer;
  private _scrollX;
  private _scrollY;
  private _tempAllDay;
  private _tempEnd;
  private _tempEvent;
  private _tempResource;
  private _tempSlot;
  private _tempStart;
  private _touchTimer;
  private _unlisten;
  private _unsubscribe;
  _isToday(d: number): boolean;
  _formatTime(v: number, timezone?: string): string;
  _onScroll: () => void;
  _onTouchStart: () => void;
  _onMouseLeave: () => void;
  _onMouseMove: (ev?: any, delta?: number) => void;
  _onEventDragModeOn: (args: any) => void;
  _onEventDragModeOff: (args: any) => void;
  _onEventDragStart: (args: any) => void;
  _onEventDragMove: (args: any) => void;
  _onEventDragEnd: (args: any) => void;
  _onExternalDrag: (args: any) => void;
  protected _getEventPos(
    event: MbscCalendarEventData,
    day: Date,
    dateKey: string,
    displayedMap: Map<MbscCalendarEvent, boolean>
  ): IEventPosData | undefined;
  protected _getEventData(event: MbscCalendarEvent, d: Date, resource?: MbscResource, skipLabels?: boolean): MbscCalendarEventData;
  protected _getEvents(eventMap: { [key: string]: MbscCalendarEvent[] }): {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyEvents;
      };
    };
  };
  protected _getInvalids(invalidMap: { [key: string]: MbscCalendarEvent[] }): {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyInvalids;
      };
    };
  };
  protected _getColors(colorMap: { [key: string]: MbscCalendarEvent[] }): {
    [key: string]: {
      [key: string]: {
        [key: string]: IDailyColors;
      };
    };
  };
  protected _flattenResources(
    resources: MbscResource[] | null | undefined,
    flat: MbscResource[],
    depth: number,
    all?: boolean
  ): MbscResource[];
  protected _render(s: ISTOptions, state: ISTState): void;
  protected _mounted(): void;
  protected _updated(): void;
  protected _destroy(): void;
  private _calcGridSizes;
  private _getDragDates;
  /**
   * Returns a date with the time based on the coordinates on the grid.
   * @param day We're on this day.
   * @param posX X coord - for timeline.
   * @param posY Y coord - for schedule.
   * @param dayIndex Index of the day on the timeline.
   * @param timeStep Time step in minutes.
   */
  private _getGridTime;
  private _scrollToTime;
}
