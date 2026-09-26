import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2, ChevronDown, ChevronUp, FileCode2, Sparkles, Check, ArrowDownCircle, Github, Rocket } from 'lucide-react';

interface AndroidQuickInstallCardProps {
  onOpenGitHub?: () => void;
}

export const AndroidQuickInstallCard: React.FC<AndroidQuickInstallCardProps> = ({ onOpenGitHub }) => {
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const handleDownloadApk = () => {
    setDownloadStarted(true);
    // Direct link to download real .apk
    window.location.href = '/api/download-apk';
    setTimeout(() => setDownloadStarted(false), 5000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500 bg-gradient-to-b from-[#0b1626] via-[#09121f] to-[#050810] p-4 sm:p-5 shadow-2xl shadow-emerald-950/60">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-72 h-36 bg-emerald-500/15 blur-3xl pointer-events-none"></div>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-emerald-500/30 shrink-0">
            <Smartphone className="w-7 h-7 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white">
                دانلود مستقیم فایل APK نصبی اندروید
              </h3>
              <span className="text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-black">
                فایل نصبی .APK
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              فایل رسمی نصبی اپلیکیشن مخصوص تمام گوشی‌های اندروید (سامسونگ، شیائومی، هواوی و...)
            </p>
          </div>
        </div>

        {/* Big APK Download Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <a
            href="/api/download-apk"
            download="ExitLag-eFootball-Booster.apk"
            onClick={handleDownloadApk}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm shadow-xl shadow-emerald-500/35 transition-all active:scale-95 cursor-pointer text-center animate-pulse"
          >
            <Download className="w-5 h-5 text-black" />
            <span>دانلود مستقیم فایل APK</span>
          </a>
        </div>
      </div>

      {/* Download Alert & Status */}
      {downloadStarted && (
        <div className="mt-3 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
          <div>
            <strong className="block text-white">دانلود فایل ExitLag-eFootball-Booster.apk شروع شد!</strong>
            <span className="text-[11px] text-emerald-300">در اعلانات بالای گوشی روی فایل ضربه بزنید و دکمه Install (نصب) را لمس کنید.</span>
          </div>
        </div>
      )}

      {/* 2-Step Installation Guide */}
      <div className="mt-3 pt-3 border-t border-slate-800/80">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center justify-between w-full text-xs text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <span className="font-bold flex items-center gap-1.5">
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>راهنمای نصب فایل APK بعد از دانلود (خیلی ساده):</span>
          </span>
          {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showGuide && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">لمس فایل دانلودشده</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                  در پوشه Downloads (دانلودها) یا منوی اعلان‌های گوشی‌تان روی فایل <strong className="text-emerald-400">ExitLag-eFootball-Booster.apk</strong> ضربه بزنید.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-500/30">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">زدن دکمه Install (نصب)</span>
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                  دکمه <strong className="text-emerald-400">Install (نصب)</strong> را بزنید. اگر گوشی پیام «نصب از منابع ناشناس» داد، گزینه تایید (Allow) را فعال کنید. برنامه نصب شد!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* APK Specs badge & GitHub Builder */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2 font-mono-code">
          <span>نام فایل: <strong className="text-slate-200">ExitLag-eFootball-Booster.apk</strong></span>
          <span>•</span>
          <span>حجم: <strong className="text-emerald-400">۳۷ کیلوبایت</strong></span>
        </div>

        {onOpenGitHub && (
          <button
            onClick={onOpenGitHub}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold transition-all cursor-pointer text-xs"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>ارسال به GitHub من و بیلد با Actions</span>
          </button>
        )}
      </div>
    </div>
  );
};
