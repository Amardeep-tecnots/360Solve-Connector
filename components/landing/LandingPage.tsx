"use client";

import { Navigation } from "./Navigation";
import { HeroSection } from "./HeroSection";
import { ProblemSolution } from "./ProblemSolution";
import { InteractiveDemo } from "./InteractiveDemo";
import { Features } from "./Features";
import { Pricing } from "./Pricing";
import { TechnicalCredibility } from "./TechnicalCredibility";
import { FinalCTA } from "./FinalCTA";
import { Footer } from "./Footer";

export const LandingPage = () => {
    return (
        <main className="min-h-screen bg-canvas selection:bg-[#DBEAFE] selection:text-[#3B82F6]">
            <Navigation />
            <HeroSection />
            <ProblemSolution />
            <InteractiveDemo />
            <Features />
            <Pricing />
            <TechnicalCredibility />
            <FinalCTA />
            <Footer />
        </main>
    );
};
