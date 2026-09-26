import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BoosterHUD } from './components/BoosterHUD';
import { NodeSelector } from './components/NodeSelector';
import { MatchmakingSolutions } from './components/MatchmakingSolutions';
import { MatchSimulator } from './components/MatchSimulator';
import { AiDiagnostician } from './components/AiDiagnostician';
import { ConfigExporterModal } from './components/ConfigExporterModal';
import { DownloadAppModal } from './components/DownloadAppModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { AndroidQuickInstallCard } from './components/AndroidQuickInstallCard';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { ServerNode } from './types';
import { ShieldCheck, Zap, Globe, Sparkles, HelpCircle, Download, Smartphone, HardDriveDownload } from 'lucide-react';

const DEFAULT_NODES: ServerNode[] = [
  {
    id: 'de-fra',
    name: 'Frankfurt Hub (EU-Central)',
    country: 'آلمان (فرانکفورت)',
    code: 'DE',
    flag: '🇩🇪',
    basePing: 52,
    jitterRange: 3,
    matchmakingPool: 'بزرگ‌ترین استخر جهانی دیویژن (بیشترین پلیر آنلاین)',
    konamiCluster: 'AWS eu-central-1 (PES Main Relay)',
    recommendedFor: 'دیویژن 1 تا 3 و حریف‌یابی تضمینی زیر 10 ثانیه',
    score: 99,
  },
  {
    id: 'ae-dxb',
    name: 'Dubai Relay (ME-South)',
    country: 'امارات (دبی)',
    code: 'AE',
    flag: '🇦🇪',
    basePing: 29,
    jitterRange: 4,
    matchmakingPool: 'منطقه خاورمیانه و خلیج فارس (پینگ پایین)',
    konamiCluster: 'AWS me-central-1 (UAE Relay)',
    recommendedFor: 'کمترین پینگ ممکن (25ms-45ms) با پلیرهای عرب و منطقه',
    score: 94,
  },
  {
    id: 'tr-ist',
    name: 'Istanbul Gateway (TR-Caucasus)',
    country: 'ترکیه (استانبول)',
    code: 'TR',
    flag: '🇹🇷',
    basePing: 38,
    jitterRange: 5,
    matchmakingPool: 'استخر ترکیه، ایران و اروپای شرقی',
    konamiCluster: 'Türk Telekom / Equinix Istanbul IBX',
    recommendedFor: 'سازگاری بسیار بالا با اینترنت همراه اول و ایرانسل',
    score: 96,
  },
  {
    id: 'bh-bah',
    name: 'Bahrain AWS Cluster',
    country: 'بحرین (منامه)',
    code: 'BH',
    flag: '🇧🇭',
    basePing: 34,
    jitterRange: 4,
    matchmakingPool: 'سرورهای اصلی اختصاصی کونامی در خاورمیانه',
    konamiCluster: 'AWS me-south-1',
    recommendedFor: 'پینگ فوق‌العاده پایدار و بدون پکت لاست',
    score: 92,
  },
  {
    id: 'nl-ams',
    name: 'Amsterdam Supernode',
    country: 'هلند (آمستردام)',
    code: 'NL',
    flag: '🇳🇱',
    basePing: 59,
    jitterRange: 2,
    matchmakingPool: 'استخر غرب اروپا (پلیرهای اروپایی سطح بالا)',
    konamiCluster: 'AMS-IX Konami Division Backbone',
    recommendedFor: 'ثبات حداکثری مسیرهای UDP در بازی‌های سرعتی',
    score: 95,
  },
];

