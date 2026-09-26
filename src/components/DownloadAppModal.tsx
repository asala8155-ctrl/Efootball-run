import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Smartphone, 
  Github, 
  Check, 
  Copy, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Layers, 
  HardDriveDownload,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface DownloadAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadAppModal: React.FC<DownloadAppModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'apk' | 'install' | 'zip' | 'github'>('apk');
  const [copiedGit, setCopiedGit] = useState(false);
  const [copiedApkCmd, setCopiedApkCmd] = useState(false);

  if (!isOpen) return null;

  const gitCommands = `# ۱. راه‌اندازی ریپازیتوری محلی
git init
git add .
git commit -m "ExitLag eFootball Booster"
git branch -M main

# ۲. اتصال به ریپازیتوری گیت‌هاب شما
git remote add origin https://github.com/YOUR_USERNAME/exitlag-efootball-booster.git
git push -u origin main`;

  const apkCommands = `# ساخت فایل APK با ابزار رایگان Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android
npm run build
npx cap init "ExitLag eFootball" "com.exitlag.efootball" --web-dir dist
npx cap add android
npx cap open android`;

  const copyGit = () => {
    navigator.clipboard.writeText(gitCommands);
    setCopiedGit(true);
    setTimeout(() => setCopiedGit(false), 2000);
  };

  const copyApk = () => {
    navigator.clipboard.writeText(apkCommands);
    setCopiedApkCmd(true);
    setTimeout(() => setCopiedApkCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-[#0d131f] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0a0f18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20">
              <Download className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>دانلود و نصب روی موبایل</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Android & iOS
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                راحت‌ترین روش‌های اجرای برنامه مانند اپلیکیشن بومی روی گوشی شما
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 p-3 bg-slate-900/80 border-b border-slate-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل APK</span>
          </button>

          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'install'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>نصب با WebAPK</span>
          </button>

          <button
            onClick={() => setActiveTab('zip')}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'zip'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HardDriveDownload className="w-4 h-4" />
            <span>دانلود ZIP</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>گیت‌هاب</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 0: Direct Real APK Download */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center p-1.5">
                    <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">ExitLag-eFootball-Booster.apk</h4>
                    <p className="text-xs text-emerald-400">فایل رسمی نصبی اندروید (APK واقعی)</p>
                  </div>
                </div>

                <a
                  href="/api/download-apk"
                  download="ExitLag-eFootball-Booster.apk"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/30 cursor-pointer animate-pulse"
                >
                  <Download className="w-4 h-4" />
                  <span>دانلود فایل APK</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs text-slate-300">
                <div className="font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>مراحل نصب پس از دانلود:</span>
                </div>
                <div className="space-y-2">
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">1</span>
                    <span>روی دکمه سبز رنگ <strong>«دانلود فایل APK»</strong> بزنید تا فایل مستقیماً روی گوشی دانلود شود.</span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">2</span>
                    <span>در اعلانات بالای صفحه یا پوشه <strong>Downloads (دانلودها)</strong> گوشی روی فایل <strong>ExitLag-eFootball-Booster.apk</strong> بزنید.</span>
                  </div>
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">3</span>
                    <span>دکمه <strong>Install (نصب)</strong> را لمس کنید تا برنامه روی گوشی شما نصب شود!</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: PWA Direct Install */}
          {activeTab === 'install' && (
            <div className="space-y-4">
              {/* App banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-emerald-500/50 flex items-center justify-center p-1.5">
                    <img src="/icon.svg" alt="App Icon" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">ExitLag Pro Mobile</h4>
                    <p className="text-xs text-emerald-400">بوستر اختصاصی دیویژن ایفوتبال</p>
                  </div>
                </div>

                {isInstalled ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/30 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>برنامه نصب است</span>
                  </span>
                ) : isInstallable ? (
                  <button
                    onClick={install}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-lg shadow-emerald-500/30 cursor-pointer animate-pulse"
                  >
                    <Download className="w-4 h-4" />
                    <span>نصب فوری</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-lg">
                    آماده افزودن به گوشی
                  </span>
                )}
              </div>

              {/* Instructions for Android (Chrome, Samsung) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>راهنمای ۳ ثانیه‌ای نصب روی گوشی‌های اندروید (سامسونگ، شیائومی و...):</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">1</span>
                    <span>در بالای مرورگر کروم یا سامسونگ، روی <strong>منوی ۳ نقطه (⋮)</strong> کلیک کنید.</span>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">2</span>
                    <span>گزینه <strong>«افزودن به صفحه اصلی» (Add to Home screen)</strong> یا <strong>«نصب برنامه» (Install App)</strong> را انتخاب نمایید.</span>
                  </div>

                  <div className="flex items-start gap-2.5 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 shrink-0">3</span>
                    <span>آیکون اختصاصی <strong className="text-emerald-400">ExitLag eF</strong> به لیست بازی‌های گوشی اضافه شده و کاملاً مستقل بدون نیاز به مرورگر اجرا می‌شود!</span>
                  </div>
                </div>
              </div>

              {/* iOS Note */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>اگر با آیفون (iOS) هستید: دکمه <strong>Share</strong> در پایین سافاری را زده و <strong>Add to Home Screen</strong> را لمس کنید.</span>
              </div>
            </div>
          )}

          {/* TAB 2: Direct ZIP Download */}
          {activeTab === 'zip' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <HardDriveDownload className="w-4 h-4 text-emerald-400" />
                  <span>دانلود فایل فشرده ZIP کل سورس پروژه:</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  می‌توانید تمام فایل‌های سورس‌کد، سرور بک‌اند، فرانت‌اند React، کانفیگ‌های گیمینگ و تنظیمات را در یک فایل ZIP دانلود کنید.
                </p>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-200">exitlag-efootball-booster.zip</div>
                    <div className="text-[10px] text-slate-400 font-mono-code">سورس کامل + سرور + تنظیمات دیویژن</div>
                  </div>
                  <a
                    href="/api/download-zip"
                    download="exitlag-efootball-booster.zip"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>دانلود مستقیم ZIP</span>
                  </a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 space-y-1">
                <span className="font-bold block">پس از دانلود فایل ZIP چه کارهایی می‌توانید بکنید؟</span>
                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1 mt-1">
                  <li>روی کامپیوتر یا سرور خود با دستور <code className="font-mono-code text-emerald-300">npm run dev</code> اجرا کنید.</li>
                  <li>آن را به صورت یک ریپازیتوری روی اکانت GitHub شخصی خود آپلود کنید.</li>
                  <li>آن را با Capacitor به یک فایل نصبی APK واقعی اندروید تبدیل کنید.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: GitHub & APK Build Guide */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-emerald-400" />
                    <span>دستورات ارسال به گیت‌هاب (Push to GitHub):</span>
                  </span>
                  <button
                    onClick={copyGit}
                    className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {copiedGit ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedGit ? 'کپی شد!' : 'کپی دستورات'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/70 border border-slate-800 font-mono-code text-[11px] text-emerald-300 leading-relaxed overflow-x-auto select-all">
                  <pre>{gitCommands}</pre>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>دستورات تبدیل به فایل APK اندروید (Capacitor):</span>
                  </span>
                  <button
                    onClick={copyApk}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedApkCmd ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedApkCmd ? 'کپی شد!' : 'کپی دستورات'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-black/70 border border-slate-800 font-mono-code text-[11px] text-cyan-300 leading-relaxed overflow-x-auto select-all">
                  <pre>{apkCommands}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f18] flex items-center justify-between text-xs">
          <span className="text-slate-400">
            سازگار با تمام نسخه‌های اندروید و iOS
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
