import React, { useState } from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  Check, 
  Copy, 
  AlertTriangle, 
  RefreshCw, 
  Rocket, 
  CheckCircle2, 
  Key, 
  FolderGit2, 
  Download,
  Terminal,
  HelpCircle
} from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('exitlag-efootball-booster');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    username: string;
    repo: string;
    repoUrl: string;
    actionsUrl: string;
    releasesUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) {
      setErrorMessage('لطفاً توکن شخصی گیت‌هاب (Personal Access Token) خود را وارد کنید.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token.trim(),
          repo: repoName.trim() || 'exitlag-efootball-booster',
          isPrivate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'خطا در ارسال پروژه به گیت‌هاب');
      }

      setResult(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ارتباط با سرور');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-800 bg-[#0d131f] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0a0f18]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 text-white shadow-md">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>ارسال پروژه به GitHub شما و ساخت خودکار APK</span>
              </h3>
              <p className="text-xs text-slate-400">
                گیت‌هاب با GitHub Actions فایل نصبی APK را به صورت خودکار بیلد می‌کند
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {result ? (
            /* Success View */
            <div className="space-y-4 text-center py-2 animate-in fade-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-base font-bold text-white">پروژه با موفقیت در گیت‌هاب شما قرار گرفت!</h4>
                <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto leading-relaxed">
                  فرایند خودکار <strong className="text-emerald-400">GitHub Actions</strong> شروع به ساخت فایل رسمی APK کرد و پس از پایان، فایل نصبی در بخش <strong className="text-white">Releases</strong> گیت‌هاب شما آماده دانلود خواهد بود.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-right text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">مخزن در گیت‌هاب:</span>
                  <a
                    href={result.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-mono-code font-bold"
                  >
                    <span>{result.username}/{result.repo}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400">مشاهده روند زنده بیلد APK (Actions):</span>
                  <a
                    href={result.actionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-bold"
                  >
                    <span>صفحه GitHub Actions</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-slate-300">دانلود فایل نهایی APK (Releases):</span>
                  <a
                    href={result.releasesUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-emerald-300 hover:text-white font-bold"
                  >
                    <span>صفحه دانلود Release</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <a
                  href={result.releasesUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>رفتن به صفحه دانلود فایل APK در گیت‌هاب</span>
                </a>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleDeploy} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <Rocket className="w-4 h-4 text-blue-400" />
                  <span>چگونه خودکار در گیت‌هاب شما آپلود و بیلد شود؟</span>
                </div>
                <p>
                  فقط کافیست یک توکن دسترسی موقت (Token) از گیت‌هاب خود بدهید تا سرور تمام کدها و ورک‌فلو ساخت خودکار APK را مستقیماً به اکانت گیت‌هاب شما ارسال کند.
                </p>
                <div className="pt-1">
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=ExitLag+eFootball+Deployer"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
                  >
                    <span>۱ کلیک برای دریافت توکن از گیت‌هاب (کلیک کنید)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    (در صفحه باز شده، فقط اسکرول کنید به پایین و دکمه سبز رنگ Generate token را بزنید و کد را اینجا کپی کنید)
                  </p>
                </div>
              </div>

              {/* GitHub Token Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    <span>توکن دسترسی گیت‌هاب (Personal Access Token):</span>
                  </span>
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono-code placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Repo Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>نام مخزن جدید در گیت‌هاب شما:</span>
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="exitlag-efootball-booster"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono-code placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Private / Public Checkbox */}
              <div className="flex items-center gap-2 pt-1 text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 text-emerald-500 focus:ring-0 bg-slate-900 cursor-pointer"
                />
                <label htmlFor="isPrivate" className="cursor-pointer">
                  مخزن به صورت Private (شخصی و خصوصی) باشد
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>در حال ساخت ریپازیتوری و پوش کدها به گیت‌هاب...</span>
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4" />
                      <span>ارسال خودکار به گیت‌هاب و شروع ساخت APK</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f18] flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Github className="w-4 h-4 text-slate-300" />
            <span>اتصال مستقیم از طریق GitHub API v3 رسمی</span>
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