export default function App() {
  const [nodes, setNodes] = useState<ServerNode[]>(DEFAULT_NODES);
  const [activeNode, setActiveNode] = useState<ServerNode>(DEFAULT_NODES[0]);
  const [isBoosted, setIsBoosted] = useState<boolean>(false);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [selectedIsp, setSelectedIsp] = useState<string>('mci');
  const [isTestingPing, setIsTestingPing] = useState<boolean>(false);
  const [configModalOpen, setConfigModalOpen] = useState<boolean>(false);
  const [configModalAppType, setConfigModalAppType] = useState<string>('singbox');
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [driveModalOpen, setDriveModalOpen] = useState<boolean>(false);
  const [gitHubModalOpen, setGitHubModalOpen] = useState<boolean>(false);

  const [metrics, setMetrics] = useState({
    ping: 52,
    jitter: 1.8,
    packetLoss: 0.0,
    natType: 'Type 1 (Open)',
    trafficUp: 124,
    trafficDown: 450,
  });

  // Sound Synthesizer via Web Audio API (cyber clicks & power sounds)
  const playSound = (type: 'boost' | 'stop' | 'click') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'boost') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } else if (type === 'stop') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      } else {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      }
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  // Fetch nodes on mount
  useEffect(() => {
    fetch('/api/nodes')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.nodes) {
          setNodes(data.nodes);
          setActiveNode(data.nodes[0]);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_NODES
      });
  }, []);

  // Update metrics when activeNode changes
  useEffect(() => {
    if (isBoosted) {
      setMetrics((prev) => ({
        ...prev,
        ping: activeNode.measuredPing || activeNode.basePing,
        jitter: Number((Math.random() * 2 + 1).toFixed(1)),
        packetLoss: 0.0,
      }));
    }
  }, [activeNode, isBoosted]);

  // Toggle Booster action
  const handleToggleBoost = () => {
    if (isBoosted) {
      // Stop boost
      playSound('stop');
      setIsBoosted(false);
      setMetrics({
        ping: 110,
        jitter: 38.5,
        packetLoss: 28.4,
        natType: 'Type 3 (Strict CGNAT)',
        trafficUp: 0,
        trafficDown: 0,
      });
    } else {
      // Start boost with optimization sequence
      playSound('boost');
      setIsOptimizing(true);
      setTimeout(() => {
        setIsOptimizing(false);
        setIsBoosted(true);
        setMetrics({
          ping: activeNode.measuredPing || activeNode.basePing,
          jitter: Number((Math.random() * 2 + 1).toFixed(1)),
          packetLoss: 0.0,
          natType: 'Type 1 (Open)',
          trafficUp: 380,
          trafficDown: 1420,
        });
      }, 1600);
    }
  };

  // Run live ping check
  const handleTestPing = async () => {
    setIsTestingPing(true);
    playSound('click');
    try {
      const res = await fetch('/api/ping-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isp: selectedIsp }),
      });
      const data = await res.json();
      if (data.success && data.results) {
        setNodes(data.results);
        const updatedCurrent = data.results.find((n: ServerNode) => n.id === activeNode.id);
        if (updatedCurrent) {
          setActiveNode(updatedCurrent);
          if (isBoosted) {
            setMetrics((prev) => ({
              ...prev,
              ping: updatedCurrent.measuredPing || updatedCurrent.basePing,
            }));
          }
        }
      }
    } catch (err) {
      console.error('Ping test error:', err);
    } finally {
      setIsTestingPing(false);
    }
  };

  const handleOpenConfigModal = (appType: string) => {
    playSound('click');
    setConfigModalAppType(appType);
    setConfigModalOpen(true);
  };

  const handleApplyRouteFromAi = (regionName: string, _mtu: number) => {
    const matched = nodes.find((n) => regionName.toLowerCase().includes(n.country.toLowerCase()) || regionName.toLowerCase().includes(n.name.toLowerCase()));
    if (matched) {
      setActiveNode(matched);
    }
    if (!isBoosted) {
      handleToggleBoost();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToAi = () => {
    playSound('click');
    document.getElementById('ai-diagnostician')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070a10] text-slate-100 relative">
      {/* Top Cyber Glow Ambient */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-64 bg-emerald-500/5 blur-[120px] pointer-events-none -z-10"></div>

      {/* Header */}
      <Header
        isBoosted={isBoosted}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onOpenAi={scrollToAi}
        onOpenDownload={() => setDownloadModalOpen(true)}
        onOpenDrive={() => setDriveModalOpen(true)}
        onOpenGitHub={() => setGitHubModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Android Instant 1-Tap Installer Card */}
        <AndroidQuickInstallCard onOpenGitHub={() => setGitHubModalOpen(true)} />

        {/* Core Booster HUD */}
        <BoosterHUD
          isBoosted={isBoosted}
          isOptimizing={isOptimizing}
          activeNode={activeNode}
          onToggleBoost={handleToggleBoost}
          metrics={metrics}
        />

        {/* Region & Matchmaking Pool Selector */}
        <NodeSelector
          nodes={nodes}
          activeNode={activeNode}
          onSelectNode={(node) => {
            playSound('click');
            setActiveNode(node);
          }}
          isTestingPing={isTestingPing}
          onTestPing={handleTestPing}
          selectedIsp={selectedIsp}
          onIspChange={(isp) => {
            setSelectedIsp(isp);
            handleTestPing();
          }}
        />

        {/* Division Matchmaking 4-Fold Breakthrough Methods */}
        <MatchmakingSolutions
          activeNode={activeNode}
          onOpenConfigModal={handleOpenConfigModal}
        />

        {/* Live Matchmaking Queue Simulator */}
        <MatchSimulator />

        {/* Gemini AI Matchmaking Diagnostician & Voice Transcriber */}
        <AiDiagnostician onApplyRoute={handleApplyRouteFromAi} />
      </main>

      {/* Config Exporter Modal */}
      <ConfigExporterModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
        activeNode={activeNode}
        initialAppType={configModalAppType}
        onOpenDrive={() => setDriveModalOpen(true)}
      />

      {/* Download & Mobile Install Modal */}
      <DownloadAppModal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />

      {/* Google Drive Workspace Modal */}
      <GoogleDriveModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        activeNode={activeNode}
      />

      {/* GitHub 1-Click Deploy & APK Builder Modal */}
      <GitHubDeployModal
        isOpen={gitHubModalOpen}
        onClose={() => setGitHubModalOpen(false)}
      />

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 bg-[#06090e] py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-tech font-extrabold text-slate-300">
              EXIT<span className="text-emerald-400">LAG</span> MOBILE
            </span>
            <span>—</span>
            <span>موتور بهینه‌ساز تخصصی مچ‌میکینگ ایفوتبال برای کاربران ایرانی</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <button
              onClick={() => setDownloadModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 underline font-bold cursor-pointer"
            >
              دانلود و نصب روی گوشی
            </button>
            <span>•</span>
            <a
              href="/api/download-zip"
              download="exitlag-efootball-booster.zip"
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              دریافت ZIP سورس
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
