import React from 'react';
import { ShieldCheck, Zap, Gamepad2, Volume2, VolumeX, Sparkles } from 'lucide-react';

interface HeaderProps {
  isBoosted: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenAi: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isBoosted,
  soundEnabled,
  onToggleSound,
  onOpenAi,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0e17]/90 backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-tech font-bold text-lg shadow-lg transition-all duration-500 ${
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
            <div className="flex items-center gap-2">
              <span className="font-tech font-extrabold text-base tracking-wider text-white">
                EXIT<span className="text-emerald-400">LAG</span>
              </span>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                PRO MOBILE
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>مخصوص ایفوتبال</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-medium">دیویژن لیگ حریف‌یاب</span>
            </div>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center gap-2">
          {/* AI Helper Quick Trigger */}
          <button
            onClick={onOpenAi}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs transition-colors cursor-pointer"
            title="تحلیل هوشمند با جمینای"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-emerald-300" />
            <span className="hidden sm:inline">مشاور هوش مصنوعی</span>
            <span className="sm:hidden">Gemini</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
            title={soundEnabled ? 'صدا فعال' : 'صدا غیرفعال'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* NAT Status Pill */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs">
            <ShieldCheck className={`w-3.5 h-3.5 ${isBoosted ? 'text-emerald-400' : 'text-amber-400'}`} />
            <span className="text-slate-400">NAT:</span>
            <span className={`font-mono-code font-bold ${isBoosted ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isBoosted ? 'Type 1 (Open)' : 'Type 3 (Strict CGNAT)'}
            </span>
          </div>

          {/* Multi-Path Status */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono-code border ${
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
