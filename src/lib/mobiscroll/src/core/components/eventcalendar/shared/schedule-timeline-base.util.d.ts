import { IDatetimeProps } from '../../../util/datetime';
import { MbscCalendarEvent, MbscCalendarEventData, MbscResource } from '../eventcalendar';
import { MbscSlot } from '../eventcalendar.types';
import { IDailyInvalids } from './schedule-timeline-base.types';
export declare const DEF_ID = 'mbsc-def';
/** @hidden */
export declare function checkInvalidCollision(
  invalids: {
    [key: number]: IDailyInvalids;
  },
  start: Date,
  end: Date,
  allDay: boolean | undefined,
  invalidateEvent: 'start-end' | 'strict' | undefined,
  exclusiveEndDates?: boolean
): MbscCalendarEvent | boolean;
/** @hidden */
export declare function calcLayout(
  s: IDatetimeProps,
  groups: MbscCalendarEventData[][][],
  event: MbscCalendarEventData,
  next: {
    [key: string]: number;
  },
  isListing: boolean
): void;
/** @hidden */
export declare function roundStep(v: number): number;
/** @hidden */
export declare function getEventHeight(startDate: Date, endDate: Date, displayedTime: number, startTime: number, endTime: number): number;
/** @hidden */
export declare function getEventWidth(
  startDate: Date,
  endDate: Date,
  displayedTime: number,
  viewStart: Date,
  viewEnd: Date,
  startTime: number,
  endTime: number,
  startDay: number,
  endDay: number,
  fullDay?: boolean
): number;
/** @hidden */
export declare function getEventStart(
  startDate: Date,
  startTime: number,
  displayedTime: number,
  viewStart?: Date,
  startDay?: number,
  endDay?: number
): number;
/** @hidden */
export declare function getResourceMap(
  eventsMap: {
    [key: string]: MbscCalendarEvent[];
  },
  resources: MbscResource[],
  slots: MbscSlot[],
  hasResources: boolean,
  hasSlots: boolean
): {
  [key: string]: {
    [key: string]: {
      [key: string]: MbscCalendarEvent[];
    };
  };
};
/** @hidden */
export declare function getCellDate(timestamp: number, ms: number): Date;
