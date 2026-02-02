"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "../lib/utils";

export default function GameCard({ game }) {
    const Icon = game.icon;

    return (
        <Link href={game.href} className="block group h-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: game.delay, duration: 0.5 }}
                className="relative h-full p-8 rounded-3xl bg-slate-900/50 border border-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/10 hover:bg-slate-800/50 hover:-translate-y-1"
            >
                <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                    game.color
                )} />

                <div className="relative z-10 flex flex-col h-full">
                    <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br shadow-lg",
                        game.color
                    )}>
                        <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-colors">
                        {game.title}
                    </h3>

                    <p className="text-slate-400 leading-relaxed mb-8 flex-grow">
                        {game.description}
                    </p>

                    <div className="flex items-center text-sm font-medium text-slate-500 group-hover:text-white transition-colors">
                        <span>Play Now</span>
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}