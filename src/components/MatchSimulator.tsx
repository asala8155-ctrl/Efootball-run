import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Search, UserCheck, Zap, ShieldAlert } from 'lucide-react';

export const MatchSimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSimulating]);

  const startSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);
    setElapsedSeconds(0);

    // Step 2: STUN / Discovery phase
    setTimeout(() => {
      setSimulationStep(2);
    }, 2000);

    // Step 3: Match found on boosted, timeout on standard
    setTimeout(() => {
      setSimulationStep(3);
      setIsSimulating(false);
    }, 5500);
  };

  const resetSimulation = () => {
    setIsSimulating(false);
    setSimulationStep(0);
    setElapsedSeconds(0);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d131f]/90 p-5 sm:p-7 backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              شبیه‌ساز زنده مچ‌میکینگ دیویژن (League Opponent Search)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            مقایسه در لحظه عملکرد سرچ حریف در اینترنت معمولی ایران در برابر مسیر بوست‌شده ExitLag
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isSimulating && simulationStep === 0 && (
            <button
              onClick={startSimulation}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>شروع تست مچ‌میکینگ</span>
            </button>
          )}

          {simulationStep > 0 && (
            <button
              onClick={resetSimulation}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>تست مجدد</span>
            </button>
          )}
        </div>
      </div>

      {/* Simulator Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Left Card: Normal Iran Connection (Fails) */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <h4 className="text-sm font-bold text-rose-300">
                  اینترنت عادی ایران (بدون بوستر)
                </h4>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                CGNAT Strict
              </span>
            </div>

            {/* Status Visual */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              {simulationStep === 0 && (
                <div className="text-slate-400 text-xs py-4">
                  آماده تست... دکمه «شروع تست مچ‌میکینگ» را بزنید.
                </div>
              )}

              {simulationStep === 1 && (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-rose-400/40 border-t-rose-400 animate-spin mx-auto"></div>
                  <div className="text-xs font-mono-code text-rose-300">
                    Searching for opponent... ({elapsedSeconds}s)
                  </div>
                  <p className="text-[11px] text-slate-400">
                    ارسال پکت STUN به سرورهای کونامی از آی‌پی ایران...
                  </p>
                </div>
              )}

              {simulationStep === 2 && (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-rose-400/40 border-t-rose-400 animate-spin mx-auto"></div>
                  <div className="text-xs font-mono-code text-amber-300">
                    Searching for opponent... ({elapsedSeconds}s)
                  </div>
                  <p className="text-[11px] text-rose-400">
                    ⚠️ پکت‌های UDP 5730 توسط فیلترینگ اپراتور مسدود شد! هیچ پاسخی دریافت نشد.
                  </p>
                </div>
              )}

              {simulationStep === 3 && (
                <div className="space-y-2.5">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-rose-300">
                    Unable to find an opponent.
                  </div>
                  <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2.5 rounded-xl border border-rose-500/30">
                    تایم‌اوت مچ‌میکینگ کونامی: بازگشت اجباری به منوی دیویژن به دلیل عدم دست‌دهی P2P
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-rose-500/20 flex items-center justify-between text-[11px] text-rose-300">
            <span>نتیجه حریف‌یابی:</span>
            <span className="font-bold flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>ناموفق (0 پلیر یافت شد)</span>
            </span>
          </div>
        </div>

        {/* Right Card: ExitLag Boosted Route (Succeeds) */}
        <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/15 p-4 sm:p-5 flex flex-col justify-between shadow-lg shadow-emerald-950/30">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h4 className="text-sm font-bold text-emerald-300">
                  مسیر بهینه‌شده ExitLag (ریجن فرانکفورت / دبی)
                </h4>
              </div>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                NAT Type 1 Open
              </span>
            </div>

            {/* Status Visual */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              {simulationStep === 0 && (
                <div className="text-slate-400 text-xs py-4">
                  آماده تست... دکمه «شروع تست مچ‌میکینگ» را بزنید.
                </div>
              )}

              {simulationStep === 1 && (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-400/40 border-t-emerald-400 animate-spin mx-auto"></div>
                  <div className="text-xs font-mono-code text-emerald-300">
                    اتصال به رله گیمینگ فرانکفورت (AWS eu-central-1)...
                  </div>
                  <p className="text-[11px] text-emerald-400/80">
                    ورود مستقیم به استخر پرجمعیت دیویژن با پورت‌های باز UDP
                  </p>
                </div>
              )}

              {simulationStep === 2 && (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full border-2 border-emerald-400/40 border-t-emerald-400 animate-spin mx-auto"></div>
                  <div className="text-xs font-mono-code text-cyan-300">
                    پیدا کردن پلیر هم‌سطح در صف دیویژن... ({elapsedSeconds}s)
                  </div>
                  <p className="text-[11px] text-emerald-300">
                    دست‌دهی STUN موفقیت‌آمیز بود! در حال تایید اتصال طرفین...
                  </p>
                </div>
              )}

              {simulationStep === 3 && (
                <div className="space-y-3 w-full">
                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-emerald-500/40 flex items-center justify-between text-right">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                        DIV 2
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Kaiser_FC</span>
                          <span className="text-xs">🇩🇪</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono-code">
                          پینگ مسابقه: 48ms • پکت لاست: 0.0%
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>حریف پیدا شد!</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-emerald-300 font-medium">
                    ⚡ حریف‌یابی در زمان استثنایی ۴.۸ ثانیه با موفقیت ۱۰۰٪ کامل شد!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-500/20 flex items-center justify-between text-[11px] text-emerald-300">
            <span>نتیجه حریف‌یابی:</span>
            <span className="font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>موفقیت‌آمیز (شروع مسابقه)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
