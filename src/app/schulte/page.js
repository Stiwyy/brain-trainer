"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SchulteGame from "../components/schulte/SchulteGame";

export default function SchultePage() {
    return (
        <main className="min-h-screen bg-[#0B0C15] selection:bg-indigo-500/30 text-white relative">
            <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none z-50 mix-blend-overlay"></div>

            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 py-8">

                <nav className="flex items-center mb-12">
                    <Link
                        href="/"
                        className="flex items-center text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Link>
                </nav>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                        Schulte Table
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Train your visual attention and peripheral vision by finding numbers in ascending order.
                    </p>
                </div>

                <SchulteGame />

            </div>
        </main>
    );
}