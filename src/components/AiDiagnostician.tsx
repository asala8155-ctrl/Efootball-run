import React, { useState, useRef } from 'react';
import { Sparkles, Mic, MicOff, Send, Bot, AlertTriangle, CheckCircle, RefreshCw, Cpu, Wifi } from 'lucide-react';
import { DiagnosisResult } from '../types';

interface AiDiagnosticianProps {
  onApplyRoute: (region: string, mtu: number) => void;
}

export const AiDiagnostician: React.FC<AiDiagnosticianProps> = ({ onApplyRoute }) => {
  const [isp, setIsp] = useState('همراه اول (MCI)');
  const [deviceModel, setDeviceModel] = useState('Samsung Galaxy S / A Series');
  const [symptoms, setSymptoms] = useState('در قسمت دیویژن حریف پیدا نمی‌کند و در مرحله جستجو گیر می‌کند');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Start Audio Recording for Gemini 3.5 Transcribe
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone error:', err);
      alert('دسترسی به میکروفون داده نشد. لطفاً مجوز میکروفون مرورگر را بررسی نمایید.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob: Blob) => {
    try {
      setTranscribing(true);
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        const response = await fetch('/api/gemini/transcribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            audioBase64: base64Data,
            mimeType: 'audio/webm',
          }),
        });

        const data = await response.json();
        if (data.success && data.transcription) {
          setSymptoms(data.transcription);
        }
        setTranscribing(false);
      };
    } catch (error) {
      console.error('Transcription error:', error);
      setTranscribing(false);
    }
  };

  // Run Gemini AI Diagnosis
  const handleDiagnose = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isp,
          deviceModel,
          symptoms,
          gameMode: 'eFootball Division League',
          selectedRegion: 'Frankfurt / Dubai',
          natType: 'Strict (CGNAT)',
        }),
      });

      const data = await response.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      } else if (data.fallback) {
        setAnalysisResult(data.fallback);
      }
    } catch (error) {
      console.error('Diagnosis failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-diagnostician" className="rounded-3xl border border-slate-800 bg-[#0d131f]/95 p-5 sm:p-7 backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                مشاور و تحلیل‌گر هوش مصنوعی Gemini 3.8
              </h3>
              <span className="text-[10px] font-mono-code px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PRO ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              تحلیل اختصاصی وضعیت پورت‌های اینترنت شما و ارائه نسخه اختصاصی رفع سرچ حریف در دیویژن
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Operator Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>اپراتور و اینترنت مورد استفاده:</span>
          </label>
          <select
            value={isp}
            onChange={(e) => setIsp(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="همراه اول (MCI)">همراه اول (Hamrah-e Aval 4G/5G)</option>
            <option value="ایرانسل (Irancell)">ایرانسل (Irancell 4G/TD-LTE)</option>
            <option value="رایتل (Rightel)">رایتل (Rightel)</option>
            <option value="شاتل / شاتل موبایل">شاتل / شاتل موبایل (Shatel)</option>
            <option value="مخابرات ایران (ADSL / فیبر نوری)">مخابرات ایران (TCI / FTTH)</option>
            <option value="آسیاتک (Asiatech)">آسیاتک (Asiatech)</option>
            <option value="زیتل (Zitel)">زیتل (Zitel)</option>
          </select>
        </div>

        {/* Device Model */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>نوع دستگاه و مدل گوشی:</span>
          </label>
          <select
            value={deviceModel}
            onChange={(e) => setDeviceModel(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="Samsung Galaxy S / A Series">گوشی سامسونگ (One UI / Android)</option>
            <option value="Xiaomi / Poco / Redmi">گوشی شیائومی / پوکو / ردمی (HyperOS)</option>
            <option value="Realme / Oppo / OnePlus">گوشی ریلمی / اوپو / وان‌پلاس</option>
            <option value="Google Pixel / Pure Android">گوگل پیکسل / اندروید خام</option>
            <option value="iPhone (iOS)">آیفون (iOS)</option>
          </select>
        </div>
      </div>

      {/* Voice Input & Symptom Description Box */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>مشکل یا رفتار بازی را توضیح دهید (یا به صورت صوتی بگویید):</span>
          </label>

          {/* Voice status */}
          {transcribing && (
            <span className="text-[11px] text-cyan-300 flex items-center gap-1 animate-pulse font-mono-code">
              <RefreshCw className="w-3 h-3 animate-spin" />
              در حال تبدیل صوت با gemini-3.5-transcribe...
            </span>
          )}
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="مثال: من با اینترنت ایرانسل وارد بازی میشم لاگین میکنه اما وقتی میرم دیویژن نیم ساعت میچرخه و هیچ حریفی پیدا نمیکنه..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 pl-24 resize-none leading-relaxed"
          ></textarea>

          {/* Voice Microphone Record Button */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
              }`}
              title={isRecording ? 'توقف ضبط' : 'صحبت صوتی با هوش مصنوعی'}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span className="text-[10px] hidden sm:inline">{isRecording ? 'پایان ضبط' : 'وویس'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Trigger Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleDiagnose}
          disabled={isLoading || transcribing}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>در حال تحلیل عمیق شبکه با Gemini 3.8...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-black" />
              <span>تحلیل هوشمند و ارائه نسخه اختصاصی سرچ حریف</span>
            </>
          )}
        </button>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-900 border border-emerald-500/40 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">
                نسخه کارشناسی و تحلیل قطعی Gemini برای {isp}:
              </h4>
            </div>
            <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ضریب اطمینان: {analysisResult.confidenceScore}
            </span>
          </div>

          {/* Root cause */}
          <div className="space-y-1.5 text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              علت دقیق فنی عدم سرچ حریف:
            </span>
            <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
              {analysisResult.rootCauseAnalysis}
            </p>
          </div>

          {/* Winning strategy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">بهترین ریجن استخر حریف:</span>
              <span className="text-xs font-bold text-emerald-400 font-mono-code">
                {analysisResult.bestRegion}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[11px] text-slate-400 block mb-0.5">MTU پیشنهادی برای جلوگیری از فرگمنت UDP:</span>
              <span className="text-xs font-bold text-cyan-400 font-mono-code">
                {analysisResult.mtuRecommendation}
              </span>
            </div>
          </div>

          {/* Action steps */}
          <div className="space-y-2 text-xs">
            <span className="font-bold text-white block">مراحل عملیاتی جهت حل دائمی:</span>
            <div className="space-y-1.5">
              {analysisResult.recommendedActionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-center font-bold text-[10px] leading-5 shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 leading-relaxed text-[11px]">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* In game setting tip */}
          {analysisResult.inGameSetting && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
              <div>
                <span className="font-bold ml-1">تنظیم در بازی:</span>
                <span>{analysisResult.inGameSetting}</span>
              </div>
              <button
                onClick={() => onApplyRoute(analysisResult.bestRegion, analysisResult.mtuRecommendation || 1360)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                اعمال مستقیم روی بوستر
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
