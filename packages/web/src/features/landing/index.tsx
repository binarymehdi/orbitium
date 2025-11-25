import HeroSection from "./hero";
import LandingNavigation from "./components/nav"

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <LandingNavigation />
      <HeroSection/>
    </div>
  );
}
