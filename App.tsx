
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { PresentationState, GeminiInsight } from './types';
import { PRODUCT_NAME, PRODUCT_TAGLINE, FEATURES, TECHNICAL_SPECS, EFFICIENCY_DATA } from './constants';
import { fetchGeminiInsights } from './services/geminiService';
import UcxFaceplate from './components/ucxfaceplate';
import { Smartphone, Signal, Server, Activity, Zap } from './components/Icons';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
      <div className="text-center z-10 space-y-6">
        <div className="text-amber-400 text-2xl tracking-[0.5em] font-black animate-pulse uppercase">SIGMA OS v1.0.4</div>
        <div className="text-slate-600 text-xs uppercase tracking-widest">Initialising Industrial Control Interface...</div>
        <button 
          onClick={onStart}
          className="mt-8 px-10 py-4 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 font-bold uppercase tracking-[0.2em] relative group"
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
        v: 239.5 + (Math.random() * 1.5), // Average 240V with slight variation
        f: 49.98 + (Math.random() * 0.04),
        t: 41.5 + (Math.random() * 1.2),
        p: 0.997 + (Math.random() * 0.003)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full h-12 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center overflow-hidden z-50">
      <div className="bg-amber-600 h-full px-6 flex items-center font-bold text-xs uppercase tracking-tighter whitespace-nowrap text-slate-950">SIGMA LIVE DATA</div>
      <div className="flex-1 overflow-hidden">
        <div className="animate-scroll-left whitespace-nowrap text-slate-400 font-mono text-sm">
          [SYS_OK] GRID VOLTAGE: {data.v.toFixed(1)}V | [SYS_OK] FREQUENCY: {data.f.toFixed(2)}Hz | [ALARM_NONE] TEMPERATURE: {data.t.toFixed(1)}°C | [PFC_ACTIVE] CORRECTION: {data.p.toFixed(3)} | [NODES_SYNC] 5/5 ONLINE | [THD_SCAN] OPTIMAL | [LOAD_VAR] 22% RMS | SIGMA INDUSTRIAL CONTROL - UCX-5X ECOSYSTEM ACTIVE
        </div>
      </div>
      <div className="px-6 text-slate-500 font-mono text-xs">{new Date().toLocaleTimeString()}</div>
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

