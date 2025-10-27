import React from 'react';
import { AppSettings } from '../types';
import { CloseIcon } from './Icons';

interface SettingsMenuProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onSettingsChange: (newSettings: Partial<AppSettings>) => void;
}

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center justify-between cursor-pointer p-2 rounded-md hover:bg-slate-700/50">
    <span className="text-slate-300">{label}</span>
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className={`block w-14 h-8 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-slate-600'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`}></div>
    </div>
  </label>
);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleDefaultViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ defaultView: e.target.value as 'status' | 'schedule' });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md m-4 p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="settings-title" className="text-2xl font-bold text-white">Ayarlar</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
            aria-label="Ayarları kapat"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <fieldset className="space-y-4">
             <legend className="text-lg font-semibold text-slate-400 border-b border-slate-700 pb-2 w-full mb-2">Genel</legend>
             <ToggleSwitch
                label="Ekran Koruyucu"
                checked={settings.screensaverEnabled}
                onChange={(checked) => onSettingsChange({ screensaverEnabled: checked })}
             />
             <ToggleSwitch
                label="Geri Sayımı Göster"
                checked={settings.countdownVisible}
                onChange={(checked) => onSettingsChange({ countdownVisible: checked })}
             />
             <ToggleSwitch
                label="Geliştirici İsimleri"
                checked={settings.creditsVisible}
                onChange={(checked) => onSettingsChange({ creditsVisible: checked })}
             />
          </fieldset>
          
          <fieldset className="space-y-3">
             <legend className="text-lg font-semibold text-slate-400 border-b border-slate-700 pb-2 w-full">Varsayılan Görünüm</legend>
             <div className="flex flex-col space-y-2 pt-2">
                <label className="flex items-center space-x-3 p-3 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <input
                        type="radio"
                        name="defaultView"
                        value="status"
                        checked={settings.defaultView === 'status'}
                        onChange={handleDefaultViewChange}
                        className="h-5 w-5 accent-blue-500 bg-slate-600 border-slate-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">Mevcut Durum</span>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-md hover:bg-slate-700/50 cursor-pointer transition-colors">
                    <input
                        type="radio"
                        name="defaultView"
                        value="schedule"
                        checked={settings.defaultView === 'schedule'}
                        onChange={handleDefaultViewChange}
                        className="h-5 w-5 accent-blue-500 bg-slate-600 border-slate-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500"
                    />
                    <span className="text-slate-300">Haftalık Program</span>
                </label>
             </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;