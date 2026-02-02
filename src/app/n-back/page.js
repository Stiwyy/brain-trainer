"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import NBackGame from "../components/nback/NBackGame";

export default function NBackPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-emerald-500/30 text-white relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[70%] h-[70%] bg-emerald-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px]" />
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                        N-Back
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        The gold standard for working memory training. Remember the sequence and find the matches.
                    </p>
                </div>

                <NBackGame />

                <div className="mt-12 max-w-2xl mx-auto p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4 text-emerald-400 font-semibold">
                        <Info className="w-5 h-5" />
                        <span>How to Play</span>
                    </div>
                    <ul className="space-y-3 text-slate-400 text-sm list-disc pl-5">
                        <li>
                            <strong>1-Back:</strong> Press match if the square is in the <em>same</em> spot as the previous turn.
                        </li>
                        <li>
                            <strong>2-Back:</strong> Press match if the square is in the same spot as <em>2 turns ago</em> (skipping the one in between).
                        </li>
                        <li>
                            If you miss a match, it counts as a mistake. If you press match when there isn't one, it also counts as a mistake.
                        </li>
                    </ul>
                </div>

            </div>
        </main>
    );
}