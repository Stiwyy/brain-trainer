"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Play, RotateCcw, XCircle, Trophy, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

const INITIAL_TIME = 10.0;
const MIN_TIME = 1.5;

export default function ArithmeticGame() {
    const [gameState, setGameState] = useState("idle");
    const [score, setScore] = useState(0);

    const [maxTime, setMaxTime] = useState(INITIAL_TIME);
    const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);

    const [problem, setProblem] = useState({ str: "", ans: 0 });
    const [input, setInput] = useState("");

    const inputRef = useRef(null);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);

    const generateProblem = useCallback((currentScore) => {
        const difficulty = Math.floor(currentScore / 5) + 1;
        let num1, num2, operator, ans;

        const types = ['+'];
        if (difficulty > 1) types.push('-');
        if (difficulty > 3) types.push('*');
        if (difficulty > 6) types.push('/');

        operator = types[Math.floor(Math.random() * types.length)];

        if (operator === '+') {
            const max = difficulty * 10 + 10;
            num1 = Math.floor(Math.random() * max) + 1;
            num2 = Math.floor(Math.random() * max) + 1;
            ans = num1 + num2;
        } else if (operator === '-') {
            const max = difficulty * 10 + 10;
            num1 = Math.floor(Math.random() * max) + 5;
            num2 = Math.floor(Math.random() * num1);
            ans = num1 - num2;
        } else if (operator === '*') {
            const max = Math.min(12, difficulty + 2);
            num1 = Math.floor(Math.random() * max) + 2;
            num2 = Math.floor(Math.random() * max) + 2;
            ans = num1 * num2;
        } else {
            const max = Math.min(10, difficulty + 1);
            num2 = Math.floor(Math.random() * max) + 2;
            ans = Math.floor(Math.random() * 10) + 1;
            num1 = num2 * ans;
        }

        let symbol = operator;
        if (operator === '*') symbol = '×';
        if (operator === '/') symbol = '÷';

        setProblem({
            str: `${num1} ${symbol} ${num2}`,
            ans: ans
        });
    }, []);

    const startGame = () => {
        setScore(0);
        setMaxTime(INITIAL_TIME);
        setTimeLeft(INITIAL_TIME);
        setInput("");
        setGameState("playing");
        generateProblem(0);

        setTimeout(() => {
            inputRef.current?.focus();
            startTimeRef.current = performance.now();
            startTimer();
        }, 50);
    };

    const startTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                const newVal = prev - 0.05;
                if (newVal <= 0) {
                    clearInterval(timerRef.current);
                    endGame();
                    return 0;
                }
                return newVal;
            });
        }, 50);
    };

    const endGame = () => {
        setGameState("finished");
        clearInterval(timerRef.current);
        setInput("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (gameState !== "playing") return;

        const val = parseInt(input);

        if (val === problem.ans) {
            const newScore = score + 1;
            setScore(newScore);
            setInput("");

            const decayFactor = 0.95;
            const newMax = Math.max(MIN_TIME, maxTime * decayFactor);

            setMaxTime(newMax);
            setTimeLeft(newMax);

            generateProblem(newScore);
        } else {
            endGame();
        }
    };

    useEffect(() => {
        if (gameState === "playing") {
            const keepFocus = () => inputRef.current?.focus();
            document.addEventListener('click', keepFocus);
            return () => {
                document.removeEventListener('click', keepFocus);
                clearInterval(timerRef.current);
            };
        }
    }, [gameState]);

    const progressPercent = Math.max(0, (timeLeft / maxTime) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

            <div className="flex justify-between items-center w-full mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                        <div className="text-slate-400 text-xs uppercase font-bold">Time Limit</div>
                        <div className="text-2xl font-mono font-bold text-white">
                            {maxTime.toFixed(1)}s
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Calculator className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-right">
                        <div className="text-slate-400 text-xs uppercase font-bold">Streak</div>
                        <div className="text-2xl font-mono font-bold text-white">{score}</div>
                    </div>
                </div>
            </div>

            <div className="relative w-full aspect-[16/9] md:aspect-[2/1] bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">

                <div className="absolute top-0 left-0 w-full h-2 bg-slate-800">
                    <motion.div
                        className={cn(
                            "h-full transition-all duration-75 ease-linear",
                            progressPercent > 50 ? "bg-emerald-500" : progressPercent > 20 ? "bg-amber-500" : "bg-red-500"
                        )}
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">

                    {gameState === "idle" && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm text-center"
                        >
                            <Calculator className="w-20 h-20 text-amber-400 mb-6" />
                            <h2 className="text-3xl font-bold text-white mb-2">Sudden Death</h2>
                            <p className="text-slate-400 mb-8 text-lg max-w-sm">
                                One wrong answer and it's over. <br/>
                                Time gets shorter with every solve.
                            </p>
                            <button
                                onClick={startGame}
                                className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Play className="w-5 h-5 fill-slate-900" />
                                Start
                            </button>
                        </motion.div>
                    )}

                    {gameState === "finished" && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm text-center"
                        >
                            <XCircle className="w-20 h-20 text-red-500 mb-4" />
                            <h2 className="text-4xl font-bold text-white mb-2">Game Over</h2>
                            <div className="text-slate-400 mb-8 text-xl">
                                Streak: <span className="text-emerald-400 font-bold text-3xl ml-2">{score}</span>
                            </div>
                            <button
                                onClick={startGame}
                                className="px-8 py-3 bg-white/10 text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-colors flex items-center gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Try Again
                            </button>
                        </motion.div>
                    )}

                    {gameState === "playing" && (
                        <motion.div className="w-full max-w-md text-center z-10 mt-4">
                            <div className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-wider font-mono">
                                {problem.str}
                            </div>

                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    ref={inputRef}
                                    type="number"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    className="w-full bg-transparent border-b-4 border-slate-700 text-center text-5xl font-mono font-bold py-4 focus:outline-none focus:border-white transition-colors placeholder:text-slate-800 text-emerald-400"
                                    placeholder="?"
                                    autoFocus
                                />
                            </form>

                            <p className="mt-8 text-slate-500 text-sm">Type answer & Press Enter</p>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}