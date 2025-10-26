import type { ReactNode } from "react"
import Threads from "./threads"


interface HeroBgProps {
    children: ReactNode;
}

const HeroBg = ({ children }: HeroBgProps) => {
    return (
        <div className="min-h-screen w-full relative bg-white">

            {/* Dashed Grid */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
        linear-gradient(to right, #e7e5e4 1px, transparent 1px),
        linear-gradient(to bottom, #e7e5e4 1px, transparent 1px)
      `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 0",
                    maskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
                    WebkitMaskImage: `
        repeating-linear-gradient(
          to right,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        ),
        repeating-linear-gradient(
          to bottom,
          black 0px,
          black 3px,
          transparent 3px,
          transparent 8px
        )
      `,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                }}
            />

            {/* Dark Blue Threads - responsive for mobile */}
            <div className="absolute inset-x-0 bottom-40 sm:bottom-20 h-[30vh] sm:h-[50vh] md:h-[60vh] z-10 opacity-50 sm:opacity-50">
                <Threads
                    color={[0.7, 0.85, 0.95]}
                    amplitude={1.2}
                    distance={0.15}
                    enableMouseInteraction={false}
                />
            </div>

            {/* Content */}
            <div className="relative z-20 min-h-screen">
                {children}
            </div>
        </div>
    )
}

export default HeroBg