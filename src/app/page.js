"use client";

import React from "react";
import { motion } from "framer-motion";
import Hero from "./components/Hero";
import GameCard from "./components/GameCard";
import { games } from "./data/games";

export default function Home() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-indigo-500/30">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

            <Hero />

            <section className="container mx-auto px-4 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {games.map((game) => (
                        <GameCard key={game.id} game={game} />
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col items-center justify-center p-8 rounded-3xl border border-dashed border-white/10 bg-white/5 text-center min-h-[300px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                            <span className="text-2xl">✨</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">More Not Coming Soon</h3>
                        <p className="text-slate-500 text-sm">We are not working on new modules.</p>
                    </motion.div>
                </div>
            </section>

            <footer className="border-t border-white/5 py-12 text-center text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Brain Trainer. All rights reserved.</p>
            </footer>
        </main>
    );
}