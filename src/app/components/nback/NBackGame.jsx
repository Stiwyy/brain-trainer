"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Play, Volume2, Grid3x3, Trophy, CheckCircle2 } from "lucide-react";
import { cn } from "../../lib/utils";

const N_FACTOR = 2;
const TRIALS = 25;
const BLOCKS = 3;
const STIMULUS_DURATION = 760;
const TOTAL_CYCLE = 2760;

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'H', 'I', 'K', 'L', 'M', 'O', 'P', 'R', 'S', 'T'];
const POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export default function DualNBackGame() {
    const [gameState, setGameState] = useState("idle");
    const [currentBlock, setCurrentBlock] = useState(1);
    const [currentTrial, setCurrentTrial] = useState(0);

    const [activePosition, setActivePosition] = useState(null);
    const [activeLetter, setActiveLetter] = useState(null);
    const [isStimulusVisible, setIsStimulusVisible] = useState(false);

    const [positionSeq, setPositionSeq] = useState([]);
    const [audioSeq, setAudioSeq] = useState([]);

    const [response, setResponse] = useState({
        positionClicked: false,
        audioClicked: false
    });

    const [feedback, setFeedback] = useState({ pos: null, audio: null });

    const [score, setScore] = useState({
        posHits: 0,
        posMistakes: 0,
        audioHits: 0,
        audioMistakes: 0
    });

    const cycleTimer = useRef(null);
    const hideTimer = useRef(null);

    const speakLetter = (letter) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(letter);

        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
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

    const startBlock = () => {
        const { pSeq, aSeq } = generateSequences();
        setPositionSeq(pSeq);
        setAudioSeq(aSeq);
        setCurrentTrial(0);
        setGameState("playing");

        setTimeout(() => {
            runTrial(0, pSeq, aSeq);
        }, 1000);
    };

    const runTrial = useCallback((index, pSeq, aSeq) => {
        setResponse({ positionClicked: false, audioClicked: false });
        setFeedback({ pos: null, audio: null });

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
        if (index < TRIALS - 1) {
            setCurrentTrial(index + 1);
            runTrial(index + 1, pSeq, aSeq);
        } else {
            endBlock();
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
        setCurrentBlock(prev => prev + 1);
        startBlock();
    };

    const handlePositionMatch = () => {
        if (gameState !== "playing" || response.positionClicked) return;

        setResponse(prev => ({ ...prev, positionClicked: true }));

        const isMatch = currentTrial >= N_FACTOR && positionSeq[currentTrial] === positionSeq[currentTrial - N_FACTOR];

        if (isMatch) {
            setScore(s => ({ ...s, posHits: s.posHits + 1 }));
            setFeedback(prev => ({ ...prev, pos: 'correct' }));
        } else {
            setScore(s => ({ ...s, posMistakes: s.posMistakes + 1 }));
            setFeedback(prev => ({ ...prev, pos: 'wrong' }));
        }
        setTimeout(() => setFeedback(prev => ({ ...prev, pos: null })), 500);
    };

    const handleAudioMatch = () => {
        if (gameState !== "playing" || response.audioClicked) return;

        setResponse(prev => ({ ...prev, audioClicked: true }));

        const isMatch = currentTrial >= N_FACTOR && audioSeq[currentTrial] === audioSeq[currentTrial - N_FACTOR];

        if (isMatch) {
            setScore(s => ({ ...s, audioHits: s.audioHits + 1 }));
            setFeedback(prev => ({ ...prev, audio: 'correct' }));
        } else {
            setScore(s => ({ ...s, audioMistakes: s.audioMistakes + 1 }));
            setFeedback(prev => ({ ...prev, audio: 'wrong' }));
        }
        setTimeout(() => setFeedback(prev => ({ ...prev, audio: null })), 500);
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (gameState !== "playing") return;
            if (e.code === "KeyA") handleAudioMatch();
            if (e.code === "KeyL") handlePositionMatch();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, currentTrial, response, positionSeq, audioSeq]);

    useEffect(() => {
        return () => {
            clearTimeout(cycleTimer.current);
            clearTimeout(hideTimer.current);
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Block</div>
                    <div className="text-2xl font-bold text-white">
                        {gameState === "finished" ? BLOCKS : currentBlock} <span className="text-slate-500">/ {BLOCKS}</span>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Trial</div>
                    <div className="text-2xl font-bold text-white">
                        {gameState === "playing" ? currentTrial + 1 : "-"}<span className="text-slate-500 text-lg"> / {TRIALS}</span>
                    </div>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center">
                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Level</div>
                    <div className="text-2xl font-bold text-emerald-400">
                        Dual {N_FACTOR}-Back
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start w-full">

                <div className="relative flex-1 w-full aspect-square max-w-[400px] mx-auto bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl p-4">

                    <AnimatePresence>
                        {gameState === "idle" && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                                <BrainCircuit className="w-16 h-16 text-emerald-400 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Dual N-Back</h2>
                                <p className="text-slate-400 text-sm mb-8">Remember Position AND Sound.</p>
                                <button onClick={startBlock} className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                    <Play className="w-4 h-4 fill-slate-900" /> Start
                                </button>
                            </motion.div>
                        )}
                        {gameState === "blockBreak" && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Block Complete</h2>
                                <p className="text-slate-400 text-sm mb-8">Take a short breath.</p>
                                <button onClick={nextBlock} className="px-8 py-3 bg-emerald-500 text-white rounded-full font-bold hover:scale-105 transition-transform">
                                    Next Block
                                </button>
                            </motion.div>
                        )}
                        {gameState === "finished" && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-20 bg-slate-900/90 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                                <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                                <h2 className="text-2xl font-bold text-white mb-2">Training Complete</h2>
                                <div className="grid grid-cols-2 gap-4 text-left w-full max-w-xs mb-8 bg-white/5 p-4 rounded-xl">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">Pos Hits</div>
                                        <div className="text-xl font-bold text-emerald-400">{score.posHits}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase">Audio Hits</div>
                                        <div className="text-xl font-bold text-blue-400">{score.audioHits}</div>
                                    </div>
                                </div>
                                <button onClick={() => window.location.reload()} className="px-8 py-3 bg-slate-700 text-white rounded-full font-bold hover:bg-slate-600 transition-colors">
                                    Finish
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-3 gap-3 h-full">
                        {POSITIONS.map((pos) => (
                            <div
                                key={pos}
                                className={cn(
                                    "rounded-xl border-2 transition-all duration-150",
                                    (gameState === "playing" && isStimulusVisible && activePosition === pos)
                                        ? "bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                                        : "bg-slate-800/50 border-white/5"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 w-full max-w-[400px] flex flex-col gap-4">

                    <div className="h-32 bg-slate-900/50 rounded-3xl border border-white/5 flex items-center justify-center mb-4">
                        {gameState === "playing" && isStimulusVisible ? (
                            <Volume2 className="w-16 h-16 text-blue-400 animate-pulse" />
                        ) : (
                            <Volume2 className="w-16 h-16 text-slate-700" />
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handlePositionMatch}
                            className={cn(
                                "h-32 rounded-2xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all",
                                feedback.pos === "correct" ? "bg-emerald-500 border-emerald-700 text-white" :
                                    feedback.pos === "wrong" ? "bg-red-500 border-red-700 text-white" :
                                        "bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white"
                            )}
                        >
                            <Grid3x3 className="w-8 h-8 mb-2" />
                            <span className="font-bold text-lg">POSITION</span>
                            <span className="text-xs opacity-60 mt-1">(Press L)</span>
                        </button>

                        <button
                            onClick={handleAudioMatch}
                            className={cn(
                                "h-32 rounded-2xl flex flex-col items-center justify-center border-b-4 active:border-b-0 active:translate-y-1 transition-all",
                                feedback.audio === "correct" ? "bg-blue-500 border-blue-700 text-white" :
                                    feedback.audio === "wrong" ? "bg-red-500 border-red-700 text-white" :
                                        "bg-slate-700 border-slate-900 text-slate-300 hover:bg-slate-600 hover:text-white"
                            )}
                        >
                            <Volume2 className="w-8 h-8 mb-2" />
                            <span className="font-bold text-lg">AUDIO</span>
                            <span className="text-xs opacity-60 mt-1">(Press A)</span>
                        </button>
                    </div>

                    <div className="text-center text-slate-500 text-xs mt-2">
                        Match if stimulus is same as <strong>{N_FACTOR} steps ago</strong>.
                    </div>
                </div>

            </div>
        </div>
    );
}