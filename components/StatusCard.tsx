import React, { useState, useEffect, useRef } from 'react';
import { CurrentStatus, Book } from '../types';
import { BookIcon, PresentationIcon, CheckIcon } from './Icons';
import { LESSON_ABBREVIATIONS } from '../constants';
import TenorEmbed from './TenorEmbed';

function usePrevious<T>(value: T): T | undefined {
  // Fix: Provide an initial value of `undefined` to `useRef` to fix the "Expected 1 arguments, but got 0" error.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const CountdownTimer: React.FC<{ seconds: number }> = ({ seconds }) => (
    <div className="text-center animate-fade-in">
        <div className="mx-auto rounded-lg mb-4 shadow-lg overflow-hidden" style={{ maxWidth: '200px' }}>
            <TenorEmbed />
        </div>
        <div className="flex items-baseline justify-center space-x-4">
            <span className="text-8xl font-bold font-mono text-white tracking-tighter">{seconds}</span>
            <span className="text-2xl font-medium text-slate-400">saniye</span>
        </div>
    </div>
);

const abbreviateLessonName = (name: string | undefined): string | undefined => {
  if (!name) return undefined;
  if (LESSON_ABBREVIATIONS[name]) {
    return LESSON_ABBREVIATIONS[name];
  }
  const words = name.split(' ');
  if (words.length > 3) {
    return words.map(word => word.charAt(0).toUpperCase()).join('');
  }
  return name;
};

interface StatusCardProps {
  statusInfo: CurrentStatus;
  countdown: number | null;
  countdownVisible: boolean;
  nextLessonInfo: { name: string; startTime: string } | null;
  now: Date;
  onStatusClick: () => void;
}

const MaterialSection: React.FC<{ material: CurrentStatus['lessonMaterial'] }> = ({ material }) => {
  const [selectedBookUrl, setSelectedBookUrl] = useState<string | undefined>(
    () => {
      if (material?.type === 'multi-pdf' && Array.isArray(material.links) && material.links.length > 0) {
        return material.links[0].url;
      }
      return undefined;
    }
  );

  if (!material) {
    return (
      <p className="text-slate-500 text-base">
        Bu ders için materyal bulunmuyor.
      </p>
    );
  }

  if (material.type === 'multi-pdf') {
    const books = material.links as Book[];
    return (
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="relative">
          <select
            value={selectedBookUrl}
            onChange={(e) => setSelectedBookUrl(e.target.value)}
            className="bg-slate-800 border-2 border-slate-600 text-slate-200 text-lg font-semibold rounded-lg px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300 appearance-none w-full sm:w-auto"
            style={{ paddingRight: '3rem' }}
             aria-label="Almanca kitap seçimi"
          >
            {books.map((book) => (
              <option key={book.url} value={book.url}>
                {book.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        <a
          href={selectedBookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-slate-200 text-lg font-semibold rounded-lg transition-colors duration-300 w-full sm:w-auto"
        >
          <BookIcon className="w-6 h-6 mr-3" />
          {material.label}
        </a>
      </div>
    );
  }

  const Icon = material.type === 'presentation' ? PresentationIcon : BookIcon;

  return (
    <a
      href={material.links as string}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-600 hover:bg-slate-800 hover:border-slate-500 text-slate-200 text-lg font-semibold rounded-lg transition-colors duration-300"
    >
      <Icon className="w-6 h-6 mr-3" />
      {material.label}
    </a>
  );
};

const StatusCard: React.FC<StatusCardProps> = ({ statusInfo, countdown, countdownVisible, nextLessonInfo, now, onStatusClick }) => {
  const prevStatusInfo = usePrevious(statusInfo);
  const [completedLesson, setCompletedLesson] = useState<{name: string, key: number} | null>(null);

  useEffect(() => {
    if (prevStatusInfo?.status === 'lesson' && 
        (statusInfo.status === 'break' || statusInfo.status === 'after_school') &&
        prevStatusInfo.lessonName) {
      
      setCompletedLesson({ name: prevStatusInfo.lessonName, key: Date.now() });
      const timer = setTimeout(() => {
        setCompletedLesson(null);
      }, 2500); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [statusInfo.status, prevStatusInfo]);

  const displayName = abbreviateLessonName(statusInfo.lessonName) || statusInfo.title;
  
  return (
    <div className="w-full max-w-4xl p-8 text-center animate-fade-in flex flex-col items-center justify-center">
      <div 
        className="mb-8 flex items-center justify-center group cursor-pointer" 
        style={{ minHeight: '6rem' }}
        onClick={onStatusClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onStatusClick(); }}
        aria-label="Durum videosunu oynat"
      >
        {completedLesson ? (
          <div key={completedLesson.key} className="animate-lesson-complete flex items-center justify-center">
            <h1 className="text-6xl md:text-7xl font-extrabold text-slate-400 line-through decoration-slate-500 decoration-2">
              {abbreviateLessonName(completedLesson.name)}
            </h1>
            <CheckIcon className="w-16 h-16 text-green-400 ml-4" />
          </div>
        ) : (
          <h1 className="text-6xl md:text-7xl font-extrabold text-white leading-tight animate-fade-in transition-colors duration-300 group-hover:text-sky-400">
            {displayName}
          </h1>
        )}
      </div>
      
      <div className="mb-8 w-full max-w-xs">
         {countdownVisible && countdown !== null ? (
            <CountdownTimer seconds={countdown} />
        ) : (
            statusInfo.officialEndsAt && (
            <div className="text-center">
                <p className="text-2xl font-medium text-slate-400">Bitiş Saati</p>
                <div className="mt-2">
                    <span className="text-8xl font-bold font-mono text-white tracking-tighter">{statusInfo.officialEndsAt}</span>
                </div>
            </div>
            )
        )}
      </div>

      {nextLessonInfo && (
        <div className="mb-8 text-lg text-slate-400 font-medium animate-fade-in">
          <span>Sonraki Ders: </span>
          <span className="font-semibold text-slate-300">{nextLessonInfo.name}</span>
          <span className="font-mono text-slate-300"> ({nextLessonInfo.startTime})</span>
        </div>
      )}

      <div>
        {statusInfo.status === 'lesson' && (
          <MaterialSection material={statusInfo.lessonMaterial} />
        )}
      </div>
    </div>
  );
};

export default StatusCard;