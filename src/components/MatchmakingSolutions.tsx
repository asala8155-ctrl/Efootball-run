import React, { useState } from 'react';
import { 
  Network, 
  Smartphone, 
  Settings2, 
  Check, 
  Copy, 
  SlidersHorizontal, 
  Terminal, 
  ExternalLink,
  Info
} from 'lucide-react';
import { ServerNode } from '../types';

interface MatchmakingSolutionsProps {
  activeNode: ServerNode;
  onOpenConfigModal: (appType: string) => void;
}

export const MatchmakingSolutions: React.FC<MatchmakingSolutionsProps> = ({
  activeNode,
  onOpenConfigModal,
}) => {
  const [activeTab, setActiveTab] = useState<'method1' | 'method2' | 'method3' | 'method4'>('method1');
  const [copiedPortText, setCopiedPortText] = useState(false);

  const copyPorts = () => {
    navigator.clipboard.writeText("5730-5739,3478,3074");
    setCopiedPortText(true);
    setTimeout(() => setCopiedPortText(false), 2000);
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d131f]/90 p-5 sm:p-7 backdrop-blur-md">
      {/* Title & Mission Statement */}
      <div className="pb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              راهکارهای ۴ گانه قطعی حل سرچ حریف در دیویژن (League)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              چرا در ایران لاگین می‌شود اما حریف پیدا نمی‌کند؟ و ۴ راهکار تضمینی با متد ExitLag و Gear UP Booster
            </p>
          </div>
        </div>

        {/* Technical Truth Box: DNS vs ExitLag */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-xs leading-relaxed text-amber-200">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">چرا دی‌ان‌اس‌های ایرانی (شکن، رادار و...) سرچ حریف ایفوتبال را حل نمی‌کنند؟</span>
            <p className="mt-1 text-slate-300">
              دی‌ان‌اس (DNS) فقط دامنه سایت‌ها و لاگین اولیه بازی را به آی‌پی ترجمه می‌کند. اما سرچ حریف در لیگ دیویژن از پروتکل <span className="text-emerald-300 font-mono-code">UDP P2P و سرورهای STUN</span> استفاده می‌کند. در ایران، اپراتورها پورت‌های UDP را مسدود کرده و آی‌پی ایران در استخر حریف‌یابی کونامی منزوی (Geo-isolated) است. به همین دلیل دی‌ان‌اس هیچ کمکی به سرچ حریف نمی‌کند و تنها راه حل، استفاده از تونل بازکننده UDP با ریجن خارجی است.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for 4 Methods */}
      <div className="flex flex-wrap gap-2 mt-5">
        <button
          onClick={() => setActiveTab('method1')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'method1'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>روش ۱: تونل گیمینگ ExitLag (v2ray / sing-box)</span>
        </button>

        <button
          onClick={() => setActiveTab('method2')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'method2'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>روش ۲: تغییر ریجن به آلمان و دبی (Geo-Shift)</span>
        </button>

        <button
          onClick={() => setActiveTab('method3')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'method3'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>روش ۳: رفع باگ همراه اول/ایرانسل (APN IPv4)</span>
        </button>

        <button
          onClick={() => setActiveTab('method4')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'method4'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
          }`}
        >
          <Settings2 className="w-4 h-4" />
          <span>روش ۴: تنظیمات مخفی داخل بازی (Match Area)</span>
        </button>
      </div>

      {/* Tab 1 Content: ExitLag Multi-Path Tun */}
      {activeTab === 'method1' && (
        <div className="mt-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-emerald-400">
                متد شماره ۱: تونل گیمینگ Multi-Path و Full Cone NAT
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                دقیقاً همان مکانیزمی که در برنامه اورجینال ExitLag و Gear UP Booster پیاده شده است.
              </p>
            </div>
            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              تضمین ۱۰۰٪
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                مرحله ۱: هدایت پورت‌های حیاتی ایفوتبال
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                پورت‌های اختصاصی دیویژن کونامی باید به صورت باز (UDP Open) تونل شوند. اگر پورت‌ها بسته بماند، بازی نمی‌تواند بین دو بازیکن تبادل پکت کند:
              </p>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono-code text-[11px] text-emerald-400">
                <span>UDP: 5730-5739, 3478, 3074</span>
                <button
                  onClick={copyPorts}
                  className="p-1 hover:text-white transition-colors cursor-pointer"
                  title="کپی پورت‌ها"
                >
                  {copiedPortText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                مرحله ۲: اپلیکیشن‌های اندروید مجری (TUN Mode)
              </span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                نرم‌افزارهای اندرویدی زیر از هسته TUN و Split-Tunneling پشتیبانی می‌کنند تا فقط بسته <span className="text-cyan-300 font-mono-code">jp.konami.pesam</span> بدون مصرف اینترنت بقیه برنامه‌ها بوست شود:
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['Sing-box (بهترین)', 'v2rayNG (ساده)', 'Matsuri', 'NekoBox', 'WireGuard'].map((app) => (
                  <span key={app} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700 text-[10px]">
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Config Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-300">
              کانفیگ آماده و تست‌شده برای نود انتخابی (<strong className="text-emerald-400">{activeNode.country}</strong>):
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenConfigModal('singbox')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer"
              >
                دریافت کانفیگ Sing-box
              </button>

              <button
                onClick={() => onOpenConfigModal('v2rayng')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                رول روتینگ v2rayNG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2 Content: Smart Region Geo-Shifting */}
      {activeTab === 'method2' && (
        <div className="mt-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-400">
              متد شماره ۲: تغییر ریجن مچ‌میکینگ به فرانکفورت و دبی (Region Geo-Shifting)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              چرا بازیکنان خارجی کمتر از ۳ ثانیه حریف پیدا می‌کنند، ولی ما ساعت‌ها معطل می‌مانیم؟
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-white block mb-1">
                مکانیزم الگوریتم حریف‌یابی ایفوتبال (Konami Matchmaking Logic):
              </span>
              کونامی بازیکنان را بر اساس GeoIP عمومی دسته‌بندی می‌کند. در ایران، به دلیل کاهش شدید بازیکنانی که در همان دیویژن شما (مثلاً دیویژن ۳ یا دیویژن ۱) و در همان ثانیه در حال سرچ هستند، الگوریتم به تایم‌اوت می‌رسد.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                  <span>🇩🇪 ریجن پیشنهادی اول: آلمان (فرانکفورت)</span>
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                  دارای بیشترین تعداد پلیر آنلاین در دیویژن ۱ تا ۱۰. اگر با آی‌پی فرانکفورت وارد بازی شوید، سرچ حریف بلافاصله بین ۴ الی ۷ ثانیه کامل می‌شود.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 text-xs">
                  <span>🇦🇪 ریجن پیشنهادی دوم: امارات (دبی)</span>
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                  کمترین پینگ فیزیکی به ایران (حدود ۳۰ الی ۴۵ میلی‌ثانیه). استخر مچ‌میکینگ خلیج فارس، کویت، عربستان و ترکیه بسیار سریع حریف پیدا می‌کند.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 Content: APN IPv4 Setting for MCI / Irancell */}
      {activeTab === 'method3' && (
        <div className="mt-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-400">
              متد شماره ۳: رفع باگ شبکه همراه اول و ایرانسل با تنظیم APN به IPv4 Only
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              یکی از مهم‌ترین دلایل قفل شدن سرچ حریف در گوشی‌های سامسونگ و شیائومی!
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-amber-300 block mb-1">
              مشکل فنی پروتکل IPv6 اپراتورهای ایران:
            </span>
            همراه اول و ایرانسل به طور پیش‌فرض پروتکل سیم‌کارت را روی حالت دوگانه IPv4/IPv6 قرار داده‌اند. در بازی ایفوتبال، پروتکل STUN برای دست‌دهی با گوشی حریف نمی‌تواند از روی IPv6 ناقص ایران پکت رد کند و اتصال معلق می‌ماند.
          </div>

          {/* Step-by-step phone instructions */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-white block">مراحل انجام در گوشی‌های اندروید (کمتر از ۱ دقیقه):</span>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 mb-1.5">1</div>
                <span className="font-bold text-slate-200">تنظیمات سیم‌کارت</span>
                <p className="text-[10px] text-slate-400 mt-0.5">ورود به Settings گوشی و بخش Mobile Networks</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 mb-1.5">2</div>
                <span className="font-bold text-slate-200">نقاط دسترسی (APN)</span>
                <p className="text-[10px] text-slate-400 mt-0.5">انتخاب Access Point Names سیم‌کارت فعال</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 mb-1.5">3</div>
                <span className="font-bold text-slate-200">تغییر به IPv4</span>
                <p className="text-[10px] text-slate-400 mt-0.5">گزینه APN Protocol را از IPv4/IPv6 روی فقط <strong className="text-emerald-400">IPv4</strong> بگذارید</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[11px] leading-5 mb-1.5">4</div>
                <span className="font-bold text-slate-200">ذخیره و ریست شبکه</span>
                <p className="text-[10px] text-slate-400 mt-0.5">ذخیره (Save) کنید، یک بار حالت هواپیما بزنید و وارد بازی شوید</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4 Content: In-Game Settings */}
      {activeTab === 'method4' && (
        <div className="mt-5 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-emerald-400">
              متد شماره ۴: تنظیم مخفی محدوده سرچ در منوی ایفوتبال (Matchmaking Area)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              تنظیم رسمی خود کونامی که به طور پیش‌فرض روی حالت محدود قرار دارد!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed">
              در بازی ایفوتبال، گزینه‌ای مخفی به نام <span className="text-white font-mono-code font-bold">Matchmaking Area</span> وجود دارد که تعیین می‌کند سرورها حریف را تا چه شعاع جغرافیایی جستجو کنند:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
                <span className="font-bold text-rose-400 text-xs">حالت پیش‌فرض (اشتباه در ایران): Limited Area</span>
                <p className="text-[11px] text-slate-400 mt-1">
                  کونامی جستجو را فقط به محدوده مجاور فیزیکی محدود می‌کند؛ در نتیجه در ایران هیچ حریفی پیدا نمی‌شود و خطای مچ‌میکینگ دریافت می‌کنید.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="font-bold text-emerald-300 text-xs">حالت بهینه (درست): Gradually Expand</span>
                <p className="text-[11px] text-slate-300 mt-1">
                  اگر حریفی در فاصله نزدیک نبود، بلافاصله شعاع جستجو را به کل سرورهای خاورمیانه و اروپا گسترش می‌دهد و در ۵ ثانیه مسابقه آغاز می‌شود.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 mt-2 text-slate-200">
              <span className="text-emerald-400 font-bold ml-1">مسیر در منوی بازی:</span>
              <span>وارد eFootball League بشوید &gt; آیکون چرخ‌دنده (Match Settings) در پایین صفحه &gt; گزینه Matchmaking Search Area &gt; تغییر به <strong className="text-emerald-300">Gradually expand search area</strong>.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
