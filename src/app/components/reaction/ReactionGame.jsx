"use client";

import React, { useState, useRef } from "react";
import { Zap, RotateCcw, Play, History, MousePointer2, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

export default function ReactionGame() {
    const [gameState, setGameState] = useState("idle");
    const [reactionTime, setReactionTime] = useState(null);
    const [attempts, setAttempts] = useState([]);

    const boardRef = useRef(null);
    const startTimeRef = useRef(0);
    const timeoutRef = useRef(null);

    const COLORS = {
        idle: "#1e293b",
        waiting: "#e11d48",
        ready: "#10b981",
        early: "#f59e0b",
    };

    const startWaiting = () => {
        setGameState("waiting");
        setReactionTime(null);

        if (boardRef.current) {
            boardRef.current.style.backgroundColor = COLORS.waiting;
            boardRef.current.style.cursor = "wait";
        }

        const delay = Math.floor(Math.random() * 3000) + 2000;

        timeoutRef.current = setTimeout(() => {
            requestAnimationFrame(() => {
                if (boardRef.current) {
                    boardRef.current.style.backgroundColor = COLORS.ready;
                    boardRef.current.style.cursor = "pointer";
                    startTimeRef.current = performance.now();
                    boardRef.current.dataset.status = "ready";
                }
            });
        }, delay);
    };

    const handlePointerDown = () => {
        const clickTime = performance.now();
        const currentStatus = boardRef.current?.dataset.status;

        if (gameState === "waiting") {
            clearTimeout(timeoutRef.current);
            setGameState("early");
            if (boardRef.current) {
                boardRef.current.style.backgroundColor = COLORS.early;
                boardRef.current.dataset.status = "idle";
            }
            return;
        }

        if (gameState === "ready" && currentStatus === "ready") {
            const timeDiff = clickTime - startTimeRef.current;
            const finalTime = Math.max(0, Math.round(timeDiff));

            setReactionTime(finalTime);
            setAttempts((prev) => [...prev, finalTime]);
            setGameState("result");

            if (boardRef.current) {
                boardRef.current.style.backgroundColor = COLORS.idle;
                boardRef.current.dataset.status = "idle";
            }
            return;
        }

        if (gameState === "idle" || gameState === "result" || gameState === "early") {
            startWaiting();
        }
    };

    const resetGame = (e) => {
        e.stopPropagation();
        setGameState("idle");
        setAttempts([]);
        setReactionTime(null);
        clearTimeout(timeoutRef.current);
        if (boardRef.current) {
            boardRef.current.style.backgroundColor = COLORS.idle;
            boardRef.current.dataset.status = "idle";
        }
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
                    <button onClick={resetGame} className="w-full md:w-auto h-full px-6 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset</span>
                    </button>
                </div>
            </div>

            <div
                ref={boardRef}
                onPointerDown={handlePointerDown}
                className={cn(
                    "relative w-full aspect-[4/3] md:aspect-video rounded-3xl shadow-2xl overflow-hidden cursor-pointer select-none touch-manipulation",
                    "border-4 border-white/5 transition-none",
                    gameState === "idle" ? "bg-slate-800" : ""
                )}
                style={{ WebkitTapHighlightColor: "transparent" }}
            >

                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

                    {gameState === "idle" && (
                        <div className="text-center p-8">
                            <Zap className="w-20 h-20 text-amber-400 mb-6 mx-auto" />
                            <h2 className="text-3xl font-bold text-white mb-2">Reaction Time</h2>
                            <p className="text-slate-400 mb-8 text-lg">Click anywhere to start.</p>
                            <div className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg inline-flex items-center gap-2 mx-auto">
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start Test
                            </div>
                        </div>
                    )}

                    {gameState === "waiting" && (
                        <div className="text-center animate-pulse">
                            <span className="text-8xl font-black text-white/50">...</span>
                        </div>
                    )}

                    {gameState === "early" && (
                        <div className="text-center">
                            <AlertCircle className="w-20 h-20 text-white mb-4 mx-auto" />
                            <h2 className="text-4xl font-bold text-white mb-4">Too Early!</h2>
                            <div className="px-8 py-3 bg-white/20 text-white rounded-full font-semibold">
                                Click to Try Again
                            </div>
                        </div>
                    )}

                    {gameState === "result" && (
                        <div className="text-center">
                            <div className="text-slate-400 text-sm uppercase font-bold mb-2">Reaction Time</div>
                            <div className="text-8xl font-mono font-bold text-white mb-8">{reactionTime}ms</div>
                            <div className="px-10 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg shadow-lg shadow-emerald-500/20 inline-block">
                                Click to Try Again
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}