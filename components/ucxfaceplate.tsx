
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, ChevronsLeft, Leaf } from './Icons';
import SigmaLogo from './sigmaLogo';
import UcxBackFaceplate from './ucxbackfaceplate';

interface UcxFaceplateProps {
    view?: 'front' | 'back' | 'side';
}

/**
 * 7-Segment Digit Component
 */
const SevenSegmentDigit: React.FC<{ value: string; size?: number }> = ({ value, size = 30 }) => {
    const activeColor = "#ef4444"; // Red
    const inactiveColor = "#3f1a1a"; // Dark Red/Brown

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
        // Protective Outer Case (Matte Black Bezel) - 320px
        <div className="w-full h-full bg-[#121212] p-2 rounded-xl border-[4px] border-[#1a1a1a] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">

            {/* Inner Panel */}
            <div className="w-full h-full flex flex-col relative select-none bg-white rounded-lg overflow-hidden shadow-2xl ring-1 ring-black/50">
                <div className="absolute inset-0 border border-white/40 pointer-events-none z-20 rounded-sm"></div>

                {/* --- TOP HALF --- */}
                <div className="h-[54%] bg-[#eef2f6] p-3 relative flex">

                    {/* Left: Relay LEDs */}
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

                    {/* Right: Displays */}
                    <div className="w-1/2 flex flex-col items-end relative">

                        {/* Parameter Indicators */}
                        <div className="flex gap-3 mb-2 mt-1 mr-1">
                            {['VOLT', 'AMP', 'KW', 'KVAR'].map((label, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <div className={`w-1.5 h-1.5 rounded-full mb-1 ${i === 0 ? 'bg-red-500 shadow-[0_0_4px_red]' : 'bg-gray-300'}`}></div>
                                    <span className="text-[4px] font-bold text-gray-600">{label}</span>
                                </div>
                            ))}
                        </div>

                        {/* 7-Segment (Red) */}
                        <div className="bg-[#2a1a1a] px-3.5 py-1.5 rounded border border-gray-400 mb-1.5 flex items-center justify-center gap-0.5 shadow-inner relative mr-8">
                            <div className="absolute inset-0 bg-red-500/5 blur-sm"></div>
                            <SevenSegmentDigit value="-" size={24} />
                            <SevenSegmentDigit value="P" size={24} />
                            <SevenSegmentDigit value="F" size={24} />
                        </div>
                        <div className="text-[6px] font-bold text-gray-600 text-right w-full pr-10 mb-1">STATUS</div>

                        {/* OLED - Width */}
                        <div className="w-20 h-12 bg-black rounded border border-gray-600 relative overflow-hidden flex flex-col p-1 shadow-[0_0_10px_rgba(6,182,212,0.15)] mr-7">
                            <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
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
                                    <span className="text-[5px] text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">0.000</span>
                                    <span className="text-[4px] text-gray-400">kW</span>
                                    <span className="text-[5px] text-cyan-400 drop-shadow-[0_0_3px_rgba(34,211,238,0.8)]">0.002</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-auto text-[4px] text-gray-300">
                                <span>1.00c</span>
                                <span>~</span>
                            </div>
                        </div>

                        {/* Status LAG LEAD LEDs */}
                        <div className="absolute left-0 top-24 flex flex-col gap-2 items-center w-8">
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_red]"></div>
                                <span className="text-[4px] font-bold text-gray-500 text-center leading-tight">LAG</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                <span className="text-[4px] font-bold text-gray-500 text-center leading-tight">LEAD</span>
                            </div>
                        </div>

                        {/* Status LEDs */}
                        <div className="absolute right-50 top-24 flex flex-col gap-2 items-center w-8">
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_6px_red]"></div>
                                <span className="text-[4px] font-bold text-gray-500 text-center leading-tight">PF-OK</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                                <span className="text-[4px] font-bold text-gray-500 text-center leading-tight">MANUAL</span>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="h-1 bg-green-500 w-full"></div>

                {/* --- BOTTOM HALF --- */}
                <div className="flex-1 bg-[#1e293b] p-3 relative text-white flex justify-between items-center">
                    <div className="flex flex-col justify-end h-full w-1/3">
                        <div className="mb-3">
                            <SigmaLogo width={30} height={45} className="drop-shadow-lg" />
                        </div>
                        <div className="text-[5px] text-gray-400 flex flex-col gap-0.5 mb-1">
                            <div className="flex items-center gap-1"><div className="w-1 h-1 bg-red-900 rounded-full"></div> KVARH</div>
                            <div className="flex items-center gap-1"><div className="w-1 h-1 bg-red-900 rounded-full"></div> KWH</div>
                        </div>
                        <div className="text-[7px] font-bold text-gray-400">APFC UCX - 5X</div>
                    </div>

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 opacity-20">
                        <svg viewBox="0 0 100 40" fill="none" stroke="white" strokeWidth="2">
                            <path d="M0 20 Q 12.5 5, 25 20 T 50 20 T 75 20 T 100 20" />
                            <path d="M0 20 Q 12.5 35, 25 20 T 50 20 T 75 20 T 100 20" strokeOpacity="0.5" />
                        </svg>
                    </div>

                    <div className="w-1/2 h-full flex items-center justify-end relative">
                        <div className="grid grid-cols-2 gap-2.5 transform translate-x-1">
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95">
                                <ChevronsLeft className="text-black w-3 h-3" />
                            </div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95">
                                <ArrowUp className="text-black w-3 h-3" />
                            </div>
                            <div className="col-span-2 flex justify-center">
                                <div className="w-8 h-7 border border-white/30 text-white rounded text-[6px] font-bold shadow-sm hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer active:scale-95">PRG.</div>
                            </div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center text-[6px] font-bold text-black hover:bg-white transition-colors cursor-pointer active:scale-95">MODE</div>
                            <div className="w-8 h-7 bg-gray-200 rounded shadow-[0_2px_0_#9ca3af] flex items-center justify-center hover:bg-white transition-colors cursor-pointer active:scale-95">
                                <ArrowDown className="text-black w-3 h-3" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const UcxFaceplate: React.FC<UcxFaceplateProps> = ({ view = 'front' }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotation, setRotation] = useState({ x: 5, y: -10 });

    useEffect(() => {
        if (view === 'front') setRotation({ x: 5, y: -10 });
        else if (view === 'back') setRotation({ x: 0, y: 180 });
        else if (view === 'side') setRotation({ x: 0, y: -90 });
        else setRotation({ x: -10, y: 25 });
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

    const handleMouseLeave = () => { if (view === 'front') setRotation({ x: -10, y: 25 }); };

    // --- DIMENSIONS & ALIGNMENT ---
    const containerSize = 320;
    const bodySize = 290; // The rear chassis size
    const offset = (containerSize - bodySize) / 2; // 20px centering offset
    const depth = 150; // Depth of the chassis

    return (
        <div
            ref={containerRef}
            className={`relative w-[320px] h-[320px] perspective-1000 mx-auto z-10 ${view === 'front' ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1200px' }}
        >
            <div
                className="w-full h-full relative transition-transform duration-700 ease-in-out"
                style={{ transformStyle: 'preserve-3d', transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
            >
                {/* FRONT BEZEL (320x320) */}
                <div className="absolute inset-0 backface-hidden z-20" style={{ transform: `translateZ(${depth / 1.8}px)` }}>
                    <FrontPanelContent />
                </div>

                {/* BACK PANEL (280x280) */}
                <div className="absolute backface-hidden"
                    style={{
                        width: bodySize,
                        height: bodySize,
                        top: offset,
                        left: offset,
                        transform: `rotateY(180deg) translateZ(${depth / 2}px)`
                    }}>
                    <UcxBackFaceplate />
                </div>

                {/* RIGHT SIDE (Depth x BodySize) */}
                <div className="absolute bg-[#1a1a1a] border border-gray-800"
                    style={{
                        width: depth,
                        height: bodySize,
                        top: offset,
                        left: (containerSize - depth) / 2,
                        transform: `rotateY(90deg) translateZ(${bodySize / 2}px)`
                    }}>
                    <div className="w-full h-full flex flex-col gap-2 p-4 justify-center">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-1.5 w-full bg-black rounded-full shadow-inner border-b border-gray-700"></div>)}
                    </div>
                </div>

                {/* LEFT SIDE (Depth x BodySize) */}
                <div className="absolute bg-[#1a1a1a] border border-gray-800"
                    style={{
                        width: depth,
                        height: bodySize,
                        top: offset,
                        left: (containerSize - depth) / 2,
                        transform: `rotateY(-90deg) translateZ(${bodySize / 2}px)`
                    }}>
                    <div className="w-full h-full flex flex-col gap-2 p-4 justify-center">
                        {[...Array(6)].map((_, i) => <div key={i} className="h-1.5 w-full bg-black rounded-full shadow-inner border-b border-gray-700"></div>)}
                    </div>
                </div>

                {/* TOP SIDE (BodySize x Depth) */}
                <div className="absolute bg-[#1a1a1a] border border-gray-800"
                    style={{
                        width: bodySize,
                        height: depth,
                        left: offset,
                        top: (containerSize - depth) / 2,
                        transform: `rotateX(90deg) translateZ(${bodySize / 2}px)`
                    }}>
                    <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-950"></div>
                </div>

                {/* BOTTOM SIDE (BodySize x Depth) */}
                <div className="absolute bg-[#1a1a1a] border border-gray-800"
                    style={{
                        width: bodySize,
                        height: depth,
                        left: offset,
                        top: (containerSize - depth) / 2,
                        transform: `rotateX(-90deg) translateZ(${bodySize / 2}px)`
                    }}>
                    <div className="w-full h-full bg-gradient-to-t from-gray-800 to-gray-950"></div>
                </div>

                {/* REAR OF BEZEL FILLER (To prevent hollow shell look) */}
                <div className="absolute inset-0 bg-[#0a0a0a] pointer-events-none" style={{ transform: `translateZ(${depth / 2 - 1}px)` }}></div>
            </div>
        </div>
    );
};

export default UcxFaceplate;
