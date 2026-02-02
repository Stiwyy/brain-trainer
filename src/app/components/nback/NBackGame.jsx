"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Play, Volume2, Grid3x3, Trophy, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "../../lib/utils";

const N_FACTOR = 2;
const TRIALS = 25;
const BLOCKS = 3;
const STIMULUS_DURATION = 760;
const TOTAL_CYCLE = 2760;

const LETTERS = ["A", "B", "C", "D", "E", "H", "I", "K", "L", "M", "O", "P", "R", "S", "T"];
const POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function DualNBackGame() {
    const [gameState, setGameState] = useState("idle");
    const [currentBlock, setCurrentBlock] = useState(1);
    const [currentTrial, setCurrentTrial] = useState(0);
    const [countdown, setCountdown] = useState(null);

    const [activePosition, setActivePosition] = useState(null);
    const [activeLetter, setActiveLetter] = useState(null);
    const [isStimulusVisible, setIsStimulusVisible] = useState(false);

    const [positionSeq, setPositionSeq] = useState([]);
    const [audioSeq, setAudioSeq] = useState([]);

    const responseRef = useRef({ pos: false, audio: false });

    const [btnFeedback, setBtnFeedback] = useState({
        pos: null,
        audio: null,
    });

    const [score, setScore] = useState({
        posHits: 0,
        posMistakes: 0,
        audioHits: 0,
        audioMistakes: 0,
    });

    const cycleTimer = useRef(null);
    const hideTimer = useRef(null);
    const audioCtxRef = useRef(null);

    const playTone = (type) => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "correct") {
            osc.type = "sine";
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === "wrong") {
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === "missed") {
            osc.type = "triangle";
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.3);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        }
    };

    const speakLetter = (letter) => {
        if (typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.6;
        utterance.lang = "en-US";
        window.speechSynthesis.speak(utterance);
    };

    const generateSequences = () => {
        const pSeq = new Array(TRIALS).fill(null);
        const aSeq = new Array(TRIALS).fill(null);
        const targetCount = Math.floor(TRIALS * 0.3);

        for (let i = 0; i < TRIALS; i++) {
            pSeq[i] = POSITIONS[Math.floor(Math.random() * POSITIONS.length)];
            aSeq[i] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        }

        let pInjected = 0;
        while (pInjected < targetCount) {
            const idx = Math.floor(Math.random() * (TRIALS - N_FACTOR)) + N_FACTOR;
            pSeq[idx] = pSeq[idx - N_FACTOR];
            pInjected++;
        }

        let aInjected = 0;
        while (aInjected < targetCount) {
            const idx = Math.floor(Math.random() * (TRIALS - N_FACTOR)) + N_FACTOR;
            aSeq[idx] = aSeq[idx - N_FACTOR];
            aInjected++;
        }

        return { pSeq, aSeq };
    };

    const initBlock = () => {
        if (audioCtxRef.current?.state === "suspended") {
            audioCtxRef.current.resume();
        }
        setGameState("countdown");
        setCountdown(3);
        const { pSeq, aSeq } = generateSequences();
        setPositionSeq(pSeq);
        setAudioSeq(aSeq);
        setCurrentTrial(0);
        setScore({ posHits: 0, posMistakes: 0, audioHits: 0, audioMistakes: 0 });
    };

    useEffect(() => {
        if (gameState === "countdown" && countdown !== null) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                setGameState("playing");
                setCountdown(null);
                runTrial(0, positionSeq, audioSeq);
            }
        }
    }, [gameState, countdown, positionSeq, audioSeq]);

    const runTrial = useCallback((index, pSeq, aSeq) => {
        responseRef.current = { pos: false, audio: false };
        setBtnFeedback({ pos: null, audio: null });

        const pos = pSeq[index];
        const letter = aSeq[index];

        setActivePosition(pos);
        setActiveLetter(letter);
        setIsStimulusVisible(true);
        speakLetter(letter);

        hideTimer.current = setTimeout(() => {
            setIsStimulusVisible(false);
            setActivePosition(null);
        }, STIMULUS_DURATION);

        cycleTimer.current = setTimeout(() => {
            finishTrial(index, pSeq, aSeq);
        }, TOTAL_CYCLE);

    }, []);

    const finishTrial = (index, pSeq, aSeq) => {
        const isPosMatch = index >= N_FACTOR && pSeq[index] === pSeq[index - N_FACTOR];
        const isAudioMatch = index >= N_FACTOR && aSeq[index] === aSeq[index - N_FACTOR];

        let missedAny = false;

        if (isPosMatch && !responseRef.current.pos) {
            setScore((s) => ({ ...s, posMistakes: s.posMistakes + 1 }));
            setBtnFeedback((prev) => ({ ...prev, pos: "missed" }));
            setTimeout(() => setBtnFeedback((prev) => ({ ...prev, pos: null })), 500);
            missedAny = true;
        }

        if (isAudioMatch && !responseRef.current.audio) {
            setScore((s) => ({ ...s, audioMistakes: s.audioMistakes + 1 }));
            setBtnFeedback((prev) => ({ ...prev, audio: "missed" }));
            setTimeout(() => setBtnFeedback((prev) => ({ ...prev, audio: null })), 500);
            missedAny = true;
        }

        if (missedAny) {
            playTone("missed");
        }

        if (index < TRIALS - 1) {
            setCurrentTrial(index + 1);
            runTrial(index + 1, pSeq, aSeq);
        } else {
            setTimeout(endBlock, 1000);
        }
    };

    const endBlock = () => {
        setIsStimulusVisible(false);
        if (currentBlock < BLOCKS) {
            setGameState("blockBreak");
        } else {
            setGameState("finished");
        }
    };

    const nextBlock = () => {
        setCurrentBlock((prev) => prev + 1);
        initBlock();
    };

    const handlePositionMatch = () => {
        if (gameState !== "playing" || responseRef.current.pos) return;

        responseRef.current.pos = true;
        const isMatch =
            currentTrial >= N_FACTOR && positionSeq[currentTrial] === positionSeq[currentTrial - N_FACTOR];

        if (isMatch) {
            setScore((s) => ({ ...s, posHits: s.posHits + 1 }));
            setBtnFeedback((prev) => ({ ...prev, pos: "correct" }));
            playTone("correct");
        } else {
            setScore((s) => ({ ...s, posMistakes: s.posMistakes + 1 }));
            setBtnFeedback((prev) => ({ ...prev, pos: "wrong" }));
            playTone("wrong");
        }
        setTimeout(() => setBtnFeedback((prev) => ({ ...prev, pos: null })), 500);
    };

    const handleAudioMatch = () => {
        if (gameState !== "playing" || responseRef.current.audio) return;

        responseRef.current.audio = true;
        const isMatch = currentTrial >= N_FACTOR && audioSeq[currentTrial] === audioSeq[currentTrial - N_FACTOR];

        if (isMatch) {
            setScore((s) => ({ ...s, audioHits: s.audioHits + 1 }));
            setBtnFeedback((prev) => ({ ...prev, audio: "correct" }));
            playTone("correct");
        } else {
            setScore((s) => ({ ...s, audioMistakes: s.audioMistakes + 1 }));
            setBtnFeedback((prev) => ({ ...prev, audio: "wrong" }));
            playTone("wrong");
        }
        setTimeout(() => setBtnFeedback((prev) => ({ ...prev, audio: null })), 500);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== "playing") return;
            if (e.code === "KeyA") handleAudioMatch();
            if (e.code === "KeyL") handlePositionMatch();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, currentTrial, positionSeq, audioSeq]);

    useEffect(() => {
        return () => {
            clearTimeout(cycleTimer.current);
            clearTimeout(hideTimer.current);
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 w-full">
                <div className="flex flex-col gap-4 w-full">
                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center h-20 sm:h-24 shadow-2xl">
                            <div className="text-slate-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                                Block
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-white">
                                {gameState === "finished" ? BLOCKS : currentBlock}{" "}
                                <span className="text-slate-500">/ {BLOCKS}</span>
                            </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center h-20 sm:h-24 shadow-2xl">
                            <div className="text-slate-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                                Trial
                            </div>
                            <div className="text-xl sm:text-2xl font-bold text-white">
                                {gameState === "playing" ? currentTrial + 1 : "-"}
                                <span className="text-slate-500 text-sm sm:text-lg"> / {TRIALS}</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full aspect-square bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl p-3 sm:p-4">
                        <AnimatePresence>
                            {gameState === "idle" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-5 sm:p-6 text-center"
                                >
                                    <BrainCircuit className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-400 mb-4" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Dual N-Back</h2>
                                    <p className="text-slate-400 text-sm mb-6">Match Position and Audio 2 steps back.</p>
                                    <button
                                        onClick={initBlock}
                                        className="px-7 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                                    >
                                        <Play className="w-4 h-4 fill-slate-900" /> Start
                                    </button>
                                </motion.div>
                            )}

                            {gameState === "countdown" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center"
                                >
                                    <div className="text-6xl sm:text-8xl font-black text-white animate-pulse">
                                        {countdown}
                                    </div>
                                    <p className="text-slate-400 mt-4 uppercase tracking-widest text-sm sm:text-base">
                                        Get Ready
                                    </p>
                                </motion.div>
                            )}

                            {gameState === "blockBreak" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-5 sm:p-6 text-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-400 mb-3 sm:mb-4" />
                                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Block Complete</h2>
                                    <button
                                        onClick={nextBlock}
                                        className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold hover:scale-105 transition-transform"
                                    >
                                        Next Block
                                    </button>
                                </motion.div>
                            )}
                            {gameState === "finished" && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-5 sm:p-6 text-center"
                                >
                                    <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-400 mb-4" />
                                    <h2 className="text-2xl font-bold text-white mb-2">Training Complete</h2>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 text-left w-full max-w-xs mb-8 bg-white/5 p-4 rounded-xl">
                                        <div>
                                            <div className="text-[10px] sm:text-xs text-slate-500 uppercase">Pos Score</div>
                                            <div className="text-lg sm:text-xl font-bold text-emerald-400">
                                                {score.posHits}{" "}
                                                <span className="text-xs sm:text-sm text-slate-500">/ {score.posMistakes}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[10px] sm:text-xs text-slate-500 uppercase">Audio Score</div>
                                            <div className="text-lg sm:text-xl font-bold text-blue-400">
                                                {score.audioHits}{" "}
                                                <span className="text-xs sm:text-sm text-slate-500">/ {score.audioMistakes}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-8 py-3 bg-slate-700 text-white rounded-full font-bold hover:bg-slate-600 transition-colors"
                                    >
                                        Finish
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-3 gap-2 sm:gap-3 h-full">
                            {POSITIONS.map((pos) => (
                                <div
                                    key={pos}
                                    className={cn(
                                        "rounded-xl border-2 transition-all duration-150",
                                        gameState === "playing" && isStimulusVisible && activePosition === pos
                                            ? "bg-emerald-500 border-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.55)]"
                                            : "bg-slate-800/50 border-white/5"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center h-20 sm:h-24 w-full shadow-2xl">
                        <div className="text-slate-400 text-[11px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
                            Level
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-emerald-400">Dual {N_FACTOR}-Back</div>
                    </div>

                    <div className="h-28 sm:h-32 bg-slate-900/50 rounded-3xl border border-white/5 flex items-center justify-center w-full shadow-2xl">
                        {gameState === "playing" && isStimulusVisible ? (
                            <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400 animate-pulse" />
                        ) : (
                            <Volume2 className="w-12 h-12 sm:w-16 sm:h-16 text-slate-700" />
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
                        <button
                            onClick={handlePositionMatch}
                            className={cn(
                                "relative h-24 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all overflow-hidden shadow-2xl px-4",
                                btnFeedback.pos === "correct"
                                    ? "bg-emerald-500 border-emerald-700 text-white"
                                    : btnFeedback.pos === "wrong"
                                        ? "bg-red-500 border-red-700 text-white"
                                        : btnFeedback.pos === "missed"
                                            ? "bg-amber-500 border-amber-700 text-white"
                                            : "bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white"
                            )}
                        >
                            <AnimatePresence>
                                {btnFeedback.pos && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 px-2 text-center"
                                    >
                                        <span className="font-black text-lg sm:text-xl uppercase tracking-widest drop-shadow-md">
                                            {btnFeedback.pos === "missed"
                                                ? "MISSED!"
                                                : btnFeedback.pos === "correct"
                                                    ? "GOOD!"
                                                    : "WRONG"}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Grid3x3 className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                            <span className="font-bold text-base sm:text-lg">POSITION</span>
                            <span className="text-[11px] sm:text-xs opacity-60 mt-1">(Press L)</span>
                        </button>

                        <button
                            onClick={handleAudioMatch}
                            className={cn(
                                "relative h-24 sm:h-32 rounded-2xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all overflow-hidden shadow-2xl px-4",
                                btnFeedback.audio === "correct"
                                    ? "bg-blue-500 border-blue-700 text-white"
                                    : btnFeedback.audio === "wrong"
                                        ? "bg-red-500 border-red-700 text-white"
                                        : btnFeedback.audio === "missed"
                                            ? "bg-amber-500 border-amber-700 text-white"
                                            : "bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white"
                            )}
                        >
                            <AnimatePresence>
                                {btnFeedback.audio && (
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 px-2 text-center"
                                    >
                                        <span className="font-black text-lg sm:text-xl uppercase tracking-widest drop-shadow-md">
                                            {btnFeedback.audio === "missed"
                                                ? "MISSED!"
                                                : btnFeedback.audio === "correct"
                                                    ? "GOOD!"
                                                    : "WRONG"}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <Volume2 className="w-7 h-7 sm:w-8 sm:h-8 mb-1 sm:mb-2" />
                            <span className="font-bold text-base sm:text-lg">AUDIO</span>
                            <span className="text-[11px] sm:text-xs opacity-60 mt-1">(Press A)</span>
                        </button>
                    </div>

                    <div className="text-center text-slate-500 text-xs mt-2 w-full">
                        Green: Correct | Red: Wrong | Orange: Missed
                    </div>
                </div>
            </div>
        </div>
    );
}