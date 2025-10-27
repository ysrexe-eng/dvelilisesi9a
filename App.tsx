import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TIME_SLOTS, WEEKLY_SCHEDULE, LESSON_MATERIALS, DAY_NAMES } from './constants';
import { CurrentStatus, AppSettings, TimeSlot } from './types';
import StatusCard from './components/StatusCard';
import WeeklyScheduleView from './components/WeeklyScheduleView';
import SettingsMenu from './components/SettingsMenu';
import { EnterFullscreenIcon, ExitFullscreenIcon, CalendarIcon, ClockIcon, SettingsIcon } from './components/Icons';
import VideoPlayer from './components/VideoPlayer';

const padZero = (num: number): string => num.toString().padStart(2, '0');

const getSlotTimes = (slot: TimeSlot, now: Date): { start: Date; end: Date } => {
    const dayOfWeek = now.getDay();
    const start = new Date(now);
    start.setHours(slot.start[0], slot.start[1], 0, 0);
    const end = new Date(now);
    end.setHours(slot.end[0], slot.end[1], 0, 0);

    if (dayOfWeek >= 1 && dayOfWeek <= 4) { // Monday to Thursday
        const offset = 53; // seconds
        start.setSeconds(start.getSeconds() - offset);
        end.setSeconds(end.getSeconds() - offset);
    } else if (dayOfWeek === 5) { // Friday special schedule
        const fridayMorningOffset = 11 * 60; // 660 seconds. First lesson starts at 8:19.
        const fridayAfternoonOffset = 53; // 53 seconds

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
    }
    
    return { start, end };
}

