
import React from 'react';
import SigmaLogo from './sigmaLogo';

const UcxBackFaceplate: React.FC = () => {
    // Helper to render the "screw" terminal icons seen on the diagram
    const ScrewTerminal = () => (
        <div className="w-2.5 h-2.5 rounded-full border border-slate-600 flex items-center justify-center bg-slate-100">
            <div className="w-[1px] h-1.5 bg-slate-600 rotate-45"></div>
            <div className="w-[1px] h-1.5 bg-slate-600 -rotate-45 absolute"></div>
        </div>
    );

    return (
        <div className="w-full h-full bg-[#1a1a1a] rounded-xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl p-1 border-2 border-slate-800">

            {/* Top Green Terminal - Left (Relay Connection) - Moved down by 5% and shifted right for better connection */}
            <div className="absolute top-[5%] left-[17%] z-30">
                <div className="bg-[#00b359] px-2 py-1 rounded-sm border-b-4 border-[#008040] shadow-md flex gap-1.5 ring-1 ring-black/20">
                    {['R13', 'R14', 'R15', 'R16'].map((label) => (
                        <div key={label} className="flex flex-col items-center">
                            <span className="text-[5px] text-white font-bold">{label}</span>
                            <div className="w-2 h-2 bg-[#1a4d33] rounded-full border border-[#004d26] shadow-inner"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Green Terminal - Right (S1 S2 R N) - Moved down by 5% */}
            <div className="absolute top-[5%] right-[8%] z-30">
                <div className="bg-[#00b359] px-2 py-1 rounded-sm border-b-4 border-[#008040] shadow-md flex gap-2 ring-1 ring-black/20">
                    {['S1', 'S2', 'R', 'N'].map((label) => (
                        <div key={label} className="flex flex-col items-center">
                            <span className="text-[6px] text-white font-bold">{label}</span>
                            <div className="w-2.5 h-2.5 bg-[#1a4d33] rounded-full border border-[#004d26] shadow-inner"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Label Sticker - Centered vertically between the moved terminals */}
            <div className="w-[94%] h-[70%] bg-[#f1f5f9] border border-slate-400 rounded-sm p-3 text-slate-900 font-sans relative flex flex-col">

                {/* Header Section (U1 & U2 Wiring) */}
                <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col items-center">
                        <span className="text-[6px] font-bold mb-1 italic">U1</span>
                        <div className="flex gap-1 items-center">
                            <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal />
                        </div>
                        <div className="flex gap-1 mt-0.5">
                            {['R9', 'R10', 'R11', 'R12'].map(r => <span key={r} className="text-[4px] font-bold w-2.5 text-center">{r}</span>)}
                        </div>
                    </div>

                    {/* Fuse/Coil Symbol */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-4 w-8 h-3 border border-slate-800 flex items-center justify-center">
                        <svg viewBox="0 0 40 10" className="w-full h-full">
                            <path d="M0 5 H15 L17.5 2 L22.5 8 L25 5 H40" stroke="currentColor" fill="none" strokeWidth="0.5" />
                        </svg>
                    </div>

                    <div className="flex flex-col items-center">
                        <span className="text-[6px] font-bold mb-1 italic">U2</span>
                        <div className="flex gap-1 items-center">
                            <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal />
                        </div>
                        <div className="flex gap-1 mt-0.5 text-[4px] font-bold">
                            <span className="w-2.5 text-center">S1</span>
                            <span className="w-2.5 text-center">S2</span>
                            <span className="w-2.5 text-center">L1</span>
                            <span className="w-2.5 text-center">N</span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 flex mt-4">
                    <div className="w-1/2 border-r border-slate-300 pr-2">
                        <div className="flex items-center gap-1 mb-1">
                            <div className="w-3.5 h-3.5 bg-[#C41E3A] flex items-center justify-center rounded-sm">
                                <SigmaLogo width={10} height={10} />
                            </div>
                            <span className="text-[8px] font-black tracking-tight">SIGMA IC</span>
                        </div>
                        <div className="text-[5px] font-bold text-slate-700 mb-2 italic">Active Power Factor Controller</div>
                        <div className="bg-slate-100 p-1 border border-slate-200 rounded-sm">
                            <div className="flex items-start gap-1">
                                <span className="text-[6px]">⚠</span>
                                <div className="text-[3.5px] font-medium leading-tight">
                                    <span className="font-bold block mb-0.5">Caution:</span>
                                    CT short linked before disconnection.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Serial Number Box */}
                    <div className="w-1/2 pl-2 pt-1">
                        <div className="bg-white border border-slate-400 rounded p-1 h-[40px] flex flex-col shadow-inner">
                            <span className="text-[5px] font-black uppercase mb-0.5">Serial No:</span>
                            <span className="text-blue-900 font-mono text-[8px] font-bold mt-auto border-b border-dashed border-slate-200">
                                WAX16-8942
                            </span>
                        </div>
                        <div className="mt-2 text-right opacity-60">
                            <span className="text-[4px] font-bold text-slate-500">220VAC / 50Hz</span>
                        </div>
                    </div>
                </div>

                {/* Bottom Section (U3 & U4 Wiring) */}
                <div className="mt-auto flex justify-between items-end pb-2">
                    <div className="flex flex-col items-center">
                        <div className="flex gap-1 mb-0.5 text-[4px] font-bold">
                            {['R1', 'R2', 'R3', 'R4'].map(r => <span key={r} className="w-2.5 text-center">{r}</span>)}
                        </div>
                        <div className="flex gap-1 items-center">
                            <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal />
                        </div>
                        <span className="text-[6px] font-bold mt-0.5 italic">U3</span>
                    </div>

                    <div className="mb-1 flex flex-col items-center opacity-40">
                        <div className="text-[3px] font-mono mb-1">www.sigmaic.com</div>
                        <div className="text-[4px] font-bold uppercase tracking-widest border-t border-slate-300 pt-1">EXPANSION BUS</div>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex gap-1 mb-0.5 text-[4px] font-bold">
                            {['R5', 'R6', 'R7', 'R8'].map(r => <span key={r} className="w-2.5 text-center">{r}</span>)}
                        </div>
                        <div className="flex gap-1 items-center">
                            <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal /> <ScrewTerminal />
                        </div>
                        <span className="text-[6px] font-bold mt-0.5 italic">U4</span>
                    </div>
                </div>
            </div>

            {/* Bottom Connectors Section - Moved up by 5% to look inserted into the panel */}
            <div className="absolute bottom-[5%] left-0 right-0 px-[12%] flex justify-between items-end z-30">
                {/* Left Green Block (1-4) */}
                <div className="bg-[#00b359] px-2 py-1 rounded-sm border-t-4 border-[#008040] shadow-md flex gap-2 ring-1 ring-black/20">
                    {[1, 2, 3, 4].map(n => (
                        <div key={n} className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-[#1a4d33] rounded-full border border-[#004d26] shadow-inner"></div>
                            <span className="text-[6px] text-white font-bold">{n}</span>
                        </div>
                    ))}
                </div>

                {/* Center White Box 2-Pole Terminal */}
                <div className="bg-white border border-slate-300 rounded shadow-md flex flex-col items-center w-[60px]">
                    <div className="grid grid-cols-5 gap-0 px-1 py-0.5 bg-slate-50 border border-slate-200 rounded-sm">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="w-1.5 h-1.5 bg-slate-100 border border-slate-300 shadow-inner flex items-center justify-center">
                                <div className="w-0.5 h-0.5 bg-slate-400 rounded-full"></div>
                            </div>
                        ))}
                    </div>
                    <span className="text-[3px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">10P COMM</span>
                </div>

                {/* Right Green Block (5-8) */}
                <div className="bg-[#00b359] px-2 py-1 rounded-sm border-t-4 border-[#008040] shadow-md flex gap-2 ring-1 ring-black/20">
                    {[5, 6, 7, 8].map(n => (
                        <div key={n} className="flex flex-col items-center">
                            <div className="w-2 h-2 bg-[#1a4d33] rounded-full border border-[#004d26] shadow-inner"></div>
                            <span className="text-[6px] text-white font-bold">{n}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UcxBackFaceplate;
