import React, { useState, useEffect } from 'react';
import { 
  X, 
  HardDrive, 
  Upload, 
  FileText, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Check, 
  AlertTriangle, 
  LogOut, 
  Search, 
  FolderPlus,
  ShieldAlert,
  Archive,
  CheckCircle2
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, getAccessToken, initAuth } from '../services/googleAuth';
import { listDriveFiles, uploadTextToDrive, uploadBlobToDrive, deleteDriveFile, DriveFile } from '../services/googleDrive';
import { ServerNode } from '../types';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeNode: ServerNode;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  activeNode,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadingStatus, setUploadingStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Destructive delete confirmation modal state
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch Drive files when token is available and modal is open
  useEffect(() => {
    if (isOpen && token) {
      loadFiles(token);
    }
  }, [isOpen, token]);

  const loadFiles = async (authToken: string, query?: string) => {
    setIsLoadingFiles(true);
    setErrorMessage(null);
    try {
      const driveFiles = await listDriveFiles(authToken, query);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setErrorMessage(err.message || 'خطا در بارگذاری فایل‌های گوگل درایو');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        await loadFiles(res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign in failed:', err);
      setErrorMessage(err.message || 'ورود به حساب گوگل ناموفق بود.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setToken(null);
    setFiles([]);
  };

  // Upload current eFootball gaming config to Google Drive
  const handleBackupConfig = async () => {
    if (!token) return;
    setUploadingStatus('در حال تولید و ذخیره کانفیگ در گوگل درایو...');
    setErrorMessage(null);
    try {
      const configRes = await fetch('/api/generate-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node: activeNode.id,
          appType: 'singbox',
          mtu: 1360,
        }),
      });
      const configData = await configRes.json();
      const content = configData.config || '{}';
      const fileName = `ExitLag-eFootball-${activeNode.id}-${new Date().toISOString().slice(0, 10)}.json`;

      const uploaded = await uploadTextToDrive(token, fileName, content);
      setSuccessMessage(`کانفیگ ${uploaded.name} با موفقیت در گوگل درایو شما ذخیره شد!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadFiles(token);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در ذخیره کانفیگ در گوگل درایو');
    } finally {
      setUploadingStatus(null);
    }
  };

  // Upload complete project ZIP to Google Drive
  const handleBackupFullZip = async () => {
    if (!token) return;
    setUploadingStatus('در حال آماده‌سازی و بارگذاری فایل فشرده ZIP در گوگل درایو...');
    setErrorMessage(null);
    try {
      const zipRes = await fetch('/api/download-zip');
      const blob = await zipRes.blob();
      const fileName = `exitlag-efootball-booster-${new Date().toISOString().slice(0, 10)}.zip`;

      const uploaded = await uploadBlobToDrive(token, fileName, blob);
      setSuccessMessage(`پروژه کامل ${uploaded.name} با موفقیت در گوگل درایو شما آپلود شد!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      await loadFiles(token);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در آپلود فایل ZIP در گوگل درایو');
    } finally {
      setUploadingStatus(null);
    }
  };

  // Confirm and delete file from Google Drive (Mandatory Confirmation Workflow)
  const confirmDelete = async () => {
    if (!token || !fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setSuccessMessage(`فایل "${fileToDelete.name}" از گوگل درایو شما حذف شد.`);
      setTimeout(() => setSuccessMessage(null), 4000);
      setFileToDelete(null);
      await loadFiles(token);
    } catch (err: any) {
      setErrorMessage(err.message || 'خطا در حذف فایل از گوگل درایو');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (searchQuery.trim()) {
      loadFiles(token, `name contains '${searchQuery.trim()}'`);
    } else {
      loadFiles(token);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-[#0d131f] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0a0f18]">
          <div className="flex items-center gap-3">
            {/* Google Drive Logo */}
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center p-2 shadow-md">
              <svg viewBox="0 0 87.3 78" className="w-full h-full">
                <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
                <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>مدیریت و پشتیبان‌گیری در Google Drive</span>
                <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Google Workspace
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                ذخیره دائمی کانفیگ‌های گیمینگ و دانلود سورس برنامه روی حساب گوگل درایو شما
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

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Notifications */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Auth State Box */}
          {!user ? (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                <HardDrive className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white">اتصال به حساب Google Drive</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                  با ورود به حساب گوگل خود، می‌توانید کانفیگ‌های اختصاصی ایفوتبال و فایل‌های فشرده سورس پروژه را با اجازه شما مستقیماً در گوگل درایو ذخیره و مدیریت کنید.
                </p>
              </div>

              {/* Official Google Sign-In Button */}
              <div className="flex justify-center pt-2">
                <button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{isLoggingIn ? 'در حال ورود به گوگل...' : 'ورود با حساب گوگل (Sign in with Google)'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* User Profile Card */}
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                      {user.displayName?.charAt(0) || 'G'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-white">{user.displayName || 'کاربر گوگل'}</h4>
                    <p className="text-[11px] text-slate-400 font-mono-code">{user.email}</p>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer"
                  title="خروج از حساب گوگل"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>خروج</span>
                </button>
              </div>

              {/* Action Buttons for Backup to Google Drive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Backup current config */}
                <button
                  onClick={handleBackupConfig}
                  disabled={!!uploadingStatus}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-emerald-500/40 hover:border-emerald-500 text-right transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                      ذخیره کانفیگ در Google Drive
                    </span>
                    <FileText className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    ذخیره تنظیمات و رول‌های نود فعال ({activeNode.country}) با فرمت JSON در درایو شخصی شما
                  </p>
                </button>

                {/* 2. Upload full zip */}
                <button
                  onClick={handleBackupFullZip}
                  disabled={!!uploadingStatus}
                  className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-blue-500/40 hover:border-blue-500 text-right transition-all cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-blue-400 group-hover:text-blue-300">
                      آپلود فایل ZIP سورس در Drive
                    </span>
                    <Archive className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    انتقال مستقیم فایل فشرده کل پروژه به فضای گوگل درایو برای دسترسی از کامپیوتر یا گوشی
                  </p>
                </button>
              </div>

              {uploadingStatus && (
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-center gap-2 animate-pulse font-medium">
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  <span>{uploadingStatus}</span>
                </div>
              )}

              {/* Drive File Browser & Search */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span>فایل‌های حساب Google Drive شما:</span>
                  </span>

                  <button
                    onClick={() => token && loadFiles(token)}
                    disabled={isLoadingFiles}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                    <span>تازه‌سازی</span>
                  </button>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="جستجو در فایل‌های گوگل درایو..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 pl-8 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    جستجو
                  </button>
                </form>

                {/* Files List */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden divide-y divide-slate-800/80 max-h-60 overflow-y-auto">
                  {isLoadingFiles ? (
                    <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>در حال دریافت لیست فایل‌های Google Drive...</span>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      هیچ فایلی یافت نشد. می‌توانید با دکمه‌های بالا کانفیگ یا سورس را در درایو ذخیره کنید.
                    </div>
                  ) : (
                    files.map((file) => (
                      <div key={file.id} className="p-3 flex items-center justify-between hover:bg-slate-900/60 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0 pr-1">
                          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-200 truncate">{file.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono-code flex items-center gap-2">
                              <span>{file.size ? `${(Number(file.size) / 1024).toFixed(1)} KB` : 'فایل'}</span>
                              <span>•</span>
                              <span>{file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('fa-IR') : ''}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {file.webViewLink && (
                            <a
                              href={file.webViewLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                              title="مشاهده در Google Drive"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete button triggering confirmation modal */}
                          <button
                            onClick={() => setFileToDelete(file)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                            title="حذف فایل از درایو"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0a0f18] flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>متصل به API رسمی Google Drive v3 با سطح دسترسی تاییدشده</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>

      {/* MANDATORY USER CONFIRMATION DIALOG FOR DESTRUCTIVE OPERATIONS */}
      {fileToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/40 bg-[#0d131f] p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/40">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">تایید حذف فایل از Google Drive</h4>
                <p className="text-xs text-rose-400 mt-0.5">عملیات غیرقابل بازگشت است</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
              آیا مطمئن هستید که می‌خواهید فایل زیر را برای همیشه از Google Drive خود حذف کنید؟
              <div className="font-bold text-white mt-1.5 font-mono-code truncate bg-slate-900 p-2 rounded-lg border border-slate-800">
                {fileToDelete.name}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                انصراف (Cancel)
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>{isDeleting ? 'در حال حذف...' : 'بله، حذف شود (Confirm)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
