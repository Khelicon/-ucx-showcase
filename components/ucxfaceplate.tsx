
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ChevronsLeft } from './Icons';
import SigmaLogo from './sigmaLogo';

interface UcxFaceplateProps {
    view?: 'front' | 'back' | 'side';
}

const SevenSegmentDigit: React.FC<{ value: string; size?: number }> = ({ value, size = 30 }) => {
    const activeColor = "#ef4444"; // Industrial Red - Fixed
    const inactiveColor = "#2a1a1a"; 

    const segments: Record<string, string> = {
        a: "11, 2, 39, 2, 36, 8, 14, 8",
        b: "40, 3, 40, 33, 35, 30, 35, 9",
        c: "40, 37, 40, 67, 35, 64, 35, 40",
        d: "39, 68, 11, 68, 14, 62, 36, 62",
        e: "10, 67, 10, 37, 15, 40, 15, 64",
        f: "10, 33, 10, 3, 15, 9, 15, 30",
        g: "11, 35, 39, 35, 36, 38, 14, 38, 11, 35",
    };

    const charMap: Record<string, string[]> = {
        '0': ['a', 'b', 'c', 'd', 'e', 'f'],
        '1': ['b', 'c'],
        '2': ['a', 'b', 'd', 'e', 'g'],
        '3': ['a', 'b', 'c', 'd', 'g'],
        '4': ['b', 'c', 'f', 'g'],
        '5': ['a', 'c', 'd', 'f', 'g'],
        '6': ['a', 'c', 'd', 'e', 'f', 'g'],
        '7': ['a', 'b', 'c'],
        '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        '9': ['a', 'b', 'c', 'd', 'f', 'g'],
        '-': ['g'],
        'P': ['a', 'b', 'e', 'f', 'g'],
        'F': ['a', 'e', 'f', 'g'],
        ' ': [],
    };
    const activeSegments = charMap[value] || [];

    return (
        <div style={{ width: size * 0.6, height: size }} className="relative inline-block mx-[1px]">
            <svg viewBox="0 0 50 70" className="w-full h-full overflow-visible">
                {Object.entries(segments).map(([key, points]) => (
                    <polygon
                        key={key}
                        points={points}
                        fill={activeSegments.includes(key) ? activeColor : inactiveColor}
                        className={activeSegments.includes(key) ? "filter drop-shadow-[0_0_2px_rgba(239,68,68,0.8)]" : ""}
                    />
                ))}
            </svg>
        </div>
    );
};

