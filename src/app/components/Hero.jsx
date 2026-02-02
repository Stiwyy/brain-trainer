"use client";

import React from "react";
import {motion} from "framer-motion";
import {Activity, ArrowRight} from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
            <div className="container mx-auto px-4 relative z-10 text-center">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8, ease: "easeOut"}}
                >
                    <span
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 mb-6 backdrop-blur-sm">
            <Activity className="w-4 h-4 text-emerald-400"/>
            <span>Next-Gen Cognitive Training</span>
          </span>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Unlock Your <br/>
                        <span
                            className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Mental Potential
            </span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 mb-10 leading-relaxed">
                        A scientifically designed suite of games to enhance memory, focus, and processing speed.
                        Track your progress and push your cognitive limits.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            className="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-semibold transition-all hover:bg-slate-200 hover:scale-105 active:scale-95">
                            Start Training
                            <ArrowRight
                                className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1"/>
                        </button>
                        <button
                            className="px-8 py-4 text-white rounded-full font-medium border border-white/10 hover:bg-white/5 transition-all">
                            View Leaderboard
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse"/>
                <div
                    className="absolute top-40 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl mix-blend-screen animate-pulse delay-1000"/>
            </div>
        </div>
    );
}