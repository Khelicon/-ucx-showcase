
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PresentationState, GeminiInsight } from './types';
import { PRODUCT_NAME, PRODUCT_TAGLINE, FEATURES, TECHNICAL_SPECS, EFFICIENCY_DATA } from './constants';
import { fetchGeminiInsights } from './services/geminiService';
import UcxFaceplate from './components/ucxfaceplate';
import SigmaLogo from './components/sigmaLogo';
import { Smartphone, Signal, Server, Activity, Zap, CheckCircle, RefreshCw, Activity as ActivityIcon, Sun } from './components/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { audioService } from './services/audioService';

// --- Sub-components ---

const LoadingScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          onStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onStart]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-950 font-mono relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="w-full h-full bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      <div className="w-24 h-24 border-4 border-amber-500/10 border-t-amber-500 rounded-full animate-spin mb-12 relative">
        <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
      </div>
      <div className="text-center z-10 space-y-6 px-6">
        <div className="text-amber-400 text-xl md:text-2xl tracking-[0.5em] font-black animate-pulse uppercase">SIGMA OS v1.0.4</div>
        <div className="text-slate-600 text-[10px] md:text-xs uppercase tracking-widest">Initialising Industrial Control Interface...</div>
        <button 
          onClick={onStart}
          className="mt-8 px-8 md:px-10 py-4 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 font-bold uppercase tracking-[0.2em] relative group text-sm md:text-base"
        >
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-amber-500"></span>
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-amber-500"></span>
          Connect to UCX-5X
        </button>
        <div className="text-slate-500 text-[10px] uppercase tracking-widest mt-4">
          Automatic Bypass in {timeLeft}s...
        </div>
      </div>
    </div>
  );
};

