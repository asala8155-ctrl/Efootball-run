import React from 'react';
import { ServerNode } from '../types';
import { Globe, Radio, RefreshCw, Star, Zap } from 'lucide-react';

interface NodeSelectorProps {
  nodes: ServerNode[];
  activeNode: ServerNode;
  onSelectNode: (node: ServerNode) => void;
  isTestingPing: boolean;
  onTestPing: () => void;
  selectedIsp: string;
  onIspChange: (isp: string) => void;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  nodes,
  activeNode,
  onSelectNode,
  isTestingPing,
  onTestPing,
  selectedIsp,
  onIspChange,
}) => {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#0d131f]/80 p-5 sm:p-6 backdrop-blur-sm">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              انتخاب ریجن سرور و استخر حریف‌یابی
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            با تغییر ریجن، ایفوتبال شما را به استخر فعال همان کشور منتقل کرده و سرچ حریف بدون تاخیر انجام می‌شود.
          </p>
        </div>

        {/* ISP Filter & Ping Test Button */}
        <div className="flex items-center gap-2">
          {/* Operator Select */}
          <select
            value={selectedIsp}
            onChange={(e) => onIspChange(e.target.value)}
            className="text-xs bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="irancell">ایرانسل (Irancell 4G/5G)</option>
            <option value="mci">همراه اول (Hamrah-e Aval)</option>
            <option value="rightel">رایتل (Rightel)</option>
            <option value="shatel">شاتل / شاتل موبایل</option>
            <option value="mokhaberat">مخابرات ایران (ADSL/FTTH)</option>
            <option value="asiatech">آسیاتک (Asiatech)</option>
          </select>

          {/* Test Ping button */}
          <button
            onClick={onTestPing}
            disabled={isTestingPing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
            title="تست پینگ به تمام سرورها"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تست پینگ زنده</span>
          </button>
        </div>
      </div>

      {/* Nodes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-5">
        {nodes.map((node) => {
          const isSelected = activeNode.id === node.id;
          const displayPing = node.measuredPing || node.basePing;
          
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node)}
              className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-950 border-emerald-500/70 shadow-lg shadow-emerald-950/50'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Selected badge */}
              {isSelected && (
                <div className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  <span>انتخاب شده</span>
                </div>
              )}

              {/* Title & Flag */}
              <div className="flex items-start gap-3">
                <span className="text-2xl mt-0.5">{node.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {node.country}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono-code text-slate-400">
                    {node.name}
                  </span>
                </div>
              </div>

              {/* Live Ping & Search time */}
              <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <div className="text-[10px] text-slate-400">تخمین پینگ:</div>
                  <div className="flex items-baseline gap-1">
                    <span className={`text-base font-black font-tech ${
                      displayPing < 45 ? 'text-emerald-400' : displayPing < 75 ? 'text-cyan-400' : 'text-amber-400'
                    }`}>
                      {displayPing}
                    </span>
                    <span className="text-[10px] text-slate-500">ms</span>
                  </div>
                </div>

                <div className="text-left">
                  <div className="text-[10px] text-slate-400">زمان سرچ حریف:</div>
                  <div className="text-xs font-bold text-emerald-300 font-mono-code flex items-center gap-1 justify-end">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    <span>~{node.searchEstimatedSeconds || Math.round(displayPing / 10)} ثانیه</span>
                  </div>
                </div>
              </div>

              {/* Matchmaking feature tag */}
              <div className="mt-2.5 text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60 leading-relaxed">
                <span className="text-emerald-400 font-medium ml-1">استخر دیویژن:</span>
                <span>{node.matchmakingPool}</span>
              </div>

              {/* Recommended For */}
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-400">
                <Star className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{node.recommendedFor}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
