import React from 'react';
import { ShieldCheck, Zap, Gamepad2, Volume2, VolumeX, Sparkles, Download, HardDrive, Github } from 'lucide-react';

interface HeaderProps {
  isBoosted: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAi: () => void;
  onOpenDownload: () => void;
  onOpenDrive: () => void;
  onOpenGitHub?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isBoosted,
  soundEnabled,
  onToggleSound,
  onOpenAi,
  onOpenDownload,
  onOpenDrive,
  onOpenGitHub,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0e17]/90 backdrop-blur-md px-3 sm:px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & App Title */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-tech font-bold text-base sm:text-lg shadow-lg transition-all duration-500 ${
              isBoosted 
                ? 'bg-gradient-to-br from-emerald-500 to-teal-700 text-black neon-glow-emerald' 
                : 'bg-gradient-to-br from-slate-800 to-slate-900 text-slate-300 border border-slate-700'
            }`}>
              <Gamepad2 className="w-5 h-5" />
            </div>
            {isBoosted && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-tech font-extrabold text-sm sm:text-base tracking-wider text-white">
                EXIT<span className="text-emerald-400">LAG</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                PRO MOBILE
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-slate-400">
              <span>مخصوص ایفوتبال</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium truncate">دیویژن لیگ حریف‌یاب</span>
            </div>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Google Drive Button */}
          <button
            onClick={onOpenDrive}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition-all cursor-pointer"
            title="پشتیبان‌گیری در Google Drive"
          >
            <svg viewBox="0 0 87.3 78" className="w-3.5 h-3.5">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
              <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
              <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
              <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
              <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
              <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
            </svg>
            <span className="hidden sm:inline">Google Drive</span>
          </button>

          {/* GitHub APK Builder Button */}
          {onOpenGitHub && (
            <button
              onClick={onOpenGitHub}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="ارسال به GitHub و ساخت APK"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub APK</span>
            </button>
          )}

          {/* Mobile Download & Install Button */}
          <button
            onClick={onOpenDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer animate-pulse"
            title="دانلود یا نصب مستقیم روی موبایل"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">دانلود / نصب اپ</span>
            <span className="xs:hidden">دانلود</span>
          </button>

          {/* AI Helper Quick Trigger */}
          <button
            onClick={onOpenAi}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-teal-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs transition-colors cursor-pointer"
            title="تحلیل هوشمند با جمینای"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span>Gemini</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={soundEnabled ? 'صدا فعال' : 'صدا غیرفعال'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* NAT Status Pill */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <ShieldCheck className={`w-3.5 h-3.5 ${isBoosted ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-400">NAT:</span>
            <span className={`font-mono-code font-bold ${isBoosted ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isBoosted ? 'Type 1 (Open)' : 'Type 3 (Strict)'}
            </span>
          </div>

          {/* Multi-Path Status */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-mono-code border ${
            isBoosted 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
              : 'bg-slate-800/50 border-slate-700 text-slate-400'
          }`}>
            <Zap className={`w-3.5 h-3.5 ${isBoosted ? 'animate-bounce text-emerald-400' : 'text-slate-500'}`} />
            <span className="font-bold">{isBoosted ? 'ACTIVE' : 'IDLE'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

