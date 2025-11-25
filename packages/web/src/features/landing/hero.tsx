import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import HeroBg from "./components/hero/hero-bg";

const HeroSection = () => {
    return (
        <HeroBg>
            <div className="relative min-h-screen px-4 sm:px-6 md:px-8 lg:px-[6%] bg-gradient-to-br pt-24 md:pt-32 lg:pt-20">
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-8rem)] text-center">
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm max-w-[90vw]">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-900 flex-shrink-0" />
                        <span className="text-[0.6rem] leading-tight sm:text-sm font-medium text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis">
                            Introducing Orbitium, Workflow Orchestrator Platform
                        </span>
                    </div>

                    <h1 className="max-w-5xl mb-4 sm:mb-6 text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight px-4">
                        <span className="text-gray-900">Build Powerful</span>
                        <br />
                        <span className="text-gray-900">
                            Computational Workflows
                        </span>
                        <br />
                        <span className="text-gray-900">In Minutes</span>
                    </h1>

                    <p className="max-w-3xl mb-8 sm:mb-10 text-md sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed px-4">
                        Build and orchestrate containerized, polyglot workflows with a simple drag-and-drop.
                        Runs locally and scale everywhere
                    </p>
                    <Link
                        to="/flows"
                        className="inline-flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white bg-sky-900 rounded-full shadow-lg hover:shadow-xl hover:bg-sky-950 transition-all duration-200"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </Link>
                </div>
            </div>
        </HeroBg>
    );
};

export default HeroSection;