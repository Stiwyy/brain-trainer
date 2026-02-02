"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Eye, Volume2, Keyboard } from "lucide-react";
import NBackGame from "../components/nback/NBackGame";

export default function NBackPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-emerald-500/30 text-white relative pb-20">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[70%] h-[70%] bg-emerald-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-8">

                <nav className="flex items-center mb-8">
                    <Link
                        href="/"
                        className="flex items-center text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                </nav>

                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
                        Dual N-Back
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg">
                        The gold standard for working memory training. <br/>
                        Track sound and position simultaneously.
                    </p>
                </div>

                {/* The Game Component */}
                <NBackGame />

                {/* --- IMPROVED EXPLANATION SECTION --- */}
                <div className="mt-24 max-w-4xl mx-auto">

                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                            <Brain className="w-6 h-6 text-emerald-400" />
                            How to Play
                        </h2>
                        <p className="text-slate-400">
                            The goal is to decide if the current stimulus matches the one from <strong>2 steps ago</strong>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Visual Explanation */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4 text-emerald-400">
                                <Eye className="w-6 h-6" />
                                <h3 className="text-xl font-bold text-white">Position Task</h3>
                            </div>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                A square will appear on the grid. Remember its position. If the square appears in the <strong>same spot</strong> as it did 2 turns ago, it's a match.
                            </p>
                            <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-center border border-white/5">
                                <div className="flex justify-center gap-2 text-slate-500 mb-2 text-xs uppercase tracking-widest">Example Sequence</div>
                                <div className="flex justify-center items-center gap-2">
                                    <span className="opacity-50">Top-Left</span>
                                    <span>→</span>
                                    <span className="opacity-50">Center</span>
                                    <span>→</span>
                                    <span className="text-emerald-400 font-bold border-b-2 border-emerald-400">Top-Left</span>
                                </div>
                                <div className="mt-2 text-emerald-400 text-xs font-bold">MATCH!</div>
                            </div>
                        </div>

                        {/* Audio Explanation */}
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <Volume2 className="w-6 h-6" />
                                <h3 className="text-xl font-bold text-white">Audio Task</h3>
                            </div>
                            <p className="text-slate-300 mb-6 leading-relaxed">
                                You will hear a letter spoken. If the <strong>current letter</strong> is the same as the one spoken 2 turns ago, it's a match.
                            </p>
                            <div className="bg-black/20 rounded-xl p-4 font-mono text-sm text-center border border-white/5">
                                <div className="flex justify-center gap-2 text-slate-500 mb-2 text-xs uppercase tracking-widest">Example Sequence</div>
                                <div className="flex justify-center items-center gap-4">
                                    <span className="opacity-50">"A"</span>
                                    <span>→</span>
                                    <span className="opacity-50">"K"</span>
                                    <span>→</span>
                                    <span className="text-blue-400 font-bold border-b-2 border-blue-400">"A"</span>
                                </div>
                                <div className="mt-2 text-blue-400 text-xs font-bold">MATCH!</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Footer */}
                    <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/5 rounded-xl">
                                <Keyboard className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Pro Tip: Use Keyboard</h4>
                                <p className="text-slate-400 text-sm">It's faster than clicking.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                                <span className="font-bold text-white">L</span>
                                <span className="text-slate-500 text-sm">for Position</span>
                            </div>
                            <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-lg border border-white/5">
                                <span className="font-bold text-white">A</span>
                                <span className="text-slate-500 text-sm">for Audio</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}