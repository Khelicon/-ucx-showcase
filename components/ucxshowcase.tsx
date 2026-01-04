
import React from 'react';
// Fix: Use correct file casing for import to avoid TypeScript casing errors
import UcxFaceplate from './ucxfaceplate';
import { Sun, Smartphone, Signal, RefreshCw, Activity, Zap, Server, CheckCircle } from './Icons';
import { ScrollReveal } from './ScrollReveal';

const UcxShowcase: React.FC = () => {
    return (
        <section className="py-24 bg-gradient-to-b from-gray-900 to-[#0f172a] relative overflow-hidden border-t border-gray-800">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    
                    {/* Content Side */}
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-500 text-xs font-bold uppercase tracking-widest mb-6">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                Premium Partner Series
                            </div>
                            
                            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
                                The UCX-5X <span className="text-gray-500 block text-2xl mt-2">Built for Sigma Industrial Control</span>
                            </h2>
                            
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                A collaboration between SenseR Labs and Sigma IC to push the boundaries of industrial power management. 
                                The UCX-5X combines rugged reliability with next-gen IoT and solar integration.
                            </p>
                            
                            {/* Key Specs Bar */}
                            <div className="flex items-center gap-6 mb-10 text-sm font-medium text-gray-400 border-y border-gray-800 py-4">
                                <div className="flex items-center gap-2">
                                    <Server className="w-4 h-4 text-amber-500" /> 144x144mm Panel
                                </div>
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-amber-500" /> 8/12/16 Relay Steps
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-amber-500" /> Class 1.0 Accuracy
                                </div>
                            </div>

                        </ScrollReveal>

                        <div className="grid sm:grid-cols-2 gap-6 mb-10">
                            {[
                                { icon: <Sun className="w-5 h-5" />, title: "Solar Compatible", desc: "Bi-directional metering for solar grid-tie systems." },
                                { icon: <Smartphone className="w-5 h-5" />, title: "IoT & Remote Monitor", desc: "Native cloud connectivity for real-time analytics app." },
                                { icon: <Activity className="w-5 h-5" />, title: "Health Monitoring", desc: "Self-calibration & capacitor health tracking." },
                                { icon: <Zap className="w-5 h-5" />, title: "Instant Correction", desc: "Zero-delay switching for sensitive loads." },
                                { icon: <RefreshCw className="w-5 h-5" />, title: "Self Calibration", desc: "Auto-learns bank values without manual entry." },
                                { icon: <Signal className="w-5 h-5" />, title: "OLED Display", desc: "Crystal clear multi-parameter energy dashboard." }
                            ].map((item, idx) => (
                                <ScrollReveal key={idx} delay={`${idx * 100}ms`}>
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="text-amber-500 shrink-0 mt-0.5">{item.icon}</div>
                                        <div>
                                            <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                            <p className="text-gray-400 text-xs leading-normal">{item.desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>

                        <ScrollReveal delay="400ms">
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <a 
                                    href="https://www.sigmaic.com" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="px-6 py-3 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    Visit Sigma IC
                                </a>
                                <span className="text-gray-500 text-sm">Available exclusively through Sigma distribution network.</span>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Visual Side */}
                    <div className="lg:w-1/2 order-1 lg:order-2 flex justify-center relative min-h-[400px] items-center">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                        
                        <div className="relative z-10 w-full flex justify-center scale-100 sm:scale-110">
                            <UcxFaceplate />
                            <div className="absolute right-0 top-0 bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded shadow-lg flex items-center gap-2 animate-bounce pointer-events-none z-20">
                                <span className="w-2 h-2 bg-amber-500 rounded-full"></span> OLED Screen
                            </div>
                            <div className="absolute left-0 bottom-10 bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded shadow-lg flex items-center gap-2 animate-pulse pointer-events-none z-20">
                                <Signal className="w-3 h-3 text-amber-500" /> IoT Online
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UcxShowcase;
