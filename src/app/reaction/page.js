"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import ReactionGame from "../components/reaction/ReactionGame";

export default function ReactionPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-amber-500/30 text-white relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

           <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-orange-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-8">

                <nav className="flex items-center mb-12">
                    <Link
                        href="/"
                        className="flex items-center text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
                        Reaction Time
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Test your visual reflexes. Click as soon as the color changes.
                    </p>
                </div>

                <ReactionGame />

                <div className="mt-8 max-w-2xl mx-auto flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5 text-slate-400 text-sm">
                    <Info className="w-5 h-5 flex-shrink-0 text-amber-500/50 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-semibold text-slate-300">Why is my score higher than expected?</p>
                        <p>
                            This test measures the <strong>total system latency</strong>. This includes your own reaction time + your monitor's input lag (10-40ms) + browser rendering time.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}