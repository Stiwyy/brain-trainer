"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, RotateCcw, Play, History, MousePointer2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ReactionGame() {
    const [gameState, setGameState] = useState("idle");
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(null);
    const [attempts, setAttempts] = useState([]);

    const timeoutRef = useRef(null);

    const startWaiting = () => {
        setGameState("waiting");
        setReactionTime(null);

        const delay = Math.floor(Math.random() * 3000) + 2000;

        timeoutRef.current = setTimeout(() => {
            setStartTime(Date.now());
            setGameState("ready");
        }, delay);
    };

    const handleAreaClick = () => {
        if (gameState === "waiting") {
            clearTimeout(timeoutRef.current);
            setGameState("early");
        } else if (gameState === "ready") {
            const endTime = Date.now();
            const time = endTime - startTime;
            setReactionTime(time);
            setAttempts((prev) => [...prev, time]);
            setGameState("result");
        }
    };

    const resetGame = () => {
        setGameState("idle");
        setAttempts([]);
        setReactionTime(null);
        clearTimeout(timeoutRef.current);
    };

    const averageTime = attempts.length > 0
        ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
        : 0;

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Zap className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Latest</div>
                        <div className="text-xl font-mono font-bold text-white">
                            {reactionTime ? `${reactionTime}ms` : "-"}
                        </div>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <History className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Average</div>
                        <div className="text-xl font-mono font-bold text-white">
                            {averageTime > 0 ? `${averageTime}ms` : "-"}
                        </div>
                    </div>
                </div>

                <div className="col-span-2 md:col-span-1 flex justify-end">
                    <button
                        onClick={resetGame}
                        className="w-full md:w-auto h-full px-6 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset Stats</span>
                    </button>
                </div>
            </div>

            <div
                onMouseDown={handleAreaClick}
                className={cn(
                    "relative w-full aspect-[4/3] md:aspect-video rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-200 select-none touch-manipulation",

                    gameState === "idle" && "bg-slate-800 border-4 border-white/5 hover:border-white/10 hover:bg-slate-750",
                    gameState === "waiting" && "bg-rose-600 border-4 border-rose-500",
                    gameState === "ready" && "bg-emerald-500 border-4 border-emerald-400",
                    gameState === "early" && "bg-amber-500 border-4 border-amber-400",
                    gameState === "result" && "bg-slate-800 border-4 border-white/5"
                )}
            >
                <AnimatePresence mode="wait">

                    {gameState === "idle" && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
                        >
                            <Zap className="w-20 h-20 text-amber-400 mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-2">Reaction Time</h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                When the red box turns green, click as fast as you can.
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startWaiting();
                                }}
                                className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start Test
                            </button>
                        </motion.div>
                    )}

                    {gameState === "waiting" && (
                        <motion.div
                            key="waiting"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center"
                        >
                            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-4 animate-pulse">
                                <span className="text-4xl font-bold text-white">...</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white tracking-wider">WAIT FOR GREEN</h2>
                        </motion.div>
                    )}

                    {gameState === "ready" && (
                        <motion.div
                            key="ready"
                            initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center"
                        >
                            <MousePointer2 className="w-24 h-24 text-white mb-4 drop-shadow-md" />
                            <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-md">
                                CLICK!
                            </h2>
                        </motion.div>
                    )}

                    {gameState === "early" && (
                        <motion.div
                            key="early"
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-4"
                        >
                            <AlertCircle className="w-20 h-20 text-white mb-4 opacity-80" />
                            <h2 className="text-4xl font-bold text-white mb-2">Too Early!</h2>
                            <p className="text-white/80 text-lg mb-8">You clicked before the green light.</p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    startWaiting();
                                }}
                                className="px-8 py-3 bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full font-semibold hover:bg-white/30 transition-all"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {gameState === "result" && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                        >
                            <div className="text-slate-400 text-sm uppercase tracking-widest font-bold mb-2">Reaction Time</div>
                            <div className="text-6xl md:text-8xl font-mono font-bold text-white mb-8 tracking-tight">
                                {reactionTime}<span className="text-2xl md:text-3xl text-slate-500 ml-2">ms</span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        startWaiting();
                                    }}
                                    className="px-10 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    Try Again
                                </button>
                            </div>

                            <p className="mt-8 text-slate-500 text-sm">Click anywhere to restart</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            <div className="mt-8 text-center max-w-md text-slate-400 text-sm">
                <p>Tip: Average human reaction time is around 250ms. Can you beat 200ms?</p>
            </div>

        </div>
    );
}