const OverviewContent: React.FC = () => (
  <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full max-w-7xl mx-auto px-6 overflow-hidden">
    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] animate-mesh">
        <div 
          className="absolute top-0 left-0 w-full h-full blur-[100px]"
          style={{ background: `radial-gradient(circle_at 20% 30%, #f59e0b 0%, transparent 50%), radial-gradient(circle_at 80% 70%, #d97706 0%, transparent 50%)` }}
        ></div>
      </div>
    </div>
    <div className="relative z-10 text-left space-y-8">
      <div className="space-y-4">
        <h2 className="text-amber-500 font-mono tracking-[0.3em] text-lg animate-pulse-subtle uppercase flex items-center gap-2">
          <span className="w-8 h-[1px] bg-current"></span>
          SIGMA INDUSTRIAL CONTROL
        </h2>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white uppercase italic leading-[0.8] animate-glitch">
          {PRODUCT_NAME}
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-lg font-light leading-relaxed">
          {PRODUCT_TAGLINE}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {FEATURES.map((feature, i) => (
          <div key={i} className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl backdrop-blur-md">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">{feature.title}</div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold text-white">{feature.value}</span>
              <span className="text-xs text-amber-500 font-mono">{feature.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="relative z-10 flex justify-center items-center h-full">
      <div className="relative scale-90 md:scale-110 xl:scale-125">
        <UcxFaceplate />
      </div>
    </div>
  </div>
);

const SpecsContent: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center max-w-6xl mx-auto px-6">
    <div className="space-y-8">
      <h2 className="text-4xl font-black text-white uppercase italic border-l-4 border-amber-500 pl-6">Industrial Engineering</h2>
      <div className="space-y-4">
        {TECHNICAL_SPECS.map((spec, i) => (
          <div key={i} className="flex items-center space-x-4 bg-slate-900/30 p-4 rounded-lg border border-transparent hover:border-slate-800 transition-all">
            <div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_8px_#f59e0b]"></div>
            <span className="text-lg text-slate-300">{spec}</span>
          </div>
        ))}
      </div>
    </div>
    <div className="relative flex justify-center">
      <UcxFaceplate view="back" />
    </div>
  </div>
);

const IotEcosystemContent: React.FC = () => (
  <div className="flex flex-col h-full space-y-12 max-w-7xl mx-auto px-6 py-12 justify-center">
    <div className="text-center space-y-2">
      <h2 className="text-4xl font-black text-white uppercase italic">IoT Ecosystem Architecture</h2>
      <p className="text-amber-500 font-mono text-sm tracking-widest uppercase">Sigma Industrial Connect Pipeline</p>
    </div>
    <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 py-20 px-10">
      <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 -translate-y-1/2 z-0">
        <div className="w-full h-full animate-scroll-left bg-[length:20px_100%] bg-[linear-gradient(to_right,transparent_50%,#f59e0b_50%)]"></div>
      </div>
      {[
        { id: 'ucx', title: 'UCX-5X', desc: 'Core Power Engine', icon: <Zap className="w-10 h-10" />, status: 'TRANSMITTING' },
        { id: 'radio', title: 'IoT Module', desc: 'Sub-GHz Radio Node', icon: <Signal className="w-10 h-10" />, status: 'GATEWAY ACTIVE' },
        { id: 'cloud', title: 'Sigma Cloud', desc: 'Neural Data Processing', icon: <Server className="w-10 h-10" />, status: 'SYNCED' },
        { id: 'user', title: 'User Dash', desc: 'Real-time Analytics', icon: <Smartphone className="w-10 h-10" />, status: 'SECURE ACCESS' },
      ].map((node, i) => (
        <div key={node.id} className="relative z-10 flex flex-col items-center group w-full md:w-auto">
          <div className="w-32 h-32 bg-slate-900 border-2 border-slate-800 rounded-2xl flex items-center justify-center text-amber-500 group-hover:border-amber-500 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 backdrop-blur-xl">
            {node.icon}
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-xl font-bold text-white uppercase">{node.title}</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-tight">{node.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EfficiencyContent: React.FC = () => (
  <div className="flex flex-col h-full space-y-12 max-w-6xl mx-auto px-6 py-12 justify-center">
    <div className="text-center">
      <h2 className="text-4xl font-black text-white uppercase italic mb-2">Efficiency Optimization</h2>
      <p className="text-slate-400">Continuous monitoring of power factor under variable load conditions</p>
    </div>
    <div className="h-[400px] w-full bg-slate-900/50 p-8 rounded-3xl border border-slate-800">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={EFFICIENCY_DATA}>
          <defs>
            <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="load" stroke="#64748b" label={{ value: 'Load Percentage (%)', position: 'insideBottom', offset: -5 }} />
          <YAxis domain={[90, 100]} stroke="#64748b" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', borderRadius: '8px' }} itemStyle={{ color: '#f59e0b' }} />
          <Area type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorEff)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const AIAnalysisContent: React.FC<{ insights: GeminiInsight[] }> = ({ insights }) => (
  <div className="flex flex-col h-full space-y-12 max-w-6xl mx-auto px-6 py-12 justify-center">
    <div className="flex items-center space-x-4 mb-8">
      <div className="w-12 h-12 bg-amber-500 rounded-lg flex items-center justify-center animate-pulse">
        <Activity className="w-8 h-8 text-slate-950" />
      </div>
      <div>
        <h2 className="text-3xl font-black text-white uppercase italic">Sigma Neural Audit</h2>
        <p className="text-amber-500 font-mono text-sm uppercase">AI-DRIVEN INFRASTRUCTURE FORECASTING</p>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {insights.length > 0 ? insights.map((insight, i) => (
        <div key={i} className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[40px] group-hover:bg-amber-500/10 transition-colors"></div>
          <div className="text-amber-500 font-mono text-xs mb-4">CRITICAL INSIGHT_{i+1}</div>
          <h3 className="text-xl font-bold text-white mb-4 uppercase">{insight.topic}</h3>
          <p className="text-slate-400 leading-relaxed mb-6 italic">"{insight.content}"</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-600 uppercase">Impact Score</span>
            <span className="text-amber-400 font-bold">{insight.impactScore}%</span>
          </div>
          <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: `${insight.impactScore}%` }}></div></div>
        </div>
      )) : <div className="col-span-3 text-center py-20 animate-pulse text-slate-500 uppercase tracking-widest">Synthesizing AI Audit Data...</div>}
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<PresentationState>(PresentationState.INITIALIZING);
  const [insights, setInsights] = useState<GeminiInsight[]>([]);
  const autoFlowRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPresentation = useCallback(() => {
    if (currentState !== PresentationState.INITIALIZING) return;
    setCurrentState(PresentationState.OVERVIEW);
  }, [currentState]);

  const startAutoFlow = useCallback(() => {
    if (autoFlowRef.current) clearInterval(autoFlowRef.current);
    autoFlowRef.current = setInterval(() => {
      setCurrentState(prev => {
        const states = Object.values(PresentationState).filter(s => s !== PresentationState.INITIALIZING);
        const currentIndex = states.indexOf(prev);
        const nextIndex = (currentIndex + 1) % states.length;
        return states[nextIndex];
      });
    }, 10000);
  }, []);

  const handleStateSelect = (state: PresentationState) => {
    if (state !== currentState) {
      setCurrentState(state);
      startAutoFlow();
    }
  };

  useEffect(() => {
    if (currentState !== PresentationState.INITIALIZING) {
      startAutoFlow();
    }
    return () => {
      if (autoFlowRef.current) clearInterval(autoFlowRef.current);
    };
  }, [currentState, startAutoFlow]);

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
      case PresentationState.SPECIFICATIONS: return <SpecsContent />;
      case PresentationState.IOT_ECOSYSTEM: return <IotEcosystemContent />;
      case PresentationState.EFFICIENCY: return <EfficiencyContent />;
      case PresentationState.AI_ANALYSIS: return <AIAnalysisContent insights={insights} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[400px] bg-amber-900/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="scanline"></div>
      {currentState !== PresentationState.INITIALIZING && <Sidebar active={currentState} onSelect={handleStateSelect} />}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {currentState !== PresentationState.INITIALIZING && (
          <header className="flex items-center justify-between px-10 py-8 z-30">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-500 flex items-center justify-center font-bold text-slate-950 cursor-pointer" onClick={() => handleStateSelect(PresentationState.OVERVIEW)}>Σ</div>
                <div>
                  <span className="font-mono text-sm tracking-widest text-slate-300 uppercase block">SIGMA INDUSTRIAL CONTROL</span>
                  <span className="text-[9px] text-amber-500 font-mono tracking-tighter uppercase opacity-70">Unified Control Excellence v5.0</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-mono uppercase">SECURITY: SIGMA-AES256</div>
              <div className="text-[10px] text-amber-400 font-mono uppercase">Uptime: 99.999%</div>
            </div>
          </header>
        )}
        <div className="flex-1 relative overflow-hidden">
          <div key={currentState} className="h-full w-full animate-slide-up-fade">{renderContent()}</div>
        </div>
        {currentState !== PresentationState.INITIALIZING && <Ticker />}
      </main>
    </div>
  );
};

export default App;
