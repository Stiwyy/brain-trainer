import {
    Grid3x3,
    Palette,
    Zap,
    BrainCircuit,
    Calculator
} from "lucide-react";

export const games = [
    {
        id: "schulte",
        title: "Schulte Table",
        description: "Expand your peripheral vision and speed reading capabilities.",
        icon: Grid3x3,
        color: "from-blue-500 to-cyan-400",
        href: "/schulte",
        delay: 0.1,
    },
    {
        id: "stroop",
        title: "Stroop Test",
        description: "Challenge your cognitive flexibility and selective attention.",
        icon: Palette,
        color: "from-purple-500 to-pink-500",
        href: "/stroop",
        delay: 0.2,
    },
    {
        id: "reaction",
        title: "Reaction Time",
        description: "Test your central nervous system's processing speed.",
        icon: Zap,
        color: "from-amber-400 to-orange-500",
        href: "/reaction",
        delay: 0.3,
    },
    {
        id: "nback",
        title: "N-Back",
        description: "The gold standard for improving fluid intelligence and working memory.",
        icon: BrainCircuit,
        color: "from-emerald-400 to-green-600",
        href: "/n-back",
        delay: 0.4,
    },
    {
        id: "arithmetic",
        title: "Mental Arithmetic",
        description: "Enhance numerical fluency under time pressure.",
        icon: Calculator,
        color: "from-rose-500 to-red-600",
        href: "/arithmetic",
        delay: 0.5,
    },
];