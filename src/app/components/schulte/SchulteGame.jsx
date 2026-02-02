"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Play, Trophy, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

const GRID_SIZES = [
    { size: 3, label: "3x3", difficulty: "Easy" },
    { size: 4, label: "4x4", difficulty: "Medium" },
    { size: 5, label: "5x5", difficulty: "Standard" },
    { size: 6, label: "6x6", difficulty: "Hard" },
    { size: 7, label: "7x7", difficulty: "Expert" },
];

export default function SchulteGame() {
    const [gridSize, setGridSize] = useState(5);
    const [numbers, setNumbers] = useState([]);
    const [currentNumber, setCurrentNumber] = useState(1);
    const [gameState, setGameState] = useState("idle");
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [time, setTime] = useState(0);
    const [misclicks, setMisclicks] = useState(0);

    const [shakingId, setShakingId] = useState(null);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, startTime]);

    const prepareGame = () => {
        const totalNumbers = gridSize * gridSize;
        const nums = Array.from({ length: totalNumbers }, (_, i) => i + 1);

        for (let i = nums.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [nums[i], nums[j]] = [nums[j], nums[i]];
        }

        setNumbers(nums);
        setCurrentNumber(1);
        setMisclicks(0);
        setTime(0);
        setIsTimerRunning(false);
        setGameState("playing");
    };

    const handleNumberClick = (num) => {
        if (gameState !== "playing") return;

        if (num === 1 && currentNumber === 1) {
            setStartTime(Date.now());
            setIsTimerRunning(true);
            setCurrentNumber(2);
            return;
        }

        if (num === currentNumber) {
            if (currentNumber === gridSize * gridSize) {
                setIsTimerRunning(false);
                setGameState("won");
            } else {
                setCurrentNumber((prev) => prev + 1);
            }
        } else if (num > currentNumber) {
            setMisclicks((prev) => prev + 1);

            setShakingId(num);
            setTimeout(() => setShakingId(null), 500);
        }
    };

    const resetGame = () => {
        setGameState("idle");
        setTime(0);
        setCurrentNumber(1);
        setIsTimerRunning(false);
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        return `${seconds}.${milliseconds.toString().padStart(2, "0")}`;
    };

    const gridColsClass = {
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        7: "grid-cols-7",
    }[gridSize];

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 pb-12">
            <div className="w-full max-w-[600px] mb-8">
                <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center w-full p-5 sm:p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                    <div>
                        <div className="text-slate-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                            Target
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                            <span
                                className={cn(
                                    "transition-colors",
                                    isTimerRunning ? "text-emerald-400" : "text-white"
                                )}
                            >
                                {gameState === "playing" && !isTimerRunning ? "1" : currentNumber}
                            </span>
                            <span className="text-slate-600 text-base sm:text-lg">/ {gridSize * gridSize}</span>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto text-left sm:text-center">
                        <div className="text-slate-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                            Time
                        </div>
                        <div className="text-3xl sm:text-4xl font-mono font-bold text-white w-full text-center">
                            {formatTime(time)}
                            <span className="text-xs sm:text-sm text-slate-500">s</span>
                        </div>
                    </div>

                    <div className="text-right">
                        <button
                            onClick={resetGame}
                            className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        >
                            <RotateCcw className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative w-full aspect-square max-w-[600px] bg-slate-900/50 rounded-3xl border border-white/5 p-4 md:p-6 shadow-2xl overflow-hidden">
                <AnimatePresence mode="wait">
                    {gameState === "idle" && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-6"
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Select Grid Size</h2>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 sm:mb-10 w-full max-w-md">
                                {GRID_SIZES.map((option) => (
                                    <button
                                        key={option.size}
                                        onClick={() => setGridSize(option.size)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all duration-200 text-sm sm:text-base",
                                            gridSize === option.size
                                                ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                                                : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20"
                                        )}
                                    >
                                        <span className="text-lg sm:text-xl font-bold">{option.label}</span>
                                        <span className="text-[10px] uppercase opacity-70 mt-1">{option.difficulty}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={prepareGame}
                                className="group relative px-8 sm:px-10 py-3 sm:py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start Game
                            </button>
                        </motion.div>
                    )}

                    {gameState === "won" && (
                        <motion.div
                            key="won"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-6 sm:p-8 text-center"
                        >
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-5 sm:mb-6">
                                <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Excellent!</h2>
                            <p className="text-slate-400 mb-6 sm:mb-8">Grid {gridSize}x{gridSize} Completed</p>

                            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-sm mb-8 sm:mb-10">
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="text-slate-500 text-[11px] sm:text-xs uppercase font-bold mb-1">Final Time</div>
                                    <div className="text-xl sm:text-2xl font-mono font-bold text-white">{formatTime(time)}s</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="text-slate-500 text-[11px] sm:text-xs uppercase font-bold mb-1">Misclicks</div>
                                    <div
                                        className={cn(
                                            "text-xl sm:text-2xl font-mono font-bold",
                                            misclicks === 0 ? "text-emerald-400" : "text-rose-400"
                                        )}
                                    >
                                        {misclicks}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={resetGame}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-500 transition-colors"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {gameState === "playing" && !isTimerRunning && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                        <div className="bg-indigo-600/90 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce">
                            Find 1 to start!
                        </div>
                    </div>
                )}

                <div className={cn("grid w-full h-full gap-2 sm:gap-3", gridColsClass)}>
                    {numbers.map((num) => {
                        const isFound = num < currentNumber;
                        const isShaking = shakingId === num;

                        return (
                            <motion.button
                                key={num}
                                layoutId={`num-${num}`}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={
                                    isShaking
                                        ? { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                                        : { opacity: 1, scale: 1 }
                                }
                                transition={{ duration: 0.3, delay: num * 0.005 }}
                                onClick={() => handleNumberClick(num)}
                                className={cn(
                                    "relative flex items-center justify-center rounded-xl text-lg sm:text-2xl lg:text-3xl font-bold transition-all duration-200 select-none",
                                    isShaking && "bg-red-500/50 border-red-500 text-white z-10",
                                    !isShaking && isFound && "bg-emerald-900/20 text-emerald-600/50 border-transparent shadow-none scale-95",
                                    !isShaking &&
                                    !isFound &&
                                    "bg-slate-800 text-slate-200 hover:bg-slate-700 active:scale-95 shadow-lg border border-white/5"
                                )}
                            >
                                {num}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 text-center max-w-md px-4">
                <h3 className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Instructions
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Focus on the center. Find 1 to start the timer, then click in ascending order as fast as possible.
                </p>
            </div>
        </div>
    );
}