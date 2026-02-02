"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Zap } from "lucide-react";
import ArithmeticGame from "../components/arithmetic/ArithmeticGame";

export default function ArithmeticPage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-amber-500/30 text-white relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-amber-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[120px]" />
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
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-red-500">
                        Mental Arithmetic
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Sudden Death Mode. Solve fast or lose.
                    </p>
                </div>

                <ArithmeticGame />

                <div className="mt-12 max-w-2xl mx-auto flex items-start gap-4 p-6 bg-white/5 border border-white/5 rounded-2xl">
                    <div className="p-3 bg-red-500/20 rounded-xl">
                        <Zap className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white mb-2">Rules</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            You start with 10 seconds. Every correct answer refills your timer, but the maximum time <strong>decreases</strong>. One wrong answer or running out of time ends the run immediately.
                        </p>
                    </div>
                </div>

            </div>
        </main>
    );
}