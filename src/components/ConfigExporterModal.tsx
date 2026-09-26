import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, ShieldCheck, Terminal, Smartphone } from 'lucide-react';
import { ServerNode } from '../types';

interface ConfigExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNode: ServerNode;
  initialAppType?: string;
  onOpenDrive?: () => void;
}

export const ConfigExporterModal: React.FC<ConfigExporterModalProps> = ({
  isOpen,
  onClose,
  activeNode,
  initialAppType = 'singbox',
  onOpenDrive,
}) => {
  const [appType, setAppType] = useState<string>(initialAppType);
  const [mtu, setMtu] = useState<number>(1360);
  const [configText, setConfigText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialAppType) {
      setAppType(initialAppType);
    }
  }, [initialAppType]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchConfig = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/generate-config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            node: activeNode.id,
            appType,
            mtu,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setConfigText(data.config);
        }
      } catch (err) {
        console.error('Config fetch failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [isOpen, appType, mtu, activeNode]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(configText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = appType === 'singbox' ? 'exitlag-efootball.json' : 'exitlag-rules.txt';
    const blob = new Blob([configText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                دریافت کانفیگ گیمینگ eFootball (ExitLag Core)
              </h3>
              <p className="text-xs text-slate-400">
                مخصوص نود: <span className="text-emerald-400 font-bold">{activeNode.country}</span> ({activeNode.name})
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

        {/* Format Selectors & MTU */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-slate-800/80">
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setAppType('singbox')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                appType === 'singbox'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sing-box (توصیه اول)
            </button>
            <button
              onClick={() => setAppType('v2rayng')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                appType === 'v2rayng'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              v2rayNG / Matsuri
            </button>
            <button
              onClick={() => setAppType('wireguard')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                appType === 'wireguard'
                  ? 'bg-emerald-500 text-black shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Warp / WireGuard
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">MTU گیمینگ:</span>
            <select
              value={mtu}
              onChange={(e) => setMtu(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 font-mono-code focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value={1360}>1360 (بهترین برای همراه اول/ایرانسل)</option>
              <option value={1420}>1420 (بهترین برای مخابرات/شاتل)</option>
              <option value={1280}>1280 (حداقل بدون فرگمنت)</option>
            </select>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto py-3 min-h-[220px]">
          <div className="relative rounded-2xl bg-black/60 border border-slate-800 p-4 font-mono-code text-[11px] leading-relaxed text-emerald-300 overflow-x-auto select-all">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                در حال آماده‌سازی کانفیگ با الگوریتم ExitLag...
              </div>
            ) : (
              <pre className="whitespace-pre">{configText}</pre>
            )}
          </div>
        </div>

        {/* Footer Actions & Instructions */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تنظیم مستقیم پورت‌های <strong className="text-emerald-300">UDP 5730-5739</strong> و بسته eFootball</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {onOpenDrive && (
              <button
                onClick={() => {
                  onClose();
                  onOpenDrive();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold text-xs transition-all cursor-pointer"
                title="ذخیره این کانفیگ در Google Drive"
              >
                <svg viewBox="0 0 87.3 78" className="w-3.5 h-3.5">
                  <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                  <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                  <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                  <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                  <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                  <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                </svg>
                <span>ذخیره در Drive</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
              <span>{copied ? 'کپی شد!' : 'کپی کانفیگ'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>دانلود فایل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
