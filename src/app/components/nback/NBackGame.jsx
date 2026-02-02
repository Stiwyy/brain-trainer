"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Play, RotateCcw, CheckCircle2, XCircle, Trophy, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const GRID_SIZE = 9;
const TOTAL_TURNS = 20 + 1;
const SPEED = 2500;

export default function NBackGame() {
    const [nLevel, setNLevel] = useState(2);

    const [gameState, setGameState] = useState("idle");
    const [sequence, setSequence] = useState([]);
    const [currentStep, setCurrentStep] = useState(-1);
    const [activeCell, setActiveCell] = useState(null);

    const [score, setScore] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [historyLog, setHistoryLog] = useState([]);

    const [hasClicked, setHasClicked] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const timeoutRef = useRef(null);

    const generateSequence = (n) => {
        const seq = [];
        for (let i = 0; i < TOTAL_TURNS; i++) {
            const shouldMatch = i >= n && Math.random() < 0.3;

            if (shouldMatch) {
                seq.push(seq[i - n]);
            } else {
                let rand = Math.floor(Math.random() * GRID_SIZE);
                if (i >= n && rand === seq[i - n]) {
                    rand = (rand + 1) % GRID_SIZE;
                }
                seq.push(rand);
            }
        }
        return seq;
    };

    const startGame = () => {
        const newSeq = generateSequence(nLevel);
        setSequence(newSeq);
        setScore(0);
        setMistakes(0);
        setCurrentStep(0);
        setHistoryLog([]);
        setGameState("playing");
        runTurn(0, newSeq);
    };

    const runTurn = useCallback((stepIndex, currentSeq) => {
        setHasClicked(false);
        setFeedback(null);

        setActiveCell(currentSeq[stepIndex]);

        setTimeout(() => {
            setActiveCell(null);
        }, SPEED - 500);

        timeoutRef.current = setTimeout(() => {
            handleTurnEnd(stepIndex, currentSeq);
        }, SPEED);

    }, [nLevel]);

    const handleTurnEnd = (stepIndex, currentSeq) => {
        const isMatch = stepIndex >= nLevel && currentSeq[stepIndex] === currentSeq[stepIndex - nLevel];

        if (isMatch) {
            setHistoryLog(prev => {
                const didAction = prev.some(h => h.step === stepIndex);
                if (!didAction) {
                    setMistakes(m => m + 1);
                    setFeedback("missed");
                }
                return prev;
            });
        }

        if (stepIndex < TOTAL_TURNS - 1) {
            setCurrentStep(stepIndex + 1);
            runTurn(stepIndex + 1, currentSeq);
        } else {
            endGame();
        }
    };

    const hasClickedRef = useRef(false);

    useEffect(() => {
        hasClickedRef.current = hasClicked;
    }, [hasClicked]);

    useEffect(() => {
        if (gameState !== "playing") return;

        const timer = setTimeout(() => {
            const isMatch = currentStep >= nLevel && sequence[currentStep] === sequence[currentStep - nLevel];

            if (isMatch && !hasClicked) {
                setMistakes(prev => prev + 1);
                setFeedback("missed");
                setTimeout(() => setFeedback(null), 500);
            }

            if (currentStep < sequence.length - 1) {
                setCurrentStep(prev => prev + 1);
                setHasClicked(false);
            } else {
                endGame();
            }

        }, SPEED);

        setActiveCell(sequence[currentStep]);
        const hideTimer = setTimeout(() => setActiveCell(null), SPEED - 800);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [currentStep, gameState]);


    const endGame = () => {
        setGameState("finished");
        setActiveCell(null);
    };

    const handleMatchClick = () => {
        if (gameState !== "playing" || hasClicked) return;

        setHasClicked(true);

        const isMatch = currentStep >= nLevel && sequence[currentStep] === sequence[currentStep - nLevel];

        if (isMatch) {
            setScore(prev => prev + 1);
            setFeedback("correct");
        } else {
            setMistakes(prev => prev + 1);
            setFeedback("wrong");
        }

        setTimeout(() => setFeedback(null), 500);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                handleMatchClick();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, currentStep, hasClicked]);


    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

            <div className="flex justify-between items-center w-full mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div>
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">N-Level</div>
                    <div className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">{nLevel}-Back</span>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Progress</div>
                    <div className="text-2xl font-mono font-bold text-white">
                        {gameState === "playing" ? currentStep + 1 : 0}<span className="text-slate-500 text-lg">/{TOTAL_TURNS}</span>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Score</div>
                    <div className="text-xl font-mono font-bold text-white">
                        {score} <span className="text-red-400 text-sm ml-1">({mistakes})</span>
                    </div>
                </div>
            </div>

            <div className="relative p-8 bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl">

                <AnimatePresence mode="wait">

                    {gameState === "idle" && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm rounded-3xl p-6 text-center"
                        >
                            <BrainCircuit className="w-16 h-16 text-emerald-400 mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-6">Configure Difficulty</h2>

                            <div className="flex items-center gap-4 mb-8">
                                <button
                                    onClick={() => setNLevel(Math.max(1, nLevel - 1))}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                >-</button>
                                <div className="text-4xl font-bold text-white w-12">{nLevel}</div>
                                <button
                                    onClick={() => setNLevel(Math.min(5, nLevel + 1))}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                                >+</button>
                            </div>

                            <button
                                onClick={startGame}
                                className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start Training
                            </button>
                        </motion.div>
                    )}

                    {gameState === "finished" && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm rounded-3xl p-6 text-center"
                        >
                            <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                            <h2 className="text-3xl font-bold text-white mb-2">Session Complete</h2>
                            <p className="text-slate-400 mb-6">{nLevel}-Back Challenge</p>

                            <div className="grid grid-cols-2 gap-4 w-full max-w-xs mb-8">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase">Correct</div>
                                    <div className="text-2xl font-bold text-emerald-400">{score}</div>
                                </div>
                                <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                                    <div className="text-xs text-slate-500 uppercase">Mistakes</div>
                                    <div className="text-2xl font-bold text-red-400">{mistakes}</div>
                                </div>
                            </div>

                            <button
                                onClick={() => setGameState("idle")}
                                className="px-8 py-3 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-500 transition-colors"
                            >
                                Play Again
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-20 h-20 md:w-24 md:h-24 rounded-xl border-2 transition-all duration-300",
                                activeCell === i
                                    ? "bg-emerald-500 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-105"
                                    : "bg-slate-800 border-white/5 scale-100"
                            )}
                        />
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        disabled={gameState !== "playing"}
                        onClick={handleMatchClick}
                        className={cn(
                            "w-full max-w-sm py-6 rounded-2xl font-black text-xl tracking-widest uppercase transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1",
                            feedback === "correct"
                                ? "bg-emerald-500 border-emerald-700 text-white"
                                : feedback === "wrong"
                                    ? "bg-red-500 border-red-700 text-white"
                                    : "bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white"
                        )}
                    >
                        {feedback === "correct" ? "MATCH!" : feedback === "wrong" ? "WRONG!" : "MATCH"}
                    </button>
                </div>

                <AnimatePresence>
                    {feedback === "missed" && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute top-4 left-0 w-full text-center"
                        >
                    <span className="px-4 py-2 bg-red-500/90 text-white text-sm font-bold rounded-full shadow-lg">
                        Missed Match!
                    </span>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            <div className="mt-8 text-center max-w-md text-slate-400 text-sm">
                <p>
                    Press <strong>MATCH</strong> (or Spacebar) when the current blue square is in the same position as it was <strong>{nLevel} steps ago</strong>.
                </p>
            </div>

        </div>
    );
}