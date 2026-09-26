import React from 'react';
import { Play, Pause, Activity, ShieldAlert, CheckCircle2, RefreshCw, Cpu, Layers } from 'lucide-react';
import { ServerNode } from '../types';

interface BoosterHUDProps {
  isBoosted: boolean;
  isOptimizing: boolean;
  activeNode: ServerNode;
  onToggleBoost: () => void;
  metrics: {
    ping: number;
    jitter: number;
    packetLoss: number;
    natType: string;
    trafficUp: number;
    trafficDown: number;
  };
}

export const BoosterHUD: React.FC<BoosterHUDProps> = ({
  isBoosted,
  isOptimizing,
  activeNode,
  onToggleBoost,
  metrics,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0f172a]/90 via-[#0b101b] to-[#070b12] p-5 sm:p-8 shadow-2xl">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none"></div>
      <div className={`absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
        isBoosted ? 'bg-emerald-500/15' : 'bg-rose-500/10'
      }`}></div>
      <div className={`absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
        isBoosted ? 'bg-cyan-500/15' : 'bg-slate-700/10'
      }`}></div>

      {/* Game Header Bar inside card */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-emerald-500 flex items-center justify-center p-0.5 shadow-md">
            <div className="w-full h-full bg-[#0a0f1d] rounded-[14px] flex items-center justify-center text-white font-tech font-black text-sm tracking-tighter">
              eF26
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                eFootball™ Mobile
              </h2>
              <span className="text-[11px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v9.x
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono-code flex items-center gap-1.5 mt-0.5">
              <span>بسته: jp.konami.pesam</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">دیویژن لیگ (League)</span>
            </p>
          </div>
        </div>

        {/* Selected Hub Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
          <span className="text-lg">{activeNode.flag}</span>
          <div className="text-right">
            <div className="text-[11px] text-slate-400">ریجن فعال گیمینگ:</div>
            <div className="text-xs font-bold text-slate-200">{activeNode.country}</div>
          </div>
        </div>
      </div>

      {/* Main Booster Hub Circle */}
      <div className="relative z-10 py-8 flex flex-col items-center justify-center">
        {/* Glowing Rings and Orbit */}
        <div className="relative flex items-center justify-center">
          {/* Outer Pulsing Ring */}
          <div className={`absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full border transition-all duration-700 ${
            isBoosted 
              ? 'border-emerald-500/40 animate-ring-pulse shadow-[0_0_50px_rgba(16,185,129,0.2)]' 
              : 'border-slate-800'
          }`}></div>

          {/* Secondary Dashed Rotating Ring */}
          <div className={`absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-dashed transition-all duration-700 ${
            isBoosted 
              ? 'border-emerald-400/50 animate-[spin_18s_linear_infinite]' 
              : isOptimizing 
                ? 'border-cyan-400 animate-[spin_4s_linear_infinite]' 
                : 'border-slate-800'
          }`}></div>

          {/* Central Action Button */}
          <button
            onClick={onToggleBoost}
            disabled={isOptimizing}
            className={`relative z-20 w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-300 cursor-pointer select-none active:scale-95 ${
              isBoosted
                ? 'bg-gradient-to-b from-emerald-600 to-teal-900 text-white neon-glow-emerald border-2 border-emerald-300'
                : isOptimizing
                  ? 'bg-gradient-to-b from-cyan-600 to-blue-900 text-white neon-glow-cyan border-2 border-cyan-300'
                  : 'bg-gradient-to-b from-slate-800 to-slate-950 text-slate-200 border-2 border-slate-700 hover:border-emerald-500/50'
            }`}
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="w-10 h-10 animate-spin text-cyan-300 mb-2" />
                <span className="font-tech text-xs tracking-wider text-cyan-200">
                  در حال بهینه‌سازی...
                </span>
                <span className="text-[10px] text-cyan-300/80 mt-1 font-mono-code">
                  TUNING UDP
                </span>
              </>
            ) : isBoosted ? (
              <>
                <span className="text-3xl sm:text-4xl font-black font-tech tracking-tight text-white drop-shadow">
                  {metrics.ping}
                </span>
                <span className="text-[11px] font-mono-code text-emerald-200 uppercase tracking-widest mt-0.5">
                  میلی‌ثانیه (ms)
                </span>
                <div className="flex items-center gap-1 mt-1 text-[11px] bg-black/40 px-2 py-0.5 rounded-full text-emerald-300">
                  <Pause className="w-3 h-3" />
                  <span>توقف بوست</span>
                </div>
              </>
            ) : (
              <>
                <Play className="w-9 h-9 text-emerald-400 mb-1 translate-x-0.5" />
                <span className="font-tech font-bold text-sm tracking-wider text-white">
                  شروع بوست
                </span>
                <span className="text-[10px] text-emerald-400/90 font-mono-code mt-0.5">
                  حل حریف‌یابی
                </span>
              </>
            )}
          </button>
        </div>

        {/* Status text under circle */}
        <div className="mt-6 text-center">
          {isOptimizing ? (
            <p className="text-xs sm:text-sm text-cyan-300 font-medium animate-pulse">
              در حال تنظیم تونل چندمسیره UDP و رفع محدودیت استخر حریف دیویژن...
            </p>
          ) : isBoosted ? (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>تونل گیمینگ فعال است: حریف در دیویژن کمتر از ۶ ثانیه پیدا می‌شود!</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium">
              <ShieldAlert className="w-4 h-4" />
              <span>اینترنت عادی: سرچ حریف در دیویژن به دلیل فیلترینگ UDP بی‌پایان می‌چرخد!</span>
            </div>
          )}
        </div>
      </div>

      {/* Telemetry Dashboard Grid */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80">
        {/* Ping Indicator */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>پینگ به کونامی</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-black font-tech ${
              isBoosted ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {isBoosted ? metrics.ping : '110+'}
            </span>
            <span className="text-[10px] text-slate-500">ms</span>
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-0.5">
            {isBoosted ? 'بدون نوسان (Smooth)' : 'دارای نوسان شدید'}
          </div>
        </div>

        {/* Packet Loss */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>پکت لاست (Loss)</span>
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-black font-tech ${
              isBoosted ? 'text-cyan-400' : 'text-rose-400'
            }`}>
              {isBoosted ? `${metrics.packetLoss}%` : '28.4%'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isBoosted ? 'بای‌پس کامل دراپ UDP' : 'پکت‌های دیویژن دراپ می‌شود'}
          </div>
        </div>

        {/* Jitter */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>جیتر (Jitter)</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl sm:text-2xl font-black font-tech ${
              isBoosted ? 'text-indigo-400' : 'text-amber-400'
            }`}>
              {isBoosted ? `${metrics.jitter}ms` : '42ms'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {isBoosted ? 'فوق‌العاده پایدار' : 'لگ در انیمیشن پاس‌ها'}
          </div>
        </div>

        {/* NAT Type */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
            <span>نوع NAT (مچ‌میکینگ)</span>
            <ShieldAlert className={`w-3.5 h-3.5 ${isBoosted ? 'text-emerald-400' : 'text-rose-400'}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm sm:text-base font-bold ${
              isBoosted ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {isBoosted ? 'Type 1 (Open)' : 'Type 3 (Strict)'}
            </span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 truncate">
            {isBoosted ? 'اتصال P2P مستقیم مجاز' : 'مانع اصلی سرچ حریف!'}
          </div>
        </div>
      </div>
    </div>
  );
};