const Ticker: React.FC = () => {
  const [data, setData] = useState({
    v: 240.2,
    f: 50.01,
    t: 42.1,
    p: 0.998
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        v: 239.5 + (Math.random() * 1.5), 
        f: 49.98 + (Math.random() * 0.04),
        t: 41.5 + (Math.random() * 1.2),
        p: 0.997 + (Math.random() * 0.003)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-10 md:h-12 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center overflow-hidden z-50">
      <div className="bg-amber-600 h-full px-4 md:px-6 flex items-center font-bold text-[10px] md:text-xs uppercase tracking-tighter whitespace-nowrap text-slate-950 shrink-0">SIGMA LIVE DATA</div>
      <div className="flex-1 overflow-hidden">
        <div className="animate-scroll-left whitespace-nowrap text-slate-400 font-mono text-xs md:text-sm">
          [SYS_OK] GRID VOLTAGE: {data.v.toFixed(1)}V | [SYS_OK] FREQUENCY: {data.f.toFixed(2).toString()}Hz | [ALARM_NONE] TEMPERATURE: {data.t.toFixed(1)}°C | [PFC_ACTIVE] CORRECTION: {data.p.toFixed(3)} | [NODES_SYNC] 5/5 ONLINE | [THD_SCAN] OPTIMAL | [LOAD_VAR] 22% RMS | SIGMA INDUSTRIAL CONTROL - UCX-5X ECOSYSTEM ACTIVE
        </div>
      </div>
      <div className="hidden md:block px-6 text-slate-500 font-mono text-xs">{new Date().toLocaleTimeString()}</div>
    </div>
  );
};

const Sidebar: React.FC<{ active: PresentationState; onSelect: (state: PresentationState) => void }> = ({ active, onSelect }) => (
  <div className="hidden lg:flex flex-col w-20 bg-slate-900 border-r border-slate-800 p-4 space-y-8 items-center z-40">
    <div className="w-10 h-10 bg-amber-500 rounded flex items-center justify-center font-black text-slate-950 cursor-pointer hover:scale-105 transition-transform" onClick={() => onSelect(PresentationState.OVERVIEW)}>Σ</div>
    <div className="flex-1 flex flex-col justify-center space-y-8">
      {Object.values(PresentationState).filter(s => s !== PresentationState.INITIALIZING).map((state) => (
        <button 
          key={state}
          title={state}
          onClick={() => onSelect(state)}
          className="group relative flex flex-col items-center"
        >
          <div 
            className={`w-1 h-8 rounded-full transition-all duration-500 ${active === state ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-slate-700 group-hover:bg-slate-500'}`}
          />
          <span className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-amber-500 text-[9px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none uppercase tracking-widest border border-slate-700">
            {state}
          </span>
        </button>
      ))}
    </div>
    <div className="text-[10px] origin-center -rotate-90 whitespace-nowrap font-mono text-slate-600 mb-8 uppercase tracking-widest">SIGMA INDUSTRIAL</div>
  </div>
);

const MobileNav: React.FC<{ active: PresentationState; onSelect: (state: PresentationState) => void }> = ({ active, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="lg:hidden fixed top-6 right-6 z-[60]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center text-amber-500 shadow-2xl relative"
      >
        {isOpen ? (
          <span className="font-bold text-lg">✕</span>
        ) : (
          <div className="space-y-1">
            <div className="w-5 h-0.5 bg-current"></div>
            <div className="w-5 h-0.5 bg-current"></div>
            <div className="w-3 h-0.5 bg-current"></div>
          </div>
        )}
        {!isOpen && <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse border-2 border-slate-950"></div>}
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 space-y-4 animate-slide-up-fade">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-20 text-8xl font-black text-amber-500 select-none">Σ</div>
          {Object.values(PresentationState).filter(s => s !== PresentationState.INITIALIZING).map((state) => (
            <button 
              key={state}
              onClick={() => { onSelect(state); setIsOpen(false); }}
              className={`text-2xl md:text-3xl font-black uppercase italic tracking-tighter transition-all ${active === state ? 'text-amber-500 translate-x-2' : 'text-slate-600 hover:text-slate-400'}`}
            >
              {state.replace('_', ' ')}
            </button>
          ))}
          <div className="pt-12 flex flex-col items-center gap-2">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Industrial Control Suite v5.0</p>
            <button onClick={() => setIsOpen(false)} className="px-6 py-2 border border-slate-800 rounded-full text-slate-500 text-[10px] uppercase tracking-widest">Close Overlay</button>
          </div>
        </div>
      )}
    </div>
  );
};

const OverviewContent: React.FC = () => (
  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center h-full max-w-7xl mx-auto px-6 py-12 lg:py-0 overflow-hidden">
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-mesh">
        <div 
          className="absolute top-0 left-0 w-full h-full blur-[100px]"
          style={{ background: `radial-gradient(circle_at 20% 30%, #f59e0b 0%, transparent 50%), radial-gradient(circle_at 80% 70%, #d97706 0%, transparent 50%)` }}
        ></div>
      </div>
    </div>
    <div className="relative z-10 text-left space-y-6 lg:space-y-8 order-2 lg:order-1">
      <div className="space-y-2 lg:space-y-4">
        <h2 className="text-amber-500 font-mono tracking-[0.3em] text-sm md:text-lg animate-pulse-subtle uppercase flex items-center gap-2">
          <span className="w-4 md:w-8 h-[1px] bg-current"></span>
          SIGMA INDUSTRIAL CONTROL
        </h2>
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.8] animate-glitch">
          {PRODUCT_NAME}
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-slate-400 max-w-lg font-light leading-relaxed">
          {PRODUCT_TAGLINE}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
        {FEATURES.map((feature, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-md">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{feature.title}</div>
            <div className="flex items-baseline space-x-1">
              <span className="text-xl md:text-2xl font-bold text-white">{feature.value}</span>
              <span className="text-[10px] md:text-xs text-amber-500 font-mono">{feature.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="relative z-10 flex justify-center items-center h-full order-1 lg:order-2">
      <div className="relative scale-75 md:scale-100 lg:scale-125">
        <UcxFaceplate />
      </div>
    </div>
  </div>
);

const OnsiteOperationContent: React.FC = () => (
  <div className="flex flex-col min-h-full space-y-8 lg:space-y-12 max-w-7xl mx-auto px-6 py-12 justify-center animate-slide-up-fade">
    <div className="flex flex-col lg:flex-row items-end justify-between gap-4 border-b border-slate-800 pb-6">
      <div className="space-y-2">
        <h2 className="text-amber-500 font-mono tracking-widest text-sm uppercase">Live Deployment</h2>
        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic">Onsite Operations</h1>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">Steel Mill Deployment - Phase 4</div>
        <div className="text-emerald-500 font-mono text-[10px] flex items-center justify-end gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           DATA FEED: STABLE
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 relative group overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900 shadow-2xl aspect-video lg:aspect-auto lg:h-[450px]">
        {/* Cinematic Video Layer */}
        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center overflow-hidden">
          {/* YouTube Video Embed - Configured for loop, mute, and hidden controls */}
          <iframe 
            className="w-full h-full object-cover scale-[1.02] pointer-events-none select-none"
            src="https://www.youtube.com/embed/s0SokDqYuo8?autoplay=1&mute=1&loop=1&playlist=s0SokDqYuo8&controls=0&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0"
            title="UCX-5X Onsite Operation"
            allow="autoplay; encrypted-media"
            frameBorder="0"
          ></iframe>
          
          {/* Dark Overlay to help readability of UI on top of video */}
          <div className="absolute inset-0 bg-slate-950/20 pointer-events-none"></div>
          
          <div className="scanline"></div>
          
          {/* Live Overlay UI Elements */}
          <div className="absolute top-6 left-6 flex items-center gap-3 z-10">
             <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
             <span className="text-white font-mono text-[10px] uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">LIVE / REC</span>
          </div>
          <div className="absolute bottom-6 left-6 font-mono text-[9px] text-white/70 space-y-1 z-10 bg-black/40 p-2 rounded backdrop-blur-sm">
             <div>LAT: 40.7128° N</div>
             <div>LNG: 74.0060° W</div>
             <div>ALT: 12.4m ASL</div>
          </div>
          <div className="absolute top-6 right-6 text-right font-mono text-[9px] text-amber-500 space-y-1 z-10 bg-black/40 p-2 rounded backdrop-blur-sm">
             <div className="animate-glitch">CAM_01_SEC_PFC</div>
             <div className="text-white/60">FR: 60.00FPS</div>
          </div>
          <div className="absolute bottom-6 right-6 z-10">
             <div className="w-32 h-12 border border-white/20 bg-black/40 rounded p-1 flex items-end gap-[2px] backdrop-blur-sm">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="flex-1 bg-amber-500/50" style={{ height: `${20 + Math.random() * 80}%` }}></div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
           <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-4 flex items-center gap-2">
             <Activity className="w-4 h-4 text-amber-500" />
             Environmental Context
           </h3>
           <p className="text-slate-400 text-sm leading-relaxed mb-6">
             Operating in a high-vibration environment at a heavy steel manufacturing plant. The UCX-5X manages dynamic inductive loads from giant arc furnaces in real-time.
           </p>
           <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                 <span className="text-[10px] text-slate-500 uppercase">Amb. Temperature</span>
                 <span className="text-sm font-bold text-white">48.2°C</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                 <span className="text-[10px] text-slate-500 uppercase">Chassis Vib.</span>
                 <span className="text-sm font-bold text-emerald-500">NOMINAL</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                 <span className="text-[10px] text-slate-500 uppercase">Deployment Age</span>
                 <span className="text-sm font-bold text-white">184 Days</span>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-transparent p-6 rounded-2xl border border-amber-500/20">
           <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-amber-500" />
              <span className="text-xs font-bold text-white uppercase tracking-widest">Client Feedback</span>
           </div>
           <p className="text-slate-400 text-xs italic leading-relaxed">
             "Switching to the UCX-5X reduced our monthly energy surcharges by 14% within the first quarter. The remote diagnostics have been a game changer for our maintenance crew."
           </p>
           <div className="mt-4 text-[9px] text-amber-500 uppercase font-mono">— Maintenance Dir., Global Steel Corp.</div>
        </div>
      </div>
    </div>
  </div>
);

const SpecsContent: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFocusedIndex((prev) => (prev + 1) % TECHNICAL_SPECS.length);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-full items-center max-w-6xl mx-auto px-6 py-12 lg:py-0">
      <div className="space-y-6 lg:space-y-8">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic border-l-4 border-amber-500 pl-4 md:pl-6">Industrial Engineering</h2>
        <div className="space-y-3 lg:space-y-4">
          {TECHNICAL_SPECS.map((spec, i) => {
            const isFocused = focusedIndex === i;
            return (
              <div 
                key={i} 
                className={`flex items-center space-x-4 p-3 md:p-4 rounded-lg border transition-all duration-700 ${
                  isFocused 
                    ? 'bg-amber-500/10 border-amber-500/50 scale-102 lg:scale-105 lg:translate-x-2' 
                    : 'bg-slate-900/30 border-transparent opacity-60'
                }`}
              >
                <div className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                  isFocused ? 'bg-amber-500 shadow-[0_0_15px_#f59e0b] scale-125' : 'bg-slate-700'
                }`}></div>
                <span className={`text-sm md:text-lg font-medium transition-colors duration-500 ${isFocused ? 'text-white' : 'text-slate-400'}`}>
                  {spec}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative flex justify-center items-center h-64 lg:h-full">
         <div className="absolute w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-amber-500/5 blur-[80px] md:blur-[100px] rounded-full"></div>
         <div className={`transition-transform duration-1000 ${focusedIndex % 2 === 0 ? 'scale-90 lg:scale-105' : 'scale-85 lg:scale-100'}`}>
          <UcxFaceplate view="back" />
         </div>
      </div>
    </div>
  );
};

const IotEcosystemContent: React.FC = () => {
  const [logMessages, setLogMessages] = useState<string[]>([]);
  
  useEffect(() => {
    const msgs = [
      "PACKET_RCV: [Node 104] RMS_V: 240.1",
      "SYNC_CMD: Global Phase Alignment Sent",
      "CLOUD_PUSH: Efficiency Audit Complete",
      "ALARM: Load Variation @ 12%",
      "NODE_STAT: Gateway Active (9.2ms Latency)",
      "PFC_STATE: Active Compensation ENGAGED"
    ];
    let i = 0;
    const interval = setInterval(() => {
      setLogMessages(prev => [msgs[i % msgs.length], ...prev.slice(0, 4)]);
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col min-h-full space-y-8 lg:space-y-12 max-w-7xl mx-auto px-6 py-12 justify-center">
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic">IoT Ecosystem Architecture</h2>
        <p className="text-amber-500 font-mono text-xs md:text-sm tracking-widest uppercase">Sigma Industrial Neural Stream</p>
      </div>

      <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 py-10 md:py-20 px-6 md:px-10 bg-slate-900/20 rounded-[30px] lg:rounded-[40px] border border-slate-800">
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg className="w-full h-full" preserveAspectRatio="none">
            <path id="path1" d="M 150 200 Q 400 100 650 200" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="2" className="animate-flow-line" />
            <path id="path2" d="M 650 200 Q 900 300 1150 200" fill="none" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="2" className="animate-flow-line" />
          </svg>
        </div>

        {[
          { id: 'ucx', title: 'UCX-5X', desc: 'Core Power Engine', icon: <Zap className="w-8 h-8 md:w-10 md:h-10" />, metrics: 'LOAD: 24A' },
          { id: 'radio', title: 'IoT Module', desc: '868MHz Gateway', icon: <Signal className="w-8 h-8 md:w-10 md:h-10" />, metrics: 'RSSI: -45dBm' },
          { id: 'cloud', title: 'Sigma Cloud', desc: 'AI Compute Cluster', icon: <Server className="w-8 h-8 md:w-10 md:h-10" />, metrics: '99.9% SL' },
          { id: 'user', title: 'User Dash', desc: 'Mobile Control', icon: <Smartphone className="w-8 h-8 md:w-10 md:h-10" />, metrics: 'ACTIVE' },
        ].map((node, i) => (
          <div key={node.id} className="relative z-10 flex flex-col items-center group w-full md:w-auto">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-900 border-2 border-slate-800 rounded-2xl md:rounded-3xl flex items-center justify-center text-amber-500 group-hover:border-amber-500 group-hover:shadow-[0_0_40px_rgba(245,158,11,0.3)] transition-all duration-500 backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-amber-500/5 to-amber-500/0 group-hover:via-amber-500/10 transition-colors"></div>
              {node.icon}
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
            </div>
            <div className="mt-4 md:mt-6 text-center">
              <h3 className="text-lg md:text-xl font-bold text-white uppercase group-hover:text-amber-400 transition-colors">{node.title}</h3>
              <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">{node.desc}</p>
              <div className="mt-2 md:mt-3 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[8px] font-mono text-amber-500 tracking-widest inline-block">
                {node.metrics}
              </div>
            </div>
            {/* Visual spacer for mobile */}
            {i < 3 && <div className="lg:hidden w-[1px] h-6 bg-slate-800 my-4"></div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start pb-12">
        <div className="bg-slate-900/80 border border-slate-800 p-4 md:p-6 rounded-2xl flex flex-col gap-4">
           <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Activity className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              <span className="text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-widest">System Telemetry Log</span>
           </div>
           <div className="space-y-2 font-mono text-[9px] md:text-[10px]">
              {logMessages.map((m, idx) => (
                <div key={idx} className={`flex items-center gap-2 ${idx === 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                  <span className="opacity-50">[{new Date().toLocaleTimeString()}]</span>
                  <span className="truncate">{m}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="space-y-3 lg:space-y-4">
          <div className="bg-slate-900/40 p-4 md:p-5 rounded-2xl border border-slate-800 flex items-center gap-4 group hover:border-amber-500/30 transition-colors">
            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] md:text-xs font-bold text-white uppercase">Redundant Failover Protection</div>
              <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 uppercase">Automatic cloud-to-local fallback if internet connection drops.</p>
            </div>
          </div>
          <div className="bg-slate-900/40 p-4 md:p-5 rounded-2xl border border-slate-800 flex items-center gap-4 group hover:border-amber-500/30 transition-colors">
            <RefreshCw className="w-5 h-5 md:w-6 md:h-6 text-amber-500 shrink-0" />
            <div>
              <div className="text-[10px] md:text-xs font-bold text-white uppercase">Neural Predictive Maintenance</div>
              <p className="text-[9px] md:text-[10px] text-slate-500 mt-1 uppercase">Anticipates hardware degradation 14 days before potential failure.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/90 border border-slate-700 p-3 rounded-lg backdrop-blur-md shadow-2xl">
        <p className="text-[10px] text-slate-500 mb-2 uppercase font-mono tracking-widest">{label}</p>
        <div className="space-y-1">
          {payload.map((p: any, i: number) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="text-[9px] font-bold uppercase" style={{ color: p.color }}>{p.name}:</span>
              <span className="text-[10px] font-mono text-white">{p.value.toFixed(p.name === 'PF' ? 3 : 1)} {p.unit || ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const DashboardContent: React.FC = () => {
  const [metrics, setMetrics] = useState({
    voltage: 239.8,
    current: 12.42,
    pf: 0.998,
    watt: 2972.1,
    va: 2978.3,
    var: 192.1
  });
  const [history, setHistory] = useState<{time: string, pf: number, v: number, i: number}[]>([]);
  const [forecastIndex, setForecastIndex] = useState(0);

  const forecasts = useMemo(() => [
    {
      type: "Phase Alignment",
      title: "Phase Lag Detected",
      desc: "Inductive load spike predicted at 15:45. Automated compensation staged.",
      confidence: 98.2,
      time: "+45 mins"
    },
    {
      type: "Capacitor Health",
      title: "Bank #3 Drift",
      desc: "Bank #3 showing 12% capacitance drift. Replacement recommended in 60 days.",
      confidence: 94.5,
      time: "T+14 days"
    },
    {
      type: "Harmonic Scan",
      title: "Non-Linear Anomaly",
      desc: "Interference detected on Phase B. Neural mitigation THD-i filter active.",
      confidence: 91.8,
      time: "Real-time"
    },
    {
      type: "Thermal Profile",
      title: "Efficiency Gradient",
      desc: "Heatsink gradient stabilizing at +12°C over ambient. Fan duty cycle reduced.",
      confidence: 99.1,
      time: "Steady State"
    }
  ], []);

  useEffect(() => {
    const metricsInterval = setInterval(() => {
      const v = 238.0 + Math.random() * 4.0;
      const i = 10.0 + Math.random() * 5.0;
      const va = v * i;
      const pf = 0.995 + Math.random() * 0.004;
      const watt = va * pf;
      const varPower = Math.sqrt(Math.max(0, Math.pow(va, 2) - Math.pow(watt, 2)));

      const timeStr = new Date().toLocaleTimeString().split(' ')[0];
      
      setMetrics({
        voltage: v,
        current: i,
        pf: pf,
        watt: watt,
        va: va,
        var: varPower
      });

      setHistory(prev => {
        const next = [...prev, { time: timeStr, pf, v, i }];
        return next.slice(-15);
      });
    }, 1000);

    const forecastInterval = setInterval(() => {
      setForecastIndex(prev => (prev + 1) % forecasts.length);
    }, 5000);

    return () => {
      clearInterval(metricsInterval);
      clearInterval(forecastInterval);
    };
  }, [forecasts.length]);

  return (
    <div className="flex flex-col min-h-full space-y-6 max-w-7xl mx-auto px-6 py-6 lg:py-4 justify-start animate-slide-up-fade pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-3 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white uppercase italic tracking-tight">Sigma Industrial Live Telemetry</h2>
          <p className="text-amber-500 font-mono text-[8px] md:text-[9px] tracking-[0.2em] uppercase">Node Instance: UCX-BETA-09 // Grid Health: OPTIMAL</p>
        </div>
        <div className="flex gap-2">
           <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[8px] md:text-[9px] font-mono text-slate-400 uppercase">System Frequency: <span className="text-white">50.01 Hz</span></div>
           <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[8px] md:text-[9px] font-mono text-slate-400 uppercase">Load: <span className="text-amber-500">42% RMS</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Real-time Metrics Card */}
        <div className="md:col-span-2 bg-slate-900/60 border border-amber-500/20 p-5 rounded-3xl backdrop-blur-md flex flex-col justify-between h-40 lg:h-auto group overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] pointer-events-none"></div>
           <div className="flex justify-between items-start">
              <div>
                <div className="text-[9px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Power Factor</div>
                <div className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">{metrics.pf.toFixed(3)}</div>
              </div>
              <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
           </div>
           <div className="mt-4 space-y-2 lg:space-y-3">
              <div className="flex justify-between items-center text-[9px] uppercase font-mono">
                 <span className="text-slate-500">Efficiency Gap</span>
                 <span className="text-amber-500">{(1 - metrics.pf).toFixed(4)}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-amber-500 shadow-[0_0_10px_#f59e0b]" style={{ width: `${metrics.pf * 100}%` }}></div>
              </div>
           </div>
        </div>

        <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
          {[
            { label: 'Voltage (V)', val: metrics.voltage.toFixed(1), unit: 'V', icon: <Zap className="w-3 h-3"/> },
            { label: 'Current (A)', val: metrics.current.toFixed(2), unit: 'A', icon: <Activity className="w-3 h-3"/> },
            { label: 'Active (W)', val: metrics.watt.toFixed(1), unit: 'W', icon: <Smartphone className="w-3 h-3"/> },
            { label: 'Apparent (VA)', val: metrics.va.toFixed(1), unit: 'VA', icon: <Server className="w-3 h-3"/> },
            { label: 'Reactive (VAR)', val: metrics.var.toFixed(1), unit: 'VAR', icon: <RefreshCw className="w-3 h-3"/> },
            { label: 'Line Load', val: '42.1', unit: '%', icon: <Signal className="w-3 h-3"/> },
          ].map((m, i) => (
            <div key={i} className="bg-slate-900/40 border border-slate-800 p-3 md:p-4 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-500 opacity-70">{m.icon}</span>
                <span className="text-[8px] md:text-[9px] text-slate-500 uppercase font-bold tracking-wider">{m.label}</span>
              </div>
              <div className="text-lg md:text-xl font-bold text-white font-mono">
                {m.val} <span className="text-[8px] md:text-[10px] text-slate-600 font-normal">{m.unit}</span>
              </div>
            </div>
          ))}
          <div className="col-span-2 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 p-3 md:p-4 rounded-2xl flex flex-col justify-center">
             <div className="text-[8px] md:text-[10px] text-amber-500 font-bold uppercase mb-1">Grid Compliance</div>
             <div className="text-white font-bold flex items-center gap-2 text-xs md:text-sm">
                <CheckCircle className="w-4 h-4 text-green-500" />
                IEEE 519 Compliant
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[260px]">
        {/* Unified Live Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-4 md:p-6 rounded-3xl relative overflow-hidden min-h-[300px] lg:min-h-0">
          <div className="flex items-center justify-between mb-4">
             <div className="text-[9px] md:text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></div>
                Harmonized Waveform (PF/V/I)
             </div>
             <div className="text-[8px] md:text-[9px] text-slate-500 font-mono">Sampling: 1000ms</div>
          </div>
          <div className="h-48 md:h-full w-full -ml-4">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" hide />
                <YAxis yAxisId="left" domain={[0, 300]} hide />
                <YAxis yAxisId="right" domain={[0.9, 1.05]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Line yAxisId="right" type="monotone" dataKey="pf" name="PF" stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false} />
                <Line yAxisId="left" type="monotone" dataKey="v" name="Voltage" stroke="#3b82f6" strokeWidth={1} dot={false} isAnimationActive={false} strokeDasharray="3 3" />
                <Line yAxisId="left" type="monotone" dataKey="i" name="Current" stroke="#10b981" strokeWidth={1} dot={false} isAnimationActive={false} strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Neural Predictor - Updated with Rotation */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-4 md:p-6 rounded-3xl flex flex-col justify-between gap-4 overflow-hidden relative">
          <div key={forecastIndex} className="space-y-4 animate-slide-up-fade">
            <div className="flex items-center gap-3">
               <RefreshCw className="w-5 h-5 text-amber-500 animate-spin-slow" />
               <div className="text-xs font-bold text-white uppercase tracking-widest">AI Neural Predictor</div>
            </div>
            <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 h-32 flex flex-col justify-center">
               <div className="flex justify-between items-start mb-1">
                  <div className="text-[8px] md:text-[9px] text-amber-500 font-mono uppercase">Forecast: {forecasts[forecastIndex].time}</div>
                  <div className="text-[8px] text-slate-600 font-mono uppercase">ID: SIGMA_PRD_{forecastIndex + 1}</div>
               </div>
               <div className="text-base md:text-lg font-black text-white uppercase italic tracking-tighter leading-none mb-2">{forecasts[forecastIndex].title}</div>
               <p className="text-[8px] md:text-[10px] text-slate-400 uppercase leading-relaxed font-medium">
                 {forecasts[forecastIndex].desc}
               </p>
            </div>
            <div className="flex flex-col gap-1.5">
               <div className="flex justify-between items-center text-[8px] md:text-[9px] text-slate-600 uppercase font-bold">
                  <span>Confidence Level</span>
                  <span className="text-amber-400">{forecasts[forecastIndex].confidence}%</span>
               </div>
               <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-1000 ease-out" 
                    style={{ width: `${forecasts[forecastIndex].confidence}%` }}
                  ></div>
               </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
             <div className="flex gap-1">
                {forecasts.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === forecastIndex ? 'bg-amber-500' : 'bg-slate-700'}`}></div>
                ))}
             </div>
             <span className="text-[8px] text-slate-600 uppercase font-mono tracking-widest">Neural Bridge Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EfficiencyContent: React.FC = () => (
  <div className="flex flex-col min-h-full space-y-12 max-w-6xl mx-auto px-6 py-12 justify-center pb-20">
    <div className="text-center space-y-2">
      <h2 className="text-3xl md:text-4xl font-black text-white uppercase italic">Efficiency Optimization</h2>
      <p className="text-slate-400 text-sm md:text-base">Continuous monitoring of power factor under variable load conditions</p>
    </div>
    <div className="h-[300px] md:h-[400px] w-full bg-slate-900/50 p-4 md:p-8 rounded-3xl border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={EFFICIENCY_DATA}>
          <defs>
            <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="load" stroke="#64748b" label={{ value: 'Load (%)', position: 'insideBottom', offset: -5, fontSize: 10 }} />
          <YAxis domain={[90, 100]} stroke="#64748b" label={{ value: 'Eff (%)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px', fontSize: '10px' }} />
          <Area type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEff)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AIAnalysisContent: React.FC<{ insights: GeminiInsight[] }> = ({ insights }) => (
  <div className="flex flex-col min-h-full space-y-8 lg:space-y-12 max-w-6xl mx-auto px-6 py-12 justify-center pb-20">
    <div className="flex items-center space-x-4 mb-4 lg:mb-8">
      <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-500 rounded-lg flex items-center justify-center animate-pulse shrink-0">
        <Activity className="w-6 h-6 md:w-8 md:h-8 text-slate-950" />
      </div>
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-white uppercase italic">Sigma Neural Audit</h2>
        <p className="text-amber-500 font-mono text-[10px] md:text-sm uppercase">AI-DRIVEN INFRASTRUCTURE FORECASTING</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {insights.length > 0 ? insights.map((insight, i) => (
        <div key={i} className="bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="text-amber-500 font-mono text-[9px] md:text-xs mb-4">CRITICAL INSIGHT_{i+1}</div>
          <h3 className="text-lg md:text-xl font-bold text-white mb-3 uppercase">{insight.topic}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{insight.content}"</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-600 uppercase">Impact Score</span>
            <span className="text-xs md:text-amber-400 font-bold">{insight.impactScore}%</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${insight.impactScore}%` }}></div></div>
        </div>
      )) : <div className="col-span-full text-center py-20 animate-pulse text-slate-500 uppercase tracking-widest text-xs md:text-sm">Synthesizing AI Audit Data...</div>}
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<PresentationState>(PresentationState.INITIALIZING);
  const [insights, setInsights] = useState<GeminiInsight[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const autoFlowRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startPresentation = useCallback(() => {
    if (currentState !== PresentationState.INITIALIZING) return;
    setCurrentState(PresentationState.OVERVIEW);
    audioService.init();
    audioService.playBoot();
  }, [currentState]);

  const togglePause = () => {
    if (isPaused) {
      setIsPaused(false);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    } else {
      setIsPaused(true);
      pauseTimerRef.current = setTimeout(() => {
        setIsPaused(false);
      }, 180000);
    }
  };

  const startAutoFlow = useCallback(() => {
    if (autoFlowRef.current) clearInterval(autoFlowRef.current);
    
    autoFlowRef.current = setInterval(() => {
      if (isPaused) return;

      setCurrentState(prev => {
        const states = Object.values(PresentationState).filter(s => s !== PresentationState.INITIALIZING);
        const currentIndex = states.indexOf(prev);
        const nextIndex = (currentIndex + 1) % states.length;
        return states[nextIndex];
      });
    }, currentState === PresentationState.DASHBOARD || currentState === PresentationState.ONSITE_OPERATION ? 15000 : 10000);
  }, [isPaused, currentState]);

  const handleStateSelect = (state: PresentationState) => {
    if (state !== currentState) {
      setCurrentState(state);
      audioService.playTransition();
      startAutoFlow();
    }
  };

  useEffect(() => {
    if (currentState !== PresentationState.INITIALIZING) {
      startAutoFlow();
    }
    return () => {
      if (autoFlowRef.current) clearInterval(autoFlowRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [currentState, startAutoFlow, isPaused]);

  useEffect(() => {
    const loadInsights = async () => {
      const data = await fetchGeminiInsights("SIGMA UCX-5X");
      setInsights(data);
    };
    loadInsights();
  }, []);

  const renderContent = () => {
    switch (currentState) {
      case PresentationState.INITIALIZING: return <LoadingScreen onStart={startPresentation} />;
      case PresentationState.OVERVIEW: return <OverviewContent />;
      case PresentationState.ONSITE_OPERATION: return <OnsiteOperationContent />;
      case PresentationState.SPECIFICATIONS: return <SpecsContent />;
      case PresentationState.IOT_ECOSYSTEM: return <IotEcosystemContent />;
      case PresentationState.DASHBOARD: return <DashboardContent />;
      case PresentationState.EFFICIENCY: return <EfficiencyContent />;
      case PresentationState.AI_ANALYSIS: return <AIAnalysisContent insights={insights} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] md:w-[800px] h-[200px] md:h-[400px] bg-amber-900/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="scanline"></div>
      
      {currentState !== PresentationState.INITIALIZING && (
        <>
          <Sidebar active={currentState} onSelect={handleStateSelect} />
          <MobileNav active={currentState} onSelect={handleStateSelect} />
        </>
      )}

      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentState !== PresentationState.INITIALIZING && (
          <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 z-30">
            <div className="flex items-center space-x-4 md:space-x-6">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden" 
                  onClick={() => handleStateSelect(PresentationState.OVERVIEW)}
                >
                  <SigmaLogo width={38} height={38} />
                </div>
                <div className="hidden sm:block">
                  <span className="font-mono text-[10px] md:text-sm tracking-widest text-slate-300 uppercase block">SIGMA INDUSTRIAL CONTROL</span>
                  <span className="text-[7px] md:text-[9px] text-amber-500 font-mono tracking-tighter uppercase opacity-70">Unified Control Excellence v5.0</span>
                </div>
              </div>
              <button 
                onClick={togglePause}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-[8px] md:text-[9px] uppercase tracking-widest transition-all duration-300 ${
                  isPaused 
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]' 
                    : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-amber-500 hover:border-amber-500/50'
                }`}
              >
                {isPaused ? <ActivityIcon className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                <span className="hidden xs:inline">{isPaused ? 'Paused (3m)' : 'Pause Flow'}</span>
              </button>
            </div>
            <div className="text-right hidden xs:block">
              <div className="text-[8px] md:text-[10px] text-slate-500 font-mono uppercase">SECURITY: SIGMA-AES256</div>
              <div className="text-[8px] md:text-[10px] text-amber-400 font-mono uppercase">Uptime: 99.999%</div>
            </div>
          </header>
        )}
        
        {/* Responsive Content Container */}
        <div className={`flex-1 relative ${currentState === PresentationState.INITIALIZING ? 'overflow-hidden' : 'overflow-y-auto lg:overflow-hidden'} hide-scrollbar`}>
          <div key={currentState} className="h-full w-full animate-slide-up-fade">
            {renderContent()}
          </div>
        </div>
        
        {currentState !== PresentationState.INITIALIZING && <Ticker />}
      </main>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (max-width: 400px) {
          .xs-hidden { display: none; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