const App: React.FC = () => {
  const [now, setNow] = useState(new Date());

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      screensaverEnabled: false,
      countdownVisible: true,
      defaultView: 'status',
      creditsVisible: true,
    };
    try {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
    } catch (error) {
      console.error("Failed to parse settings from localStorage", error);
      return defaultSettings;
    }
  });
  
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings]);

  const handleSettingsChange = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const handleStatusClick = () => {
    if (view === 'status') {
      setIsVideoPlaying(true);
    }
  };

  const [statusInfo, setStatusInfo] = useState<CurrentStatus>({
    status: 'before_school',
    title: 'Yükleniyor...'
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [nextLessonInfo, setNextLessonInfo] = useState<{ name: string; startTime: string } | null>(null);
  const [isScreensaverActive, setIsScreensaverActive] = useState(false);
  const [isScreensaverRendered, setIsScreensaverRendered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);
  const [view, setView] = useState<'status' | 'schedule'>(settings.defaultView);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const inactivityTimerRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const viewRef = useRef(view);
  
  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);
  
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const getCurrentStatus = useCallback((): CurrentStatus => {
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { status: 'weekend', title: 'Hafta Sonu Tatili' };
    }

    const dailySchedule = WEEKLY_SCHEDULE[dayOfWeek];
    if (!dailySchedule) {
      return { status: 'no_school_day', title: 'Bugün Ders Yok' };
    }
    
    for (const slot of TIME_SLOTS) {
      const { start, end } = getSlotTimes(slot, now);

      if (now >= start && now < end) {
        const officialEndsAt = `${padZero(end.getHours())}:${padZero(end.getMinutes())}`;

        if (slot.type === 'lesson' && slot.period) {
          const lessonName = dailySchedule[slot.period - 1];
          if (!lessonName) {
            return {
              status: 'break',
              title: 'Boş Ders',
              officialEndsAt,
              startTime: start,
              endTime: end,
            };
          }
          return {
            status: 'lesson',
            title: slot.name,
            lessonName,
            lessonMaterial: LESSON_MATERIALS[lessonName] || undefined,
            officialEndsAt,
            startTime: start,
            endTime: end,
          };
        } else {
          return {
            status: 'break',
            title: slot.name,
            officialEndsAt,
            startTime: start,
            endTime: end,
          };
        }
      }
    }
    
    const { start: firstLessonStartTime } = getSlotTimes(TIME_SLOTS[0], now);
    if (now < firstLessonStartTime) {
      return { status: 'before_school', title: 'Dersler Başlamadı' };
    }
    
    return { status: 'after_school', title: 'Dersler Bitti' };
  }, [now]);

  const getNextLessonInfo = useCallback((): { name: string; startTime: string } | null => {
    const dayOfWeek = now.getDay();
    
    if (dayOfWeek === 0 || dayOfWeek === 6) return null;
    const dailySchedule = WEEKLY_SCHEDULE[dayOfWeek];
    if (!dailySchedule) return null;

    for (const slot of TIME_SLOTS) {
        if (slot.type === 'lesson' && slot.period) {
            const { start: startTime } = getSlotTimes(slot, now);

            if (startTime > now) {
                const lessonName = dailySchedule[slot.period - 1];
                if (lessonName) { 
                    return {
                        name: lessonName,
                        startTime: `${padZero(startTime.getHours())}:${padZero(startTime.getMinutes())}`,
                    };
                }
            }
        }
    }
    return null; 
  }, [now]);

  const resetInactivityTimer = useCallback(() => {
    if (!settings.screensaverEnabled) return;
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = window.setTimeout(() => {
      if (countdownRef.current === null && viewRef.current === 'status') {
        setIsScreensaverActive(true);
      }
    }, 60000); // 1 minute
  }, [settings.screensaverEnabled]);

  useEffect(() => {
    if (!settings.screensaverEnabled) {
      if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
      setIsScreensaverActive(false);
      return;
    }
    const handleActivity = () => {
      setIsScreensaverActive(false);
      resetInactivityTimer();
    };

    resetInactivityTimer();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [resetInactivityTimer, settings.screensaverEnabled]);


  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const newStatusInfo = getCurrentStatus();
    setStatusInfo(newStatusInfo);
    setNextLessonInfo(getNextLessonInfo());

    if (newStatusInfo.endTime) {
      const endTime = newStatusInfo.endTime;
      const diffSeconds = Math.round((endTime.getTime() - now.getTime()) / 1000);

      if (diffSeconds >= 0 && diffSeconds <= 20) {
        setCountdown(diffSeconds);
        if (isScreensaverActive) {
          setIsScreensaverActive(false);
          resetInactivityTimer();
        }
      } else {
        setCountdown(null);
      }
    } else {
      setCountdown(null);
    }
  }, [now, getCurrentStatus, getNextLessonInfo, isScreensaverActive, resetInactivityTimer]);

  useEffect(() => {
    if (isScreensaverActive) {
      setIsScreensaverRendered(true);
    } else {
      const timer = setTimeout(() => {
        setIsScreensaverRendered(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isScreensaverActive]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const currentTime = `${padZero(now.getHours())}:${padZero(now.getMinutes())}:${padZero(now.getSeconds())}`;

  return (
    <div className={`bg-black text-slate-200 w-full flex flex-col items-center p-4 relative ${view === 'status' ? 'h-screen overflow-hidden justify-center' : 'min-h-screen justify-start pt-20'}`}>
        {isScreensaverRendered && (
          <div
            className={`absolute inset-0 bg-black z-50 transition-opacity duration-500 ease-in-out ${
              isScreensaverActive ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}
        
        <div className="absolute top-6 left-6 z-20 flex items-center space-x-2">
          <button
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label={isFullscreen ? 'Tam ekrandan çık' : 'Tam ekrana geç'}
          >
            {isFullscreen ? <ExitFullscreenIcon className="w-7 h-7" /> : <EnterFullscreenIcon className="w-7 h-7" />}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label="Ayarları aç"
          >
            <SettingsIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setView(v => v === 'status' ? 'schedule' : 'status')}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-full hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-slate-500"
            aria-label={view === 'status' ? 'Haftalık programı göster' : 'Mevcut durumu göster'}
          >
            {view === 'status' ? <CalendarIcon className="w-7 h-7" /> : <ClockIcon className="w-7 h-7" />}
          </button>
        </div>

        <main className={`w-full flex-grow flex justify-center ${view === 'status' ? 'items-center' : 'items-start'}`}>
           {view === 'status' ? (
              <StatusCard 
                statusInfo={statusInfo} 
                countdown={countdown} 
                countdownVisible={settings.countdownVisible} 
                nextLessonInfo={nextLessonInfo} 
                now={now}
                onStatusClick={handleStatusClick}
              />
           ) : (
              <WeeklyScheduleView />
           )}
        </main>
        {view === 'status' && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="font-mono text-6xl font-bold text-white tracking-tighter">{currentTime}</p>
          </div>
        )}
        {settings.creditsVisible && (
            <div className="absolute bottom-4 right-4 text-slate-600 font-semibold text-sm opacity-50">
                Yaşar Reis | Emir Reis
            </div>
        )}
        <SettingsMenu 
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
        {isVideoPlaying && (
            <VideoPlayer 
                src="/space.mp4" 
                onClose={() => setIsVideoPlaying(false)}
            />
        )}
    </div>
  );
};

export default App;