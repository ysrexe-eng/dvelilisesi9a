import React from 'react';
import { TIME_SLOTS, WEEKLY_SCHEDULE, LESSON_MATERIALS, DAY_NAMES, LESSON_ABBREVIATIONS } from '../constants';
import { BookIcon } from './Icons';
import { TimeSlot } from '../types';

const padZero = (num: number): string => num.toString().padStart(2, '0');

const abbreviateLessonName = (name: string | null): string | null => {
  if (!name) return null;
  if (LESSON_ABBREVIATIONS[name]) {
    return LESSON_ABBREVIATIONS[name];
  }
  const words = name.split(' ');
  if (words.length > 3) {
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }
  return name;
};

const getMondayToThursdaySlotTimeFormatted = (slot: TimeSlot): string => {
    const offset = 53; // 53 seconds
    const dummyDate = new Date(0);

    const start = new Date(dummyDate.getTime());
    start.setHours(slot.start[0], slot.start[1], 0, 0);
    start.setSeconds(start.getSeconds() - offset);
    
    const end = new Date(dummyDate.getTime());
    end.setHours(slot.end[0], slot.end[1], 0, 0);
    end.setSeconds(end.getSeconds() - offset);

    return `${padZero(start.getHours())}:${padZero(start.getMinutes())} - ${padZero(end.getHours())}:${padZero(end.getMinutes())}`;
};

const getFridaySlotTimeFormatted = (slot: TimeSlot): string => {
    const fridayMorningOffset = 11 * 60; // 660 seconds. First lesson starts at 8:19.
    const fridayAfternoonOffset = 53; // 53 seconds

    const dummyDate = new Date(0); // Use a fixed epoch date to avoid DST issues
    
    let start = new Date(dummyDate.getTime());
    start.setHours(slot.start[0], slot.start[1], 0, 0);
    
    let end = new Date(dummyDate.getTime());
    end.setHours(slot.end[0], slot.end[1], 0, 0);

    // Before lunch (standard start time is 12:30)
    if (slot.start[0] < 12 || (slot.start[0] === 12 && slot.start[1] < 30)) {
        start.setSeconds(start.getSeconds() - fridayMorningOffset);
        end.setSeconds(end.getSeconds() - fridayMorningOffset);
    }
    // Lunch
    else if (slot.name === 'Öğle Arası') {
        start.setHours(12, 19, 0, 0);
        end.setHours(13, 39, 0, 0);
    }
    // After lunch
    else {
        start.setSeconds(start.getSeconds() - fridayAfternoonOffset);
        end.setSeconds(end.getSeconds() - fridayAfternoonOffset);
    }
    
    return `${padZero(start.getHours())}:${padZero(start.getMinutes())} - ${padZero(end.getHours())}:${padZero(end.getMinutes())}`;
}


const WeeklyScheduleView: React.FC = () => {
  const weekDays = Object.keys(WEEKLY_SCHEDULE).map(Number).sort();

  return (
    <div className="w-full max-w-7xl p-4 md:p-8 flex flex-col animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 text-center flex-shrink-0">
        Haftalık Ders Programı
      </h1>
      <div className="overflow-x-auto relative border border-slate-700 rounded-lg bg-slate-900/70 backdrop-blur-sm">
        <div 
          className="grid"
          style={{ gridTemplateColumns: `auto repeat(${TIME_SLOTS.length}, minmax(180px, 1fr))` }}
        >
          {/* Header Row: Top-left corner + Time slots */}
          <div className="sticky top-0 left-0 z-30 bg-slate-800 p-2 border-b border-r border-slate-600"></div>
          {TIME_SLOTS.map((slot, index) => {
            const mondayToThursdayTime = getMondayToThursdaySlotTimeFormatted(slot);
            const fridayTime = getFridaySlotTimeFormatted(slot);

            return (
              <div key={index} className="sticky top-0 z-20 bg-slate-800 p-2 text-center border-b border-r border-slate-600 flex flex-col justify-center">
                <p className="font-semibold text-sm text-slate-200">
                  {slot.type === 'lesson' ? `${slot.period}. Ders` : slot.name}
                </p>
                <div className="font-mono text-xs text-slate-400 mt-1 space-y-1">
                  <div>
                    <span className="font-semibold">Pzt-Per:</span> {mondayToThursdayTime}
                  </div>
                  <div className="text-sky-400">
                    <span className="font-semibold">Cuma:</span> {fridayTime}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Day Rows */}
          {weekDays.map(day => (
            <React.Fragment key={day}>
              {/* Day Name Column */}
              <div className="sticky left-0 z-20 p-2 border-b border-r border-slate-600 bg-slate-800 flex items-center justify-center">
                <span className="font-bold text-white">{DAY_NAMES[day]}</span>
              </div>
              
              {/* Lesson/Break Cells for the day */}
              {TIME_SLOTS.map((slot, index) => {
                if (slot.type === 'lesson') {
                  const lessonName = slot.period ? WEEKLY_SCHEDULE[day][slot.period - 1] : null;
                  const displayName = abbreviateLessonName(lessonName);
                  const material = lessonName ? LESSON_MATERIALS[lessonName] : undefined;
                  let materialUrl: string | undefined = undefined;

                  if (material) {
                      if (typeof material.links === 'string') {
                          materialUrl = material.links;
                      } else if (Array.isArray(material.links) && material.links.length > 0) {
                          materialUrl = material.links[0].url;
                      }
                  }

                  return (
                    <div key={`${day}-${index}`} className="p-2 border-b border-r border-slate-700 flex flex-col justify-between min-h-[72px] bg-slate-900/50">
                      <p className={`font-semibold text-sm ${displayName ? 'text-slate-100' : 'text-slate-600'}`}>
                        {displayName || 'Boş Ders'}
                      </p>
                      {materialUrl && (
                        <div className="text-right mt-1">
                          <a href={materialUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-slate-700" aria-label={`${lessonName} ders materyali`}>
                            <BookIcon className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Break cell
                  return (
                    <div key={`${day}-${index}`} className="p-2 border-b border-r border-slate-700 flex items-center justify-center bg-slate-800/60 min-h-[72px]">
                       <p className={`font-semibold text-center text-sm ${slot.name === 'Öğle Arası' ? 'text-amber-300' : 'text-slate-400'}`}>
                         {slot.name}
                       </p>
                    </div>
                  );
                }
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleView;