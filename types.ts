export interface TimeSlot {
  type: 'lesson' | 'break';
  name: string;
  start: [number, number];
  end: [number, number];
  period?: number;
}

export type DailySchedule = (string | null)[];

export interface WeeklySchedule {
  [day: number]: DailySchedule;
}

export interface Book {
  name: string;
  url: string;
}

export type LessonMaterial = {
  type: 'interactive' | 'presentation' | 'pdf' | 'multi-pdf';
  links: string | Book[];
  label: string;
}

export interface BookLinks {
  [lessonName: string]: LessonMaterial;
}

export type StatusType = 'lesson' | 'break' | 'weekend' | 'before_school' | 'after_school' | 'no_school_day';

export interface CurrentStatus {
  status: StatusType;
  title: string;
  lessonName?: string;
  lessonMaterial?: LessonMaterial;
  officialEndsAt?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface AppSettings {
  screensaverEnabled: boolean;
  countdownVisible: boolean;
  defaultView: 'status' | 'schedule';
  creditsVisible: boolean;
}