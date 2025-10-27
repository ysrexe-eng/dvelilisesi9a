import React from 'react';
import { CloseIcon } from './Icons';

interface VideoPlayerProps {
  src: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Video player"
    >
      <div
        className="relative w-full max-w-4xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 p-2 text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors"
          aria-label="Videoyu kapat"
        >
          <CloseIcon className="w-8 h-8" />
        </button>
        <video
          src={src}
          controls
          autoPlay
          className="w-full h-auto max-h-[80vh] rounded-lg shadow-2xl"
          onEnded={onClose}
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
