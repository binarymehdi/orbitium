import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
    return (
        <div className="relative min-h-screen px-4 sm:px-6 md:px-[6%] bg-gradient-to-br pt-20 sm:pt-0">
            <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] sm:min-h-[calc(100vh-5rem)] text-center">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-900 flex-shrink-0" />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                        Introducing Orbitium, Workflow Orchestrator Platform
                    </span>
                </div>

                <h1 className="max-w-5xl mb-4 sm:mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight px-4">
                    <span className="text-gray-900">Build Powerful</span>
                    <br />
                    <span className="text-gray-900">
                        Computational Workflows
                    </span>
                    <br />
                    <span className="text-gray-900">In Minutes</span>
                </h1>

                <p className="max-w-3xl mb-8 sm:mb-10 text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
                    Build and orchestrate containerized, polyglot workflows with a simple drag-and-drop.
                    Runs locally and scale everywhere !
                </p>
                <Link
                    to="/initialize-flow"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3 text-sm sm:text-base font-semibold text-white bg-sky-900 rounded-full shadow-lg hover:shadow-xl hover:bg-sky-950 transition-all duration-200"
                >
                    Get Started
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
            </div>
        </div>
    );
};

export default HeroSection;