const FrontPanelContent = () => {
    const [pfValue, setPfValue] = useState("0.99");

    useEffect(() => {
        const interval = setInterval(() => {
            setPfValue(prev => prev === "0.99" ? "1.00" : "0.99");
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-full bg-[#121212] p-2 rounded-xl border-[4px] border-[#1a1a1a] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
            <div className="w-full h-full flex flex-col relative select-none bg-white rounded-lg overflow-hidden shadow-2xl ring-1 ring-black/50">
                <div className="absolute inset-0 border border-white/40 pointer-events-none z-20 rounded-sm"></div>
                <div className="h-[54%] bg-[#fdfcfb] p-3 relative flex">
                    <div className="w-1/2 flex flex-col justify-start gap-2 pt-1">
                        <div className="grid grid-cols-4 gap-x-1.5 gap-y-2">
                            {[...Array(12)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center gap-0.5">
                                    <div className={`w-1.5 h-1.5 rounded-full ${i < 4 ? 'bg-red-500 shadow-[0_0_6px_red] animate-pulse' : 'bg-gray-300'}`}></div>
                                    <span className="text-[5px] text-gray-600 font-bold tracking-tighter">RL{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col items-end relative">
                        <div className="flex gap-3 mb-2 mt-1 mr-1">
                            {['VOLT', 'AMP', 'KW', 'KVAR'].map((label, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className={`w-1.5 h-1.5 rounded-full mb-1 ${i === 0 ? 'bg-red-500 shadow-[0_0_4px_red]' : 'bg-gray-300'}`}></div>
                                    <span className="text-[4px] font-bold text-gray-600">{label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#2a1a1a] px-3.5 py-1.5 rounded border border-gray-400 mb-1.5 flex items-center justify-center gap-0.5 shadow-inner relative mr-8">
                            <div className="absolute inset-0 bg-red-500/5 blur-sm"></div>
                            <SevenSegmentDigit value="-" size={24} />
                            <SevenSegmentDigit value="P" size={24} />
                            <SevenSegmentDigit value="F" size={24} />
                        </div>
                        <div className="text-[6px] font-bold text-gray-600 text-right w-full pr-10 mb-1">STATUS</div>
                        <div className="w-20 h-12 bg-black rounded border border-gray-600 relative overflow-hidden flex flex-col p-1 shadow-[0_0_10px_rgba(239,68,68,0.15)] mr-7">
                            <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
                            <div className="flex justify-between items-start border-b border-gray-800 pb-0.5 mb-0.5">
                                <span className="text-[6px] text-white">PF-Avg</span>
                                <span className="text-[6px] text-white">%</span>
                                <span className="text-[6px] text-white">kVAr</span>
                            </div>
                            <div className="flex items-center justify-between mt-0.5">
                                <div className="text-white font-mono text-lg leading-none font-bold tracking-tighter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">
                                    {pfValue}
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[5px] text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]">0.000</span>
                                    <span className="text-[4px] text-gray-400">kW</span>
                                    <span className="text-[5px] text-red-400 drop-shadow-[0_0_3px_rgba(239,68,68,0.8)]">0.002</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-auto text-[4px] text-gray-300">
                                <span>1.00c</span>
                                <span>~</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Horizontal Separator Line - Fixed to Green */}
                <div className="h-1 bg-green-500 w-full shadow-[0_0_5px_rgba(34,197,94,0.3)]"></div>
                <div className="flex-1 bg-[#1e293b] p-3 relative text-white flex justify-between items-center">
                    <div className="flex flex-col justify-end h-full w-1/3">
                        <div className="mb-3"><SigmaLogo width={30} height={45} className="drop-shadow-lg" /></div>
                        <div className="text-[7px] font-bold text-gray-400">APFC UCX - 5X</div>
                    </div>
                    <div className="w-1/2 h-full flex items-center justify-end relative">
                        <div className="grid grid-cols-2 gap-2.5 transform translate-x-1">
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95"><ChevronsLeft className="text-black w-3 h-3" /></div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95"><ArrowUp className="text-black w-3 h-3" /></div>
                            <div className="col-span-2 flex justify-center"><div className="w-8 h-7 border border-white/30 text-white rounded text-[6px] font-bold shadow-sm hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer active:scale-95">PRG.</div></div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center text-[6px] font-bold text-black hover:bg-white transition-colors cursor-pointer active:scale-95">MODE</div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95"><ArrowDown className="text-black w-3 h-3" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UcxFaceplate: React.FC<UcxFaceplateProps> = ({ view = 'front' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    // Fixed: Set initial rotation to y: 0 for a straight forward-facing presentation
    const [rotation, setRotation] = useState({ x: -10, y: 0 });

    useEffect(() => {
        // Fixed: Ensure front view sets y: 0 for straight alignment
        if (view === 'front') setRotation({ x: 5, y: -10 });
        else if (view === 'back') setRotation({ x: 0, y: 180 });
        else if (view === 'side') setRotation({ x: 0, y: -90 });
    }, [view]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (view !== 'front' || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5);
        const yPct = (y / rect.height - 0.5);
        setRotation({ x: -yPct * 30, y: xPct * 30 });
    };

    // Fixed: Reset to straight front view on mouse leave
    const handleMouseLeave = () => { if (view === 'front') setRotation({ x: -10, y: 0 }); };

    const bezelSize = 330;
    const bodySize = 290;
    const offset = (bezelSize - bodySize) / 4;
    const depth = 140;

    return (
        <div
            ref={containerRef}
            className={`relative w-[320px] h-[320px] mx-auto z-10 ${view === 'front' ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
        >
            <div
                className="w-full h-full relative transition-transform duration-700 ease-in-out"
                style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
                <div className="absolute inset-0 backface-hidden z-20" style={{ transform: `translateZ(${depth / 2}px)` }}><FrontPanelContent /></div>
                <div className="absolute bg-[#2b2b2b] border border-gray-700 flex flex-col items-center" style={{ width: bodySize, height: bodySize, top: offset, left: offset, transform: `rotateY(180deg) translateZ(${depth / 2}px)` }}>
                    <div className="w-full flex justify-end px-4 pt-3 pb-1">
                        <div className="w-[80px] h-[28px] bg-[#00b359] rounded-sm border-b-4 border-[#008040] shadow-md"></div>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-10 uppercase tracking-tighter">REAR TERMINALS</div>
                </div>
                <div className="absolute bg-[#1a1a1a] border border-gray-800" style={{ width: depth, height: bodySize, top: offset, left: (bezelSize - depth) / 2 + offset, transform: `rotateY(90deg) translateZ(${bodySize / 2}px)` }}></div>
                <div className="absolute bg-[#1a1a1a] border border-gray-800" style={{ width: depth, height: bodySize, top: offset, left: (bezelSize - depth) / 2 - offset, transform: `rotateY(-90deg) translateZ(${bodySize / 2}px)` }}></div>
            </div>
        </div>
    );
};

export default UcxFaceplate;
