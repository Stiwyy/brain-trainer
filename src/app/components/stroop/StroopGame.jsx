"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, Trophy, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const COLORS = [
    { name: "RED", hex: "#ef4444" },
    { name: "BLUE", hex: "#3b82f6" },
    { name: "GREEN", hex: "#22c55e" },
    { name: "YELLOW", hex: "#eab308" },
    { name: "PURPLE", hex: "#a855f7" },
    { name: "ORANGE", hex: "#f97316" },
];

const GAME_DURATION = 30;

export default function StroopGame() {
    const [gameState, setGameState] = useState("idle");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [currentChallenge, setCurrentChallenge] = useState(null);
    const [feedback, setFeedback] = useState(null);

    const timerRef = useRef(null);

    const generateChallenge = () => {
        const wordIndex = Math.floor(Math.random() * COLORS.length);
        const colorIndex = Math.floor(Math.random() * COLORS.length);

        return {
            word: COLORS[wordIndex].name,
            inkColor: COLORS[colorIndex].hex,
            inkName: COLORS[colorIndex].name
        };
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        setGameState("playing");
        setCurrentChallenge(generateChallenge());

        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = () => {
        clearInterval(timerRef.current);
        setGameState("won");
    };

    const handleAnswer = (selectedColorName) => {
        if (gameState !== "playing") return;

        if (selectedColorName === currentChallenge.inkName) {
            setScore((prev) => prev + 1);
            triggerFeedback("correct");
        } else {
            setScore((prev) => Math.max(0, prev - 1));
            triggerFeedback("wrong");
        }
    setCurrentChallenge(generateChallenge());
    };

    const triggerFeedback = (type) => {
        setFeedback(type);
        setTimeout(() => setFeedback(null), 300);
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

            <div className="flex justify-between items-center w-full mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Score</div>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">{score}</span>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Time Left</div>
                    <div className={cn(
                        "text-4xl font-mono font-bold w-32 transition-colors",
                        timeLeft <= 5 ? "text-red-500 animate-pulse" : "text-white"
                    )}>
                        {timeLeft}<span className="text-sm text-slate-500">s</span>
                    </div>
                </div>

                <div className="text-right">
                    <button
                        onClick={() => {
                            clearInterval(timerRef.current);
                            setGameState("idle");
                        }}
                        className="p-3 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col">

                <div className={cn(
                    "absolute inset-0 z-10 pointer-events-none transition-opacity duration-200",
                    feedback === "correct" ? "bg-emerald-500/10 opacity-100" : "opacity-0",
                    feedback === "wrong" ? "bg-red-500/10 opacity-100" : ""
                )} />

                <AnimatePresence mode="wait">

                    {gameState === "idle" && (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm p-8 text-center"
                        >
                            <h2 className="text-3xl font-bold text-white mb-4">Stroop Effect Test</h2>
                            <p className="text-slate-400 mb-8 max-w-md">
                                Click the button that matches the <strong className="text-white">INK COLOR</strong> of the word shown. Ignore what the word actually says.
                            </p>

                            <button
                                onClick={startGame}
                                className="group px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start Test
                            </button>
                        </motion.div>
                    )}

                    {gameState === "won" && (
                        <motion.div
                            key="won"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md p-8 text-center"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                                <Trophy className="w-10 h-10 text-emerald-400" />
                            </div>

                            <h2 className="text-4xl font-bold text-white mb-2">Time's Up!</h2>
                            <p className="text-slate-400 mb-8">Test Completed</p>

                            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-10 min-w-[200px]">
                                <div className="text-slate-500 text-xs uppercase font-bold mb-1">Final Score</div>
                                <div className="text-5xl font-mono font-bold text-white">{score}</div>
                            </div>

                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-500 transition-colors"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex-1 flex flex-col items-center justify-center p-8">
                    {currentChallenge && (
                        <motion.div
                            key={score}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-7xl md:text-8xl font-black tracking-tight mb-12 select-none"
                            style={{ color: currentChallenge.inkColor }}
                        >
                            {currentChallenge.word}
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-2 p-4 bg-slate-800/50 border-t border-white/5">
                    {COLORS.map((color) => (
                        <button
                            key={color.name}
                            onClick={() => handleAnswer(color.name)}
                            disabled={gameState !== "playing"}
                            className="h-16 rounded-xl font-bold text-white/90 text-sm md:text-base tracking-wide transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                            style={{ backgroundColor: color.hex }}
                        >
                            {color.name}
                        </button>
                    ))}
                </div>

            </div>

            <div className="mt-8 text-center max-w-md">
                <h3 className="text-white font-semibold mb-2 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                    Instructions
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                    Your brain wants to read the word. <strong>Don't let it.</strong> <br/>
                    Look at the color of the text and press the matching button below.
                </p>
            </div>

        </div>
    );
}